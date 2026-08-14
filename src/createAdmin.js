// scripts/createAdmin.js
import User from './models/User.js';
import sequelize from './config/database.js';

const run = async () => {
  try {
    await sequelize.authenticate();

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env first');
      process.exit(1);
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      console.log('User with this email already exists:', existing.email, '- role:', existing.role);
      process.exit(0);
    }

    const admin = await User.create({
      full_name: 'Admin',
      email,
      phone: '25454356667',
      password_hash: password, // plaintext in, hook hashes it — same as register()
      role: 'admin'
    });

    console.log('✅ Admin created:', admin.email);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();