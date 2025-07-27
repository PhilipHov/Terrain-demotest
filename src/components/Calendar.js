
import React, { useState } from 'react';
import './Calendar.css';

const Calendar = ({ onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState([]);

  const monthNames = [
    'januar', 'februar', 'marts', 'april', 'maj', 'juni',
    'juli', 'august', 'september', 'oktober', 'november', 'december'
  ];

  const dayNames = ['man.', 'tirs.', 'ons.', 'tors.', 'fre.', 'lør.', 'søn.'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay() === 0 ? 7 : firstDay.getDay(); // Monday = 1

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 1; i < startDay; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const handleDateClick = (day) => {
    if (!day) return;
    
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateString = clickedDate.toISOString().split('T')[0];
    
    let newSelectedDates;
    if (selectedDates.includes(dateString)) {
      newSelectedDates = selectedDates.filter(d => d !== dateString);
    } else {
      newSelectedDates = [...selectedDates, dateString];
      
      // If we now have exactly 2 dates, fill in all dates between them
      if (newSelectedDates.length === 2) {
        const dates = newSelectedDates.map(d => new Date(d)).sort((a, b) => a - b);
        const startDate = dates[0];
        const endDate = dates[1];
        
        const allDatesInRange = [];
        const currentDate = new Date(startDate);
        
        while (currentDate <= endDate) {
          allDatesInRange.push(currentDate.toISOString().split('T')[0]);
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        newSelectedDates = allDatesInRange;
      }
    }
    
    setSelectedDates(newSelectedDates);
    
    if (onDateSelect) {
      onDateSelect(newSelectedDates);
    }
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + direction)));
  };

  const isDateBooked = (day) => {
    // Example: Mark October 10-14 as booked for "Kampvogne skydebane"
    if (currentMonth.getMonth() === 9 && currentMonth.getFullYear() === 2025) { // October 2025
      return day >= 10 && day <= 14;
    }
    return false;
  };

  const isDateSelected = (day) => {
    if (!day) return false;
    const dateString = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      .toISOString().split('T')[0];
    return selectedDates.includes(dateString);
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={() => navigateMonth(-1)}>‹</button>
        <h3>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h3>
        <button onClick={() => navigateMonth(1)}>›</button>
      </div>
      
      <div className="calendar-grid">
        {dayNames.map(day => (
          <div key={day} className="day-header">{day}</div>
        ))}
        
        {days.map((day, index) => (
          <div
            key={index}
            className={`calendar-day ${
              day ? 'active' : 'inactive'
            } ${
              isDateBooked(day) ? 'booked' : ''
            } ${
              isDateSelected(day) ? 'selected' : ''
            }`}
            onClick={() => handleDateClick(day)}
          >
            {day && (
              <>
                <span className="day-number">{day}.</span>
                {isDateBooked(day) && (
                  <div className="booking-label">Kampvogne skydebane</div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
