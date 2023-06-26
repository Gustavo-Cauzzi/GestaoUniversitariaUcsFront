import { Curso } from "./Curso";
import { Universidade } from "./Universidade";

export interface CursoUniversidade {
  codUniversidadeCurso: number;
  codCurso: number;
  codUniversidade: number;

  curso?: Curso;
  universidade?: Universidade;
}
