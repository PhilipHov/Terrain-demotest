import React, { useState } from 'react';
import './Sidebar.css';

export default function Sidebar({ onLocationSearch }) {
  const [type, setType] = useState(null); // 'skydebane' or 'øvelsesterræn'
  const [selectedLocation, setSelectedLocation] = useState('');

  return (
    <aside className="sidebar">
      <section className="filter-group">
        <h3>Aktivitetstype</h3>
        <div className="type-buttons">
          <button
            className={`type-btn ${type === 'skydebane' ? 'selected' : ''}`}
            onClick={() => setType('skydebane')}
          >
            Skydebane
          </button>
          <button
            className={`type-btn ${type === 'øvelsesterræn' ? 'selected' : ''}`}
            onClick={() => setType('øvelsesterræn')}
          >
            Øvelsesterræn
          </button>
        </div>
      </section>

      <section className="filter-group">
        <label htmlFor="unit-type">Enhedstype</label>
        <select id="unit-type">
          <option value="" disabled selected>Vælg enhedstype</option>
          <option value="infanteri">Infanteri</option>
          <option value="panserstyrke">Panserstyrke</option>
          <option value="artilleri">Artilleri</option>
          <option value="ingeniør">Ingeniør</option>
          <option value="militærpoliti">Militærpoliti</option>
          <option value="logistik">Logistik</option>
        </select>
      </section>

      <section className="filter-group">
        <label htmlFor="date-from">Fra dato</label>
        <input id="date-from" type="date" placeholder="Fra dato" />
        
        <label htmlFor="date-to" style={{marginTop: '0.5rem'}}>Til dato</label>
        <input id="date-to" type="date" placeholder="Til dato" />
      </section>

      <section className="filter-group">
        <label htmlFor="time-from">Fra tidspunkt</label>
        <input id="time-from" type="time" placeholder="Fra tidspunkt" />
        
        <label htmlFor="time-to" style={{marginTop: '0.5rem'}}>Til tidspunkt</label>
        <input id="time-to" type="time" placeholder="Til tidspunkt" />
      </section>

      <section className="filter-group">
        <label htmlFor="location">Sted</label>
        <select 
          id="location" 
          value={selectedLocation} 
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value="" disabled>Vælg sted</option>
          {[
            'Aalborg','Allinge','Fredericia','Frederikshavn','Haderslev',
            'Høvelte','Herning','Holstebro','Næstved','Nørresundby',
            'Oksbøl','Rønne','Slagelse','Skive','Skrydstrup',
            'Skalstrup','Thisted','Varde','Vordingborg','Karup','Dyrehaven'
          ].map(city => (
            <option key={city} value={city.toLowerCase()}>
              {city}
            </option>
          ))}
        </select>
      </section>

      <button 
        className="search-btn" 
        onClick={() => onLocationSearch && onLocationSearch(selectedLocation)}
      >
        SØG
      </button>
    </aside>
  );
}
