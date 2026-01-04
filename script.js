// 1. Sticky Header - Muda o fundo ao rolar
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// 2. Typewriter Effect (Efeito de Digitação no Hero)
const textElement = document.querySelector('.typewriter');
const words = textElement.getAttribute('data-text').split(',');
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
        textElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
    } else {
        textElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 150;
    }

    if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pausa no final da palavra
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}

// Inicia o efeito de digitação
document.addEventListener('DOMContentLoaded', type);


// 3. Scroll Reveal (Animação ao aparecer na tela)
const observerOptions = {
    threshold: 0.15 // Ativa quando 15% do elemento estiver visível
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show-element');
        }
    });
}, observerOptions);

const hiddenElements = document.querySelectorAll('.hidden-element');
hiddenElements.forEach((el) => observer.observe(el));


// 4. Mobile Menu Toggle
const mobileToggle = document.getElementById('mobile-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const bars = document.querySelectorAll('.bar');

mobileToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    
    // Animação do ícone sanduíche
    if(mobileMenu.classList.contains('active')) {
        bars[0].style.transform = "rotate(-45deg) translate(-5px, 6px)";
        bars[1].style.opacity = "0";
        bars[2].style.transform = "rotate(45deg) translate(-5px, -6px)";
    } else {
        bars[0].style.transform = "none";
        bars[1].style.opacity = "1";
        bars[2].style.transform = "none";
    }
});

// Fechar menu ao clicar em um link
document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        bars[0].style.transform = "none";
        bars[1].style.opacity = "1";
        bars[2].style.transform = "none";
    });
});




// 5. Lógica do Modal de Captura WhatsApp
const modal = document.getElementById('modal-whatsapp');
const formCaptura = document.getElementById('form-captura-whats');

// Função para abrir o modal
function abrirModal(e) {
    if(e) e.preventDefault(); // Impede o link de abrir o whats direto
    modal.style.display = 'flex';
}

// Função para fechar o modal
function fecharModal() {
    modal.style.display = 'none';
}

// Evento ao enviar o formulário do Modal
formCaptura.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Pegando os dados (que o JS enviará silenciosamente para a Brevo depois)
    const nome = document.getElementById('lead-nome').value;
    const email = document.getElementById('lead-email').value;
    
    // Aqui faremos a chamada da API da Brevo no próximo passo!
    console.log("Capturado:", nome, email);
    
    // Redireciona para o WhatsApp após a captura
    const mensagem = encodeURIComponent(`Olá! Me chamo ${nome}, vim pelo site e quero meu desconto de 5% no agendamento!`);
    window.open(`https://wa.me/55SEUNUMEROAQUI?text=${mensagem}`, '_blank');
    
    fecharModal();
});

// Seleciona todos os botões de agendar do site e vincula ao modal
document.querySelectorAll('a[href*="wa.me"], .btn-nav, .btn-primary').forEach(botao => {
    botao.addEventListener('click', abrirModal);
});







/* limpar arquivos formulario */

// 6. Envio de Feedback via AJAX (Formspree)
const formFeedback = document.getElementById('form-feedback');

formFeedback.addEventListener('submit', async function(e) {
    e.preventDefault(); // Impede o redirecionamento para o site do Formspree
    
    const btn = formFeedback.querySelector('button');
    const originalText = btn.textContent;
    btn.textContent = "Enviando..."; // Feedback visual para o usuário

    const data = new FormData(formFeedback);

    try {
        const response = await fetch(formFeedback.action, {
            method: 'POST',
            body: data,
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            alert('Obrigado! Sua mensagem foi enviada com sucesso.'); // Pode trocar por um modal se quiser
            formFeedback.reset(); // LIMPA O FORMULÁRIO após o envio
        } else {
            alert('Ops! Ocorreu um erro ao enviar. Tente novamente.');
        }
    } catch (error) {
        alert('Erro de conexão. Verifique sua internet.');
    } finally {
        btn.textContent = originalText; // Volta o texto do botão ao normal
    }
});


