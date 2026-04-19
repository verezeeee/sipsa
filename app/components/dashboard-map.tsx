"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { dashboardMock } from "../mock/mock";

export default function DashboardMap() {
  const bubbles = dashboardMock.map.bubbles;
  const center = dashboardMock.map.center;

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={dashboardMock.map.zoom}
      style={{ height: "100%", width: "100%", borderRadius: "16px" }}
      scrollWheelZoom={false}
    >
      {/* Map layer */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* Bubble markers */}
      {bubbles.map((city) => {
        const total = city.dengue + city.zika + city.chikungunya;

        // Controls bubble radius (tweak this to match your Figma proportions)
        const radius = Math.sqrt(total) * 2;

        return (
          <CircleMarker
            key={city.id}
            center={[city.lat, city.lng]}
            radius={radius}
            pathOptions={{
              color: "#4777FF",
              fillColor: "#4A6DFF",
              fillOpacity: 0.35,
              weight: 1,
            }}
          >
            <Popup>
              <strong>{city.city}</strong>
              <br />
              Dengue: {city.dengue}
              <br />
              Zika: {city.zika}
              <br />
              Chikungunya: {city.chikungunya}
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
