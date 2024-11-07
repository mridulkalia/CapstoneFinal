import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngBoundsExpression } from "leaflet";
import axios from "axios";
import { library, dom } from "@fortawesome/fontawesome-svg-core";
import {
  faFire,
  faWater,
  faHouseCrack,
} from "@fortawesome/free-solid-svg-icons";

// Add icons to the library and watch for dom updates
library.add(faFire, faWater, faHouseCrack);
dom.watch();

// Helper function to create custom div icons with Font Awesome
const createFontAwesomeIcon = (iconClass: string, color: string) => {
  return L.divIcon({
    html: `<i class="${iconClass}" style="font-size: 2rem; color: ${color};"></i>`,
    className: "", // Remove default leaflet icon styling
    iconSize: [10, 10],
    iconAnchor: [5, 5],
    popupAnchor: [0, -5],
  });
};

// Define disaster icons using Font Awesome classes
const fireIcon = createFontAwesomeIcon("fas fa-fire", "red");
const floodIcon = createFontAwesomeIcon("fas fa-water", "blue");
const earthquakeIcon = createFontAwesomeIcon("fas fa-house-crack", "brown");

const DisasterMap: React.FC = () => {
  const [disasters, setDisasters] = useState<
    {
      id: string;
      type: string;
      coordinates: [number, number];
      description: string;
    }[]
  >([]);

  useEffect(() => {
    // Fetch disasters data from backend
    const fetchDisasters = async () => {
      try {
        const response = await axios.get("http://localhost:8000/disasters");
        setDisasters(response.data);
      } catch (error) {
        console.error("Error fetching disasters:", error);
      }
    };
    fetchDisasters();
  }, []);

  // Function to select icon based on disaster type
  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "fire":
        return fireIcon;
      case "flood":
        return floodIcon;
      case "earthquake":
        return earthquakeIcon;
      default:
        return L.icon({
          iconUrl: require("leaflet/dist/images/marker-icon.png"),
          shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
        });
    }
  };

  const indiaBounds: LatLngBoundsExpression = [
    [6.5546079, 68.1113787], // Southwest corner
    [35.6745457, 97.395561], // Northeast corner
  ];

  return (
    <div style={{ height: "600px", position: "relative", zIndex: 0 }}>
      <MapContainer
        center={[28.6139, 77.209]}
        zoom={5}
        minZoom={4}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
        maxBounds={indiaBounds}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {disasters.map((disaster) => (
          <Marker
            key={disaster.id}
            position={disaster.coordinates}
            icon={getIcon(disaster.type)}
          >
            <Popup>
              <strong>{disaster.type}</strong>
              <br />
              {disaster.description}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default DisasterMap;
