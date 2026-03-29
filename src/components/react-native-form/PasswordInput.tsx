import React, { forwardRef } from "react";
import { TextInput as RNTextInput, TextInputProps } from "react-native";
import { FieldLabel, FieldWrapper, BaseInput, fieldStyles } from "./field";

type Props = {
  isPasswordVisible?: boolean;
  disabled?: boolean;
  name: string;
  title: string;
  data: string;
  setData: (v: string) => void;
} & TextInputProps;

const PasswordInput = forwardRef<RNTextInput, Props>(
  (
    {
      isPasswordVisible = false,
      disabled,
      title,
      data,
      setData,
      ...props
    },
    ref
  ) => {
    return (
      <FieldWrapper>
        <FieldLabel title={title} />
        <BaseInput
          ref={ref}
          editable={!disabled}
          secureTextEntry={!isPasswordVisible}
          value={data}
          onChangeText={setData}
          placeholder={`${title}을(를) 입력하세요`}
          style={[
            fieldStyles.input,
            disabled && fieldStyles.disabled,
          ]}
          {...props}
        />
      </FieldWrapper>
    );
  }
);

export default PasswordInput;