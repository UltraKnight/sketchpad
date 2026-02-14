const container = document.querySelector('.container');
const newGridButton = document.getElementById('change-grid-size');
const randomColorsCheckbox = document.getElementById('random-colors');

let isRandomColor = false;

randomColorsCheckbox.addEventListener('change', (e) => {
  isRandomColor = e.target.checked;
});

newGridButton.addEventListener('click', () => {
  const newSize = prompt('Enter new grid size (e.g., 16 for 16x16):');
  if (newSize && !Number.isNaN(newSize) && newSize > 0) {
    gridSize = Number.parseInt(newSize);
    createGrid(gridSize);
  } else {
    alert('Please enter a valid positive number.');
  }
});

let gridSize = 16;

function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

function createGrid(size) {
  container.innerHTML = ''; // Clear existing grid
  for (let i = 1; i <= size * size; i++) {
    const numberOfGaps = size - 1;
    const gapSize = 1;
    const secureOffset = 100; // Account for body margin and other elements
    const cell = document.createElement('div');
    const opacityAddition = 10 / 100; // 10% opacity increase on each hover
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const minorViewportDimension = Math.min(viewportWidth, viewportHeight) - secureOffset;
    container.style.width = `${minorViewportDimension}px`;
    container.style.height = `${minorViewportDimension}px`;

    container.style.gap = `${gapSize}px`;

    cell.classList.add('cell');
    cell.style.width = `${(minorViewportDimension - numberOfGaps * gapSize) / size}px`;
    cell.style.height = `${(minorViewportDimension - numberOfGaps * gapSize) / size}px`;
    cell.style.opacity = opacityAddition;

    cell.addEventListener('mouseenter', (e) => {
      // need parseFloat because it is a string
      e.target.style.opacity = Math.min(Number.parseFloat(e.target.style.opacity) + opacityAddition, 1);
      e.target.style.backgroundColor = isRandomColor ? getRandomColor() : 'black';
    });

    cell.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      if (target?.classList.contains('cell')) {
        target.style.opacity = Math.min(Number.parseFloat(target.style.opacity) + opacityAddition, 1);
        target.style.backgroundColor = isRandomColor ? getRandomColor() : 'black';
      }
    });

    container.appendChild(cell);
  }
}

createGrid(gridSize);
