import { AlunoDisciplina } from "./AlunoDisciplina";
import { Matricula } from "./Matricula";

export type Aluno = {
  codAluno: number;
  desAluno: string;

  alunoDisciplinas?: AlunoDisciplina[];
  matriculas?: Matricula[];
};
