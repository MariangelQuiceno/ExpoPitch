// src/components/Main.js
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import HeaderImage from '../../../assets/Cabecera.png';
import { InformationMain } from '../InformationMain';
import { Statistics } from '../HomePage/Statistics'; // Importa el nuevo componente de estadísticas
import imageEarring from '../../../assets/AretesArtesanales.jpg';
import imageRuana from '../../../assets/RuanaArtesanal.jpg';
import imageBracelet from '../../../assets/PulserasArtesanales.jpg';
import imageBag from '../../../assets/BolsoArtesanal.jpg';

export const Main = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="min-h-screen bg-gray-200">
      <section className="flex flex-col md:flex-row p-4 md:p-8 bg-gray-200">
        <div className="w-full md:w-1/2 flex justify-center items-center mb-4 md:mb-0">
          <img src={HeaderImage} alt="HeaderMain" className="block mx-auto max-w-full h-auto" />
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center items-center">
          <div className="container mx-auto px-4 flex flex-col items-center">
            <h1 className="text-2xl md:text-4xl font-bold mb-4 text-center">
              COFFE ART
            </h1>
            <p className="text-sm md:text-lg text-center px-2 md:px-8 py-2 max-w-3xl">
            Buscamos poner en valor y resaltar el incuestionable y valioso trabajo de los artesanos, promoviendo activamente sus productos únicos y auténticos, que son verdaderas expresiones de su arte y habilidades. Además, como una parte integral de nuestra misión, ofrecemos procesos y métodos diseñados para mejorar y ayudar en la gestión de sus negocios. 
            </p>
          </div>
        </div>
      </section>

      <div className="bg-darkpurple py-8">
        <div className="container mx-auto px-4 text-center">
          <Slider {...settings}>
            {InformationMain.map((item) => (
              <div key={item.id} className="p-4 bg-purple text-center relative">
                <h2 className="text-darkyellow text-2xl md:text-4xl font-bold">{item.title}</h2>
                <p className="text-white text-sm md:text-lg m-4">{item.description}</p>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      <Statistics /> {/* Usa el nuevo componente aquí */}

      <div className="bg-gray-200 py-16">
        <div className="text-center mb-10 px-4">
          <h1 className="text-black text-2xl md:text-4xl font-bold mb-6">PRODUCTOS MÁS VENDIDOS</h1>
          <p className="text-black text-sm md:text-lg mx-auto max-w-2xl mb-12">
            Nuestros "Productos Más Vendidos" ofrecen una visión clave de las preferencias de nuestros clientes y las tendencias actuales del mercado. Esta sección destaca los productos que han sido los más solicitados en el último período, proporcionando información valiosa sobre qué artículos están atrayendo más atención y demanda.
          </p>
        </div>
        <div className="flex flex-wrap justify-center">
          {[
            { image: imageEarring, title: 'Aretes Artesanales', description: 'Descripción de los aretes artesanales...' },
            { image: imageRuana, title: 'Ruana Artesanal', description: 'Descripción de la ruana artesanal...' },
            { image: imageBracelet, title: 'Pulseras Artesanales', description: 'Descripción de las pulseras artesanales...' },
            { image: imageBag, title: 'Bolso Artesanal', description: 'Descripción del bolso artesanal...' },
          ].map((product, index) => (
            <div key={index} className="bg-darkyellow text-white rounded-lg p-4 shadow-md text-center flex flex-col justify-center items-center mx-2 mb-6 w-48 sm:w-64 lg:w-80">
              <img src={product.image} alt={product.title} className="w-24 h-auto sm:w-32 lg:w-40" />
              <h3 className="text-lg font-bold mt-2">{product.title}</h3>
              <p className="text-sm mt-1">{product.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
