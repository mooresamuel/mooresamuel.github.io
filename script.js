    const loadingOverlay = document.getElementById('loading-overlay');
    const video = document.getElementById('background-video');

    video.addEventListener('canplaythrough', () => {
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }

    video.preload = 'auto';
    video.playbackRate = 0.25;

    fetch('images.json')
        .then(response => response.json())
        .then(images => {
            const carousel = document.querySelector('.carousel');
            images.forEach((image, index) => {
                const slide = document.createElement('div');
                slide.classList.add('carousel-slide');
                if (index === 0) {
                    slide.classList.add('active');
                    slide.addEventListener('animationend', expandDone); // Add event listener to the first slide
                }
                slide.innerHTML = `<img src="images/${image}" alt="Image ${index + 1}">`;
                carousel.appendChild(slide);
            });

            let currentSlide = 0;
            const slides = document.querySelectorAll('.carousel-slide');
            const totalSlides = slides.length;
            let startX, endX, touchTimer;

            function showSlide(index) {
                slides.forEach((slide, i) => {
                    if (i === index) {
                        slide.classList.add('active');
                        slide.classList.remove('hidden', 'disolve');
                        slide.addEventListener('animationend', expandDone);
                    }
                });
            }

            function expandDone(event) {
                const slide = event.target;
                slide.removeEventListener('animationend', expandDone);
                slide.classList.add('disolve');
                nextSlide();
                slide.addEventListener('animationend', disolveDone);
            }

            function disolveDone(event) {
                const slide = event.target;
                slide.removeEventListener('animationend', disolveDone);
                slide.classList.add('hidden');

            }
            
            function nextSlide() {
                currentSlide = (currentSlide + 1) % totalSlides;
                showSlide(currentSlide);
            }

            function getNextSlide() {
                const activeSlides = document.querySelectorAll('.carousel-slide.active');
                activeSlides.forEach(activeSlide => {
                    if (activeSlide) {
                        activeSlide.classList.remove('active', 'disolve');
                        activeSlide.classList.add('hidden');
                    }
                });
                currentSlide = (currentSlide + 1) % totalSlides;
                showSlide(currentSlide);
            }

            function prevSlide() {
            const activeSlides = document.querySelectorAll('.carousel-slide.active');
            activeSlides.forEach(activeSlide => {
                if (activeSlide) {
                    activeSlide.classList.remove('active', 'disolve');
                    activeSlide.classList.add('hidden');
                }
            });
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
                showSlide(currentSlide);
            }
    
            const carouselContainer = document.querySelector('.carousel-container');          
            function showOverlay() {
                return new Promise((resolve) => {
                    const current = slides[currentSlide];
                    const imageUrl = current.querySelector('img').src;
                    current.classList.add('hidden');
                    slides[currentSlide].classList.remove('active');
                    const overlay = document.createElement('div');
                    overlay.classList.add('overlay');
                    overlay.innerHTML = `
                        <img src="${imageUrl}";">
                        <button id="closeOverlay" class="close-button">&times;</button>
                    `;
                    document.body.appendChild(overlay);

                    document.getElementById('closeOverlay').addEventListener('click', () => {
                        handleClose(currentSlide);
                        resolve();
                    });
                });
            }     

            function handleClose() {
                const overlay = document.querySelector('.overlay');
                if (overlay) {
                    overlay.remove();
                }
                slides.forEach(slide => slide.classList.remove('paused'));
                getNextSlide();
            }

            function handleStart(e) {
                e.preventDefault();
                startX = e.touches ? e.touches[0].clientX : e.clientX;
                slides.forEach(slide => slide.classList.add('paused'));
            
                touchTimer = setTimeout(async function() {
                    slides[currentSlide].classList.add('hidden',);
                    await showOverlay();
                }, 500);
                slides[currentSlide].classList.remove('hidden');
                startX = e.touches ? e.touches[0].clientX : e.clientX;
            }
            
            function handleEnd(e) {
                e.preventDefault();
                clearTimeout(touchTimer);
                endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
                if (!document.querySelector('.overlay')) {
                    slides.forEach(slide => slide.classList.remove('paused'));
                }   
                if (Math.abs(startX - endX) > 10) {
                    if (startX > endX + 10) {
                        prevSlide();
                    } else if (startX < endX - 10) {
                        getNextSlide();
                    }
                }
                showSlide(currentSlide);
            }
            carouselContainer.addEventListener('touchstart', handleStart);
            carouselContainer.addEventListener('mousedown', handleStart);      
            carouselContainer.addEventListener('touchend', handleEnd);
            carouselContainer.addEventListener('mouseup', handleEnd);

    })
    .catch(error => console.error('Error fetching images:', error));
});