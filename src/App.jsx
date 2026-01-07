import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

function Redirect({ to }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);

  return null;
}

function App() {
  return (
    <BrowserRouter basename="/r-shs/">
      <Routes>
        {/* / */}
        <Route
          path="/"
          element={<Redirect to="https://recisascension.com/r-shs" />}
        />

        {/* /page */}
        <Route
          path="/Recis-cup"
          element={<Redirect to="https://recisascension.com/ascension-cup" />}
        />

        {/* optional fallback */}
        <Route
          path="*"
          element={<Redirect to="https://recisascension.com/ascension-cup" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
