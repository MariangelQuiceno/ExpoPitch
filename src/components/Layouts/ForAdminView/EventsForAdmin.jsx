import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Header } from '../ForView/Header';
import { Footer } from '../ForView/Footer';
import { NavLink, useLocation } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';
import Fondo from '../../../assets/FondoEmpresas.png'; // Asegúrate de que la ruta sea correcta

const containerStyle = {
  width: '100%',
  height: '600px',
};

const center = {
  lat: 37.7749,
  lng: -122.4194,
};

export const EventsForAdmin = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const location = useLocation(); // Hook para detectar cambios en la ruta

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const idAdministrador = localStorage.getItem('userId'); // Asegúrate de que 'userId' es el nombre correcto

        if (!token || !idAdministrador) {
          console.error('Token o ID de administrador no encontrados en el localStorage');
          return;
        }

        const response = await fetch(`https://checkpoint-9tp4.onrender.com/api/evento/admin/${idAdministrador}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Eventos obtenidos:', data); // Verifica los datos
        setEvents(data);
        
        // Mostrar todos los eventos de la empresa en la consola
        const eventosEmpresa = data.filter(event => event.idEmpresa === idAdministrador);
        console.log('Eventos de la empresa:', eventosEmpresa);

      } catch (error) {
        console.error('Error al obtener eventos:', error.message);
      }
    };

    fetchEvents();
  }, [location.pathname]); // Ejecutar cuando cambie la ruta

  const filteredEvents = events.filter(event =>
    event.nombreEvento.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log('Eventos filtrados:', filteredEvents); // Verifica los eventos filtrados

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="min-h-screen bg-gray-200 font-sans">
      <Header />

      <div className="flex flex-col min-h-screen p-4 md:p-8 bg-gray-200">
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
              <LoadScript googleMapsApiKey="TU_API_KEY_DE_GOOGLE">
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={center}
                  zoom={12}
                >
                  {filteredEvents.map(event => (
                    <Marker
                      key={event.idEvento}
                      position={{ lat: event.ubicacion.lat, lng: event.ubicacion.lng }}
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
              <h2 className="text-darkyellow text-4xl font-bold mt-6">Eventos Especiales</h2>
              <p className="max-w-2xl mt-2 mx-auto text-lg">
                Aquí puedes ver los eventos especiales que tendrán lugar en Circacia. Descubre qué está pasando y participa en ellos.
              </p>
            </div>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-8">
              {filteredEvents.map(event => (
                <div
                  key={event.idEvento}
                  className="border rounded-lg p-6 shadow-md bg-white cursor-pointer text-base"
                >
                  <h3 className="font-semibold text-xl">{event.nombreEvento}</h3>
                  <p className="text-sm">{formatDate(event.fecha)}</p>
                  <p className="text-sm">{event.descripcion}</p>
                  <p className="text-sm">Empresa Asistente: {event.empresasAsistente}</p>
                  <button
                    onClick={() => handleEventClick(event)}
                    className="mt-4 bg-darkyellow text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    Ver información completa
                  </button>
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
                  const hasEvent = filteredEvents.some(event => new Date(event.fecha).toDateString() === date.toDateString());
                  return hasEvent ? 'bg-yellow-300' : null;
                }}
              />
            </div>
          </div>
        </section>

        {selectedEvent && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/3 relative overflow-hidden">
              {/* Banner de Fondo */}
              <div className="relative">
                <img src={Fondo} alt="Banner" className="w-full h-40 object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <h2 className="text-2xl font-semibold text-white">{selectedEvent.nombreEvento}</h2>
                </div>
              </div>
              {/* Contenido de la Modal */}
              <div className="p-6">
                <p className="mb-2"><strong>Fecha:</strong> {formatDate(selectedEvent.fecha)}</p>
                <p className="mb-2"><strong>Ubicación:</strong> {selectedEvent.ubicacion}</p>
                <p className="mb-2"><strong>Duración:</strong> {selectedEvent.duracion}</p>
                <p className="mb-4"><strong>Empresas Participantes:</strong> 
                  {selectedEvent.empresasAsistente ? selectedEvent.empresasAsistente : 'No hay empresas participantes'}
                </p>
                <p className="mt-4"><strong>Descripción:</strong> {selectedEvent.descripcion}</p>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={closeModal}
                    className="text-white bg-darkyellow hover:bg-lightyellow px-4 py-2 rounded mr-2 flex items-center"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      <Footer />
    </div>
  );
};
