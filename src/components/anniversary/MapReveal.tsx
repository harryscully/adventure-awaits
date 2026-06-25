import { useEffect, useRef, useState } from "react";
import { COPY } from "@/lib/anniversary/constants";

interface Props {
  onReplay?: () => void;
}

export function MapReveal({ onReplay }: Props) {
  const mapEl = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<1 | 2>(1);
  const [pinsDropped, setPinsDropped] = useState(false);
  const mapRef = useRef<unknown>(null);

  useEffect(() => {
    let cancelled = false;
    let map: ReturnType<typeof initMap> extends Promise<infer T> ? T : never;

    async function initMap() {
      const L = await import("leaflet");
      if (cancelled || !mapEl.current) return null;

      const { durham, paris } = COPY.origin;
      const { hitchin, lussmans } = COPY.pins;

      const m = L.map(mapEl.current, {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
        dragging: false,
        touchZoom: false,
        doubleClickZoom: false,
        keyboard: false,
      });

      L.tileLayer(
        "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
        { maxZoom: 19, subdomains: "abc" },
      ).addTo(m);

      // Stage 1: fit Durham + Paris with a dashed arc.
      const bounds = L.latLngBounds([durham.lat, durham.lng], [paris.lat, paris.lng]);
      m.fitBounds(bounds.pad(0.4), { animate: false });

      // Dashed great-circle-ish line
      const arc = L.polyline(
        [
          [durham.lat, durham.lng],
          [(durham.lat + paris.lat) / 2 - 1.5, (durham.lng + paris.lng) / 2],
          [paris.lat, paris.lng],
        ],
        {
          color: "#7a5c9e",
          weight: 2,
          dashArray: "6 8",
          opacity: 0.85,
        },
      ).addTo(m);

      const labelIcon = (text: string) =>
        L.divIcon({
          className: "",
          html: `<div style="background:#fffaf0;border:1px solid #c8b18a;padding:4px 8px;border-radius:999px;font-family:'Caveat',cursive;font-size:18px;color:#3b2a1a;box-shadow:0 4px 10px -4px rgba(0,0,0,.3);white-space:nowrap;">${text}</div>`,
          iconSize: [10, 10],
          iconAnchor: [5, 5],
        });

      L.marker([durham.lat, durham.lng], { icon: labelIcon("✉️ Durham") }).addTo(m);
      L.marker([paris.lat, paris.lng], { icon: labelIcon("✉️ Paris") }).addTo(m);

      mapRef.current = { L, m, arc };
      return { L, m, arc };
    }

    initMap();
    return () => {
      cancelled = true;
      const ref = mapRef.current as { m?: { remove: () => void } } | null;
      ref?.m?.remove();
    };
  }, []);

  async function flyToToday() {
    setStage(2);
    const ref = mapRef.current as
      | {
        L: typeof import("leaflet");
        m: import("leaflet").Map;
        arc: import("leaflet").Polyline;
      }
      | null;
    if (!ref) return;
    const { L, m, arc } = ref;
    const { hitchin, lussmans } = COPY.pins;

    // Remove arc, fly down
    m.removeLayer(arc);
    const midLat = (hitchin.lat + lussmans.lat) / 2;
    const midLng = (hitchin.lng + lussmans.lng) / 2;
    m.flyTo([midLat, midLng], 10, { duration: 2.4 });

    setTimeout(() => {
      const pin = (color: string, emoji: string) =>
        L.divIcon({
          className: "",
          html: `<div style="transform:translate(-50%,-100%);"><div style="background:${color};width:34px;height:34px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 10px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;border:2px solid #fffaf0;"><span style="transform:rotate(45deg);font-size:18px;">${emoji}</span></div></div>`,
          iconSize: [34, 44],
          iconAnchor: [0, 0],
        });

      L.marker([hitchin.lat, hitchin.lng], { icon: pin("#7a5c9e", hitchin.emoji) })
        .addTo(m)
        .bindTooltip(`${hitchin.label} · ${hitchin.time}`, { permanent: false });
      L.marker([lussmans.lat, lussmans.lng], { icon: pin("#a64d4d", lussmans.emoji) })
        .addTo(m)
        .bindTooltip(`${lussmans.label} · ${lussmans.time}`, { permanent: false });

      L.polyline(
        [
          [hitchin.lat, hitchin.lng],
          [lussmans.lat, lussmans.lng],
        ],
        { color: "#7a5c9e", weight: 3, opacity: 0.7, dashArray: "2 6" },
      ).addTo(m);

      setPinsDropped(true);
    }, 2400);
  }

  const { hitchin, lussmans } = COPY.pins;

  return (
    <div className="min-h-svh px-4 py-6 flex flex-col items-center">
      <p className="hand text-3xl md:text-4xl text-ink text-center fade-up max-w-xl">
        {stage === 1 ? COPY.map.stage1Caption : COPY.map.stage2Caption}
      </p>

      <div className="mt-5 w-full max-w-2xl">
        <div
          ref={mapEl}
          className="w-full h-[55vh] min-h-90 rounded-2xl overflow-hidden border border-border shadow-xl"
        />
      </div>

      {stage === 1 && (
        <button
          onClick={flyToToday}
          className="mt-6 px-7 py-3 rounded-full bg-primary text-primary-foreground font-medium shadow-lg hover:scale-105 transition-transform fade-up"
        >
          …and today? →
        </button>
      )}

      {stage === 2 && pinsDropped && (
        <div className="mt-6 w-full max-w-md space-y-3 fade-up">
          <div className="paper-card p-4 flex items-center gap-4 pin-drop">
            <div className="text-3xl">{hitchin.emoji}</div>
            <div className="flex-1 text-left">
              <p className="typewriter text-[10px] tracking-widest uppercase text-ink-soft">
                {hitchin.time}
              </p>
              <p className="hand text-2xl text-primary leading-none">{hitchin.label}</p>
              <p className="letter-serif text-base text-ink">{hitchin.name}</p>
            </div>
          </div>

          <div
            className="paper-card p-4 flex items-center gap-4 pin-drop"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="text-3xl">{lussmans.emoji}</div>
            <div className="flex-1 text-left">
              <p className="typewriter text-[10px] tracking-widest uppercase text-ink-soft">
                {lussmans.time}
              </p>
              <p className="hand text-2xl text-primary leading-none">{lussmans.label}</p>
              <p className="letter-serif text-base text-ink">{lussmans.name}</p>
            </div>
          </div>

          <article className="paper-card p-6 mt-4 text-center">
            <p className="typewriter text-[10px] tracking-[0.3em] text-ink-soft uppercase mb-3">
              p.s. from Frog
            </p>
            <div className="letter-serif text-lg text-ink space-y-2">
              {COPY.map.closing.map((l, i) => (
                <p key={i}>{l}</p>
              ))}
            </div>
          </article>

          {onReplay && (
            <button
              onClick={onReplay}
              className="mx-auto block mt-2 px-6 py-2.5 rounded-full bg-secondary text-secondary-foreground border border-border font-medium shadow hover:scale-105 transition-transform"
            >
              ↺ {COPY.map.replay}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
