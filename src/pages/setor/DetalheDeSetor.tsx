import { useEffect, useMemo, useState } from "react";
import {
  Box,
  FormControl,
  Grid,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import * as yup from "yup";

import { SetorService } from "../../shared/services/api/SetorService";
import { VTextField, VForm, useVForm, IVFormErrors } from "../../shared/forms";
import { FerramentasDeDetalhe } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import Select from "react-select";
import {
  DepartamentoService,
  IListagemDepartamento,
} from "../../shared/services/api/DepartamentoService";
import { useDebounce } from "../../shared/hooks";

interface IFormData {
  nome: string;
}
const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
  nome: yup.string().required().min(3),
});

export const DetalheDeSetor: React.FC = () => {
  const { formRef, saveAndClose, isSaveAndClose } = useVForm();
  const { id = "nova" } = useParams<"id">();
  const navigate = useNavigate();
  const { debounce } = useDebounce();
  const [searchParams, setSearchParams] = useSearchParams();

  const [rowsDepart, setRowsDepart] = useState<IListagemDepartamento[]>([]);
  const [selectedItem, setSelectedItem] = useState<IListagemDepartamento[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [nome, setNome] = useState("");

  const busca = useMemo(() => {
    return searchParams.get("busca") || "";
  }, [searchParams]);

  const pagina = useMemo(() => {
    return Number(searchParams.get("pagina") || "1");
  }, [searchParams]);

  //GET SETOR
  useEffect(() => {
    if (id !== "nova") {
      setIsLoading(true);

      SetorService.getById(Number(id)).then((result) => {
        setIsLoading(false);
        if (result instanceof Error) {
          alert(result.message);
          navigate("/setor");
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

  //GET DEPARTAMENTO
  useEffect(() => {
    debounce(() => {
      DepartamentoService.getAll(pagina, busca).then((result) => {
        if (result instanceof Error) {
          alert(result.message);
        } else {
          console.log(result.data);
          setRowsDepart(result.data);
        }
      });
    });
  }, [busca]);

  const depart = rowsDepart.map((row) => ({
    value: row.id,
    label: row.nome,
  }));

  const handleSave = (dados: IFormData) => {
    formValidationSchema
      .validate(dados, { abortEarly: false })
      .then((dadosValidados) => {
        setIsLoading(true);
        if (id === "nova") {
          console.log(dadosValidados);

          SetorService.create(dadosValidados).then((result) => {
            setIsLoading(false);
            if (result instanceof Error) {
              alert(result.message);
            } else {
              if (isSaveAndClose()) {
                toast.success(` ${nome} adicionado com sucesso!`);
                navigate("/setor");
              } else {
                navigate(`/setor/detalhe/${result}`);
              }
            }
          });
        } else {
          SetorService.updateById(Number(id), {
            id: Number(id),
            ...dadosValidados,
          }).then((result) => {
            setIsLoading(false);
            if (result instanceof Error) {
              alert(result.message);
            } else {
              if (isSaveAndClose()) {
                toast.success("Setor atualizado com sucesso!");
                navigate("/setor");
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
        SetorService.deleteById(id).then((result) => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            toast.success("Setor excluído com sucesso!");
            navigate("/setor");
          }
        });
      }
    });
  };

  // const handleChange(e){
  //   console.log(e)
  //   setSelectedItem({id:e.value, nome:e.label})
  // }
  return (
    <LayoutBaseDePagina
      titulo={id === "nova" ? "Cadastrar Novo Setor" : nome}
      barraDeFerramentas={
        <FerramentasDeDetalhe
          //textoBotaoNovo="Adicionar"
          //mostrarBotaoSalvarEFechar
          //mostrarBotaoNovo={id !== "nova"}
          mostrarBotaoApagar={id !== "nova"}
          aoClicarEmSalvar={saveAndClose}
          //aoClicarEmSalvarEFechar={saveAndClose}
          aoClicarEmVoltar={() => navigate("/setor")}
          aoClicarEmApagar={() => {
            handleDelete(Number(id));
          }}
          //aoClicarEmNovo={() => navigate("/setor/detalhe/nova")}
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
              <Typography variant="h6">Selecione o Departamento</Typography>
            </Grid>

            <Grid container item direction="column" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <FormControl fullWidth>
                  <Select
                    //value={selectedItem}
                    options={depart}
                    isClearable
                    onChange={(values) => setSelectedItem(values)}
                    placeholder="Departamentos"
                  />
                </FormControl>
              </Grid>
            </Grid>

            <Grid item>
              <Typography variant="h6">Nome do Setor</Typography>
            </Grid>
            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  size="small"
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
