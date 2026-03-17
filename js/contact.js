// ===== Contact Form =====
export function initContact() {
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');

  if (!form || !statusEl) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('.form-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '⏳ Enviando...';
    submitBtn.disabled = true;

    try {
      const formData = new FormData(form);

      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        statusEl.className = 'form-status success';
        const lang = document.documentElement.lang || 'es';
        statusEl.textContent = lang === 'es'
          ? '✅ ¡Mensaje enviado correctamente! Te responderé pronto.'
          : '✅ Message sent successfully! I\'ll get back to you soon.';
        form.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      statusEl.className = 'form-status error';
      const lang = document.documentElement.lang || 'es';
      statusEl.textContent = lang === 'es'
        ? '❌ Error al enviar. Intenta de nuevo o escríbeme directamente.'
        : '❌ Failed to send. Try again or email me directly.';
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;

      setTimeout(() => {
        statusEl.className = 'form-status';
        statusEl.textContent = '';
      }, 5000);
    }
  });
}
