// ===== Starfield Canvas Animation =====
export function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let stars = [];
  let nebulae = [];
  let animationId;

  const STAR_COUNT = 200;
  const NEBULA_COUNT = 3;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.3,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
        drift: (Math.random() - 0.5) * 0.1,
      });
    }
  }

  function createNebulae() {
    nebulae = [
      { x: width * 0.2, y: height * 0.3, radius: 300, color: 'rgba(124, 58, 237, 0.03)', speed: 0.0002 },
      { x: width * 0.8, y: height * 0.2, radius: 250, color: 'rgba(37, 99, 235, 0.025)', speed: 0.00015 },
      { x: width * 0.5, y: height * 0.8, radius: 280, color: 'rgba(6, 182, 212, 0.02)', speed: 0.00025 },
    ];
  }

  function drawStar(star, time) {
    const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.5 + 0.5;
    const alpha = star.opacity * twinkle;

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200, 215, 255, ${alpha})`;
    ctx.fill();

    // Subtle glow for brighter stars
    if (star.radius > 1) {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(150, 180, 255, ${alpha * 0.15})`;
      ctx.fill();
    }
  }

  function drawNebula(nebula, time) {
    const pulse = Math.sin(time * nebula.speed) * 0.3 + 0.7;
    const gradient = ctx.createRadialGradient(
      nebula.x, nebula.y, 0,
      nebula.x, nebula.y, nebula.radius * pulse
    );
    gradient.addColorStop(0, nebula.color);
    gradient.addColorStop(1, 'transparent');

    ctx.beginPath();
    ctx.arc(nebula.x, nebula.y, nebula.radius * pulse, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  function animate(time) {
    ctx.clearRect(0, 0, width, height);

    // Draw nebulae
    nebulae.forEach(n => drawNebula(n, time));

    // Draw and update stars
    stars.forEach(star => {
      drawStar(star, time);
      star.y += star.drift;
      if (star.y < -5) star.y = height + 5;
      if (star.y > height + 5) star.y = -5;
    });

    animationId = requestAnimationFrame(animate);
  }

  // Shoot stars occasionally
  function shootingStar() {
    const x = Math.random() * width;
    const y = Math.random() * height * 0.5;
    const length = Math.random() * 80 + 40;
    const speed = Math.random() * 4 + 3;
    const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
    let progress = 0;

    function drawShoot() {
      if (progress > 1) return;
      progress += 0.02 * speed;

      const currentX = x + Math.cos(angle) * length * progress;
      const currentY = y + Math.sin(angle) * length * progress;
      const tailX = x + Math.cos(angle) * length * Math.max(0, progress - 0.3);
      const tailY = y + Math.sin(angle) * length * Math.max(0, progress - 0.3);

      const grad = ctx.createLinearGradient(tailX, tailY, currentX, currentY);
      grad.addColorStop(0, 'rgba(200, 220, 255, 0)');
      grad.addColorStop(1, `rgba(200, 220, 255, ${1 - progress})`);

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(currentX, currentY);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      requestAnimationFrame(drawShoot);
    }

    drawShoot();
  }

  // Init
  resize();
  createStars();
  createNebulae();
  animate(0);

  // Occasional shooting stars
  setInterval(shootingStar, 4000 + Math.random() * 6000);

  // Handle resize
  window.addEventListener('resize', () => {
    resize();
    createStars();
    createNebulae();
  });

  return () => cancelAnimationFrame(animationId);
}
