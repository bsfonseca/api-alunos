import { Request, Response } from "express";
import repository from "../database/prisma.repository";
import { randomUUID } from "crypto";

//Entrada
export class LoginController {
    public async login(req: Request, res: Response) {
        try {
            const { email, senha } = req.body;

            //Processamento
            const aluno = await repository.aluno.findFirst({
                where: {
                    email,
                    senha,
                },
            });

            if (!aluno) {
                return res.status(401).send({
                    ok: false,
                    message: "Credencias inválidas",
                });
            }

            //Antes da saída faz o token

            const token = randomUUID();

            await repository.aluno.update({
                where: {
                    id: aluno.id,
                },
                data: {
                    token,
                },
            });

            //Saída
            return res.status(200).send({
                ok: true,
                message: "Login realizado com sucesso",
                data: {
                    id: aluno.id,
                    nome: aluno.id,
                    token,
                },
            });
        } catch (error: any) {
            return res.status(500).send({
                ok: false,
                message: error.toString(),
            });
        }
    }
}
