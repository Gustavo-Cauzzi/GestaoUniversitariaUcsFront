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
import { Aluno } from "../../shared/@types/Aluno";
import { Matricula } from "../../shared/@types/Matricula";
import { Curso } from "../../shared/@types/Curso";
import { Lov } from "../../shared/components/Lov";
import { api } from "../../shared/services/api";

export const Enrollment: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Matricula[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectionModel, setSelectionModel] = useState([] as number[]);

  const [course, setCourse] = useState<null | Curso>(null);
  const [students, setStudents] = useState<Aluno[]>([]);
  const [selectedStudentsToAdd, setSelectedStudentsToAdd] = useState<
    Aluno["codAluno"][]
  >([]);

  const getData = async () => {
    const toastId = toast.loading("Carregando dados...");
    api.get("/api/v1/aluno").then((res) => setStudents(res.data));
    const response = await api
      .get("/api/v1/matricula")
      .finally(() => toast.dismiss(toastId));
    setEnrollments(response.data);
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
      toast.error("Selecione alunos para adicionar para essa curso");
      return;
    }
    const toastId = toast.loading("Salvando dados...");
    await Promise.all(
      selectedStudentsToAdd.map((studentId) =>
        api.post("/api/v1/matricula", {
          codAluno: studentId,
          codCurso: course.codCurso,
        })
      )
    ).finally(() => toast.dismiss(toastId));
    getData();
    handleClose();
    cleanFields();
  };

  const cleanFields = () => {
    setCourse(null);
    setSelectedStudentsToAdd([]);
  };

  const handleClose = () => {
    setIsAddDialogOpen(false);
    setCourse(null);
  };

  const handleDelete = async () => {
    const toastId = toast.loading("Excluíndo dados...");
    await Promise.all(
      selectionModel.map((id) => api.delete(`/api/v1/matricula/${id}`))
    );
    toast.dismiss(toastId);
    getData();
  };

  const getStudentsWhoAreNotInCurrentSubject = () => {
    if (!course) return [];
    const studentsIdsOfCurrentSubject = enrollments
      .filter((en) => en.codCurso === course.codCurso)
      .map((en) => en.codAluno);
    return students.filter(
      (st) => !studentsIdsOfCurrentSubject.includes(st.codAluno)
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
            field: "desAluno",
            headerName: "Aluno",
            flex: 1,
            valueGetter: (p) => p.row.aluno?.desAluno ?? "-",
          },
        ]}
        rows={enrollments}
        rowSelectionModel={selectionModel}
        onRowSelectionModelChange={(s) => setSelectionModel(s as number[])}
        getRowId={(row) => row.codMatricula}
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
                setCourse(newValue);
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
                Selecione uma curso para adicionar os alunos
              </span>
              <div className="w-full">
                <DataGrid
                  columns={[
                    {
                      field: "codAluno",
                      headerName: "Código",
                      flex: 0.4,
                    },
                    {
                      field: "desAluno",
                      headerName: "Nome",
                      flex: 1,
                    },
                  ]}
                  getRowId={(row) => row.codAluno}
                  rows={getStudentsWhoAreNotInCurrentSubject()}
                  checkboxSelection
                  rowSelectionModel={selectedStudentsToAdd}
                  onRowSelectionModelChange={(newSelection) =>
                    setSelectedStudentsToAdd(
                      newSelection as Aluno["codAluno"][]
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
