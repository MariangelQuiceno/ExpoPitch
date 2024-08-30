import React, { useEffect, useState, useContext } from 'react';
import { useEmpresa } from '../../../Context/contextEmpresa';
import ProductoContext from '../../../Context/contextProducto';
import { Header } from '../ForView/Header';
import { NavLink } from 'react-router-dom';
import { Footer } from '../ForView/Footer';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import banner from '../../../assets/FondoMenu.png'; 
import { FaCoffee } from "react-icons/fa";

export const CompaniesComprador = () => {
    const { empresas, setEmpresas } = useEmpresa();
    const { getProductosByCodigoEmpresa } = useContext(ProductoContext);
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [selectedEmpresa, setSelectedEmpresa] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            console.log('User ID encontrado en localStorage:', storedUserId);
            setUserId(storedUserId);
            fetchEmpresas(storedUserId);
        } else {
            console.log('No se encontró User ID en localStorage');
        }
    }, []);

    useEffect(() => {
        if (selectedEmpresa) {
            getProductosByCodigoEmpresa(selectedEmpresa.codigoempresa);
        }
    }, [selectedEmpresa]);

    const fetchEmpresas = async (idadministrador) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token de autenticación no encontrado');
            }
            
            const response = await fetch(`https://backtesteo.onrender.com/api/empresa/consultarPorAdministrador/${idadministrador}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Token de autenticación inválido o expirado');
                }
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const contentType = response.headers.get("content-type");

            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await response.json();
                console.log('Datos recibidos del servidor:', data);

                if (Array.isArray(data) && Array.isArray(data[0])) {
                    const empresas = data[0];
                    setEmpresas(empresas);
                } else {
                    throw new Error('Formato de datos inesperado');
                }
            } else {
                const text = await response.text();
                console.error('Respuesta no es JSON:', text);
                throw new Error('Respuesta no es JSON');
            }
        } catch (error) {
            console.error('Error al obtener empresas:', error.message);
        }
    };

    useEffect(() => {
        if (selectedEmpresa) {
            console.log(`Empresa seleccionada: ${selectedEmpresa.nombre}`);
        }
    }, [selectedEmpresa]);

    const viewEmpresa = (empresa) => {
        setSelectedEmpresa(empresa);
    };

    const closeEmpresaModal = () => {
        setSelectedEmpresa(null);
    };

    const handleUpdate = (empresa) => {
        navigate(`/UpdateCompany/${empresa.codigoempresa}`);
    };
    

    const handleDelete = async (codigoempresa) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token de autenticación no encontrado');
            }
            
            const response = await fetch(`https://backtesteo.onrender.com/api/empresa/eliminar/${codigoempresa}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Token de autenticación inválido o expirado');
                }
                // Verifica el mensaje de error en el cuerpo de la respuesta si está disponible
                const errorResponse = await response.json();
                if (errorResponse.message) {
                    setError(`Error: ${errorResponse.message}`);
                } else {
                    setError('No se pudo eliminar la empresa. Inténtelo de nuevo más tarde.');
                }
                return; // Salir de la función si hubo un error
            }

            // Si todo salió bien, actualiza el estado
            setEmpresas(empresas.filter(emp => emp.codigoempresa !== codigoempresa));
            setError(''); // Limpiar el mensaje de error en caso de éxito
        } catch (error) {
            console.error('Error al eliminar empresa:', error.message);
            setError('Error: Hay productos previamente registrados en la página'); // Establecer el mensaje de error específico
        }
    };

    return (
        <div>
            <div className="flex flex-col min-h-screen bg-gray-200">
                <Header />
                <div className="container mx-auto my-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    <div className="bg-white border rounded-lg overflow-hidden shadow-md flex flex-col items-center p-4 cursor-pointer mb-4">
                        <div className="flex flex-col items-center">
                            <span className="text-black text-sm text-center">
                                COMPRADOR<br /><br />
                                Recuerde, no puede borrar una empresa con productos anteriormente registrados en esta, deberá cambiar los productos de empresa o eliminarlos primero.<br />
                                <br />
                                ¡Tenga un feliz día!
                            </span>
                        </div>
                    </div>
                    {empresas.length === 0 ? (
                        <div className="bg-white border rounded-lg overflow-hidden shadow-md flex flex-col items-center p-4 cursor-pointer">
                            <div className="flex flex-col items-center">
                                <span className="text-black text-sm text-center">No hay empresas para mostrar</span>
                            </div>
                        </div>
                    ) : (
                        empresas.map((empresa) => (
                            <div
                                key={empresa.codigoempresa}
                                className="bg-white border rounded-lg overflow-hidden shadow-md cursor-pointer flex flex-col items-center p-4"
                                onClick={() => viewEmpresa(empresa)}
                            >
                                <h3 className="text-lg font-semibold mb-2 text-center">{empresa.nombre}</h3>
                                <p className="text-center underline text-darkyellow">{empresa.direccion}</p>
                                <p className="text-center line-clamp-5">{empresa.descripcion}</p>
                                <p className="text-center text-gray-600">ID: {empresa.codigoempresa}</p>
                                <div className="flex gap-32 mt-4">
                                    <button
                                        className="text-darkyellow hover:text-lightyellow text-3xl"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleUpdate(empresa);
                                        }}
                                    >
                                        <FaEdit className="text-xl" />
                                    </button>
                                    <button
                                        className="text-darkpurple hover:text-lightpurple text-3xl"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(empresa.codigoempresa);
                                        }}
                                    >
                                        <FaTrash className="text-xl" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                    <div className="bg-white border rounded-lg overflow-hidden shadow-md flex flex-col items-center p-4 cursor-pointer">
                        <div className="flex flex-col items-center" onClick={() => navigate('/LoginCompanies')}>
                            <svg
                                className="w-8 h-8 mb-2 text-darkyellow"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 4v16m8-8H4"
                                ></path>
                            </svg>
                            <span className="text-black text-sm text-center">Agregar una empresa nueva</span>
                            <NavLink to="/LoginCompanies" className="text-darkyellow hover:underline text-sm ml-2">
                                Registrar Empresa
                            </NavLink>
                        </div>
                    </div>
                </div>
                {/* Mostrar mensaje de error si hay uno */}
                {error && (
                    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-brown-600 bg-darkyellow text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
                        <svg className="w-6 h-6 mr-2 text-2xl text-white"> <FaCoffee /> </svg>
                        <span> ¡Aún hay productos registrados en la empresa!</span>
                        <button
                            className="ml-4 bg-darkyellow text-white hover:text-gray-200"
                            onClick={() => setError('')}
                        >
                            <FaTimes className="w-5 h-5" />
                        </button>
                    </div>
                )}
                {selectedEmpresa && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                            <div className="relative w-full h-40 bg-gray-300 rounded-t-lg overflow-hidden">
                                <img
                                    src={banner} // Usar la imagen importada
                                    alt="Banner de Empresa"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 ">
                                    <h2 className="text-white text-xl font-bold">{selectedEmpresa.nombre}</h2>
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-center">Información de la empresa</h3>
                            <p className="text-center mb-2"><strong className='text-darkyellow'>Dirección: </strong>{selectedEmpresa.direccion}</p>
                            <p className="text-center mb-4"><strong className='text-darkyellow'>Descripción: </strong>{selectedEmpresa.descripcion}</p>
                            <div className="flex justify-center">
                                <button
                                    className="bg-darkyellow text-white px-4 py-2 rounded mr-2"
                                    onClick={() => navigate(`/CreateProduct`)}
                                >
                                    Agregar Producto
                                </button>
                                <button
                                    className="bg-gray-500 text-white px-4 py-2 rounded"
                                    onClick={closeEmpresaModal}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};
