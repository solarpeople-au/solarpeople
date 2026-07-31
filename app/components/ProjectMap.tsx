"use client";

import type { Circle, Map as LeafletMap, Marker } from "leaflet";
import Image from "next/image";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import installationData from "../data/installations.json";

type Installation = (typeof installationData.installations)[number];
type SearchPlace = { label: string; suburb: string; postcode: string; latitude: number; longitude: number };
type NearbyCounts = { five: number; ten: number };

const MELBOURNE: [number, number] = [-37.82, 145.02];

function distanceKm(a: [number, number], b: [number, number]) {
  const rad = (value: number) => (value * Math.PI) / 180;
  const dLat = rad(b[0] - a[0]);
  const dLon = rad(b[1] - a[1]);
  const lat1 = rad(a[0]);
  const lat2 = rad(b[0]);
  const value = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

export function ProjectMap({ compact = false }: { compact?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const userMarkerRef = useRef<Marker | null>(null);
  const radiusRef = useRef<Circle[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Enter your 4-digit postcode to discover how many Solar People customers are already near you.");
  const [counts, setCounts] = useState<NearbyCounts | null>(null);
  const [selected, setSelected] = useState<Installation | null>(null);
  const [locating, setLocating] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  const places = useMemo<SearchPlace[]>(() => {
    const groups = new Map<string, Installation[]>();
    installationData.installations.forEach((item) => {
      if (!item.postcode) return;
      groups.set(item.postcode, [...(groups.get(item.postcode) ?? []), item]);
    });
    return [...groups.entries()].map(([postcode, items]) => ({
      label: `${postcode} · ${[...new Set(items.map((item) => item.suburb))].slice(0, 2).join(" / ")}`,
      suburb: items[0].suburb,
      postcode,
      latitude: items.reduce((sum, item) => sum + item.latitude, 0) / items.length,
      longitude: items.reduce((sum, item) => sum + item.longitude, 0) / items.length,
    })).sort((a, b) => a.postcode.localeCompare(b.postcode));
  }, []);

  const suggestions = useMemo(() => {
    const needle = query.replace(/\D/g, "").slice(0, 4);
    if (needle.length < 2) return [];
    return places.filter((place) => place.postcode.startsWith(needle)).slice(0, 6);
  }, [places, query]);

  const showNearby = useCallback((longitude: number, latitude: number, label: string) => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L) return;
    const center: [number, number] = [latitude, longitude];
    const distances = installationData.installations.map((item) => distanceKm(center, [item.latitude, item.longitude]));
    const nextCounts = {
      five: distances.filter((distance) => distance <= 5).length,
      ten: distances.filter((distance) => distance <= 10).length,
    };
    setCounts(nextCounts);
    setStatus(`${label} · You are surrounded by Solar People customers.`);
    map.fitBounds(L.latLng(center).toBounds(22000), { padding: [36, 36], animate: true, duration: 1.15 });

    userMarkerRef.current?.remove();
    radiusRef.current.forEach((circle) => circle.remove());
    const homeIcon = L.divIcon({ className: "map-home-icon", html: '<span class="map-home-marker"></span>', iconSize: [34, 34], iconAnchor: [17, 17] });
    userMarkerRef.current = L.marker(center, { icon: homeIcon, zIndexOffset: 1200, title: "Your selected area" }).addTo(map);
    radiusRef.current = [
      L.circle(center, { radius: 10000, color: "#18cd5b", weight: 2, dashArray: "9 8", fillColor: "#18cd5b", fillOpacity: 0.07 }).addTo(map),
      L.circle(center, { radius: 5000, color: "#079944", weight: 2, fillColor: "#18cd5b", fillOpacity: 0.15 }).addTo(map),
    ];
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function initialise() {
      if (!containerRef.current || mapRef.current) return;
      const leafletModule = await import("leaflet");
      await import("leaflet.markercluster");
      if (cancelled || !containerRef.current) return;
      const L = leafletModule.default;
      leafletRef.current = L;
      const map = L.map(containerRef.current, {
        center: MELBOURNE,
        zoom: compact ? 9 : 9,
        minZoom: 7,
        maxZoom: 18,
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: true,
      });
      mapRef.current = map;
      L.control.zoom({ position: "topright" }).addTo(map);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors · Locality data © State of Victoria',
      }).addTo(map);

      const clusters = L.markerClusterGroup({
        chunkedLoading: true,
        removeOutsideVisibleBounds: true,
        showCoverageOnHover: false,
        maxClusterRadius: 48,
        iconCreateFunction: (cluster) => {
          const count = cluster.getChildCount();
          const size = count >= 30 ? "large" : count >= 10 ? "medium" : "small";
          return L.divIcon({
            className: `solar-cluster solar-cluster-${size}`,
            html: `<span>${count}</span>`,
            iconSize: count >= 30 ? [58, 58] : count >= 10 ? [48, 48] : [38, 38],
          });
        },
      });
      const projectIcon = L.divIcon({
        className: "solar-project-icon",
        html: '<img src="/solar-map-pin.svg" alt="">',
        iconSize: [38, 46],
        iconAnchor: [19, 46],
      });
      installationData.installations.forEach((item) => {
        const marker = L.marker([item.latitude, item.longitude], { icon: projectIcon, title: `Completed installation in ${item.suburb}` });
        marker.on("click", () => setSelected(item));
        clusters.addLayer(marker);
      });
      map.addLayer(clusters);
      map.whenReady(() => {
        setMapReady(true);
        window.setTimeout(() => map.invalidateSize(), 80);
      });
    }
    initialise();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      leafletRef.current = null;
    };
  }, [compact]);

  function choosePlace(place: SearchPlace) {
    setQuery(place.postcode);
    setSelected(null);
    showNearby(place.longitude, place.latitude, `Postcode ${place.postcode}`);
  }

  function submitPostcode(event: FormEvent) {
    event.preventDefault();
    const postcode = query.replace(/\D/g, "").slice(0, 4);
    if (postcode.length !== 4) {
      setStatus("Please enter a valid 4-digit Victorian postcode, for example 3150.");
      return;
    }
    const place = places.find((item) => item.postcode === postcode);
    if (!place) {
      setStatus(`We do not have a mapped project for postcode ${postcode} yet. Try a nearby postcode or use your location.`);
      return;
    }
    choosePlace(place);
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setStatus("Location is not available in this browser. Please enter your 4-digit postcode.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        setQuery("");
        showNearby(position.coords.longitude, position.coords.latitude, "Your location");
      },
      () => {
        setLocating(false);
        setStatus("We could not access your location. Please enter your 4-digit postcode instead.");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <div className={`project-map-wrap ${compact ? "compact" : ""}`}>
      <div className="map-trust-panel">
        <div className="map-trust-copy">
          <p className="kicker">Trusted by your neighbours</p>
          <h2>Your choice is backed by the people around you.</h2>
          <p>For seven years, Solar People has grown across Victoria through word of mouth. Enter your postcode and see how many nearby homes and businesses have already chosen us.</p>
          <div className="map-trust-proof"><strong>{installationData.total}</strong><span>mapped installations across Victoria</span><strong>7+</strong><span>years built on customer referrals</span></div>
        </div>
        <div className="map-search-panel">
          <form className="map-search-field" onSubmit={submitPostcode}>
            <label htmlFor={`map-search-${compact ? "compact" : "full"}`}>How many customers are near you?</label>
            <p>Enter your four-digit postcode to find out.</p>
            <div className="map-search-row">
              <input
                id={`map-search-${compact ? "compact" : "full"}`}
                autoComplete="postal-code"
                inputMode="numeric"
                maxLength={4}
                pattern="[0-9]{4}"
                value={query}
                onChange={(event) => setQuery(event.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="Enter postcode — e.g. 3150"
                aria-describedby={`map-help-${compact ? "compact" : "full"}`}
              />
              <button type="submit" disabled={!mapReady}>Show customers near me</button>
            </div>
            <button className="map-location-button" type="button" onClick={useMyLocation}>{locating ? "Locating…" : "Or use my current location"}</button>
          </form>
          <div className={`map-search-result ${counts ? "has-results" : ""}`} id={`map-help-${compact ? "compact" : "full"}`} aria-live="polite">
            <span>{status}</span>
            {counts && <div><strong>{counts.five}<small>customers within 5 km</small></strong><strong>{counts.ten}<small>customers within 10 km</small></strong></div>}
          </div>
          {suggestions.length > 0 && !places.some((place) => place.postcode === query) && (
            <div className="map-suggestions">
              {suggestions.map((place) => <button type="button" key={place.postcode} onClick={() => choosePlace(place)}>{place.label}</button>)}
            </div>
          )}
        </div>
      </div>
      <div className="project-map" ref={containerRef} aria-label={`Interactive map of ${installationData.total} approximate Solar People installations across Melbourne`} />
      {selected && (
        <div className="map-card">
          <Image src="/solar-map-pin.svg" alt="" width={33} height={40} />
          <div><small>Completed installation</small><strong>{selected.suburb}, VIC {selected.postcode}</strong><span>Approximate location shown for customer privacy</span></div>
          <button type="button" aria-label="Close project details" onClick={() => setSelected(null)}>×</button>
        </div>
      )}
      <p className="map-privacy-note"><span /> {installationData.total} completed projects mapped · Residential locations are intentionally approximate to protect customer privacy.</p>
    </div>
  );
}
