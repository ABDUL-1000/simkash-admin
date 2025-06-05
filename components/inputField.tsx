import { FormError } from "./formError";

interface FormInputProps {
  label: string;
  type: string;
  register: any;
  name: string;
  error?: string;
}

export const FormInput = ({ label, type, register, name, error }: FormInputProps) => (
  <div>
    <label>{label}</label>
    <input type={type} {...register(name)} className="border rounded px-3 py-2 w-full" />
    <FormError message={error} />
  </div>
);
