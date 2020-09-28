import * as React from "react";
import { useField } from "formik";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea,
} from "@chakra-ui/core";

type IAppProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label?: string;
  mt?: string;
  touched: boolean | undefined;
  as?: React.ElementType;
  rows?: number;
};

export const InputField: React.FC<IAppProps> = ({
  mt = "4px",
  as = "input",
  label,
  rows,
  size,
  placeholder,
  touched,
  ...props
}) => {
  const [field, { error }] = useField(props);
  const TextareaOrInput = as === "textarea" ? Textarea : Input;
  return (
    <FormControl isInvalid={!!error && touched} mt={mt}>
      <FormLabel htmlFor={field.name}>{label ? label : field.name}</FormLabel>
      <TextareaOrInput
        gridAutoRows={rows}
        {...field}
        size="sm"
        {...props}
        id={field.name}
      />
      {touched ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};
