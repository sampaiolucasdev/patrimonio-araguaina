import {
  Box,
  Button,
  CardMedia,
  Divider,
  FormControl,
  Grid,
  Icon,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { ReactInstance, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FerramentasDeDetalhe } from "../../shared/components";
import { useVForm, VForm } from "../../shared/forms";
import { useDebounce } from "../../shared/hooks";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { AutoCompleteOrigem } from "../movimentacoes/components/AutoCompleteOrigem";
import {
  BemService,
  IListagemBens,
} from "../../shared/services/api/BemService";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DataGrid, ptBR } from "@mui/x-data-grid";
import cabecalho from "../../assets/secSaude_cabecalho.png";
import rodape from "../../assets/secSaude_rodape.png";
import ReactToPrint, { IReactToPrintProps } from "react-to-print";

export const RelatorioBem: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  /**Passar próx como ', false' cancela o firstDelay */
  const navigate = useNavigate();

  const { formRef, saveAndClose, isSaveAndClose } = useVForm();
  const [rows, setRows] = useState<IListagemBens[]>([]);
  const [filteredRows, setFilteredRows] = useState<IListagemBens[]>([]);
  const [isLoading, setIsLoading] = useState(false); //Feedback visual de carregamento
  const [totalCount, setTotalCount] = useState(0);
  const [initialDate, setInitialDate] = useState<Date | null>(null);
  const [finalDate, setFinalDate] = useState<Date | null>(null);
  const [pegarOrigemId, setPegarOrigemId] = useState<number | undefined>();
  const [estConservacao, setEstConservacao] = useState("");
  const componentRef = useRef<HTMLDivElement>(null);

  const busca = useMemo(() => {
    return searchParams.get("busca") || "";
  }, [searchParams]);

  const pagina = useMemo(() => {
    return Number(searchParams.get("pagina") || "1");
  }, [searchParams]);

  const handleSubmit = () => {
    console.log("teste");
  };

  useEffect(() => {
    setIsLoading(true);
    debounce(() => {
      BemService.getAllFiltered(
        initialDate,
        finalDate,
        pegarOrigemId,
        estConservacao
      ).then((result) => {
        setIsLoading(false);
        if (result instanceof Error) {
          alert(result.message);
        } else {
          console.log("result filtered", result);
          setTotalCount(result.totalCount);
          setFilteredRows(result.data);
        }
      });
    });
  }, [initialDate, finalDate, pegarOrigemId, estConservacao]);

  const columns = [
    { field: "numSerie", headerName: "Número de Série", width: 130 },
    {
      field: "estConservacao",
      headerName: "Estado de Conservação",
      width: 190,
      editable: false,
    },
    {
      field: "marca",
      headerName: "Marca",
      type: "string",
      width: 110,
      editable: false,
    },
    {
      field: "modelo",
      headerName: "Modelo",
      type: "string",
      width: 110,
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
  {
    filteredRows.map((row) => [
      {
        id: row.id,
        numSerie: row.numSerie,
        estConservacao: row.estConservacao,
        marca: row.marca,
        modelo: row.modelo,
        descricao: row.descricao,
        valor: row.valor,
      },
    ]);
  }

  return (
    <LayoutBaseDePagina
      titulo={"Relatório de Bens"}
      barraDeFerramentas={
        <FerramentasDeDetalhe
          mostrarBotaoNovo={false}
          mostrarBotaoApagar={false}
        />
      }
    >
      <div ref={componentRef}>
        <VForm ref={formRef} onSubmit={handleSubmit}>
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
              <Grid container item direction="column" spacing={3}></Grid>
              <CardMedia
                component="img"
                height="100%"
                image={cabecalho}
                alt="Imagem"
              />

              <Grid item>
                <Typography variant="h4" align="center">
                  Relatório de Bens Patrimoniais
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6">Período</Typography>
              </Grid>

              <Grid container item direction="row" spacing={2}>
                <Grid container item direction="row" spacing={2}>
                  <Grid item direction="row" xs={9} sm={8} md={5} lg={4} xl={3}>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <Stack
                        spacing={2}
                        direction="row"
                        divider={<Divider orientation="vertical" flexItem />}
                      >
                        <DatePicker
                          label="Data Inicial"
                          value={initialDate}
                          onChange={(newValue) => {
                            setInitialDate(newValue);
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                        <DatePicker
                          label="Data Final"
                          value={finalDate}
                          onChange={(newValue) => {
                            setFinalDate(newValue);
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </Stack>
                    </LocalizationProvider>
                  </Grid>
                  <Grid
                    item
                    direction="row"
                    xs={6}
                    sm={12}
                    md={6}
                    lg={4}
                    xl={2}
                  ></Grid>
                </Grid>

                <Grid item direction="row">
                  <Typography variant="h6">Local</Typography>
                </Grid>

                <Grid container item direction="row" spacing={2}></Grid>
                <Grid item direction="row" xs={6} sm={12} md={6} lg={4} xl={2}>
                  <AutoCompleteOrigem
                    onChange={(id) => setPegarOrigemId(id)}
                    isExternalLoading={isLoading}
                  />
                </Grid>
                <Grid container item direction="row" spacing={2}></Grid>

                <Grid item direction="row">
                  <Typography variant="h6">Estado de Conservação</Typography>
                </Grid>
                <Grid container item direction="row" spacing={2}></Grid>
                <Grid direction="row" item xs={12} sm={12} md={6} lg={4} xl={2}>
                  <FormControl fullWidth>
                    <InputLabel id="estConservacao">
                      Estado de Conservação
                    </InputLabel>
                    <Select
                      name="valueEstConservacao"
                      labelId="estConservacao"
                      id="estConservacao"
                      value={estConservacao}
                      label="Estado de Conservação"
                      onChange={(e) => setEstConservacao(e.target.value)}
                    >
                      <MenuItem value={"Todos"}>Todos</MenuItem>
                      <MenuItem value={"Novo"}>Novo</MenuItem>
                      <MenuItem value={"Regular"}>Regular</MenuItem>
                      <MenuItem value={"Bom"}>Bom</MenuItem>
                      <MenuItem value={"Descarte"}>Descarte</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid
                  direction="row"
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={4}
                  xl={2}
                ></Grid>
              </Grid>
            </Grid>
          </Box>

          <Box
            margin={1}
            display="flex"
            flexDirection="column"
            component={Paper}
            variant="outlined"
            sx={{ height: 510 }}
          >
            <DataGrid
              localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
              checkboxSelection={false}
              rows={filteredRows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[9999]}
              disableSelectionOnClick
              experimentalFeatures={{ newEditingApi: true }}
            />
            <Grid container direction="column" padding={2} spacing={2}>
              <Grid container item direction="column" spacing={3}></Grid>
              <CardMedia
                //sx={{ alignItems: "center", justifyContent: "flex-start" }}
                component="img"
                height="100%"
                image={rodape}
                alt="Imagem"
              />
            </Grid>
            <Grid container item direction="column" spacing={3}></Grid>
          </Box>
        </VForm>
      </div>
      <Box
        margin={1}
        display="flex"
        flexDirection="column"
        component={Paper}
        variant="outlined"
        //sx={{ height: 640 }}
      >
        <ReactToPrint
          trigger={() => {
            return (
              <Button
                sx={{ margin: 1 }}
                variant="contained"
                color="error"
                disableElevation
                startIcon={
                  <Icon>
                    {/* <PictureAsPdfOutlined color={"error"} /> */}
                    download
                  </Icon>
                }
              >
                <Typography
                  variant="button"
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                  overflow="hidden"
                >
                  Gerar PDF
                </Typography>
              </Button>
            );
          }}
          content={() => componentRef.current}
        />
      </Box>
    </LayoutBaseDePagina>
  );
};
