import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./RecordsPage.css";
import royal from "./images/public/royal-pharm.jpeg";
import limbe from "./images/public/limbe-pharm.jpg";
import palais from "./images/public/palais.jpg";
import glory from "./images/public/glorypharm.png";
import fallback from "./images/public/image.png";

type PharmacyRecord = {
  pharmacy_id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  registration_number: string;
  is_verified?: number | boolean;
  created_at?: string;
};

type PharmacyCard = {
  pharmacy_id: number | string;
  name: string;
  address: string;
  phone?: string;
  image?: string;
};

type ApiResponse<T> = {
  count?: number;
  data?: T[];
  error?: string;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";
const LANDING_URL =
  import.meta.env.VITE_LANDING_URL ?? "http://localhost:5000/public/LP.html";

const imageByName: Record<string, string> = {
  "Royal Pharmacy": royal,
  "Limbe Pharmacy": limbe,
  "Pharmacy du Palais": palais,
  "Glory Pharmacy": glory,
};

const featuredPharmacies: PharmacyCard[] = [
  {
    pharmacy_id: "featured-adama",
    name: "ADAMA Pharmacy",
    address: "Ngaoundere",
  },
  {
    pharmacy_id: "featured-africa",
    name: "AFRICA Pharmacy",
    address: "Douala",
  },
  {
    pharmacy_id: "featured-aida",
    name: "AIDA Pharmacy",
    address: "Bafia",
  },
  {
    pharmacy_id: "featured-almarkaz",
    name: "ALMARKAZ Pharmacy",
    address: "Kousseri",
  },
  {
    pharmacy_id: "featured-amazing-company",
    name: "AMAZING COMPANY Pharmacy",
    address: "Buea",
  },
  {
    pharmacy_id: "featured-ambre",
    name: "AMBRE Pharmacy",
    address: "Edea",
  },
  {
    pharmacy_id: "featured-amen",
    name: "AMEN Pharmacy",
    address: "Bamenda",
  },
  {
    pharmacy_id: "featured-amitie",
    name: "AMITIE Pharmacy",
    address: "Garoua",
  },
  {
    pharmacy_id: "featured-amitie-ndjamena",
    name: "AMITIE NDJAMENA Pharmacy",
    address: "Ndjamena",
  },
  {
    pharmacy_id: "featured-beatitude",
    name: "BEATITUDE Pharmacy",
    address: "Yaounde",
  },
  {
    pharmacy_id: "featured-bell",
    name: "BELL Pharmacy",
    address: "Douala",
  },
  {
    pharmacy_id: "featured-bertaud",
    name: "BERTAUD Pharmacy",
    address: "Douala",
  },
  {
    pharmacy_id: "featured-bethesda",
    name: "BETHESDA Pharmacy",
    address: "Yaounde",
  },
  {
    pharmacy_id: "featured-bien-etre",
    name: "BIEN ETRE Pharmacy",
    address: "Yaounde",
  },
  {
    pharmacy_id: "featured-bien-etre-mbouda",
    name: "BIEN-ETRE MBOUDA Pharmacy",
    address: "Mbouda",
  },
  {
    pharmacy_id: "featured-binam",
    name: "BINAM Pharmacy",
    address: "Bafoussam",
  },
  {
    pharmacy_id: "featured-biwole-abondo",
    name: "BIWOLE ABONDO Pharmacy",
    address: "Yaounde",
  },
  {
    pharmacy_id: "featured-biyemassi",
    name: "BIYEMASSI Pharmacy",
    address: "Yaounde",
  },
  {
    pharmacy_id: "featured-black-star",
    name: "BLACK STAR Pharmacy",
    address: "Bamenda",
  },
  {
    pharmacy_id: "featured-royal",
    name: "Royal Pharmacy",
    address: "Buea, Great Soppo",
    image: royal,
  },
  {
    pharmacy_id: "featured-limbe",
    name: "Limbe Pharmacy",
    address: "Limbe, Mile One",
    image: limbe,
  },
  {
    pharmacy_id: "featured-palais",
    name: "Pharmacy du Palais",
    address: "Yaounde, Etoudi",
    image: palais,
  },
  {
    pharmacy_id: "featured-glory",
    name: "Glory Pharmacy",
    address: "Tiko",
    image: glory,
  },
];

const PharmaciesPage = () => {
  const [pharmacies, setPharmacies] = useState<PharmacyCard[]>([]);
  const [status, setStatus] = useState<
    "idle" | "loading" | "error" | "fallback"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isActive = true;
    const fetchPharmacies = async () => {
      setStatus("loading");
      setErrorMessage("");
      try {
        const response = await fetch(`${API_BASE}/pharmacies`);
        if (!response.ok) {
          throw new Error("Failed to load pharmacies.");
        }
        const payload = (await response.json()) as ApiResponse<PharmacyRecord>;
        if (!isActive) {
          return;
        }
        const apiCards =
          payload.data?.map((pharmacy) => ({
            pharmacy_id: pharmacy.pharmacy_id,
            name: pharmacy.name,
            address: pharmacy.address,
            phone: pharmacy.phone,
            image: imageByName[pharmacy.name],
          })) ?? [];
        setPharmacies(apiCards.length > 0 ? apiCards : featuredPharmacies);
        setStatus("idle");
      } catch (error) {
        if (!isActive) {
          return;
        }
        setStatus("fallback");
        setErrorMessage(
          error instanceof Error ? error.message : "Unable to load pharmacies."
        );
        setPharmacies(featuredPharmacies);
      }
    };

    fetchPharmacies();

    return () => {
      isActive = false;
    };
  }, []);

  const displayCount = useMemo(() => pharmacies.length, [pharmacies]);

  return (
    <div className="records-page">
      <header className="records-header">
        <div>
          <h1>Pharmacies</h1>
          <p>Discover nearby pharmacies and where to find them.</p>
        </div>
        <div className="records-actions">
          <a href={LANDING_URL}>Back to Landing</a>
          <Link to="/medicines">View Medicines</Link>
        </div>
      </header>

      <section className="records-summary">
        <div className="summary-card">
          <span>Total pharmacies</span>
          <strong>{displayCount}</strong>
        </div>
      </section>

      {status === "fallback" && (
        <div className="records-error">{errorMessage}</div>
      )}

      {status === "loading" && (
        <div className="records-empty">Loading pharmacies...</div>
      )}

      {status === "idle" && pharmacies.length === 0 && (
        <div className="records-empty">
          No pharmacies were returned from the API.
        </div>
      )}

      {pharmacies.length > 0 && (
        <section className="pharmacy-grid">
          {pharmacies.map((pharmacy) => (
            <article className="pharmacy-card" key={pharmacy.pharmacy_id}>
              <img
                src={pharmacy.image ?? imageByName[pharmacy.name] ?? fallback}
                alt={`${pharmacy.name} storefront`}
                className="pharmacy-image"
              />
              <div className="pharmacy-details">
                <h2>{pharmacy.name}</h2>
                <p className="pharmacy-location">{pharmacy.address}</p>
                {pharmacy.phone && (
                  <p className="pharmacy-contact">{pharmacy.phone}</p>
                )}
              </div>
            </article>
          ))}
        </section>
      )}

      <footer className="records-footer">
        Data is fetched from the Innopharma REST API at{" "}
        <code>{API_BASE || "the same origin"}</code>.
      </footer>
    </div>
  );
};

export default PharmaciesPage;
