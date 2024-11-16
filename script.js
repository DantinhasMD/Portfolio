function toggleMenu() {
    const nav = document.querySelector('.nav');
    nav.classList.toggle('active');
}


const images = document.querySelectorAll('.carousel-images img');
let currentIndex = 0;

document.querySelector('.next').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateCarousel();
});

document.querySelector('.prev').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateCarousel();
});

function updateCarousel() {
    const offset = -currentIndex * 100;
    images.forEach(img => {
        img.style.transform = `translateX(${offset}%)`;
    });
}

document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Form Submitted Successfully!');
});
