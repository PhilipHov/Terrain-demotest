
import React, { useState, useEffect } from 'react';
import './FacilityModal.css';

const FacilityModal = ({ facility, isOpen, onClose, selectedDates, onBookingComplete }) => {
  const [editableData, setEditableData] = useState({
    ammoType: '5.56 og 7.62',
    ammoCount: '',
    ammo556Count: '',
    ammo762Count: '',
    size: '',
    accommodation: '',
    meals: '',
    totalBudget: ''
  });

  // Base prices for calculation
  const basePrices = {
    ammoTypePrice: { '5.56': 2, '7.62': 3, '5.56 og 7.62': 2.5, '9mm': 1.5 },
    accommodationPrice: 150, // per person per day
    mealsPrice: 100, // per person per day
    timeSlotPrice: 500 // base price per time slot
  };

  useEffect(() => {
    if (facility) {
      setEditableData({
        ammoType: '5.56 og 7.62',
        ammoCount: facility.ammoCount,
        ammo556Count: facility.ammo556Count || '',
        ammo762Count: facility.ammo762Count || '',
        size: facility.size,
        accommodation: facility.accommodation,
        meals: facility.meals,
        totalBudget: facility.totalBudget
      });
    }
  }, [facility]);

  const calculateBudget = (data) => {
    let total = 0;
    
    // Ammunition cost - separate calculations for 5.56 and 7.62
    const ammo556Count = parseInt(data.ammo556Count) || 0;
    const ammo762Count = parseInt(data.ammo762Count) || 0;
    total += ammo556Count * basePrices.ammoTypePrice['5.56'];
    total += ammo762Count * basePrices.ammoTypePrice['7.62'];
    
    // Accommodation cost (assuming 1 day for simplicity)
    const accommodationPax = parseInt(data.accommodation.replace(' pax', '')) || 0;
    total += accommodationPax * basePrices.accommodationPrice;
    
    // Meals cost
    const mealsPax = parseInt(data.meals.replace(' pax', '')) || 0;
    total += mealsPax * basePrices.mealsPrice;
    
    // Time slot base cost
    total += basePrices.timeSlotPrice;
    
    return total.toLocaleString('da-DK');
  };

  const handleInputChange = (field, value) => {
    const newData = { ...editableData, [field]: value };
    
    // Auto-calculate budget
    if (field !== 'totalBudget') {
      newData.totalBudget = calculateBudget(newData);
    }
    
    setEditableData(newData);
  };

  const handleBooking = () => {
    const bookingData = {
      facilityName: facility.name,
      selectedDates: selectedDates || [],
      ammoType: editableData.ammoType,
      ammoCount: editableData.ammoCount,
      ammo556Count: editableData.ammo556Count,
      ammo762Count: editableData.ammo762Count,
      timeSlot: editableData.size,
      accommodation: editableData.accommodation,
      meals: editableData.meals,
      totalBudget: editableData.totalBudget
    };
    
    onBookingComplete(bookingData);
    onClose();
  };

  if (!isOpen || !facility) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="facility-header">
          <h2>Terrænstykke: {facility.name}</h2>
        </div>
        
        <div className="facility-details">
          <div className="detail-row">
            <div className="detail-item">
              <h4>AMMUNITIONSTYPE</h4>
              <select 
                value={editableData.ammoType}
                onChange={(e) => handleInputChange('ammoType', e.target.value)}
                className="editable-field"
              >
                <option value="5.56 og 7.62">5.56 og 7.62</option>
                <option value="5.56">5.56</option>
                <option value="7.62">7.62</option>
                <option value="9mm">9mm</option>
              </select>
            </div>
          </div>
          
          <div className="detail-row">
            <div className="detail-item">
              <h4>ANTAL AMMO 5.56</h4>
              <input 
                type="number"
                value={editableData.ammo556Count}
                onChange={(e) => handleInputChange('ammo556Count', e.target.value)}
                className="editable-field"
                placeholder="Antal 5.56"
              />
            </div>
            <div className="detail-item">
              <h4>ANTAL AMMO 7.62</h4>
              <input 
                type="number"
                value={editableData.ammo762Count}
                onChange={(e) => handleInputChange('ammo762Count', e.target.value)}
                className="editable-field"
                placeholder="Antal 7.62"
              />
            </div>
          </div>
          
          <div className="detail-row">
            <div className="detail-item">
              <h4>TID</h4>
              <input 
                type="text"
                value={editableData.size}
                onChange={(e) => handleInputChange('size', e.target.value)}
                className="editable-field"
                placeholder="fx. fra kl. 08:00 til kl. 16:00"
              />
            </div>
            <div className="detail-item">
              <h4>INDKVARTERING</h4>
              <input 
                type="text"
                value={editableData.accommodation}
                onChange={(e) => handleInputChange('accommodation', e.target.value)}
                className="editable-field"
                placeholder="fx. 29 pax"
              />
            </div>
          </div>
          
          <div className="detail-row">
            <div className="detail-item">
              <h4>KOST</h4>
              <input 
                type="text"
                value={editableData.meals}
                onChange={(e) => handleInputChange('meals', e.target.value)}
                className="editable-field"
                placeholder="fx. 29 pax"
              />
            </div>
            <div className="detail-item">
              <h4>SAMLET BUDGET I KR</h4>
              <div className="budget-display">{editableData.totalBudget}</div>
            </div>
          </div>
          
          <button className="book-button" onClick={handleBooking}>BOOK NU</button>
        </div>
      </div>
    </div>
  );
};

export default FacilityModal;
