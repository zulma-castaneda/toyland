import React from 'react';
import ReactDOM from 'react-dom/client';
import { gsap, ScrollTrigger, MotionPathPlugin } from 'gsap/all';
import { GSDevTools } from "gsap-trial/GSDevTools";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useGSAP } from "@gsap/react";
import App from './App.tsx';
import SinMap from './pages/sin-map/SinMap.tsx';
import GaspMap from './pages/gasp-map/GaspMap.tsx';
import SelectedIsland from './pages/selected-island/SelectedIsland.tsx';
import './index.css';

gsap.registerPlugin(useGSAP, ScrollTrigger, MotionPathPlugin, GSDevTools);

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
      {
        path: '/selected-island',
        element: <SelectedIsland/>
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
