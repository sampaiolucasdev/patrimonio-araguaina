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
import {
  FerramentasDaListagem,
  FerramentasDeDetalhe,
} from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { MovimentacaoService } from "../../shared/services/api/MovimentacaoService";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { PictureAsPdfOutlined } from "@mui/icons-material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import timbradoSaude from "./../../assets/timbradoSaude.png";

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

  const doc = new jsPDF();
  doc.setFontSize(12);
  doc.addImage(timbradoSaude, "PNG", 5, 0, 200, 300);
  doc.text("GUIA DE MOVIMENTAÇÃO DE BEM PATRIMONIAL", 105, 60, { align: "center" });
  doc.text("Araguaína, 12 de Setembro de 2022", 105, 255, { align: "left" });

  autoTable(doc, {
    theme: "grid",
    margin: { top: 70 },
    headStyles: {
      cellWidth: 91,
      halign: "center",
    },
    columnStyles: {
      0: { halign: "center" },
      1: { halign: "center" },
    },
    head: [["DEPARTAMENTO CEDENTE", "DEPARTAMENTO RECEPTOR"]],
    body: [[origem, destino]],
  });
  
  autoTable(doc, {
    theme: "grid",
    margin: { top: 30 },
    columnStyles: {
      0: { halign: "left" },
      1: { halign: "center" },
      2: { halign: "left" },
      3: { halign: "center" },
    },
    head: [["Plaqueta", "Conservação", "Descrição", "Valor"]],
    body: [[numserie, estconservacao, descricao, valor]],
  });
  //doc.save("autoprint.pdf");
  
  autoTable(doc, {
    theme: "grid",
    margin: { bottom: 100 },
    headStyles: {
      cellWidth: 60.6,
      halign: "center",
    },
    columnStyles: {
      0: { halign: "center", minCellHeight: 20, valign: "bottom" },
      1: { halign: "center", minCellHeight: 20, valign: "bottom" },
      2: { halign: "center", minCellHeight: 20, valign: "bottom" },
    },
    head: [
      ["GESTOR(A) RESPONSÁVEL", "GESTOR(A) CEDENTE", "GESTOR(A) RECEPTOR(A)"],
    ],
    body: [
      [
        "________________________",
        "________________________",
        "________________________",
      ],
    ],
  });

  return (
    <LayoutBaseDePagina
      titulo="Listagem de Movimentações"
      barraDeFerramentas={
        /**
         * Faz com que o que seja digitado no imput de busca, seja adicionado
         * também a URL como parâmetro de navegação, usando o useMemo e useSearchParams
         */

        <FerramentasDeDetalhe
          mostrarInputBusca={false}
          mostrarBotaoSalvar={false}
          mostrarBotaoApagar={false}
          mostrarBotaoVoltar={true}
          aoClicarEmVoltar={() => navigate("/movimentacao")}
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
              <TableCell>Ações</TableCell>
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
              <TableCell>
                <IconButton
                  size="small"
                  onClick={() => navigate("/movimentacao")}
                >
                  <PictureAsPdfOutlined
                    color={"error"}
                    onClick={() => doc.output("pdfobjectnewwindow")}
                  />
                </IconButton>
              </TableCell>
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
};;
