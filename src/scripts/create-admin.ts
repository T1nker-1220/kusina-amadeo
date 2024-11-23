const { connectToDatabase } = require('../lib/db');
const User = require('../models/user').default;
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  try {
    await connectToDatabase();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'kusinadeamadeo@gmail.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('kusina2022', 10);
    const adminUser = new User({
      email: 'kusinadeamadeo@gmail.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'admin',
    });

    await adminUser.save();
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    process.exit();
  }
}

createAdminUser();
