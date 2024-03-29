import {
  Icon,
  IconButton,
  LinearProgress,
  Pagination,
  Paper,
  Stack,
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
import { FerramentasDeDetalhe } from "../../shared/components";
import { Enviroment } from "../../shared/enviroment";
import { useDebounce } from "../../shared/hooks";
import { LayoutBaseDePagina } from "../../shared/layouts";
import InfoIcon from "@mui/icons-material/Info";
import {
  IListagemMovimentacao,
  MovimentacaoService,
} from "../../shared/services/api/MovimentacaoService";
import { PictureAsPdfOutlined } from "@mui/icons-material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

export const ListagemDeMovimentacao: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  /**Passar próx como ', false' cancela o firstDelay */
  const navigate = useNavigate();

  const [rows, setRows] = useState<IListagemMovimentacao[]>([]);
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
      MovimentacaoService.getAll(pagina, busca).then((result) => {
        setIsLoading(false);
        //console.log(result);
        if (result instanceof Error) {
          alert(result.message);
        } else {
          setTotalCount(result.totalCount);
          setRows(result.data);
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
      title: "Deseja excluir a movimentação?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      showDenyButton: false,
      confirmButtonText: "Sim",
      cancelButtonText: "Cancelar",
      denyButtonText: "Não",
    }).then((result) => {
      if (result.isConfirmed) {
        MovimentacaoService.deleteById(id).then((result) => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            setRows((oldRows) => {
              return [...oldRows.filter((oldRow) => oldRow.id !== id)];
            });
            toast.success("Movimentação apagada com sucesso!");
          }
        });
      }
    });
  };

  const doc = new jsPDF();

  autoTable(doc, {
    head: [["Número de Série", "Est de Conservação", "Descrição", "Valor"]],
    body: [],
  });

  return (
    <LayoutBaseDePagina
      titulo="Listagem de Movimentações"
      barraDeFerramentas={
        <FerramentasDeDetalhe
          mostrarInputBusca={false}
          mostrarBotaoSalvar={false}
          mostrarBotaoApagar={false}
          mostrarBotaoVoltar={false}
          aoClicarEmNovo={() => navigate("/movimentacao/nova")}
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
              <TableCell width={50}>Ações</TableCell>
              <TableCell>Origem</TableCell>
              <TableCell>Destino</TableCell>
              <TableCell>Data</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Stack direction="row">
                    <IconButton
                      size="small"
                      onClick={() =>
                        navigate(`/movimentacao/detalhe/${row.id}`)
                      }
                    >
                      <InfoIcon color={"info"} />
                    </IconButton>
                    <IconButton size="small">
                      <PictureAsPdfOutlined
                        color={"error"}
                        onClick={() => doc.save("table.pdf")}
                      />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(row.id)}
                    >
                      <Icon>delete</Icon>
                    </IconButton>
                  </Stack>
                </TableCell>
                <TableCell>{row.setor_id_origem}</TableCell>
                <TableCell>{row.setor_id_destino}</TableCell>
                <TableCell>{row.data}</TableCell>
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
