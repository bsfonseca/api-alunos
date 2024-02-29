import express from "express";

import { LoginController } from "./controllers/login.controller";
import { alunoRoutes } from "./routes/aluno.routes";
import { avaliacaoRoutes } from "./routes/avaliacao.routes";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

// Instâncias

const loginController = new LoginController();

// Rotas de aluno
app.use("/aluno", alunoRoutes());

//Rotas de autenticação
app.post("/login", loginController.login);

app.listen(3333, () => {
    console.log("Api está rodando");
});
