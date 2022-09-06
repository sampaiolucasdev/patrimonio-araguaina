import { useEffect, useState } from "react";
import { Switch, SwitchProps } from "@mui/material";
import { useField } from "@unform/core";

type TVSwitchProps = SwitchProps & {
  name: string;
};
export const VSwitch: React.FC<TVSwitchProps> = ({ name, ...rest }) => {
  const { fieldName, registerField, defaultValue, error, clearError } =
    useField(name);

  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => value,
      setValue: (_, newValue) => setValue(newValue),
    });
  }, [registerField, fieldName, value]);

  console.log("value", value);
  return (
    <Switch
      {...rest}
      //defaultChecked={defaultValue}
      checked={!!value}
      onChange={(e, checked) => {
        setValue(e.target.checked);
        rest.onChange?.(e, checked);
        error && clearError();
      }}
    />
  );
};
