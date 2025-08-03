import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hej! Jeg er din AI-assistent. Jeg kan hjælpe dig med at finde og booke terræn til din træning. Hvad kan jeg hjælpe dig med?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue);
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  const generateBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('hej') || input.includes('hello') || input.includes('hi')) {
      return "Hej igen! Hvordan kan jeg hjælpe dig i dag?";
    }
    
    if (input.includes('terræn') || input.includes('booking') || input.includes('booke')) {
      return "Jeg kan hjælpe dig med at finde ledige terræn! Du kan se alle tilgængelige områder på kortet. Klik på et grønt område for at se detaljer og booke.";
    }
    
    if (input.includes('tilgængelig') || input.includes('ledig') || input.includes('fri')) {
      return "På kortet kan du se:\n• 🟢 Grønne områder = Tilgængelige\n• 🔴 Røde områder = Ikke tilgængelige\nKlik på et område for at se mere information.";
    }
    
    if (input.includes('ammo') || input.includes('ammunition') || input.includes('skydning')) {
      return "Alle terræn har forskellige ammunitionstyper tilgængelige:\n• 5.56mm\n• 7.62mm\n• 9mm\n\nMængden varierer mellem områderne. Se detaljerne når du klikker på et område.";
    }
    
    if (input.includes('pris') || input.includes('kost') || input.includes('budget')) {
      return "Priserne varierer mellem 28.500 - 58.500 kr afhængigt af område og antal personer. Det inkluderer ammunition, overnatning og måltider.";
    }
    
    if (input.includes('dato') || input.includes('tid') || input.includes('periode')) {
      return "Du kan vælge datoer i kalenderen i sidepanelet til venstre. Terrænene er tilgængelige i forskellige tidsperioder - se detaljerne for hvert område.";
    }
    
    if (input.includes('kontakt') || input.includes('support') || input.includes('hjælp')) {
      return "For yderligere support kan du kontakte:\n📧 support@terrain-booking.dk\n📞 +45 70 12 34 56\n\nEller brug mig - jeg er her for at hjælpe!";
    }
    
    if (input.includes('tak') || input.includes('thanks')) {
      return "Selv tak! Er der andet jeg kan hjælpe dig med?";
    }
    
    return "Jeg forstår ikke helt dit spørgsmål. Prøv at spørge om:\n• Terræn og booking\n• Tilgængelighed\n• Ammunition\n• Priser\n• Datoer og tider\n• Kontakt og support";
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('da-DK', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="chatbot-container">
      {/* Floating Chat Button */}
      <button 
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Åbn chatbot"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <div className="chatbot-avatar">🤖</div>
              <div>
                <h3>AI Assistent</h3>
                <span className="chatbot-status">Online</span>
              </div>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.sender === 'user' ? 'user' : 'bot'}`}
              >
                <div className="message-content">
                  <div className="message-text">{message.text}</div>
                  <div className="message-time">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Skriv dit spørgsmål her..."
              rows="1"
            />
            <button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="send-button"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22,2 15,22 11,13 2,9"></polygon>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot; 