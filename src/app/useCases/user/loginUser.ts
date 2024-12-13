import { Request, Response } from "express";
import { User } from "../../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;


    if (!email || !password) {
      return res.status(400).json({
        message: "Email e senha são obrigatórios"
      });
    }


    const user = await User.findOne({ email });


    if (!user) {
      return res.status(401).json({
        message: "Email ou senha inválidos"
      });
    }


    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Email ou senha inválidos"
      });
    }


    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email
      },
      process.env.JWT_SECRET || 'sua-chave-secreta',
      {
        expiresIn: '24h'
      }
    );


    const userWithoutPassword = {
      _id: user._id,
      name: user.name,
      email: user.email,
      orders: user.orders,
      role: user.role 
    };


    res.status(200).json({
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({
      message: "Erro interno do servidor"
    });
  }
}