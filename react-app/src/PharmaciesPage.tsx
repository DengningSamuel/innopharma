import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./RecordsPage.css";

type Pharmacy = {
  pharmacy_id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  registration_number: string;
  is_verified?: number | boolean;
  created_at?: string;
};

type ApiResponse<T> = {
  count?: number;
  data?: T[];
  error?: string;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

const formatBoolean = (value: Pharmacy["is_verified"]) => {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "number") {
    return value === 1;
  }
  return false;
};

const PharmaciesPage = () => {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
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
        const payload = (await response.json()) as ApiResponse<Pharmacy>;
        if (!isActive) {
          return;
        }
        setPharmacies(payload.data ?? []);
        setStatus("idle");
      } catch (error) {
        if (!isActive) {
          return;
        }
        setStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Unable to load pharmacies."
        );
      }
    };

    fetchPharmacies();

    return () => {
      isActive = false;
    };
  }, []);

  const verifiedCount = useMemo(
    () => pharmacies.filter((pharmacy) => formatBoolean(pharmacy.is_verified)).length,
    [pharmacies]
  );

  return (
    <div className="records-page">
      <header className="records-header">
        <div>
          <h1>Pharmacies</h1>
          <p>Browse registered pharmacies and their verification status.</p>
        </div>
        <div className="records-actions">
          <Link to="/">Back to Landing</Link>
          <Link to="/medicines">View Medicines</Link>
        </div>
      </header>

      <section className="records-summary">
        <div className="summary-card">
          <span>Total pharmacies</span>
          <strong>{pharmacies.length}</strong>
        </div>
        <div className="summary-card">
          <span>Verified pharmacies</span>
          <strong>{verifiedCount}</strong>
        </div>
      </section>

      {status === "error" && (
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
        <table className="records-table">
          <thead>
            <tr>
              <th>Pharmacy</th>
              <th>Contact</th>
              <th>Registration</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {pharmacies.map((pharmacy) => {
              const isVerified = formatBoolean(pharmacy.is_verified);
              return (
                <tr key={pharmacy.pharmacy_id}>
                  <td>
                    <strong>{pharmacy.name}</strong>
                    <small>{pharmacy.address}</small>
                  </td>
                  <td>
                    {pharmacy.phone}
                    <small>{pharmacy.email}</small>
                  </td>
                  <td>{pharmacy.registration_number}</td>
                  <td>
                    <span
                      className={`status-pill ${isVerified ? "" : "is-false"}`}
                    >
                      {isVerified ? "Verified" : "Pending"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <footer className="records-footer">
        Data is fetched from the Innopharma REST API at{" "}
        <code>{API_BASE || "the same origin"}</code>.
      </footer>
    </div>
  );
};

export default PharmaciesPage;
