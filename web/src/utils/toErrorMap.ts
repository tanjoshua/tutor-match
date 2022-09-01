interface FieldError {
  value: string;
  msg: string;
  param: string;
  location: string;
}

export const toErrorMap = (errors: FieldError[]) => {
  const errorMap: Record<string, string> = {};
  for (const err of errors) {
    errorMap[err.param] = err.msg;
  }
  return errorMap;
};
