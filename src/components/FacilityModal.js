
import React from 'react';
import './FacilityModal.css';

const FacilityModal = ({ facility, isOpen, onClose }) => {
  if (!isOpen || !facility) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="facility-map">
          <div className="map-placeholder">
            {facility.name}
          </div>
        </div>
        
        <div className="facility-details">
          <div className="detail-row">
            <div className="detail-item">
              <h4>AMMUNITIONSTYPE</h4>
              <p>{facility.ammoType}</p>
            </div>
            <div className="detail-item">
              <h4>ANTAL AMMO</h4>
              <p>{facility.ammoCount}</p>
            </div>
          </div>
          
          <div className="detail-row">
            <div className="detail-item">
              <h4>STØRRELSE</h4>
              <p>{facility.size}</p>
            </div>
            <div className="detail-item">
              <h4>INDKVARTERING</h4>
              <p>{facility.accommodation}</p>
            </div>
          </div>
          
          <div className="detail-row">
            <div className="detail-item">
              <h4>KOST</h4>
              <p>{facility.meals}</p>
            </div>
            <div className="detail-item">
              <h4>SAMLET BUDGET I KR</h4>
              <p>{facility.totalBudget}</p>
            </div>
          </div>
          
          <button className="book-button">BOOK NU</button>
        </div>
      </div>
    </div>
  );
};

export default FacilityModal;
