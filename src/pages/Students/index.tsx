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
import { api } from "../../shared/services/api";
import { Aluno } from "../../shared/@types/Aluno";

export const Students: React.FC = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [selectionModel, setSelectionModel] = useState([] as number[]);

  const getData = async () => {
    const toastId = toast.loading("Carregando dados...");
    const response = await api
      .get("/api/v1/aluno")
      .finally(() => toast.dismiss(toastId));
    setAlunos(response.data);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSave = async () => {
    const toastId = toast.loading("Salvando dados...");
    const response = await api.post("/api/v1/aluno", {
      desAluno: name,
    });
    toast.dismiss(toastId);
    getData();
    handleClose();
  };

  const handleClose = () => {
    setIsAddDialogOpen(false);
    setName("");
  };

  const handleDelete = async () => {
    const toastId = toast.loading("Excluíndo dados...");
    await Promise.all(
      selectionModel.map((id) => api.delete(`/api/v1/aluno/${id}`))
    );
    toast.dismiss(toastId);
    getData();
  };

  return (
    <>
      <DataGrid
        columns={[
          { field: "codAluno", flex: 1, headerName: "Código" },
          { field: "desAluno", flex: 1, headerName: "Descrição" },
        ]}
        rows={alunos}
        rowSelectionModel={selectionModel}
        onRowSelectionModelChange={(s) => setSelectionModel(s as number[])}
        getRowId={(row) => row.codAluno}
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
          <div className="flex flex-col mt-2">
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              label="Nome da aluno"
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
