import React from "react";
import { useQuery } from "react-query";
import { Curso } from "../../shared/@types/Curso";
import { Universidade } from "../../shared/@types/Universidade";
import { api } from "../../shared/services/api";
import { CollapsibleTable } from "./components/CollapsibleTable";
import { HomeAccordion } from "./components/HomeAccordion";
import { HomeCard } from "./components/HomeCard";
import { ValidInvalidTable } from "./components/ValidInvalidTable";
import { UniversidadeCurso } from "../../shared/@types/UniversidadeCurso";

const separateValidInvalid = <T,>(arr: T[], isValid: (elem: T) => boolean) =>
  arr.reduce(
    (acc, curr) => {
      (isValid(curr) ? acc.valid : acc.invalid).push(curr);
      return acc;
    },
    { valid: [] as T[], invalid: [] as T[] }
  );

export const HomeDashboard: React.FC = () => {
  const { data: universityData } = useQuery("universidades", async () => {
    return api
      .get<Universidade[]>("/api/v1/universidade")
      .then((res) =>
        separateValidInvalid(
          res.data,
          (row) => row.universidadeCurso.length >= 3
        )
      );
  });

  const { data: subjectsCourseData } = useQuery("subjectsCourse", () => {
    return api
      .get<Curso[]>("/api/v1/cursos")
      .then((res) =>
        separateValidInvalid(
          res.data,
          (row) =>
            (row.disciplinaCurso?.length ?? 0) >= 10 &&
            (row.matriculas?.length ?? 0) >= 5
        )
      );
  });

  return (
    <div className="flex flex-col gap-4">
      <HomeCard>
        <h2 className="text-xl text-primary">Universidades</h2>
        <span className="text-gray-600">
          Universidades deve ter ao menos 3 cursos cadastrados
        </span>
        <HomeAccordion
          title={`Inválidas (${universityData?.invalid.length ?? "-"})`}
          variant="ERROR"
        >
          {universityData && (
            <CollapsibleTable
              data={universityData.invalid}
              columns={[
                {
                  field: "codUniversidade",
                  headerName: "Código",
                  valueGetter: (params) => params.row.codUniversidade,
                },
                {
                  field: "desUniversidade",
                  headerName: "Universidade",
                  valueGetter: (params) => params.row.desUniversidade,
                },
                {
                  field: "cursos",
                  headerName: "Qtd. Cursor",
                  valueGetter: (params) => params.row.universidadeCurso.length,
                },
              ]}
              getCollapsibleData={(row) => row.universidadeCurso}
              collapsibleColumns={[
                {
                  field: "sad",
                  headerName: "Código",
                  valueGetter: (params) => params.row.codCurso,
                },
                {
                  field: "desCurso",
                  headerName: "Curso",
                  valueGetter: (params) =>
                    (params.row.curso as Curso)?.desCurso ?? "-",
                },
              ]}
              getCollapsibleRowId={(row) => row.codCurso}
              getRowId={(row) => row.codUniversidade}
            />
          )}
        </HomeAccordion>
        <HomeAccordion
          title={`Válidas (${universityData?.invalid.length ?? "-"})`}
          variant="SUCCESS"
        >
          {universityData && (
            <CollapsibleTable
              data={universityData.valid}
              columns={[
                {
                  field: "codUniversidade",
                  headerName: "Código",
                  valueGetter: (params) => params.row.codUniversidade,
                },
                {
                  field: "desUniversidade",
                  headerName: "Universidade",
                  valueGetter: (params) => params.row.desUniversidade,
                },
                {
                  field: "cursos",
                  headerName: "Qtd. Curso",
                  valueGetter: (params) => params.row.universidadeCurso.length,
                },
              ]}
              getCollapsibleData={(row) => row.universidadeCurso}
              collapsibleColumns={[
                {
                  field: "sad",
                  headerName: "Código",
                  valueGetter: (params) => params.row.codCurso,
                },
                {
                  field: "desCurso",
                  headerName: "Curso",
                  valueGetter: (params) =>
                    (params.row as UniversidadeCurso).curso?.desCurso ?? "-",
                },
              ]}
              getCollapsibleRowId={(row) => row.codCurso}
              getRowId={(row) => row.codUniversidade}
            />
          )}
        </HomeAccordion>
      </HomeCard>

      <HomeCard>
        <h2 className="text-xl text-primary">Cursos</h2>
        <span className="text-gray-600">
          Cursos devem ter, no mínimo, dez disciplinas cadastradas e cinco
          alunos cadastrados
        </span>

        <ValidInvalidTable
          data={subjectsCourseData}
          columns={[
            {
              field: "codCurso",
              headerName: "Código",
              flex: 1,
            },
            {
              field: "desCurso",
              headerName: "Curso",
              flex: 1,
            },
            {
              field: "cursos",
              headerName: "Qtd. Disciplinas",
              valueGetter: (params) => params.row.disciplinaCurso?.length ?? 0,
              flex: 1,
            },
            {
              field: "matriculas",
              headerName: "Qtd. Alunos",
              valueGetter: (params) => params.row.matriculas?.length ?? 0,
              flex: 1,
            },
          ]}
          getRowId={(row) => row.codCurso}
        />
      </HomeCard>
    </div>
  );
};
