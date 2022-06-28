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
import { useMatch, useNavigate, useResolvedPath } from "react-router-dom";
import {
  useAppThemeContext,
  useAuthContext,
  useDrawerContext,
} from "../../contexts";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MoveUpIcon from "@mui/icons-material/MoveUp";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import InventoryIcon from "@mui/icons-material/Inventory";
import ApartmentIcon from "@mui/icons-material/Apartment";
import HealingIcon from "@mui/icons-material/Healing";
import FolderSpecialIcon from "@mui/icons-material/FolderSpecial";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AssessmentIcon from "@mui/icons-material/Assessment";

interface IListItemLinkProps {
  to: string;
  icon: string;
  label: string;
  onClick: (() => void) | undefined;
}
const ListItemLink: React.FC<IListItemLinkProps> = ({
  to,
  icon,
  label,
  onClick,
}) => {
  const navigate = useNavigate();

  const resolvedPath = useResolvedPath(to);
  const match = useMatch({ path: resolvedPath.pathname, end: false });

  const handleClick = () => {
    navigate(to);
    onClick?.(); //Se a função for undefined, não faz nada. Se não for, executa
  };
  return (
    <ListItemButton selected={!!match} onClick={handleClick}>
      <ListItemIcon>
        <Icon>{icon}</Icon>
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  );
};

export const MenuLateral: React.FC = ({ children }) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down("sm"));

  const { isDrawerOpen, toggleDrawerOpen, drawerOptions } = useDrawerContext();
  const { toggleTheme } = useAppThemeContext();
  const { logout } = useAuthContext();

  const [open, setOpen] = useState(true);
  const [openCadastro, setOpenCadastro] = useState(true);
  const [openCadastroAdmin, setOpenCadastroAdmin] = useState(true);
  const [openSUPAE, setOpenSUPAE] = useState(true);
  const [openSUPVISA, setOpenSUPVISA] = useState(true);

  const handleClickDrawer = () => {
    setOpen(!open);
  };
  const handleClickDrawerCadastro = () => {
    setOpenCadastro(!openCadastro);
  };
  const handleClickDrawerCadastroAdmin = () => {
    setOpenCadastroAdmin(!openCadastroAdmin);
  };
  const handleClickDrawerSUPAE = () => {
    setOpenSUPAE(!openSUPAE);
  };
  const handleClickDrawerSUPVISA = () => {
    setOpenSUPVISA(!openSUPVISA);
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
              src="https://cdn-icons-png.flaticon.com/512/1005/1005141.png"
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
              <ListItemButton sx={{ height: 30 }}>
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

              <ListItemButton sx={{ height: 30 }}>
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <AppRegistrationIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Cadastrar Bem"
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: "medium",
                    lineHeight: "20px",
                    mb: "2px",
                  }}
                />
              </ListItemButton>

              <ListItemButton sx={{ height: 30 }}>
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

              <ListItemButton onClick={handleClickDrawer} sx={{ height: 30 }}>
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
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>

              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding={true}>
                  <ListItemButton sx={{ pl: 3, heigth: 30 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <ApartmentIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Prédios Administrativos"
                      primaryTypographyProps={{
                        fontSize: 14,
                        lineHeight: "20px",
                        mb: "2px",
                      }}
                    />
                  </ListItemButton>
                </List>
                <List component="div" disablePadding={true}>
                  <ListItemButton sx={{ pl: 3, heigth: 30 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <HealingIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="UBS"
                      primaryTypographyProps={{
                        fontSize: 14,
                        lineHeight: "20px",
                        mb: "2px",
                      }}
                    />
                  </ListItemButton>
                </List>
              </Collapse>
              <ListItemButton sx={{ height: 30 }}>
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
              >
                <ListItemButton
                  sx={{ height: 30 }}
                  onClick={handleClickDrawerCadastroAdmin}
                >
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    <Icon>add</Icon>
                  </ListItemIcon>
                  <ListItemText
                    primary="Cadastro Geral"
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: "medium",
                      lineHeight: "20px",
                      mb: "2px",
                    }}
                  />
                  {openCadastroAdmin ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openCadastroAdmin} timeout="auto" unmountOnExit>
                  <ListItemButton sx={{ pl: 3, heigth: 30 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <FolderSpecialIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Cadastrar Organização"
                      primaryTypographyProps={{
                        fontSize: 14,
                        lineHeight: "20px",
                        mb: "2px",
                      }}
                    />
                  </ListItemButton>
                  <ListItemButton sx={{ pl: 3, heigth: 30 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <AddLocationIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Cadastrar Entidade"
                      primaryTypographyProps={{
                        fontSize: 14,
                        lineHeight: "20px",
                        mb: "2px",
                      }}
                    />
                  </ListItemButton>
                  <ListItemButton sx={{ pl: 3, heigth: 30 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <PersonAddIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Cadastrar Usuários"
                      primaryTypographyProps={{
                        fontSize: 14,
                        lineHeight: "20px",
                        mb: "2px",
                      }}
                    />
                  </ListItemButton>
                </Collapse>
              </List>
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
