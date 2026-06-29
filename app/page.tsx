"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getAllResorts } from "../lib/resorts";
import type { Resort } from "../lib/types";

const APP_PASSWORD = "S3yche11es!";

const destinationTypeLabels: Record<string, string> = {
  ultra_island: "Ultra Island",
  luxury_5_star: "Luxury 5-Star",
};

const cardImageFallbacksBySlug: Record<string, string> = {
  "soneva-jani": "/resorts/soneva-jani.jpg",
  "north-island-seychelles": "/resorts/north-island-seychelles.jpg",
  amanoi: "/resorts/amanoi.jpg",
  "cheval-blanc-randheli": "/resorts/cheval-blanc-randheli.jpg",
  "six-senses-zighy-bay": "/resorts/six-senses-zighy-bay.jpg",
  "four-seasons-bora-bora": "/resorts/four-seasons-bora-bora.jpg",
  "st-regis-bora-bora": "/resorts/st-regis-bora-bora.jpg",
  "the-brando": "/resorts/the-brando.jpg",
};

const cardImageFallbacksByCountry: Record<string, string> = {
  maldives: "/resorts/maldives.jpg",
  seychelles: "/resorts/seychelles.jpg",
  vietnam: "/resorts/vietnam.jpg",
  oman: "/resorts/oman.jpg",
  "french polynesia": "/resorts/french-polynesia.jpg",
};

const homepageHeroImageCandidates = ["/resorts/placeholder.jpg", "/resorts/luxury-hero-photo.jpg"] as const;

function getTypeLabel(type: string) {
  return destinationTypeLabels[type] ?? type.replace(/_/g, " ");
}

function getMonthName(month: number) {
  return new Date(0, month - 1).toLocaleString("default", { month: "long" });
}

function getFallbackImage(resort: Resort): string {
  return (
    cardImageFallbacksBySlug[resort.slug] ||
    cardImageFallbacksByCountry[resort.country.toLowerCase()] ||
    `/resorts/${resort.slug}.jpg`
  );
}

function getCardImage(resort: Resort): string {
  return resort.cardImageUrl || resort.heroImageUrl || getFallbackImage(resort);
}

function getHeroBackgroundImage(heroImage: string | null) {
  return heroImage
    ? `linear-gradient(180deg, rgba(21, 19, 16, 0.24), rgba(21, 19, 16, 0.72)), url('${heroImage}')`
    : `linear-gradient(180deg, rgba(21, 19, 16, 0.24), rgba(21, 19, 16, 0.72))`;
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

  const [heroImage, setHeroImage] = useState<string | null>(homepageHeroImageCandidates[0]);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const tryLoadNext = (index: number) => {
      if (!isMounted) return;

      const candidate = homepageHeroImageCandidates[index];
      if (!candidate) {
        setHeroImage(null);
        return;
      }

      const image = new window.Image();
      image.onload = () => {
        if (isMounted) {
          setHeroImage(candidate);
        }
      };
      image.onerror = () => {
        tryLoadNext(index + 1);
      };
      image.src = candidate;
    };

    tryLoadNext(0);

    return () => {
      isMounted = false;
    };
  }, []);

  const [resortType, setResortType] = useState("all");
  const [maxFlightTime, setMaxFlightTime] = useState("24");
  const [budgetInput, setBudgetInput] = useState("10000");
  const [travelMonth, setTravelMonth] = useState("1");

  const parsedMaxFlightTime = Number(maxFlightTime) || 24;
  const parsedBudget = Number(budgetInput) || 10000;
  const parsedTravelMonth = Number(travelMonth) || 1;

  const heroBackgroundImage = getHeroBackgroundImage(heroImage);

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
      <section
        className="hero-section"
        style={{
          backgroundImage: heroBackgroundImage,
        }}
      >
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
            <article key={resort.id} className="resort-card">
              <Link href={`/resort/${resort.slug}`} className="resort-card__touchable">
                <div className="resort-card__image">
                  <Image
                    src={getCardImage(resort)}
                    alt={resort.name}
                    fill
                    sizes="(max-width: 700px) 100vw, 33vw"
                    className="resort-card__image-img"
                    onError={(event) => {
                      const target = event.currentTarget as HTMLImageElement;
                      if (target.src !== getFallbackImage(resort)) {
                        target.src = getFallbackImage(resort);
                      }
                    }}
                  />
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
