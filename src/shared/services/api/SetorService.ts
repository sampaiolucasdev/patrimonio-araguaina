import { Enviroment } from "../../enviroment";
import { Api } from "./axios-config";

export interface IListagemSetor {
  id: number;
  nome: string;
}
export interface IDetalheSetor {
  id: number;
  nome: string;
}
type TSetorComTotalCount = {
  data: IListagemSetor[];
  totalCount: number;
};

const getAll = async (
  page = 1,
  filter = ""
): Promise<TSetorComTotalCount | Error> => {
  try {
    const urlRelativa = `/setor?_page=${page}&_limit=${Enviroment.LIMITE_DE_LINHAS}&nome_like=${filter}`;

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

const getById = async (id: number): Promise<IDetalheSetor | Error> => {
  try {
    const { data } = await Api.get(`/setor/${id}`);

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
  dados: Omit<IDetalheSetor, "id">
): Promise<number | Error> => {
  try {
    const { data } = await Api.post<IDetalheSetor>("/setor/", dados);

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
  dados: IDetalheSetor
): Promise<void | Error> => {
  try {
    await Api.put(`/setor/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao atualizar o registro"
    );
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await Api.delete(`/setor/${id}`);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao apagar o registro"
    );
  }
};

export const SetorService = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};
