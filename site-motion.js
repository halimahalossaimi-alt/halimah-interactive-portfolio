document.documentElement.classList.add('has-js');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reducedMotion) {
  const revealItems = document.querySelectorAll('main > section, .project-card, .proposal-section > *');
  revealItems.forEach((item) => item.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });

  revealItems.forEach((item) => observer.observe(item));

  if (window.matchMedia('(pointer: fine)').matches) {
    const halo = document.createElement('div');
    halo.className = 'cursor-halo';
    halo.setAttribute('aria-hidden', 'true');
    document.body.appendChild(halo);

    window.addEventListener('pointermove', (event) => {
      halo.style.setProperty('--cursor-x', `${event.clientX}px`);
      halo.style.setProperty('--cursor-y', `${event.clientY}px`);
      document.documentElement.style.setProperty('--pointer-x', `${event.clientX / window.innerWidth - 0.5}`);
      document.documentElement.style.setProperty('--pointer-y', `${event.clientY / window.innerHeight - 0.5}`);
    }, { passive: true });
  }
}
