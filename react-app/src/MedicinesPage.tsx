import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./RecordsPage.css";

type Medicine = {
  medicine_id: number;
  name: string;
  generic_name: string;
  description: string;
  manufacturer: string;
};

type ApiResponse<T> = {
  count?: number;
  data?: T[];
  error?: string;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

const MedicinesPage = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isActive = true;
    const fetchMedicines = async () => {
      setStatus("loading");
      setErrorMessage("");
      try {
        const response = await fetch(`${API_BASE}/medecines`);
        if (!response.ok) {
          throw new Error("Failed to load medicines.");
        }
        const payload = (await response.json()) as ApiResponse<Medicine>;
        if (!isActive) {
          return;
        }
        setMedicines(payload.data ?? []);
        setStatus("idle");
      } catch (error) {
        if (!isActive) {
          return;
        }
        setStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Unable to load medicines."
        );
      }
    };

    fetchMedicines();

    return () => {
      isActive = false;
    };
  }, []);

  const manufacturerCount = useMemo(() => {
    const unique = new Set(
      medicines.map((medicine) => medicine.manufacturer).filter(Boolean)
    );
    return unique.size;
  }, [medicines]);

  return (
    <div className="records-page">
      <header className="records-header">
        <div>
          <h1>Medicines</h1>
          <p>Review available medicines and their generic alternatives.</p>
        </div>
        <div className="records-actions">
          <Link to="/">Back to Landing</Link>
          <Link to="/pharmacies">View Pharmacies</Link>
        </div>
      </header>

      <section className="records-summary">
        <div className="summary-card">
          <span>Total medicines</span>
          <strong>{medicines.length}</strong>
        </div>
        <div className="summary-card">
          <span>Manufacturers</span>
          <strong>{manufacturerCount}</strong>
        </div>
      </section>

      {status === "error" && (
        <div className="records-error">{errorMessage}</div>
      )}

      {status === "loading" && (
        <div className="records-empty">Loading medicines...</div>
      )}

      {status === "idle" && medicines.length === 0 && (
        <div className="records-empty">
          No medicines were returned from the API.
        </div>
      )}

      {medicines.length > 0 && (
        <table className="records-table">
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Generic Name</th>
              <th>Manufacturer</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((medicine) => (
              <tr key={medicine.medicine_id}>
                <td>
                  <strong>{medicine.name}</strong>
                  <small>{medicine.description}</small>
                </td>
                <td>{medicine.generic_name || "—"}</td>
                <td>{medicine.manufacturer || "—"}</td>
              </tr>
            ))}
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

export default MedicinesPage;
