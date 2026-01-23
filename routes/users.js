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

router.put("/:id/toggle-active", async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body; // frontend ส่ง active: true/false

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ถ้าไม่ส่ง active มา → toggle จากค่าปัจจุบัน
    user.active = active !== undefined ? active : !user.active;

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


module.exports = router;