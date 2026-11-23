(() => {
  const canvas = document.querySelector('#hero-particle-sphere');
  if (!canvas) return;

  const context = canvas.getContext('2d', { alpha: true });
  const host = canvas.parentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const points = [];
  const pointCount = reducedMotion ? 900 : 1800;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let index = 0; index < pointCount; index += 1) {
    const y = 1 - (index / (pointCount - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const angle = goldenAngle * index;
    points.push({
      x: Math.cos(angle) * radius,
      y,
      z: Math.sin(angle) * radius,
      seed: Math.random()
    });
  }

  let width = 1;
  let height = 1;
  let pixelRatio = 1;
  let yaw = -0.45;
  let pitch = -0.12;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let pointerX = -9999;
  let pointerY = -9999;
  let hover = false;
  let pulse = 0;
  let frame = 0;

  function resize() {
    const bounds = host.getBoundingClientRect();
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    draw();
  }

  function rotatePoint(point) {
    const cosY = Math.cos(yaw);
    const sinY = Math.sin(yaw);
    const x1 = point.x * cosY - point.z * sinY;
    const z1 = point.x * sinY + point.z * cosY;
    const cosX = Math.cos(pitch);
    const sinX = Math.sin(pitch);
    return {
      x: x1,
      y: point.y * cosX - z1 * sinX,
      z: point.y * sinX + z1 * cosX
    };
  }

  function draw() {
    context.clearRect(0, 0, width, height);
    const baseRadius = Math.min(width, height) * 0.38;
    const centerX = width / 2;
    const centerY = height / 2;
    const projected = [];

    for (const point of points) {
      const rotated = rotatePoint(point);
      const perspective = 1 / (1.7 - rotated.z * 0.42);
      let x = centerX + rotated.x * baseRadius * perspective;
      let y = centerY + rotated.y * baseRadius * perspective;
      const distance = Math.hypot(x - pointerX, y - pointerY);
      if (hover && distance < 82) {
        const force = (1 - distance / 82) * 20;
        const direction = Math.atan2(y - pointerY, x - pointerX);
        x += Math.cos(direction) * force;
        y += Math.sin(direction) * force;
      }
      if (pulse > 0) {
        x += rotated.x * pulse * 7;
        y += rotated.y * pulse * 7;
      }
      projected.push({ x, y, z: rotated.z, seed: point.seed });
    }

    projected.sort((a, b) => a.z - b.z);
    for (const point of projected) {
      const depth = (point.z + 1) / 2;
      const size = 0.7 + depth * 2.1 + point.seed * 0.5;
      const alpha = 0.24 + depth * 0.68;
      context.beginPath();
      context.arc(point.x, point.y, size, 0, Math.PI * 2);
      context.fillStyle = depth > 0.72
        ? `rgba(212,255,79,${alpha})`
        : `rgba(16,18,15,${alpha})`;
      context.fill();
    }
  }

  function animate() {
    if (!dragging) yaw += hover ? 0.0012 : 0.0024;
    pulse *= 0.9;
    draw();
    frame = window.requestAnimationFrame(animate);
  }

  function updatePointer(event) {
    const bounds = canvas.getBoundingClientRect();
    pointerX = event.clientX - bounds.left;
    pointerY = event.clientY - bounds.top;
  }

  canvas.addEventListener('pointerenter', (event) => {
    hover = true;
    updatePointer(event);
  });
  canvas.addEventListener('pointermove', (event) => {
    updatePointer(event);
    if (!dragging) return;
    yaw += (event.clientX - lastX) * 0.008;
    pitch = Math.max(-1, Math.min(1, pitch + (event.clientY - lastY) * 0.006));
    lastX = event.clientX;
    lastY = event.clientY;
  });
  canvas.addEventListener('pointerleave', () => {
    hover = false;
    dragging = false;
    pointerX = -9999;
    pointerY = -9999;
  });
  canvas.addEventListener('pointerdown', (event) => {
    dragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
    pulse = 1;
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointerup', (event) => {
    dragging = false;
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  });

  new ResizeObserver(resize).observe(host);
  resize();
  if (!reducedMotion) {
    frame = window.requestAnimationFrame(animate);
  }

  window.addEventListener('pagehide', () => window.cancelAnimationFrame(frame), { once: true });
})();