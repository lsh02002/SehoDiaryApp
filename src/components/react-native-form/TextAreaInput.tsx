import React from "react";
import { FieldLabel, FieldWrapper, BaseInput, fieldStyles } from "./field";

type Props = {
  disabled?: boolean;
  name: string;
  title: string;
  data: string;
  setData: (v: string) => void;
  rows?: number;
};

const TextAreaInput = ({ disabled, title, data, setData, rows = 4 }: Props) => {
  return (
    <FieldWrapper>
      <FieldLabel title={title} />
      <BaseInput
        editable={!disabled}
        multiline
        numberOfLines={rows}
        value={data}
        onChangeText={setData}
        placeholder={`${title}을(를) 입력하세요`}
        style={[
          fieldStyles.input,
          fieldStyles.textarea,
          { minHeight: Math.max(rows, 2) * 24 + 24 },
          disabled && fieldStyles.disabled,
        ]}
      />
    </FieldWrapper>
  );
};

export default TextAreaInput;
