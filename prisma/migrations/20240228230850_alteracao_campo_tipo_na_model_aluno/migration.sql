/*
  Warnings:

  - The `tipo` column on the `aluno` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TipoAluno" AS ENUM ('M', 'T', 'F');

-- AlterTable
ALTER TABLE "aluno" DROP COLUMN "tipo",
ADD COLUMN     "tipo" "TipoAluno";

-- DropEnum
DROP TYPE "TipoUsuario";
