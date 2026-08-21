import type { Request, Response, } from "express";
import Cart from "../models/Cart.js";
import StoreProduct from "../models/StoreProduct.js";
import type { CartItem } from "../types/cart.js";

interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { storeProductId, quantity } = req.body as {
      storeProductId: string;
      quantity: number;
    };

    if (!storeProductId || !quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "storeProductId and a valid quantity are required",
      });
    }

    const storeProduct = await StoreProduct.findByPk(storeProductId);
    if (!storeProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (storeProduct.quantity < quantity) {
      return res.status(400).json({ success: false, message: "Not enough stock available" });
    }

    const cart = await Cart.findOne({ where: { user_id: userId } });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const items: CartItem[] = cart.items || [];
    const existingItem = items.find((i) => i.storeProductId === storeProductId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.push({
        storeProductId,
        quantity,
        price: storeProduct.price,
      });
    }

    cart.items = items;
    cart.changed("items", true);
    await cart.save();

    return res.status(200).json({ success: true, cart });


  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const getCart = async (req: Request, res: Response) =>{
  try{
    const userId = req.user!.id;

    if(!userId) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const cart = await Cart.findOne({where: {user_id: userId } });

    if(!cart){
      return res.status(404).json({ success:false, message: "Cart not found" , cart: []});
    }

    return res.status(200).json({success: true, message:"Cart found", cart});

  }catch(error){
      console.log(error)
      return res.status(500).json({success: false, message: "internal server Error", cart: []})
  }


}