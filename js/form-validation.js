// form-validation.js - Validación del formulario de contacto

document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('contacto-formulario');
    if (!formulario) return;

    const nombreInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const mensajeInput = document.getElementById('mensaje');
    const submitBtn = document.getElementById('enviar-btn');
    const formularioExito = document.getElementById('formulario-exito');

    // Expresiones regulares para validación
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/;

    // Función para mostrar errores
    function mostrarError(input, mensaje) {
        const errorSpan = document.getElementById(`${input.id}-error`);
        if (errorSpan) {
            errorSpan.textContent = mensaje;
        }
        input.classList.add('error');
        input.style.borderColor = '#e74c3c';
    }

    // Función para limpiar errores
    function limpiarError(input) {
        const errorSpan = document.getElementById(`${input.id}-error`);
        if (errorSpan) {
            errorSpan.textContent = '';
        }
        input.classList.remove('error');
        input.style.borderColor = '';
    }

    // Validación en tiempo real del nombre
    nombreInput.addEventListener('input', function() {
        limpiarError(this);
        
        if (this.value.trim() === '') {
            return;
        }
        
        if (this.value.trim().length < 2) {
            mostrarError(this, 'El nombre debe tener al menos 2 caracteres');
        } else if (this.value.trim().length > 50) {
            mostrarError(this, 'El nombre no puede exceder 50 caracteres');
        } else if (!regexNombre.test(this.value.trim())) {
            mostrarError(this, 'El nombre solo puede contener letras y espacios');
        }
    });

    // Validación en tiempo real del email
    emailInput.addEventListener('input', function() {
        limpiarError(this);
        
        if (this.value.trim() === '') {
            return;
        }
        
        if (!regexEmail.test(this.value.trim())) {
            mostrarError(this, 'Por favor ingresa un email válido');
        }
    });

    // Validación en tiempo real del mensaje
    mensajeInput.addEventListener('input', function() {
        limpiarError(this);
        
        if (this.value.trim() === '') {
            return;
        }
        
        if (this.value.trim().length < 10) {
            mostrarError(this, 'El mensaje debe tener al menos 10 caracteres');
        } else if (this.value.trim().length > 500) {
            mostrarError(this, 'El mensaje no puede exceder 500 caracteres');
        }
    });

    // Validación al perder el foco
    nombreInput.addEventListener('blur', function() {
        if (this.value.trim() === '') {
            mostrarError(this, 'El nombre es requerido');
        }
    });

    emailInput.addEventListener('blur', function() {
        if (this.value.trim() === '') {
            mostrarError(this, 'El email es requerido');
        }
    });

    mensajeInput.addEventListener('blur', function() {
        if (this.value.trim() === '') {
            mostrarError(this, 'El mensaje es requerido');
        }
    });

    // Función para validar todo el formulario
    function validarFormulario() {
        let isValid = true;

        // Validar nombre
        if (nombreInput.value.trim() === '') {
            mostrarError(nombreInput, 'El nombre es requerido');
            isValid = false;
        } else if (nombreInput.value.trim().length < 2) {
            mostrarError(nombreInput, 'El nombre debe tener al menos 2 caracteres');
            isValid = false;
        } else if (!regexNombre.test(nombreInput.value.trim())) {
            mostrarError(nombreInput, 'El nombre solo puede contener letras y espacios');
            isValid = false;
        }

        // Validar email
        if (emailInput.value.trim() === '') {
            mostrarError(emailInput, 'El email es requerido');
            isValid = false;
        } else if (!regexEmail.test(emailInput.value.trim())) {
            mostrarError(emailInput, 'Por favor ingresa un email válido');
            isValid = false;
        }

        // Validar mensaje
        if (mensajeInput.value.trim() === '') {
            mostrarError(mensajeInput, 'El mensaje es requerido');
            isValid = false;
        } else if (mensajeInput.value.trim().length < 10) {
            mostrarError(mensajeInput, 'El mensaje debe tener al menos 10 caracteres');
            isValid = false;
        } else if (mensajeInput.value.trim().length > 500) {
            mostrarError(mensajeInput, 'El mensaje no puede exceder 500 caracteres');
            isValid = false;
        }

        return isValid;
    }

    // Manejo del envío del formulario
    submitBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        // Limpiar errores previos
        limpiarError(nombreInput);
        limpiarError(emailInput);
        limpiarError(mensajeInput);

        // Validar formulario
        if (!validarFormulario()) {
            return;
        }

        // Deshabilitar botón y mostrar estado de carga
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        const textoOriginal = submitBtn.innerHTML;
        submitBtn.innerHTML = 'ENVIANDO... <div class="spinner"></div>';

        // Preparar datos para enviar
        const formData = {
            nombre: nombreInput.value.trim(),
            email: emailInput.value.trim(),
            mensaje: mensajeInput.value.trim(),
            fecha: new Date().toISOString()
        };

        try {
            // Aquí puedes hacer la petición a tu backend FastAPI
            // Ejemplo:
            // const response = await fetch('http://localhost:8000/api/contacto', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(formData)
            // });

            // Por ahora simulamos el envío
            await simularEnvio(formData);

            // Mostrar mensaje de éxito
            formularioExito.classList.add('active');
            
            // Limpiar formulario
            nombreInput.value = '';
            emailInput.value = '';
            mensajeInput.value = '';

            // Ocultar mensaje de éxito después de 5 segundos
            setTimeout(() => {
                formularioExito.classList.remove('active');
            }, 5000);

        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            alert('Hubo un error al enviar el mensaje. Por favor intenta de nuevo.');
        } finally {
            // Rehabilitar botón
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = textoOriginal;
        }
    });

    // Función para simular envío (reemplazar con llamada real a FastAPI)
    function simularEnvio(data) {
        return new Promise((resolve) => {
            console.log('Datos del formulario:', data);
            setTimeout(() => {
                resolve({ success: true });
            }, 1500);
        });
    }

    // Agregar animación al scroll
    const campos = document.querySelectorAll('.campo');
    campos.forEach((campo, index) => {
        campo.style.opacity = '0';
        campo.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            campo.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            campo.style.opacity = '1';
            campo.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// Función auxiliar para conectar con FastAPI cuando esté listo
async function enviarFormularioAPI(formData) {
    const response = await fetch('http://localhost:8000/api/contacto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    });

    if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
    }

    return await response.json();
}