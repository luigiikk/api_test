import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../app/models/User';

export async function isAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };


    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }


    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado. Requer permissão de administrador' });
    }

   
    req.userId = user._id.toString();
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Não autorizado' });
  }
}