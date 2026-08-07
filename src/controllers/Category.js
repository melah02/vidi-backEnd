import Category from "../models/Category.js"

export async function getAllCategories(req, res) {
  try {
    const categories = await Category.findAll();
    return res.json(categories);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch categories" });
  }
}

// admin-only — not linked to any store-owner-facing route right now
export async function createCategory(req, res) {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const existing = await Category.findOne({ where: { name } });
    if (existing) {
      return res.status(409).json({ message: "Category already exists" });
    }

    const category = await Category.create({ name });
    return res.status(201).json(category);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create category" });
  }
}