export const validate = (rules = []) => {
  return (req, res, next) => {
    try {
      if (!Array.isArray(rules)) {
        return next();
      }

      const errors = [];

      rules.forEach((rule) => {
        if (rule.required && !req.body?.[rule.field]) {
          errors.push(`${rule.field} is required`);
        }
      });

      if (errors.length) {
        return res.status(400).json({
          success: false,
          message: errors.join(", "),
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};