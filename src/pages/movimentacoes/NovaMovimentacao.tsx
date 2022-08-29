import { Children, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  debounce,
  Grid,
  Icon,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef, ptBR } from "@mui/x-data-grid";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import * as yup from "yup";
import { MovimentacaoService } from "../../shared/services/api/MovimentacaoService";
import { VTextField, VForm, useVForm, IVFormErrors } from "../../shared/forms";
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
import { IListagemSetor } from "../../shared/services/api/SetorService";

interface IFormData {
  id?: number;
  origem: string;
  destino: string;
  data: string;
  qtd: number;
  numSerie: string;
  estConservacao: string;
  descricao: string[];
  valor: number;
}
type TAutoCompleteOption = {
  id: number;
  label: string;
};
const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
  id: yup.number(),
  origem: yup.string().required(),
  destino: yup.string().required(),
  data: yup.string().required(),
  qtd: yup.number().required().min(1),
  numSerie: yup.string().required().min(4),
  estConservacao: yup.string().required().min(1),
  descricao: yup.array(),
  valor: yup.number().required().min(1),
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
  //const [getOrigemId, setGetOrigemId] = useState<TAutoCompleteOption[]>([]);

  const busca = useMemo(() => {
    return searchParams.get("busca") || "";
  }, [searchParams]);

  const pagina = useMemo(() => {
    return Number(searchParams.get("pagina") || "1");
  }, [searchParams]);

  useEffect(() => {
    setIsLoading(true);
    debounce(() => {
      BemService.getAllBySetor(pagina, busca, 3).then((result) => {
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
  }, [busca, pagina]);

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
              toast.success(` ${nome} adicionado com sucesso!`);
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
      <VForm ref={formRef} onSubmit={handleSave}>
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
                  <AutoCompleteOrigem isExternalLoading={isLoading} />
                </Grid>
                <Grid item direction="row" xs={6} sm={12} md={6} lg={4} xl={2}>
                  <AutoCompleteDestino isExternalLoading={isLoading} />
                </Grid>
              </Grid>

              <Grid item direction="row">
                <Typography variant="h6">Detalhes dos Bens</Typography>
              </Grid>

              <Grid container item direction="row" spacing={2}></Grid>
              {/* <Grid direction="row" item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name="qtd"
                  disabled={isLoading} //Desabilita o textfield quando estiver carregando
                  label="Quantidade"
                  onChange={(e) => setNome(e.target.value)} //Altera o nome da cidade no <h1> quando for alterado no textfield
                />
              </Grid> */}

              <Grid direction="row" item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name="estConservacao"
                  disabled={isLoading} //Desabilita o textfield quando estiver carregando
                  label="Novo Estado de Conservação"
                  onChange={(e) => setNome(e.target.value)} //Altera o nome da cidade no <h1> quando for alterado no textfield
                />
              </Grid>

              <Grid direction="row" item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name="descricao"
                  disabled={isLoading} //Desabilita o textfield quando estiver carregando
                  label="Descrição"
                  onChange={(e) => setNome(e.target.value)} //Altera o nome da cidade no <h1> quando for alterado no textfield
                />
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
            onSelectionModelChange={(data) => {
              console.log(data);
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
