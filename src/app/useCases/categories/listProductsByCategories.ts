import { Request, Response } from "express";
import { Product } from "../../models/Product";

export async function listProductsByCategories(req: Request, res: Response) {
  try {
    const { categoryId } = req.params;
    const products = await Product.find().where('category').equals(categoryId);

    res.json(products);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}
