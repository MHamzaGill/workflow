import React, { useCallback } from 'react';
import Sidebar from './sideBar';
import { useDrop } from 'react-dnd';
import '@xyflow/react/dist/style.css';
import { ReactFlow, addEdge, useNodesState, useEdgesState, Controls, Background, useReactFlow, Connection } from '@xyflow/react';
import { useDispatch, useSelector } from 'react-redux';
import { addNode, updateNodePosition, addEdges, resetState } from './store/nodeSlice';
import { RootState } from './store/store';

const getId = () => `dndnode_${crypto.randomUUID()}`;

const DnDFlow = () => {
  const dispatch = useDispatch();
  const nodeData = useSelector((state: RootState) => state.nodeData.value);
  const edgeData = useSelector((state: RootState) => state.nodeData.value2);

  console.log("Nodes in Redux:", nodeData);
  console.log("Edges in Redux:", edgeData);

  const [nodes, setNodes, onNodesChange] = useNodesState(nodeData);
  const [edges, setEdges, onEdgesChange] = useEdgesState(edgeData);

  const { screenToFlowPosition } = useReactFlow();
  const [{ canDrop }, drop] = useDrop<{ type: string }, void, { isOver: boolean; canDrop: boolean }>({
    accept: 'NODE',
    drop: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      const position = screenToFlowPosition(clientOffset);
      const newNode = {
        id: getId(),
        type: item.type,
        position,
        data: { label: `${item.type} node` },
      };

      dispatch(addNode(newNode));
      setNodes((nds) => [...nds, newNode]);
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
    }),
  });

  // Handle node position changes
  const onNodesChangeWithRedux = useCallback(
    (changes) => {
      setNodes((nds) =>
        nds.map((node) => {
          const change = changes.find((c) => c.id === node.id);
          if (change?.position) {
            dispatch(updateNodePosition({ id: node.id, position: change.position }));
            return { ...node, position: change.position };
          }
          return node;
        })
      );
    },
    [dispatch]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
      dispatch(addEdges(params));
    },
    [dispatch]
  );

  // ✅ Reset Redux State and UI
  const handleReset = () => {
    dispatch(resetState()); // Reset Redux state
    setNodes([]); // Clear UI nodes
    setEdges([]); // Clear UI edges
  };

  return (
    <div className="dndflow" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ padding: '10px', textAlign: 'right' }}>
        <button onClick={handleReset} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>Reset</button>
      </div>
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <div className="reactflow-wrapper" ref={drop} style={{ flex: 1, border: '2px dashed #ddd', backgroundColor: canDrop ? '#E3FCEF' : '#F7F9FB' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChangeWithRedux}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <Controls />
            <Background />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

export default DnDFlow;
