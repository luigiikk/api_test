import { Request, Response } from "express";
import { User } from "../../models/User";
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
}

export async function getUserProfile(req: Request, res: Response) {
  try {
    
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        message: "Token não fornecido"
      });
    }


    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        message: "Token inválido"
      });
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    if (!decoded) {
      return res.status(401).json({
        message: "Token inválido"
      });
    }


    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        message: "Usuário não encontrado"
      });
    }


    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };

    res.json(userResponse);

  } catch (error) {
    console.error('Erro ao buscar perfil do usuário:', error);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        message: "Token inválido"
      });
    }

    res.status(500).json({
      message: "Erro interno do servidor"
    });
  }
}