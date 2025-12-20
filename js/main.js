// Material 3 Portfolio Scripts
// Features: Advanced Antigravity Particle Engine (High Performance), Theme Toggler

/* --- Theme Manager --- */
class ThemeManager {
    constructor() {
        this.toggleBtn = document.getElementById('theme-toggle');
        this.body = document.body;
        this.icon = this.toggleBtn ? this.toggleBtn.querySelector('i') : null;

        // Init
        this.currentTheme = localStorage.getItem('theme') ||
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

        this.applyTheme(this.currentTheme);

        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.toggle());
        }
    }

    applyTheme(theme) {
        this.currentTheme = theme;
        this.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Update Icon
        if (this.icon) {
            this.icon.setAttribute('data-feather', theme === 'dark' ? 'sun' : 'moon');
            feather.replace();
        }

        // Notify Particle System to update colors
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: theme }));
    }

    toggle() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }
}

/* --- Advanced Antigravity Engine (Swarm/Network) --- */
class AntigravityEngine {
    constructor() {
        this.canvas = document.getElementById('antigravity-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: -1000, y: -1000 };

        // Configuration
        this.particleCount = window.innerWidth < 768 ? 60 : 180; // Denser cloud
        this.connectiondist = 140; // Distance to draw lines
        this.colors = this.getThemeColors();

        this.init();
        this.animate();
        this.addEventListeners();
    }

    getThemeColors() {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        return {
            particles: isDark ? ['#ADC6FF', '#D8E2FF', '#004494'] : ['#005AC1', '#575E71', '#D8E2FF'],
            line: isDark ? 'rgba(216, 226, 255, 0.08)' : 'rgba(0, 90, 193, 0.08)'
        };
    }

    init() {
        this.resize();
        this.createParticles();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new Particle(this.canvas, this.colors.particles));
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        this.particles.forEach(p => {
            p.update(this.mouse);
            p.draw(this.ctx);
        });

        // Draw Connections (Network Effect)
        this.drawConnections();

        requestAnimationFrame(this.animate.bind(this));
    }

    drawConnections() {
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = this.colors.line;

        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.connectiondist) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    addEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('themeChanged', () => {
            this.colors = this.getThemeColors();
            this.particles.forEach(p => p.updateColors(this.colors.particles));
        });
    }
}

class Particle {
    constructor(canvas, colors) {
        this.canvas = canvas;
        this.colors = colors;
        this.init();
    }

    init() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.size = Math.random() * 2.5 + 1.5;
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];

        // Physics
        this.vx = (Math.random() - 0.5) * 1.5; // Faster default speed
        this.vy = (Math.random() - 0.5) * 1.5;

        this.baseX = this.x;
        this.baseY = this.y;
    }

    updateColors(newColors) {
        this.colors = newColors;
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    }

    update(mouse) {
        // Simple Physics
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;

        // Mouse Interaction (Magnetic Repulsion)
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const forceRadius = 150;

        if (distance < forceRadius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (forceRadius - distance) / forceRadius;

            // Push away stronger
            const directionX = forceDirectionX * force * 5;
            const directionY = forceDirectionY * force * 5;

            this.x -= directionX;
            this.y -= directionY;
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new AntigravityEngine();

    // Initialize Icons
    if (window.feather) feather.replace();
});
