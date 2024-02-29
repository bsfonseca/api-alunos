import { Request, Response } from "express";
import repository from "../database/prisma.repository";
import { randomUUID } from "crypto";
import { erroCamposNaoInformados, erroServidor } from "../util/response.helper";
import { AuthService } from "../services/auth.service";

//Entrada
export class LoginController {
    public async login(req: Request, res: Response) {
        try {
            // - 1 entrada
            const { email, senha } = req.body;

            if (!email || !senha) {
                return erroCamposNaoInformados(res);
            }
            // - 2 processamento
            const authService = new AuthService();
            const result = await authService.login({
                email,
                senha,
            });
            // - 3 saída
            return res.status(result.code).send(result);
        } catch (error: any) {
            return erroServidor(res, error);
        }
    }
}
