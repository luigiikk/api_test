import { Request, Response } from "express";
import { User } from "../../models/User";

export async function createUser(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;


    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Todos os campos são obrigatórios"
      });
    }


    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Formato de email inválido"
      });
    }


    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        message: "Este email já está cadastrado"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "A senha deve ter no mínimo 6 caracteres"
      });
    }


    if (name.length < 2) {
      return res.status(400).json({
        message: "O nome deve ter no mínimo 2 caracteres"
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password

    });


    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };

    res.status(201).json({
      message: "Usuário criado com sucesso",
      user: userResponse
    });

  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({
      message: "Erro interno do servidor"
    });
  }
}