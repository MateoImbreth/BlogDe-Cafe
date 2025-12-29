// theme.js - Sistema de tema claro/oscuro

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // 1. CREAR BOTÓN DE CAMBIO DE TEMA
    // ============================================
    
    const themeToggle = document.createElement('button');
    themeToggle.id = 'theme-toggle';
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Cambiar tema');
    themeToggle.innerHTML = `
        <svg class="theme-icon theme-icon--sun" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <svg class="theme-icon theme-icon--moon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: none;">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
    `;
    
    document.body.appendChild(themeToggle);

    // ============================================
    // 2. VERIFICAR TEMA GUARDADO
    // ============================================
    
    const savedTheme = localStorage.getItem('blog-cafe-theme') || 'light';
    
    if (savedTheme === 'dark') {
        enableDarkMode();
    }

    // ============================================
    // 3. FUNCIÓN PARA ACTIVAR MODO OSCURO
    // ============================================
    
    function enableDarkMode() {
        document.body.classList.add('dark-theme');
        
        // Cambiar iconos
        const sunIcon = themeToggle.querySelector('.theme-icon--sun');
        const moonIcon = themeToggle.querySelector('.theme-icon--moon');
        
        if (sunIcon && moonIcon) {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
        
        // Guardar preferencia
        localStorage.setItem('blog-cafe-theme', 'dark');
        
        // Aplicar estilos específicos del tema oscuro
        applyDarkThemeStyles();
    }

    // ============================================
    // 4. FUNCIÓN PARA ACTIVAR MODO CLARO
    // ============================================
    
    function enableLightMode() {
        document.body.classList.remove('dark-theme');
        
        // Cambiar iconos
        const sunIcon = themeToggle.querySelector('.theme-icon--sun');
        const moonIcon = themeToggle.querySelector('.theme-icon--moon');
        
        if (sunIcon && moonIcon) {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
        
        // Guardar preferencia
        localStorage.setItem('blog-cafe-theme', 'light');
        
        // Remover estilos del tema oscuro
        removeDarkThemeStyles();
    }

    // ============================================
    // 5. APLICAR ESTILOS DE TEMA OSCURO
    // ============================================
    
    function applyDarkThemeStyles() {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('blog-cafe-theme', 'dark');
    }

    // ============================================
    // 6. REMOVER ESTILOS DE TEMA OSCURO
    // ============================================
    
    function removeDarkThemeStyles() {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('blog-cafe-theme', 'light');
    }
    // ============================================
    // 7. EVENTO DE CAMBIO DE TEMA
    // ============================================
    
    themeToggle.addEventListener('click', function() {
        const isDark = document.body.classList.contains('dark-theme');
        
        // Animación del botón
        this.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            this.style.transform = 'rotate(0deg)';
        }, 300);
        
        if (isDark) {
            enableLightMode();
        } else {
            enableDarkMode();
        }
    });

    // ============================================
    // 8. DETECTAR PREFERENCIA DEL SISTEMA
    // ============================================
    
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Si no hay tema guardado, usar preferencia del sistema
    if (!localStorage.getItem('blog-cafe-theme')) {
        if (prefersDarkScheme.matches) {
            enableDarkMode();
        }
    }
    
    // Escuchar cambios en la preferencia del sistema
    prefersDarkScheme.addEventListener('change', function(e) {
        if (!localStorage.getItem('blog-cafe-theme')) {
            if (e.matches) {
                enableDarkMode();
            } else {
                enableLightMode();
            }
        }
    });

});

// ============================================
// 10. ESTILOS CSS PARA EL BOTÓN DE TEMA
// ============================================

const style = document.createElement('style');
style.textContent = `
    .theme-toggle {
        position: fixed;
        bottom: 100px;
        right: 30px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #784d3c, #a67c52);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        box-shadow: 0 4px 15px rgba(120, 77, 60, 0.4);
        transition: all 0.3s ease;
        z-index: 999;
    }

    .theme-toggle:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(120, 77, 60, 0.6);
    }

    .theme-toggle:active {
        transform: scale(0.95);
    }

    .theme-icon {
        transition: opacity 0.3s ease;
    }

    /* Tema oscuro */
    body.dark-theme {
        background-color: #1a1a1a;
        color: #e1e1e1;
    }

    body.dark-theme .header::before {
        background: rgba(0, 0, 0, 0.7);
    }

    body.dark-theme h1, 
    body.dark-theme h2, 
    body.dark-theme h3, 
    body.dark-theme h4 {
        color: #ffffff;
    }

    body.dark-theme a {
        color: #e1e1e1;
    }

    body.dark-theme .entrada,
    body.dark-theme .widget-curso,
    body.dark-theme .curso,
    body.dark-theme .valor-card,
    body.dark-theme .relacionada-card,
    body.dark-theme .entrada-blog,
    body.dark-theme .formulario-contenedor,
    body.dark-theme .sobre-nosotros {
        background-color: #2a2a2a;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }

    body.dark-theme .campo__field {
        background-color: #2a2a2a;
        color: #ffffff;
        border-color: #444444;
    }

    body.dark-theme .campo__label {
        color: #e1e1e1;
    }

    body.dark-theme .footer {
        background-color: #0a0a0a;
    }

    @media (max-width: 768px) {
        .theme-toggle {
            width: 50px;
            height: 50px;
            bottom: 80px;
            right: 20px;
        }
    }
`;
document.head.appendChild(style);