import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./elements/pages/main";
import Pensi from './elements/pages/pensi/main-pensi';
import NotFound from './elements/pages/NotFound';
import Gallery from "./elements/pages/Gallery";
import Recup from "./elements/pages/recup";

function App() {
  return (
    <BrowserRouter basename="/r-shs/">
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/Pensi" element={<Pensi />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/Gallery" element={<Gallery />} />
        <Route path="/Recis-Cup" element={<Recup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
