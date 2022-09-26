import { Enviroment } from "../../enviroment";
import { Api } from "./axios-config";

export interface IListagemUsuario {
  id: number;
  userName: string;
  nome?: string;
  role?: boolean;
  status?: boolean;
  avatarURL: string;
}
export interface IDetalheUsuario {
  id: number;
  userName: string;
  nome?: string;
  role?: boolean;
  status?: boolean;
  avatarURL: string;
}
type TUsuarioComTotalCount = {
  data: IListagemUsuario[];
  totalCount: number;
};

const getAll = async (
  page = 1,
  filter = ""
): Promise<TUsuarioComTotalCount | Error> => {
  try {
    //setor?limit=5&offset=0&role=admin
    const urlRelativa = `/usuario?offset=1&limit=${Enviroment.LIMITE_DE_LINHAS}&nome_like=${filter}`;

    const { data, headers } = await Api.get(urlRelativa);

    if (data) {
      return {
        data,
        totalCount: Number(
          headers["x-total-count"] || Enviroment.LIMITE_DE_LINHAS
        ),
      };
    }
    return new Error("Erro ao listar os usuários");
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao listar os usuários"
    );
  }
};

const getAllSelect = async (): Promise<IListagemUsuario | Error> => {
  try {
    const urlRelativa = "/usuario";

    const { data, headers } = await Api.get(urlRelativa);

    if (data) {
      return data;
    }
    return new Error("Erro ao listar os usuários");
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao listar os usuários"
    );
  }
};

const getById = async (id: number): Promise<IDetalheUsuario | Error> => {
  try {
    const { data } = await Api.get(`/usuario/${id}`);

    if (data) {
      return data;
    }
    return new Error("Erro ao consultar os usuários");
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao consultar os usuários"
    );
  }
};

const create = async (
  dados: Omit<IDetalheUsuario, "id">
): Promise<number | Error> => {
  try {
    const { data } = await Api.post<IDetalheUsuario>("/usuario/", dados);

    if (data) {
      return data.id;
    }
    return new Error("Erro ao criar o usuário");
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao criar o usuário"
    );
  }
};

const updateById = async (
  id: number,
  dados: IDetalheUsuario
): Promise<void | Error> => {
  try {
    await Api.put(`/usuario/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao atualizar o usuário"
    );
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await Api.delete(`/usuario/${id}`);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao apagar o usuário"
    );
  }
};

export const UsuarioService = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  getAllSelect,
};
