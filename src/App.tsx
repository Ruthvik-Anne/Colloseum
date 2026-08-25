import { Route, Routes } from "react-router-dom";
import { RootLayout } from "./layouts/RootLayout";
import { LandingPage } from "./pages/LandingPage";
import { ArenaPage } from "./pages/ArenaPage";
import { LogicGraphPage } from "./pages/LogicGraphPage";
import { TerminalPage } from "./pages/TerminalPage";
import { ArchivePage } from "./pages/ArchivePage";

function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/arena/:runId" element={<ArenaPage />} />
        <Route path="/logic-graph" element={<LogicGraphPage />} />
        <Route path="/terminal" element={<TerminalPage />} />
        <Route path="/archive" element={<ArchivePage />} />
      </Route>
    </Routes>
  );
}

export default App;
