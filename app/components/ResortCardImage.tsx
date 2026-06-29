"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { Resort } from "../../lib/types";

const placeholderImage = "/resorts/placeholder.jpg";

function getKeyForCountry(country: string) {
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

function getCountryImagePool(country: string) {
  const k = getKeyForCountry(country);
  const pool: Record<string, string[]> = {
    maldives: ["/resorts/maldives.jpg", "/resorts/maldives-alt.jpg", "/resorts/cheval-blanc-card.jpg", "/resorts/soneva-jani-card.jpg"],
    seychelles: ["/resorts/seychelles.jpg", "/resorts/seychelles-card.jpg"],
    oman: ["/resorts/oman.jpg", "/resorts/zighy-bay-card.jpg"],
    vietnam: ["/resorts/vietnam.jpg", "/resorts/amanoi-card.jpg"],
    polynesia: ["/resorts/bora-bora.jpg", "/resorts/bora-bora-alt.jpg", "/resorts/brando-card.jpg", "/resorts/french-polynesia.jpg", "/resorts/four-seasons-card.jpg", "/resorts/st-regis-card.jpg"],
  };

  return pool[k] ?? [];
}

function getCardImageSources(resort: Resort): string[] {
  const countryPool = getCountryImagePool(resort.country || "");
  const sources = [resort.cardImageUrl, ...countryPool, resort.heroImageUrl, placeholderImage];
  return Array.from(new Set(sources.filter(Boolean) as string[]));
}

export default function ResortCardImage({ resort }: { resort: Resort }) {
  const sources = useMemo(() => getCardImageSources(resort), [resort]);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const [loadFailed, setLoadFailed] = useState(false);

  const currentSource = sources[currentSourceIndex] || placeholderImage;
  const countryKey = getKeyForCountry(resort.country || "");

  const handleImageError = () => {
    if (currentSourceIndex < sources.length - 1) {
      setCurrentSourceIndex((index) => index + 1);
      return;
    }
    setLoadFailed(true);
  };

  return (
    <div className={`resort-card__image-inner variant-${countryKey}`}>
      {!loadFailed ? (
        <Image
          key={currentSource}
          src={currentSource}
          alt={resort.name}
          fill
          sizes="(max-width: 700px) 100vw, 33vw"
          className="resort-card__image-img"
          onError={handleImageError}
          priority={false}
        />
      ) : (
        <div className="resort-card__placeholder">
          <div className="resort-card__placeholder-copy">
            <strong>Luxury imagery pending</strong>
            <span>Card photography will appear here shortly.</span>
          </div>
        </div>
      )}
    </div>
  );
}
