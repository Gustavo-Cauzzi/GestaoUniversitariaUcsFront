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
import { UniversidadeCurso } from "../../shared/@types/UniversidadeCurso";
import { Universidade } from "../../shared/@types/Universidade";
import { Lov } from "../../shared/components/Lov";
import { api } from "../../shared/services/api";

export const UniversityCourse: React.FC = () => {
  const [courseSubjects, setCourseSubjects] = useState<UniversidadeCurso[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectionModel, setSelectionModel] = useState([] as number[]);

  const [university, setUniversity] = useState<null | Universidade>(null);
  const [courses, setCourses] = useState<Curso[]>([]);
  const [selectedStudentsToAdd, setSelectedStudentsToAdd] = useState<
    Curso["codCurso"][]
  >([]);

  const getData = async () => {
    const toastId = toast.loading("Carregando dados...");
    api.get("/api/v1/cursos").then((res) => setCourses(res.data));
    const response = await api
      .get("/api/v1/universidadeCurso")
      .finally(() => toast.dismiss(toastId));
    setCourseSubjects(response.data);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSave = async () => {
    if (!university) {
      toast.error("Preencha todos os campos");
      return;
    }
    if (!selectedStudentsToAdd.length) {
      toast.error("Selecione cursos para adicionar para essa universidade");
      return;
    }
    const toastId = toast.loading("Salvando dados...");
    await Promise.all(
      selectedStudentsToAdd.map((courseId) =>
        api.post("/api/v1/universidadeCurso", {
          codCurso: courseId,
          codUniversidade: university.codUniversidade,
        })
      )
    ).finally(() => toast.dismiss(toastId));
    getData();
    handleClose();
    cleanFields();
  };

  const cleanFields = () => {
    setUniversity(null);
    setSelectedStudentsToAdd([]);
  };

  const handleClose = () => {
    setIsAddDialogOpen(false);
    setUniversity(null);
  };

  const handleDelete = async () => {
    const toastId = toast.loading("Excluíndo dados...");
    await Promise.all(
      selectionModel.map((id) => api.delete(`/api/v1/universidadeCurso/${id}`))
    ).finally(() => toast.dismiss(toastId));
    getData();
  };

  const getStudentsWhoAreNotInCurrentSubject = () => {
    if (!university) return [];
    const studentsIdsOfCurrentSubject = courseSubjects
      .filter((en) => en.codUniversidade === university.codUniversidade)
      .map((en) => en.codCurso);
    return courses.filter(
      (st) => !studentsIdsOfCurrentSubject.includes(st.codCurso)
    );
  };

  return (
    <>
      <DataGrid
        columns={[
          {
            field: "desUniversidade",
            headerName: "Universidade",
            flex: 1,
            valueGetter: (p) => p.row.universidade?.desUniversidade ?? "-",
          },
          {
            field: "desCurso",
            headerName: "Curso",
            flex: 1,
            valueGetter: (p) => p.row.curso?.desCurso ?? "-",
          },
        ]}
        rows={courseSubjects}
        rowSelectionModel={selectionModel}
        onRowSelectionModelChange={(s) => setSelectionModel(s as number[])}
        getRowId={(row) => row.codUniversidadeCurso}
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
              inputProps={{ label: "Universidade" }}
              value={university}
              onChange={(_e, newValue) => {
                setSelectedStudentsToAdd([]);
                setUniversity(newValue);
              }}
              getData={async () =>
                api.get<Universidade[]>("/api/v1/universidade").then((res) =>
                  res.data.map(({ codUniversidade, desUniversidade }) => ({
                    codUniversidade,
                    desUniversidade,
                  }))
                )
              }
            />

            <div
              className={`${
                university ? "" : "opacity-30"
              } transition-all flex items-center flex-col mt-4`}
            >
              <span
                className={`${
                  university ? "opacity-0 mt-[-16px]" : ""
                } transition-all`}
              >
                Selecione uma universidade para adicionar os cursos
              </span>
              <div className="w-full">
                <DataGrid
                  columns={[
                    {
                      field: "codCurso",
                      headerName: "Código",
                      flex: 0.2,
                    },
                    {
                      field: "desCurso",
                      headerName: "Curso",
                      flex: 1,
                    },
                  ]}
                  getRowId={(row) => row.codCurso}
                  rows={getStudentsWhoAreNotInCurrentSubject()}
                  checkboxSelection
                  rowSelectionModel={selectedStudentsToAdd}
                  onRowSelectionModelChange={(newSelection) =>
                    setSelectedStudentsToAdd(
                      newSelection as Curso["codCurso"][]
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
