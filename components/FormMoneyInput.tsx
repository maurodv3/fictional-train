import { ChangeEvent } from 'react';

export default function FormMoneyInput({ value, onChange } :
  {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  }) {
  return (
    <div>
      <div className="relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm sm:leading-5 font-bold">$</span>
        </div>
        <input id="price" type="number" className="block pl-7 pr-12 py-2 px-4 sm:text-sm sm:leading-5 std-data-input" placeholder="0,00"
               value={value} onChange={onChange} autoComplete="off"/>
      </div>
    </div>
  );
}
