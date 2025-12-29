// animations.js - Animaciones al hacer scroll y efectos visuales

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // 1. ANIMACIONES AL HACER SCROLL
    // ============================================
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Opcional: dejar de observar después de la animación
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar todos los elementos con la clase 'scroll-animate'
    const animateElements = document.querySelectorAll('.scroll-animate');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // ============================================
    // 2. ANIMACIÓN DEL HEADER AL HACER SCROLL
    // ============================================
    
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Agregar sombra al header cuando se hace scroll
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });

    // ============================================
    // 3. ANIMACIÓN SMOOTH SCROLL PARA ENLACES
    // ============================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ============================================
    // 4. EFECTO PARALLAX EN EL HEADER
    // ============================================
    
    const headerTexto = document.querySelector('.header__texto');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        if (headerTexto && scrolled < header.offsetHeight) {
            headerTexto.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            let newOpacity = 1 - (scrolled / 700);
            headerTexto.style.opacity = newOpacity  < 0 ? 0 : newOpacity;
        }
    });

    // ============================================
    // 6. ANIMACIÓN DE ENTRADA PARA LOS BOTONES
    // ============================================
    
    const botones = document.querySelectorAll('.boton');
    
    botones.forEach(boton => {
        boton.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // ============================================
    // 7. CONTADOR ANIMADO (PARA NÚMEROS)
    // ============================================
    
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    }

    // Observar elementos con números para animar
    const numberElements = document.querySelectorAll('[data-count]');
    const numberObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-count'));
                animateCounter(entry.target, target);
                numberObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    numberElements.forEach(el => {
        numberObserver.observe(el);
    });

    // ============================================
    // 8. EFECTO DE TYPING EN TÍTULOS (OPCIONAL)
    // ============================================
    
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // ============================================
    // 9. PROGRESO DE LECTURA (BARRA SUPERIOR)
    // ============================================
    
    function createReadingProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.id = 'reading-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 4px;
            background: linear-gradient(90deg, #784d3c, #a67c52);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', function() {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.pageYOffset;
            const progress = (scrolled / documentHeight) * 100;
            
            progressBar.style.width = progress + '%';
        });
    }

    // Activar la barra de progreso solo en páginas de entrada/artículos
    if (document.querySelector('.entrada-blog')) {
        createReadingProgressBar();
    }

    // ============================================
    // 10. ANIMACIÓN DE CARGA INICIAL
    // ============================================
    
    // Animar elementos al cargar la página
    setTimeout(function() {
        const header = document.querySelector('.header__texto');
        if (header) {
            header.style.animation = 'fadeIn 1s ease-out';
        }
    }, 100);

    // ============================================
    // 11. LAZY LOADING MEJORADO PARA IMÁGENES
    // ============================================
    
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.transition = 'opacity 0.5s ease';               
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ============================================
    // 12. DETECCIÓN DE DISPOSITIVO MÓVIL
    // ============================================
    
    function isMobile() {
        return window.innerWidth <= 768;
    }

    // Ajustar animaciones para móviles (más ligeras)
    if (isMobile()) {
        document.body.classList.add('mobile-device');
        // Reducir la intensidad de algunas animaciones en móviles
        animateElements.forEach(el => {
            el.style.transitionDuration = '0.4s';
        });
        
    }

    console.log('✅ Animaciones cargadas correctamente');
});

// CSS adicional para el efecto ripple
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.6);
        width: 10px;
        height: 10px;
        animation: ripple-effect 0.6s ease-out;
        pointer-events: none;
    }

    @keyframes ripple-effect {
        to {
            width: 200px;
            height: 200px;
            opacity: 0;
        }
    }

    .mobile-device * {
        transition-duration: 0.2s !important;
    }
`;
document.head.appendChild(style);