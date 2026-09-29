const express = require('express');
const router = express.Router();
const { addTransaction, getSummary } = require('../services/financeService');
const { generateToken, verifyToken } = require('../utils/jwt');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Akses ditolak' });

    try {
        req.user = verifyToken(token);
        next();
    } catch (err) {
        res.status(403).json({ error: 'Token tidak valid' });
    }
}

router.post('/auth/login', async (req, res) => {
    const { telegram_id } = req.body;
    if (!telegram_id) return res.status(400).json({ error: 'telegram_id wajib diisi' });

    const token = generateToken({ telegram_id });
    res.json({ token });
});

router.post('/webhook/income', authenticateToken, async (req, res) => {
    const { amount, category, description } = req.body;
    await addTransaction(req.user.telegram_id, 'income', amount, category || 'Pemasukan Web', description);
    res.json({ success: true, message: 'Pemasukan berhasil ditambahkan via API' });
});

router.post('/webhook/expense', authenticateToken, async (req, res) => {
    const { amount, category, description } = req.body;
    await addTransaction(req.user.telegram_id, 'expense', amount, category || 'Lainnya', description);
    res.json({ success: true, message: 'Pengeluaran berhasil ditambahkan via API' });
});

router.get('/dashboard/summary', authenticateToken, async (req, res) => {
    const summary = await getSummary(req.user.telegram_id);
    res.json(summary);
});

module.exports = router;