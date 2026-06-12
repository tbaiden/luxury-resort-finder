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

function getTypeLabel(type: string) {
  if (type === "ultra_island") return "Ultra Island";
  if (type === "luxury_5_star") return "Luxury 5-Star";
  return type;
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

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "beige",
        color: "black",
        padding: "32px 20px",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <Link
          href="/"
          style={{
            display: "inline-block",
            marginBottom: "20px",
            color: "black",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Back to search
        </Link>

        <article
          style={{
            backgroundColor: "white",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 16px 40px rgba(0, 0, 0, 0.08)",
          }}
        >
          <div style={{ width: "100%", minHeight: "340px", backgroundColor: "lightgray" }}>
            <img
              src={resort.heroImageUrl}
              alt={resort.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>

          <div style={{ padding: "28px" }}>
            <div style={{ marginBottom: "18px" }}>
              <p
                style={{
                  margin: 0,
                  color: "slategrey",
                  fontSize: "14px",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                }}
              >
                {getTypeLabel(resort.destinationType)}
              </p>
              <h1 style={{ margin: "10px 0 12px 0", fontSize: "34px", lineHeight: 1.1 }}>
                {resort.name}
              </h1>
              <p style={{ margin: 0, fontSize: "16px", color: "gray" }}>
                {resort.region}, {resort.country}
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "14px",
                marginBottom: "24px",
              }}
            >
              <div style={infoBoxStyle}>
                <div style={infoLabelStyle}>Price range</div>
                <div style={infoValueStyle}>
                  {formatMoney(resort.nightlyPriceLow, resort.currency)} -{" "}
                  {formatMoney(resort.nightlyPriceHigh, resort.currency)}
                </div>
              </div>

              <div style={infoBoxStyle}>
                <div style={infoLabelStyle}>Flight time</div>
                <div style={infoValueStyle}>
                  {resort.flightTimeFromLondonHours} hours from London
                </div>
              </div>

              <div style={infoBoxStyle}>
                <div style={infoLabelStyle}>Transfer</div>
                <div style={infoValueStyle}>
                  {getTransferLabel(resort.transferType)} · {resort.transferTimeMinutes} minutes
                </div>
              </div>

              <div style={infoBoxStyle}>
                <div style={infoLabelStyle}>Minimum stay</div>
                <div style={infoValueStyle}>{resort.minStayNights ?? "N/A"} nights</div>
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "24px" }}>
              {resort.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "999px",
                    backgroundColor: "lightgray",
                    color: "black",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  {tag.replace(/_/g, " ")}
                </span>
              ))}
            </div>

            <div style={{ display: "grid", gap: "20px" }}>
              <section style={sectionStyle}>
                <h2 style={sectionTitleStyle}>Why stay here</h2>
                <p style={sectionTextStyle}>{resort.priceNotes}</p>
              </section>

              <section style={sectionStyle}>
                <h2 style={sectionTitleStyle}>Season notes</h2>
                <p style={sectionTextStyle}>{resort.seasonNotes}</p>
                <p style={{ margin: "12px 0 0 0", fontSize: "14px", color: "gray" }}>
                  {getSeasonLabel(
                    resort.peakSeasonMonths,
                    resort.shoulderSeasonMonths,
                    resort.offPeakSeasonMonths
                  )}
                </p>
              </section>

              <section style={sectionStyle}>
                <h2 style={sectionTitleStyle}>Booking hint</h2>
                <p style={sectionTextStyle}>{resort.bookingHint}</p>
              </section>
            </div>

            <a
              href={resort.officialWebsite}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-block",
                marginTop: "28px",
                padding: "14px 22px",
                backgroundColor: "skyblue",
                color: "black",
                borderRadius: "14px",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Visit official website
            </a>
          </div>
        </article>
      </div>
    </main>
  );
}

const infoBoxStyle = {
  padding: "16px",
  borderRadius: "18px",
  backgroundColor: "ghostwhite",
  border: "1px solid lightgray",
};

const infoLabelStyle = {
  marginBottom: "8px",
  fontSize: "12px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
  color: "slategrey",
  fontWeight: 700,
};

const infoValueStyle = {
  fontSize: "16px",
  color: "black",
  fontWeight: 700,
  lineHeight: 1.4,
};

const sectionStyle = {
  padding: "20px",
  borderRadius: "18px",
  backgroundColor: "white",
  border: "1px solid lightgray",
};

const sectionTitleStyle = {
  margin: "0 0 10px 0",
  fontSize: "18px",
  color: "black",
};

const sectionTextStyle = {
  margin: 0,
  fontSize: "15px",
  color: "gray",
  lineHeight: 1.7,
};