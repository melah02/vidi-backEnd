import Store from "../models/Store.js"

function makeSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createStore(req, res) {
  try {
    const { name, description, logo_url } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Store name is required" });
    }

    // req.user.id comes from the JWT via requireAuth — never trust a body-supplied owner_id
    const nameTaken = await Store.findOne({ where: { name } });
    if (nameTaken) {
      return res.status(409).json({ message: "That store name is already taken" });
    }

    const slug = makeSlug(name); // slug is unique too, but since name is now unique, slug can't collide either

    const store = await Store.create({
      owner_id: req.user.id,
      name,
      slug,
      description,
      logo_url,
    });

    return res.status(201).json(store);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create store" });
  }
}

export async function getMyStores(req, res) {
  try {
    const stores = await Store.findAll({ where: { owner_id: req.user.id } });
    return res.status(201).json({ success: true, stores });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch stores" });
  }
}