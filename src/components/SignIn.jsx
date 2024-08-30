import React, { useState, useCallback } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import BackgroundImage from '../assets/BackgroundLogin.jpg';
import { FaHome } from 'react-icons/fa';
import Logo from '../../src/assets/Artesanías.png';
import { useAuth } from '../Context/contextAuth';

export const SignIn = () => {
    const navigate = useNavigate();
    const { login, requestPasswordReset, verifyResetCode, resetPassword, notification } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        tipoUsuario: 'administrador',
        code: '',
        newPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [forgotPassword, setForgotPassword] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);
    const [codeVerified, setCodeVerified] = useState(false);

    const handleChange = useCallback((e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value
        }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        // Validación de campos
        if (!formData.email) {
            newErrors.email = 'El correo electrónico es obligatorio';
        }
        if (forgotPassword) {
            if (!verificationSent && !formData.tipoUsuario) {
                newErrors.tipoUsuario = 'El tipo de usuario es obligatorio';
            }
            if (verificationSent && !codeVerified && !formData.code) {
                newErrors.code = 'El código de verificación es obligatorio';
            }
            if (codeVerified && !formData.newPassword) {
                newErrors.newPassword = 'La nueva contraseña es obligatoria';
            }
        } else {
            if (!formData.password) {
                newErrors.password = 'La contraseña es obligatoria';
            }
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                if (forgotPassword) {
                    if (!verificationSent) {
                        const result = await requestPasswordReset(formData.tipoUsuario, formData.email);
                        if (result.success) {
                            setVerificationSent(true);
                            alert(result.message || 'Correo de recuperación enviado');
                        } else {
                            alert(result.error || 'Error en la solicitud de recuperación de contraseña');
                        }
                    } else if (!codeVerified) {
                        const codeResult = await verifyResetCode(formData.tipoUsuario, formData.email, formData.code);
                        if (codeResult.success) {
                            setCodeVerified(true);
                            alert('Código verificado. Ahora puedes establecer una nueva contraseña.');
                        } else {
                            alert(codeResult.error || 'Código de verificación incorrecto');
                        }
                    } else {
                        const resetResult = await resetPassword(formData.tipoUsuario, formData.email, formData.newPassword, formData.code);
                        if (resetResult.success) {
                            alert('Contraseña actualizada con éxito');
                            setForgotPassword(false);
                            setVerificationSent(false);
                            setCodeVerified(false);
                        } else {
                            alert(resetResult.error || 'Error al actualizar la contraseña');
                        }
                    }
                } else {
                    const result = await login(formData.tipoUsuario, formData.email, formData.password);
                    if (result.success) {
                        navigate('/');
                    } else {
                        alert(result.error || 'Error desconocido. Intenta de nuevo.');
                    }
                }
            } catch (error) {
                alert('Hubo un problema al procesar la solicitud. Por favor, intenta de nuevo.');
            }
        } else {
            alert('Por favor corrige los errores en el formulario.');
        }
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen bg-cover bg-center"
            style={{ backgroundImage: `url(${BackgroundImage})` }}
        >
            <NavLink to="/login" className="absolute top-4 left-4">
                <FaHome className="text-darkyellow text-4xl" />
            </NavLink>
            <div className="relative bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-4 sm:mx-8 md:mx-16 lg:mx-32">
                <img src={Logo} alt="Logo" className="h-24 w-24 mx-auto mb-6" />
                <h1 className="text-2xl font-bold mb-6 text-center">
                    {forgotPassword ? 'Recuperar Contraseña' : 'Iniciar Sesión'}
                </h1>
                {notification && (
                    <div className={`border px-4 py-3 rounded relative mb-4 ${notification.startsWith('Error') ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700'}`} role="alert">
                        <span className="block sm:inline">{notification}</span>
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-black text-sm font-bold mb-2" htmlFor="tipoUsuario">
                            Tipo de Usuario
                        </label>
                        <select
                            id="tipoUsuario"
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-darkyellow leading-tight focus:outline-none focus:shadow-outline ${errors.tipoUsuario ? 'border-red-500' : ''}`}
                            value={formData.tipoUsuario}
                            onChange={handleChange}
                            aria-required="true"
                        >
                            <option value="administrador">Administrador</option>
                            <option value="empleado">Empleado</option>
                            <option value="comprador">Comprador</option>
                        </select>
                        {errors.tipoUsuario && <p className="text-red-500 text-xs italic">{errors.tipoUsuario}</p>}
                    </div>
                    {forgotPassword ? (
                        <>
                            <div className="mb-4">
                                <label className="block text-black text-sm font-bold mb-2" htmlFor="email">
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-darkyellow leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
                                    placeholder="Correo Electrónico"
                                    value={formData.email}
                                    onChange={handleChange}
                                    aria-required="true"
                                    disabled={verificationSent}
                                />
                                {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
                            </div>
                            {verificationSent && !codeVerified && (
                                <div className="mb-4">
                                    <label className="block text-black text-sm font-bold mb-2" htmlFor="code">
                                        Código de Verificación
                                    </label>
                                    <input
                                        type="text"
                                        id="code"
                                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-darkyellow leading-tight focus:outline-none focus:shadow-outline ${errors.code ? 'border-red-500' : ''}`}
                                        placeholder="Código de Verificación"
                                        value={formData.code}
                                        onChange={handleChange}
                                        aria-required="true"
                                    />
                                    {errors.code && <p className="text-red-500 text-xs italic">{errors.code}</p>}
                                </div>
                            )}
                            {codeVerified && (
                                <div className="mb-4">
                                    <label className="block text-black text-sm font-bold mb-2" htmlFor="newPassword">
                                        Nueva Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-darkyellow leading-tight focus:outline-none focus:shadow-outline ${errors.newPassword ? 'border-red-500' : ''}`}
                                        placeholder="Nueva Contraseña"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        aria-required="true"
                                    />
                                    {errors.newPassword && <p className="text-red-500 text-xs italic">{errors.newPassword}</p>}
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="mb-4">
                                <label className="block text-black text-sm font-bold mb-2" htmlFor="email">
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-darkyellow leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
                                    placeholder="Correo Electrónico"
                                    value={formData.email}
                                    onChange={handleChange}
                                    aria-required="true"
                                />
                                {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-black text-sm font-bold mb-2" htmlFor="password">
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-darkyellow leading-tight focus:outline-none focus:shadow-outline ${errors.password ? 'border-red-500' : ''}`}
                                    placeholder="Contraseña"
                                    value={formData.password}
                                    onChange={handleChange}
                                    aria-required="true"
                                />
                                {errors.password && <p className="text-red-500 text-xs italic">{errors.password}</p>}
                            </div>
                        </>
                    )}
                    <div className="flex items-center flex-col justify-between">
                        <div className='flex flex-row justify-between min-w-full'>
                        <button
                            type="submit"
                            className="bg-darkyellow hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            {forgotPassword ? (verificationSent ? (codeVerified ? 'Restablecer Contraseña' : 'Verificar Código') : 'Enviar Código') : 'Iniciar Sesión'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setForgotPassword(!forgotPassword)}
                            className="text-darkyellow hover:text-yellow-600 text-sm font-bold"
                        >
                            {forgotPassword ? 'Volver a Iniciar Sesión' : '¿Olvidaste tu Contraseña?'}
                        </button>
                        </div>
                        
                        <p className="mt-4 text-center">
                        ¿Aun no tienes una cuenta?{' '}
                        <NavLink to="/register" className="text-darkyellow hover:underline">
                            Registrate
                        </NavLink>
                    </p>
                    </div>
                </form>
            </div>
        </div>
    );
};