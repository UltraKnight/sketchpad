const container = document.querySelector('.container');
const newGridButton = document.getElementById('change-grid-size');
const randomColorsCheckbox = document.getElementById('random-colors');

let isRandomColor = randomColorsCheckbox.checked;

randomColorsCheckbox.addEventListener('change', (e) => {
  isRandomColor = e.target.checked;
});

newGridButton.addEventListener('click', () => {
  const newSize = prompt('Enter new grid size (e.g., 16 for 16x16), max 100:', '16');
  if (newSize && !Number.isNaN(newSize) && newSize > 0 && newSize <= 100) {
    gridSize = Number.parseInt(newSize);
    createGrid(gridSize);
  } else {
    alert('Please enter a valid positive number.');
  }
});

let gridSize = 16;
const initialColor = { r: 255, g: 255, b: 255 }; // Default to white
const opacityAddition = 10 / 100; // 10% opacity increase on each hover

function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return { r, g, b };
}

// keep the state of the last hovered element in touch devices
// avoid increasing the alpha property quickly when moving the finger on the same cell
let previousTargetName = null;

function handleHover(e) {
  e.preventDefault();
  const isTouchEvent = e.type === 'touchmove';
  const target = isTouchEvent ? document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY) : e.target;
  const targetName = target.getAttribute('name');
  target.classList.remove('no-print');

  if (!target?.classList.contains('cell') || previousTargetName === targetName) return;

  previousTargetName = targetName;

  if (!target.dataset.alpha) target.dataset.alpha = opacityAddition;

  let alpha = parseFloat(target.dataset.alpha);
  alpha = Math.min(alpha + opacityAddition, 1);
  target.dataset.alpha = alpha;

  const currentCellColor = target.style.backgroundColor;
  const [r, g, b, a = 0] = currentCellColor.match(/[\d.]+/g).map(Number);
  const { r: initialR, g: initialG, b: initialB } = initialColor;

  // set the new color if hovered for the first time
  if (r === initialR && g === initialG && b === initialB) {
    const newColor = isRandomColor ? getRandomColor() : { r: 0, g: 0, b: 0 }; // Default to black if not random
    target.style.backgroundColor = `rgba(${newColor.r}, ${newColor.g}, ${newColor.b}, 0.1)`;
    return;
  }

  target.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function resizeContainer() {
  const clientWidth = window.innerWidth;
  const clientHeight = window.innerHeight;
  const size = Math.min(clientWidth, clientHeight);

  container.style.width = `${size}px`;
  container.style.height = `${size}px`;
}

resizeContainer();
window.addEventListener('resize', resizeContainer);

function createGrid(size = gridSize) {
  container.innerHTML = ''; // Clear existing grid
  const fragment = document.createDocumentFragment();
  const cellSize = 100 / size;

  for (let i = 1; i <= size * size; i++) {
    const cell = document.createElement('div');

    cell.classList.add('cell', 'no-print');
    cell.style.height = `${cellSize}%`;
    cell.style.width = `${cellSize}%`;
    cell.setAttribute('name', i);
    cell.style.backgroundColor = `rgb(${initialColor.r}, ${initialColor.g}, ${initialColor.b})`;

    fragment.appendChild(cell);
  }
  container.appendChild(fragment);

  container.removeEventListener('pointerover', handleHover);
  container.removeEventListener('touchmove', handleHover);

  container.addEventListener('pointerover', handleHover);
  container.addEventListener('touchmove', handleHover, { passive: false });
}

createGrid(gridSize);
