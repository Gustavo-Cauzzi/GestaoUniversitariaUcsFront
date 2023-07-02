import { Curso } from "./Curso";
import { Universidade } from "./Universidade";

export type UniversidadeCurso = {
  codUniversidadeCurso: number;
  codCurso: number;
  codUniversidade: number;

  curso?: Curso;
  universidade?: Universidade;
};
