export default function FormSubmit({ children, disabled } : {
  children: object,
  disabled: boolean,
}) {
  return (
    <button
      className={disabled ?
        'bg-indigo-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed' :
        'bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'}
      {...(disabled ? { disabled: true } : {})}
      type="submit">
      {children}
    </button>
  );
}
