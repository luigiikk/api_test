import { Request, Response } from "express";
import { User } from "../../models/User";

export async function listUsers(req: Request, res: Response) {
  try {
    const users = await User.find();
    res.json(users);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}
