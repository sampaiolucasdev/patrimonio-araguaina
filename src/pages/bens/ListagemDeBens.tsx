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
  BemService,
  IListagemBens,
} from "../../shared/services/api/BemService";

export const ListagemDeBens: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  /**Passar próx como ', false' cancela o firstDelay */
  const navigate = useNavigate();

  const [rows, setRows] = useState<IListagemBens[]>([]);
  const [isLoading, setIsLoading] = useState(true); //Feedback visual de carregamento
  const [totalCount, setTotalCount] = useState(0);
  const [searchOrigem, setSearchOrigem] = useState("");

  const busca = useMemo(() => {
    return searchParams.get("busca") || "";
  }, [searchParams]);

  const pagina = useMemo(() => {
    return Number(searchParams.get("pagina") || "1");
  }, [searchParams]);
  useEffect(() => {
    setIsLoading(true);
    debounce(() => {
      BemService.getAllBySetor(pagina, busca, Number(searchOrigem)).then(
        (result) => {
          setIsLoading(false);
          if (result instanceof Error) {
            alert(result.message);
          } else {
            console.log(result);

            setTotalCount(result.totalCount);
            setRows(result.data);
            setSearchOrigem(result.data[0].origem);
            console.log("origem", searchOrigem);
          }
        }
      );
    });
  }, [busca, pagina]);

  // const handleDelete = (id: number) => {
  //   /**
  //    * deleteById retorna uma promessa de resultado ou erro.
  //    * Quando (.then) essa promessa ocorrer, vai ter um result
  //    * Se esse result é uma instância de erro, então, alert
  //    * mostrando o error na message. Se não, vai dar um setState(serRows)
  //    * pegando o registro com o id específico que foi apagado, retorna um novo
  //    * state com todas as linhas do state anterior(...), filtrando exceto
  //    * a linha com o id que está sendo apagado (oldRow.id !== id).
  //    */
  //   if (confirm("Deseja apagar?")) {
  //     BemService.deleteById(id).then((result) => {
  //       if (result instanceof Error) {
  //         alert(result.message);
  //       } else {
  //         setRows((oldRows) => {
  //           return [...oldRows.filter((oldRow) => oldRow.id !== id)];
  //         });
  //         alert("Registro apagado com sucesso!");
  //       }
  //     });
  //   }
  // };

  return (
    <LayoutBaseDePagina
      titulo="Listagem de Bens"
      barraDeFerramentas={
        /**
         * Faz com que o que seja digitado no imput de busca, seja adicionado
         * também a URL como parâmetro de navegação, usando o useMemo e useSearchParams
         */
        <FerramentasDaListagem
          mostrarInputBusca
          textoDaBusca={busca}
          textoBotaoNovo="Nova"
          aoClicarEmNovo={() => navigate("/bens/detalhe/nova")}
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
              <TableCell width={100}>Origem</TableCell>
              <TableCell>Número de Série</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Marca</TableCell>
              <TableCell>Modelo</TableCell>
              <TableCell>Estado de Conservação</TableCell>
              <TableCell>Valor</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.origem}</TableCell>
                <TableCell>{row.numSerie}</TableCell>
                <TableCell>{row.descricao}</TableCell>
                <TableCell>{row.marca}</TableCell>
                <TableCell>{row.modelo}</TableCell>
                <TableCell>{row.estConservacao}</TableCell>
                <TableCell>{row.valor}</TableCell>
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
