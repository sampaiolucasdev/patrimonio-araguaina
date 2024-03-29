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
import { DataGrid, GridColDef, GridRowId, ptBR } from "@mui/x-data-grid";
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
  estConservacao: string;
  arrayIds: any;
  setor_id_origem: number | undefined;
  setor_id_destino: number | undefined;
}

const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
  //id: yup.number(),
  origem: yup.number(),
  destino: yup.number(),
  estConservacao: yup.string().required(),
  arrayIds: yup.array().of(yup.number().required()),
  setor_id_origem: yup.number().required(),
  setor_id_destino: yup.number().required(),
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
  const [estConservacao, setEstConservacao] = useState("");
  const [setor_id, setSetor_id] = useState<number | undefined>();
  const [setor_id_destino, setSetor_id_destino] = useState<number>();
  const [selectedIds, setSelectedIds] = useState<GridRowId[]>([]);

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
      BemService.getAllBySetor(pagina, busca, setor_id).then((result) => {
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
  }, [busca, pagina, setor_id]);

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
            estConservacao: estConservacao,
            setor_id_origem: setor_id,
            setor_id_destino: setor_id_destino,
            arrayIds: selectedIds,
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
                    onChange={(id) => setSetor_id(id)}
                    isExternalLoading={isLoading}
                  />
                </Grid>
                <Grid item direction="row" xs={6} sm={12} md={6} lg={4} xl={2}>
                  <AutoCompleteDestino
                    onChange={(id) => setSetor_id_destino(id)}
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
                    Novo Estado de Conservação
                  </InputLabel>
                  <Select
                    name="valueEstConservacao"
                    labelId="estConservacao"
                    id="estConservacao"
                    value={estConservacao}
                    label="Estado de Conservação"
                    onChange={(e) => setEstConservacao(e.target.value)}
                  >
                    <MenuItem value={"Novo"}>Novo</MenuItem>
                    <MenuItem value={"Regular"}>Regular</MenuItem>
                    <MenuItem value={"Bom"}>Bom</MenuItem>
                    <MenuItem value={"Descarte"}>Descarte</MenuItem>
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
              setSelectedIds(ids);
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
