import {
  Icon,
  IconButton,
  LinearProgress,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FerramentasDaListagem } from "../../shared/components";
import { Enviroment } from "../../shared/enviroment";
import { useDebounce } from "../../shared/hooks";
import { LayoutBaseDePagina } from "../../shared/layouts";
import {
  IListagemDepartamento,
  DepartamentoService,
} from "../../shared/services/api/DepartamentoService";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

export const ListagemDeDepartamento: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  /**Passar próx como ', false' cancela o firstDelay */
  const navigate = useNavigate();

  const [rows, setRows] = useState<IListagemDepartamento[]>([]);
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
      DepartamentoService.getAll(pagina, busca).then((result) => {
        setIsLoading(false);
        if (result instanceof Error) {
          alert(result.message);
        } else {
          console.log(result);
          setTotalCount(result.totalCount);
          setRows(result.data);
        }
      });
    });
  }, [busca, pagina]);

  const handleDelete = (id: number, nome: string) => {
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
      title: "Deseja excluir ?",
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
        DepartamentoService.deleteById(id).then((result) => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            setRows((oldRows) => {
              return [...oldRows.filter((oldRow) => oldRow.id !== id)];
            });
            toast.success(` ${nome} Departamento excluído com sucesso!`);
          }
        });
      }
    });
  };

  return (
    <LayoutBaseDePagina
      titulo="Listagem de Departamento"
      barraDeFerramentas={
        /**
         * Faz com que o que seja digitado no imput de busca, seja adicionado
         * também a URL como parâmetro de navegação, usando o useMemo e useSearchParams
         */
        <FerramentasDaListagem
          mostrarInputBusca
          textoDaBusca={busca}
          textoBotaoNovo="Adicionar"
          aoClicarEmNovo={() => navigate("/departamento/detalhe/nova")}
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
              <TableCell width={100}>Ações</TableCell>
              <TableCell>Nome</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(row.id, row.nome)}
                  >
                    <Icon>delete</Icon>
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/departamento/detalhe/${row.id}`)}
                  >
                    <Icon>edit</Icon>
                  </IconButton>
                </TableCell>
                <TableCell>{row.nome}</TableCell>
              </TableRow>
            ))}
          </TableBody>

          {/* Só renderiza o Componente LISTAGEM_VAZIA se
                    for retornado 0 resultados e se a tela de loading não
                    estiver presente */}

          {totalCount === 0 && !isLoading && (
            <caption>{Enviroment.LISTAGEM_VAZIA}</caption>
          )}

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
