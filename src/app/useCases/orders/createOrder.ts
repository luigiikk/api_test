import { Request, Response } from "express";
import { Order } from "../../models/Order";
import { User } from "../../models/User";
import { Product } from "../../models/Product"; // Importe o modelo de Produto

export async function createOrder(req: Request, res: Response) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    const { table, products } = req.body;

    // Calcular o total do pedido
    let total = 0;
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (product) {
        total += product.price * item.quantity;
      }
    }

    const order = await Order.create({
      table,
      products,
      user: userId,
      total // Adiciona o total calculado
    });

    await User.findByIdAndUpdate(userId, {
      $push: { orders: order._id }
    });

    res.status(201).json(order);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Erro ao criar o pedido" });
  }
}