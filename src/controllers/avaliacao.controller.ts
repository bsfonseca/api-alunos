import { Request, Response } from "express";
import { erroCamposNaoInformados, erroNaoEncontrado, erroServidor } from "../util/response.helper";
import repository from "../database/prisma.repository";
import { Avaliacao } from "../models/avaliacao.model";
import { adaptAlunoPrisma } from "../util/aluno.adapter";

export class AvaliacaoController {
    // POST http://localhost:3335/aluno/:id/avaliacao

    public async criarAvaliacao(req: Request, res: Response) {
        try {
            // 1 Entrada
            // ID do aluno
            const { id } = req.params;
            const { disciplina, nota } = req.body;

            if (!disciplina || !nota) {
                return erroCamposNaoInformados(res);
            }

            // 2- Processamento
            // verificar se o aluno existe, 404 se não
            const aluno = await repository.aluno.findUnique({
                where: {
                    id,
                },
            });

            if (!aluno) {
                return erroNaoEncontrado(res, "Aluno");
            }

            // Adapt do aluno (prisma) para o aluno (backend)
            const alunoBackend = adaptAlunoPrisma(aluno);

            // criar o model backend da avaliacao
            const avaliacao = new Avaliacao(disciplina, nota, alunoBackend);

            // salvar no BD
            const result = await repository.avaliacao.create({
                data: {
                    id: avaliacao.id,
                    disciplina: avaliacao.disciplina,
                    nota: avaliacao.nota,
                    idAluno: aluno.id,
                },
            });

            // 3- Saída
            return res.status(201).send({
                ok: true,
                message: "Avaliação criada com sucesso",
                data: result,
            });
        } catch (error: any) {
            return erroServidor(res, error);
        }
    }

    public async listarAvaliacoes(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const aluno = await repository.aluno.findUnique({
                where: {
                    id,
                },
            });
            if (!aluno) {
                return erroNaoEncontrado(res, "Aluno");
            }

            const avaliacoes = await repository.avaliacao.findMany({
                where: {
                    idAluno: id,
                },
            });

            return res.status(200).send({
                ok: true,
                message: "Avalições listadas com sucesso",
                data: avaliacoes,
            });
        } catch (error: any) {
            return erroServidor(res, error);
        }
    }

    public async atualizarAvaliacao(req: Request, res: Response) {
        try {
            const { id, idAvaliacao } = req.params;
            const { nota } = req.body;

            if (!nota) {
                return erroCamposNaoInformados(res);
            }

            const aluno = await repository.aluno.findUnique({
                where: {
                    id,
                },
            });

            if (!aluno) {
                return erroNaoEncontrado(res, "Aluno");
            }

            const avaliacao = await repository.avaliacao.findUnique({
                where: {
                    id: idAvaliacao,
                },
            });

            if (!avaliacao) {
                return erroNaoEncontrado(res, "Avaliação");
            }

            const result = await repository.avaliacao.update({
                where: {
                    id: idAvaliacao,
                },
                data: {
                    nota,
                },
            });

            return res.status(200).send({
                ok: true,
                message: "Avaliação atualizada com sucesso",
                data: result,
            });
        } catch (error: any) {
            return erroServidor(res, error);
        }
    }
}
