import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import FacilityModal from './components/FacilityModal';
import BookingReceipt from './components/BookingReceipt';
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

// ——— FlyTo helper ———
function FlyToMarker({ position, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, zoom, { duration: 1.5 });
  }, [map, position, zoom]);
  return null;
}

// ——— Map Controller for reset ———
function MapController({ shouldReset, onResetComplete }) {
  const map = useMap();
  useEffect(() => {
    if (shouldReset) {
      map.flyTo([56.2, 9.0], 7, { duration: 1.5 });
      onResetComplete();
    }
  }, [map, shouldReset, onResetComplete]);
  return null;
}

export default function App() {
  const base = process.env.PUBLIC_URL || '';

  const cities = [
    { id: 'aalborg',        name: 'Aalborg',        coords: [57.0467,  9.9359],  zoom: 12 },
    { id: 'allinge',       name: 'Allinge',       coords: [55.2778, 14.8014],  zoom: 12 },
    { id: 'fredericia',    name: 'Fredericia',    coords: [55.5667,  9.7500],  zoom: 12 },
    { id: 'frederikshavn', name: 'Frederikshavn', coords: [57.4410, 10.5340],  zoom: 12 },
    { id: 'haderslev',     name: 'Haderslev',     coords: [55.2500,  9.5000],  zoom: 12 },
    { id: 'høvelte',       name: 'Høvelte',       coords: [55.8567, 12.3956],  zoom: 12 },
    { id: 'herning',       name: 'Herning',       coords: [56.1386,  8.9897],  zoom: 12 },
    { id: 'holstebro',     name: 'Holstebro',     coords: [56.3667,  8.6167],  zoom: 12 },
    { id: 'næstved',       name: 'Næstved',       coords: [55.2333, 11.7667],  zoom: 12 },
    { id: 'nørresundby',   name: 'Nørresundby',   coords: [57.0667,  9.9167],  zoom: 12 },
    { id: 'oksbøl',        name: 'Oksbøl',        coords: [55.6258,  8.2792],  zoom: 12 },
    { id: 'rønne',         name: 'Rønne',         coords: [55.0986, 14.7014],  zoom: 12 },
    { id: 'slagelse',      name: 'Slagelse',      coords: [55.4049, 11.3531],  zoom: 12 },
    { id: 'skive',         name: 'Skive',         coords: [56.5667,  9.0333],  zoom: 12 },
    { id: 'skrydstrup',    name: 'Skrydstrup',    coords: [55.2422,  9.2595],  zoom: 12 },
    { id: 'skalstrup',     name: 'Skalstrup',     coords: [55.6500, 12.0833],  zoom: 12 },
    { id: 'thisted',       name: 'Thisted',       coords: [56.9569,  8.6944],  zoom: 12 },
    { id: 'varde',         name: 'Varde',         coords: [55.6211,  8.4806],  zoom: 12 },
    { id: 'vordingborg',   name: 'Vordingborg',   coords: [55.0080, 11.9110],  zoom: 12 },
    { id: 'karup',         name: 'Karup',         coords: [56.3086,  9.1683],  zoom: 12 },
    { id: 'dyrehaven',     name: 'Dyrehaven',     coords: [55.7738, 12.5726],  zoom: 12 },
  ];

  const [selectedCity, setSelectedCity] = useState(null);
  const [cityGeoJson,  setCityGeoJson]  = useState(null);
  const [boroughsFeature, setBoroughsFeature] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);
  const [shouldResetMap, setShouldResetMap] = useState(false);

  const handleClear = () => {
    setSelectedCity(null);
    setCityGeoJson(null);
    setSelectedDates([]);
    setModalOpen(false);
    setSelectedFacility(null);
    setReceiptOpen(false);
    setBookingData(null);
    setShouldResetMap(true);
  };

  const handleMapResetComplete = () => {
    setShouldResetMap(false);
  };

  const facilityData = {
    'Indgang Øst': {
      name: 'Indgang Øst',
      ammoType: '5.56',
      ammoCount: '5000',
      ammo556Count: '3000',
      ammo762Count: '2000',
      size: 'fra kl. 23:59 til kl. 00:01',
      accommodation: '29 pax',
      meals: '29 pax',
      totalBudget: '58.500'
    },
    'Indgang Vest': {
      name: 'Indgang Vest',
      ammoType: '7.62',
      ammoCount: '3000',
      ammo556Count: '1500',
      ammo762Count: '1500',
      size: 'fra kl. 08:00 til kl. 16:00',
      accommodation: '20 pax',
      meals: '20 pax',
      totalBudget: '42.000'
    },
    'Böllemosen': {
      name: 'Böllemosen',
      ammoType: '9mm',
      ammoCount: '2000',
      ammo556Count: '1000',
      ammo762Count: '1000',
      size: 'fra kl. 10:00 til kl. 18:00',
      accommodation: '15 pax',
      meals: '15 pax',
      totalBudget: '28.500'
    }
  };

  const handleBookingComplete = (booking) => {
    setBookingData(booking);
    setReceiptOpen(true);
  };

  const handleLocationSearch = (locationId) => {
    if (!locationId) return;

    const city = cities.find(c => c.id === locationId);
    if (city) {
      setSelectedCity(city);
    }
  };

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

  // Load selected city GeoJSON
  useEffect(() => {
    if (!selectedCity) return;
    fetch(`${base}/geojson/${selectedCity.id}.json`)
      .then(res => res.json())
      .then(setCityGeoJson)
      .catch(console.error);
  }, [base, selectedCity]);

  return (
    <div className="App-layout">
      <Sidebar onLocationSearch={handleLocationSearch} onDatesSelected={setSelectedDates} onClear={handleClear} />

      <MapContainer
        className="map-container"
        center={[56.2, 9.0]}
        zoom={7}
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {boroughsFeature && (
          <GeoJSON
            data={boroughsFeature}
            style={(feature) => {
              const name = feature.properties.navn || feature.properties.name;
              if (name === 'Stampen' || name === 'Indgang Vest') {
                return { color: '#cc0000', weight: 2, fillOpacity: 0.3, fillColor: '#ff0000' };
              }
              return { color: '#0066cc', weight: 2, fillOpacity: 0.1 };
            }}
            onEachFeature={(feature, layer) => {
              const name = feature.properties.navn || feature.properties.name;

              if (name === 'Stampen') {
                const bookingInfo = `
                  <div style="font-weight: bold; color: #cc0000;">IKKE TILGÆNGELIG</div>
                  <div><strong>Booket af:</strong> Lars Nielsen</div>
                  <div><strong>Tidsinterval:</strong> 10:00 - 16:00</div>
                  <div><strong>Dato:</strong> 15/01/2024 - 20/01/2024</div>
                  <div><strong>Kontakt:</strong> lars.nielsen@forsvaret.dk</div>
                  <div><strong>Telefon:</strong> +45 12 34 56 78</div>
                `;
                layer.bindTooltip(bookingInfo, { sticky: true });
                layer.on({
                  mouseover: e => e.target.setStyle({ weight: 3, fillOpacity: 0.6 }),
                  mouseout:  e => e.target.setStyle({ weight: 2, fillOpacity: 0.3 })
                });
              } else if (name === 'Indgang Vest') {
                const bookingInfo = `
                  <div style="font-weight: bold; color: #cc0000;">IKKE TILGÆNGELIG</div>
                  <div><strong>Booket af:</strong> Maria Andersen</div>
                  <div><strong>Tidsinterval:</strong> 08:00 - 18:00</div>
                  <div><strong>Dato:</strong> 20/01/2024 - 25/01/2024</div>
                  <div><strong>Kontakt:</strong> maria.andersen@forsvaret.dk</div>
                  <div><strong>Telefon:</strong> +45 87 65 43 21</div>
                `;
                layer.bindTooltip(bookingInfo, { sticky: true });
                layer.on({
                  mouseover: e => e.target.setStyle({ weight: 3, fillOpacity: 0.6 }),
                  mouseout:  e => e.target.setStyle({ weight: 2, fillOpacity: 0.3 })
                });
              } else {
                const availabilityInfo = `
                  <div><strong>${name}</strong></div>
                  <div style="font-weight: bold; color: #0066cc;">TILGÆNGELIG</div>
                  <div>i den angivne periode</div>
                `;
                layer.bindTooltip(availabilityInfo, { sticky: true });
                layer.on({
                  mouseover: e => e.target.setStyle({ weight: 3, fillOpacity: 0.4 }),
                  mouseout:  e => e.target.setStyle({ weight: 2, fillOpacity: 0.1 }),
                  click: () => {
                    if (facilityData[name]) {
                      setSelectedFacility(facilityData[name]);
                      setModalOpen(true);
                    }
                  }
                });
              }
            }}
          />
        )}

        {cities.map(city => (
          <Marker
            key={city.id}
            position={city.coords}
            eventHandlers={{ click: () => setSelectedCity(city) }}
          />
        ))}

        {selectedCity && (
          <FlyToMarker position={selectedCity.coords} zoom={selectedCity.zoom} />
        )}

        <MapController 
          shouldReset={shouldResetMap} 
          onResetComplete={handleMapResetComplete} 
        />

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

      <FacilityModal 
        facility={selectedFacility}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedDates={selectedDates}
        onBookingComplete={handleBookingComplete}
      />

      <BookingReceipt 
        booking={bookingData}
        isOpen={receiptOpen}
        onClose={() => setReceiptOpen(false)}
        onClear={handleClear}
      />
    </div>
  );
}