const express = require('express');
const { createNgo, updateNgo, deleteNgo, getNgo, getAllNgos, approveNgo, rejectNgo } = require('../controllers/ngo.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', createNgo);
router.get('/', getAllNgos);
router.get('/:id', getNgo);
router.put('/:id', updateNgo);
router.delete('/:id', deleteNgo);
router.put('/:id/approve', authMiddleware, roleMiddleware('admin'), approveNgo);
router.put('/:id/reject', authMiddleware, roleMiddleware('admin'), rejectNgo);

module.exports = router;
