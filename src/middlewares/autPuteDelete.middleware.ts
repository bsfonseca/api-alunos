import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { PayloadToken } from "../contracts/login.contract";
import { AutorizacaoService } from "../services/autorizacao.service";

export async function validaAcessoPuteDelteMid(req: Request, res: Response, next: NextFunction) {
    try {
        const { authorization } = req.headers;

        const auth = new AuthService();

        const payload = auth.decodeToken(authorization!) as PayloadToken;

        const validarService = new AutorizacaoService();

        const result = await validarService.validarAcessoPuteDelete(payload.id);

        if (!result.ok) {
            return res.status(result.code).send(result);
        }

        next();
    } catch (error: any) {
        return res.status(500).send({
            ok: false,
            message: error.toString(),
        });
    }
}
