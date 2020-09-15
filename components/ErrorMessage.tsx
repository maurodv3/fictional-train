export default function ErrorMessage({ children }) {
  return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2"
         role="alert"
         style={{ marginTop: '10px' }}>
      {children}
    </div>
  );
}
