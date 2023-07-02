import { DisciplinaCurso } from "./DisciplinaCurso";
import { Matricula } from "./Matricula";

export type Curso = {
  codCurso: number;
  desCurso: string;
  codUniversidade: number;

  disciplinaCurso?: DisciplinaCurso[];
  matriculas?: Matricula[];
};
