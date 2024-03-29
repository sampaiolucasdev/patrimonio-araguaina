import { useEffect, useMemo, useState } from "react";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";

import { useDebounce } from "../../../shared/hooks";
import { useField } from "@unform/core";
import { SetorService } from "../../../shared/services/api/SetorService";

type TAutoCompleteOption = {
  id: number;
  label: string;
};

interface IAutoCompleteMovimentacaoProps {
  isExternalLoading?: boolean;
  onChange: (id: number | undefined) => void;
}
export const AutoCompleteDestino: React.FC<IAutoCompleteMovimentacaoProps> = ({
  isExternalLoading = false,
  onChange,
}) => {
  const { fieldName, registerField, defaultValue, error, clearError } =
    useField("destino");
  const { debounce } = useDebounce();

  const [selectedId, setSelectedId] = useState<number | undefined>(
    defaultValue
  );

  const [opcoes, setOpcoes] = useState<TAutoCompleteOption[]>([]);
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
          console.log(result);

          setOpcoes(
            result.data.map((setor) => ({
              id: setor.id,
              label: setor.nome,
            }))
          );
          //console.log(selectedId); MOSTRAR ID PARA ENVIAR PARA O BANCO E MANIPULAR
        }
      });
    });
  }, [busca, selectedId]);

  const autoCompleteSelectedOption = useMemo(() => {
    if (!selectedId) return null;

    const selectedOption = opcoes.find((opcao) => opcao.id === selectedId);
    if (!selectedOption) return null;

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
        onChange(newValue?.id);
      }}
      popupIcon={
        isExternalLoading || isLoading ? (
          <CircularProgress size={26} />
        ) : undefined
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label="Destino"
          error={!!error}
          helperText={error}
        />
      )}
    />
  );
};
