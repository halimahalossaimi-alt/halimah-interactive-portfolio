const field = document.querySelector('#flower-field');

if (field) {
  const colors = ['#679d79', '#4b9989', '#a8ba66', '#d493b5', '#aa8ac7', '#e4a45d'];
  let lastColor = -1;
  let lastShape = -1;
  const choose = (length, previous) => {
    let next;
    do { next = Math.floor(Math.random() * length); } while (next === previous);
    return next;
  };
  function plantTree(x, y) {
    const colorIndex = choose(colors.length, lastColor);
    const shape = choose(4, lastShape);
    lastColor = colorIndex;
    lastShape = shape;
    const crowns = [
      '<circle cx="50" cy="37" r="30"/>',
      '<path d="M50 5 77 40H65L85 66H15L35 40H23Z"/>',
      '<ellipse cx="50" cy="38" rx="24" ry="34"/>',
      '<path d="M24 65C3 57 10 35 23 31C14 11 40 0 50 12C66-2 90 14 78 31C98 41 89 65 73 66Z"/>'
    ];
    const size = Math.round(66 + Math.random() * 48);
    const tree = document.createElement('span');
    tree.className = 'planted-tree';
    tree.setAttribute('aria-hidden', 'true');
    tree.style.left = x + 'px';
    tree.style.top = y + 'px';
    tree.style.width = size + 'px';
    tree.innerHTML = '<svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="103" rx="24" ry="5" fill="#302047" opacity=".12"/><path d="M46 100V43h8v57Z" fill="#805943"/><g fill="' + colors[colorIndex] + '" stroke="#302047" stroke-opacity=".12" stroke-width="2">' + crowns[shape] + '</g><path d="M50 96V42m0 31L37 60m13 2 12-12" fill="none" stroke="#805943" stroke-width="4" stroke-linecap="round"/></svg>';
    field.appendChild(tree);
    const note = field.querySelector('.field-note');
    if (note) note.hidden = true;
  }
  field.addEventListener('pointerdown', (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    const rect = field.getBoundingClientRect();
    plantTree(event.clientX - rect.left, event.clientY - rect.top);
  });
  field.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const rect = field.getBoundingClientRect();
      plantTree(rect.width * (.15 + Math.random() * .7), rect.height * (.2 + Math.random() * .6));
    }
  });
}
