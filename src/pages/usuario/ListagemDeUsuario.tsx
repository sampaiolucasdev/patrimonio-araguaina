import { Label } from "@mui/icons-material";
import {
  Avatar,
  Box,
  gridClasses,
  Icon,
  IconButton,
  LinearProgress,
  Pagination,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { DataGrid, GridColDef, ptBR } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FerramentasDaListagem } from "../../shared/components";
import { Enviroment } from "../../shared/enviroment";
import { useDebounce } from "../../shared/hooks";
import { LayoutBaseDePagina } from "../../shared/layouts";
import {
  IListagemUsuario,
  UsuarioService,
} from "../../shared/services/api/UsuarioService";
import { UserActions } from "./components/UserActions";

export const ListagemDeUsuario: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  /**Passar próx como ', false' cancela o firstDelay */
  const navigate = useNavigate();

  const [userRows, setUserRows] = useState<IListagemUsuario[]>([]);
  const [isLoading, setIsLoading] = useState(true); //Feedback visual de carregamento
  const [totalCount, setTotalCount] = useState(0);
  const [checked, setChecked] = useState(true);

  //BOTÃO DE SALVAR
  const [rowId, setRowId] = useState(null);

  const busca = useMemo(() => {
    return searchParams.get("busca") || "";
  }, [searchParams]);

  const pagina = useMemo(() => {
    return Number(searchParams.get("pagina") || "1");
  }, [searchParams]);

  useEffect(() => {
    setIsLoading(true);
    debounce(() => {
      UsuarioService.getAll(pagina, busca).then((result) => {
        setIsLoading(false);
        if (result instanceof Error) {
          alert(result.message);
        } else {
          console.log("usuarios", result);
          //setTotalCount(result.totalCount);
          setUserRows(result.data);
        }
      });
    });
  }, [busca, pagina]);

  const handleDelete = (id: number) => {
    /**
     * deleteById retorna uma promessa de resultado ou erro.
     * Quando (.then) essa promessa ocorrer, vai ter um result
     * Se esse result é uma instância de erro, então, alert
     * mostrando o error na message. Se não, vai dar um setState(serRows)
     * pegando o registro com o id específico que foi apagado, retorna um novo
     * state com todas as linhas do state anterior(...), filtrando exceto
     * a linha com o id que está sendo apagado (oldRow.id !== id).
     */
    if (confirm("Deseja apagar?")) {
      UsuarioService.deleteById(id).then((result) => {
        if (result instanceof Error) {
          alert(result.message);
        } else {
          setUserRows((oldRows) => {
            return [...oldRows.filter((oldRow) => oldRow.id !== id)];
          });
          alert("Registro apagado com sucesso!");
        }
      });
    }
  };

  const handleChangeUserActivation = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setChecked(event.target.checked);
  };

  //TODO inserir useMemo tipado com o rowId de dependência para renderizar o button
  const columns: GridColDef[] = [
    {
      field: "avatar",
      headerName: "Avatar",
      width: 70,
      renderCell: (params) => <Avatar src={params.row.avatarURL} />,
      sortable: false,
      filterable: false,
    },
    {
      field: "nome",
      headerName: "Nome",
      width: 130,
      editable: true,
      type: "string",
    },
    {
      field: "userName",
      headerName: "Usuário",
      width: 190,
      editable: true,
      type: "string",
    },
    {
      field: "role",
      headerName: "Permissões",
      width: 150,
      type: "singleSelect",
      editable: true,
      valueOptions: ["colaborador", "admin"],
    },
    {
      field: "status",
      headerName: "Status",
      type: "number",
      width: 110,
      editable: true,
      renderCell: (params) => (
        <Switch
          color="success"
          checked={params.row.role}
          onChange={handleChangeUserActivation}
          inputProps={{ "aria-label": "controlled" }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Ações",
      type: "actions",
      renderCell: (params) => <UserActions {...{ params, rowId, setRowId }} />,
    },
  ];

  userRows.map((row) => [
    {
      id: row.id,
      nome: row.nome,
      userName: row.userName,
      role: row.role,
      status: row.status,
    },
  ]);

  return (
    <LayoutBaseDePagina
      titulo="Listagem de Usuários"
      barraDeFerramentas={
        /**
         * Faz com que o que seja digitado no imput de busca, seja adicionado
         * também a URL como parâmetro de navegação, usando o useMemo e useSearchParams
         */
        <FerramentasDaListagem
          mostrarInputBusca
          textoDaBusca={busca}
          textoBotaoNovo="Nova"
          aoClicarEmNovo={() => navigate("/cidades/detalhe/nova")}
          aoMudarTextoDeBusca={(texto) =>
            setSearchParams({ busca: texto, pagina: "1" }, { replace: true })
          }
        />
      }
    >
      <Box
        margin={1}
        display="flex"
        flexDirection="column"
        component={Paper}
        variant="outlined"
        sx={{ height: 400 }}
      >
        <DataGrid
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
          rows={userRows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
          //onSelectionModelChange
          getRowSpacing={(params) => ({
            top: params.isFirstVisible ? 0 : 1,
            bottom: params.isLastVisible ? 0 : 1,
          })}
          // sx={{
          //   [`& .${gridClasses.row}`]: {
          //     bgcolor: (theme) =>
          //       theme.palette.mode == "light" ? grey[200] : grey[900],
          //   },
          // }}
          onCellEditCommit={(params) => setRowId(params.id)}
        />
      </Box>
    </LayoutBaseDePagina>
  );
};
