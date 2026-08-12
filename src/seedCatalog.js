import sequelize from "./config/database.js"
import Category from "./models/Category.js"
import Product from "./models/Products.js"

// Edit this list — group products under the category they belong to.
// Add as many categories/products as you want; re-running this script is safe,
// findOrCreate skips anything that already exists.
const catalog = [
  {
    category: "Electronics",
    products: [
      "Samsung Galaxy A14",
      "iPhone 13",
      "HP Pavilion Laptop",
      "Sony Bluetooth Headphones",
      "Power Bank 20000mAh",
    ],
  },
  {
    category: "Fashion",
    products: [
      "Men's Cotton T-Shirt",
      "Women's Ankara Dress",
      "Leather Sneakers",
      "Denim Jacket",
    ],
  },
  {
    category: "Home & Kitchen",
    products: [
      "Non-Stick Frying Pan",
      "Electric Kettle",
      "Blender",
      "Bedsheet Set",
    ],
  },
]

async function seed() {
  try {
    await sequelize.authenticate();
    console.log("Connected to database.");

    for (const group of catalog) {
      const [category] = await Category.findOrCreate({
        where: { name: group.category },
      });

      for (const productName of group.products) {
        const [product, created] = await Product.findOrCreate({
          where: { name: productName },
          defaults: { category_id: category.id },
        });

        console.log(
          created
            ? `Created: ${product.name} (${group.category})`
            : `Already exists: ${product.name}`
        );
      }
    }

    console.log("Seeding complete.");
  } catch (error) {
    console.error("Seeding failed:", error);
  }
}

seed();