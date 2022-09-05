import { useEffect, useMemo, useState } from "react";
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef, ptBR } from "@mui/x-data-grid";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import * as yup from "yup";
import { MovimentacaoService } from "../../shared/services/api/MovimentacaoService";
import { VForm, useVForm, IVFormErrors } from "../../shared/forms";
import { FerramentasDeDetalhe } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { AutoCompleteOrigem } from "./components/AutoCompleteOrigem";
import { AutoCompleteDestino } from "./components/AutoCompleteDestino";
import {
  BemService,
  IListagemBens,
} from "../../shared/services/api/BemService";
import { useDebounce } from "../../shared/hooks";

interface IFormData {
  //id?: number;
  valueEstConservacao: number;
  arrayIds: any;
  pegarOrigemId: number | undefined;
  pegarDestinoId: number | undefined;
}

const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
  //id: yup.number(),
  origem: yup.number(),
  destino: yup.number(),
  valueEstConservacao: yup.number().required(),
  arrayIds: yup.array().of(yup.number().required()),
  pegarOrigemId: yup.number().required(),
  pegarDestinoId: yup.number().required(),
});

export const NovaMovimentacao: React.FC = () => {
  const { formRef, saveAndClose, isSaveAndClose } = useVForm();
  const { id = "nova" } = useParams<"id">();
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [nome, setNome] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [searchByOrigem, setSearchByOrigem] = useState<IListagemBens[]>([]);
  const [valueEstConservacao, setValueEstConservacao] = useState(0);
  const [pegarOrigemId, setPegarOrigemId] = useState<number | undefined>();
  const [pegarDestinoId, setPegarDestinoId] = useState<number>();
  const [arrayIds, setArrayIds] = useState<number[]>([]);

  //console.log("arrayIds", arrayIds);

  const busca = useMemo(() => {
    return searchParams.get("busca") || "";
  }, [searchParams]);

  const pagina = useMemo(() => {
    return Number(searchParams.get("pagina") || "1");
  }, [searchParams]);

  //console.log("aquii", pegarOrigemId);
  //console.log("valueEstConservacao", valueEstConservacao);

  useEffect(() => {
    setIsLoading(true);
    debounce(() => {
      BemService.getAllBySetor(pagina, busca, pegarOrigemId).then((result) => {
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
      });
    });
  }, [busca, pagina, pegarOrigemId]);

  const columns: GridColDef[] = [
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
  {
    searchByOrigem.map((row) => [
      {
        id: row.id,
        numSerie: row.numSerie,
        estConservacao: row.estConservacao,
        descricao: row.descricao,
        valor: row.valor,
      },
    ]);
  }
  const handleSave = (dados: IFormData) => {
    // const datasa = [{ dados: dados }, { valueEst: valueEstConservacao }];
    console.log("dados", dados);

    formValidationSchema
      .validate(dados, { abortEarly: false })
      .then((dadosValidados) => {
        setIsLoading(true);
        MovimentacaoService.create(dadosValidados).then((result) => {
          setIsLoading(false);
          if (result instanceof Error) {
            alert(result.message);
          } else {
            if (isSaveAndClose()) {
              toast.success("Movimentação realizada com sucesso!");
              navigate("/movimentacao");
            } else {
              navigate(`/movimentacao/detalhe/${result}`);
            }
          }
        });
      })
      .catch((errors: yup.ValidationError) => {
        const validationErrors: IVFormErrors = {};
        errors.inner.forEach((error) => {
          if (!error.path) return;
          validationErrors[error.path] = error.message;
          /**Objeto que pode ser em branco, pega o path(nome do campo) e
           * atribui a message para ele e sobrescreve o erro acima
           * (!error.path), que acusa um campo falsy. Então, o erro de campo
           * obrigatório é sobrescrito pelo erro de min(3).
           */
        });
        // console.log(validationErrors);
        formRef.current?.setErrors(validationErrors); //Mostra erro nas inputs
      });
  };

  return (
    <LayoutBaseDePagina
      titulo={id === "nova" ? "Registrar Movimentação" : nome}
      barraDeFerramentas={
        <FerramentasDeDetalhe
          mostrarBotaoNovo={false}
          mostrarBotaoApagar={id !== "nova"}
          aoClicarEmSalvar={saveAndClose}
          aoClicarEmVoltar={() => navigate("/movimentacao")}
        />
      }
    >
      <VForm
        ref={formRef}
        onSubmit={() => {
          handleSave({
            valueEstConservacao,
            pegarOrigemId,
            pegarDestinoId,
            arrayIds,
          });
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
              <Typography variant="h6">Detalhes da Movimentação</Typography>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid container item direction="row" spacing={2}>
                <Grid item direction="row" xs={6} sm={12} md={6} lg={4} xl={2}>
                  <AutoCompleteOrigem
                    onChange={(id) => setPegarOrigemId(id)}
                    isExternalLoading={isLoading}
                  />
                </Grid>
                <Grid item direction="row" xs={6} sm={12} md={6} lg={4} xl={2}>
                  <AutoCompleteDestino
                    onChange={(id) => setPegarDestinoId(id)}
                    isExternalLoading={isLoading}
                  />
                </Grid>
              </Grid>

              <Grid item direction="row">
                <Typography variant="h6">Detalhes dos Bens</Typography>
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
                    value={valueEstConservacao}
                    label="Estado de Conservação"
                    onChange={(e) =>
                      setValueEstConservacao(Number(e.target.value))
                    }
                  >
                    <MenuItem value={1}>Novo</MenuItem>
                    <MenuItem value={2}>Regular</MenuItem>
                    <MenuItem value={3}>Bom</MenuItem>
                    <MenuItem value={4}>Descarte</MenuItem>
                  </Select>
                </FormControl>
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
            checkboxSelection
            rows={searchByOrigem}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}
            onSelectionModelChange={(ids) => {
              setArrayIds(ids);
            }}
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
