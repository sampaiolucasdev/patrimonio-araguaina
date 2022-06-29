import { useEffect, useState } from "react";
import { Box, Grid, LinearProgress, Paper, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";

import { DepartamentoService } from "../../shared/services/api/DepartamentoService";
import { VTextField, VForm, useVForm, IVFormErrors } from "../../shared/forms";
import { FerramentasDeDetalhe } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";

interface IFormData {
  nome: string;
}
const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
  nome: yup.string().required().min(3),
});

export const DetalheDeDepartamento: React.FC = () => {
  const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();
  const { id = "nova" } = useParams<"id">();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [nome, setNome] = useState("");

  useEffect(() => {
    if (id !== "nova") {
      setIsLoading(true);

      DepartamentoService.getById(Number(id)).then((result) => {
        setIsLoading(false);
        if (result instanceof Error) {
          alert(result.message);
          navigate("/departamento");
        } else {
          setNome(result.nome);
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
    formValidationSchema
      .validate(dados, { abortEarly: false })
      .then((dadosValidados) => {
        setIsLoading(true);
        if (id === "nova") {
          DepartamentoService.create(dadosValidados).then((result) => {
            setIsLoading(false);
            if (result instanceof Error) {
              alert(result.message);
            } else {
              if (isSaveAndClose()) {
                navigate("/departamento");
              } else {
                navigate(`/departamento/detalhe/${result}`);
              }
            }
          });
        } else {
          DepartamentoService.updateById(Number(id), {
            id: Number(id),
            ...dadosValidados,
          }).then((result) => {
            setIsLoading(false);
            if (result instanceof Error) {
              alert(result.message);
            } else {
              if (isSaveAndClose()) {
                navigate("/departamento");
              }
            }
            // else {
            //   navigate(`/cidades/detalhe/${result}`);
            // }
          });
        }
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
    if (confirm("Deseja apagar?")) {
      DepartamentoService.deleteById(id).then((result) => {
        if (result instanceof Error) {
          alert(result.message);
        } else {
          alert("Departamento apagado com sucesso!");
          navigate("/departamento");
        }
      });
    }
  };
  return (
    <LayoutBaseDePagina
      titulo={id === "nova" ? "Cadastrar Novo Departamento" : nome}
      barraDeFerramentas={
        <FerramentasDeDetalhe
          //textoBotaoNovo="Adicionar"
          mostrarBotaoSalvarEFechar
          //mostrarBotaoNovo={id !== "nova"}
          mostrarBotaoApagar={id !== "nova"}
          //aoClicarEmSalvar={save}
          aoClicarEmSalvarEFechar={saveAndClose}
          aoClicarEmVoltar={() => navigate("/departamento")}
          aoClicarEmApagar={() => {
            handleDelete(Number(id));
          }}
          aoClicarEmNovo={() => navigate("/departamento/detalhe/nova")}
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
              <Typography variant="h6">Editar Informações</Typography>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name="nome"
                  disabled={isLoading} //Desabilita o textfield quando estiver carregando
                  label="Nome"
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
