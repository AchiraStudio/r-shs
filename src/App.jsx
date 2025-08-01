import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./elements/pages/main";
import Christmas from './elements/pages/event-1'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/Christmas" element={<Christmas />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
