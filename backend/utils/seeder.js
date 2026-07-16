const dotenv = require('dotenv');
const User = require('../models/User');
const Ngo = require('../models/Ngo');
const Campaign = require('../models/Campaign');
const { connectDB } = require('../config/db.config');

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    await User.deleteMany({});
    await Ngo.deleteMany({});
    await Campaign.deleteMany({});

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      isVerified: true,
    });

    const users = await User.create([
      { name: 'John Doe', email: 'john@example.com', password: 'john123', isVerified: true },
      { name: 'Jane Smith', email: 'jane@example.com', password: 'jane123', isVerified: true },
    ]);

    const ngos = await Ngo.create([
      {
        ngoName: 'Help India',
        ownerName: 'Raj Singh',
        email: 'help@example.com',
        phone: '9876543210',
        description: 'NGO focused on education and healthcare',
        status: 'approved',
        verifiedBy: admin._id,
      },
      {
        ngoName: 'Save Lives',
        ownerName: 'Priya Sharma',
        email: 'savelives@example.com',
        phone: '9123456789',
        description: 'NGO focused on medical aid',
        status: 'approved',
        verifiedBy: admin._id,
      },
    ]);

    await Campaign.create([
      {
        title: 'Build a School',
        description: 'Help us build a school in rural areas',
        goalAmount: 500000,
        raisedAmount: 250000,
        category: 'education',
        location: 'Madhya Pradesh',
        ngoId: ngos[0]._id,
        status: 'active',
      },
      {
        title: 'Medical Camp',
        description: 'Free medical checkup for underprivileged',
        goalAmount: 100000,
        raisedAmount: 75000,
        category: 'medical',
        location: 'Bihar',
        ngoId: ngos[1]._id,
        status: 'active',
      },
    ]);

    console.log('✓ Database seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('✗ Seeding failed', err);
    process.exit(1);
  }
};

seedDatabase();
