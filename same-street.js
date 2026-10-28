const visual = document.querySelector('.street-visual');
const toggle = document.querySelector('.perspective-toggle');

if (visual && toggle) {
  toggle.addEventListener('click', () => {
    const zombie = visual.dataset.mode === 'zombie';
    visual.dataset.mode = zombie ? 'human' : 'zombie';
    toggle.setAttribute('aria-pressed', String(!zombie));
    visual.querySelector('.mode-label').textContent = zombie ? 'HUMAN LOOP · PANIC' : 'ZOMBIE LOOP · ATTACK MODE';
    visual.querySelector('.goal-label').textContent = zombie ? 'ESCAPE' : 'CATCH THEM';
    visual.querySelector('.distance-label').textContent = zombie ? 'THEY ARE GETTING CLOSER' : 'YOU ARE GETTING CLOSER';
  });
}
