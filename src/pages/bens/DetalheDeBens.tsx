import { useEffect, useState } from "react";
import { Box, Grid, LinearProgress, Paper, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";

import { VTextField, VForm, useVForm, IVFormErrors } from "../../shared/forms";
import { FerramentasDeDetalhe } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { BemService } from "../../shared/services/api/BemService";
import { AutoCompleteOrigem } from "../movimentacoes/components/AutoCompleteOrigem";

interface IFormData {
  descricao: string;
  marca: string;
  modelo: string;
  imagem: string | undefined;
  setor_id: number;
  estConservacao: string;
  valor: number;
  numSerie: string;
}
const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
  descricao: yup.string().required(),
  marca: yup.string().required(),
  modelo: yup.string().required(),
  imagem: yup.string(),
  setor_id: yup.number().required(),
  estConservacao: yup.string().required().min(1),
  valor: yup.number().required().min(1),
  numSerie: yup.string().required().min(4),
});

export const DetalheDeBens: React.FC = () => {
  const { formRef, saveAndClose, isSaveAndClose } = useVForm();
  const { id = "nova" } = useParams<"id">();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrigem, setSelectedOrigem] = useState(0);
  const [numSerie, setNumSerie] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [valor, setValor] = useState(0);
  const [descricao, setDescricao] = useState("");
  const [estConservacao, setEstConservacao] = useState(0);
  const [imagem, setImagem] = useState("");
  const [pegarOrigemId, setPegarOrigemId] = useState<number>();

  useEffect(() => {
    if (id !== "nova") {
      setIsLoading(true);

      BemService.getById(Number(id)).then((result) => {
        setIsLoading(false);
        if (result instanceof Error) {
          alert(result.message);
          navigate("/bens");
        } else {
          setDescricao(result.descricao);
          console.log(result);

          formRef.current?.setData(result);
        }
      });
    } else {
      formRef.current?.setData({
        nome: "",
      });
    }
  }, [id]);

  const handleSave = (dados: IFormData) => {
    console.log(dados);
    formValidationSchema
      .validate(dados, { abortEarly: false })
      .then((dadosValidados) => {
        console.log("dados validados", dadosValidados);
        setIsLoading(true);
        BemService.create(dadosValidados).then((result) => {
          setIsLoading(false);
          //console.log(result);
          if (result instanceof Error) {
            alert(result.message);
          } else {
            if (isSaveAndClose()) {
              toast.success(` ${descricao} adicionado com sucesso!`);
              navigate("/bens");
            } else {
              navigate(`/bens/detalhe/${result}`);
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
        BemService.deleteById(id).then((result) => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            toast.success("Bem excluído com sucesso!");
            navigate("/bens");
          }
        });
      }
    });
  };

  return (
    <LayoutBaseDePagina
      titulo={id === "nova" ? "Cadastrar Novo Bem" : descricao}
      barraDeFerramentas={
        <FerramentasDeDetalhe
          mostrarBotaoNovo={false}
          mostrarBotaoApagar={id !== "nova"}
          aoClicarEmSalvar={saveAndClose}
          aoClicarEmVoltar={() => navigate("/bens")}
          aoClicarEmApagar={() => {
            handleDelete(Number(id));
          }}
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
              <Typography variant="h6">Local e Identificação</Typography>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid container item direction="row" spacing={2}>
                <Grid item direction="row" xs={6} sm={12} md={6} lg={4} xl={2}>
                  <AutoCompleteOrigem
                    onChange={() =>
                      setPegarOrigemId(formRef.current?.getFieldValue("origem"))
                    }
                    isExternalLoading={isLoading}
                  />
                </Grid>
                <Grid item direction="row" xs={6} sm={12} md={6} lg={4} xl={2}>
                  <VTextField
                    fullWidth
                    name="numSerie"
                    disabled={isLoading} //Desabilita o textfield quando estiver carregando
                    label="Número de Série"
                    onChange={(e) => setNumSerie(e.target.value)} //Altera o nome da cidade no <h1> quando for alterado no textfield
                  />
                </Grid>
              </Grid>
              <Grid item direction="row">
                <Typography variant="h6">Características</Typography>
              </Grid>
              <Grid container item direction="row" spacing={2}></Grid>
              <Grid direction="row" item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name="marca"
                  disabled={isLoading} //Desabilita o textfield quando estiver carregando
                  label="Marca"
                  onChange={(e) => setMarca(e.target.value)} //Altera o nome da cidade no <h1> quando for alterado no textfield
                />
              </Grid>
              <Grid direction="row" item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name="modelo"
                  disabled={isLoading} //Desabilita o textfield quando estiver carregando
                  label="Modelo"
                  onChange={(e) => setModelo(e.target.value)} //Altera o nome da cidade no <h1> quando for alterado no textfield
                />
              </Grid>
              <Grid direction="row" item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name="valor"
                  disabled={isLoading} //Desabilita o textfield quando estiver carregando
                  label="Valor"
                  onChange={(e) => setValor(Number(e.target.value))} //Altera o nome da cidade no <h1> quando for alterado no textfield
                />
              </Grid>
              <Grid container item direction="row" spacing={2}></Grid>
              <Grid item direction="row">
                <Typography variant="h6">Detalhes</Typography>
              </Grid>
              <Grid container item direction="row" spacing={2}></Grid>
              <Grid direction="row" item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name="descricao"
                  disabled={isLoading} //Desabilita o textfield quando estiver carregando
                  label="Descrição"
                  onChange={(e) => setDescricao(e.target.value)} //Altera o nome da cidade no <h1> quando for alterado no textfield
                />
              </Grid>
              <Grid direction="row" item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name="estConservacao"
                  disabled={isLoading} //Desabilita o textfield quando estiver carregando
                  label="Estado de Conservação"
                  onChange={(e) => setEstConservacao(Number(e.target.value))} //Altera o nome da cidade no <h1> quando for alterado no textfield
                />
              </Grid>
              <Grid direction="row" item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name="imagem"
                  disabled={isLoading} //Desabilita o textfield quando estiver carregando
                  label="Imagem"
                  onChange={(e) => setImagem(e.target.value)} //Altera o nome da cidade no <h1> quando for alterado no textfield
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
