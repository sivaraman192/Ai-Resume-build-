import React from 'react';

export const FormTextarea = ({
  label,
  id,
  placeholder,
  value,
  onChange,
  rows = 4,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <textarea
        id={id}
        name={id}
        placeholder={placeholder}
        value={value || ''}
        onChange={onChange}
        rows={rows}
        required={required}
        disabled={disabled}
        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium resize-y"
        {...props}
      />
    </div>
  );
};

export default FormTextarea;
