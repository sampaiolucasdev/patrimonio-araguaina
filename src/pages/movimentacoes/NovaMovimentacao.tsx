import { useEffect, useMemo, useState } from "react";
import {
  Box,
  debounce,
  Grid,
  LinearProgress,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import * as yup from "yup";

import { MovimentacaoService } from "../../shared/services/api/MovimentacaoService";
import {
  VTextField,
  VForm,
  useVForm,
  IVFormErrors,
  VSelect,
} from "../../shared/forms";
import { FerramentasDeDetalhe } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import {
  IListagemSetor,
  SetorService,
} from "../../shared/services/api/SetorService";

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
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [destino, setDestino] = useState("");
  const [setor, setSetor] = useState<IListagemSetor[]>();
  const [nome, setNome] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const busca = useMemo(() => {
    return searchParams.get("busca") || "";
  }, [searchParams]);

  const pagina = useMemo(() => {
    return Number(searchParams.get("pagina") || "1");
  }, [searchParams]);

  // useEffect(() => {
  //   if (id !== "nova") {
  //     setIsLoading(true);

  //     MovimentacaoService.getById(Number(id)).then((result) => {
  //       setIsLoading(false);
  //       if (result instanceof Error) {
  //         alert(result.message);
  //         navigate("/departamento");
  //       } else {
  //         setNome(result.nome);
  //         console.log(result);

  //         formRef.current?.setData(result);
  //       }
  //     });
  //   } else {
  //     formRef.current?.setData({
  //       nome: "",
  //     });
  //   }
  // }, [id]);

  useEffect(() => {
    setIsLoading(false);
    debounce(() => {
      SetorService.getAll(pagina, busca).then((result) => {
        setIsLoading(false);
        if (result instanceof Error) {
          alert(result.message);
        } else {
          setSetor(result.data);
          console.log(result);
        }
      });
    });
  }, [busca, pagina]);

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
  const handleDelete = (id: number) => {
    /**
     * deleteById retorna uma promessa de resultado ou erro.
     * Quando (.then) essa promessa ocorrer, vai ter um result
     * Se esse result é uma instância de erro, então, alert
     * mostrando o error na message. Se não, vai dar um setState(serRows)
     * pegando o registro com o id específico que foi apagado, retorna um novo
     * state com todas as linhas do state anterior(...), filtrando exceto
     * a linha com o id que está sendo apagado (oldRow.id !== id).
     */
    Swal.fire({
      title: "Deseja excluir ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      showDenyButton: false,
      confirmButtonText: "Sim",
      cancelButtonText: "Cancelar",
      denyButtonText: "Não",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        MovimentacaoService.deleteById(id).then((result) => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            toast.success("Departamento excluído com sucesso!");
            navigate("/movimentacao");
          }
        });
      }
    });
  };

  return (
    <LayoutBaseDePagina
      titulo={id === "nova" ? "Registrar Movimentação" : nome}
      barraDeFerramentas={
        <FerramentasDeDetalhe
          //textoBotaoNovo="Adicionar"
          //mostrarBotaoSalvarEFechar
          //mostrarBotaoNovo={id !== "nova"}
          mostrarBotaoApagar={id !== "nova"}
          aoClicarEmSalvar={saveAndClose}
          //aoClicarEmSalvarEFechar={saveAndClose}
          aoClicarEmVoltar={() => navigate("/movimentacao")}
          aoClicarEmApagar={() => {
            //handleDelete(Number(id));
          }}
          aoClicarEmNovo={() => navigate("/movimentacao/detalhe/nova")}
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
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VSelect
                  fullWidth
                  name="origem"
                  disabled={isLoading} //Desabilita o textfield quando estiver carregando
                  label="Origem"
                  onChange={(e) => setNome(e.target.value)} //Altera o nome da cidade no <h1> quando for alterado no textfield
                />
                <Select
                  value={setor}
                  fullWidth
                  name="destino"
                  disabled={isLoading} //Desabilita o textfield quando estiver carregando
                  label="Destino"
                  autoWidth
                  onChange={(event) => setDestino(event.target.name)} //Altera o nome da cidade no <h1> quando for alterado no textfield
                />
                <VTextField
                  fullWidth
                  name="qtd"
                  disabled={isLoading} //Desabilita o textfield quando estiver carregando
                  label="Quantidade"
                  onChange={(e) => setNome(e.target.value)} //Altera o nome da cidade no <h1> quando for alterado no textfield
                />
                <Grid item>
                  <Typography variant="h6">Detalhes dos Bens</Typography>
                </Grid>
                <VTextField
                  fullWidth
                  name="numSerie"
                  disabled={isLoading} //Desabilita o textfield quando estiver carregando
                  label="Número de Série"
                  onChange={(e) => setNome(e.target.value)} //Altera o nome da cidade no <h1> quando for alterado no textfield
                />
                <VTextField
                  fullWidth
                  name="estConservacao"
                  disabled={isLoading} //Desabilita o textfield quando estiver carregando
                  label="Estado de Conservação"
                  onChange={(e) => setNome(e.target.value)} //Altera o nome da cidade no <h1> quando for alterado no textfield
                />
                <VTextField
                  fullWidth
                  name="descricao"
                  disabled={isLoading} //Desabilita o textfield quando estiver carregando
                  label="Descrição"
                  onChange={(e) => setNome(e.target.value)} //Altera o nome da cidade no <h1> quando for alterado no textfield
                />
                <VTextField
                  fullWidth
                  name="valor"
                  disabled={isLoading} //Desabilita o textfield quando estiver carregando
                  label="Valor"
                  onChange={(e) => setNome(e.target.value)} //Altera o nome da cidade no <h1> quando for alterado no textfield
                />
              </Grid>
            </Grid>
          </Grid>
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