// --- COLOQUE SUA CHAVE DA API AQUI TAMBÉM ---
const API_KEY = '00b47c26f02609c16e66ab6355346e51';
// ----------------------------------------

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w400'; // Imagem maior (largura 400px)

// Garante que o script só rode depois que o HTML carregar
document.addEventListener('DOMContentLoaded', () => {

    // 1. "Ler" a URL para pegar o ID do filme
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id'); // Pega o valor depois de "?id="

    if (movieId) {
        // Se encontramos um ID, buscamos os detalhes desse filme
        buscarDetalhesDoFilme(movieId);
    } else {
        // Se não, mostra um erro
        document.body.innerHTML = '<h1>Erro: ID do filme não encontrado.</h1><a href="index.html">Voltar</a>';
    }

    // 2. Função que busca os detalhes de UM filme específico
    async function buscarDetalhesDoFilme(id) {
        // A URL da API é diferente agora: /movie/{id_do_filme}
        const url = `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=pt-BR`;
        
        try {
            const response = await fetch(url);
            const filme = await response.json();
            
            // Passa os dados do filme para a função que mostra na tela
            mostrarDetalhes(filme);
        } catch (error) {
            console.error('Erro ao buscar detalhes do filme:', error);
        }
    }

    // 3. Função que preenche o HTML com os dados do filme
    function mostrarDetalhes(filme) {
        // Pega os elementos da página de detalhes
        const poster = document.getElementById('movie-poster');
        const title = document.getElementById('movie-title');
        const tagline = document.getElementById('movie-tagline');
        const overview = document.getElementById('movie-overview');
        const releaseDate = document.getElementById('movie-release-date');
        const rating = document.getElementById('movie-rating');

        // Atualiza o 'src' (link) da imagem do poster
        poster.src = filme.poster_path 
            ? `${IMAGE_BASE_URL}${filme.poster_path}` 
            : 'https://via.placeholder.com/400x600.png?text=Sem+Imagem';

        // Atualiza o texto dos elementos
        title.textContent = filme.title;
        tagline.textContent = filme.tagline || ''; // Mostra o tagline ou nada
        overview.textContent = filme.overview || 'Sinopse não disponível.';
        
        // Formata a data (ex: 1993)
        releaseDate.textContent = `Ano: ${new Date(filme.release_date).getFullYear()}`;
        
        // Formata a nota (ex: 8.2)
        rating.textContent = `Nota: ${filme.vote_average.toFixed(1)} / 10`;
    }
});