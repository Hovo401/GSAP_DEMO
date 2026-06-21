import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MainLayout from "./components/layout/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route
            path="*"
            element={
              <div className="flex h-screen flex-col items-center justify-center bg-ink text-paper">
                <p className="font-display text-[28vw] leading-none text-flame">
                  404
                </p>
                <p className="text-xl font-light tracking-widest uppercase">
                  Lost in motion
                </p>
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
