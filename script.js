// 1. FORÇAR O SITE A IR PARA O TOPO AO ATUALIZAR (Recarregar)
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// 2. CONFIGURAÇÃO DO WHATSAPP
const WHATSAPP_NUMBER = '5532988449501';
const MENSAGEM_PADRAO = encodeURIComponent("Olá! Vim pelo site do Cantinho do Pelo e gostaria de agendar um serviço para o meu pet. 🐾");

// --- EFEITOS VISUAIS (Header, Typewriter, Reveal) ---
const header = document.getElementById('header');
if (header) {
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });
}

// Efeito de Escrita (Typewriter) no Título
const textElement = document.querySelector('.typewriter');
if (textElement) {
    const words = textElement.getAttribute('data-text').split(',');
    let wordIndex = 0, charIndex = 0, isDeleting = false;
    function type() {
        const currentWord = words[wordIndex];
        textElement.textContent = isDeleting ? currentWord.substring(0, charIndex--) : currentWord.substring(0, charIndex++);
        let speed = isDeleting ? 50 : 150;
        if (!isDeleting && charIndex > currentWord.length) { isDeleting = true; speed = 2000; }
        else if (isDeleting && charIndex === 0) { isDeleting = false; wordIndex = (wordIndex + 1) % words.length; speed = 500; }
        setTimeout(type, speed);
    }
    type();
}

// Revelar elementos ao rolar (Animação de entrada)
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('show-element'); });
}, { threshold: 0.15 });
document.querySelectorAll('.hidden-element').forEach(el => observer.observe(el));

// --- MENU MOBILE (CORRIGIDO PARA FECHAR E TROCAR ICONE) ---
const mobileToggle = document.getElementById('mobile-toggle');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileToggle && mobileMenu) {
    // 1. Abrir e Fechar Menu
    mobileToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active'); 
        mobileToggle.classList.toggle('active'); // Isso aqui ativa o "X" se o CSS estiver certo
    });

    // 2. Fechar o menu automaticamente ao clicar em qualquer link e resetar o ícone
    const menuLinks = mobileMenu.querySelectorAll('a'); 
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active'); // Fecha o menu
            mobileToggle.classList.remove('active'); // Volta o ícone para as barrinhas
        });
    });
}

// --- REDIRECIONAMENTO COM MENSAGEM PROGRAMADA ---
document.querySelectorAll('a[href*="wa.me"], .btn-nav, .btn-primary, a[style*="background-color: #F7A9C4"]').forEach(botao => {
    botao.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${MENSAGEM_PADRAO}`, '_blank');
    });
});


document.addEventListener('DOMContentLoaded', function () {
    // Verifica se a biblioteca do Swiper foi carregada no HTML
    if (typeof Swiper === 'undefined') {
        console.error('A biblioteca Swiper não foi carregada.');
        return;
    }

    // Inicializa o Swiper pegando a classe do nosso container
    const galeriaSwiper = new Swiper('.grid-galeria', {
        // Ativa o loop infinito (quando chegar na última foto, volta pra primeira suavemente)
        loop: true,
        
        // Espaço entre as fotos (em pixels)
        spaceBetween: 20,

        // Configuração de Autoplay pedida: muda a cada 3 segundos (3000ms)
        autoplay: {
            delay: 3000,
            disableOnInteraction: false, // Continua passando sozinho mesmo se o usuário clicar na seta
            pauseOnMouseEnter: true      // Pausa o carrossel se o mouse estiver em cima da foto
        },

        // Ativação das setas de voltar/avançar
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        // Ativação das bolinhas lá embaixo
        pagination: {
            el: '.swiper-pagination',
            clickable: true, // Permite clicar nas bolinhas para pular para a foto
        },

        // Responsividade: Quantas fotos mostrar dependendo do tamanho da tela
        breakpoints: {
            // Telas de celular (a partir de 0px)
            0: {
                slidesPerView: 1, // Mostra 1 foto por vez
            },
            // Telas de tablet (a partir de 600px)
            600: {
                slidesPerView: 2, // Mostra 2 fotos lado a lado
            },
            // Telas de computador (a partir de 900px)
            900: {
                slidesPerView: 3, // Mostra 3 fotos lado a lado
            },
            // Telas muito grandes (a partir de 1200px)
            1200: {
                slidesPerView: 4, // Mostra 4 fotos lado a lado
            }
        }
    });
});

