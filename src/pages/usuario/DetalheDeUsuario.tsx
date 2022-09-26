import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Switch,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { VTextField, VForm, useVForm, IVFormErrors } from "../../shared/forms";
import { FerramentasDeDetalhe } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { UsuarioService } from "../../shared/services/api/UsuarioService";
import { VSwitch } from "../../shared/forms/VSwitch";
import { FormatSizeRounded } from "@mui/icons-material";

interface IFormData {
  id: number;
  userName: string;
  nome?: string;
  role?: boolean;
  status?: boolean;
  avatarURL: string;
}
const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
  id: yup.number().required(),
  userName: yup.string().required().min(3),
  nome: yup.string().min(3),
  role: yup.boolean().default(false),
  status: yup.boolean().default(false),
  avatarURL: yup.string().required().min(3),
});

export const DetalheDeUsuario: React.FC = () => {
  const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();
  const { id = "nova" } = useParams<"id">();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [nome, setNome] = useState("");
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState<boolean>(false);
  const [status, setStatus] = useState<boolean>(false);
  const [avatarURL, setAvatarURL] = useState("");

  // const allData = formRef.current?.getData();
  // console.log("allData", allData);
  //console.log("role", role);
  //console.log("status", typeof status);

  useEffect(() => {
    if (id !== "nova") {
      setIsLoading(true);

      UsuarioService.getById(Number(id)).then((result) => {
        setIsLoading(false);
        if (result instanceof Error) {
          alert(result.message);
          navigate("/usuario");
        } else {
          setNome(result.nome!);
          setUserName(result.userName);
          //setRole(result.role);
          //setStatus(result.status);
          setAvatarURL(result.avatarURL);

          console.log(result);
          formRef.current?.setData(result);
        }
      });
    }
  }, [id]);

  const handleSave = (dados: IFormData) => {
    console.log("dados", dados);

    formValidationSchema
      .validate(dados, { abortEarly: false })
      .then((dadosValidados) => {
        console.log("validados", dadosValidados);
        setIsLoading(true);

        console.log("id", id);
        UsuarioService.updateById(Number(id), dadosValidados).then((result) => {
          console.log("result", result);
          setIsLoading(false);
          if (result instanceof Error) {
            alert(result.message);
          } else {
            if (isSaveAndClose()) {
              navigate("/usuario");
            }
          }
          // else {
          //   navigate(`/cidades/detalhe/${result}`);
          // }
        });
      });
  };

  return (
    <LayoutBaseDePagina
      titulo={id === "nova" ? "Cadastrar Novo Usuário" : `Editar "${nome}"`}
      barraDeFerramentas={
        <FerramentasDeDetalhe
          mostrarBotaoNovo={false}
          mostrarBotaoApagar={false}
          aoClicarEmSalvar={saveAndClose}
          //aoClicarEmSalvarEFechar={saveAndClose}
          aoClicarEmVoltar={() => navigate("/usuario")}
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
          {/* GRID PAI */}
          <Grid container padding={2} spacing={2}>
            {isLoading && (
              <Grid item>
                <LinearProgress variant="indeterminate" />
              </Grid>
            )}
            {/* GRID AVATAR E SWITCH */}
            <Grid item xs={2} sm={4} md={2} lg={1.5} xl={1}>
              <Avatar sx={{ width: 100, height: 100 }} src={avatarURL} />
              <FormGroup>
                <FormControlLabel
                  control={<VSwitch name="role" />}
                  label="Admin"
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={<VSwitch name="status" />}
                  label="Ativo"
                />
              </FormGroup>
            </Grid>

            {/* GRID INPUTS */}
            <Grid
              container
              item
              direction="column"
              xs={11}
              sm={6}
              md={6}
              lg={4}
              xl={2}
            >
              <Grid item sx={{ padding: 1 }}>
                <VTextField
                  fullWidth
                  name="nome"
                  disabled={isLoading} //Desabilita o textfield quando estiver carregando
                  label="Nome"
                  onChange={(e) => setNome(e.target.value)} //Altera o nome da cidade no <h1> quando for alterado no textfield
                />
              </Grid>
              <Grid item sx={{ padding: 1 }}>
                <VTextField
                  fullWidth
                  name="userName"
                  disabled={isLoading} //Desabilita o textfield quando estiver carregando
                  label="Usuário"
                  onChange={(e) => setNome(e.target.value)} //Altera o nome da cidade no <h1> quando for alterado no textfield
                />
              </Grid>
              <Grid item sx={{ padding: 1 }}>
                <VTextField
                  fullWidth
                  name="avatarURL"
                  disabled={isLoading} //Desabilita o textfield quando estiver carregando
                  label="URL de Avatar"
                  onChange={(e) => setNome(e.target.value)} //Altera o nome da cidade no <h1> quando for alterado no textfield
                />
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </VForm>
    </LayoutBaseDePagina>
  );
};
