// slider.js - Carrusel de imágenes interactivo

document.addEventListener('DOMContentLoaded', function() {
    
    // Verificar si estamos en la página principal
    const contenedorPrincipal = document.querySelector('.contenido-principal');
    if (!contenedorPrincipal) return;

    // ============================================
    // 1. CREAR ESTRUCTURA DEL SLIDER
    // ============================================
    
    const sliderSection = document.createElement('section');
    sliderSection.className = 'slider-section scroll-animate';
    sliderSection.innerHTML = `
        <div class="contenedor">
            <h3 class="section-title centrar-texto">Destacados del Mes</h3>
            <div class="slider">
                <button class="slider__btn slider__btn--prev" aria-label="Anterior">
                    &#10094;
                </button>
                <div class="slider__wrapper">
                    <div class="slider__track"></div>
                </div>
                <button class="slider__btn slider__btn--next" aria-label="Siguiente">
                    &#10095;
                </button>
                <div class="slider__indicators"></div>
            </div>
        </div>
    `;

    // Insertar slider antes del contenido principal
    contenedorPrincipal.parentNode.insertBefore(sliderSection, contenedorPrincipal);

    // ============================================
    // 2. DATOS DE LAS IMÁGENES DEL SLIDER
    // ============================================
    
    const slides = [
        {
            image: '/img/blog1.jpg',
            imageWebp: '/img/blog1.webp',
            title: 'Tipos de granos de Café',
            description: 'Descubre las variedades más populares de café del mundo',
            link: 'entrada.html'
        },
        {
            image: '/img/blog2.jpg',
            imageWebp: '/img/blog2.webp',
            title: '3 Deliciosas recetas de Café',
            description: 'Aprende a preparar las mejores bebidas de café en casa',
            link: 'entrada.html'
        },
        {
            image: '/img/blog3.jpg',
            imageWebp: '/img/blog3.webp',
            title: 'Beneficios del Café',
            description: 'Conoce las propiedades saludables de esta bebida milenaria',
            link: 'entrada.html'
        }
    ];

    // ============================================
    // 3. GENERAR HTML DE LAS SLIDES
    // ============================================
    
    const sliderTrack = document.querySelector('.slider__track');
    const indicatorsContainer = document.querySelector('.slider__indicators');

    slides.forEach((slide, index) => {
        // Crear slide
        const slideElement = document.createElement('div');
        slideElement.className = 'slider__item';
        slideElement.innerHTML = `
            <picture>
                <source srcset="${slide.imageWebp}" type="image/webp">
                <img src="${slide.image}" alt="${slide.title}">
            </picture>
            <div class="slider__caption">
                <h4>${slide.title}</h4>
                <p>${slide.description}</p>
                <a href="${slide.link}" class="boton boton--primario">Leer más</a>
            </div>
        `;
        sliderTrack.appendChild(slideElement);

        // Crear indicador
        const indicator = document.createElement('button');
        indicator.className = 'slider__indicator';
        indicator.setAttribute('aria-label', `Ir a slide ${index + 1}`);
        if (index === 0) indicator.classList.add('active');
        indicator.dataset.index = index;
        indicatorsContainer.appendChild(indicator);
    });

    // ============================================
    // 4. VARIABLES Y CONFIGURACIÓN
    // ============================================
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    const prevBtn = document.querySelector('.slider__btn--prev');
    const nextBtn = document.querySelector('.slider__btn--next');
    const indicators = document.querySelectorAll('.slider__indicator');
    let autoplayInterval;
    const autoplayDelay = 5000; // 5 segundos

    // ============================================
    // 5. FUNCIÓN PARA MOSTRAR SLIDE
    // ============================================
    
    function showSlide(index) {
        // Validar índice
        if (index < 0) {
            currentSlide = totalSlides - 1;
        } else if (index >= totalSlides) {
            currentSlide = 0;
        } else {
            currentSlide = index;
        }

        // Mover el track
        const offset = -currentSlide * 100;
        sliderTrack.style.transform = `translateX(${offset}%)`;

        // Actualizar indicadores
        indicators.forEach((indicator, i) => {
            if (i === currentSlide) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    // ============================================
    // 6. NAVEGACIÓN CON BOTONES
    // ============================================
    
    prevBtn.addEventListener('click', function() {
        showSlide(currentSlide - 1);
        resetAutoplay();
    });

    nextBtn.addEventListener('click', function() {
        showSlide(currentSlide + 1);
        resetAutoplay();
    });

    // ============================================
    // 7. NAVEGACIÓN CON INDICADORES
    // ============================================
    
    indicators.forEach(indicator => {
        indicator.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            showSlide(index);
            resetAutoplay();
        });
    });

    // ============================================
    // 8. NAVEGACIÓN CON TECLADO
    // ============================================
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            showSlide(currentSlide - 1);
            resetAutoplay();
        } else if (e.key === 'ArrowRight') {
            showSlide(currentSlide + 1);
            resetAutoplay();
        }
    });

    // ============================================
    // 9. AUTOPLAY
    // ============================================
    
    function startAutoplay() {
        autoplayInterval = setInterval(function() {
            showSlide(currentSlide + 1);
        }, autoplayDelay);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    // Pausar autoplay al hacer hover
    const slider = document.querySelector('.slider');
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);

    // Iniciar autoplay
    startAutoplay();

    // ============================================
    // 10. SOPORTE PARA TOUCH/SWIPE (Móviles)
    // ============================================
    
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;

    sliderTrack.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    });

    sliderTrack.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });

    function handleSwipe() {
        const diffX = touchStartX - touchEndX;
        const diffY = Math.abs(touchStartY - touchEndY);
        
        // Solo si el movimiento horizontal es mayor que el vertical
        if (Math.abs(diffX) > diffY) {
            if (diffX > 50) {
                // Swipe izquierda (siguiente)
                showSlide(currentSlide + 1);
                resetAutoplay();
            } else if (diffX < -50) {
                // Swipe derecha (anterior)
                showSlide(currentSlide - 1);
                resetAutoplay();
            }
        }
    }

    // ============================================
    // 11. PAUSAR AUTOPLAY CUANDO LA PESTAÑA NO ESTÁ VISIBLE
    // ============================================
    
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            stopAutoplay();
        } else {
            startAutoplay();
        }
    });

    // ============================================
    // 12. PRECARGA DE IMÁGENES
    // ============================================
    
    function preloadImages() {
        slides.forEach(slide => {
            const img = new Image();
            img.src = slide.image;
            
            // Precargar webp también
            const imgWebp = new Image();
            imgWebp.src = slide.imageWebp;
        });
    }

    preloadImages();

    console.log('✅ Slider cargado correctamente');
});

// ============================================
// 13. ESTILOS CSS PARA EL SLIDER
// ============================================

const style = document.createElement('style');
style.textContent = `
    .slider-section {
        padding: 6rem 0;
        background-color: #f5f5f5;
        margin: 4rem 0;
    }

    .section-title {
        margin-bottom: 4rem;
        color: #784d3c;
        font-size: 3.2rem;
    }

    .slider {
        position: relative;
        max-width: 100rem;
        margin: 0 auto;
        overflow: hidden;
        border-radius: 1.5rem;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    }

    .slider__wrapper {
        overflow: hidden;
    }

    .slider__track {
        display: flex;
        transition: transform 0.5s ease-in-out;
    }

    .slider__item {
        min-width: 100%;
        position: relative;
    }

    .slider__item img {
        width: 100%;
        height: 50rem;
        object-fit: cover;
        display: block;
    }

    .slider__caption {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
        color: white;
        padding: 4rem 3rem 3rem;
    }

    .slider__caption h4 {
        color: white;
        margin-bottom: 1rem;
        font-size: 3rem;
    }

    .slider__caption p {
        margin-bottom: 2rem;
        font-size: 1.6rem;
        opacity: 0.9;
    }

    .slider__btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background-color: rgba(120, 77, 60, 0.8);
        color: white;
        border: none;
        font-size: 2.4rem;
        padding: 1.5rem 2rem;
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 10;
        border-radius: 0.5rem;
    }

    .slider__btn:hover {
        background-color: #784d3c;
        transform: translateY(-50%) scale(1.1);
    }

    .slider__btn--prev {
        left: 2rem;
    }

    .slider__btn--next {
        right: 2rem;
    }

    .slider__indicators {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-top: 2rem;
    }

    .slider__indicator {
        width: 1.2rem;
        height: 1.2rem;
        border-radius: 50%;
        background-color: #e1e1e1;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .slider__indicator.active {
        background-color: #784d3c;
        transform: scale(1.3);
    }

    .slider__indicator:hover {
        background-color: #a67c52;
    }

    /* Tema oscuro */
    body.dark-theme .slider-section {
        background-color: #2a2a2a;
    }

    body.dark-theme .section-title {
        color: #a67c52;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .slider__item img {
            height: 35rem;
        }

        .slider__caption {
            padding: 3rem 2rem 2rem;
        }

        .slider__caption h4 {
            font-size: 2.2rem;
        }

        .slider__caption p {
            font-size: 1.4rem;
        }

        .slider__btn {
            font-size: 1.8rem;
            padding: 1rem 1.5rem;
        }

        .slider__btn--prev {
            left: 1rem;
        }

        .slider__btn--next {
            right: 1rem;
        }
    }
`;
document.head.appendChild(style);