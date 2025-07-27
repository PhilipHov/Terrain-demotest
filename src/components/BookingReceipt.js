
import React from 'react';
import './BookingReceipt.css';

const BookingReceipt = ({ booking, isOpen, onClose, onClear }) => {
  if (!isOpen || !booking) return null;

  const handleClose = () => {
    onClose();
    if (onClear) onClear();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('da-DK', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateRange = (dates) => {
    if (!dates || dates.length === 0) return 'Ingen datoer valgt';
    if (dates.length === 1) return formatDate(dates[0]);
    
    const sortedDates = [...dates].sort();
    const startDate = formatDate(sortedDates[0]);
    const endDate = formatDate(sortedDates[sortedDates.length - 1]);
    
    if (sortedDates.length === 2) {
      return `${startDate} til ${endDate}`;
    } else {
      return `${startDate} til ${endDate} (${sortedDates.length} dage)`;
    }
  };

  return (
    <div className="receipt-overlay" onClick={handleClose}>
      <div className="receipt-content" onClick={(e) => e.stopPropagation()}>
        <button className="receipt-close" onClick={handleClose}>×</button>
        
        <div className="receipt-header">
          <h2>BOOKING KVITTERING</h2>
          <div className="receipt-number">Kvittering #BK-{Date.now().toString().slice(-6)}</div>
        </div>
        
        <div className="receipt-details">
          <div className="receipt-section">
            <h3>TERRÆNSTYKKE</h3>
            <p>{booking.facilityName}</p>
          </div>
          
          <div className="receipt-section">
            <h3>PERIODE</h3>
            <p>{formatDateRange(booking.selectedDates)}</p>
          </div>
          
          <div className="receipt-row">
            <div className="receipt-item">
              <h4>AMMUNITIONSTYPE</h4>
              <p>{booking.ammoType}</p>
            </div>
            <div className="receipt-item">
              <h4>ANTAL AMMO 5.56</h4>
              <p>{booking.ammo556Count || '0'}</p>
            </div>
          </div>
          
          <div className="receipt-row">
            <div className="receipt-item">
              <h4>ANTAL AMMO 7.62</h4>
              <p>{booking.ammo762Count || '0'}</p>
            </div>
            <div className="receipt-item">
              <h4>SAMLET AMMO</h4>
              <p>{(parseInt(booking.ammo556Count || '0') + parseInt(booking.ammo762Count || '0')).toLocaleString()}</p>
            </div>
          </div>
          
          <div className="receipt-row">
            <div className="receipt-item">
              <h4>TID</h4>
              <p>{booking.timeSlot}</p>
            </div>
            <div className="receipt-item">
              <h4>INDKVARTERING</h4>
              <p>{booking.accommodation}</p>
            </div>
          </div>
          
          <div className="receipt-row">
            <div className="receipt-item">
              <h4>KOST</h4>
              <p>{booking.meals}</p>
            </div>
            <div className="receipt-item total-budget">
              <h4>SAMLET BUDGET</h4>
              <p>{booking.totalBudget} kr</p>
            </div>
          </div>
          
          <div className="receipt-footer">
            <p>Booking bekræftet den {new Date().toLocaleDateString('da-DK')}</p>
            <p>Tak for din booking!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingReceipt;
