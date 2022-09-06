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
import { FerramentasDaListagem } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { MovimentacaoService } from "../../shared/services/api/MovimentacaoService";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export const DetalheDeMovimentacao: React.FC = () => {
  //const { id = "nova" } = useParams<"id">();
  const navigate = useNavigate();
  const data2 = new Date().toLocaleTimeString();
  const [isLoading, setIsLoading] = useState(true);
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [data, setData] = useState(data2);
  const [qnt, setQtd] = useState(0);
  const [numserie, setNumserie] = useState("");
  const [estconservacao, setEstconservacao] = useState("");
  const [descricao, setDescricao] = useState([""]);
  const [valor, setValor] = useState(0);
  const { id = "nova" } = useParams<"id">();

  useEffect(() => {
    if (id !== "nova") {
      setIsLoading(true);

      MovimentacaoService.getById(Number(id)).then((result) => {
        setIsLoading(false);
        if (result instanceof Error) {
          alert(result.message);
          navigate("/movimentacao");
        } else {
          setOrigem(result.origem);
          setDestino(result.destino);
          setData(result.data);
          setQtd(result.qtd);
          setNumserie(result.numSerie);
          setEstconservacao(result.estConservacao);
          setDescricao(result.descricao!);
          setValor(result.valor);
          //console.log(result);
        }
      });
    }
  }, [id]);
  //console.log(id);

  return (
    <LayoutBaseDePagina
      titulo="Listagem de Movimentações"
      barraDeFerramentas={
        /**
         * Faz com que o que seja digitado no imput de busca, seja adicionado
         * também a URL como parâmetro de navegação, usando o useMemo e useSearchParams
         */
        <FerramentasDaListagem
          textoBotaoNovo="Nova"
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
              <TableCell>Origem</TableCell>
              <TableCell>Destino</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Qtd</TableCell>
              <TableCell>Num Série</TableCell>
              <TableCell>Est. Conservação</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Valor</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{origem}</TableCell>
              <TableCell>{destino}</TableCell>
              <TableCell>{data}</TableCell>
              <TableCell>{qnt}</TableCell>
              <TableCell>{numserie}</TableCell>
              <TableCell>{estconservacao}</TableCell>
              <TableCell>{descricao}</TableCell>
              <TableCell>{valor}</TableCell>
            </TableRow>
          </TableBody>

          {/* Só renderiza o Componente LISTAGEM_VAZIA se
                    for retornado 0 resultados e se a tela de loading não
                    estiver presente */}

          <TableFooter>
            {isLoading && ( //Exibe a linha de loading somente quando está carregando
              <TableRow>
                <TableCell colSpan={3}>
                  <LinearProgress variant="indeterminate" />
                </TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell colSpan={3}></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </LayoutBaseDePagina>
  );
};
