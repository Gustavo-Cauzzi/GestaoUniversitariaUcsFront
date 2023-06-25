import { Curso } from "./Curso";
import { Disciplina } from "./Disciplina";

export interface DisciplinaCurso {
  codDisciplinaCurso: number;
  codCurso: number;
  codDisciplina: number;

  curso?: Curso;
  disciplina?: Disciplina;
}
