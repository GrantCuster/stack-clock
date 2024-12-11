import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Clock } from "./routes/Clock.tsx";
import { BrowserRouter, Routes, Route } from "react-router";
import { Chooser } from "./routes/Chooser.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="h-[100dvh] w-full flex overflow-hidden">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Clock />} />
          <Route path="/chooser" element={<Chooser />} />
        </Routes>
      </BrowserRouter>
    </div>
  </StrictMode>,
);