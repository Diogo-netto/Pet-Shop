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
    
    // 1. Pegando os dados
    const nome = document.getElementById('lead-nome').value;
    const email = document.getElementById('lead-email').value;
    const pet = document.getElementById('lead-pet') ? document.getElementById('lead-pet').value : '';
    
    // Log para teste
    console.log("Capturado:", nome, email, pet);
    
    // 2. Monta o link do WhatsApp
    const mensagem = encodeURIComponent(`Olá! Me chamo ${nome}, vim pelo site e quero conhecer e agendar um serviço para(a) ${pet}!`);
    const urlWhats = `https://wa.me/5532988449501?text=${mensagem}`;

    // 3. ABRE O WHATSAPP EM NOVA ABA
    window.open(urlWhats, '_blank');

    // 4. LIMPA O FORMULÁRIO E FECHA O MODAL (Com um pequeno atraso para não bugar)
    setTimeout(() => {
        formCaptura.reset(); // Limpa os campos (Isso resolve seu problema!)
        fecharModal();      // Fecha o modal
    }, 500); 
});

// Seleciona todos os botões de agendar do site e vincula ao modal
document.querySelectorAll('a[href*="wa.me"], .btn-nav, .btn-primary').forEach(botao => {
    botao.addEventListener('click', abrirModal);
});







const feedbackForm = document.getElementById('form-contato');

if (feedbackForm) {
    feedbackForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const btn = feedbackForm.querySelector('button');
        const originalText = btn.textContent;
        
        btn.textContent = "Enviando...";
        btn.disabled = true;

        // --- VALIDAÇÃO ---
        // Verifica se o CONFIG (do secrets.js) foi carregado
        if (typeof CONFIG === 'undefined') {
            console.error("Erro: O arquivo secrets.js não foi carregado corretamente.");
            alert("Erro interno: Configuração não carregada.");
            btn.textContent = originalText;
            btn.disabled = false;
            return;
        }

        const corpoDados = {
            email: document.getElementById('email').value.trim(),
            attributes: {
                "NOME": document.getElementById('nome').value.trim(),      
                "PET": document.getElementById('nome-pet').value.trim(),
                "MENSAGEM": document.getElementById('mensagem').value.trim()
            },
            listIds: [CONFIG.LIST_ID], // Puxa o ID 4 da sua foto
            updateEnabled: true 
        };

        try {
            const response = await fetch('https://api.brevo.com/v3/contacts', {
                method: 'POST',
                headers: {
                   'accept': 'application/json',
                   'api-key': CONFIG.API_KEY, // Puxa a chave da sua foto
                   'content-type': 'application/json'
                },
                body: JSON.stringify(corpoDados)
            });

            if (response.ok || response.status === 201 || response.status === 204) {
                alert('🐶 Au-migo, feedback enviado com sucesso!');
                feedbackForm.reset(); 
            } else {
                const erroData = await response.json();
                console.log('Erro Brevo:', erroData);
                alert('Erro na Brevo: ' + (erroData.message || 'Verifique os dados.'));
            }
        } catch (error) {
            console.error('Erro de conexão:', error);
            alert('Falha na rede. Verifique sua conexão.');
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    });
}