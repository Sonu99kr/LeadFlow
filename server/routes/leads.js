const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead");
const { validateLead, validateLeadUpdate } = require("../middleware/validate");

router.get("/", async (req, res, next) => {
  try {
    const {
      search = "",
      status,
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    if (search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { email: { $regex: search.trim(), $options: "i" } },
        { company: { $regex: search.trim(), $options: "i" } },
      ];
    }

    if (status && status !== "All") {
      query.status = status;
    }

    const allowedSortFields = [
      "name",
      "email",
      "company",
      "status",
      "createdAt",
    ];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [leads, total] = await Promise.all([
      Lead.find(query)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Lead.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/leads/stats — aggregated stats for the dashboard
router.get("/stats", async (req, res, next) => {
  try {
    const [statusCounts, totalLeads, recentLeads] = await Promise.all([
      Lead.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Lead.countDocuments(),
      Lead.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }),
    ]);

    const byStatus = {
      New: 0,
      Contacted: 0,
      Qualified: 0,
      Converted: 0,
      Lost: 0,
    };

    statusCounts.forEach(({ _id, count }) => {
      if (_id in byStatus) byStatus[_id] = count;
    });

    const conversionRate =
      totalLeads > 0 ? Math.round((byStatus.Converted / totalLeads) * 100) : 0;

    res.json({
      success: true,
      data: {
        total: totalLeads,
        recentLeads,
        conversionRate,
        byStatus,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/leads/:id — fetch a single lead
router.get("/:id", async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id).lean();

    if (!lead) {
      res.status(404);
      throw new Error("Lead not found");
    }

    res.json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
});

// POST /api/leads — create a new lead
router.post("/", validateLead, async (req, res, next) => {
  try {
    const { name, email, phone, company, status, notes } = req.body;

    const lead = await Lead.create({
      name,
      email,
      phone,
      company,
      status,
      notes,
    });

    res.status(201).json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
});

// PUT /api/leads/:id — update a lead
router.put("/:id", validateLeadUpdate, async (req, res, next) => {
  try {
    const { name, email, phone, company, status, notes } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, company, status, notes },
      { new: true, runValidators: true },
    ).lean();

    if (!lead) {
      res.status(404);
      throw new Error("Lead not found");
    }

    res.json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/leads/:id — delete a lead
router.delete("/:id", async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id).lean();

    if (!lead) {
      res.status(404);
      throw new Error("Lead not found");
    }

    res.json({ success: true, message: "Lead deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
