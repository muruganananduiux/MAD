const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const Ngo = require('../models/Ngo');
const User = require('../models/User');

const createNgo = catchAsync(async (req, res) => {
  const { ngoName, ownerName, email, phone, description, address, panNumber, registrationNumber } = req.body;
  const ngoExists = await Ngo.findOne({ email });
  if (ngoExists) throw new ApiError(400, 'NGO already registered');
  const ngo = await Ngo.create({ ngoName, ownerName, email, phone, description, address, panNumber, registrationNumber });
  res.status(201).json({ success: true, message: 'NGO registered successfully', data: ngo });
});

const updateNgo = catchAsync(async (req, res) => {
  const { id } = req.params;
  const ngo = await Ngo.findByIdAndUpdate(id, req.body, { new: true });
  if (!ngo) throw new ApiError(404, 'NGO not found');
  res.json({ success: true, message: 'NGO updated', data: ngo });
});

const deleteNgo = catchAsync(async (req, res) => {
  const { id } = req.params;
  const ngo = await Ngo.findByIdAndDelete(id);
  if (!ngo) throw new ApiError(404, 'NGO not found');
  res.json({ success: true, message: 'NGO deleted' });
});

const getNgo = catchAsync(async (req, res) => {
  const { id } = req.params;
  const ngo = await Ngo.findById(id);
  if (!ngo) throw new ApiError(404, 'NGO not found');
  res.json({ success: true, message: 'NGO fetched', data: ngo });
});

const getAllNgos = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const filter = status ? { status } : {};
  const ngos = await Ngo.find(filter).limit(limit * 1).skip((page - 1) * limit);
  const total = await Ngo.countDocuments(filter);
  res.json({ success: true, message: 'NGOs fetched', data: { ngos, total, pages: Math.ceil(total / limit) } });
});

const approveNgo = catchAsync(async (req, res) => {
  const { id } = req.params;
  const ngo = await Ngo.findByIdAndUpdate(id, { status: 'approved', verifiedBy: req.userId }, { new: true });
  if (!ngo) throw new ApiError(404, 'NGO not found');
  res.json({ success: true, message: 'NGO approved', data: ngo });
});

const rejectNgo = catchAsync(async (req, res) => {
  const { id } = req.params;
  const ngo = await Ngo.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
  if (!ngo) throw new ApiError(404, 'NGO not found');
  res.json({ success: true, message: 'NGO rejected', data: ngo });
});

module.exports = { createNgo, updateNgo, deleteNgo, getNgo, getAllNgos, approveNgo, rejectNgo };
