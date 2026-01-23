// routes/users.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { authMiddleware, requireRole } = require("../middleware/auth");

// ✅ Promote user เป็น admin
router.put("/users/:id/promote", authMiddleware, requireRole("admin"), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: "admin" },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ ดึงรายชื่อผู้ใช้ทั้งหมด (เฉพาะ Admin)
router.get("/users", authMiddleware, requireRole("admin"), async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;