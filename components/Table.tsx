export default function Table({ headers, values, selectedFields } :
  {
    headers: string[],
    values: object[],
    selectedFields: string[],
  }) {
  return (
    <table className="table-fixed w-full">
      <TableHeader headers={headers}/>
      <tbody>
        {values.map((value: object, index: number) =>
          <TableRow
            key={`tr${index}`}
            index={`${index}`}
            value={value}
            selectedFields={selectedFields}
            alternate={index % 2 === 0}
          />,
        )}
      </tbody>
    </table>
  );
}

function TableHeader({ headers } : {
  headers: string[],
}) {
  return (
    <thead>
      <tr key={'table-header'}>
        {headers.map((header: string) =>
          <th className="truncate text-left px-4 py-1" key={header}>
            {header}
          </th>,
        )}
      </tr>
    </thead>
  );
}

function TableRow({ index, selectedFields, value, alternate } : {
  index: string,
  selectedFields: string[],
  value: object,
  alternate: boolean,
}) {
  return (
    <tr className={alternate ? 'bg-gray-200' : undefined} key={`r${index}`}>
      {selectedFields.map((field: string, subIndex: number) =>
        <RowField
          key={`rf${index}-${subIndex}`}
          index={`rf${index}-${subIndex}`}
          value={value[field]}
        />,
      )}
    </tr>
  );
}

function RowField({ index, value } : {
  index: string,
  value: string,
}) {
  return (
    <td key={index} className="border px-4 py-1">
      {value}
    </td>
  );
}
