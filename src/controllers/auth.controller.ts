import { Request, Response } from "express";
import { erroCamposNaoInformados, erroServidor } from "../util/response.helper";
import repository from "../database/prisma.repository";
import { randomUUID } from "crypto";

// Para criar um login é com POST pq é usado body
export class AuthController {
    public async login(req: Request, res: Response) {
        try {
            const { email, senha } = req.body;

            if (!email || !senha) {
                return erroCamposNaoInformados(res);
            }

            const aluno = await repository.aluno.findFirst({
                where: {
                    email,
                    senha,
                },
                select: {
                    id: true,
                    nome: true,
                },
            });

            if (!aluno) {
                return res.status(401).send({
                    ok: false,
                    message: "Credenciais inválidas",
                });
            }

            const token = randomUUID();

            await repository.aluno.update({
                where: {
                    id: aluno.id,
                },
                data: {
                    token,
                },
            });

            return res.status(200).send({
                ok: true,
                message: "Login realizado com sucesso",
                data: {
                    id: aluno.id,
                    nome: aluno.nome,
                    token,
                },
            });
        } catch (error: any) {
            return erroServidor(res, error);
        }
    }
}
