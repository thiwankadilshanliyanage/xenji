import User from "../models/User.js";
import Service from "../models/Service.js";
import ContactMessage from "../models/ContactMessage.js";
import Report from "../models/Report.js";
import AuditLog from "../models/AuditLog.js";

let appSettings = {
  siteName: "Xenji",
  supportEmail: "",
  supportPhone: "",
  defaultLanguage: "en",
  maintenanceMode: false,
  heroTitle: "Support platform for foreigners in Japan",
  heroSubtitle: "Find jobs, housing, daily life support and useful services.",
};

export const dashboard = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalServices,
      unreadContactMessages,
      pendingReports,
      publishedServices,
      draftServices,
      archivedServices,
      recentServices,
      servicesByCategory,
      monthlyUsers,
    ] = await Promise.all([
      User.countDocuments(),
      Service.countDocuments(),
      ContactMessage.countDocuments({ isRead: false }),
      Report.countDocuments({ status: "pending" }),
      Service.countDocuments({ status: "published" }),
      Service.countDocuments({ status: "draft" }),
      Service.countDocuments({ status: "archived" }),
      Service.find()
        .sort("-createdAt")
        .limit(5)
        .select("title category status createdAt"),
      Service.aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            category: "$_id",
            count: 1,
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
        {
          $limit: 8,
        },
      ]),
      User.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            users: { $sum: 1 },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
        {
          $limit: 12,
        },
      ]),
    ]);

    const monthNames = [
      "",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalServices,
        unreadContactMessages,
        pendingReports,
      },
      charts: {
        monthlyUsers: monthlyUsers.map((item) => ({
          month: `${monthNames[item._id.month]} ${item._id.year}`,
          users: item.users,
        })),
        serviceStatus: [
          { name: "Published", value: publishedServices },
          { name: "Draft", value: draftServices },
          { name: "Archived", value: archivedServices },
        ],
        servicesByCategory,
      },
      recentServices,
    });
  } catch (error) {
    next(error);
  }
};

export const listUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select("-password -emailVerificationToken -passwordResetToken")
      .sort("-createdAt");

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
};

export const blockUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: true },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      message: "User blocked",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const unblockUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: false },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      message: "User unblocked",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "User deleted",
    });
  } catch (error) {
    next(error);
  }
};

export const listMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort("-createdAt");

    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

export const markMessageRead = async (req, res, next) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    res.json({
      success: true,
      message,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Message deleted",
    });
  } catch (error) {
    next(error);
  }
};

export const listReports = async (req, res, next) => {
  try {
    const reports = await Report.find()
      .populate("user", "name email")
      .sort("-createdAt");

    res.json({
      success: true,
      reports,
    });
  } catch (error) {
    next(error);
  }
};

export const updateReportStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["pending", "reviewed", "resolved"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report status",
      });
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({
      success: true,
      report,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReport = async (req, res, next) => {
  try {
    await Report.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Report deleted",
    });
  } catch (error) {
    next(error);
  }
};

export const getSettings = async (req, res, next) => {
  try {
    res.json({
      success: true,
      settings: appSettings,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    appSettings = {
      ...appSettings,
      ...req.body,
    };

    res.json({
      success: true,
      message: "Settings saved",
      settings: appSettings,
    });
  } catch (error) {
    next(error);
  }
};

export const auditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find()
      .populate("adminId", "name email")
      .sort("-createdAt")
      .limit(100);

    res.json({
      success: true,
      logs,
    });
  } catch (error) {
    next(error);
  }
};