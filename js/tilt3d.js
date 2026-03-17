// ===== 3D Tilt Effect for Hero Orbit =====
export function initTilt3D() {
  const container = document.getElementById('hero-3d-tilt');
  if (!container) return;

  const heroVisual = container.parentElement;
  if (!heroVisual) return;

  // Check for touch device — skip tilt on mobile
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  const maxTilt = 15; // max degrees
  let currentX = 0, currentY = 0;
  let targetX = 0, targetY = 0;
  let rafId = null;

  heroVisual.addEventListener('mousemove', (e) => {
    const rect = heroVisual.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Normalize to -1 → 1
    const normX = (e.clientX - centerX) / (rect.width / 2);
    const normY = (e.clientY - centerY) / (rect.height / 2);

    targetX = normY * maxTilt * -1; // rotateX: vertical mouse → inverted
    targetY = normX * maxTilt;      // rotateY: horizontal mouse
  });

  heroVisual.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
  });

  // Smooth animation loop
  function animate() {
    // Lerp
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    // Apply transform
    container.style.transform = `
      rotateX(${currentX.toFixed(2)}deg)
      rotateY(${currentY.toFixed(2)}deg)
      translateZ(0)
    `;

    // Move icons slightly based on tilt for parallax depth
    const icons = container.querySelectorAll('.orbit-icon');
    icons.forEach((icon, i) => {
      const depth = 10 + (i % 3) * 8; // varied depth per icon
      const px = currentY * depth * 0.05;
      const py = currentX * depth * -0.05;
      icon.style.setProperty('--tilt-x', `${px.toFixed(1)}px`);
      icon.style.setProperty('--tilt-y', `${py.toFixed(1)}px`);
    });

    rafId = requestAnimationFrame(animate);
  }

  animate();

  return () => cancelAnimationFrame(rafId);
}
