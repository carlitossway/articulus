// Espera o documento HTML estar completamente carregado antes de rodar o script
document.addEventListener('DOMContentLoaded', () => {

    // --- FUNCIONALIDADE 1: DARK MODE (MODO ESCURO) ---

    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement; // Seleciona a tag <html>

    // 1. Verificar se o usuário JÁ TEM uma preferência salva
    // localStorage é um "mini-banco-de-dados" no navegador
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    }

    // 2. Adicionar o "ouvidor de evento" de clique no botão
    themeToggle.addEventListener('click', () => {
        // 3. Verificar qual é o tema ATUAL
        let currentTheme = htmlElement.getAttribute('data-theme');
        let newTheme = '';

        // 4. Se o tema for 'light' (ou não existir), mude para 'dark'
        if (currentTheme === 'light' || !currentTheme) {
            newTheme = 'dark';
        } else {
            // 5. Senão, mude para 'light'
            newTheme = 'light';
        }

        // 6. Aplicar o novo tema no HTML (o CSS vai reagir a isso)
        htmlElement.setAttribute('data-theme', newTheme);
        
        // 7. Salvar a preferência do usuário no localStorage
        localStorage.setItem('theme', newTheme);
    });


    // --- FUNCIONALIDADE 2: LAZY LOADING (CARREGAMENTO PREGUIÇOSO) ---

    // 1. Selecionar todas as imagens que têm o atributo 'data-src'
    const lazyImages = document.querySelectorAll('img[data-src]');

    // 2. Configurações do "Observador"
    const imageObserverOptions = {
        root: null, // Observa em relação ao viewport (tela inteira)
        rootMargin: '0px',
        threshold: 0.1 // Aciona quando 10% da imagem estiver visível
    };

    // 3. Criar a função que será chamada quando a imagem aparecer
    const imageObserverCallback = (entries, observer) => {
        entries.forEach(entry => {
            // 4. entry.isIntersecting significa "a imagem está na tela?"
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // 5. Pega a URL do 'data-src' e coloca no 'src' (isso faz o download)
                img.src = img.dataset.src;

                // 6. Adiciona a classe '.loaded' para o CSS fazer o fade-in
                img.classList.add('loaded');

                // 7. Para de observar esta imagem (trabalho concluído)
                observer.unobserve(img);
            }
        });
    };

    // 8. Criar o observador de fato
    const observer = new IntersectionObserver(imageObserverCallback, imageObserverOptions);

    // 9. Mandar o observador "vigiar" cada uma das nossas imagens
    lazyImages.forEach(img => {
        observer.observe(img);
    });

});