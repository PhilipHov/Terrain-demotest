import React, { useState } from 'react';
import Calendar from './Calendar';
import './Sidebar.css';

const Sidebar = ({ onLocationSearch, onDatesSelected, onClear }) => {
  const [type, setType] = useState(null); // 'skydebane' or 'øvelsesterræn'
  const [selectedLocation, setSelectedLocation] = useState('');
  const [resetCalendar, setResetCalendar] = useState(false);

  const handleClear = () => {
    setType(null);
    setSelectedLocation('');
    setResetCalendar(true);
    if (onDatesSelected) onDatesSelected([]);
    if (onClear) onClear();
    
    // Reset the resetCalendar flag after a brief delay
    setTimeout(() => setResetCalendar(false), 100);
  };

  return (
    <aside className="sidebar">
      <section className="filter-group">
        <h2 className="planops-header">PLANOPS</h2>
      </section>

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
        <select id="unit-type" defaultValue="">
          <option value="" disabled>Vælg enhedstype</option>
          <option value="infanteri">Infanteri</option>
          <option value="panserstyrke">Panserstyrke</option>
          <option value="artilleri">Artilleri</option>
          <option value="ingeniør">Ingeniør</option>
          <option value="militærpoliti">Militærpoliti</option>
          <option value="logistik">Logistik</option>
        </select>
      </section>

      <section className="filter-group">
        <Calendar onDatesSelected={onDatesSelected} resetDates={resetCalendar} />
      </section>

      <button 
        className="directive-btn"
        onClick={() => console.log('Indsæt direktiv clicked')}
      >
        + Indsæt direktiv
      </button>

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
      
      <button 
        className="clear-btn" 
        onClick={handleClear}
      >
        CLEAR
      </button>
    </aside>
  );
}

export default Sidebar;