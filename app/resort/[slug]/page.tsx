import Link from "next/link";
import { notFound } from "next/navigation";
import { getResortBySlug } from "../../../lib/resorts";

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function getHeroImageUrl(resort: { slug: string; country: string; heroImageUrl?: string; cardImageUrl?: string }) {
  if (resort.heroImageUrl) return resort.heroImageUrl;
  if (resort.cardImageUrl) return resort.cardImageUrl;

  const fallbackBySlug: Record<string, string> = {
    "soneva-jani": "/resorts/soneva-jani.jpg",
    "north-island-seychelles": "/resorts/north-island-seychelles.jpg",
    amanoi: "/resorts/amanoi.jpg",
    "cheval-blanc-randheli": "/resorts/cheval-blanc-randheli.jpg",
    "six-senses-zighy-bay": "/resorts/six-senses-zighy-bay.jpg",
    "four-seasons-bora-bora": "/resorts/four-seasons-bora-bora.jpg",
    "st-regis-bora-bora": "/resorts/st-regis-bora-bora.jpg",
    "the-brando": "/resorts/the-brando.jpg",
  };

  const fallbackByCountry: Record<string, string> = {
    maldives: "/resorts/maldives.jpg",
    seychelles: "/resorts/seychelles.jpg",
    vietnam: "/resorts/vietnam.jpg",
    oman: "/resorts/oman.jpg",
    "french polynesia": "/resorts/french-polynesia.jpg",
  };

  return fallbackBySlug[resort.slug] || fallbackByCountry[resort.country.toLowerCase()] || "/resorts/hero.jpg";
}

function getTypeLabel(type: string) {
  if (type === "ultra_island") return "Ultra Island";
  if (type === "luxury_5_star") return "Luxury 5-Star";
  return type.replace(/_/g, " ");
}

function getTransferLabel(transfer: string) {
  if (transfer === "seaplane") return "Seaplane";
  if (transfer === "helicopter") return "Helicopter";
  if (transfer === "car") return "Car";
  if (transfer === "boat") return "Boat";
  return transfer;
}

function getSeasonLabel(peak: number[], shoulder: number[], offPeak: number[]) {
  const labels: string[] = [];
  if (peak.length) labels.push("Peak season");
  if (shoulder.length) labels.push("Shoulder season");
  if (offPeak.length) labels.push("Off peak");
  return labels.join(" · ");
}

export default async function ResortDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resort = getResortBySlug(slug);

  if (!resort) {
    notFound();
  }

  const heroImage = getHeroImageUrl(resort);

  return (
    <main className="detail-page">
      <section
        className="detail-hero"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(20, 18, 15, 0.18), rgba(20, 18, 15, 0.86)), url('${heroImage}')`,
        }}
      >
        <div className="detail-hero-inner">
          <Link href="/" className="detail-back-link">
            Back to shortlist
          </Link>
          <p className="detail-eyebrow">{getTypeLabel(resort.destinationType)}</p>
          <h1 className="detail-title">{resort.name}</h1>
          <p className="detail-subtitle">
            {resort.region}, {resort.country}
          </p>
        </div>
      </section>

      <section className="detail-body">
        <div className="detail-card">
          <div className="detail-content">
            <div className="detail-grid">
              <div className="detail-metrics">
                <div className="detail-stat">
                  <p className="detail-stat-label">Price range</p>
                  <p className="detail-stat-value">
                    {formatMoney(resort.nightlyPriceLow, resort.currency)} - {formatMoney(resort.nightlyPriceHigh, resort.currency)}
                  </p>
                </div>
                <div className="detail-stat">
                  <p className="detail-stat-label">Flight time</p>
                  <p className="detail-stat-value">{resort.flightTimeFromLondonHours} hours from London</p>
                </div>
                <div className="detail-stat">
                  <p className="detail-stat-label">Transfer</p>
                  <p className="detail-stat-value">
                    {getTransferLabel(resort.transferType)} · {resort.transferTimeMinutes} minutes
                  </p>
                </div>
                <div className="detail-stat">
                  <p className="detail-stat-label">Minimum stay</p>
                  <p className="detail-stat-value">{resort.minStayNights ?? "N/A"} nights</p>
                </div>
              </div>

              <div className="detail-tags">
                {resort.tags.map((tag) => (
                  <span key={tag} className="detail-tag">
                    {tag.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <div>
                <h2 className="detail-section-title">Why stay here</h2>
                <p className="detail-section-copy">{resort.priceNotes}</p>
              </div>
              <div>
                <h2 className="detail-section-title">Season notes</h2>
                <p className="detail-section-copy">{resort.seasonNotes}</p>
                <p className="detail-secondary-copy">
                  {getSeasonLabel(resort.peakSeasonMonths, resort.shoulderSeasonMonths, resort.offPeakSeasonMonths)}
                </p>
              </div>
              <div>
                <h2 className="detail-section-title">Booking hint</h2>
                <p className="detail-section-copy">{resort.bookingHint}</p>
              </div>
            </div>

            <a
              href={resort.officialWebsite}
              target="_blank"
              rel="noreferrer"
              className="detail-action"
            >
              Open official resort site
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
