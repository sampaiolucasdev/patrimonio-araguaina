import {
  Icon,
  IconButton,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Box } from "@mui/system";
import { ReactNode } from "react";
import { useDrawerContext } from "../contexts";

interface ILayoutBaseDePaginaProps {
  titulo: string;
  barraDeFerramentas?: ReactNode;
}

export const LayoutBaseDePagina: React.FC<ILayoutBaseDePaginaProps> = ({
  children,
  titulo,
  barraDeFerramentas,
}) => {
  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
  const theme = useTheme();
  const { toggleDrawerOpen } = useDrawerContext();
  return (
    <Box height="100%" display="flex" flexDirection="column" gap={1}>
      <Box
        padding={1}
        display="flex"
        alignItems="center"
        gap={1}
        height={theme.spacing(smDown ? 6 : mdDown ? 8 : 12)}
      >
        {smDown && (
          <IconButton onClick={toggleDrawerOpen}>
            <Icon>menu</Icon>
          </IconButton>
        )}
        <Typography
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipses"
          variant={smDown ? "h5" : mdDown ? "h4" : "h3"}
          sx={{ flexGrow: 1, textAlign: "center", color: "#f9a825" }}
        >
          {titulo}
        </Typography>
      </Box>
      {
        barraDeFerramentas && (
          <Box>{barraDeFerramentas}</Box>
        ) /*Se eu não informar o 'barraDeFerramentas' o Box não será exibido */
      }
      <Box flex={1} overflow="auto" /* flex{1} ocupa todo o espaço disponível*/>
        {children}
      </Box>
    </Box>
  );
};
