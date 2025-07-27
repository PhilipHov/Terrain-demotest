
import React, { useState } from 'react';
import './Sidebar.css';

export default function Sidebar({ onSearch, searchResults, terrainData }) {
  const [planops, setPlanops] = useState(null);
  const [type, setType] = useState('all');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    onSearch({
      planops,
      type,
      date,
      time,
      location
    });
  };

  return (
    <aside className="sidebar">
      <h2>Bookingfiltre</h2>
      
      <section className="filter-group">
        <h3>Planops</h3>
        <div className="planops-buttons">
          <button 
            className={`planops-btn ${planops === 'alle' ? 'selected' : ''}`}
            onClick={() => setPlanops('alle')}
          >
            Alle
          </button>
          <button 
            className={`planops-btn ${planops === 'aktive' ? 'selected' : ''}`}
            onClick={() => setPlanops('aktive')}
          >
            Aktive
          </button>
          <button 
            className={`planops-btn ${planops === 'planlagte' ? 'selected' : ''}`}
            onClick={() => setPlanops('planlagte')}
          >
            Planlagte
          </button>
        </div>
      </section>

      <section className="filter-group">
        <h3>Type</h3>
        <div className="type-buttons">
          <button
            className={`type-btn ${type === 'all' ? 'selected' : ''}`}
            onClick={() => setType('all')}
          >
            Alle typer
          </button>
          <button
            className={`type-btn ${type === 'skydebane' ? 'selected' : ''}`}
            onClick={() => setType('skydebane')}
          >
            Skydebane
          </button>
          <button
            className={`type-btn ${type === 'ovelsesterran' ? 'selected' : ''}`}
            onClick={() => setType('ovelsesterran')}
          >
            Øvelsesterræn
          </button>
        </div>
      </section>

      <section className="filter-group">
        <label htmlFor="date">Dato</label>
        <input 
          id="date" 
          type="date" 
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </section>

      <section className="filter-group">
        <label htmlFor="time">Starttid</label>
        <input 
          id="time" 
          type="time" 
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </section>

      <section className="filter-group">
        <label htmlFor="location">Sted</label>
        <select 
          id="location" 
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="">Vælg sted</option>
          {terrainData.map(terrain => (
            <option key={terrain.id} value={terrain.id}>
              {terrain.name}
            </option>
          ))}
        </select>
      </section>

      <button className="search-btn" onClick={handleSearch}>
        SØG
      </button>

      {searchResults && (
        <div className="booking-summary">
          <h4>Søgeresultat</h4>
          <div className="search-results">
            {searchResults.split('\n').map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
