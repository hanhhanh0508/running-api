const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const verifyToken = require('../middleware/authMiddleware');

// POST /api/runs/:id/coordinates
// Lưu 1 toạ độ GPS vào bài chạy có id = :id
router.post('/:id/coordinates', verifyToken, async (req, res) => {
  try {
    const runId = parseInt(req.params.id, 10);
    const { latitude, longitude, timestamp } = req.body;

    // 1. Kiểm tra dữ liệu đầu vào
    if (Number.isNaN(runId)) {
      return res.status(400).json({ message: 'ID bài chạy không hợp lệ!' });
    }
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return res.status(400).json({ message: 'latitude và longitude phải là số!' });
    }
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json({ message: 'Toạ độ nằm ngoài phạm vi hợp lệ!' });
    }

    // 2. Chỉ cho lưu vào bài chạy của chính người đăng nhập
    const run = await pool.query(
      'SELECT id FROM runs WHERE id = $1 AND user_id = $2',
      [runId, req.user.userId]
    );
    if (run.rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy bài chạy!' });
    }

    // 3. Lưu toạ độ (nếu không gửi timestamp thì lấy giờ hiện tại)
    const result = await pool.query(
      `INSERT INTO run_coordinates (run_id, latitude, longitude, timestamp)
       VALUES ($1, $2, $3, COALESCE($4::timestamp, NOW()))
       RETURNING *`,
      [runId, latitude, longitude, timestamp || null]
    );

    res.status(201).json({
      message: 'Lưu toạ độ thành công!',
      coordinate: result.rows[0],
    });
  } catch (error) {
    console.error('Lỗi lưu toạ độ:', error);
    res.status(500).json({ message: 'Lỗi server khi lưu toạ độ!' });
  }
});

module.exports = router;