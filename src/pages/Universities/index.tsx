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
import { FiPlusSquare } from "react-icons/fi";

export const Universities: React.FC = () => {
  const [universities, setUniversities] = useState<Universidade[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [name, setName] = useState("");

  const getData = async () => {
    const toastId = toast.loading("Carregando dados ");
    const response = await api
      .get("/api/v1/universidade")
      .finally(() => toast.dismiss(toastId));
    setUniversities(response.data);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSave = async () => {
    const toastId = toast.loading("Carregando dados ");
    const response = await api.post("/api/v1/universidade", {
      desUniversidade: name,
    });
    console.log("response.data: ", response.data);
    toast.dismiss(toastId);
    getData();
    handleClose();
  };

  const handleClose = () => {
    setIsAddDialogOpen(false);
    setName("");
  };

  return (
    <>
      <DataGrid
        columns={[
          { field: "codUniversidade", flex: 1, headerName: "Código" },
          { field: "desUniversidade", flex: 1, headerName: "Descrição" },
        ]}
        rows={universities}
        getRowId={(row) => row.codUniversidade}
      />

      <div className="mt-2 flex justify-end">
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
