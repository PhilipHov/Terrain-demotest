
import React, { useState, useEffect } from 'react';
import './BookingModal.css';

export default function BookingModal({ terrain, onClose, onSubmit, filters }) {
  const [formData, setFormData] = useState({
    activity: '',
    unit: 'INF',
    date: filters.date || '',
    start: filters.time || '',
    end: '',
    ammoType: '5.56',
    ammoQty: '',
    lodging: 'nej',
    transport: 'nej'
  });

  useEffect(() => {
    // Set default values when modal opens
    setFormData(prev => ({
      ...prev,
      date: filters.date || '',
      start: filters.time || ''
    }));
  }, [filters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getActivityOptions = () => {
    if (terrain.type === 'skydebane') {
      return [
        { value: 'Skydebane', label: 'Skydebane' }
      ];
    } else {
      return [
        { value: 'Øvelse', label: 'Øvelse' },
        { value: 'Enhedsuddannelse', label: 'Enhedsuddannelse' }
      ];
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Book terræn</h2>
        <h3>{terrain.name}</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="activity">Aktivitet</label>
            <select 
              id="activity" 
              name="activity" 
              value={formData.activity}
              onChange={handleInputChange}
              required
            >
              <option value="">Vælg aktivitet</option>
              {getActivityOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="unit">Enhedstype</label>
            <select 
              id="unit" 
              name="unit" 
              value={formData.unit}
              onChange={handleInputChange}
              required
            >
              <option value="INF">INF (Infanteri)</option>
              <option value="MEKINF">MEKINF (Mekaniseret INF)</option>
              <option value="PNINF">PNINF (Panser INF)</option>
              <option value="KVG">KVG (Kampvogne)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date">Dato</label>
            <input 
              type="date" 
              id="date" 
              name="date" 
              value={formData.date}
              onChange={handleInputChange}
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="start">Starttid</label>
            <input 
              type="time" 
              id="start" 
              name="start" 
              value={formData.start}
              onChange={handleInputChange}
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="end">Sluttid</label>
            <input 
              type="time" 
              id="end" 
              name="end" 
              value={formData.end}
              onChange={handleInputChange}
              required 
            />
          </div>

          {terrain.type === 'skydebane' && (
            <div className="ammo-section">
              <div className="form-group">
                <label htmlFor="ammoType">Ammunitionstype</label>
                <select 
                  id="ammoType" 
                  name="ammoType" 
                  value={formData.ammoType}
                  onChange={handleInputChange}
                >
                  <option value="5.56">5.56 mm</option>
                  <option value="7.62">7.62 mm</option>
                  <option value="12.7">12.7 mm</option>
                  <option value="IKK">IKK</option>
                  <option value="KVG">KVG</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="ammoQty">Mængde ammunition</label>
                <input 
                  type="number" 
                  id="ammoQty" 
                  name="ammoQty" 
                  value={formData.ammoQty}
                  onChange={handleInputChange}
                  min="0" 
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="lodging">Indkvartering</label>
            <select 
              id="lodging" 
              name="lodging" 
              value={formData.lodging}
              onChange={handleInputChange}
            >
              <option value="nej">Nej</option>
              <option value="ja">Ja</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="transport">Transport</label>
            <select 
              id="transport" 
              name="transport" 
              value={formData.transport}
              onChange={handleInputChange}
            >
              <option value="nej">Nej</option>
              <option value="ja">Ja</option>
            </select>
          </div>

          <button type="submit" className="submit-btn">
            Bekræft booking
          </button>
        </form>
      </div>
    </div>
  );
}
