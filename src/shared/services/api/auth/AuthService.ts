import { Api } from "../axios-config";

interface IAuth {
  accessToken: string;
}

const auth = async (
  email: string,
  password: string
): Promise<IAuth | Error> => {
  try {
    const { data } = await Api.get("/auth", { data: { email, password } }); //post. email e senha no body no lugar do objeto data
    if (data) {
      return data;
    }

    return new Error("Erro ao autenticar");
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao autenticar"
    );
  }
};

export const AuthService = { auth };
