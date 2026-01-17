import "./LP.css";
import { useNavigate } from "react-router-dom";

// Images (from your actual folder path)
import logo from "./images/public/real_logo.jpg";
import hero from "./images/public/second_bg.png";
import royal from "./images/public/royal-pharm.jpeg";
import limbe from "./images/public/limbe-pharm.jpg";
import palais from "./images/public/palais.jpg";
import glory from "./images/public/glorypharm.png";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      {/* Header */}
      <header>
        <div className="logo">
          <img src={logo} alt="Innopharma logo" />
        </div>

        <nav>
          <a href="#home">Home</a>
          <a href="#pharmacies">Pharmacies</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="search_bar">
          <input type="search" placeholder="Search for medicines..." />
        </div>

        <div className="SignUp">
          <button
            className="SignUp_style"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>

          <button
            className="SignUp_style"
            onClick={() => navigate("/login")}
          >
            Log In
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="doctor" id="home">
        <div className="doctor_text">
          <h1>Easy Access to Medicine in Cameroon</h1>
          <p>
            Innopharma connects patients and pharmacies all over Cameroon.
            Find drugs, compare availability, and order from trusted pharmacies.
          </p>
          <button>Start Searching</button>
        </div>

        <div className="doctor_image">
          <div className="image_placeholder">
            <img src={hero} alt="Healthcare professional" />
          </div>
        </div>
      </section>

      {/* Pharmacies Section */}
      <section className="products_section" id="pharmacies">
        <div className="stats_box">
          <h2>100K+</h2>
          <p>Happy Subscribers</p>
        </div>

        <div className="product_list">
          <article className="product_card">
            <img src={royal} alt="Royal Pharmacy" />
            <p>Royal Pharmacy</p>
            <span>Buea, Great Soppo</span>
          </article>

          <article className="product_card">
            <img src={limbe} alt="Limbe Pharmacy" />
            <p>Limbe Pharmacy</p>
            <span>Limbe, Mile One</span>
          </article>

          <article className="product_card">
            <img src={palais} alt="Pharmacy du Palais" />
            <p>Pharmacy du Palais</p>
            <span>Yaoundé, Etoudi</span>
          </article>

          <article className="product_card">
            <img src={glory} alt="Glory Pharmacy" />
            <p>Glory Pharmacy</p>
            <span>Tiko</span>
          </article>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>© 2025 Innopharma - Connecting patients and pharmacies worldwide.</p>
      </footer>
    </>
  );
}

export default LandingPage;
