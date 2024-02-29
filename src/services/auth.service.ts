import repository from "../database/prisma.repository";
import { LoginDTO, PayloadToken } from "../contracts/login.contract";
import { Result } from "../contracts/result.contract";
import jwt from "jsonwebtoken";
import { TipoAluno } from "@prisma/client";

export class AuthService {
    public async login(data: LoginDTO): Promise<Result> {
        const aluno = await repository.aluno.findFirst({
            where: {
                email: data.email,
                senha: data.senha,
            },
            select: {
                id: true,
                nome: true,
                tipo: true,
            },
        });

        if (!aluno) {
            return {
                ok: false,
                message: "Credenciais inválidas",
                code: 401,
            };
        }

        const token = this.generateToken(aluno);

        await repository.aluno.update({
            where: {
                id: aluno.id,
            },
            data: {
                token,
            },
        });

        return {
            ok: true,
            message: "Login realizado com suesso",
            code: 200,
            data: {
                id: aluno.id,
                nome: aluno.nome,
                token,
            },
        };
    }

    public async validateLogin(token: string, idAluno: string): Promise<Result> {
        //verificar se o token jwt é válido
        const payload = this.validateToken(token) as PayloadToken;

        console.log(payload);

        //validar o id do token com o id da requisição
        // Regra de Autenticação
        if (payload == null) {
            return {
                ok: false,
                message: "Token de autenticação inválido",
                code: 401,
            };
        }

        // Regra de Autorização
        if (payload.tipo != TipoAluno.T && payload.id != idAluno) {
            return {
                ok: false,
                message: "O usuário não possui autorização para esta operação",
                code: 403,
            };
        }

        return {
            ok: true,
            message: "Validação de login feita com sucesso",
            code: 200,
        };
    }

    public generateToken(payload: any) {
        const token = jwt.sign(payload, process.env.JWT_SECRET!);
        return token;
    }

    public validateToken(token: string) {
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET!);
            return payload;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    public decodeToken(token: string) {
        const payload = jwt.decode(token);
        return payload;
    }
}
