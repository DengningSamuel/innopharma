import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import PharmaciesPage from "./PharmaciesPage";
import MedicinesPage from "./MedicinesPage";

const LANDING_URL =
  import.meta.env.VITE_LANDING_URL ?? "http://localhost:5000/public/LP.html";

const LandingRedirect = () => {
  useEffect(() => {
    window.location.href = LANDING_URL;
  }, []);

  return <p>Redirecting to the landing page...</p>;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingRedirect />} />
      <Route path="/pharmacies" element={<PharmaciesPage />} />
      <Route path="/medicines" element={<MedicinesPage />} />
    </Routes>
  );
}

export default App;
