import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';

interface BaseProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

// ─── Input ────────────────────────────────────────────────────────────────────

type InputProps = BaseProps & InputHTMLAttributes<HTMLInputElement> & { as?: 'input' };

// ─── Select ───────────────────────────────────────────────────────────────────

type SelectProps = BaseProps & SelectHTMLAttributes<HTMLSelectElement> & {
  as: 'select';
  children: ReactNode;
};

// ─── Textarea ─────────────────────────────────────────────────────────────────

type TextareaProps = BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement> & { as: 'textarea' };

type FormFieldProps = InputProps | SelectProps | TextareaProps;

const baseClass =
  'w-full px-3.5 py-2.5 text-sm border rounded-xl bg-white text-gray-800 placeholder-gray-400 transition-all outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50';

export default function FormField(props: FormFieldProps) {
  const { label, error, hint, required, as = 'input', ...rest } = props;
  const borderClass = error ? 'border-red-300' : 'border-gray-200';

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {as === 'select' ? (
        <select
          className={`${baseClass} ${borderClass}`}
          {...(rest as SelectHTMLAttributes<HTMLSelectElement>)}
        >
          {(props as SelectProps).children}
        </select>
      ) : as === 'textarea' ? (
        <textarea
          className={`${baseClass} ${borderClass} resize-none`}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          className={`${baseClass} ${borderClass}`}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}
