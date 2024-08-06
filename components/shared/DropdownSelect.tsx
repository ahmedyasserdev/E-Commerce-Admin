import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


type DropdownSelectProps = {
  children: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
};

const DropdownSelect: React.FC<DropdownSelectProps> = ({ children, value, onChange, placeholder, disabled }) => {
  return (
    <Select disabled={disabled} value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue  defaultValue = {value} placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
          {children}
      </SelectContent>
    </Select>
  );
};

export default DropdownSelect;
