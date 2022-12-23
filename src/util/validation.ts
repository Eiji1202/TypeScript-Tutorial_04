// バリデーションの型
export interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

// バリデーションの関数
export function validate(validatableInput: Validatable) {
  // 値が渡されないかもしれないため初期値はtrue
  let isValid = true;

  // 必須チェックされていた場合
  if (validatableInput.required) {
    // valueに値が入力されていればtrue、未入力であればfalse
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }

  // 最小入力文字数のチェック
  // minLengthの値が設定されていて文字列型の場合、
  if (validatableInput.minLength != null && typeof validatableInput.value === "string") {
    // 設定された値以上であればtrue
    isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
  }

  // 最大入力文字数のチェック
  // maxLengthの値が設定されていて文字列型の場合、
  if (validatableInput.maxLength != null && typeof validatableInput.value === "string") {
    // 設定された値以下であればtrue
    isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
  }

  // 最小値のチェック
  // minの値が設定されていて数値型の場合、
  if (validatableInput.min != null && typeof validatableInput.value === "number") {
    // 設定された値以上であればtrue
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }

  // 最大値のチェック
  // maxの値が設定されていて数値型の場合、
  if (validatableInput.max != null && typeof validatableInput.value === "number") {
    // 設定された値以下であればtrue
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }

  return isValid;
}
