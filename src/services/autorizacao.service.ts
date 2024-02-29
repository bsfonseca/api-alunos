import { TipoAluno } from "@prisma/client";
import { Result } from "../contracts/result.contract";
import repository from "../database/prisma.repository";
import { NextFunction } from "express";

export class AutorizacaoService {
    public async validarAcessoCriarAvaliacao(idAluno: string): Promise<Result> {
        const aluno = await repository.aluno.findUnique({
            where: {
                id: idAluno,
            },
        });
        if (!aluno) {
            return {
                ok: false,
                message: "Este aluno não existe",
                code: 404,
            };
        }

        if (aluno.tipo != TipoAluno.M && aluno.tipo != TipoAluno.T) {
            return {
                ok: false,
                message: "Apenas M ou T podem criar uma avaliação",
                code: 403,
            };
        }

        return {
            ok: true,
            message: "Avaliação criada com sucesso",
            code: 201,
        };
    }

    public async validarAcessoPuteDelete(idAluno: string): Promise<Result> {
        const aluno = await repository.aluno.findUnique({
            where: {
                id: idAluno,
            },
        });

        if (!aluno) {
            return {
                ok: false,
                message: "Este aluno não existe",
                code: 404,
            };
        }

        if (aluno.tipo != TipoAluno.T) {
            return {
                ok: false,
                message: "Essa opção só pode ser efetuada por aluno tipo T",
                code: 403,
            };
        }

        return {
            ok: true,
            message: "Opção efetuada com sucesso",
            code: 201,
        };
    }
}
