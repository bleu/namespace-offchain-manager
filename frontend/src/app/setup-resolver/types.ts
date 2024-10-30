export interface SetupResolverProps {
  resolver: string;
  setResolver: (value: string) => void;
  error: string;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}
