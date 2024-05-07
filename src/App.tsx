import "./App.css";
import { Outlet } from "react-router-dom";

export function App() {
  return (
    <div className="app-container">
      {/* <div className="header">
        <b>Super header</b>
      </div> */}
      <div className="route-container">
        <Outlet />
      </div>
      {/* <div className="footer">
        <b>Super footer</b>
      </div> */}
    </div>
  );
}
