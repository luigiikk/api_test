import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const port = 3333;

const connectionString = process.env.CONNECTIONSTRING;

if (!connectionString) {
  throw new Error("A variável de ambiente CONNECTIONSTRING não está definida!");
}

mongoose
  .connect(connectionString)
  .then(() => {
    const app = express();
    app.get("/", (req, res) => {
      res.send("Olá mundo");
    });
    app.listen(port, () => {
      console.log(`Estou conectado na porta: ${port}`);
    });
  })
  .catch((error) => {
    console.error("Erro ao conectar ao MongoDB:", error);
  });
