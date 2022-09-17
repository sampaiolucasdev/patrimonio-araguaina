import {
  Avatar,
  Box,
  Collapse,
  Divider,
  Drawer,
  Icon,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAppThemeContext,
  useAuthContext,
  useDrawerContext,
} from "../../contexts";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import MoveUpIcon from "@mui/icons-material/MoveUp";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import InventoryIcon from "@mui/icons-material/Inventory";
import ApartmentIcon from "@mui/icons-material/Apartment";
import HealingIcon from "@mui/icons-material/Healing";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import AssessmentIcon from "@mui/icons-material/Assessment";
import prefeituraLogo from "../../../assets/prefeitura-logo-redonda.png";
import PieChartIcon from "@mui/icons-material/PieChart";

export const MenuLateral: React.FC = ({ children }) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down("sm"));

  const { isDrawerOpen, toggleDrawerOpen } = useDrawerContext();
  const { toggleTheme } = useAppThemeContext();
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  const [openInventario, setOpenInventario] = useState(false);
  const [openCadastro, setOpenCadastro] = useState(false);

  const handleClickDrawerInventario = () => {
    setOpenInventario(!openInventario);
    openCadastro ? setOpenCadastro(!openCadastro) : null;
  };
  const handleClickDrawerCadastro = () => {
    setOpenCadastro(!openCadastro);
    openInventario ? setOpenInventario(!openInventario) : null;
  };

  return (
    <>
      <Drawer
        open={isDrawerOpen}
        variant={smDown ? "temporary" : "permanent"}
        onClose={toggleDrawerOpen}
      >
        <Box
          width={theme.spacing(28)}
          height="100%"
          display="flex"
          flexDirection="column"
        >
          <Box
            width="100%"
            height={theme.spacing(20)}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Avatar
              sx={{
                height: theme.spacing(12),
                width: theme.spacing(12),
              }}
              src={prefeituraLogo}
            />
          </Box>
          <Divider />
          <Box flex={1}>
            <List
              component="nav"
              aria-labelledby="nested-list-subheader"
              sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Navegação
                </ListSubheader>
              }
            >
              <ListItemButton
                sx={{ height: 30 }}
                onClick={() => navigate("/pagina-inicial")}
              >
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <Icon>home</Icon>
                </ListItemIcon>
                <ListItemText
                  primary="Página Inicial"
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: "medium",
                    lineHeight: "20px",
                    mb: "2px",
                  }}
                />
              </ListItemButton>
              <ListItemButton
                sx={{ height: 30 }}
                onClick={handleClickDrawerCadastro}
              >
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <AppRegistrationIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Cadastros"
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: "medium",
                    lineHeight: "20px",
                    mb: "2px",
                  }}
                />
                {openCadastro ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openCadastro} timeout="auto" unmountOnExit>
                <ListItemButton
                  sx={{ pl: 3, heigth: 30 }}
                  onClick={() => navigate("/departamento")}
                >
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Departamento"
                    primaryTypographyProps={{
                      fontSize: 14,
                      lineHeight: "20px",
                      mb: "2px",
                    }}
                  />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 3, heigth: 30 }}
                  onClick={() => navigate("/setor")}
                >
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    <PieChartIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Setor"
                    primaryTypographyProps={{
                      fontSize: 14,
                      lineHeight: "20px",
                      mb: "2px",
                    }}
                  />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 3, heigth: 30 }}
                  onClick={() => navigate("/usuario")}
                >
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Usuário"
                    primaryTypographyProps={{
                      fontSize: 14,
                      lineHeight: "20px",
                      mb: "2px",
                    }}
                  />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 3, heigth: 30 }}
                  onClick={() => navigate("/bens/detalhe/nova")}
                >
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Bem"
                    primaryTypographyProps={{
                      fontSize: 14,
                      lineHeight: "20px",
                      mb: "2px",
                    }}
                  />
                </ListItemButton>
              </Collapse>

              <ListItemButton
                sx={{ height: 30 }}
                onClick={() => navigate("/movimentacao")}
              >
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <MoveUpIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Movimentações"
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: "medium",
                    lineHeight: "20px",
                    mb: "2px",
                  }}
                />
              </ListItemButton>

              <ListItemButton
                sx={{ height: 30 }}
                onClick={() => navigate("/inventario")}
              >
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <InventoryIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Inventário"
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: "medium",
                    lineHeight: "20px",
                    mb: "2px",
                  }}
                />
              </ListItemButton>

              <ListItemButton
                sx={{ height: 30 }}
                onClick={() => navigate("/relatorios")}
              >
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <AssessmentIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Relatórios"
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: "medium",
                    lineHeight: "20px",
                    mb: "2px",
                  }}
                />
              </ListItemButton>
            </List>
            <Box>
              <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                }}
                subheader={
                  <ListSubheader component="div" id="nested-list-subheader">
                    Administrador
                  </ListSubheader>
                }
              ></List>
            </Box>
          </Box>
          <Box>
            <List component="nav">
              <ListItemButton onClick={toggleTheme} sx={{ height: 30 }}>
                <ListItemIcon>
                  <Icon>dark_mode</Icon>
                </ListItemIcon>
                <ListItemText
                  primary="Alternar Tema"
                  primaryTypographyProps={{
                    fontSize: 15,
                    fontWeight: "medium",
                    lineHeight: "20px",
                    mb: "2px",
                  }}
                />
              </ListItemButton>
              <ListItemButton onClick={logout} sx={{ height: 30 }}>
                <ListItemIcon>
                  <Icon>logout</Icon>
                </ListItemIcon>
                <ListItemText
                  primary="Sair"
                  primaryTypographyProps={{
                    fontSize: 15,
                    fontWeight: "medium",
                    lineHeight: "20px",
                    mb: "2px",
                  }}
                />
              </ListItemButton>
            </List>
          </Box>
        </Box>
      </Drawer>

      <Box height="100vh" marginLeft={smDown ? 0 : theme.spacing(28)}>
        {children}
      </Box>
    </>
  );
};
