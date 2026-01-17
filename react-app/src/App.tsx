import { Routes, Route } from "react-router-dom";
import Landing from "./LandingPage";
import Signin from "./Signin";
import Signup from "./Signup";
import PharmaciesPage from "./PharmaciesPage";
import MedicinesPage from "./MedicinesPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/pharmacies" element={<PharmaciesPage />} />
      <Route path="/medicines" element={<MedicinesPage />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
