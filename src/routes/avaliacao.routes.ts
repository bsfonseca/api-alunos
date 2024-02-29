import { Router } from "express";
import { AvaliacaoController } from "../controllers/avaliacao.controller";
import { validaLoginMiddleware } from "../middlewares/login.middleware";
import { validarAcessoCriarAvaliacaoMid } from "../middlewares/autorizacao.middleware";
import { validaAcessoPuteDelteMid } from "../middlewares/autPuteDelete.middleware";

export function avaliacaoRoutes() {
    const router = Router({
        mergeParams: true,
    });

    const avaliacaoController = new AvaliacaoController();

    router.post("/", [validaLoginMiddleware, validarAcessoCriarAvaliacaoMid], avaliacaoController.criarAvaliacao);
    router.get("/", [validaLoginMiddleware], avaliacaoController.listarAvaliacoes);
    router.put(
        "/:idAvaliacao",
        [validaLoginMiddleware, validaAcessoPuteDelteMid],
        avaliacaoController.atualizarAvaliacao
    );

    return router;
}
