import React from 'react';
import { useDrag } from 'react-dnd';

const DraggableNode = ({ type, label }: { type: string; label: string }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'NODE',
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} className="dndnode" style={{ opacity: isDragging ? 0.5 : 1, padding: '8px', margin: '5px', border: '1px solid #333', borderRadius: '4px', cursor: 'grab', backgroundColor: '#f1f1f1' }}>
      {label}
    </div>
  );
};

const Sidebar = () => {
  return (
    <aside style={{ width: '20%', padding: '10px', background: '#f8f8f8' }}>
      <h3>Drag Nodes</h3>
      <DraggableNode type="input" label="Input Node" />
      <DraggableNode type="default" label="Default Node" />
      <DraggableNode type="output" label="Output Node" />
    </aside>
  );
};

export default Sidebar;
