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
  const [openSUPAB, setOpenSUPAB] = useState(true);
  const [openSUPADM, setOpenSUPADM] = useState(true);
  const [openSUPAE, setOpenSUPAE] = useState(true);
  const [openSUPVISA, setOpenSUPVISA] = useState(true);

  const handleClickDrawer = () => {
    setOpen(!open);
  };
  const handleClickDrawerSUPAB = () => {
    setOpenSUPAB(!openSUPAB);
  };
  const handleClickDrawerSUPADM = () => {
    setOpenSUPADM(!openSUPADM);
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
          <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          >
            <ListItemButton>
              <ListItemIcon>
                <Icon>home</Icon>
              </ListItemIcon>
              <ListItemText primary="Página Inicial" />
            </ListItemButton>

            <ListItemButton>
              <ListItemIcon>
                <Icon>add</Icon>
              </ListItemIcon>
              <ListItemText primary="Cadastrar Patrimônio" />
            </ListItemButton>

            <ListItemButton>
              <ListItemIcon>
                <MoveUpIcon />
              </ListItemIcon>
              <ListItemText primary="Registrar Movimentação" />
            </ListItemButton>
            {/* MULTILEVEL GERAL */}
            <ListItemButton onClick={handleClickDrawer}>
              <ListItemIcon>
                <Icon>storage</Icon>
              </ListItemIcon>
              <ListItemText primary="Relação de Bens" />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={open} timeout="auto" unmountOnExit>
              {/* MULTILEVEL SUPAB */}
              <List component="div" disablePadding={true}>
                <ListItemButton sx={{ pl: 4 }} onClick={handleClickDrawerSUPAB}>
                  <ListItemIcon>
                    <LocationOnIcon />
                  </ListItemIcon>
                  <ListItemText primary="SUPAB" />
                  {openSUPAB ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                {/* FILHOS SUPAB */}
                <Collapse in={openSUPAB} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding={true}>
                    <ListItemButton sx={{ pl: 6 }}>
                      <ListItemIcon>
                        <LocationOnIcon />
                      </ListItemIcon>
                      <ListItemText primary="Salão" />
                    </ListItemButton>
                  </List>
                  <List component="div" disablePadding={true}>
                    <ListItemButton sx={{ pl: 6 }}>
                      <ListItemIcon>
                        <LocationOnIcon />
                      </ListItemIcon>
                      <ListItemText primary="Diretoria" />
                    </ListItemButton>
                  </List>
                  <List component="div" disablePadding={true}>
                    <ListItemButton sx={{ pl: 6 }}>
                      <ListItemIcon>
                        <LocationOnIcon />
                      </ListItemIcon>
                      <ListItemText primary="Logística" />
                    </ListItemButton>
                  </List>
                </Collapse>
                {/* MULTILEVEL SUPVISA */}
              </List>
              <List component="div" disablePadding={true}>
                <ListItemButton
                  sx={{ pl: 4 }}
                  onClick={handleClickDrawerSUPVISA}
                >
                  <ListItemIcon>
                    <LocationOnIcon />
                  </ListItemIcon>
                  <ListItemText primary="SUPVISA" />
                  {openSUPVISA ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                {/* FILHOS SUPVISA */}
                <Collapse in={openSUPVISA} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding={true}>
                    <ListItemButton sx={{ pl: 6 }}>
                      <ListItemIcon>
                        <LocationOnIcon />
                      </ListItemIcon>
                      <ListItemText primary="Sede" />
                    </ListItemButton>
                  </List>
                  <List component="div" disablePadding={true}>
                    <ListItemButton sx={{ pl: 6 }}>
                      <ListItemIcon>
                        <LocationOnIcon />
                      </ListItemIcon>
                      <ListItemText primary="Vigilância Epidemiológica" />
                    </ListItemButton>
                  </List>
                  <List component="div" disablePadding={true}>
                    <ListItemButton sx={{ pl: 6 }}>
                      <ListItemIcon>
                        <LocationOnIcon />
                      </ListItemIcon>
                      <ListItemText primary="Vigilância Ambiental" />
                    </ListItemButton>
                  </List>
                  <List component="div" disablePadding={true}>
                    <ListItemButton sx={{ pl: 6 }}>
                      <ListItemIcon>
                        <LocationOnIcon />
                      </ListItemIcon>
                      <ListItemText primary="Vigilância Sanitária" />
                    </ListItemButton>
                  </List>
                  <List component="div" disablePadding={true}>
                    <ListItemButton sx={{ pl: 6 }}>
                      <ListItemIcon>
                        <LocationOnIcon />
                      </ListItemIcon>
                      <ListItemText primary="CCZ" />
                    </ListItemButton>
                  </List>
                  <List component="div" disablePadding={true}>
                    <ListItemButton sx={{ pl: 6 }}>
                      <ListItemIcon>
                        <LocationOnIcon />
                      </ListItemIcon>
                      <ListItemText primary="CEREST" />
                    </ListItemButton>
                  </List>
                </Collapse>
                {/* MULTILEVEL SUPADM */}
              </List>
              <List
                component="div"
                disablePadding={true}
                onClick={handleClickDrawerSUPADM}
              >
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <LocationOnIcon />
                  </ListItemIcon>
                  <ListItemText primary="SUPADM" />
                  {openSUPADM ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                {/* FILHOS SUPADM */}
                <Collapse in={openSUPADM} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding={true}>
                    <ListItemButton sx={{ pl: 6 }}>
                      <ListItemIcon>
                        <LocationOnIcon />
                      </ListItemIcon>
                      <ListItemText primary="Sede" />
                    </ListItemButton>
                  </List>
                  <List component="div" disablePadding={true}>
                    <ListItemButton sx={{ pl: 6 }}>
                      <ListItemIcon>
                        <LocationOnIcon />
                      </ListItemIcon>
                      <ListItemText primary="Ouvidoria" />
                    </ListItemButton>
                  </List>
                  <List component="div" disablePadding={true}>
                    <ListItemButton sx={{ pl: 6 }}>
                      <ListItemIcon>
                        <LocationOnIcon />
                      </ListItemIcon>
                      <ListItemText primary="NAT" />
                    </ListItemButton>
                  </List>
                  <List component="div" disablePadding={true}>
                    <ListItemButton sx={{ pl: 6 }}>
                      <ListItemIcon>
                        <LocationOnIcon />
                      </ListItemIcon>
                      <ListItemText primary="DIRECON" />
                    </ListItemButton>
                  </List>
                  <List component="div" disablePadding={true}>
                    <ListItemButton sx={{ pl: 6 }}>
                      <ListItemIcon>
                        <LocationOnIcon />
                      </ListItemIcon>
                      <ListItemText primary="Manutenção" />
                    </ListItemButton>
                  </List>
                  <List component="div" disablePadding={true}>
                    <ListItemButton sx={{ pl: 6 }}>
                      <ListItemIcon>
                        <LocationOnIcon />
                      </ListItemIcon>
                      <ListItemText primary="RH" />
                    </ListItemButton>
                  </List>
                  <List component="div" disablePadding={true}>
                    <ListItemButton sx={{ pl: 6 }}>
                      <ListItemIcon>
                        <LocationOnIcon />
                      </ListItemIcon>
                      <ListItemText primary="NEP" />
                    </ListItemButton>
                  </List>
                  <List component="div" disablePadding={true}>
                    <ListItemButton sx={{ pl: 6 }}>
                      <ListItemIcon>
                        <LocationOnIcon />
                      </ListItemIcon>
                      <ListItemText primary="ASSEJUR" />
                    </ListItemButton>
                  </List>
                  <List component="div" disablePadding={true}>
                    <ListItemButton sx={{ pl: 6 }}>
                      <ListItemIcon>
                        <LocationOnIcon />
                      </ListItemIcon>
                      <ListItemText primary="Compras" />
                    </ListItemButton>
                  </List>
                  <List component="div" disablePadding={true}>
                    <ListItemButton sx={{ pl: 6 }}>
                      <ListItemIcon>
                        <LocationOnIcon />
                      </ListItemIcon>
                      <ListItemText primary="TI" />
                    </ListItemButton>
                  </List>
                  <List component="div" disablePadding={true}>
                    <ListItemButton sx={{ pl: 6 }}>
                      <ListItemIcon>
                        <LocationOnIcon />
                      </ListItemIcon>
                      <ListItemText primary="Transporte" />
                    </ListItemButton>
                  </List>
                  <List component="div" disablePadding={true}>
                    <ListItemButton sx={{ pl: 6 }}>
                      <ListItemIcon>
                        <LocationOnIcon />
                      </ListItemIcon>
                      <ListItemText primary="Auditoria" />
                    </ListItemButton>
                  </List>
                  <List component="div" disablePadding={true}>
                    <ListItemButton sx={{ pl: 6 }}>
                      <ListItemIcon>
                        <LocationOnIcon />
                      </ListItemIcon>
                      <ListItemText primary="Keila" />
                    </ListItemButton>
                  </List>
                  <List component="div" disablePadding={true}>
                    <ListItemButton sx={{ pl: 6 }}>
                      <ListItemIcon>
                        <LocationOnIcon />
                      </ListItemIcon>
                      <ListItemText primary="Planejamento" />
                    </ListItemButton>
                  </List>
                  <List component="div" disablePadding={true}>
                    <ListItemButton sx={{ pl: 6 }}>
                      <ListItemIcon>
                        <LocationOnIcon />
                      </ListItemIcon>
                      <ListItemText primary="Financeiro" />
                    </ListItemButton>
                  </List>
                  <List component="div" disablePadding={true}>
                    <ListItemButton sx={{ pl: 6 }}>
                      <ListItemIcon>
                        <LocationOnIcon />
                      </ListItemIcon>
                      <ListItemText primary="Teleatendimento" />
                    </ListItemButton>
                  </List>
                  <List component="div" disablePadding={true}>
                    <ListItemButton sx={{ pl: 6 }}>
                      <ListItemIcon>
                        <LocationOnIcon />
                      </ListItemIcon>
                      <ListItemText primary="Centro Logístico" />
                    </ListItemButton>
                  </List>
                  <List component="div" disablePadding={true}>
                    <ListItemButton sx={{ pl: 6 }}>
                      <ListItemIcon>
                        <LocationOnIcon />
                      </ListItemIcon>
                      <ListItemText primary="Depósito Patrimônio" />
                    </ListItemButton>
                  </List>
                </Collapse>
                {/* MULTILEVEL SUPAE */}
              </List>
              <List
                component="div"
                disablePadding={true}
                onClick={handleClickDrawerSUPAE}
              >
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <LocationOnIcon />
                  </ListItemIcon>
                  <ListItemText primary="SUPAE" />
                  {openSUPAE ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                {/* FILHOS SUPAE */}
                <Collapse in={openSUPAE} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding={true}>
                    <ListItemButton sx={{ pl: 6 }}>
                      <ListItemIcon>
                        <LocationOnIcon />
                      </ListItemIcon>
                      <ListItemText primary="Sede" />
                    </ListItemButton>
                  </List>
                  <List component="div" disablePadding={true}>
                    <ListItemButton sx={{ pl: 6 }}>
                      <ListItemIcon>
                        <LocationOnIcon />
                      </ListItemIcon>
                      <ListItemText primary="CAPS AD III" />
                    </ListItemButton>
                  </List>
                  <List component="div" disablePadding={true}>
                    <ListItemButton sx={{ pl: 6 }}>
                      <ListItemIcon>
                        <LocationOnIcon />
                      </ListItemIcon>
                      <ListItemText primary="Regulação" />
                    </ListItemButton>
                  </List>
                  <List component="div" disablePadding={true}>
                    <ListItemButton sx={{ pl: 6 }}>
                      <ListItemIcon>
                        <LocationOnIcon />
                      </ListItemIcon>
                      <ListItemText primary="SAMU" />
                    </ListItemButton>
                  </List>
                  <List component="div" disablePadding={true}>
                    <ListItemButton sx={{ pl: 6 }}>
                      <ListItemIcon>
                        <LocationOnIcon />
                      </ListItemIcon>
                      <ListItemText primary="CEO" />
                    </ListItemButton>
                  </List>
                  <List component="div" disablePadding={true}>
                    <ListItemButton sx={{ pl: 6 }}>
                      <ListItemIcon>
                        <LocationOnIcon />
                      </ListItemIcon>
                      <ListItemText primary="Centro de Fisioterapia" />
                    </ListItemButton>
                  </List>
                  <List component="div" disablePadding={true}>
                    <ListItemButton sx={{ pl: 6 }}>
                      <ListItemIcon>
                        <LocationOnIcon />
                      </ListItemIcon>
                      <ListItemText primary="Clinica Mundo Autista" />
                    </ListItemButton>
                  </List>
                </Collapse>
              </List>
              <List component="div" disablePadding={true}>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <LocationOnIcon />
                  </ListItemIcon>
                  <ListItemText primary="Gabinete" />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
          <Box>
            <List component="nav">
              <ListItemButton onClick={toggleTheme}>
                <ListItemIcon>
                  <Icon>dark_mode</Icon>
                </ListItemIcon>
                <ListItemText primary="Alternar Tema" />
              </ListItemButton>
              <ListItemButton onClick={logout}>
                <ListItemIcon>
                  <Icon>logout</Icon>
                </ListItemIcon>
                <ListItemText primary="Sair" />
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
