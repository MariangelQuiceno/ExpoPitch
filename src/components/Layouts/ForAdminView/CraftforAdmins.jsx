import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import { Header } from '../ForView/Header';
import { Footer } from '../ForView/Footer';
import ProductoContext from '../../../Context/contextProducto';
import Select from 'react-select';
import { useParams } from 'react-router-dom';
import imgPrueba from '../../../assets/ruana.jpg'

export const CraftforAdmins = () => {
  const { productos, setProductos } = useContext(ProductoContext);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500);
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(true);
  const [categoriasOptions, setCategoriasOptions] = useState([]);
  const [formData, setFormData] = useState({
    categoria: '',
    empresasSeleccionadas: [],
    codigoempresa: '',
    publicadoPor: ''
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedProduct, setSelectedProduct] = useState(null);


  useEffect(() => {
  const getProductosByIdAdministrador = async () => {
    if (!userId) {
      setError('Usuario no autenticado');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://checkpoint-9tp4.onrender.com/api/producto/obtenerPorAdministrador/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Error al obtener productos');
      const result = await response.json();

      const productosArray = Array.isArray(result[0]) ? result[0] : [];
      console.log('Datos de productos obtenidos:', productosArray); 
      setProductos(productosArray);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  getProductosByIdAdministrador();
}, [userId, setProductos]);


  useEffect(() => {
    // Simulando la obtención de categorías
    const fetchCategorias = () => {
      // Aquí debes reemplazar esto con la lógica para obtener las categorías reales
      const categorias = [
        { value: 'joyeria', label: 'Joyería' },
        { value: 'ropa_y_accesorios', label: 'Ropa y Accesorios' },
        { value: 'ceramica', label: 'Cerámica' },
        { value: 'muebles', label: 'Muebles' },
        { value: 'decoracion', label: 'Decoración' },
        { value: 'arte_textil', label: 'Arte Textil' },
        { value: 'productos_de_madera', label: 'Productos de Madera' },
        { value: 'cosmeticos_y_cuidado_personal', label: 'Cosméticos y Cuidado Personal' },
        { value: 'papeleria_y_libros', label: 'Papelería y Libros' },
        { value: 'articulos_para_el_hogar', label: 'Artículos para el Hogar' },
        { value: 'juguetes_y_juegos', label: 'Juguetes y Juegos' },
        { value: 'instrumentos_musicales', label: 'Instrumentos Musicales' },
        { value: 'productos_ecologicos', label: 'Productos Ecológicos' },
        { value: 'productos_para_mascotas', label: 'Productos para Mascotas' },
        { value: 'otro', label: 'Otro' },
    ];
    
    setCategoriasOptions(categorias);
    
    };

    fetchCategorias();
  }, []);

  const handleSelectChange = (selectedOptions, actionMeta) => {
    if (actionMeta.name === 'categoria') {
      setFormData(prevData => ({
        ...prevData,
        categoria: selectedOptions ? selectedOptions.value : ''
      }));
    } else if (actionMeta.name === 'codigoempresa') {
      const empresasSeleccionadas = selectedOptions ? selectedOptions.map(option => option.value) : [];
      const selectedEmpresa = selectedOptions ? selectedOptions[0] : null; // Tomar la primera empresa seleccionada
      const codigoempresa = empresasSeleccionadas.length > 0 ? empresasSeleccionadas[0] : '';
      const publicadoPor = selectedEmpresa ? selectedEmpresa.label : ''; // Obtener el nombre de la empresa seleccionada

      setFormData(prevData => ({
        ...prevData,
        empresasSeleccionadas: empresasSeleccionadas,
        codigoempresa: codigoempresa,
        publicadoPor: publicadoPor // Actualizar el campo publicadoPor
      }));
    }
  };

  useEffect(() => {
    filterProducts();
  }, [searchTerm, category, minPrice, maxPrice, selectedCompany, productos, isCheckboxChecked]);

  const filterProducts = () => {
    const filtered = productos.filter(product => {
      if (!product || typeof product !== 'object') return false;

      const {
        nombre = '',
        descripcion = '',
        categoria = '',
        precio = 0,
        publicadoPor = ''
      } = product;

      // Conversión a número para manejar el precio
      const numericPrecio = Number(precio);

      return (
        (nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
         descripcion.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (category === 'all' || categoria === category) &&
        (isCheckboxChecked || (numericPrecio >= minPrice && numericPrecio <= maxPrice)) &&
        (selectedCompany === 'all' || publicadoPor === selectedCompany)
      );
    });

    setFilteredProducts(filtered);
  };

  const toggleFilter = () => setIsFilterOpen(prev => !prev);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleCategoryChange = (e) => setCategory(e.target.value);

  const handlePriceChange = () => filterProducts();

  const handleCompanyChange = (e) => setSelectedCompany(e.target.value);

  const handleEdit = (idProducto) => navigate(`/updateProduct/${idProducto}`);

  const handleDelete = async (idProducto) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        const response = await fetch(`https://checkpoint-9tp4.onrender.com/api/producto/eliminar/${idProducto}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
  
        if (!response.ok) {
          const errorDetails = await response.json();
          throw new Error(`Error ${response.status}: ${errorDetails.message || 'No details available'}`);
        }
  
        setProductos(prevProductos => prevProductos.filter(product => product.idProducto !== idProducto));
      } catch (err) {
        setError(`Failed to delete product: ${err.message}`);
      }
    }
  };
  

  const handleCardClick = (idProducto) => {
    navigate(`/productDetails/${idProducto}`);
  };

  const companies = Array.from(new Set(productos.map(product => product.publicadoPor)));

  // Función para formatear precios
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO').format(price);
  };


  // Función para formatear nombres de categoría
  const formatCategoryName = (category) => {
    return category.replace(/_/g, ' ').toLowerCase();
  };

  const extractImageNames = () => {
    filteredProducts.forEach(product => {
      if (product.urlProductoImg) {
        // Extraer el nombre del archivo de la URL
        const imageName = product.urlProductoImg.split('/').pop();
        // Construir la URL completa de la imagen
        const fullImageUrl = `https://imagenes224.blob.core.windows.net/imagenes224/${imageName}`;
        console.log(fullImageUrl);
      }
    });
  };

  const handleAddProduct = () => {
    navigate('/CreateProduct');
  };
  
  
  // Llama a la función después de que los productos estén cargados y filtrados
  useEffect(() => {
    if (filteredProducts.length > 0) {
      extractImageNames();
    }
  }, [filteredProducts]);

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };


  return (
  <div className="flex flex-col min-h-screen bg-gray-200">
    <Header />
    <div className="flex flex-col md:flex-row flex-1">
      <div className={`md:w-1/4 lg:w-1/5 bg-white border rounded-lg overflow-hidden shadow-md p-4 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Filtros</h2>
          <button onClick={toggleFilter} className="text-darkyellow text-xl">
            
          </button>
        </div>
        <div>
          <div className="flex items-center mb-4">
            <label htmlFor="search" className="block text-sm font-bold mb-2 "></label>
            <div className="relative flex-1">
              <input
                type="text"
                id="search"
                value={searchTerm}
                placeholder="Escriba el nombre de lo que busca..."
                onChange={handleSearchChange}
                className="shadow border rounded w-full py-2 px-3 pr-12"
              />
              <div className="absolute inset-y-0 right-0 flex items-center px-2">
                <FaSearch className="text-darkpurple" />
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-black text-sm font-bold mb-2" htmlFor="categoria">
              Categoría
            </label>
            <Select
              id="categoria"
              name="categoria"
              options={categoriasOptions}
              className="basic-single"
              classNamePrefix="select"
              placeholder="Seleccionar Categoría"
              value={categoriasOptions.find(option => option.value === formData.categoria)}
              onChange={handleSelectChange}
            />
            {errors.categoria && <p className="text-red-500 text-xs italic">{errors.categoria}</p>}
          </div>
          <label htmlFor="price" className="block text-sm font-bold mb-2">Rango de Precio</label>
          <div className="flex items-center mb-4">
            <input
              type="number"
              min="0"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              className="shadow border rounded w-full py-2 px-3 mr-2"
            />
            <span className="text-gray-500">a</span>
            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="shadow border rounded w-full py-2 px-3 ml-2"
            />
          </div>
          <label htmlFor="company" className="block text-sm font-bold mb-2">Empresa</label>
          <select id="company" value={selectedCompany} onChange={handleCompanyChange} className="shadow border rounded w-full py-2 px-3">
            <option value="all">Todas</option>
            {companies.map((company, index) => (
              <option key={index} value={company}>{company}</option>
            ))}
          </select>
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="checkbox"
              checked={isCheckboxChecked}
              onChange={() => setIsCheckboxChecked(!isCheckboxChecked)}
              className="absolute opacity-0"
            />
          </div>
        </div>
      </div>
      <div className="flex-1 p-4 ">
      
        {loading ? (
          <p>Espere un segundo cargando productos...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Productos</h2>
                <button
                  onClick={() => navigate('/createProduct')}
                  className="text-darkyellow text-xl flex items-center"
                >
                  <FaPlus className="mr-2" /> Crear Artesanía
                </button>
              </div>
            <div className="flex justify-between items-center mb-4">                  
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <div key={product.idProducto} className="bg-white border rounded-lg shadow-md p-4 flex flex-col">
                  <img
  src={`https://imagenes224.blob.core.windows.net/imagenes224/${product.urlProductoImg.split('/').pop()}`}
  alt={product.nombre}
  className="product-image"
/>
                  <h3 className="text-xl font-semibold mb-2">{product.nombre}</h3>
                  <p className="text-gray-700 mb-2">{product.descripcion}</p>
                  <p className="text-gray-600 mb-2">Categoria: {formatCategoryName(product.categoria)}</p>
                  <p className="text-gray-600 mb-2">Publicado por: {product.publicadoPor}</p>
                  <p className="text-gray-900 font-bold mb-2">Precio: {formatPrice(product.precio)}</p>
                  <p className="text-gray-500 mb-2">ID Producto: {product.idProducto}</p>
                  <div className="flex justify-between mt-auto">
                    <button
                      onClick={() => handleEdit(product.idProducto)}
                      className="text-darkyellow hover:text-lightyellow text-2xl"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(product.idProducto)}
                      className="text-darkpurple hover:text-lightpurple text-2xl"
                    >
                      <FaTrash /> 
                    </button>
                    
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(product);
                    }}
                    className="mt-4 bg-darkyellow text-white py-2 px-4 rounded"
                  >
                    Ver Detalles
                  </button>
                </div>
                
                
              ))}
            
            </div>
          </div>
        )}
      </div>
    </div>
    <Footer />
{/* Modal */}
{isModalOpen && selectedProduct && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-3xl">
      <h2 className="text-xl font-bold mb-4">Detalles del producto</h2>
      <div className="flex flex-col md:flex-row">
        {/* Imagen */}
        <div className="relative w-full md:w-1/2 h-48 md:h-auto mb-4 md:mb-0">
          <img
            src={selectedProduct.urlProductoImg ? `https://imagenes224.blob.core.windows.net/imagenes224/${selectedProduct.urlProductoImg.split('/').pop()}` : imgPrueba}
            alt={selectedProduct.nombre}
            className="w-full h-full object-contain"
          />
        </div>
        {/* Texto */}
        <div className="md:ml-4 flex-1">
          <h3 className="text-lg font-semibold">{selectedProduct.nombre}</h3>
          <p className="text-gray-600">Categoría: {formatCategoryName(selectedProduct.categoria)}</p>
          <p className="text-gray-600">Publicado por: {selectedProduct.publicadoPor}</p>
          <p className="text-lg font-bold">COP {formatPrice(selectedProduct.precio)}</p>
          <p className="mt-2">{selectedProduct.descripcion}</p>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button onClick={closeModal} className="bg-darkpurple text-white px-4 py-2 rounded hover:bg-lightpurple">
          Cerrar
        </button>
      </div>
    </div>
  </div>
)}

  </div>
);
};