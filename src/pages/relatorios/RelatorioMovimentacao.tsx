import {
  Box,
  Button,
  CardMedia,
  Divider,
  FormControl,
  Grid,
  Icon,
  IconButton,
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
import { useEffect, useMemo, useRef, useState } from "react";
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
import {
  IListagemMovimentacao,
  MovimentacaoService,
} from "../../shared/services/api/MovimentacaoService";
import ReactToPrint from "react-to-print";
import { PictureAsPdfOutlined } from "@mui/icons-material";

export const RelatorioMovimentacao: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  /**Passar próx como ', false' cancela o firstDelay */
  const navigate = useNavigate();

  const { formRef, saveAndClose, isSaveAndClose } = useVForm();
  const [filteredRows, setFilteredRows] = useState<IListagemMovimentacao[]>([]);
  const [isLoading, setIsLoading] = useState(false); //Feedback visual de carregamento
  const [totalCount, setTotalCount] = useState(0);
  const [initialDate, setInitialDate] = useState<Date | null>(null);
  const [finalDate, setFinalDate] = useState<Date | null>(null);
  const [setor_id_origem, setSetor_id_origem] = useState<number | undefined>();
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
      MovimentacaoService.getAllFiltered(setor_id_origem).then((result) => {
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
  }, [initialDate, finalDate, setor_id_origem]);

  const columns = [
    { field: "numSerie", headerName: "Número de Série", width: 130 },
    {
      field: "setor_id_origem",
      headerName: "Origem",
      width: 80,
      editable: false,
    },
    {
      field: "setor_id_destino",
      headerName: "Destino",
      width: 80,
      type: "string",
      editable: false,
    },
    {
      field: "descricao",
      headerName: "Descrição",
      width: 370,
      editable: false,
    },
    {
      field: "data",
      headerName: "Data",
      type: "string",
      width: 110,
      editable: false,
    },
  ];
  {
    filteredRows.map((row) => [
      {
        numSerie: row.numSerie,
        setor_id_origem: row.setor_id_origem,
        setor_id_destino: row.setor_id_destino,
        descricao: row.descricao,
        data: row.data,
      },
    ]);
  }

  return (
    <LayoutBaseDePagina
      titulo={"Relatório de Movimentações"}
      barraDeFerramentas={
        <FerramentasDeDetalhe
          mostrarBotaoNovo={false}
          mostrarBotaoApagar={false}
          mostrarBotaoSalvar={false}
          //mostrarBotaoPDF
          //aoClicarEmPDF={}
          // aoClicarEmSalvar={saveAndClose}
          // aoClicarEmVoltar={() => navigate("/movimentacao")}
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
                  Relatório de Movimentações
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
                    onChange={(id) => setSetor_id_origem(id)}
                    isExternalLoading={isLoading}
                  />
                </Grid>
                <Grid container item direction="row" spacing={2}></Grid>

                <Grid container item direction="row" spacing={2}></Grid>

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
            sx={{ height: 635 }}
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
