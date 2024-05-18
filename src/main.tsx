import React from 'react';
import ReactDOM from 'react-dom/client';
import { gsap, ScrollTrigger, MotionPathPlugin } from 'gsap/all';
import { GSDevTools } from "gsap-trial/GSDevTools";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useGSAP } from "@gsap/react";
import { App } from './App.tsx';
import { ToyMap } from './pages/toy-map/ToyMap.tsx';
import SelectedIsland from './pages/selected-island/SelectedIsland.tsx';
import './index.css';

const baseGsapPlugins: Parameters<typeof gsap.registerPlugin>[0][] = [useGSAP, ScrollTrigger, MotionPathPlugin];

if(import.meta.env.DEV) {
  baseGsapPlugins.push(GSDevTools);
}

gsap.registerPlugin(...baseGsapPlugins);

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children: [
      {
        path: '/',
        element: <ToyMap/>
      },
      {
        path: '/selected-island',
        element: <SelectedIsland/>
      },
    ],
  },
], { basename: '/toyland' });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
