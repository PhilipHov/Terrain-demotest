
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import BookingModal from './components/BookingModal';
import {
  MapContainer,
  TileLayer,
  Marker,
  GeoJSON,
  useMap
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css';

// ——— Fix default marker icons in CRA ———
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl:       require('leaflet/dist/images/marker-icon.png'),
  shadowUrl:     require('leaflet/dist/images/marker-shadow.png'),
});

// Create green marker icon for highlighted markers
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// ——— FlyTo helper ———
function FlyToMarker({ position, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, zoom, { duration: 1.5 });
  }, [map, position, zoom]);
  return null;
}

export default function App() {
  const base = process.env.PUBLIC_URL || '';

  // Default user data
  const user = {
    name: 'Philip Andreas Hovgaard',
    position: 'NK KMP 1/V GHR'
  };

  // Terrain data matching the HTML prototype
  const terrainData = [
    { id: 'slagelse', name: 'Slagelse Øvelsesterræn', type: 'ovelsesterran', coords: [55.404, 11.353] },
    { id: 'jaegerspris', name: 'Jægerspris Skydeterræn', type: 'skydebane', coords: [55.908, 12.076] },
    { id: 'odeby', name: 'Oddesund Øvelsesterræn', type: 'ovelsesterran', coords: [56.568, 8.464] },
    { id: 'varde', name: 'Varde Skydeterræn', type: 'skydebane', coords: [55.623, 8.484] },
    { id: 'aalborg', name: 'Aalborg Øvelsesterræn', type: 'ovelsesterran', coords: [56.997, 9.814] },
    { id: 'hevring', name: 'Hevring Skydeterræn', type: 'skydebane', coords: [56.524, 10.646] },
    { id: 'bornholm', name: 'Bornholm Øvelsesterræn', type: 'ovelsesterran', coords: [55.121, 14.970] },
    { id: 'jyde', name: 'Oksbøl Øvelsesterræn', type: 'ovelsesterran', coords: [55.600, 8.289] },
    { id: 'skive', name: 'Skive Skydeterræn', type: 'skydebane', coords: [56.560, 9.027] },
    { id: 'vejle', name: 'Børkop Øvelsesterræn', type: 'ovelsesterran', coords: [55.659, 9.712] }
  ];

  
  const [selectedTerrain, setSelectedTerrain] = useState(null);
  const [cityGeoJson, setCityGeoJson] = useState(null);
  const [boroughsFeature, setBoroughsFeature] = useState(null);
  const [bookingModal, setBookingModal] = useState({ isOpen: false, terrain: null });
  const [bookings, setBookings] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [highlightedTerrains, setHighlightedTerrains] = useState([]);
  const [filters, setFilters] = useState({
    planops: null,
    type: null,
    date: '',
    time: '',
    location: ''
  });

  

  // Load Copenhagen boroughs once
  useEffect(() => {
    const names = ["Indgang Vest", "Indgang Øst", "Stampen", "Bøllemosen"];
    fetch(`${base}/geojson/bydele.json`)
      .then(res => res.json())
      .then((fc) => {
        const features = fc.features.filter(f => {
          const n = f.properties.navn || f.properties.name;
          return names.includes(n);
        });
        setBoroughsFeature({ type: 'FeatureCollection', features });
      })
      .catch(console.error);
  }, [base]);

  // Load selected terrain GeoJSON
  useEffect(() => {
    if (!selectedTerrain) return;
    fetch(`${base}/geojson/${selectedTerrain.id}.json`)
      .then(res => res.json())
      .then(setCityGeoJson)
      .catch(console.error);
  }, [base, selectedTerrain]);

  const handleSearch = (searchFilters) => {
    setFilters(searchFilters);
    
    // Reset highlighting
    setHighlightedTerrains([]);
    
    // Simple validation
    if (!searchFilters.date || !searchFilters.time) {
      setSearchResults('Angiv dato og tidsrum for at se tilgængelighed.');
      return;
    }

    // Highlight specific location if selected
    if (searchFilters.location) {
      const found = terrainData.find(t => t.id === searchFilters.location);
      if (found) {
        setHighlightedTerrains([found.id]);
        setSelectedTerrain(found);
        setSearchResults(`${found.name} er ledig i det angivne tidsrum.`);
        return;
      }
    }

    // Filter terrains by type
    let filteredTerrains = terrainData;
    if (searchFilters.type && searchFilters.type !== 'all') {
      filteredTerrains = terrainData.filter(t => t.type === searchFilters.type);
    }

    setHighlightedTerrains(filteredTerrains.map(t => t.id));
    setSearchResults('Alle valgte områder er ledige i det angivne tidsrum (MVP). Klik på et marker for at booke.');
  };

  const handleTerrainClick = (terrain) => {
    setBookingModal({ isOpen: true, terrain });
  };

  const handleBookingSubmit = (bookingData) => {
    // Simple validation: ensure date is not today or past
    const today = new Date();
    const selectedDate = new Date(bookingData.date);
    if (selectedDate <= today) {
      alert('Du kan ikke booke samme dag eller tidligere. Vælg en fremtidig dato.');
      return;
    }

    const newBooking = {
      ...bookingData,
      id: Date.now(),
      location: bookingModal.terrain.name,
      type: bookingModal.terrain.type
    };

    setBookings([...bookings, newBooking]);
    setBookingModal({ isOpen: false, terrain: null });
    
    setSearchResults(`
      Booking bekræftet:
      Terræn: ${newBooking.location}
      Aktivitet: ${newBooking.activity}
      Enhedstype: ${newBooking.unit}
      Dato: ${newBooking.date}
      Tid: ${newBooking.start} - ${newBooking.end}
      ${newBooking.ammoType ? `Ammunition: ${newBooking.ammoType} (${newBooking.ammoQty})` : ''}
      Indkvartering: ${newBooking.lodging}
      Transport: ${newBooking.transport}
    `);
    
    alert('Booking gennemført! Se detaljer i boksen nedenfor.');
  };

  const getFilteredTerrains = () => {
    let filtered = terrainData;
    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(t => t.type === filters.type);
    }
    return filtered;
  };

  

  return (
    <div className="App">
      <header className="app-header">
        <h1>Terrænbooking</h1>
        <div className="user-info">
          {user.name} – {user.position}
        </div>
      </header>

      <div className="App-layout">
        <Sidebar 
          onSearch={handleSearch}
          searchResults={searchResults}
          terrainData={terrainData}
        />

        <MapContainer
          className="map-container"
          center={[56.2639, 9.5018]}
          zoom={6.3}
        >
          <TileLayer
            attribution="© OpenStreetMap contributors, Wikimedia Maps"
            url="https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png"
          />

          {boroughsFeature && (
            <GeoJSON
              data={boroughsFeature}
              style={() => ({ color: '#0066cc', weight: 2, fillOpacity: 0.1 })}
              onEachFeature={(feature, layer) => {
                const name = feature.properties.navn || feature.properties.name;
                layer.bindTooltip(name, { sticky: true });
                layer.on({
                  mouseover: e => e.target.setStyle({ weight: 3, fillOpacity: 0.4 }),
                  mouseout:  e => e.target.setStyle({ weight: 2, fillOpacity: 0.1 })
                });
              }}
            />
          )}

          {getFilteredTerrains().map(terrain => {
            const isHighlighted = highlightedTerrains.includes(terrain.id);
            const markerIcon = isHighlighted ? greenIcon : new L.Icon.Default();
            
            return (
              <Marker
                key={terrain.id}
                position={terrain.coords}
                icon={markerIcon}
                eventHandlers={{ click: () => handleTerrainClick(terrain) }}
              >
              </Marker>
            );
          })}

          {selectedTerrain && (
            <FlyToMarker position={selectedTerrain.coords} zoom={12} />
          )}

          {cityGeoJson && (
            <GeoJSON
              data={cityGeoJson}
              style={() => ({ color: '#444', weight: 1, fillOpacity: 0.2 })}
              onEachFeature={(feature, layer) => {
                const name = feature.properties.navn || feature.properties.name;
                layer.bindTooltip(name, { sticky: true });
                layer.on({
                  mouseover: e => e.target.setStyle({ weight: 3, fillOpacity: 0.4 }),
                  mouseout:  e => e.target.setStyle({ weight: 1, fillOpacity: 0.2 })
                });
              }}
            />
          )}
        </MapContainer>

        {bookingModal.isOpen && (
          <BookingModal
            terrain={bookingModal.terrain}
            onClose={() => setBookingModal({ isOpen: false, terrain: null })}
            onSubmit={handleBookingSubmit}
            filters={filters}
          />
        )}
      </div>
    </div>
  );
}
