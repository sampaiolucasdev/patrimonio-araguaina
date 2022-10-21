import dayjs from "dayjs";
import { Enviroment } from "../../enviroment";
import { Api } from "./axios-config";

export interface IListagemBens {
  id: number;
  descricao: string;
  marca: string;
  modelo: string;
  imagem: string | undefined;
  setor_id: number;
  estConservacao: string;
  valor: number;
  numSerie: string;
  dataCriacao?: string;
}
export interface IDetalheBens {
  id: number;
  descricao: string;
  marca: string;
  modelo: string;
  imagem: string | undefined;
  setor_id: number;
  estConservacao: string;
  valor: number;
  numSerie: string;
  dataCriacao?: string;
}
type TBensComTotalCount = {
  data: IListagemBens[];
  totalCount: number;
};
type TTotalCountDescarte = {
  totalCountDescarte: number;
};
const getAll = async (
  page = 1,
  filter = ""
): Promise<TBensComTotalCount | Error> => {
  try {
    const urlRelativa = `/bens?_page=${page}&_limit=${Enviroment.LIMITE_DE_LINHAS}&numSerie_like=${filter}`;

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

const getAllBySetor = async (
  page = 1,
  busca = "",
  setor_id = 0
): Promise<TBensComTotalCount | Error> => {
  try {
    const urlRelativa = `/bens?_page=${page}&_limit=${Enviroment.LIMITE_DE_LINHAS}&numSerie_like=${busca}&setor_id=${setor_id}`;

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

const getAllFiltered = async (
  initialDate: Date | null,
  finalDate: Date | null,
  pegarOrigemId = 0,
  estConservacao = ""
): Promise<TBensComTotalCount | Error> => {
  try {
    const urlRelativa = `/bens?_setorId=${pegarOrigemId}&_estConservacao=${estConservacao}&initialDate=${initialDate}&finalDate=${finalDate}&_limit=${Enviroment.LIMITE_DE_LINHAS}`;

    const { data, headers } = await Api.get("/bens", {
      params: {
        estConservacao,
        initialDate,
        finalDate,
        setor_id: pegarOrigemId,
        _limit: Enviroment.LIMITE_DE_LINHAS,
      },
    });

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
  estConservacao = ""
): Promise<TTotalCountDescarte | Error> => {
  try {
    const urlRelativa = `/bens?_page=1&_limit=${Enviroment.LIMITE_DE_LINHAS}&estConservacao=${estConservacao}`;

    const { data, headers } = await Api.get(urlRelativa);

    if (data) {
      return {
        totalCountDescarte: Number(headers["x-total-count"]),
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

const getAllDescarteBySetor = async (
  setor = 0,
  estConservacao = ""
): Promise<TTotalCountDescarte | Error> => {
  try {
    const urlRelativa = `/bens?_page=1&_limit=${Enviroment.LIMITE_DE_LINHAS}&estConservacao=${estConservacao}&setor_id=${setor}`;

    const { data, headers } = await Api.get(urlRelativa);

    if (data) {
      return {
        totalCountDescarte: Number(headers["x-total-count"]),
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

const getById = async (id: number): Promise<IDetalheBens | Error> => {
  try {
    const { data } = await Api.get(`/bens/${id}`);

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

//: Omit<IDetalheBens, "id">
const create = async (
  dados: IDetalheBens
  // dados: Omit<IDetalheBens, "id">
): Promise<number | Error> => {
  try {
    const { data } = await Api.post<IDetalheBens>("/bens/", dados);

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
  dados: IDetalheBens
): Promise<void | Error> => {
  try {
    await Api.put(`/bens/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao atualizar o registro"
    );
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await Api.delete(`/bens/${id}`);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao apagar o registro"
    );
  }
};

export const BemService = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  getAllBySetor,
  getAllDescarteBySetor,
  getAllDescarte,
  getAllFiltered,
};
