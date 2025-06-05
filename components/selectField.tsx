import { FormError } from "./formError";

interface FormSelectProps {
  label: string;
  name: string;
  register: any;
  error?: string;
  options: { label: string; value: string }[];
}

export const FormSelect = ({ label, name, register, error, options }: FormSelectProps) => (
  <div className="mb-4">
    <label className="block mb-1">{label}</label>
    <select {...register(name)} className="border rounded px-3 py-2 w-full">
      {options.map((option, i) => (
        <option value={option.value} key={i}>
          {option.label}
        </option>
      ))}
    </select>
    <FormError message={error} />
  </div>
);
