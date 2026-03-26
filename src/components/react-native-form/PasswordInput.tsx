import React from 'react';
import { FieldLabel, FieldWrapper, BaseInput, fieldStyles } from './field';

type Props = {
  isPasswordVisible?: boolean;
  disabled?: boolean;
  name: string;
  title: string;
  data: string;
  setData: (v: string) => void;
};

const PasswordInput = ({
  isPasswordVisible,
  disabled,
  title,
  data,
  setData,
}: Props) => {
  return (
    <FieldWrapper>
      <FieldLabel title={title} />
      <BaseInput
        editable={!disabled}
        secureTextEntry={!isPasswordVisible}
        value={data}
        onChangeText={setData}
        placeholder={`${title}을(를) 입력하세요`}
        style={[fieldStyles.input, disabled && fieldStyles.disabled]}
      />
    </FieldWrapper>
  );
};

export default PasswordInput;
