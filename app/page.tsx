"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getAllResorts } from "../lib/resorts";

const APP_PASSWORD = "S3yche11es!";

export default function HomePage() {
  const resorts = getAllResorts();

  const [enteredPassword, setEnteredPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [resortType, setResortType] = useState("all");
  const [maxFlightTime, setMaxFlightTime] = useState("24");
  const [budgetInput, setBudgetInput] = useState("10000");
  const [travelMonth, setTravelMonth] = useState("1");

  const parsedMaxFlightTime = Number(maxFlightTime) || 24;
  const parsedBudget = Number(budgetInput) || 10000;
  const parsedTravelMonth = Number(travelMonth) || 1;

  const filteredResorts = useMemo(() => {
    return resorts.filter((resort) => {
      if (resortType !== "all" && resort.destinationType !== resortType) return false;
      if (resort.flightTimeFromLondonHours > parsedMaxFlightTime) return false;
      if (resort.nightlyPriceHigh > parsedBudget) return false;

      const matchesMonth =
        resort.peakSeasonMonths.includes(parsedTravelMonth) ||
        resort.shoulderSeasonMonths.includes(parsedTravelMonth) ||
        resort.offPeakSeasonMonths.includes(parsedTravelMonth);

      if (!matchesMonth) return false;

      return true;
    });
  }, [resorts, resortType, parsedMaxFlightTime, parsedBudget, parsedTravelMonth]);

  function handleUnlock(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (enteredPassword === APP_PASSWORD) {
      setIsUnlocked(true);
      setPasswordError("");
      return;
    }

    setPasswordError("Incorrect password. Please try again.");
  }

  if (!isUnlocked) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "linear-gradient(180deg, #f8f1e7 0%, #efe5d8 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "460px",
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            padding: "32px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
            border: "1px solid #eadfce",
          }}
        >
          <p
            style={{
              margin: "0 0 10px 0",
              fontSize: "12px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#8a7f73",
              fontWeight: 700,
            }}
          >
            Private preview
          </p>

          <h1
            style={{
              margin: "0 0 12px 0",
              fontSize: "34px",
              lineHeight: 1.1,
              color: "#1f1a17",
            }}
          >
            Luxury Resort Finder
          </h1>

          <p
            style={{
              margin: "0 0 24px 0",
              fontSize: "16px",
              lineHeight: 1.6,
              color: "#5f5a55",
            }}
          >
            This preview is password protected while the app is still being refined.
          </p>

          <form onSubmit={handleUnlock}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: 600,
                color: "#2a2521",
              }}
            >
              Enter password
            </label>

            <input
              id="password"
              type="password"
              value={enteredPassword}
              onChange={(e) => {
                setEnteredPassword(e.target.value);
                if (passwordError) setPasswordError("");
              }}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "12px",
                border: "1px solid #d8cfc3",
                fontSize: "16px",
                marginBottom: "14px",
                outline: "none",
              }}
            />

            {passwordError ? (
              <p
                style={{
                  margin: "0 0 14px 0",
                  fontSize: "14px",
                  color: "#b42318",
                }}
              >
                {passwordError}
              </p>
            ) : null}

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "12px",
                border: "none",
                backgroundColor: "#1f6f78",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Enter preview
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>Luxury Resort Finder</h1>
        <p style={{ fontSize: "18px", color: "#666" }}>
          Discover the world's most exclusive resorts tailored to your preferences.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          marginBottom: "40px",
          justifyContent: "center",
        }}
      >
        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>Resort Type:</label>
          <select
            value={resortType}
            onChange={(e) => setResortType(e.target.value)}
            style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          >
            <option value="all">All</option>
            <option value="ultra_island">Ultra Island</option>
            <option value="luxury_5_star">Luxury 5 Star</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>Max Flight Time (hours):</label>
          <input
            type="number"
            value={maxFlightTime}
            onChange={(e) => setMaxFlightTime(e.target.value)}
            style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>Budget (max nightly):</label>
          <input
            type="text"
            inputMode="numeric"
            value={budgetInput}
            onChange={(e) => {
              const digitsOnly = e.target.value.replace(/[^\d]/g, "");
              setBudgetInput(digitsOnly);
            }}
            style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>Travel Month:</label>
          <select
            value={travelMonth}
            onChange={(e) => setTravelMonth(e.target.value)}
            style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {filteredResorts.map((resort) => (
          <Link
            key={resort.id}
            href={`/resort/${resort.slug}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                cursor: "pointer",
                backgroundColor: "#fff",
              }}
            >
              <img
                src={resort.heroImageUrl}
                alt={resort.name}
                style={{ width: "100%", height: "200px", objectFit: "cover", display: "block" }}
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.onerror = null;
                  target.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect fill='%23e5e5e5' width='300' height='200'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='16' fill='%23999' text-anchor='middle' dominant-baseline='middle'%3EImage unavailable%3C/text%3E%3C/svg%3E";
                }}
              />

              <div style={{ padding: "15px" }}>
                <h3 style={{ margin: "0 0 10px 0", fontSize: "20px" }}>{resort.name}</h3>
                <p style={{ margin: "0", color: "#666" }}>
                  {resort.country}, {resort.region}
                </p>
                <p style={{ margin: "5px 0 0 0", fontSize: "14px" }}>
                  From £{resort.nightlyPriceLow} per night
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}