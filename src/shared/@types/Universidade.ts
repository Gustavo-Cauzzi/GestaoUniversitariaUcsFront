import { UniversidadeCurso } from "./UniversidadeCurso";

export type Universidade = {
  codUniversidade: number;
  desUniversidade: string;

  universidadeCurso: UniversidadeCurso[];
};
