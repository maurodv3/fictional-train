function DailyBookRow({ entry, startGroup, optGroup, endGroup, mappers, alternate }) {

  const map = (mappers, operation, field) => {
    if (mappers[field]) {
      const mapped = mappers[field](operation[field]);
      if (operation['assets'] && field === 'account_id') {
        return <p className="pl-5">{mapped}</p>;
      }
      return <p>{mapped}</p>;
    }
    return <p>{operation[field]}</p>;
  };

  const borderThin = `border border-gray-500 px-2 py-1 ${alternate ? 'bg-white' : 'bg-gray-200'}`;
  const borderThick = `px-2 py-1 border border-gray-500 border-b-2 ${alternate ? 'bg-white' : 'bg-gray-200'}`;

  return (
    entry.entry_seat_lines.map((operation, index) => {
      return (
        index === 0 ? (
          <tr key={`${entry['entry_seat_id']}-${operation['entry_seat_line_id']}`}>
            {
              startGroup.map(field =>
                <td key={`${entry['entry_seat_id']}-${operation['entry_seat_line_id']}-${field}`}
                    className={borderThick}
                    rowSpan={entry.entry_seat_lines.length}>
                  {entry[field]}
                </td>
              )
            }
            {
              optGroup.map(field =>
                <td key={`${entry['entry_seat_id']}-${operation['entry_seat_line_id']}-${field}`} className={borderThin}>
                  { map(mappers, operation, field) }
                </td>
              )
            }
            {
              endGroup.map(field =>
                <td key={`${entry['entry_seat_id']}-${operation['entry_seat_line_id']}-${field}`}
                    className={borderThick}
                    rowSpan={entry.entry_seat_lines.length}>
                  {entry[field]}
                </td>
              )
            }
          </tr>
        ) : (
          index === (entry.entry_seat_lines.length - 1) ? (
            <tr key={`${entry['entry_seat_id']}-${operation['entry_seat_line_id']}`}>
              {
                optGroup.map(field => <td key={`${entry['entry_seat_id']}-${operation['entry_seat_line_id']}-${field}`} className={borderThick}>
                    { map(mappers, operation, field) }
                  </td>
                )
              }
            </tr>
          ) : (
            <tr key={`${entry['entry_seat_id']}-${operation['entry_seat_line_id']}`}>
              {
                optGroup.map(field =>
                  <td key={`${entry['entry_seat_id']}-${operation['entry_seat_line_id']}-${field}`} className={borderThin}>
                    { map(mappers, operation, field) }
                  </td>
                )
              }
            </tr>
          )
        )
      );
    })
  );
}

export default function DailyBookTable({ headers, entries, startGroup, endGroup, optGroup, mappers }) {
  return (
    <table className="table-auto w-full">
      <thead>
      <tr>
        { headers.map(header => <th key={header} className="border-2 border-gray-500 px-4 py-2">{header}</th>) }
      </tr>
      </thead>
      <tbody>
      { entries.map((entry, index) =>
        <DailyBookRow
          key={index}
          entry={entry}
          startGroup={startGroup}
          endGroup={endGroup}
          optGroup={optGroup}
          mappers={mappers}
          alternate={index % 2 === 0}
        />)}
      </tbody>
    </table>
  );
}
