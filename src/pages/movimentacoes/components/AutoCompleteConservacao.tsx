import { useEffect, useMemo, useState } from "react";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";

import { useDebounce } from "../../../shared/hooks";
import { useField } from "@unform/core";
import { SetorService } from "../../../shared/services/api/SetorService";

type TAutoCompleteConservacao = {
  id: number;
  label: string;
};

interface IAutoCompleteConservacaoProps {
  isExternalLoading?: boolean;
  setPegarOrigemId?: React.Dispatch<React.SetStateAction<any>>;
}
export const AutoCompleteConservacao: React.FC<
  IAutoCompleteConservacaoProps
> = ({ isExternalLoading = false, setPegarOrigemId: setPegarOrigemId }) => {
  const { fieldName, registerField, defaultValue, error, clearError } =
    useField("origem");
  const { debounce } = useDebounce();

  const [selectedId, setSelectedId] = useState<number | undefined>(
    defaultValue
  );
  const [opcoes, setOpcoes] = useState<TAutoCompleteConservacao[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => selectedId,
      setValue: (_, newSelectedId) => setSelectedId(newSelectedId),
    });
  }, [registerField, fieldName, selectedId]);

  useEffect(() => {
    setIsLoading(true);

    debounce(() => {
      SetorService.getAll(1, busca).then((result) => {
        setIsLoading(false);

        if (result instanceof Error) {
          alert(result.message);
        } else {
          //console.log(result);

          setOpcoes(
            result.data.map((setor) => ({
              id: setor.id,
              label: setor.nome,
            }))
          );
          //console.log(selectedId); //MOSTRAR ID PARA ENVIAR PARA O BANCO E MANIPULAR
        }
      });
    });
  }, [busca, selectedId]);
  const autoCompleteSelectedOption = useMemo(() => {
    if (!selectedId) return null;

    const selectedOption = opcoes.find((opcao) => opcao.id === selectedId);
    if (!selectedOption) return null;
    console.log("teste", selectedOption);
    // if (selectedOption) {
    //   setGetOrigemId(selectedOption!);
    // }
    setPegarOrigemId!(selectedOption);

    return selectedOption;
  }, [selectedId, opcoes]);

  return (
    <Autocomplete
      openText="Abrir"
      closeText="Fechar"
      noOptionsText="Sem opções"
      loadingText="Carregando..."
      disablePortal
      options={opcoes}
      loading={isLoading}
      disabled={isExternalLoading}
      value={autoCompleteSelectedOption}
      onInputChange={(_, newValue) => setBusca(newValue)}
      onChange={(_, newValue) => {
        setSelectedId(newValue?.id);
        setBusca("");
        clearError();
      }}
      popupIcon={
        isExternalLoading || isLoading ? (
          <CircularProgress size={26} />
        ) : undefined
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label="Origem"
          error={!!error}
          helperText={error}
        />
      )}
    />
  );
};
