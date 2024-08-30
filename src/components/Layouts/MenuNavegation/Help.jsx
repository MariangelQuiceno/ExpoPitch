import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from '../../../assets/Artesanías.png';
import BackgroundImage from '../../../assets/FondoMenu.png';
import Background from '../../../assets/Fondo.png';
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';

// Función para manejar respuestas basadas en palabras clave
const handleKeywordResponses = (question) => {
  const keywords = {
    'misión': 'Nuestra misión es ofrecer productos de alta calidad y apoyar a los artesanos locales.',
    'recuperación de cuenta': 'Para recuperar tu cuenta, visita la página de recuperación de cuenta en nuestro sitio web.',
    'actualización de datos': 'Puedes actualizar tus datos desde la sección de perfil en tu cuenta.',
    'productos': 'Puedes explorar nuestros productos en la sección de artesanias en la pagina de inicio.',
    'estética': 'Para mejorar la estética de tus productos, asegúrate de usar imágenes de alta calidad, sin fondo o en su defecto uno de color blanco o neutro, y descripciones detalladas.',
  };

  for (const [keyword, response] of Object.entries(keywords)) {
    if (question.toLowerCase().includes(keyword)) {
      return response;
    }
  }
  return null;
};

// Función para llamar al servicio de IA
const fetchAIResponse = async (question) => {
  try {
    const response = await axios.post(
      '/api/ai', // Cambia esto a la URL de tu propio endpoint
      {
        prompt: question,
        max_tokens: 150,
        temperature: 0.7,
      }
    );

    const aiResponse = response.data.choices[0].text.trim();
    return `${aiResponse}\n\n¿Te gustaría preguntar algo más sobre nuestra misión, recuperación de cuenta, actualización de datos, productos, o algo más?`;
  } catch (error) {
    console.error('Error al obtener la respuesta de la IA:', error);
    return 'No pudimos procesar tu pregunta en este momento. Intenta de nuevo más tarde.';
  }
};

export const Help = () => {
    // Obtiene el rol de usuario desde el localStorage o establece 'anonimo' por defecto
  const userRole = localStorage.getItem('userType') || 'anonimo';
  const navigate = useNavigate();
  const [userQuestion, setUserQuestion] = useState('');
  const [messages, setMessages] = useState([
    { text: 'Hola, ¿cómo podemos ayudarte hoy? Aquí tienes algunas ideas sobre lo que puedes preguntar:', sender: 'system' },
    { text: '1. ¿Cuál es nuestra misión?', sender: 'system' },
    { text: '2. ¿Cómo puedo recuperar mi cuenta?', sender: 'system' },
    { text: '3. ¿Cómo actualizo mis datos?', sender: 'system' },
    { text: '4. ¿Dónde puedo ver los productos?', sender: 'system' },
    { text: '5. ¿Cómo puedo mejorar la estética de mis productos?', sender: 'system' }
  ]);
  const chatEndRef = useRef(null);

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate('/#');
  };

  const handleUserInput = (e) => {
    setUserQuestion(e.target.value);
  };

  const handleLoginClick = () => {
    navigate('/#');
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    const question = userQuestion.trim();

    if (!question) return;

    // Añadir la pregunta del usuario al chat
    setMessages(prevMessages => [
      ...prevMessages,
      { text: question, sender: 'user' }
    ]);

    // Verificar respuestas basadas en palabras clave
    const keywordResponse = handleKeywordResponses(question);
    if (keywordResponse) {
      // Añadir respuesta de palabra clave al chat
      setMessages(prevMessages => [
        ...prevMessages,
        { text: keywordResponse, sender: 'system' }
      ]);
    } else {
      // Obtener respuesta de IA si no se encontró una respuesta de palabra clave
      const aiResponse = await fetchAIResponse(question);
      // Añadir respuesta de IA al chat
      setMessages(prevMessages => [
        ...prevMessages,
        { text: aiResponse, sender: 'system' }
      ]);
    }

    setUserQuestion('');
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      <div
        className="md:w-1/5 lg:w-1/6 bg-cover bg-center p-4 text-white flex justify-center items-center"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      >
        <div className="flex flex-col items-center">
          <a href="/#" onClick={handleLogoClick} className="mb-6">
            <img src={Logo} alt="Logo" className="h-32 w-32" />
          </a>
          <nav className="flex flex-col items-center space-y-6">
          <NavLink to="/menu" className="text-xl md:text-2xl text-white hover:text-darkyellow font-bold">Bienvenido</NavLink>

          {/* Solo muestra el perfil si el usuario no es anonimo */}
          {userRole !== 'anonimo' && (
            <NavLink to={userRole === 'comprador' ? '/ProfileComprador' : userRole === 'administrador' ? '/ProfileForAdmin' : '/ProfileForEmpleado'} className="text-xl md:text-2xl text-white hover:text-darkyellow font-bold">
              Perfil
            </NavLink>
          )}

          {/* Rutas para el rol 'comprador' o 'anonimo' */}
          {(userRole === 'comprador' || userRole === 'anonimo') && (
            <>
              <NavLink to="/ProductFav" className="text-xl md:text-2xl text-white hover:text-darkyellow font-bold">Favoritos</NavLink>
            </>
          )}

          {/* Rutas para los roles 'administrador' y 'empleado' */}
          {(userRole === 'administrador' || userRole === 'empleado') && (
            <>
              <NavLink to="/SalesOverview" className="text-xl md:text-2xl text-white hover:text-darkyellow font-bold">Ventas</NavLink>
            </>
          )}

          {/* Ruta común para todos */}
          <NavLink to="/Help" className="text-xl md:text-2xl text-white hover:text-darkyellow font-bold">Ayuda</NavLink>

          <button
            className="bg-darkyellow text-white px-4 py-2 rounded hover:bg-lightyellow mt-4 text-lg font-bold"
            onClick={handleLoginClick}
          >
            Regresar
          </button>
        </nav>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center md:w-4/5 lg:w-5/6">
        <div className="w-full h-full flex justify-center items-center bg-cover bg-center p-4" style={{ backgroundImage: `url(${Background})` }}>
          <div className="flex flex-col items-center justify-center text-center p-8 bg-white bg-opacity-70 rounded-lg max-w-lg mx-auto md:max-w-2xl w-full">
            <div className="w-full max-w-lg mb-8">
            <img src={Logo} alt="Logo" className="h-20 w-20 text-gray-800 mb-4 mx-auto" />
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Coffe Art chat de ayuda</h1>
              
              <div className="flex flex-col space-y-4 w-full mb-8 overflow-y-auto max-h-60 border border-gray-300 p-4 rounded-lg bg-gray-100">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex items-start space-x-4 mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-lg flex items-center space-x-2 ${msg.sender === 'user' ? 'bg-darkpurple text-white' : 'bg-lightpurple text-white'}`}>
                      {msg.sender === 'system' && <img src={Logo} alt="Logo" className="h-8 w-8" />}
                      {msg.sender === 'user' && <FaUserCircle className="text-white h-8 w-8" />}
                      <p className="text-lg">{msg.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleQuestionSubmit} className="flex items-center w-full max-w-lg">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                  placeholder="Escribe tu pregunta aquí..."
                  value={userQuestion}
                  onChange={handleUserInput}
                  required
                />
                <button
                  type="submit"
                  className="ml-2 bg-darkyellow text-white px-4 py-2 rounded hover:bg-lightyellow text-xl font-bold"
                >
                  Preguntar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
