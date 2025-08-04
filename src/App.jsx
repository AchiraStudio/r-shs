import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./elements/pages/main";
import Christmas from './elements/pages/event-1';
import Charity from './elements/pages/event-2';
import Mpls from './elements/pages/event-3';
import Valentine from './elements/pages/event-4';
import Pensi from './elements/pages/pensi/main-pensi';
import NotFound from './elements/pages/NotFound';

function App() {
  return (
    <BrowserRouter basename="/r-shs">
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/Christmas" element={<Christmas />} />
        <Route path="/Charity" element={<Charity />} />
        <Route path="/Mpls" element={<Mpls />} />
        <Route path="/Valentine" element={<Valentine />} />
        <Route path="/Pensi" element={<Pensi />} />
        <Route path="*" element={<NotFound />} /> {/* catch-all route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
