export default function FormSection({ label, children, fixedHeight }) {
  const h = fixedHeight ? `h-${fixedHeight}` : '';
  return (
    <div className="flex flex-wrap -mx-2">
      <div className="w-1/4 px-2">
        <div className={`${h} px-4 py-4 rounded-sm`}>
          <p className="text-xl font-medium text-gray-700">{label}</p>
        </div>
      </div>
      <div className="w-3/4 px-2 border border-gray-100 rounded-md shadow-md bg-white">
        <div className={`${h} rounded-sm px-4 py-4`}>
          {children}
        </div>
      </div>
    </div>
  );
}
