import React from 'react';
import DnDFlow from './dnDFlow';
import { DndProvider } from 'react-dnd';
import { ReactFlowProvider } from '@xyflow/react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <DndProvider backend={HTML5Backend}>
          <ReactFlowProvider>
            <DnDFlow />
          </ReactFlowProvider>
        </DndProvider>
      </PersistGate>
    </Provider>
  );
}
