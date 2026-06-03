const { body, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors
        .array()
        .map((e) => e.msg)
        .join(". "),
    });
  }
  next();
};

const validateLead = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ max: 100 }).withMessage("Name cannot exceed 100 characters"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("phone")
    .trim()
    .notEmpty().withMessage("Phone number is required")
    .isLength({ max: 20 }).withMessage("Phone number cannot exceed 20 characters"),

  body("company")
    .trim()
    .notEmpty().withMessage("Company name is required")
    .isLength({ max: 100 }).withMessage("Company name cannot exceed 100 characters"),

  body("status")
    .optional()
    .isIn(["New", "Contacted", "Qualified", "Converted", "Lost"])
    .withMessage("Invalid status value"),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage("Notes cannot exceed 1000 characters"),

  handleValidationErrors,
];

const validateLeadUpdate = [
  body("name")
    .optional()
    .trim()
    .notEmpty().withMessage("Name cannot be empty")
    .isLength({ max: 100 }).withMessage("Name cannot exceed 100 characters"),

  body("email")
    .optional()
    .trim()
    .isEmail().withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("phone")
    .optional()
    .trim()
    .notEmpty().withMessage("Phone cannot be empty")
    .isLength({ max: 20 }).withMessage("Phone number cannot exceed 20 characters"),

  body("company")
    .optional()
    .trim()
    .notEmpty().withMessage("Company cannot be empty")
    .isLength({ max: 100 }).withMessage("Company name cannot exceed 100 characters"),

  body("status")
    .optional()
    .isIn(["New", "Contacted", "Qualified", "Converted", "Lost"])
    .withMessage("Invalid status value"),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage("Notes cannot exceed 1000 characters"),

  handleValidationErrors,
];

module.exports = { validateLead, validateLeadUpdate };
