// blog.js - Gestión dinámica del blog con conexión a FastAPI

document.addEventListener('DOMContentLoaded', function() {
    
    // Verificar si estamos en la página principal con blog
    const blogContainer = document.querySelector('.blog');
    if (!blogContainer) return;

    // ============================================
    // 1. CONFIGURACIÓN Y VARIABLES
    // ============================================
    
    const API_URL = 'http://localhost:8000/api'; // Cambiar por tu URL de producción
    let currentPage = 1;
    let currentCategory = 'all';
    let postsPerPage = 3;
    let allPosts = [];

    // ============================================
    // 2. DATOS DE EJEMPLO (FALLBACK)
    // ============================================
    
    const fallbackPosts = [
        {
            id: 1,
            title: 'Tipos de granos de Café',
            excerpt: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quaerat nisi nam natus. Nihil dignissimos aliquam dolore ex incidunt soluta earum ducimus, explicabo eaque ius in laudantium repudiandae nesciunt totam quos?',
            image: '/img/blog1.jpg',
            imageWebp: '/img/blog1.webp',
            category: 'guias',
            date: '2024-12-15',
            author: 'Admin',
            likes: 45
        },
        {
            id: 2,
            title: '3 Deliciosas recetas de Café',
            excerpt: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quaerat nisi nam natus. Nihil dignissimos aliquam dolore ex incidunt soluta earum ducimus, explicabo eaque ius in laudantium repudiandae nesciunt totam quos?',
            image: '/img/blog2.jpg',
            imageWebp: '/img/blog2.webp',
            category: 'recetas',
            date: '2024-12-10',
            author: 'María García',
            likes: 67
        },
        {
            id: 3,
            title: 'Beneficios del Café',
            excerpt: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quaerat nisi nam natus. Nihil dignissimos aliquam dolore ex incidunt soluta earum ducimus, explicabo eaque ius in laudantium repudiandae nesciunt totam quos?',
            image: '/img/blog3.jpg',
            imageWebp: '/img/blog3.webp',
            category: 'tips',
            date: '2024-12-05',
            author: 'Juan Pérez',
            likes: 89
        }
    ];

    // ============================================
    // 3. AGREGAR FILTROS AL HTML
    // ============================================
    
    function addFilters() {
        const blogTitle = blogContainer.querySelector('h3');
        if (!blogTitle) return;

        const filtersHTML = `
            <div class="blog-filters scroll-animate">
                <button class="filter-btn active" data-category="all">Todos</button>
                <button class="filter-btn" data-category="recetas">Recetas</button>
                <button class="filter-btn" data-category="guias">Guías</button>
                <button class="filter-btn" data-category="tips">Tips</button>
            </div>
        `;

        blogTitle.insertAdjacentHTML('afterend', filtersHTML);

        // Event listeners para filtros
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Actualizar botón activo
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                // Filtrar posts
                currentCategory = this.dataset.category;
                currentPage = 1;
                renderPosts();
            });
        });
    }

    // ============================================
    // 4. CARGAR POSTS DESDE API
    // ============================================
    
    async function loadPosts() {
        try {
            const response = await fetch(`${API_URL}/posts`);
            
            if (!response.ok) {
                throw new Error('Error al cargar posts');
            }

            const data = await response.json();
            allPosts = data.posts || data;
            renderPosts();
            
        } catch (error) {
            console.warn('No se pudo conectar con la API, usando datos de ejemplo:', error);
            // Usar datos de fallback
            allPosts = fallbackPosts;
            renderPosts();
        }
    }

    // ============================================
    // 5. FILTRAR POSTS POR CATEGORÍA
    // ============================================
    
    function getFilteredPosts() {
        if (currentCategory === 'all') {
            return allPosts;
        }
        return allPosts.filter(post => post.category === currentCategory);
    }

    // ============================================
    // 6. RENDERIZAR POSTS
    // ============================================
    
    function renderPosts() {
        const filteredPosts = getFilteredPosts();
        const start = (currentPage - 1) * postsPerPage;
        const end = start + postsPerPage;
        const postsToShow = filteredPosts.slice(start, end);

        // Limpiar contenedor (excepto título y filtros)
        const existingEntries = blogContainer.querySelectorAll('.entrada');
        existingEntries.forEach(entry => entry.remove());

        // Renderizar posts
        if (postsToShow.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.innerHTML = `
                <p>No se encontraron entradas en esta categoría.</p>
            `;
            blogContainer.appendChild(noResults);
        } else {
            postsToShow.forEach((post, index) => {
                const postElement = createPostElement(post);
                postElement.classList.add('scroll-animate');
                blogContainer.appendChild(postElement);
                
                // Animar con delay
                setTimeout(() => {
                    postElement.classList.add('active');
                }, index * 100);
            });
        }

        // Renderizar paginación
        renderPagination(filteredPosts.length);
    }

    // ============================================
    // 7. CREAR ELEMENTO DE POST
    // ============================================
    
    function createPostElement(post) {
        const article = document.createElement('article');
        article.className = 'entrada';
        article.dataset.postId = post.id;

        const formattedDate = formatDate(post.date);
        const liked = isPostLiked(post.id);

        article.innerHTML = `
            <div class="entrada__imagen">
                <picture>
                    <source loading="lazy" srcset="${post.imageWebp}" type="image/webp">
                    <img loading="lazy" src="${post.image}" alt="${post.title}">
                </picture>
                <span class="entrada__categoria">${getCategoryName(post.category)}</span>
            </div>

            <div class="entrada__contenido">
                <div class="entrada__meta">
                    <span class="entrada__fecha">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        ${formattedDate}
                    </span>
                    <span class="entrada__autor">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        ${post.author}
                    </span>
                    <button class="entrada__likes ${liked ? 'liked' : ''}" data-id="${post.id}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="${liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        <span class="likes-count">${post.likes}</span>
                    </button>
                </div>

                <h4 class="no-margin">${post.title}</h4>
                <p>${post.excerpt}</p>
                <a href="entrada.html?id=${post.id}" class="boton boton--primario">Leer Entrada</a>
            </div>
        `;

        // Event listener para likes
        const likeBtn = article.querySelector('.entrada__likes');
        likeBtn.addEventListener('click', () => handleLike(post.id));

        return article;
    }

    // ============================================
    // 8. SISTEMA DE LIKES
    // ============================================
    
    function handleLike(postId) {
        const likedPosts = JSON.parse(localStorage.getItem('liked-posts') || '[]');
        const index = likedPosts.indexOf(postId);

        if (index === -1) {
            // Dar like
            likedPosts.push(postId);
            updateLikeOnServer(postId, 'like');
        } else {
            // Quitar like
            likedPosts.splice(index, 1);
            updateLikeOnServer(postId, 'unlike');
        }

        localStorage.setItem('liked-posts', JSON.stringify(likedPosts));
        
        // Actualizar UI
        const post = allPosts.find(p => p.id === postId);
        if (post) {
            post.likes += (index === -1 ? 1 : -1);
            renderPosts();
        }
    }

    function isPostLiked(postId) {
        const likedPosts = JSON.parse(localStorage.getItem('liked-posts') || '[]');
        return likedPosts.includes(postId);
    }

    async function updateLikeOnServer(postId, action) {
        try {
            await fetch(`${API_URL}/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action })
            });
        } catch (error) {
            console.warn('No se pudo actualizar el like en el servidor:', error);
        }
    }

    // ============================================
    // 9. PAGINACIÓN
    // ============================================
    
    function renderPagination(totalPosts) {
        const totalPages = Math.ceil(totalPosts / postsPerPage);
        
        // Remover paginación existente
        const existingPagination = blogContainer.querySelector('.pagination');
        if (existingPagination) {
            existingPagination.remove();
        }

        if (totalPages <= 1) return;

        const paginationHTML = `
            <div class="pagination">
                <button class="pagination__btn" data-page="prev" ${currentPage === 1 ? 'disabled' : ''}>
                    Anterior
                </button>
                ${generatePageButtons(totalPages)}
                <button class="pagination__btn" data-page="next" ${currentPage === totalPages ? 'disabled' : ''}>
                    Siguiente
                </button>
            </div>
        `;

        blogContainer.insertAdjacentHTML('beforeend', paginationHTML);

        // Event listeners para paginación
        const paginationBtns = document.querySelectorAll('.pagination__btn');
        paginationBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const page = this.dataset.page;
                
                if (page === 'prev' && currentPage > 1) {
                    currentPage--;
                } else if (page === 'next' && currentPage < totalPages) {
                    currentPage++;
                } else if (!isNaN(page)) {
                    currentPage = parseInt(page);
                }

                renderPosts();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }

    function generatePageButtons(totalPages) {
        let buttons = '';
        for (let i = 1; i <= totalPages; i++) {
            buttons += `
                <button class="pagination__btn ${i === currentPage ? 'active' : ''}" data-page="${i}">
                    ${i}
                </button>
            `;
        }
        return buttons;
    }

    // ============================================
    // 10. FUNCIONES AUXILIARES
    // ============================================
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('es-ES', options);
    }

    function getCategoryName(category) {
        const categories = {
            'recetas': 'Recetas',
            'guias': 'Guías',
            'tips': 'Tips',
            'all': 'Todos'
        };
        return categories[category] || category;
    }

    // ============================================
    // 11. BÚSQUEDA (OPCIONAL)
    // ============================================
    
    function addSearchBar() {
        const blogTitle = blogContainer.querySelector('h3');
        if (!blogTitle) return;

        const searchHTML = `
            <div class="blog-search scroll-animate">
                <input type="text" id="blog-search-input" placeholder="Buscar artículos..." class="search-input">
            </div>
        `;

        blogTitle.insertAdjacentHTML('afterend', searchHTML);

        const searchInput = document.getElementById('blog-search-input');
        let searchTimeout;

        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchPosts(this.value);
            }, 300);
        });
    }

    function searchPosts(query) {
        if (!query.trim()) {
            renderPosts();
            return;
        }

        const filtered = allPosts.filter(post => 
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(query.toLowerCase())
        );

        allPosts = filtered;
        currentPage = 1;
        renderPosts();
    }

    // ============================================
    // 12. INICIALIZACIÓN
    // ============================================
    
    function init() {
        addFilters();
        // addSearchBar(); // Descomentar si quieres búsqueda
        loadPosts();
    }

    init();

    console.log('✅ Sistema de blog dinámico cargado correctamente');
});

// ============================================
// 13. ESTILOS CSS ADICIONALES
// ============================================

const style = document.createElement('style');
style.textContent = `
    .blog-filters {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        margin: 3rem 0;
        justify-content: center;
    }

    .filter-btn {
        padding: 1rem 2.5rem;
        border: 2px solid #784d3c;
        background-color: transparent;
        color: #784d3c;
        font-family: 'PT Sans', sans-serif;
        font-weight: bold;
        cursor: pointer;
        border-radius: 3rem;
        transition: all 0.3s ease;
        font-size: 1.6rem;
    }

    .filter-btn:hover,
    .filter-btn.active {
        background-color: #784d3c;
        color: #ffffff;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(120, 77, 60, 0.3);
    }

    .entrada__categoria {
        position: absolute;
        top: 1.5rem;
        right: 1.5rem;
        background-color: #784d3c;
        color: white;
        padding: 0.8rem 2rem;
        border-radius: 3rem;
        font-size: 1.4rem;
        font-weight: bold;
        z-index: 10;
    }

    .entrada__meta {
        display: flex;
        gap: 2rem;
        flex-wrap: wrap;
        margin-bottom: 1.5rem;
        font-size: 1.4rem;
        color: #666;
    }

    .entrada__meta span,
    .entrada__meta button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .entrada__likes {
        background: none;
        border: none;
        cursor: pointer;
        color: #666;
        transition: color 0.3s ease;
        padding: 0;
        font-size: 1.4rem;
    }

    .entrada__likes:hover {
        color: #e74c3c;
    }

    .entrada__likes.liked {
        color: #e74c3c;
    }

    .pagination {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-top: 4rem;
        flex-wrap: wrap;
    }

    .pagination__btn {
        padding: 1rem 2rem;
        border: 2px solid #784d3c;
        background-color: #ffffff;
        color: #784d3c;
        font-weight: bold;
        cursor: pointer;
        border-radius: 0.5rem;
        transition: all 0.3s ease;
        font-size: 1.6rem;
    }

    .pagination__btn:hover:not(:disabled),
    .pagination__btn.active {
        background-color: #784d3c;
        color: #ffffff;
    }

    .pagination__btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .no-results {
        text-align: center;
        padding: 4rem;
        font-size: 1.8rem;
        color: #666;
    }

    .blog-search {
        margin: 2rem 0;
    }

    .search-input {
        width: 100%;
        max-width: 50rem;
        padding: 1.5rem;
        border: 2px solid #e1e1e1;
        border-radius: 3rem;
        font-size: 1.6rem;
        transition: border-color 0.3s ease;
    }

    .search-input:focus {
        outline: none;
        border-color: #784d3c;
    }

    /* Tema oscuro */
    body.dark-theme .filter-btn {
        border-color: #a67c52;
        color: #a67c52;
    }

    body.dark-theme .filter-btn:hover,
    body.dark-theme .filter-btn.active {
        background-color: #a67c52;
        color: #1a1a1a;
    }

    body.dark-theme .pagination__btn {
        background-color: #2a2a2a;
        border-color: #a67c52;
        color: #a67c52;
    }

    body.dark-theme .pagination__btn:hover:not(:disabled),
    body.dark-theme .pagination__btn.active {
        background-color: #a67c52;
        color: #1a1a1a;
    }

    body.dark-theme .search-input {
        background-color: #2a2a2a;
        color: #e1e1e1;
        border-color: #444;
    }
`;
document.head.appendChild(style);