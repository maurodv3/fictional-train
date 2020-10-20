import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import React, { useRef } from 'react';

export const ItemTypes = {
  ROW: 'row'
};

function Headers({ headers }) {
  return (
    <thead>
    <tr>
      { headers.map((header, index) => (<th key={`header-${index}`} className="px-4 py-2">{header}</th>)) }
    </tr>
    </thead>
  );
}

function Row({ item, displayFieldsNames, index, onMove, onDelete }) {

  const ref = useRef(null);

  const [{ isDragging, opacity }, drag, preview] = useDrag({
    item: { index, type: ItemTypes.ROW },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
      opacity: monitor.isDragging() ? 1 : 1
    })
  });

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.ROW,
    drop: ((item, monitor) => {
      onMove(item['index'], index);
    }),
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  });

  preview(drop(ref));

  return (
    <tr ref={ref} className={index % 2 === 0 ? 'bg-gray-100' : null }>
      { displayFieldsNames.map(field => (<td key={`field-${field}-${index}`} className="border px-4 py-2">{item[field]}</td>)) }
      <td className="px-4 py-2 w-12 bg-white">
        <div className="flex">
          <div ref={drag}>
            <svg className="h-5 w-5 mr-1 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </div>
          <div>
            <button onClick={() => onDelete(index)} type="button">
              <svg className="h-5 w-5 mr-1 ml-1" xmlns="http://www.w3.org/2000/svg"
                   fill="none" viewBox="0 0 24 24" stroke="indigo" fillOpacity="0.5" strokeOpacity="0.8">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
}

export default function TableV2({ items, headers, displayFieldsName, onMove, onDelete } : {
  items: object[];
  headers: string[];
  displayFieldsName: string[];
  onMove: (draggedIndex: number, droppedIndex: number) => void;
  onDelete: (deletedIndex: number) => void;
}) {
  return (
    <DndProvider backend={HTML5Backend}>
      <table className="table-auto w-full">
        <Headers headers={headers}/>
        <tbody>
        {
          items.map((item, index) => {
            return <Row key={index} item={item} displayFieldsNames={displayFieldsName}
                        index={index} onMove={onMove} onDelete={onDelete}/>;
          })
        }
        </tbody>
      </table>
    </DndProvider>
  );
}
