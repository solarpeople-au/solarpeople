"use client";

import * as maplibregl from "maplibre-gl";
import type { GeoJSONSource, Map as MapLibreMap, MapMouseEvent } from "maplibre-gl";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import installationData from "../data/installations.json";

type Installation = (typeof installationData.installations)[number];
type SearchPlace = { label: string; suburb: string; postcode: string; latitude: number; longitude: number };
type NearbyCounts = { one: number; three: number; five: number };

const MELBOURNE: [number, number] = [145.02, -37.82];

function distanceKm(a: [number, number], b: [number, number]) {
  const rad = (value: number) => (value * Math.PI) / 180;
  const dLat = rad(b[1] - a[1]);
  const dLon = rad(b[0] - a[0]);
  const lat1 = rad(a[1]);
  const lat2 = rad(b[1]);
  const value = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

function circleGeoJson(center: [number, number], radiusKm: number) {
  const points = 72;
  const coordinates = Array.from({ length: points + 1 }, (_, index) => {
    const angle = (index / points) * Math.PI * 2;
    const lat = center[1] + (radiusKm / 110.574) * Math.sin(angle);
    const lon = center[0] + (radiusKm / (111.32 * Math.cos((center[1] * Math.PI) / 180))) * Math.cos(angle);
    return [lon, lat];
  });
  return { type: "Feature" as const, properties: {}, geometry: { type: "Polygon" as const, coordinates: [coordinates] } };
}

export function ProjectMap({ compact = false }: { compact?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const userMarkerRef = useRef<{ remove: () => void } | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Search your suburb or use your current location.");
  const [counts, setCounts] = useState<NearbyCounts | null>(null);
  const [selected, setSelected] = useState<Installation | null>(null);
  const [locating, setLocating] = useState(false);

  const places = useMemo<SearchPlace[]>(() => {
    const groups = new Map<string, Installation[]>();
    installationData.installations.forEach((item) => {
      groups.set(item.suburb, [...(groups.get(item.suburb) ?? []), item]);
    });
    return [...groups.entries()].map(([suburb, items]) => {
      const postcode = items.find((item) => item.postcode)?.postcode ?? "";
      return {
        label: postcode ? `${suburb}, VIC ${postcode}` : `${suburb}, VIC`,
        suburb,
        postcode,
        latitude: items.reduce((sum, item) => sum + item.latitude, 0) / items.length,
        longitude: items.reduce((sum, item) => sum + item.longitude, 0) / items.length,
      };
    }).sort((a, b) => a.suburb.localeCompare(b.suburb));
  }, []);

  const suggestions = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (needle.length < 2) return [];
    return places.filter((place) => place.label.toLowerCase().includes(needle)).slice(0, 6);
  }, [places, query]);

  const showNearby = useCallback(async (longitude: number, latitude: number, label: string) => {
    const map = mapRef.current;
    if (!map) return;
    const center: [number, number] = [longitude, latitude];
    const distances = installationData.installations.map((item) => distanceKm(center, [item.longitude, item.latitude]));
    const nextCounts = {
      one: distances.filter((distance) => distance <= 1).length,
      three: distances.filter((distance) => distance <= 3).length,
      five: distances.filter((distance) => distance <= 5).length,
    };
    setCounts(nextCounts);
    setStatus(`${label} · ${nextCounts.three} installations within approximately 3 km`);
    map.flyTo({ center, zoom: 12.4, duration: 1200 });

    const source = map.getSource("search-radius") as GeoJSONSource | undefined;
    source?.setData(circleGeoJson(center, 3));

    userMarkerRef.current?.remove();
    const marker = document.createElement("div");
    marker.className = "map-home-marker";
    marker.setAttribute("aria-label", "Your selected area");
    userMarkerRef.current = new maplibregl.Marker({ element: marker }).setLngLat(center).addTo(map);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function initialise() {
      if (!containerRef.current || mapRef.current) return;
      if (cancelled || !containerRef.current) return;
      const map = new maplibregl.Map({
        container: containerRef.current,
        style: "https://tiles.openfreemap.org/styles/positron",
        center: MELBOURNE,
        zoom: compact ? 8.65 : 8.9,
        minZoom: 7,
        maxZoom: 16,
        attributionControl: false,
        dragRotate: false,
        pitchWithRotate: false,
      });
      mapRef.current = map;
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
      map.addControl(new maplibregl.AttributionControl({ compact: true, customAttribution: "Locality data © State of Victoria" }));

      map.on("load", () => {
        map.addSource("installations", {
          type: "geojson",
          cluster: true,
          clusterMaxZoom: 13,
          clusterRadius: 48,
          data: {
            type: "FeatureCollection",
            features: installationData.installations.map((item) => ({
              type: "Feature",
              properties: item,
              geometry: { type: "Point", coordinates: [item.longitude, item.latitude] },
            })),
          },
        });
        map.addSource("search-radius", { type: "geojson", data: circleGeoJson(MELBOURNE, 0.01) });
        map.addLayer({ id: "search-radius-fill", type: "fill", source: "search-radius", paint: { "fill-color": "#18cd5b", "fill-opacity": 0.1 } });
        map.addLayer({ id: "search-radius-line", type: "line", source: "search-radius", paint: { "line-color": "#079944", "line-width": 2, "line-dasharray": [2, 2] } });
        map.addLayer({
          id: "clusters",
          type: "circle",
          source: "installations",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": ["step", ["get", "point_count"], "#9be7b7", 10, "#4bd77c", 30, "#18cd5b"],
            "circle-radius": ["step", ["get", "point_count"], 18, 10, 23, 30, 29],
            "circle-stroke-color": "#ffffff",
            "circle-stroke-width": 2,
          },
        });
        map.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "installations",
          filter: ["has", "point_count"],
          layout: { "text-field": ["get", "point_count_abbreviated"], "text-size": 12, "text-font": ["Noto Sans Regular"] },
          paint: { "text-color": "#07110f" },
        });
        map.loadImage("/solar-map-pin.svg").then((image) => {
          if (!map.hasImage("solar-pin")) map.addImage("solar-pin", image.data);
          map.addLayer({
            id: "individual-installations",
            type: "symbol",
            source: "installations",
            filter: ["!", ["has", "point_count"]],
            layout: { "icon-image": "solar-pin", "icon-size": 0.72, "icon-anchor": "bottom", "icon-allow-overlap": true },
          });
        });

        map.on("click", "clusters", async (event: MapMouseEvent) => {
          const feature = map.queryRenderedFeatures(event.point, { layers: ["clusters"] })[0];
          const clusterId = feature?.properties?.cluster_id;
          const coordinates = (feature?.geometry as { coordinates?: [number, number] } | undefined)?.coordinates;
          if (clusterId === undefined || !coordinates) return;
          const source = map.getSource("installations") as GeoJSONSource;
          const zoom = await source.getClusterExpansionZoom(clusterId);
          map.easeTo({ center: coordinates, zoom });
        });
        map.on("click", "individual-installations", (event: MapMouseEvent) => {
          const feature = map.queryRenderedFeatures(event.point, { layers: ["individual-installations"] })[0];
          if (!feature?.properties) return;
          setSelected(feature.properties as Installation);
        });
        ["clusters", "individual-installations"].forEach((layer) => {
          map.on("mouseenter", layer, () => { map.getCanvas().style.cursor = "pointer"; });
          map.on("mouseleave", layer, () => { map.getCanvas().style.cursor = ""; });
        });
      });
    }
    initialise();
    return () => {
      cancelled = true;
      userMarkerRef.current?.remove();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [compact]);

  function choosePlace(place: SearchPlace) {
    setQuery(place.label);
    setSelected(null);
    showNearby(place.longitude, place.latitude, place.label);
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setStatus("Location is not available in this browser. Please search by suburb.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        setQuery("Current location");
        showNearby(position.coords.longitude, position.coords.latitude, "Your location");
      },
      () => {
        setLocating(false);
        setStatus("We could not access your location. Please search by suburb or postcode.");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <div className={`project-map-wrap ${compact ? "compact" : ""}`}>
      <div className="map-search-panel">
        <div className="map-search-field">
          <label htmlFor={`map-search-${compact ? "compact" : "full"}`}>See installations near you</label>
          <div className="map-search-row">
            <input
              id={`map-search-${compact ? "compact" : "full"}`}
              autoComplete="off"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Enter your suburb or postcode"
            />
            <button type="button" onClick={useMyLocation}>{locating ? "Locating…" : "Use my location"}</button>
          </div>
          {suggestions.length > 0 && !places.some((place) => place.label === query) && (
            <div className="map-suggestions">
              {suggestions.map((place) => <button type="button" key={place.label} onClick={() => choosePlace(place)}>{place.label}</button>)}
            </div>
          )}
        </div>
        <div className="map-search-result" aria-live="polite">
          <span>{status}</span>
          {counts && <div><strong>{counts.one}<small>within 1 km</small></strong><strong>{counts.three}<small>within 3 km</small></strong><strong>{counts.five}<small>within 5 km</small></strong></div>}
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
