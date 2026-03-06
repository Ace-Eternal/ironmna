import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './stores';
import App from './App';
import '@/design/index.less';
// register svg icon
import 'virtual:svg-icons-register';
ReactDOM.createRoot(document.getElementById('root')).render(_jsx(React.StrictMode, { children: _jsx(Provider, { store: store, children: _jsx(PersistGate, { persistor: persistor, children: _jsx(App, {}) }) }) }));
