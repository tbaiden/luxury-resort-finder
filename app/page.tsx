"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ResortCardImage from "./components/ResortCardImage";
import { getAllResorts } from "../lib/resorts";
import type { Resort } from "../lib/types";

const APP_PASSWORD = "S3yche11es!";

const destinationTypeLabels: Record<string, string> = {
  ultra_island: "Ultra Island",
  luxury_5_star: "Luxury 5-Star",
};

function getTypeLabel(type: string) {
  return destinationTypeLabels[type] ?? type.replace(/_/g, " ");
}

function getCountryClass(country: string) {
  const key = country.toLowerCase();
  const map: Record<string, string> = {
    maldives: "maldives",
    seychelles: "seychelles",
    oman: "oman",
    vietnam: "vietnam",
    "french polynesia": "polynesia",
  };
  return map[key] || key.replace(/\s+/g, "-");
}

function getMonthName(month: number) {
  return new Date(0, month - 1).toLocaleString("default", { month: "long" });
}

function getDescriptor(resort: Resort) {
  if (resort.tagline) return resort.tagline;
  if (resort.tags.includes("private_island")) return "Private island seclusion";
  if (resort.tags.includes("overwater")) return "Overwater villa retreat";
  if (resort.tags.includes("wellness")) return "Wellness sanctuary";
  if (resort.tags.includes("romantic")) return "Romantic barefoot luxury";
  return resort.bookingHint?.split(".")[0] || "Exceptional service and privacy";
}

const curatedChips = [
  "Romance",
  "Private island",
  "Under 6 hours flight",
  "Best in winter sun",
  "Ultra-luxury",
];

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
      <main className="preview-page">
        <div className="preview-card">
          <p className="preview-eyebrow">PRIVATE PREVIEW</p>
          <h1 className="preview-title">Luxury Resort Finder</h1>
          <p className="preview-copy">
            Enter the preview password to access the private shortlist.
          </p>

          <form className="preview-form" onSubmit={handleUnlock}>
            <label htmlFor="password">Enter password</label>
            <input
              id="password"
              type="password"
              value={enteredPassword}
              onChange={(e) => {
                setEnteredPassword(e.target.value);
                if (passwordError) setPasswordError("");
              }}
            />

            {passwordError ? <p className="preview-error">{passwordError}</p> : null}

            <button type="submit" className="btn btn-primary">
              Enter preview
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main>
      <section className="hero-section">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="hero-video"
          poster="/resorts/luxury-hero-photo.jpg"
          aria-hidden="true"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="hero-content">
          <p className="hero-eyebrow">PRIVATE PREVIEW</p>
          <h1 className="hero-heading">
            Private islands, overwater villas, and barefoot luxury — matched to how you want to travel.
          </h1>
          <p className="hero-copy">
            A curated finder for extraordinary resorts across the Maldives, Seychelles, and beyond.
          </p>
          <div className="hero-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => document.getElementById("filters")?.scrollIntoView({ behavior: "smooth" })}
            >
              Start exploring
            </button>
            <a href="#featured-resorts" className="btn btn-secondary">
              Browse featured resorts
            </a>
          </div>
        </div>
      </section>

      <section className="filter-section" id="filters">
        <div className="filter-panel">
          <p className="filter-helper">Refine by stay style, travel time, budget, and season.</p>

          <div className="filter-grid">
            <div className="filter-field">
              <label className="filter-label" htmlFor="resortType">
                Stay style
              </label>
              <select
                id="resortType"
                className="filter-control"
                value={resortType}
                onChange={(e) => setResortType(e.target.value)}
              >
                <option value="all">All stays</option>
                <option value="ultra_island">Ultra Island</option>
                <option value="luxury_5_star">Luxury 5-Star</option>
              </select>
            </div>

            <div className="filter-field">
              <label className="filter-label" htmlFor="flightTime">
                Max flight time
              </label>
              <input
                id="flightTime"
                className="filter-control"
                type="number"
                min="1"
                value={maxFlightTime}
                onChange={(e) => setMaxFlightTime(e.target.value)}
              />
            </div>

            <div className="filter-field">
              <label className="filter-label" htmlFor="budget">
                Budget, max nightly
              </label>
              <input
                id="budget"
                className="filter-control"
                type="text"
                inputMode="numeric"
                value={budgetInput}
                onChange={(e) => {
                  const digitsOnly = e.target.value.replace(/[^\d]/g, "");
                  setBudgetInput(digitsOnly);
                }}
              />
            </div>

            <div className="filter-field">
              <label className="filter-label" htmlFor="travelMonth">
                Travel month
              </label>
              <select
                id="travelMonth"
                className="filter-control"
                value={travelMonth}
                onChange={(e) => setTravelMonth(e.target.value)}
              >
                {Array.from({ length: 12 }, (_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {getMonthName(index + 1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="intro-section">
        <p className="section-eyebrow">CURATED COLLECTION</p>
        <h2 className="section-heading">A shortlist of exceptional stays</h2>
        <p className="section-copy">
          Each resort is selected for privacy, design, service, and sense of place.
        </p>
      </section>

      <div className="curated-strip">
        {curatedChips.map((chip) => (
          <span key={chip} className="curated-chip">
            {chip}
          </span>
        ))}
      </div>

      <section className="resort-grid-section" id="featured-resorts">
        <div className="resort-grid-header">
          <p className="resort-grid-count">{filteredResorts.length} resorts matched</p>
        </div>

        <div className="resort-grid">
          {filteredResorts.map((resort) => (
            <article key={resort.id} className={`resort-card ${getCountryClass(resort.country)}`}>
              <Link href={`/resort/${resort.slug}`} className="resort-card__touchable">
                <div className="resort-card__image">
                  <ResortCardImage resort={resort} />
                  <span className="resort-card__type">{getTypeLabel(resort.destinationType)}</span>
                </div>
                <div className="resort-card__content">
                  <p className="resort-card__meta">
                    {resort.region}, {resort.country}
                  </p>
                  <h3 className="resort-card__title">{resort.name}</h3>
                  <p className="resort-card__descriptor">{getDescriptor(resort)}</p>
                  <div className="resort-card__details">
                    <span>From £{resort.nightlyPriceLow}</span>
                    <span>{resort.flightTimeFromLondonHours} hours from London</span>
                  </div>
                </div>
              </Link>
              <div className="resort-card__actions">
                <span className="card-link">Explore resort</span>
                <a
                  className="card-external"
                  href={resort.officialWebsite}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open official resort site
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}