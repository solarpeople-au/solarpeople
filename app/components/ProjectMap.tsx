"use client";

import { useState } from "react";

const projects = [
  { id: 1, type: "Residential", suburb: "Glen Waverley", detail: "10.5 kW Solar", x: 66, y: 44 },
  { id: 2, type: "Battery", suburb: "Point Cook", detail: "Solar + Battery", x: 31, y: 63 },
  { id: 3, type: "Commercial", suburb: "Dandenong South", detail: "Commercial Solar", x: 75, y: 70 },
  { id: 4, type: "Residential", suburb: "Craigieburn", detail: "8.8 kW Solar", x: 49, y: 20 },
  { id: 5, type: "Residential", suburb: "Ringwood", detail: "13.2 kW Solar", x: 78, y: 37 },
  { id: 6, type: "Battery", suburb: "Brighton", detail: "Battery Upgrade", x: 58, y: 65 },
  { id: 7, type: "Commercial", suburb: "Sunshine", detail: "Commercial Solar", x: 38, y: 45 },
];

export function ProjectMap({ compact = false }: { compact?: boolean }) {
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState(projects[0]);
  const visible = filter === "All" ? projects : projects.filter((project) => project.type === filter);

  return (
    <div className={`project-map-wrap ${compact ? "compact" : ""}`}>
      <div className="map-filters" aria-label="Filter projects">
        {["All", "Residential", "Commercial", "Battery"].map((item) => (
          <button className={filter === item ? "active" : ""} key={item} onClick={() => setFilter(item)}>{item}</button>
        ))}
      </div>
      <div className="project-map" aria-label="Interactive preview map of Melbourne installations">
        <span className="map-label cbd">Melbourne</span>
        <span className="map-label bay">Port Phillip Bay</span>
        <span className="road road-one" /><span className="road road-two" /><span className="road road-three" />
        {visible.map((project) => (
          <button
            aria-label={`${project.type} project in ${project.suburb}`}
            className={`map-pin ${active.id === project.id ? "active" : ""}`}
            key={project.id}
            onClick={() => setActive(project)}
            style={{ left: `${project.x}%`, top: `${project.y}%` }}
          ><span /></button>
        ))}
        <div className="map-card">
          <small>{active.type} · Example project</small>
          <strong>{active.suburb}, VIC</strong>
          <span>{active.detail}</span>
        </div>
      </div>
      <p className="preview-note">Interactive layout preview — real project locations will be added from the client list.</p>
    </div>
  );
}
