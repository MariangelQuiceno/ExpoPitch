import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from '../../../assets/Artesanías.png';
import BackgroundImage from '../../../assets/FondoHeader.jpg';

export const Header = () => {
  const navigate = useNavigate();
  
  // Obtener el tipo de usuario del localStorage, o 'anonimo' si no existe
  const userType = localStorage.getItem('userType') || 'anonimo';

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <header 
      className="header bg-white shadow p-4 flex flex-col items-center md:flex-row md:justify-between" 
      style={{ 
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="logo-container flex items-center justify-center mx-4 md:mx-8">
        <a href="/#" onClick={handleLogoClick}>
          <img src={Logo} alt="Logo" className="logo h-16 md:h-24 w-16 md:w-24" />
        </a>
      </div>
      <nav className="nav-links flex flex-col items-center md:flex-row md:space-x-4 mt-4 md:mt-0">
        <NavLink 
          to="/#" 
          className="nav-link text-white text-lg font-semibold hover:text-darkyellow mb-2 md:mb-0" 
          activeClassName="font-bold"
        >
          Inicio
        </NavLink>
        <NavLink 
          to="/Menu" 
          className="nav-link text-white text-lg font-semibold hover:text-darkyellow mb-2 md:mb-0" 
          activeClassName="font-bold"
        >
          Menú
        </NavLink>
        {userType === 'comprador' || userType === 'anonimo' ? (
          <>
            <NavLink 
              to="/Cart" 
              className="nav-link text-white text-lg font-semibold hover:text-darkyellow mb-2 md:mb-0" 
              activeClassName="font-bold"
            >
              Carrito
            </NavLink>
            <NavLink 
              to="/CraftComprador" 
              className="nav-link text-white text-lg font-semibold hover:text-darkyellow mb-2 md:mb-0" 
              activeClassName="font-bold"
            >
              Artesanías
            </NavLink>
            <NavLink 
              to="/CompaniesComprador" 
              className="nav-link text-white text-lg font-semibold hover:text-darkyellow mb-2 md:mb-0" 
              activeClassName="font-bold"
            >
              Empresas
            </NavLink>
            <NavLink 
              to="/EventsComprador" 
              className="nav-link text-white text-lg font-semibold hover:text-darkyellow mb-2 md:mb-0" 
              activeClassName="font-bold"
            >
              Eventos
            </NavLink>
          </>
        ) : null}
        {userType === 'administrador' || userType === 'empleado' ? (
          <>
            <NavLink 
              to="/CraftforAdmins" 
              className="nav-link text-white text-lg font-semibold hover:text-darkyellow mb-2 md:mb-0" 
              activeClassName="font-bold"
            >
              Artesanías
            </NavLink>
            <NavLink 
              to="/CompaniesForAdmin" 
              className="nav-link text-white text-lg font-semibold hover:text-darkyellow mb-2 md:mb-0" 
              activeClassName="font-bold"
            >
              Empresas
            </NavLink>
            
            <NavLink 
              to="/EventsForAdmin" 
              className="nav-link text-white text-lg font-semibold hover:text-darkyellow mb-2 md:mb-0" 
              activeClassName="font-bold"
            >
              Eventos
            </NavLink>
          </>
        ) : null}
      </nav>
      <div className="flex justify-center mt-4 md:mt-0">
        <button
          className="login-button bg-darkpurple text-white px-4 py-2 rounded hover:bg-lightpurple mx-4 md:mx-8"
          onClick={handleLoginClick}
        >
          Iniciar Sesión
        </button>
      </div>
    </header>
  );
};
