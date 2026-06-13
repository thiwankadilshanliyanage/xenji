import Service from "../models/Service.js";
import Bookmark from "../models/Bookmark.js";

import { createSlug } from "../utils/createSlug.js";
import { logAudit } from "../services/auditLogService.js";
import { createGlobalNotification } from "../services/notificationService.js";

export const getServices = async (req, res, next) => {
  try {
    const {
      search = "",
      category = "",
      prefecture = "",
      city = "",
      language = "",
      featured = "",
      admin = "",
    } = req.query;

    const query = {};

    if (admin !== "true") {
      query.status = "published";
    }

    if (category) query.category = category;
    if (prefecture) query.prefecture = prefecture;
    if (city) query.city = city;

    if (featured === "true") {
      query.isFeatured = true;
    }

    if (language) {
      query.languagesSupported = {
        $regex: language,
        $options: "i",
      };
    }

    const cleanSearch = String(search || "").trim();

    if (cleanSearch) {
      const regex = new RegExp(cleanSearch, "i");

      query.$or = [
        { "title.en": regex },
        { "title.ja": regex },
        { "shortDescription.en": regex },
        { "shortDescription.ja": regex },
        { companyName: regex },
        { category: regex },
        { prefecture: regex },
        { city: regex },
      ];
    }

    const services = await Service.find(query).sort({
      isFeatured: -1,
      createdAt: -1,
    });

    res.json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    next(error);
  }
};

export const getService = async (req, res, next) => {
  try {
    const service = await Service.findOne({
      slug: req.params.slug,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const related = await Service.find({
      _id: { $ne: service._id },
      category: service.category,
      status: "published",
    }).limit(3);

    res.json({
      success: true,
      service,
      related,
    });
  } catch (error) {
    next(error);
  }
};

export const createService = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      createdBy: req.user._id,
      slug: createSlug(req.body.title?.en || "service"),
    };

    const service = await Service.create(data);

    await logAudit(
      req.user._id,
      "create",
      "service",
      service._id,
      "Created service"
    );

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    await logAudit(
      req.user._id,
      "update",
      "service",
      req.params.id,
      "Updated service"
    );

    res.json({
      success: true,
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    await logAudit(
      req.user._id,
      "delete",
      "service",
      req.params.id,
      "Deleted service"
    );

    res.json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const publishService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      {
        status: "published",
      },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    await createGlobalNotification({
      title: {
        en: "New service available",
        ja: "新しいサービス",
      },
      message: {
        en: service.title?.en || "",
        ja: service.title?.ja || "",
      },
      type: "service",
      link: `/services/${service.slug}`,
      createdBy: req.user._id,
    });

    res.json({
      success: true,
      message: "Service published successfully",
      service,
    });
  } catch (error) {
    next(error);
  }
};

export const featureService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    service.isFeatured = !service.isFeatured;

    await service.save();

    res.json({
      success: true,
      message: "Feature status updated",
      service,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleBookmarkService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const existingBookmark = await Bookmark.findOne({
      user: req.user._id,
      itemType: "Service",
      itemId: req.params.id,
    });

    if (existingBookmark) {
      await existingBookmark.deleteOne();

      return res.json({
        success: true,
        bookmarked: false,
        message: "Bookmark removed",
      });
    }

    await Bookmark.create({
      user: req.user._id,
      itemType: "Service",
      itemId: req.params.id,
    });

    res.status(201).json({
      success: true,
      bookmarked: true,
      message: "Service bookmarked",
    });
  } catch (error) {
    next(error);
  }
};