import { Request, Response } from "express";
import { Order } from "../../models/Order";

export async function listOrdersByUserId(req: Request, res: Response) {
  try {
    // Verifica se o userId está disponível (geralmente adicionado pelo middleware de autenticação)
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    // Busca os pedidos do usuário, ordenados pela data de criação mais recente
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 }) // Ordena do mais recente para o mais antigo
      .populate('products.product') // Popula os detalhes dos produtos
      .populate('user', 'name email'); // Opcionalmente, popula detalhes do usuário

    // Se nenhum pedido for encontrado, retorna um array vazio
    if (orders.length === 0) {
      return res.json([]);
    }

    res.json(orders);
  } catch (error) {
    console.error("Erro ao listar pedidos do usuário:", error);
    res.status(500).json({
      message: "Erro interno ao buscar pedidos",
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}