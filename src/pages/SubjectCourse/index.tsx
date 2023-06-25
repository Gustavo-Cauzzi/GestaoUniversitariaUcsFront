import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiPlusSquare, FiTrash2 } from "react-icons/fi";
import { Curso } from "../../shared/@types/Curso";
import { Disciplina } from "../../shared/@types/Disciplina";
import { DisciplinaCurso } from "../../shared/@types/DisciplinaCurso";
import { Lov } from "../../shared/components/Lov";
import { api } from "../../shared/services/api";

export const SubjectCourses: React.FC = () => {
  const [courseSubjects, setCourseSubjects] = useState<DisciplinaCurso[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectionModel, setSelectionModel] = useState([] as number[]);

  const [course, setCourses] = useState<null | Curso>(null);
  const [subjects, setSubjects] = useState<Disciplina[]>([]);
  const [selectedStudentsToAdd, setSelectedStudentsToAdd] = useState<
    Disciplina["codDisciplina"][]
  >([]);

  const getData = async () => {
    const toastId = toast.loading("Carregando dados...");
    api.get("/api/v1/disciplina").then((res) => setSubjects(res.data));
    const response = await api
      .get("/api/v1/disciplinaCurso")
      .finally(() => toast.dismiss(toastId));
    setCourseSubjects(response.data);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSave = async () => {
    if (!course) {
      toast.error("Preencha todos os campos");
      return;
    }
    if (!selectedStudentsToAdd.length) {
      toast.error("Selecione disciplinas para adicionar para essa curso");
      return;
    }
    const toastId = toast.loading("Salvando dados...");
    await Promise.all(
      selectedStudentsToAdd.map((studentId) =>
        api.post("/api/v1/disciplinaCurso", {
          codDisciplina: studentId,
          codCurso: course.codCurso,
        })
      )
    ).finally(() => toast.dismiss(toastId));
    getData();
    handleClose();
    cleanFields();
  };

  const cleanFields = () => {
    setCourses(null);
    setSelectedStudentsToAdd([]);
  };

  const handleClose = () => {
    setIsAddDialogOpen(false);
    setCourses(null);
  };

  const handleDelete = async () => {
    const toastId = toast.loading("Excluíndo dados...");
    await Promise.all(
      selectionModel.map((id) => api.delete(`/api/v1/disciplinaCurso/${id}`))
    ).finally(() => toast.dismiss(toastId));
    getData();
  };

  const getStudentsWhoAreNotInCurrentSubject = () => {
    if (!course) return [];
    const studentsIdsOfCurrentSubject = courseSubjects
      .filter((en) => en.codCurso === course.codCurso)
      .map((en) => en.codDisciplina);
    return subjects.filter(
      (st) => !studentsIdsOfCurrentSubject.includes(st.codDisciplina)
    );
  };

  return (
    <>
      <DataGrid
        columns={[
          {
            field: "desCurso",
            headerName: "Curso",
            flex: 1,
            valueGetter: (p) => p.row.curso?.desCurso ?? "-",
          },
          {
            field: "desDisciplina",
            headerName: "Disciplina",
            flex: 1,
            valueGetter: (p) => p.row.disciplina?.desDisciplina ?? "-",
          },
        ]}
        rows={courseSubjects}
        rowSelectionModel={selectionModel}
        onRowSelectionModelChange={(s) => setSelectionModel(s as number[])}
        getRowId={(row) => row.codDisciplinaCurso}
        checkboxSelection
      />

      <div className="mt-2 gap-4 flex justify-end">
        <Button
          startIcon={<FiTrash2 />}
          onClick={handleDelete}
          disabled={!selectionModel.length}
        >
          Remover
        </Button>
        <Button
          variant="contained"
          startIcon={<FiPlusSquare />}
          onClick={() => setIsAddDialogOpen(true)}
        >
          Adicionar
        </Button>
      </div>

      <Dialog
        open={isAddDialogOpen}
        maxWidth="md"
        fullWidth
        onClose={handleClose}
      >
        <DialogTitle>Adicionar</DialogTitle>
        <DialogContent>
          <div className="flex flex-col mt-2 gap-4">
            <Lov
              inputProps={{ label: "Curso" }}
              value={course}
              onChange={(_e, newValue) => {
                setSelectedStudentsToAdd([]);
                setCourses(newValue);
              }}
              getData={async () =>
                api.get<Curso[]>("/api/v1/cursos").then((res) =>
                  res.data.map(({ codCurso, desCurso }) => ({
                    codCurso,
                    desCurso,
                  }))
                )
              }
            />

            <div
              className={`${
                course ? "" : "opacity-30"
              } transition-all flex items-center flex-col mt-4`}
            >
              <span
                className={`${
                  course ? "opacity-0 mt-[-16px]" : ""
                } transition-all`}
              >
                Selecione uma curso para adicionar os disciplinas
              </span>
              <div className="w-full">
                <DataGrid
                  columns={[
                    {
                      field: "codDisciplina",
                      headerName: "Código",
                      flex: 0.2,
                    },
                    {
                      field: "desDisciplina",
                      headerName: "Disciplina",
                      flex: 1,
                    },
                  ]}
                  getRowId={(row) => row.codDisciplina}
                  rows={getStudentsWhoAreNotInCurrentSubject()}
                  checkboxSelection
                  rowSelectionModel={selectedStudentsToAdd}
                  onRowSelectionModelChange={(newSelection) =>
                    setSelectedStudentsToAdd(
                      newSelection as Disciplina["codDisciplina"][]
                    )
                  }
                />
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="outlined"
            type="submit"
            onClick={handleClose}
          >
            Cancelar
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={handleSave}
            disabled={!selectedStudentsToAdd.length}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
