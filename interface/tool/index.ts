const Numjudgment = ({ value, scope }: { value?: number; scope: number }) => {
  return typeof value === "number" ? value : scope;
};

export { Numjudgment };
