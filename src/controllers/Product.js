import Product from "../models/Products.js"
import StoreProduct from "../models/StoreProduct.js"
import Store from "../models/Store.js"
import Category from "../models/Category.js"

export async function addProductToStore(req, res) {
  try {
    const { store_id, category_id, product_name, price, quantity, description, image_url } = req.body;

    if (!store_id || !category_id || !product_name || quantity === undefined 
        || price === undefined) {
      return res.status(400).json({ message: "store_id, category_id, product_name and price are required" });
    }

    // ownership check — the store being added to must actually belong to this user
    const store = await Store.findOne({ where: { id: store_id, owner_id: req.user.id } });
    if (!store) {
      return res.status(403).json({ message: "You don't own this store" });
    }

    // category must already exist — store owners pick from the fixed list, they don't create categories
    const category = await Category.findByPk(category_id);
    if (!category) {
      return res.status(400).json({ message: "Invalid category_id" });
    }

    // find the product by name, or create it under this category if it doesn't exist yet
    let product = await Product.findOne({ where: { name: product_name } });
    if (!product) {
      product = await Product.create({ name: product_name, category_id: category.id });
    }

    // prevent the same store from listing the same product twice
    const alreadyListed = await StoreProduct.findOne({
      where: { store_id, product_id: product.id },
    });
    if (alreadyListed) {
      return res.status(409).json({ message: "This product is already listed in your store" });
    }

    const listing = await StoreProduct.create({
      store_id,
      product_id: product.id,
      price,
      quantity: quantity || 0,
      description,
      image_url,
    });

    return res.status(201).json(listing);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to add product to store" });
  }
}

export async function getProductCatalog(req, res) {
  try {
    const products = await Product.findAll({
      include: [{ model: Category, attributes: ["id", "name"] }],
    });

    return res.json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch product catalog" });
  }
}

export async function getAllProducts(req, res) {

    const store = await Store.findAll({where: {owner_id: req.user.id}})

  try {
    const listings = await StoreProduct.findAll({
      include: [
        { model: Product, attributes: ["id", "name"], include: [{ model: Category, attributes: ["id", "name"] }] },
        { model: Store, attributes: ["id", "name", "slug"] },
      ],
    });

    return res.json(listings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch products" });
  }
}

export async function getStoreProducts(req, res) {
  try {
    const { store_id } = req.params;

    const listings = await StoreProduct.findAll({
      where: { store_id },
      include: [{ model: Product, attributes: ["id", "name"] }],
    });

    return res.json(listings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch store products" });
  }
}