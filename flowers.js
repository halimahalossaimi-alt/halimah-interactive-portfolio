const field = document.querySelector('#flower-field');

if (field) {
  const profiles = [
    { name: 'rounded', minPetals: 6, maxPetals: 9, width: .62, height: 1 },
    { name: 'pointed', minPetals: 7, maxPetals: 11, width: .5, height: 1.08 },
    { name: 'lobed', minPetals: 5, maxPetals: 8, width: .76, height: .9 },
    { name: 'narrow', minPetals: 9, maxPetals: 13, width: .34, height: 1.12 }
  ];
  const hues = [18, 38, 54, 108, 154, 194, 218, 264, 314, 344];
  let lastProfile = -1;
  let lastHue = -1;

  const differentIndex = (length, previous) => {
    if (length < 2) return 0;
    let next = Math.floor(Math.random() * length);
    while (next === previous) next = Math.floor(Math.random() * length);
    return next;
  };

  function plantFlower(x, y) {
    const profileIndex = differentIndex(profiles.length, lastProfile);
    const hueIndex = differentIndex(hues.length, lastHue);
    lastProfile = profileIndex;
    lastHue = hueIndex;

    const profile = profiles[profileIndex];
    const hue = hues[hueIndex] + Math.round(Math.random() * 12 - 6);
    const size = Math.round(50 + Math.random() * 78);
    const petals = Math.round(profile.minPetals + Math.random() * (profile.maxPetals - profile.minPetals));
    const rotation = Math.random() * 360;
    const flower = document.createElement('span');
    flower.className = `flower ${profile.name}`;
    flower.style.left = `${x}px`;
    flower.style.top = `${y}px`;
    flower.style.setProperty('--hue', hue);
    flower.style.setProperty('--center-hue', (hue + 42) % 360);
    flower.style.setProperty('--center', `${Math.max(14, size * .22)}px`);
    flower.style.setProperty('--pw', `${size * profile.width}px`);
    flower.style.setProperty('--ph', `${size * .55 * profile.height}px`);

    for (let i = 0; i < petals; i += 1) {
      const petal = document.createElement('span');
      petal.className = 'petal';
      const angle = rotation + (360 / petals) * i;
      petal.style.transform = `rotate(${angle}deg) translateY(${-size * .08}px)`;
      flower.appendChild(petal);
    }

    const center = document.createElement('span');
    center.className = 'flower-center';
    flower.appendChild(center);
    field.appendChild(flower);
  }

  field.addEventListener('pointerdown', (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    const rect = field.getBoundingClientRect();
    plantFlower(event.clientX - rect.left, event.clientY - rect.top);
  });

  field.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const rect = field.getBoundingClientRect();
      plantFlower(rect.width / 2, rect.height / 2);
    }
  });
}
