import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Footer } from '../ForView/Footer';
import { Header } from '../ForView/Header';
import { NavLink } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa'; // Importa el ícono de lupa
import Fondo from '../../../assets/FondoEmpresas.png'; // Asegúrate de que la ruta sea correcta

const containerStyle = {
  width: '100%',
  height: '600px' // Aumenta la altura del mapa
};

const center = {
  lat: 37.7749,
  lng: -122.4194
};

export const EventsComprador = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState([
    { id: 1, name: 'Festival de Música', date: new Date('2024-07-30'), location: { lat: 37.7749, lng: -122.4194 }, companies: ['Empresa A', 'Empresa B'], duration: '4 horas', place: 'Central Park' },
    { id: 2, name: 'Feria de Artesanía', date: new Date('2024-07-31'), location: { lat: 37.7749, lng: -122.4194 }, companies: ['Empresa C', 'Empresa D'], duration: '3 horas', place: 'Market Street' },
    { id: 3, name: 'Rally de Food Trucks', date: new Date('2024-08-01'), location: { lat: 37.7849, lng: -122.4094 }, companies: ['Empresa E', 'Empresa F'], duration: '5 horas', place: 'Union Square' },
  ]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentEvents, setCurrentEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    name: '',
    date: new Date(),
    location: { lat: '', lng: '' },
    companies: [],
    duration: '',
    place: ''
  });

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const today = new Date();
    const ongoingEvents = filteredEvents.filter(event => event.date.toDateString() === today.toDateString());
    setCurrentEvents(ongoingEvents);
  }, [filteredEvents]);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null); // Deselecciona el evento y cierra el modal
  };

  const handleNewEventChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prevEvent => ({
      ...prevEvent,
      [name]: value
    }));
  };

  const handleNewEventSubmit = (e) => {
    e.preventDefault();
    setEvents(prevEvents => [
      ...prevEvents,
      { ...newEvent, id: prevEvents.length + 1, date: new Date(newEvent.date) }
    ]);
    setNewEvent({
      name: '',
      date: new Date(),
      location: { lat: '', lng: '' },
      companies: [],
      duration: '',
      place: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-200 font-sans">
      <Header />

      <div className="flex flex-col min-h-screen p-4 md:p-8 bg-gray-200">
        {/* Current Event Message */}
        {currentEvents.length > 0 && (
          <div className="bg-green-500 text-white text-center p-4 rounded-lg shadow-md mx-auto mb-6 max-w-md text-base">
            {currentEvents.map(event => (
              <span key={event.id} className="block">{event.name} está ocurriendo justo ahora.</span>
            ))}
          </div>
        )}

        <section className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center md:items-start">
            {/* Search */}
            <div className="w-full max-w-full mb-6 relative">
              <input
                type="text"
                placeholder="Ingresa el evento que buscas"
                className="w-full p-3 pl-12 rounded border text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
            </div>

            {/* Map */}
            <div className="w-full max-w-full mt-8">
              <LoadScript googleMapsApiKey="AIzaSyB39DzLofNtQbUQSlwfqEfyuD0Eyo0Q1NU">
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={center}
                  zoom={12}
                >
                  {filteredEvents.map(event => (
                    <Marker
                      key={event.id}
                      position={event.location}
                      onClick={() => handleEventClick(event)}
                    />
                  ))}
                </GoogleMap>
              </LoadScript>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col items-center">
            {/* Centered Title and Paragraph */}
            <div className="text-center">
              <h2 className="text-darkyellow text-4xl font-bold mt-6">Comprador</h2>
              <p className="max-w-2xl mt-2 mx-auto text-lg">
                Aquí puedes ver los eventos especiales que tendrán lugar en Circacia. Descubre qué está pasando y participa en ellos.
              </p>
            </div>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-8">
              {filteredEvents.map(event => (
                <div
                  key={event.id}
                  className="border rounded-lg p-6 shadow-md bg-white cursor-pointer text-base"
                  onClick={() => handleEventClick(event)}
                >
                  <h3 className="font-semibold text-xl">{event.name}</h3>
                  <p className="text-sm">{event.date.toDateString()}</p>
                  <p className="text-sm">Ubicación: {event.location.lat}, {event.location.lng}</p>
                </div>
              ))}
            </div>

            {/* Create New Event Container */}
            <div className="border rounded-lg p-6 shadow-md bg-white mt-8 max-w-md mx-auto text-base">
              <h3 className="text-xl font-semibold mb-4">¿Quieres crear un nuevo evento?</h3>
              <p className="mb-4">
                <NavLink to="/EventsForm" className="text-darkyellow font-bold hover:underline">
                  Agregar Evento
                </NavLink>
              </p>
            </div>

            {/* Calendar */}
            <div className="mt-8 text-base">
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileClassName={({ date }) => {
                  const hasEvent = filteredEvents.some(event => event.date.toDateString() === date.toDateString());
                  return hasEvent ? 'bg-yellow-300' : null;
                }}
              />
            </div>
          </div>
        </section>

        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-lg relative p-6">
              <div
                className="relative w-full h-32 bg-cover bg-center rounded-t-lg"
                style={{ backgroundImage: `url(${Fondo})` }}
              >
                <button
                  onClick={closeModal}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                >
                  &times;
                </button>
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-2xl font-semibold text-white">{selectedEvent.name}</h3>
                </div>
              </div>
              <div className="mt-4 p-4 bg-white rounded-b-lg">
                <p><strong>Fecha:</strong> {selectedEvent.date.toDateString()}</p>
                <p><strong>Ubicación:</strong> {selectedEvent.place}</p>
                <p><strong>Duración:</strong> {selectedEvent.duration}</p>
                <p><strong>Empresas Participantes:</strong> {selectedEvent.companies.join(', ')}</p>
              </div>
            </div>
          </div>
        )}

      </div>

      <Footer />
    </div>
  );
};
