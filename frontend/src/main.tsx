import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Clock } from "./routes/Clock.tsx";
import { BrowserRouter, Routes, Route } from "react-router";
import { Chooser } from "./routes/Chooser.tsx";
import { Creator,  CreatorEditor } from "./routes/Creator.tsx";
import { CreatorMethodChoice } from "./routes/Creator/MethodChoice.tsx";
import { CreatorCamera } from "./routes/Creator/Camera.tsx";
import { CreatorScreenshare } from "./routes/Creator/Screenshare.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="h-[100dvh] w-full flex overflow-hidden">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Clock />} />
          <Route path="/chooser" element={<Chooser />} />
          <Route path="/creator/:digit" element={<Creator />}>
            <Route index element={<CreatorMethodChoice />} />
            <Route path="camera" element={<CreatorCamera />} />
            <Route path="screenshare" element={<CreatorScreenshare />} />
            <Route path="editor" element={<CreatorEditor />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  </StrictMode>,
);
