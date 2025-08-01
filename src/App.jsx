import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./elements/pages/main";
import Christmas from './elements/pages/event-1';
import NotFound from './elements/pages/NotFound';

function App() {
  return (
    <BrowserRouter basename="/r-shs">
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/Christmas" element={<Christmas />} />
        <Route path="*" element={<NotFound />} /> {/* catch-all route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
