const mongoose = require("mongoose");

const LEAD_STATUSES = ["New", "Contacted", "Qualified", "Converted", "Lost"];

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      maxlength: [20, "Phone number cannot exceed 20 characters"],
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },
    status: {
      type: String,
      enum: {
        values: LEAD_STATUSES,
        message: "{VALUE} is not a valid status",
      },
      default: "New",
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Index for text search across key fields
leadSchema.index({ name: "text", email: "text", company: "text" });

// Index for common sort/filter operations
leadSchema.index({ status: 1, createdAt: -1 });

const Lead = mongoose.model("Lead", leadSchema);

module.exports = Lead;
module.exports.LEAD_STATUSES = LEAD_STATUSES;
