import { GridRowId } from "@mui/x-data-grid";
import { Enviroment } from "../../enviroment";
import { Api } from "./axios-config";

export interface IListagemRelatorio {
  id: number;
  origem: string;
  destino: string;
  data: string;
  qtd: number;
  numSerie: string;
  estConservacao: string;
  descricao?: string[];
  valor: number;
}
export interface IDetalheRelatorio {
  //id: number;
  estConservacao: string;
  arrayIds: any;
  pegarOrigemId: number | undefined;
  pegarDestinoId: number | undefined;
}
type TRelatorioComTotalCount = {
  data: IListagemRelatorio[];
  totalCount: number;
};
const getAll = async (
  inicialDate = "",
  finalDate = "",
  origemId = 0,
  estConservacao = ""
): Promise<TRelatorioComTotalCount | Error> => {
  try {
    const urlRelativa = `/bens?_date_between=${inicialDate}and${finalDate}&_origemId=${origemId}&estConservacao=${estConservacao}`;

    const { data, headers } = await Api.get(urlRelativa);
    console.log(data);
    if (data) {
      return {
        data,
        totalCount: Number(
          headers["x-total-count"] || Enviroment.LIMITE_DE_LINHAS
        ),
      };
    }
    return new Error("Erro ao listar os registros");
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao listar os registros"
    );
  }
};

const getById = async (id: number): Promise<IListagemRelatorio | Error> => {
  try {
    const { data } = await Api.get(`/movimentacao/${id}`);

    if (data) {
      return data;
    }
    return new Error("Erro ao consultar os registros");
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao consultar os registros"
    );
  }
};

export const RelatorioService = {
  getAll,
  getById,
};
