
const InnerToggle = (id, checked, label, onClick) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="inline-flex items-center cursor-pointer">
          <span className="relative">
            <span className="block w-10 h-6 bg-white rounded-full shadow-inner"></span>
            <span
              className={ checked ?
                'absolute block w-4 h-4 mt-1 ml-1 rounded-full shadow inset-y-0 left-0 focus-within:shadow-outline transition-transform duration-300 ease-in-out bg-indigo-700 transform translate-x-full'
                : 'absolute block w-4 h-4 mt-1 ml-1 bg-gray-400 rounded-full shadow inset-y-0 left-0 focus-within:shadow-outline transition-transform duration-300 ease-in-out'}>
                <input id={id} type="checkbox" className="absolute opacity-0 w-0 h-0" onClick={onClick}/>
            </span>
          </span>
        <span className="ml-3 w-10 text-sm font-medium text-gray-700">{label}</span>
      </label>
    </div>
  );
};

export default function ToggleButton({ id, checked, onClick, checkedLabel, uncheckedLabel }) {
  return checked ?
    InnerToggle(`${id}-checked`, true, checkedLabel, onClick) :
    InnerToggle(`${id}-unchecked`, false, uncheckedLabel, onClick);
}
