import {
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

export const ListagemDeInventario: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  /**Passar próx como ', false' cancela o firstDelay */
  const navigate = useNavigate();

  const [rows, setRows] = useState<IListagemBens[]>([]);
  const [isLoading, setIsLoading] = useState(true); //Feedback visual de carregamento
  const [totalCount, setTotalCount] = useState(0);
  const [setor_id_origem, setSetor_id_origem] = useState(0);

  const busca = useMemo(() => {
    return searchParams.get("busca") || "";
  }, [searchParams]);

  const pagina = useMemo(() => {
    return Number(searchParams.get("pagina") || "1");
  }, [searchParams]);

  useEffect(() => {
    setIsLoading(true);
    debounce(() => {
      BemService.getAllBySetor(Number(setor_id_origem)).then((result) => {
        setIsLoading(false);
        if (result instanceof Error) {
          alert(result.message);
        } else {
          console.log(result);

          setTotalCount(result.totalCount);
          setRows(result.data);
          setSetor_id_origem(result.data[0].setor_id);
          console.log("origem", setor_id_origem);
        }
      });
    });
  }, [busca, pagina]);

  return (
    <LayoutBaseDePagina
      titulo="Inventário"
      barraDeFerramentas={
        <FerramentasDaListagem
          textoDaBusca={busca}
          textoBotaoNovo="Nova"
          aoClicarEmNovo={() => navigate("/inventario/detalhe/nova")}
        />
      }
    >
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ m: 1, width: "auto" }}
      >
        <FerramentasDaListagem
          mostrarBotaoNovo={false}
          mostrarInputBusca
          aoMudarTextoDeBusca={(texto) =>
            setSearchParams({ busca: texto, pagina: "1" }, { replace: true })
          }
        />
      </TableContainer>
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
                <TableCell>{row.setor_id}</TableCell>
                <TableCell>{row.numSerie}</TableCell>
                <TableCell>{row.descricao}</TableCell>
                <TableCell>{row.marca}</TableCell>
                <TableCell>{row.modelo}</TableCell>
                <TableCell>{row.estConservacao}</TableCell>
                <TableCell>{row.valor}</TableCell>
              </TableRow>
            ))}
          </TableBody>
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
