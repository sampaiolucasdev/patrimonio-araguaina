import { Enviroment } from "../../enviroment";
import { Api } from "./axios-config";

export interface IListagemInventario {
  id: number;
  nome: string;
}
export interface IDetalheInventario {
  id: number;
  nome: string;
}
type TInventarioComTotalCount = {
  data: IListagemInventario[];
  totalCount: number;
};

const getAll = async (
  page = 1,
  filter = ""
): Promise<TInventarioComTotalCount | Error> => {
  try {
    //inventario?limit=5&offset=0&role=admin
    const urlRelativa = `/inventario?offset=1&limit=${Enviroment.LIMITE_DE_LINHAS}&role=admin`;

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

const getAllDescarte = async (
  page = 1,
  filter = ""
): Promise<TInventarioComTotalCount | Error> => {
  try {
    //inventario?limit=5&offset=0&role=admin
    const urlRelativa = `/inventario?offset=1&limit=${Enviroment.LIMITE_DE_LINHAS}&estConservacao=4`;

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

const getAllSelect = async (): Promise<IListagemInventario | Error> => {
  try {
    const urlRelativa = "/inventario";

    const { data, headers } = await Api.get(urlRelativa);

    if (data) {
      return data;
    }
    return new Error("Erro ao listar os registros");
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao listar os registros"
    );
  }
};

const getById = async (id: number): Promise<IDetalheInventario | Error> => {
  try {
    const { data } = await Api.get(`/inventario/${id}`);

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
  dados: Omit<IDetalheInventario, "id">
): Promise<number | Error> => {
  try {
    const { data } = await Api.post<IDetalheInventario>("/inventario/", dados);

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
  dados: IDetalheInventario
): Promise<void | Error> => {
  try {
    await Api.put(`/inventario/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao atualizar o registro"
    );
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await Api.delete(`/inventario/${id}`);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao apagar o registro"
    );
  }
};

export const InventarioService = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  getAllSelect,
  getAllDescarte,
};
