import { Aluno } from "./Aluno";
import { Disciplina } from "./Disciplina";

export interface AlunoDisciplina {
  codDisciplinaAluno: number;
  codDisciplina: number;
  codAluno: number;

  aluno?: Aluno;
  disciplina?: Disciplina;
}
