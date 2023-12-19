import express, { Request, Response } from "express";
import { Aluno } from "./models/aluno.model";
import { PrismaClient } from "@prisma/client";
import { AlunoController } from "./controllers/aluno.controller";

const app = express();
app.use(express.json());

const alunoController = new AlunoController();

app.post("/aluno", alunoController.criarAluno);

app.get("/aluno/:id", alunoController.obterAluno);

app.delete("/aluno/:id", alunoController.deletarAluno);

app.listen(3333, () => {
    console.log("Api está rodando");
});
