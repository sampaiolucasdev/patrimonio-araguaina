import {
  Box,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FerramentasDeDetalhe } from "../../shared/components";

import { useVForm, VForm } from "../../shared/forms";
import { useDebounce } from "../../shared/hooks";
import { LayoutBaseDePagina } from "../../shared/layouts";
import {
  IListagemCidade,
  CidadesService,
} from "../../shared/services/api/cidades/MovimentacaoService";
import * as yup from "yup";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import ptBR from "dayjs/locale/pt-br";
import dayjs, { Dayjs } from "dayjs";
import { AutoCompleteOrigem } from "../movimentacoes/components/AutoCompleteOrigem";
import { RelatorioService } from "../../shared/services/api/RelatorioService";

interface IFormData {
  inicialDate: Dayjs;
  finalDate: Dayjs;
  origemId: number;
  estConservacao: string;
}
const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
  inicialDate: yup.date().required().min(3),
  finalDate: yup.date().required().min(3),
  origemId: yup.number().required().min(3),
  estConservacao: yup.string().required().min(3),
});

export const RelatorioBem: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  /**Passar próx como ', false' cancela o firstDelay */
  const navigate = useNavigate();

  const { formRef, saveAndClose, isSaveAndClose } = useVForm();
  const [rows, setRows] = useState<IListagemCidade[]>([]);
  const [isLoading, setIsLoading] = useState(true); //Feedback visual de carregamento
  const [totalCount, setTotalCount] = useState(0);
  const [inicialDate, setInicialDate] = useState<Dayjs | null>(dayjs(""));
  const [finalDate, setFinalDate] = useState<Dayjs | null>(dayjs(""));
  const [pegarOrigemId, setPegarOrigemId] = useState<number | undefined>();
  const [estConservacao, setEstConservacao] = useState("");

  const busca = useMemo(() => {
    return searchParams.get("busca") || "";
  }, [searchParams]);

  const pagina = useMemo(() => {
    return Number(searchParams.get("pagina") || "1");
  }, [searchParams]);

  const handleSubmit = () => {
    useEffect(() => {
      setIsLoading(true);
      debounce(() => {
        RelatorioService.getAll(
          inicialDate,
          finalDate,
          pegarOrigemId,
          estConservacao
        ).then((result) => {
          setIsLoading(false);
          if (result instanceof Error) {
            alert(result.message);
          } else {
            console.log(result);
            setTotalCount(result.totalCount);
            //setRows(result.data);
          }
        });
      });
    }, [busca, pagina]);
  };

  useEffect(() => {
    setIsLoading(true);
    debounce(() => {
      CidadesService.getAll(pagina, busca).then((result) => {
        setIsLoading(false);
        if (result instanceof Error) {
          alert(result.message);
        } else {
          console.log(result);

          setTotalCount(result.totalCount);
          setRows(result.data);
        }
      });
    });
  }, [busca, pagina]);

  return (
    <LayoutBaseDePagina
      titulo={"Relatório de Bens"}
      barraDeFerramentas={
        <FerramentasDeDetalhe
          mostrarBotaoNovo={false}
          mostrarBotaoApagar={false}
          // aoClicarEmSalvar={saveAndClose}
          // aoClicarEmVoltar={() => navigate("/movimentacao")}
        />
      }
    >
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

            <Grid item>
              <Typography variant="h6">Período</Typography>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid container item direction="row" spacing={2}>
                <Grid item direction="row" xs={9} sm={8} md={5} lg={4} xl={3}>
                  <LocalizationProvider
                    adapterLocale={ptBR}
                    dateAdapter={AdapterDayjs}
                  >
                    <Stack
                      spacing={2}
                      direction="row"
                      divider={<Divider orientation="vertical" flexItem />}
                    >
                      <DesktopDatePicker
                        //mask="DD/MM/YYY"
                        label="Data Inicial"
                        inputFormat="DD/MM/YYYY"
                        value={inicialDate}
                        onChange={(newValue: Dayjs | null) =>
                          setInicialDate(newValue)
                        }
                        renderInput={(params) => (
                          <TextField {...params} fullWidth />
                        )}
                        showDaysOutsideCurrentMonth
                        dayOfWeekFormatter={(day) =>
                          day.charAt(0).toUpperCase()
                        }
                      />
                      <DesktopDatePicker
                        mask="__/__/___"
                        label="Data Final"
                        inputFormat="DD/MM/YYYY"
                        value={finalDate}
                        onChange={(newValue: Dayjs | null) =>
                          setFinalDate(newValue)
                        }
                        renderInput={(params) => (
                          <TextField {...params} fullWidth />
                        )}
                        showDaysOutsideCurrentMonth
                        dayOfWeekFormatter={(day) =>
                          day.charAt(0).toUpperCase()
                        }
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
      </VForm>
    </LayoutBaseDePagina>
  );
};
