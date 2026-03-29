import React, { forwardRef } from "react";
import { TextInput as RNTextInput } from "react-native";
import { FieldLabel, FieldWrapper, BaseInput, fieldStyles } from "./field";

type Props = {
  disabled?: boolean;
  name: string;
  title: string;
  data: string;
  setData: (v: string) => void;
  rows?: number;
};

const TextAreaInput = forwardRef<RNTextInput, Props>(
  ({ disabled, title, data, setData, rows = 4 }, ref) => {
    return (
      <FieldWrapper>
        <FieldLabel title={title} />
        <BaseInput
          ref={ref}
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
  }
);

export default TextAreaInput;