// ========== PRELOADER ==========
window.addEventListener("load", () => {
    const preloader = document.querySelector(".preloader");
    if (preloader) {
        preloader.style.opacity = "0";
        setTimeout(() => {
            preloader.style.display = "none";
        }, 500);
    }
});

// ========== HERO ANIMATION (Canvas) ==========
(function initHeroAnimation() {
    let canvas = document.getElementById("heroAnimation");
    if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.id = "heroAnimation";
        canvas.style.position = "absolute";
        canvas.style.top = "0";
        canvas.style.left = "0";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.pointerEvents = "none";
        const heroSection = document.querySelector(".hero-section");
        if (heroSection) {
            heroSection.insertBefore(canvas, heroSection.firstChild);
        } else {
            return;
        }
    }

    const ctx = canvas.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    let particles = [];
    let pulsatingCircles = [];
    
    function initAnimation() {
        resizeCanvas();
        
        const particleCount = Math.min(70, Math.floor(width / 20));
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 4 + 1.5,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                opacity: Math.random() * 0.35 + 0.1,
                color: `rgba(0, 87, 179, ${Math.random() * 0.3 + 0.1})`
            });
        }
        
        const circleCount = Math.min(8, Math.floor(width / 200) + 4);
        pulsatingCircles = [];
        for (let i = 0; i < circleCount; i++) {
            pulsatingCircles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                minRadius: Math.random() * 60 + 30,
                maxRadius: Math.random() * 120 + 80,
                speed: 0.003 + Math.random() * 0.008,
                phase: Math.random() * Math.PI * 2,
                color: `rgba(0, 87, 179, ${0.02 + Math.random() * 0.04})`
            });
        }
    }
    
    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
    }
    
    function drawPulsatingCircles(time) {
        pulsatingCircles.forEach(circle => {
            const t = (time * circle.speed + circle.phase) % (Math.PI * 2);
            const radius = circle.minRadius + (circle.maxRadius - circle.minRadius) * (0.5 + 0.5 * Math.sin(t));
            
            ctx.beginPath();
            ctx.arc(circle.x, circle.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = circle.color;
            ctx.fill();
        });
    }
    
    function drawParticles() {
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            
            p.x += p.vx;
            p.y += p.vy;
            
            if (p.x < -20) p.x = width + 20;
            if (p.x > width + 20) p.x = -20;
            if (p.y < -20) p.y = height + 20;
            if (p.y > height + 20) p.y = -20;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        }
    }
    
    let stars = [];
    function initStars() {
        stars = [];
        const starCount = Math.min(150, Math.floor(width * height / 8000));
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.3 + 0.05
            });
        }
    }
    
    function drawStars() {
        stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 87, 179, ${star.opacity})`;
            ctx.fill();
        });
    }
    
    let animationTime = 0;
    
    function animate(timestamp) {
        if (!ctx) return;
        
        ctx.clearRect(0, 0, width, height);
        
        animationTime += 0.016;
        if (animationTime > Math.PI * 2) animationTime -= Math.PI * 2;
        
        drawPulsatingCircles(animationTime);
        drawStars();
        drawParticles();
        
        requestAnimationFrame(animate);
    }
    
    let resizeTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            resizeCanvas();
            initAnimation();
            initStars();
        }, 200);
    });
    
    initAnimation();
    initStars();
    requestAnimationFrame(animate);
})();

// ========== COPY IN CONTACT SECTION ==========
document.querySelectorAll(".detail-copy").forEach(btn => {
    btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const textToCopy = btn.getAttribute("data-copy");
        if (textToCopy) {
            try {
                await navigator.clipboard.writeText(textToCopy);
                const originalText = btn.textContent;
                btn.textContent = "Готово!";
                btn.style.background = "#555555";
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = "";
                }, 1200);
            } catch (err) {
                alert("Не удалось скопировать");
            }
        }
    });
});

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        if (targetId === "#") return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navHeight = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navHeight;
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });
});

// ========== MOBILE MENU ==========
const mobileToggle = document.getElementById("mobileToggle");
const navMenu = document.querySelector(".nav-menu");

if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        mobileToggle.classList.toggle("active");
    });
}

// ========== CATALOG BUTTON ==========
const catalogBtn = document.getElementById("catalogBtn");
if (catalogBtn) {
    catalogBtn.addEventListener("click", () => {
        const productsSection = document.getElementById("products");
        if (productsSection) {
            const navHeight = 80;
            const elementPosition = productsSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navHeight;
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });
}

// ========== SCROLL ANIMATION (Intersection Observer) ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -30px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    });
}, observerOptions);

document.querySelectorAll(".product-card, .benefit-card, .about-content, .contact-wrapper").forEach(el => {
    observer.observe(el);
});

// Also observe about-content if needed
const aboutContent = document.querySelector(".about-content");
if (aboutContent) observer.observe(aboutContent);