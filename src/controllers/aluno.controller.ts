import { Request, Response } from "express";
import { Aluno } from "../models/aluno.model";
import repository from "../database/prisma.repository";
import { erroNaoEncontrado, erroServidor } from "../util/response.helper";
import { Prisma, TipoAluno } from "@prisma/client";

export class AlunoController {
    public async criarAluno(req: Request, res: Response) {
        try {
            const { nome, email, senha, idade, tipo } = req.body;

            if (!nome || !email || !senha || !idade || !tipo) {
                return res.status(400).send({
                    ok: false,
                    message: "Preencha todos os campos",
                });
            }

            const aluno = new Aluno(nome, email, senha, tipo, idade);

            const dadosAluno: Prisma.AlunoCreateInput = {
                nome: aluno.nome,
                email: aluno.email,
                senha: aluno.senha,
                idade: aluno.idade,
                tipo: aluno.tipo as TipoAluno,
            };

            const result = await repository.aluno.create({
                data: dadosAluno,
            });

            // Saída
            return res.status(201).send({
                ok: true,
                message: "Usuário criado com sucesso",
                data: result,
            });
        } catch (error: any) {
            return res.status(500).send({
                ok: false,
                message: error.toString(),
            });
        }
    }
    //Obter um aluno pelo id
    public async obterAluno(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const aluno = await repository.aluno.findUnique({
                where: {
                    id,
                },
            });

            if (!aluno) {
                return res.status(404).send({
                    ok: false,
                    message: "Aluno não encontrado",
                });
            }

            return res.status(200).send({
                ok: true,
                message: "Usuário obtido com sucesso",
                data: aluno,
            });
        } catch (error: any) {
            return res.status(500).send({
                ok: false,
                message: error.toString(),
            });
        }
    }

    // PUT - atualizar um aluno
    public async atualizarAluno(req: Request, res: Response) {
        try {
            // 1- Entrada
            const { id } = req.params;
            const { nome, idade } = req.body;

            if (!nome && !idade) {
                return res.status(400).send({
                    ok: false,
                    message: "Informe ao menos um campo para atualizar",
                });
            }

            // 2- Processamento
            // verificar se o aluno existe
            const aluno = await repository.aluno.findUnique({
                where: {
                    id,
                },
            });

            if (!aluno) {
                return erroNaoEncontrado(res, "Aluno");
            }

            // atualizar os dados do aluno
            const result = await repository.aluno.update({
                where: {
                    id,
                },
                data: {
                    nome,
                    idade,
                },
            });

            // 3- Saída
            return res.status(200).send({
                ok: true,
                message: "Aluno atualizado com sucesso",
                data: result,
            });
        } catch (error: any) {
            return res.status(500).send({
                ok: false,
                message: error.toString(),
            });
        }
    }

    public async deletarAluno(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const aluno = await repository.aluno.findUnique({
                where: {
                    id,
                },
            });

            if (!aluno) {
                return res.status(404).send({
                    ok: false,
                    message: "Aluno não encontrado",
                });
            }

            await repository.aluno.delete({
                where: {
                    id,
                },
            });

            return res.status(200).send({
                ok: true,
                message: "Aluno deletado com sucesso.",
            });
        } catch (error: any) {
            return erroServidor(res, error);
        }
    }

    public async listarAlunos(req: Request, res: Response) {
        try {
            const result = await repository.aluno.findMany();
            return res.status(200).send({
                ok: true,
                message: "Lista executada com sucesso",
                data: result,
            });
        } catch (error: any) {
            return erroServidor(res, error);
        }
    }
}
