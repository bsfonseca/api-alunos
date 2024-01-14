import { Router } from "express";
import { AlunoController } from "../controllers/aluno.controller";
import { validaEmailSenhaMiddleware } from "../middlewares/aluno.middleware";
import { validaLoginMiddleware } from "../middlewares/login.middleware";
import { avaliacaoRoutes } from "./avaliacao.routes";

export function alunoRoutes() {
    const router = Router();
    const alunoController = new AlunoController();

    router.post("/", [validaEmailSenhaMiddleware], alunoController.criarAluno);
    router.get("/:id", alunoController.obterAluno);
    router.get("/", alunoController.listarAlunos);
    router.delete("/:id", [validaLoginMiddleware], alunoController.deletarAluno);
    router.put("/:id", [validaLoginMiddleware], alunoController.atualizarAluno);

    router.use("/:id/avaliacao", avaliacaoRoutes());

    return router;
}
