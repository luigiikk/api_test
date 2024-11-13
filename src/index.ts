import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "node:path";
import cors from 'cors'; // Adicione esta linha
import { router } from "./router";
dotenv.config();

const connectionString = process.env.CONNECTIONSTRING;

if (!connectionString) {
  throw new Error("A variável de ambiente CONNECTIONSTRING não está definida!");
}

mongoose
  .connect(connectionString)
  .then(() => {
    const app = express();
    const port = 5555;

    // Configuração do CORS - adicione antes das outras configurações
    app.use(cors({
      origin: 'http://localhost:3000', // URL do seu frontend
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    app.use('/uploads', express.static(path.resolve(__dirname, "..", "uploads")))
    app.use(express.json());
    app.use(router);
    app.listen(process.env.PORT ?? port, () => {
      console.log(`Estou conectado na porta: ${port}`);
    });
  })
  .catch((error) => {
    console.error("Erro ao conectar ao MongoDB:", error);
  });