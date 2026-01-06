// 1. Configuração (Sempre no topo para fácil acesso)
const CONFIG = {
    API_KEY: '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',
    LIST_ID_FEEDBACK: 7,
    LIST_ID_WHATSAPP: 8,
    WHATSAPP_NUMBER: '5532988449501'
};

// --- SEU CÓDIGO ORIGINAL (Header & Scroll) ---
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// --- SEU CÓDIGO ORIGINAL (Typewriter) ---
const textElement = document.querySelector('.typewriter');
if (textElement) {
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
            typeSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }
        setTimeout(type, typeSpeed);
    }
    document.addEventListener('DOMContentLoaded', type);
}

// --- SEU CÓDIGO ORIGINAL (Scroll Reveal) ---
const observerOptions = { threshold: 0.15 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show-element');
        }
    });
}, observerOptions);
document.querySelectorAll('.hidden-element').forEach((el) => observer.observe(el));

// --- SEU CÓDIGO ORIGINAL (Mobile Menu) ---
const mobileToggle = document.getElementById('mobile-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const bars = document.querySelectorAll('.bar');

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
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
}

// --- LOGICA DO MODAL + BREVO (MODIFICADO) ---
const modal = document.getElementById('modal-whatsapp');
const formCaptura = document.getElementById('form-captura-whats');

function abrirModal(e) { if(e) e.preventDefault(); modal.style.display = 'flex'; }
function fecharModal() { modal.style.display = 'none'; }

document.querySelectorAll('a[href*="wa.me"], .btn-nav, .btn-primary').forEach(botao => {
    botao.addEventListener('click', abrirModal);
});

// AQUI ESTÁ A MÁGICA: Captura WhatsApp + Brevo
if (formCaptura) {
    formCaptura.addEventListener('submit', async function(e) {
        e.preventDefault();
        const nome = document.getElementById('lead-nome').value;
        const email = document.getElementById('lead-email').value;
        const pet = document.getElementById('lead-pet').value;
        const btn = e.target.querySelector('button');
        
        btn.innerText = "Salvando...";

        try {
            // Salva na lista 8 (WhatsApp)
            await fetch('https://api.brevo.com/v3/contacts', {
                method: 'POST',
                headers: { 'api-key': CONFIG.API_KEY, 'content-type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    attributes: { NOME: nome, PET: pet },
                    listIds: [CONFIG.LIST_ID_WHATSAPP],
                    updateEnabled: true
                })
            });
        } catch (err) { console.error("Erro na Brevo"); }

        // Redireciona para o WhatsApp
        const mensagem = encodeURIComponent(`Olá! Me chamo ${nome}, vim pelo site e quero agendar para o pet ${pet}!`);
        window.location.href = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${mensagem}`;
    });
}

// NOVO: Lógica para o Formulário de Feedback (Rodapé) + Lista 7
const feedbackForm = document.getElementById('form-contato');
if (feedbackForm) {
    feedbackForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        btn.innerText = "Enviando...";

        try {
            const response = await fetch('https://api.brevo.com/v3/contacts', {
                method: 'POST',
                headers: { 'api-key': CONFIG.API_KEY, 'content-type': 'application/json' },
                body: JSON.stringify({
                    email: document.getElementById('email').value,
                    attributes: {
                        NOME: document.getElementById('nome').value,
                        PET: document.getElementById('nome-pet').value,
                        MENSAGEM: document.getElementById('mensagem').value
                    },
                    listIds: [CONFIG.LIST_ID_FEEDBACK],
                    updateEnabled: true
                })
            });
            if (response.ok) { 
    showToast('🐶 Agradecemos sua mensagem! Seu feedback faz toda a diferença para nós.');
    feedbackForm.reset(); 
}
        } catch (error) { alert('Erro ao enviar feedback.'); }
        btn.innerText = "Enviar Feedback";
    });
}




function showToast(message, success = true) {
    const toast = document.createElement('div');
    toast.innerText = message;

    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: success ? '#2ecc71' : '#e74c3c',
        color: '#fff',
        padding: '14px 20px',
        borderRadius: '8px',
        fontSize: '14px',
        boxShadow: '0 6px 15px rgba(0,0,0,0.25)',
        zIndex: '9999',
        opacity: '0',
        transform: 'translateY(20px)',
        transition: 'all 0.4s ease'
    });

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';

        setTimeout(() => toast.remove(), 400);
    }, 4000);
}
