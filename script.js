// Ginawa natin itong class para organize ang code
class ValorantCarousel {
    constructor() {
        // State variables ng carousel
        this.currentSlide = 0; // unang slide
        this.totalSlides = 8; // total number ng slides
        this.isPlaying = true; // autoplay enabled by default
        this.autoPlayInterval = null;
        this.progressInterval = null;
        this.slideInterval = 4000; // 4 seconds per slide
        this.progressWidth = 0;
        
        // Kukunin natin ang mga DOM elements
        this.track = document.getElementById('carouselTrack');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.helpBtn = document.getElementById('helpBtn');
        this.dotsContainer = document.getElementById('dotsContainer');
        this.progressBar = document.getElementById('progressBar');
        this.shortcutsInfo = document.getElementById('shortcutsInfo');
        
        this.init(); // start setup
    }
    
    init() {
        this.createDots(); // create dots indicator
        this.bindEvents(); // lagay ng listeners sa buttons/keyboard
        this.startAutoPlay(); // start ng auto slide
        this.startProgress(); // start ng progress bar animation
        this.updateSlide(); // ipakita unang slide
    }
    
    createDots() {
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = `dot ${i === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }
    
    bindEvents() {
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Control buttons
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.shuffleBtn.addEventListener('click', () => this.shuffleSlides());
        this.helpBtn.addEventListener('click', () => this.toggleHelp());
        
        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Touch events para sa swipe sa mobile
        let startX = 0;
        let endX = 0;
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        this.track.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide(); // swipe left -> next
                } else {
                    this.prevSlide(); // swipe right -> prev
                }
            }
        });
        
        // Mouse hover pause
        this.track.addEventListener('mouseenter', () => {
            if (this.isPlaying) {
                this.pauseAutoPlay();
            }
        });
        
        this.track.addEventListener('mouseleave', () => {
            if (this.isPlaying) {
                this.startAutoPlay();
            }
        });
    }
    
    updateSlide() {
        // Galawin ang track gamit transform
        const translateX = -this.currentSlide * (100 / this.totalSlides);
        this.track.style.transform = `translateX(${translateX}%)`;
        
        // Update active slide
        const slides = document.querySelectorAll('.carousel-slide');
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });
        
        // Update dots
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
        
        // Reset ng progress bar
        this.resetProgress();
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSlide();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlide();
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlide();
    }
    
    togglePlayPause() {
        this.isPlaying = !this.isPlaying;
        if (this.isPlaying) {
            this.startAutoPlay();
            this.startProgress();
            this.playPauseBtn.textContent = '⏸️ Pause';
            this.playPauseBtn.classList.add('active');
        } else {
            this.pauseAutoPlay();
            this.pauseProgress();
            this.playPauseBtn.textContent = '▶️ Play';
            this.playPauseBtn.classList.remove('active');
        }
    }
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => this.nextSlide(), this.slideInterval);
    }
    
    pauseAutoPlay() {
        clearInterval(this.autoPlayInterval);
    }
    
    shuffleSlides() {
        const slides = Array.from(this.track.children);
        for (let i = slides.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            this.track.appendChild(slides[j]);
        }
        this.currentSlide = 0;
        this.updateSlide();
    }
    
    handleKeyboard(e) {
        switch(e.key.toLowerCase()) {
            case 'arrowleft':
                this.prevSlide();
                break;
            case 'arrowright':
                this.nextSlide();
                break;
            case ' ':
                e.preventDefault();
                this.togglePlayPause();
                break;
            case 's':
                this.shuffleSlides();
                break;
            case 'h':
                this.toggleHelp();
                break;
            default:
                if (!isNaN(parseInt(e.key)) && parseInt(e.key) >= 1 && parseInt(e.key) <= this.totalSlides) {
                    this.goToSlide(parseInt(e.key) - 1);
                }
        }
    }
    
    toggleHelp() {
        this.shortcutsInfo.classList.toggle('show');
    }
    
    startProgress() {
        this.progressWidth = 0;
        this.progressInterval = setInterval(() => {
            this.progressWidth += (100 / (this.slideInterval / 100));
            if (this.progressWidth >= 100) {
                this.progressWidth = 0;
            }
            this.progressBar.style.width = `${this.progressWidth}%`;
        }, 100);
    }
    
    pauseProgress() {
        clearInterval(this.progressInterval);
    }
    
    resetProgress() {
        this.pauseProgress();
        this.progressBar.style.width = '0%';
        if (this.isPlaying) {
            this.startProgress();
        }
    }
}

// Initialize natin ang carousel kapag loaded na page
document.addEventListener('DOMContentLoaded', () => {
    new ValorantCarousel();
});
