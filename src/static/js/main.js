const cursor = document.getElementById('cursor');
const slow = cursor.querySelector('.slow');
const fast = cursor.querySelector('.fast');
const slowScaler = slow.querySelector('.scaler');
const fastScaler = fast.querySelector('.scaler');

let mouseX = 0, mouseY = 0;
let slowX = 0, slowY = 0;
let fastX = 0, fastY = 0;
let scale = 1;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

document.addEventListener('mousedown', () => {
  scale = 0.5;
});
document.addEventListener('mouseup', () => {
  scale = 1;
});

function animate() {
  slowX += (mouseX - slowX) * 0.1;
  slowY += (mouseY - slowY) * 0.1;

  fastX += (mouseX - fastX) * 0.25;
  fastY += (mouseY - fastY) * 0.25;

  slow.style.transform = `translate(${slowX}px, ${slowY}px) translate(-50%, -50%)`;
  fast.style.transform = `translate(${fastX}px, ${fastY}px) translate(-50%, -50%)`;

  slowScaler.style.transform = `scale(${scale})`;

  requestAnimationFrame(animate);
}

animate();
