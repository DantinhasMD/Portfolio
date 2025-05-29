// Script principal para o site de portfólio

document.addEventListener('DOMContentLoaded', function() {
    // Menu mobile toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (mobileNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Fechar menu mobile ao clicar em um link
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileNav.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
    
    // Slider de projetos
    const sliderItems = document.querySelectorAll('.slider-item');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    
    if (sliderItems.length > 0 && prevBtn && nextBtn) {
        // Função para mostrar o slide atual
        function showSlide(index) {
            sliderItems.forEach(item => item.classList.remove('active'));
            
            // Garantir que o índice esteja dentro dos limites
            if (index < 0) {
                currentSlide = sliderItems.length - 1;
            } else if (index >= sliderItems.length) {
                currentSlide = 0;
            } else {
                currentSlide = index;
            }
            
            sliderItems[currentSlide].classList.add('active');
        }
        
        // Event listeners para os botões do slider
        prevBtn.addEventListener('click', () => {
            showSlide(currentSlide - 1);
        });
        
        nextBtn.addEventListener('click', () => {
            showSlide(currentSlide + 1);
        });
        
        // Iniciar o slider
        showSlide(currentSlide);
        
        // Auto-play do slider (opcional)
        setInterval(() => {
            showSlide(currentSlide + 1);
        }, 5000);
    }
    
    // Animação de scroll suave para links de navegação
    const navLinks = document.querySelectorAll('header a, .mobile-nav a, .footer-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Verificar se o link tem um hash (âncora)
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#') && targetId.length > 1) {
                e.preventDefault();
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Calcular a posição de rolagem considerando o header fixo
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Formulário de contato
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Aqui você pode adicionar a lógica para enviar o formulário
            // Por exemplo, usando fetch para enviar os dados para um backend
            
            // Simulação de envio bem-sucedido
            alert('Mensagem enviada com sucesso! Obrigado pelo contato.');
            contactForm.reset();
        });
    }
    
    // Efeito de destaque nos links de navegação com base na seção visível
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.desktop-nav a');
    
    function highlightNavItem() {
        const scrollPosition = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavItem);
    
    // Animações de entrada para elementos quando ficam visíveis
    function animateOnScroll() {
        const elements = document.querySelectorAll('.skills-column, .project-showcase, .contact-form');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animate');
            }
        });
    }
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Executar uma vez no carregamento da página
});
