import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FiTrash2, FiPlusSquare } from "react-icons/fi";
import { Curso } from "../../shared/@types/Curso";
import { Lov } from "../../shared/components/Lov";
import { api } from "../../shared/services/api";
import { Universidade } from "../../shared/@types/Universidade";

export const Courses: React.FC = () => {
  const [university, setUniversity] = useState<Universidade | null>(null);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [selectionModel, setSelectionModel] = useState([] as number[]);

  const getData = async () => {
    const toastId = toast.loading("Carregando dados...");
    const response = await api
      .get("/api/v1/cursos")
      .finally(() => toast.dismiss(toastId));
    setCursos(response.data);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSave = async () => {
    if (!university || !name) {
      toast.error("Preencha os dados");
      return;
    }
    const toastId = toast.loading("Salvando dados...");
    await api.post("/api/v1/cursos", {
      desCurso: name,
      codUniversidade: university.codUniversidade,
    });
    toast.dismiss(toastId);
    getData();
    handleClose();
    cleanFields();
  };

  const cleanFields = () => {
    setName("");
    setUniversity(null);
  };

  const handleClose = () => {
    setIsAddDialogOpen(false);
    setName("");
  };

  const handleDelete = async () => {
    const toastId = toast.loading("Excluíndo dados...");
    await Promise.all(
      selectionModel.map((id) => api.delete(`/api/v1/curso/${id}`))
    );
    toast.dismiss(toastId);
    getData();
  };

  return (
    <>
      <DataGrid
        columns={[
          { field: "codCurso", flex: 1, headerName: "Código" },
          { field: "desCurso", flex: 1, headerName: "Descrição" },
          // { field: "desUniversidade", flex: 1, headerName: "Universidade", valueGetter:  },
        ]}
        rows={cursos}
        rowSelectionModel={selectionModel}
        onRowSelectionModelChange={(s) => setSelectionModel(s as number[])}
        getRowId={(row) => row.codCurso}
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
        maxWidth="sm"
        fullWidth
        onClose={handleClose}
      >
        <DialogTitle>Adicionar</DialogTitle>
        <DialogContent>
          <div className="flex flex-col mt-2 gap-4">
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              label="Nome da curso"
            />

            <Lov
              value={university}
              onChange={(_e, newValue) => setUniversity(newValue)}
              inputProps={{
                label: "Universidade",
              }}
              noOptionsText="Nenhuma universidade encontrado"
              getData={async () => {
                return (await api.get("/api/v1/universidade")).data;
              }}
            />
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
          <Button color="primary" variant="contained" onClick={handleSave}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
