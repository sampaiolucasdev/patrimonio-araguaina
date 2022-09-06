import { BrowserRouter } from "react-router-dom";
import "./shared/forms/TraducoesYup";
import { AppRoutes } from "./routes";
import { MenuLateral } from "./shared/components/menu-lateral/MenuLateral";
import { AuthProvider, DrawerProvider } from "./shared/contexts";
import { AppThemeProvider } from "./shared/contexts/ThemeContext";
import { Login } from "./shared/components/login/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const App = () => {
  return (
    <AuthProvider>
      <AppThemeProvider>
        <Login>
          <ToastContainer />
          <DrawerProvider>
            <BrowserRouter>
              <MenuLateral>
                <AppRoutes />
              </MenuLateral>
            </BrowserRouter>
          </DrawerProvider>
        </Login>
      </AppThemeProvider>
    </AuthProvider>
  );
};
