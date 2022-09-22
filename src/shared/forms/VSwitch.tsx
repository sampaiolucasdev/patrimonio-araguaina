import { useEffect, useState } from "react";
import { Switch, SwitchProps } from "@mui/material";
import { useField } from "@unform/core";

type TVSwitchProps = SwitchProps & {
  name: string;
  isChecked: boolean;
};
export const VSwitch: React.FC<TVSwitchProps> = ({
  name,
  isChecked,
  ...rest
}) => {
  const { fieldName, registerField, defaultValue, error, clearError } =
    useField(name);
  const [value, setValue] = useState(isChecked || false);
  //console.log("checkedvalue", checkedValue);

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => value,
      setValue: (_, newValue) => setValue(newValue),
    });
  }, [registerField, fieldName, value]);

  return (
    <Switch
      {...rest}
      //defaultChecked={defaultValue}
      defaultChecked={isChecked}
      checked={value || false}
      onChange={(e, checked) => {
        setValue(checked);
        rest.onChange?.(e, checked);
        error && clearError();
      }}
    />
  );
};
