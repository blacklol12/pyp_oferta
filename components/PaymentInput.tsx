
export default function PaymentInput({
  icon,
  placeholder,
  type = "text",
  value,
  onChange,
  error,
}: {
  icon?: React.ReactNode;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 border rounded-[14px] px-4 py-4 mt-4 ${error ? "border-red-500" : "border-gray-300"
        }`}
    >
      {icon && <span className="text-[22px] text-gray-600">{icon}</span>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-[19px] outline-none"
      />
    </div>
  );
}