interface InputProps {
  placeholder: string;
  reference?: any;
  type: string;
  className?: string;
}

export function Input({ placeholder, reference, type, className }: InputProps) {
  return (
    <div>
      <input
        ref={reference}
        placeholder={placeholder}
        type={type}
        className={className || "px-4 py-2 border rounded m-2"}
      />
    </div>
  );
}
