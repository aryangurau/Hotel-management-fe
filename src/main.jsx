import 'bootstrap/dist/css/bootstrap.min.css';

import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, newStore  } from "./store";



createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <Provider store={store}>
      <PersistGate loading={null} persistor={newStore}>
        <App />
      </PersistGate>
    </Provider>
    </BrowserRouter>
)
