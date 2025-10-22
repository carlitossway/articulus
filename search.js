// --- COLOQUE SUA CHAVE DA API AQUI ---
const API_KEY = '00b47c26f02609c16e66ab6355346e51';
// ----------------------------------------

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w200'; // w200 = largura 200px

// Garante que o script só rode depois que o HTML carregar
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. "Pegar" os elementos do HTML que vamos usar
    const formPesquisa = document.getElementById('form-pesquisa');
    const inputPesquisa = document.getElementById('input-pesquisa');
    const containerResultados = document.getElementById('container-resultados');

    // 2. Adicionar um "ouvinte" para o evento de 'submit' (envio) do formulário
    formPesquisa.addEventListener('submit', (evento) => {
        // Impede que a página recarregue (comportamento padrão do form)
        evento.preventDefault(); 

        const query = inputPesquisa.value; // Pega o texto digitado
        
        // Só busca se o usuário digitou algo
        if (query) {
            buscarFilmes(query);
        }
    });

    // 3. Função que "conversa" com a API (essa é a parte assíncrona)
    async function buscarFilmes(query) {
        // Monta a URL da API com a nossa chave e a busca do usuário
        const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&language=pt-BR`;

        try {
            // 'await' espera a resposta da rede
            const response = await fetch(url);
            // 'await' espera a resposta ser convertida para JSON
            const data = await response.json(); 

            // 'data.results' é a lista de filmes que a API retornou
            mostrarFilmes(data.results);
        } catch (error) {
            console.error('Erro ao buscar filmes:', error);
            containerResultados.innerHTML = '<p class="placeholder-text">Erro ao buscar filmes. Tente novamente.</p>';
        }
    }

    // 4. Função que mostra os filmes na tela
    function mostrarFilmes(filmes) {
        // Limpa os resultados anteriores ou o texto "Digite algo..."
        containerResultados.innerHTML = '';

        if (filmes.length === 0) {
            containerResultados.innerHTML = '<p class="placeholder-text">Nenhum filme encontrado.</p>';
            return;
        }

        // Para cada filme na lista, cria um "card"
        filmes.forEach(filme => {
            // Se o filme não tiver um poster, usamos uma imagem genérica
            const posterPath = filme.poster_path 
                ? `${IMAGE_BASE_URL}${filme.poster_path}`
                : 'https://via.placeholder.com/200x300.png?text=Sem+Imagem'; // Imagem placeholder

            // Cria um novo elemento <div>
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card'); // Adiciona a classe do CSS

            // Coloca o HTML da imagem dentro do card
            movieCard.innerHTML = `<img src="${posterPath}" alt="${filme.title}">`;
            
            // --- A MÁGICA DO REDIRECIONAMENTO ---
            // Adiciona um "ouvinte" de clique em CADA card
            movieCard.addEventListener('click', () => {
                // Redireciona o usuário para a página 'movie.html'
                // e passa o ID do filme na URL (ex: ...movie.html?id=12345)
                window.location.href = `movie.html?id=${filme.id}`;
            });

            // Adiciona o card que acabamos de criar dentro do container de resultados
            containerResultados.appendChild(movieCard);
        });
    }
});

/* --- LÓGICA DO HERO SLIDER --- */

// (Esta função é chamada lá em cima, no DOMContentLoaded)
async function iniciarSliderHeroi() {
    // 1. Define a URL da API para filmes "em alta" (trending)
    const url = `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=pt-BR`;
    
    // Pega o 'container' do slider que criamos no HTML
    const sliderContainer = document.getElementById('hero-slider');

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // Pega apenas os 6 primeiros filmes da lista
        const filmes = data.results.slice(0, 6); 
        
        // 2. Cria os slides
        filmes.forEach((filme, index) => {
            // Pega a URL da imagem de fundo (backdrop)
            const backdropPath = `https://image.tmdb.org/t/p/w1280${filme.backdrop_path}`;
            
            // Cria um novo <div> para ser o slide
            const slide = document.createElement('div');
            slide.classList.add('slide');
            
            // Define a imagem de fundo do slide
            slide.style.backgroundImage = `url(${backdropPath})`;
            
            // Se for o primeiro filme (index 0), já o torna visível
            if (index === 0) {
                slide.classList.add('active');
            }
            
            // Adiciona o slide dentro do <div id="hero-slider">
            sliderContainer.appendChild(slide);
        });
        
        // 3. Inicia a troca de slides
        iniciarTrocaAutomatica();

    } catch (error) {
        console.error('Erro ao carregar imagens do slider:', error);
        // Se der erro, esconde o slider para não ficar um buraco
        sliderContainer.style.display = 'none'; 
    }
}

function iniciarTrocaAutomatica() {
    let slideAtual = 0;
    // Pega TODOS os slides que acabamos de criar
    const slides = document.querySelectorAll('#hero-slider .slide');
    const totalSlides = slides.length;

    // Se não tiver slides, não faz nada
    if (totalSlides === 0) return;

    // 'setInterval' é uma função do JS que roda um código a cada X milissegundos
    // 5000ms = 5 segundos
    setInterval(() => {
        // 1. Tira a classe 'active' do slide atual (esconde ele)
        slides[slideAtual].classList.remove('active');

        // 2. Calcula qual é o próximo slide
        // O '%' (módulo) faz o contador voltar a 0 quando chega no final
        slideAtual = (slideAtual + 1) % totalSlides; 

        // 3. Adiciona a classe 'active' no novo slide (mostra ele)
        slides[slideAtual].classList.add('active');

    }, 5000); // Mude aqui se quiser mais (7000) ou menos (3000) tempo
}