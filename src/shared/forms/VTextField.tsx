import { TextField, TextFieldProps } from "@mui/material";
import { useField } from "@unform/core";
import { useEffect, useState } from "react";

type TVTextFieldProps = TextFieldProps & {
  name: string;
};
export const VTextField: React.FC<TVTextFieldProps> = ({ name, ...rest }) => {
  const { fieldName, registerField, defaultValue, error, clearError } =
    useField(name);

  const [value, setValue] = useState(defaultValue || "");

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => value,
      setValue: (_, newValue) => setValue(newValue),
    });
  }, [registerField, fieldName, value]);

  return (
    <TextField
      {...rest}
      error={!!error} //Primeiro ! transforma de string undefined para boolean. O segundo é que quando transforma pra booleano, padrão é true, então inverte o padrão
      helperText={error}
      defaultValue={defaultValue}
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        rest.onChange?.(e);
      }}
      onKeyDown={(e) => {
        error && clearError();
        rest.onKeyDown?.(e);
      }}
      /**
      onChange e onKeyDown vão fazer com que ao
      alterar o nome no textfield, altere simultaneamente
      no <h1> */
    />
  ); //{...rest} recebe todas as propriedades do textfield do unform e redireciona para o VTextField
};
