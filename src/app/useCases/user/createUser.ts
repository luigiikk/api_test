import { Request, Response } from "express";
import { User } from "../../models/User";

export async function createUser(req: Request, res: Response) {
  try {
    const { name, email, password, orders } = req.body;
    const user = await User.create({
      name,
      email,
      password,
      orders,
    });
    res.status(201).json(user);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}
