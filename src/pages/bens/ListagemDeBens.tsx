/* eslint-disable indent */
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";
import { DataGrid, ptBR } from "@mui/x-data-grid";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { VForm, useVForm } from "../../shared/forms";
import { FerramentasDeDetalhe } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import {
  BemService,
  IListagemBens,
} from "../../shared/services/api/BemService";
import { useDebounce } from "../../shared/hooks";
import { AutoCompleteOrigem } from "../movimentacoes/components/AutoCompleteOrigem";

export const ListagemDeBens: React.FC = () => {
  const { formRef, saveAndClose, isSaveAndClose } = useVForm();
  const { id = "nova" } = useParams<"id">();
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [nome, setNome] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [totalCountDescarte, setTotalCountDescarte] = useState(0);
  const [searchByOrigem, setSearchByOrigem] = useState<IListagemBens[]>([]);
  const [setor_id_origem, setSetor_id_origem] = useState<number | undefined>();
  const [estConservacao, setEstConservacao] = useState("");

  //console.log("arrayIds", arrayIds);
  const [isLoadingPessoas, setIsLoadingPessoas] = useState(true);

  const busca = useMemo(() => {
    return searchParams.get("busca") || "";
  }, [searchParams]);

  const pagina = useMemo(() => {
    return Number(searchParams.get("pagina") || "1");
  }, [searchParams]);

  //console.log("aquii", pegarOrigemId);

  useEffect(() => {
    setIsLoading(true);
    debounce(() => {
      BemService.getAllBySetor(pagina, busca, setor_id_origem).then(
        (result) => {
          setIsLoading(false);
          if (result instanceof Error) {
            alert(result.message);
          } else {
            console.log(result);
            setTotalCount(result.totalCount);
            setSearchByOrigem(result.data);
            // setSearchOrigem(result.data[0].origem);
            // console.log("origem", searchOrigem);
          }
        }
      );

      BemService.getAllDescarteBySetor(setor_id_origem, "Descarte").then(
        (result) => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            console.log("descarte", result);
            setTotalCountDescarte(result.totalCountDescarte);
          }
        }
      );
    });
  }, [busca, pagina, setor_id_origem]);

  // useEffect(() => {
  //   setIsLoading(true);
  //   debounce(() => {
  //     BemService.getAllDescarteBySetor(pegarOrigemId).then((result) => {
  //       setIsLoading(false);
  //       if (result instanceof Error) {
  //         alert(result.message);
  //       } else {
  //         //console.log(result);
  //         setTotalCountDescarte(result.totalCountDescarte);
  //       }
  //     });
  //   });
  // }, [busca, pagina, pegarOrigemId]);

  const columns = [
    { field: "numSerie", headerName: "Número de Série", width: 130 },
    {
      field: "estConservacao",
      headerName: "Estado de Conservação",
      width: 190,
      editable: false,
    },
    {
      field: "descricao",
      headerName: "Descrição",
      width: 150,
      editable: false,
    },
    {
      field: "valor",
      headerName: "Valor",
      type: "number",
      width: 110,
      editable: false,
    },
  ];

  searchByOrigem.map((row) => [
    {
      id: row.id,
      numSerie: row.numSerie,
      estConservacao: row.estConservacao,
      descricao: row.descricao,
      valor: row.valor,
    },
  ]);

  return (
    <LayoutBaseDePagina
      titulo={"Listagem de Inventário"}
      barraDeFerramentas={
        <FerramentasDeDetalhe
          mostrarInputBusca
          mostrarBotaoSalvar={false}
          mostrarBotaoNovo={false}
          textoDaBusca={busca}
          mostrarBotaoApagar={id !== "nova"}
          aoClicarEmVoltar={() => navigate("/*")}
          aoMudarTextoDeBusca={(texto) =>
            setSearchParams({ busca: texto, pagina: "1" }, { replace: true })
          }
        />
      }
    >
      <VForm
        ref={formRef}
        onSubmit={() => {
          undefined;
        }}
      >
        <Box
          margin={1}
          display="flex"
          flexDirection="column"
          component={Paper}
          variant="outlined"
        >
          <Grid container direction="column" padding={2} spacing={2}>
            {isLoading && (
              <Grid item>
                <LinearProgress variant="indeterminate" />
              </Grid>
            )}

            <Grid item>
              <Typography variant="h6">Detalhes do Inventário</Typography>
            </Grid>

            <Grid container item spacing={2}>
              <Grid item xs={6} sm={12} md={6} lg={4} xl={2}>
                <AutoCompleteOrigem
                  onChange={(id) => setSetor_id_origem(id)}
                  isExternalLoading={isLoading}
                />
              </Grid>
              <Grid item xs={6} sm={12} md={6} lg={4} xl={2}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" align="center">
                      Total de Bens do Setor
                    </Typography>
                    <Box
                      display="flex"
                      padding={1}
                      justifyContent="center"
                      alignItems="center"
                    >
                      {!isLoading && (
                        <Typography variant="h2">{totalCount}</Typography>
                      )}

                      {isLoading && (
                        <Typography variant="h6">Carregando...</Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={12} md={6} lg={4} xl={2}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" align="center">
                      Total de Baixas do Setor
                    </Typography>
                    <Box
                      display="flex"
                      padding={1}
                      justifyContent="center"
                      alignItems="center"
                    >
                      {!isLoading && (
                        <Typography variant="h2">
                          {totalCountDescarte}
                        </Typography>
                      )}

                      {isLoading && (
                        <Typography variant="h6">Carregando...</Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Box>
        <Box
          margin={1}
          display="flex"
          flexDirection="column"
          component={Paper}
          variant="outlined"
          sx={{ height: 400 }}
        >
          <DataGrid
            localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            rows={searchByOrigem}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}
          />
        </Box>
        {/* {[1, 2, 3, 4].map((_, index) => (
          <Scope key="" path={`endereco[${index}]`}>
            <VTextField name="rua" />
            <VTextField name="numero" />
            <VTextField name="estado" />
            <VTextField name="cidade" />
            <VTextField name="pais" />
          </Scope>
        ))} */}
      </VForm>
    </LayoutBaseDePagina>
  );
};
function renderSwitch(valueEstConservacao: number) {
  throw new Error("Function not implemented.");
}
