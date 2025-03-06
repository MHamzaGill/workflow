import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NodeData {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { label: string };
}

interface EdgeData {
  source: string;
  target: string;
}

interface NodeState {
  value: NodeData[];
  value2: EdgeData[];
}

const initialState: NodeState = {
  value: [],
  value2: [],
};

const nodeSlice = createSlice({
  name: 'nodeData',
  initialState,
  reducers: {
    addNode: (state, action: PayloadAction<NodeData>) => {
      state.value.push(action.payload);
    },
    updateNodePosition: (state, action: PayloadAction<{ id: string; position: { x: number; y: number } }>) => {
      const node = state.value.find((n) => n.id === action.payload.id);
      if (node) {
        node.position = action.payload.position;
      }
    },
    addEdges: (state, action: PayloadAction<EdgeData>) => {
      state.value2.push(action.payload);
    },
    resetState: () => initialState, // ✅ This resets the Redux store
  },
});

export const { addNode, updateNodePosition, addEdges, resetState } = nodeSlice.actions;
export default nodeSlice.reducer;
