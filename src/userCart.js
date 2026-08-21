// scripts/backfillCarts.js
import User from '../src/models/User.js';
import Cart from '../src/models/Cart.js';
import sequelize from '../src/config/database.js';
import 'dotenv/config';

const run = async () => {
  try {
    await sequelize.authenticate();

    const users = await User.findAll();
    console.log(`Found ${users.length} users`);

    let created = 0;
    let skipped = 0;

    for (const user of users) {
      const existingCart = await Cart.findOne({ where: { user_id: user.id } });

      if (existingCart) {
        skipped++;
        continue;
      }

      await Cart.create({
        user_id: user.id,
        items: []
      });
      created++;
    }

    console.log(`Done. Created: ${created}, Skipped (already had cart): ${skipped}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();