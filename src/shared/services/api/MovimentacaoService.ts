import { Enviroment } from "../../enviroment";
import { Api } from "./axios-config";

export interface IListagemMovimentacao {
  id: number;
  nome: string;
}
export interface IDetalheMovimentacao {
  id: number;
  nome: string;
}
type TMovimentacaoComTotalCount = {
  data: IListagemMovimentacao[];
  totalCount: number;
};
const getAll = async (
  page = 1,
  filter = ""
): Promise<TMovimentacaoComTotalCount | Error> => {
  try {
    const urlRelativa = `/movimentacao?_page=${page}&_limit=${Enviroment.LIMITE_DE_LINHAS}&nome_like=${filter}`;

    const { data, headers } = await Api.get(urlRelativa);

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

const getById = async (id: number): Promise<IDetalheMovimentacao | Error> => {
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

const create = async (
  dados: Omit<IDetalheMovimentacao, "id">
): Promise<number | Error> => {
  try {
    const { data } = await Api.post<IDetalheMovimentacao>(
      "/movimentacao/",
      dados
    );

    if (data) {
      return data.id;
    }
    return new Error("Erro ao criar o registro");
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao criar o registro"
    );
  }
};

const updateById = async (
  id: number,
  dados: IDetalheMovimentacao
): Promise<void | Error> => {
  try {
    await Api.put(`/movimentacao/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao atualizar o registro"
    );
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await Api.delete(`/movimentacao/${id}`);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao apagar o registro"
    );
  }
};

export const MovimentacaoService = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};
