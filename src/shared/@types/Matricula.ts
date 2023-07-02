import { Aluno } from "./Aluno";
import { Curso } from "./Curso";

export interface Matricula {
  codMatricula: number;
  codUniversidade: number;
  codCurso: number;
  codAluno: number;

  curso?: Curso;
  aluno?: Aluno;
}
