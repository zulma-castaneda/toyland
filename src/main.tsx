import React from 'react';
import ReactDOM from 'react-dom/client';
import gsap from 'gsap';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useGSAP } from "@gsap/react";
import App from './App.tsx';
import SinMap from './pages/sin-map/SinMap.tsx';
import GaspMap from './pages/gasp-map/GaspMap.tsx';
import './index.css';

gsap.registerPlugin(useGSAP);

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children: [
      {
        path: '',
        element: <SinMap/>
      },
      {
        path: '/gsap',
        element: <GaspMap/>
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
