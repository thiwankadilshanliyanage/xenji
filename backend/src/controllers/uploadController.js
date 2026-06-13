export const uploadServiceThumbnail = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image required",
      });
    }

    res.json({
      success: true,
      imageUrl: req.file.path,
    });
  } catch (error) {
    next(error);
  }
};