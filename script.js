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






// Captura o formulário pelo ID correto
const feedbackForm = document.getElementById('form-contato');

if (feedbackForm) {
    feedbackForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Impede o redirecionamento
        
        const btn = feedbackForm.querySelector('button');
        const originalText = btn.textContent;
        
        // Feedback visual
        btn.textContent = "Enviando...";
        btn.disabled = true;

        const data = new FormData(feedbackForm);

        try {
            const response = await fetch(feedbackForm.action, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                // 1. Limpa o formulário
                feedbackForm.reset(); 
                
                // 2. Mostra o balão de sucesso
                const toast = document.getElementById('success-toast');
                toast.style.display = 'block';
                
                // 3. Faz o balão sumir sozinho após 4 segundos
                setTimeout(() => {
                    toast.style.animation = 'popIn 0.4s reverse forwards'; // Animação saindo
                    setTimeout(() => {
                        toast.style.display = 'none';
                        toast.style.animation = 'popIn 0.4s forwards'; // Reseta a animação para a próxima vez
                    }, 400);
                }, 4000);

            } else {
                throw new Error("Erro ao enviar o formulário");
            }
        } catch (error) {
            console.error(error);
            alert("Erro ao enviar o formulário");
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    });
}


