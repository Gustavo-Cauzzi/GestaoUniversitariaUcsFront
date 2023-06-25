import { Curso } from "./Curso";

export interface Aluno {
  codAluno: number;
  desAluno: string;
  codCurso: number;

  curso?: Curso;
}
