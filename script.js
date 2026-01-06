// 1. CONFIGURAÇÃO DO WHATSAPP
const WHATSAPP_NUMBER = '5532988449501';
const MENSAGEM_PADRAO = encodeURIComponent("Olá! Vim pelo site do Cantinho do Pelo e gostaria de agendar um serviço para o meu pet. 🐾");

// --- EFEITOS VISUAIS (Header, Typewriter, Reveal) ---
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
});

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

// Menu Mobile
const mobileToggle = document.getElementById('mobile-toggle');
const mobileMenu = document.getElementById('mobile-menu');
if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
    });
}

// --- REDIRECIONAMENTO COM MENSAGEM PROGRAMADA ---
// Seleciona todos os botões de agendamento e o botão rosa do catálogo
document.querySelectorAll('a[href*="wa.me"], .btn-nav, .btn-primary, a[style*="background-color: #F7A9C4"]').forEach(botao => {
    botao.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${MENSAGEM_PADRAO}`, '_blank');
    });
});

// Formulário de Feedback (Envia os dados direto para o WhatsApp da dona)
const feedbackForm = document.getElementById('form-contato');
if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = document.getElementById('nome').value;
        const pet = document.getElementById('nome-pet').value;
        const msgCliente = document.getElementById('mensagem').value;
        
        const textoPersonalizado = encodeURIComponent(
            `*Novo Feedback pelo Site*\n\n` +
            `*Cliente:* ${nome}\n` +
            `*Pet:* ${pet}\n` +
            `*Mensagem:* ${msgCliente}`
        );
        
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${textoPersonalizado}`, '_blank');
        feedbackForm.reset();
    });
}