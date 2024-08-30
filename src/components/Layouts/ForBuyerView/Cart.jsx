import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Background from '../../../assets/Fondo.png';

export const Cart = () => {
  const navigate = useNavigate();
  const [userQuestion, setUserQuestion] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate('/#');
  };

  const handleLoginClick = () => {
    navigate('/#');
  };

  const handleQuestionSubmit = (e) => {
    e.preventDefault();
    console.log('Question submitted:', userQuestion);
    setUserQuestion('');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Search submitted:', searchQuery);
    setSearchQuery('');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="flex flex-col justify-center items-center flex-grow">
        <div
          className="w-full h-full flex justify-center items-center bg-cover bg-center p-4"
          style={{
            backgroundImage: `url(${Background})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh', // Asegura que el contenedor ocupe al menos el 100% de la altura de la pantalla
          }}
        >
          <div className="flex flex-col items-center justify-center text-center p-8 bg-white bg-opacity-70 rounded-lg max-w-lg mx-auto md:max-w-2xl w-full">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Carrito de compras</h1>
            
            <div className="flex justify-between w-full">
              <button
                onClick={() => navigate('/Craft')}
                className="bg-darkyellow text-white px-4 py-2 rounded m-1 hover:bg-lightyellow text-xl font-bold"
              >
                Seguir Comprando
              </button>
              <button
                onClick={() => navigate('/#')}
                className="bg-darkyellow text-white px-4 py-2 rounded m-1 hover:bg-lightyellow text-xl font-bold"
              >
                Finalizar Compra
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};
