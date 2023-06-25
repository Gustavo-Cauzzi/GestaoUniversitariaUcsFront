import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Universidade } from "../../shared/@types/Universities";
import { api } from "../../shared/services/api";
import { toast } from "react-hot-toast";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { FiPlusSquare, FiTrash2 } from "react-icons/fi";

export const Universities: React.FC = () => {
  const [universities, setUniversities] = useState<Universidade[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [selectionModel, setSelectionModel] = useState([] as number[]);

  const getData = async () => {
    const toastId = toast.loading("Carregando dados...");
    const response = await api
      .get("/api/v1/universidade")
      .finally(() => toast.dismiss(toastId));
    setUniversities(response.data);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSave = async () => {
    const toastId = toast.loading("Salvando dados...");
    await api.post("/api/v1/universidade", {
      desUniversidade: name,
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
      selectionModel.map((id) => api.delete(`/api/v1/universidade/${id}`))
    );
    toast.dismiss(toastId);
    getData();
  };

  return (
    <>
      <DataGrid
        columns={[
          { field: "codUniversidade", flex: 1, headerName: "Código" },
          { field: "desUniversidade", flex: 1, headerName: "Descrição" },
        ]}
        rows={universities}
        rowSelectionModel={selectionModel}
        onRowSelectionModelChange={(s) => setSelectionModel(s as number[])}
        getRowId={(row) => row.codUniversidade}
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
              label="Nome da universidade"
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
