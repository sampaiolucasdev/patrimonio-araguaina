import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AuthService } from "../services/api/auth/AuthService";


interface IAuthContextData {
  logout: () => void;
  isAutenticated: boolean;
  login: (email: string, password: string) => Promise<string | void>;
}
const AuthContext = createContext({} as IAuthContextData);
const LOCAL_STORAGE_KEY__ACCESSTOKEN = "APP_ACCESS_TOKEN";
const LOCAL_STORAGE_ROLE = "false";
interface IAuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string>();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY__ACCESSTOKEN);
    if (accessToken) {
      setAccessToken(JSON.parse(accessToken));
    } else {
      setAccessToken(undefined);
    }
  }, []);

  const handleLogin = useCallback(async (email: string, password: string) => {
    const result = await AuthService.auth(email, password);
    if (result instanceof Error) {
      return result.message;
    } else {
      localStorage.setItem(
        LOCAL_STORAGE_KEY__ACCESSTOKEN,
        JSON.stringify(result.accessToken)
      );
      setAccessToken(result.accessToken);
    }
  }, []);
  /**Funções que serão passadas em um contexto, por meio de parâmetros
   * precisa usar useCallback para não prejudicar o desempenho da aplicação */
  const handleLogout = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY__ACCESSTOKEN);
    setAccessToken("");
  }, []);

  const isAutenticated = useMemo(() => !!accessToken, [accessToken]);

  return (
    <AuthContext.Provider
      value={{ isAutenticated, login: handleLogin, logout: handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
