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
import { DataGrid, GridCellParams, GridColDef, ptBR } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FerramentasDaListagem } from "../../shared/components";
import { Enviroment } from "../../shared/enviroment";
import { useDebounce } from "../../shared/hooks";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { FcCancel } from "react-icons/fc";
import { FcCheckmark } from "react-icons/fc";
import { toast } from "react-toastify";
import {
  IListagemUsuario,
  UsuarioService,
} from "../../shared/services/api/UsuarioService";
import Swal from "sweetalert2";

export const ListagemDeUsuario: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  /**Passar próx como ', false' cancela o firstDelay */
  const navigate = useNavigate();

  const [userRows, setUserRows] = useState<IListagemUsuario[]>([]);
  const [isLoading, setIsLoading] = useState(true); //Feedback visual de carregamento
  const [totalCount, setTotalCount] = useState(0);

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
          //console.log("usuarios", result);
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
    Swal.fire({
      title: "Deseja excluir o usuário?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      showDenyButton: false,
      confirmButtonText: "Sim",
      cancelButtonText: "Cancelar",
      denyButtonText: "Não",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        UsuarioService.deleteById(id).then((result) => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            setUserRows((oldRows) => {
              return [...oldRows.filter((oldRow) => oldRow.id !== id)];
            });
            toast.success("Usuário excluído com sucesso!");
          }
        });
      }
    });

    // if (confirm("Deseja apagar?")) {
    //   UsuarioService.deleteById(id).then((result) => {
    //     if (result instanceof Error) {
    //       alert(result.message);
    //     } else {
    //       setUserRows((oldRows) => {
    //         return [...oldRows.filter((oldRow) => oldRow.id !== id)];
    //       });
    //       alert("Registro apagado com sucesso!");
    //     }
    //   });
    // }
  };

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
          aoClicarEmNovo={() => navigate("/usuario/detalhe/nova")}
          aoMudarTextoDeBusca={(texto) =>
            setSearchParams({ busca: texto, pagina: "1" }, { replace: true })
          }
        />
      }
    >
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ m: 1, width: "auto" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={40}>Avatar</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Usuário</TableCell>
              <TableCell>Permissão</TableCell>
              <TableCell>Status</TableCell>
              <TableCell width={100}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Avatar src={row.avatarURL} />
                </TableCell>
                <TableCell>{row.nome}</TableCell>
                <TableCell>{row.userName}</TableCell>
                <TableCell>
                  {row.role ? (
                    <Box
                      component="div"
                      sx={{
                        display: "inline",
                        p: 1,
                        m: 1,
                        bgcolor: "rgb(139,195,74)",
                        borderColor: "#ffff",
                        border: "1px solid",
                        borderRadius: 2,
                      }}
                    >
                      Admin
                    </Box>
                  ) : (
                    <Box
                      component="div"
                      sx={{
                        display: "inline",
                        p: 1,
                        m: 1,
                        bgcolor: grey[400],
                        borderColor: "#ffff",
                        border: "1px solid",
                        borderRadius: 2,
                      }}
                    >
                      {" "}
                      Padrão
                    </Box>
                  )}
                </TableCell>
                <TableCell>
                  {row.status ? (
                    <FcCheckmark size={25} />
                  ) : (
                    <FcCancel size={25} />
                  )}
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleDelete(row.id)}>
                    <Icon>delete</Icon>
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/usuario/detalhe/${row.id}`)}
                  >
                    <Icon>edit</Icon>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          {/* Só renderiza o Componente LISTAGEM_VAZIA se
                    for retornado 0 resultados e se a tela de loading não
                    estiver presente */}

          {/* {totalCount === 0 && !isLoading && (
            <caption>{Enviroment.LISTAGEM_VAZIA}</caption>
          )} */}

          <TableFooter>
            {isLoading && ( //Exibe a linha de loading somente quando está carregando
              <TableRow>
                <TableCell colSpan={3}>
                  <LinearProgress variant="indeterminate" />
                </TableCell>
              </TableRow>
            )}
            {totalCount > 0 && totalCount > Enviroment.LIMITE_DE_LINHAS && (
              <TableRow>
                <TableCell colSpan={3}>
                  <Pagination
                    onChange={(_, newPage) =>
                      setSearchParams(
                        { busca, pagina: newPage.toString() },
                        { replace: true }
                      )
                    }
                    page={pagina}
                    count={Math.ceil(totalCount / Enviroment.LIMITE_DE_LINHAS)}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableFooter>
        </Table>
      </TableContainer>
    </LayoutBaseDePagina>
  );
};


