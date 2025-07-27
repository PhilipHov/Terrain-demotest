import React, { useState } from 'react';
import './Sidebar.css';

export default function Sidebar() {
  const [type, setType] = useState(null); // 'skydebane' or 'øvelsesterræn'

  return (
    <aside className="sidebar">
      <section className="filter-group">
        <h3>Type</h3>
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
        <select id="location" defaultValue="">
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

      <button className="search-btn">SØG</button>
    </aside>
  );
}
