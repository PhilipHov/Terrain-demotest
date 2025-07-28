
import React, { useState, useEffect } from 'react';
import './FacilityModal.css';

const FacilityModal = ({ facility, isOpen, onClose, selectedDates, onBookingComplete }) => {
  const [currentTab, setCurrentTab] = useState('ammunition');
  const [editableData, setEditableData] = useState({
    // Ammunition tab
    ammoType: '5.56 og 7.62',
    ammoCount: '',
    ammo556Count: '',
    ammo762Count: '',
    timeSlot: '',
    
    // Accommodation tab
    accommodation: '',
    meals: '',
    accommodationNotes: '',
    
    // Support tab
    garage: false,
    maintenance: false,
    supportNotes: '',
    
    // Vehicle tab
    vehicleType: '',
    vehicleCount: '',
    vehicleNotes: '',
    
    totalBudget: ''
  });

  // Base prices for calculation
  const basePrices = {
    ammoTypePrice: { '5.56': 2, '7.62': 3, '5.56 og 7.62': 2.5, '9mm': 1.5 },
    accommodationPrice: 150, // per person per day
    mealsPrice: 100, // per person per day
    timeSlotPrice: 500, // base price per time slot
    garagePrice: 200, // per day
    maintenancePrice: 300, // per day
    vehiclePrice: { 'bus': 500, 'vito': 300, 'delebil': 200 } // per day
  };

  useEffect(() => {
    if (facility) {
      setEditableData(prev => ({
        ...prev,
        ammoCount: facility.ammoCount,
        ammo556Count: facility.ammo556Count || '',
        ammo762Count: facility.ammo762Count || '',
        timeSlot: facility.size,
        accommodation: facility.accommodation,
        meals: facility.meals,
        totalBudget: facility.totalBudget
      }));
    }
  }, [facility]);

  const calculateTotalBudget = () => {
    let total = 0;
    const days = selectedDates?.length || 1;
    
    // Ammunition costs
    const ammo556 = parseInt(editableData.ammo556Count) || 0;
    const ammo762 = parseInt(editableData.ammo762Count) || 0;
    total += (ammo556 * basePrices.ammoTypePrice['5.56']) + (ammo762 * basePrices.ammoTypePrice['7.62']);
    
    // Accommodation costs
    const accommodationPax = parseInt(editableData.accommodation) || 0;
    const mealsPax = parseInt(editableData.meals) || 0;
    total += (accommodationPax * basePrices.accommodationPrice * days);
    total += (mealsPax * basePrices.mealsPrice * days);
    
    // Support costs
    if (editableData.garage) total += basePrices.garagePrice * days;
    if (editableData.maintenance) total += basePrices.maintenancePrice * days;
    
    // Vehicle costs
    if (editableData.vehicleType && editableData.vehicleCount) {
      const vehicleCount = parseInt(editableData.vehicleCount) || 0;
      const vehiclePrice = basePrices.vehiclePrice[editableData.vehicleType] || 0;
      total += vehiclePrice * vehicleCount * days;
    }
    
    // Time slot base cost
    total += basePrices.timeSlotPrice * days;
    
    return total.toLocaleString();
  };

  useEffect(() => {
    const newBudget = calculateTotalBudget();
    setEditableData(prev => ({ ...prev, totalBudget: newBudget }));
  }, [editableData.ammo556Count, editableData.ammo762Count, editableData.accommodation, editableData.meals, editableData.garage, editableData.maintenance, editableData.vehicleType, editableData.vehicleCount, selectedDates]);

  const handleInputChange = (field, value) => {
    setEditableData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextTab = () => {
    const tabs = ['ammunition', 'accommodation', 'support', 'vehicle'];
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex < tabs.length - 1) {
      setCurrentTab(tabs[currentIndex + 1]);
    }
  };

  const handlePrevTab = () => {
    const tabs = ['ammunition', 'accommodation', 'support', 'vehicle'];
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex > 0) {
      setCurrentTab(tabs[currentIndex - 1]);
    }
  };

  const handleBooking = () => {
    const bookingData = {
      facilityName: facility.name,
      selectedDates: selectedDates || [],
      ammoType: editableData.ammoType,
      ammoCount: editableData.ammoCount,
      ammo556Count: editableData.ammo556Count,
      ammo762Count: editableData.ammo762Count,
      timeSlot: editableData.timeSlot,
      accommodation: editableData.accommodation,
      meals: editableData.meals,
      accommodationNotes: editableData.accommodationNotes,
      garage: editableData.garage,
      maintenance: editableData.maintenance,
      supportNotes: editableData.supportNotes,
      vehicleType: editableData.vehicleType,
      vehicleCount: editableData.vehicleCount,
      vehicleNotes: editableData.vehicleNotes,
      totalBudget: editableData.totalBudget
    };
    
    onBookingComplete(bookingData);
    onClose();
    setCurrentTab('ammunition'); // Reset to first tab
  };

  if (!isOpen || !facility) return null;

  const renderAmmunitionTab = () => (
    <div className="tab-content">
      <h3>AMMUNITION & TIDSINTERVAL</h3>
      <div className="detail-row">
        <div className="detail-item">
          <h4>AMMUNITIONSTYPE</h4>
          <select 
            value={editableData.ammoType}
            onChange={(e) => handleInputChange('ammoType', e.target.value)}
          >
            <option value="5.56">5.56</option>
            <option value="7.62">7.62</option>
            <option value="5.56 og 7.62">5.56 og 7.62</option>
            <option value="9mm">9mm</option>
          </select>
        </div>
        <div className="detail-item">
          <h4>ANTAL AMMO 5.56</h4>
          <input 
            type="number"
            value={editableData.ammo556Count}
            onChange={(e) => handleInputChange('ammo556Count', e.target.value)}
          />
        </div>
      </div>
      <div className="detail-row">
        <div className="detail-item">
          <h4>ANTAL AMMO 7.62</h4>
          <input 
            type="number"
            value={editableData.ammo762Count}
            onChange={(e) => handleInputChange('ammo762Count', e.target.value)}
          />
        </div>
        <div className="detail-item">
          <h4>TIDSINTERVAL</h4>
          <input 
            type="text"
            value={editableData.timeSlot}
            onChange={(e) => handleInputChange('timeSlot', e.target.value)}
            placeholder="f.eks. 08:00 - 16:00"
          />
        </div>
      </div>
    </div>
  );

  const renderAccommodationTab = () => (
    <div className="tab-content">
      <h3>INDKVARTERING & KOST</h3>
      <div className="detail-row">
        <div className="detail-item">
          <h4>INDKVARTERING (PAX)</h4>
          <input 
            type="number"
            value={editableData.accommodation}
            onChange={(e) => handleInputChange('accommodation', e.target.value)}
            placeholder="Antal personer"
          />
        </div>
        <div className="detail-item">
          <h4>KOST (PAX)</h4>
          <input 
            type="number"
            value={editableData.meals}
            onChange={(e) => handleInputChange('meals', e.target.value)}
            placeholder="Antal personer"
          />
        </div>
      </div>
      <div className="detail-item full-width">
        <h4>SÆRLIGE ØNSKER TIL INDKVARTERING</h4>
        <textarea
          value={editableData.accommodationNotes}
          onChange={(e) => handleInputChange('accommodationNotes', e.target.value)}
          placeholder="Beskriv eventuelle særlige ønsker..."
          rows="3"
        />
      </div>
    </div>
  );

  const renderSupportTab = () => (
    <div className="tab-content">
      <h3>STØTTE & VEDLIGEHOLDELSE</h3>
      <div className="detail-row">
        <div className="detail-item">
          <h4>GARAGE</h4>
          <label className="checkbox-container">
            <input 
              type="checkbox"
              checked={editableData.garage}
              onChange={(e) => handleInputChange('garage', e.target.checked)}
            />
            <span className="checkmark"></span>
            Garage nødvendig
          </label>
        </div>
        <div className="detail-item">
          <h4>VEDLIGEHOLDELSE</h4>
          <label className="checkbox-container">
            <input 
              type="checkbox"
              checked={editableData.maintenance}
              onChange={(e) => handleInputChange('maintenance', e.target.checked)}
            />
            <span className="checkmark"></span>
            Vedligeholdelse nødvendig
          </label>
        </div>
      </div>
      <div className="detail-item full-width">
        <h4>STØTTE NOTER</h4>
        <textarea
          value={editableData.supportNotes}
          onChange={(e) => handleInputChange('supportNotes', e.target.value)}
          placeholder="Beskriv eventuelle særlige støttebehov..."
          rows="3"
        />
      </div>
    </div>
  );

  const renderVehicleTab = () => (
    <div className="tab-content">
      <h3>KØRETØJ</h3>
      <div className="detail-row">
        <div className="detail-item">
          <h4>KØRETØJSTYPE</h4>
          <select 
            value={editableData.vehicleType}
            onChange={(e) => handleInputChange('vehicleType', e.target.value)}
          >
            <option value="">Vælg køretøj</option>
            <option value="bus">Bus</option>
            <option value="vito">Vito</option>
            <option value="delebil">Delebil</option>
          </select>
        </div>
        <div className="detail-item">
          <h4>ANTAL KØRETØJER</h4>
          <input 
            type="number"
            value={editableData.vehicleCount}
            onChange={(e) => handleInputChange('vehicleCount', e.target.value)}
            placeholder="Antal"
          />
        </div>
      </div>
      <div className="detail-item full-width">
        <h4>KØRETØJ NOTER</h4>
        <textarea
          value={editableData.vehicleNotes}
          onChange={(e) => handleInputChange('vehicleNotes', e.target.value)}
          placeholder="Beskriv eventuelle særlige krav til køretøjer..."
          rows="3"
        />
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <h2>{facility.name}</h2>
        </div>

        <div className="modal-tabs">
          <button 
            className={`tab-button ${currentTab === 'ammunition' ? 'active' : ''}`}
            onClick={() => setCurrentTab('ammunition')}
          >
            1. Ammunition
          </button>
          <button 
            className={`tab-button ${currentTab === 'accommodation' ? 'active' : ''}`}
            onClick={() => setCurrentTab('accommodation')}
          >
            2. Indkvartering
          </button>
          <button 
            className={`tab-button ${currentTab === 'support' ? 'active' : ''}`}
            onClick={() => setCurrentTab('support')}
          >
            3. Støtte
          </button>
          <button 
            className={`tab-button ${currentTab === 'vehicle' ? 'active' : ''}`}
            onClick={() => setCurrentTab('vehicle')}
          >
            4. Køretøj
          </button>
        </div>

        <div className="modal-body">
          {currentTab === 'ammunition' && renderAmmunitionTab()}
          {currentTab === 'accommodation' && renderAccommodationTab()}
          {currentTab === 'support' && renderSupportTab()}
          {currentTab === 'vehicle' && renderVehicleTab()}

          <div className="budget-section">
            <div className="detail-item">
              <h4>SAMLET BUDGET I KR</h4>
              <div className="budget-display">{editableData.totalBudget}</div>
            </div>
          </div>

          <div className="modal-navigation">
            {currentTab !== 'ammunition' && (
              <button className="nav-button prev" onClick={handlePrevTab}>
                ← Forrige
              </button>
            )}
            
            {currentTab !== 'vehicle' ? (
              <button className="nav-button next" onClick={handleNextTab}>
                Næste →
              </button>
            ) : (
              <button className="book-button" onClick={handleBooking}>
                BOOK NU
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityModal;
