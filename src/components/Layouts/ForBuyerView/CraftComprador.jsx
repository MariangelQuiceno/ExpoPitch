import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { FaPlus, FaSearch, FaStar } from 'react-icons/fa';
import imageEarring from '../../../assets/AretesArtesanales.jpg';
import imageRuana from '../../../assets/RuanaArtesanal.jpg';
import imageBracelet from '../../../assets/PulserasArtesanales.jpg';
import imageBag from '../../../assets/BolsoArtesanal.jpg';
import { Header } from '../ForView/Header';
import { Footer } from '../ForView/Footer';

export const CraftComprador = () => {
  const [cart, setCart] = useState([]);
  const [products] = useState([
    { id: 1, vendedor: 'Vendedor A', producto: 'Producto A', descripcion: 'Descripción del Producto A', stock: 10, precio: 100, imagen: imageEarring, categoria: 'earrings', rating: 4 },
    { id: 2, vendedor: 'Vendedor B', producto: 'Producto B', descripcion: 'Descripción del Producto B', stock: 5, precio: 75, imagen: imageRuana, categoria: 'ruanas', rating: 3 },
    { id: 3, vendedor: 'Vendedor C', producto: 'Producto C', descripcion: 'Descripción del Producto C', stock: 3, precio: 120, imagen: imageBag, categoria: 'bags', rating: 5 },
    { id: 4, vendedor: 'Vendedor D', producto: 'Producto D', descripcion: 'Descripción del Producto D', stock: 8, precio: 90, imagen: imageEarring, categoria: 'earrings', rating: 4 },
    { id: 5, vendedor: 'Vendedor E', producto: 'Producto E', descripcion: 'Descripción del Producto E', stock: 12, precio: 110, imagen: imageBracelet, categoria: 'bracelets', rating: 3 },
    { id: 6, vendedor: 'Vendedor F', producto: 'Producto F', descripcion: 'Descripción del Producto F', stock: 6, precio: 85, imagen: imageEarring, categoria: 'earrings', rating: 5 },
    { id: 7, vendedor: 'Vendedor G', producto: 'Artesanía G', descripcion: 'Descripción de la Artesanía G', stock: 15, precio: 150, imagen: imageRuana, categoria: 'ruanas', rating: 2 },
    { id: 8, vendedor: 'Vendedor H', producto: 'Artesanía H', descripcion: 'Descripción de la Artesanía H', stock: 7, precio: 95, imagen: imageBracelet, categoria: 'bracelets', rating: 4 }
  ]);

  const [filteredProducts, setFilteredProducts] = useState(products);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500);
  const [rating, setRating] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    filterProducts(searchTerm, category, [minPrice, maxPrice], rating);
  }, [searchTerm, category, minPrice, maxPrice, rating, products]);

  const addToCart = (product) => {
    setCart([...cart, product]);
    setProducts(products.map(p => p.id === product.id ? { ...p, stock: p.stock - 1 } : p));
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handlePriceChange = () => {
    filterProducts(searchTerm, category, [minPrice, maxPrice], rating);
  };

  const handleRatingChange = (rating) => {
    setRating(rating);
  };

  const filterProducts = (searchTerm, category, [minPrice, maxPrice], rating) => {
    setFilteredProducts(products.filter(product => {
      const matchesSearch = product.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             product.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === 'all' || product.categoria === category;
      const matchesPrice = product.precio >= minPrice && product.precio <= maxPrice;
      const matchesRating = rating === 0 || product.rating === rating;

      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-200">
      <Header />
      <div className="flex flex-col md:flex-row flex-1">
        {/* Filtro en la esquina izquierda */}
        <div className={`md:w-1/4 lg:w-1/5 bg-white border rounded-lg overflow-hidden shadow-md p-4 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Comprador</h2>
            <button onClick={toggleFilter} className="text-darkyellow text-xl">
              {/* Add icon here if needed */}
            </button>
          </div>
          <div>
            <div className="flex items-center mb-4">
              <label htmlFor="search" className="block text-sm font-bold mb-2"></label>
              <div className="relative flex-1">
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="shadow border rounded w-full py-2 px-3 pr-12"
                />
                <div className="absolute inset-y-0 right-0 flex items-center px-2">
                  <FaSearch className="text-darkpurple" />
                </div>
              </div>
            </div>
            <label htmlFor="category" className="block text-sm font-bold mb-2">Categoría</label>
            <select
              id="category"
              value={category}
              onChange={handleCategoryChange}
              className="shadow border rounded w-full py-2 px-3 mb-4"
            >
              <option value="all">Todos</option>
              <option value="earrings">Aretes</option>
              <option value="ruanas">Ruanas</option>
              <option value="bracelets">Pulseras</option>
              <option value="bags">Bolsos</option>
            </select>
            <label htmlFor="price" className="block text-sm font-bold mb-2">Rango de Precio</label>
            <div className="flex mb-4 items-center">
              <input
                type="number"
                min="0"
                max="500"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                onBlur={handlePriceChange}
                className="shadow border rounded w-1/2 py-2 px-3 mr-2"
              />
              <span> - </span>
              <input
                type="number"
                min="0"
                max="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                onBlur={handlePriceChange}
                className="shadow border rounded w-1/2 py-2 px-3 ml-2"
              />
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span>${minPrice}</span>
              <span>${maxPrice}</span>
            </div>
            <label htmlFor="rating" className="block text-sm font-bold mb-2">Puntuación Exacta</label>
            <div className="flex items-center mb-4">
              {[1, 2, 3, 4, 5].map(star => (
                <FaStar
                  key={star}
                  className={`cursor-pointer ${rating === star ? 'text-darkyellow' : 'text-gray-300'}`}
                  onClick={() => handleRatingChange(star)}
                />
              ))}
              <FaStar
                className={`cursor-pointer ${rating === 0 ? 'text-darkyellow' : 'text-gray-300'}`}
                onClick={() => handleRatingChange(0)}
              />
              <span className="ml-2 text-sm text-gray-600">Todos</span>
            </div>
          </div>
        </div>

        {/* Productos */}
        <div className="flex-1 p-4">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white border rounded-lg overflow-hidden shadow-md flex flex-col items-center p-4">
                <img
                  src={product.imagen}
                  alt={product.producto}
                  className="object-cover h-48 w-full mb-4 cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                />
                <h3 className="text-lg font-semibold mb-2 text-center">{product.producto}</h3>
                <p className="text-center"><strong>Vendedor:</strong> {product.vendedor}</p>
                <p className="text-sm text-darkpurple mb-2 text-center"><strong>Descripción:</strong> {product.descripcion}</p>
                <p className="text-center"><strong>Stock:</strong> {product.stock}</p>
                <p className="text-center"><strong>Precio:</strong> ${product.precio}</p>
                <div className="flex mb-2 justify-center">
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      className={`text-2xl ${index < product.rating ? 'text-darkyellow' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <button
                  className="mt-4 bg-darkyellow hover:bg-lightyellow text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                </button>
              </div>
            ))}
            {/* Contenedor para el enlace "Crear Producto" */}
            <div className="bg-white border rounded-lg overflow-hidden shadow-md flex flex-col items-center p-4 max-w-sm mx-auto">
              <div className="text-center mb-4">
                <FaPlus className="text-darkyellow text-3xl" />
              </div>
              <div className="text-center">
                <span className="text-black text-sm">¿Quieres agregar un nuevo producto?</span>
                <NavLink to="/CreateProduct" className="text-darkyellow hover:underline text-sm ml-2">
                  Crear Producto
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-4">
        <div className="relative">
          <button
            className="bg-darkpurple text-white p-3 rounded-full shadow-md"
            onClick={() => navigate('/cart')}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m.6 8l1.1 5H19m-7-5a2 2 0 100 4 2 2 0 000-4zm-5 2a2 2 0 100 4 2 2 0 000-4z"
              ></path>
            </svg>
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

