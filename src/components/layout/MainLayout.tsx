import { Outlet } from "react-router-dom";
import Header from "./Header";
import Cursor from "../ui/Cursor";

const MainLayout = () => {
  return (
    <div className="app-container">
      <Cursor />
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};
export default MainLayout;
