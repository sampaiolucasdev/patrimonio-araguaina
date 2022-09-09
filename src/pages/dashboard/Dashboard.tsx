import {
  Box,
  Card,
  CardContent,
  debounce,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { FerramentasDaListagem } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { BemService } from "../../shared/services/api/BemService";
import { MovimentacaoService } from "../../shared/services/api/MovimentacaoService";

export const Dashboard = () => {
  const [isLoadingPatrimonio, setIsLoadingPatrimonio] = useState(true);
  const [isLoadingMovimentacoes, setIsLoadingMovimentacoes] = useState(true);
  const [isLoadingDescarte, setIsLoadingDescarte] = useState(true);

  const [totalCountPatrimonio, setTotalCountPatrimonio] = useState(0);
  const [totalCountMovimentacoes, setTotalCountMovimentacoes] = useState(0);
  const [totalCountDescarte, setTotalCountDescarte] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();

  const busca = useMemo(() => {
    return searchParams.get("busca") || "";
  }, [searchParams]);

  const pagina = useMemo(() => {
    return Number(searchParams.get("pagina") || "1");
  }, [searchParams]);

  useEffect(() => {
    // setIsLoadingCidades(true);
    // setIsLoadingPessoas(true);
    const token: any = JSON.parse(
      localStorage.getItem("APP_ACCESS_TOKEN") || ""
    );
    const token2: any = token["access_token"];
    //console.log(token2);
  }, []);

  // console.log("patrimonio", totalCountPatrimonio);
  // console.log("movimentacoes", totalCountMovimentacoes);
  // console.log("descarte", totalCountDescarte);

  useEffect(() => {
    setIsLoadingPatrimonio(true);
    setIsLoadingMovimentacoes(true);
    setIsLoadingDescarte(true);

    //PATRIMONIO GERAL
    BemService.getAll(pagina, busca).then((result) => {
      setIsLoadingPatrimonio(false);
      if (result instanceof Error) {
        alert(result.message);
      } else {
        console.log(result);
        setTotalCountPatrimonio(result.totalCount);
      }
    });
    //MOVIMENTAÇÕES
    MovimentacaoService.getAll(pagina, busca).then((result) => {
      setIsLoadingMovimentacoes(false);
      //console.log(result);
      if (result instanceof Error) {
        alert(result.message);
      } else {
        setTotalCountMovimentacoes(result.totalCount);
      }
    });
    //BAIXAS DE PATRIMÔNIO
    BemService.getAllDescarte("Descarte").then((result) => {
      setIsLoadingDescarte(false);
      if (result instanceof Error) {
        alert(result.message);
      } else {
        //console.log("descarte", result);
        setTotalCountDescarte(result.totalCountDescarte);
      }
    });
  }, []);

  return (
    <LayoutBaseDePagina titulo="" barraDeFerramentas>
      <Box width="100%" display="flex">
        <Grid container margin={1}>
          <Grid item container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
              <Card>
                <CardContent>
                  <Typography variant="h5" align="center">
                    Patrimônio Geral
                  </Typography>
                  <Box
                    display="flex"
                    padding={0}
                    justifyContent="center"
                    alignItems="center"
                  >
                    {!isLoadingPatrimonio && (
                      <Typography variant="h1">
                        {totalCountPatrimonio}
                      </Typography>
                    )}

                    {isLoadingPatrimonio && (
                      <Typography variant="h6">Carregando...</Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
              <Card>
                <CardContent>
                  <Typography variant="h5" align="center">
                    Movimentações
                  </Typography>
                  <Box
                    display="flex"
                    padding={0}
                    justifyContent="center"
                    alignItems="center"
                  >
                    {!isLoadingMovimentacoes && (
                      <Typography variant="h1">
                        {totalCountMovimentacoes}
                      </Typography>
                    )}

                    {isLoadingMovimentacoes && (
                      <Typography variant="h6">Carregando...</Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
              <Card>
                <CardContent>
                  <Typography variant="h5" align="center">
                    Baixas de Patrimônio
                  </Typography>
                  <Box
                    display="flex"
                    padding={0}
                    justifyContent="center"
                    alignItems="center"
                  >
                    {!isLoadingDescarte && (
                      <Typography variant="h1">{totalCountDescarte}</Typography>
                    )}

                    {isLoadingDescarte && (
                      <Typography variant="h6">Carregando...</Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </LayoutBaseDePagina>
  );
};
