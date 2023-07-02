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
import { AlunoDisciplina } from "../../shared/@types/AlunoDisciplina";
import { Disciplina } from "../../shared/@types/Disciplina";
import { Lov } from "../../shared/components/Lov";
import { api } from "../../shared/services/api";

export const StudentSubject: React.FC = () => {
  const [studentsubjects, setStudentSubjects] = useState<AlunoDisciplina[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectionModel, setSelectionModel] = useState([] as number[]);

  const [subject, setSubject] = useState<null | Disciplina>(null);
  const [students, setStudents] = useState<Aluno[]>([]);
  const [selectedStudentsToAdd, setSelectedStudentsToAdd] = useState<
    Aluno["codAluno"][]
  >([]);

  const getData = async () => {
    const toastId = toast.loading("Carregando dados...");
    api.get("/api/v1/aluno").then((res) => setStudents(res.data));
    const response = await api
      .get("/api/v1/alunoDisciplina")
      .finally(() => toast.dismiss(toastId));
    setStudentSubjects(response.data);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSave = async () => {
    if (!subject) {
      toast.error("Preencha todos os campos");
      return;
    }
    if (!selectedStudentsToAdd.length) {
      toast.error("Selecione alunos para adicionar para essa disciplina");
      return;
    }
    const toastId = toast.loading("Salvando dados...");
    await Promise.all(
      selectedStudentsToAdd.map((studentId) =>
        api.post("/api/v1/alunoDisciplina", {
          codAluno: studentId,
          codDisciplina: subject.codDisciplina,
        })
      )
    ).finally(() => toast.dismiss(toastId));
    getData();
    handleClose();
    cleanFields();
  };

  const cleanFields = () => {
    setSubject(null);
    setSelectedStudentsToAdd([]);
  };

  const handleClose = () => {
    setIsAddDialogOpen(false);
    setSubject(null);
  };

  const handleDelete = async () => {
    const toastId = toast.loading("Excluíndo dados...");
    await Promise.all(
      selectionModel.map((id) => api.delete(`/api/v1/alunoDisciplina/${id}`))
    );
    toast.dismiss(toastId);
    getData();
  };

  const getStudentsWhoAreNotInCurrentSubject = () => {
    if (!subject) return [];
    const studentsIdsOfCurrentSubject = studentsubjects
      .filter((en) => en.codDisciplina === subject.codDisciplina)
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
            field: "desDisciplina",
            headerName: "Disciplina",
            flex: 1,
            valueGetter: (p) => p.row.disciplina?.desDisciplina ?? "-",
          },
          {
            field: "desAluno",
            headerName: "Aluno",
            flex: 1,
            valueGetter: (p) => p.row.aluno?.desAluno ?? "-",
          },
        ]}
        rows={studentsubjects}
        rowSelectionModel={selectionModel}
        onRowSelectionModelChange={(s) => setSelectionModel(s as number[])}
        getRowId={(row) => row.codDisciplinaAluno}
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
              inputProps={{ label: "Disciplina" }}
              value={subject}
              onChange={(_e, newValue) => {
                setSelectedStudentsToAdd([]);
                setSubject(newValue);
              }}
              getData={async () =>
                api.get("/api/v1/disciplina").then((res) => res.data)
              }
            />

            <div
              className={`${
                subject ? "" : "opacity-30"
              } transition-all flex items-center flex-col mt-4`}
            >
              <span
                className={`${
                  subject ? "opacity-0 mt-[-16px]" : ""
                } transition-all`}
              >
                Selecione uma disciplina para adicionar os alunos
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
