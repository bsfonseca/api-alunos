-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('M', 'T', 'F');

-- AlterTable
ALTER TABLE "aluno" ADD COLUMN     "tipo" "TipoUsuario";
