import { Router } from "express";
import { AvaliacaoController } from "../controllers/avaliacao.controller";
import { validaLoginMiddleware } from "../middlewares/login.middleware";

export function avaliacaoRoutes() {
    const router = Router({
        mergeParams: true,
    });

    const avaliacaoController = new AvaliacaoController();

    router.post("/", [validaLoginMiddleware], avaliacaoController.criarAvaliacao);
    router.get("/", [validaLoginMiddleware], avaliacaoController.listarAvaliacoes);
    router.put("/:idAvaliacao", [validaLoginMiddleware], avaliacaoController.atualizarAvaliacao);

    return router;
}
