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


const date = document.querySelector('.current-date');
const clockEl = date.querySelector('h1');
const dateArEl = date.querySelector('p:nth-child(2)');
const dateFrEl = date.querySelector('p:nth-child(3)');
let filteredPrayers = []; // global
let prayerBoxes = [];     // global

const formatTimeUnit = unit => unit.toString().padStart(2, '0');

const hijriMonths = [
  "Muḥarram", "Ṣafar", "Rabīʿ al-awwal", "Rabīʿ ath-thānī",
  "Jumādá al-ūlá", "Jumādá al-ākhirah", "Rajab", "Shaʿbān",
  "Ramaḍān", "Shawwāl", "Dhū al-Qaʿdah", "Dhū al-Ḥijjah"
];

const updateTime = () => {
    const now = new Date();

    const time = [
        formatTimeUnit(now.getHours()),
        formatTimeUnit(now.getMinutes()),
        formatTimeUnit(now.getSeconds())
    ].join(':');
    clockEl.textContent = time;

    const optionsFr = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: '2-digit'
    };
    const dateFr = now.toLocaleDateString('fr-FR', optionsFr);
    dateFrEl.textContent = `${dateFr}`;

    const hijriParts = new Intl.DateTimeFormat("en-TN-u-ca-islamic", {
        day: "numeric",
        month: "numeric",
        year: "numeric"
    }).formatToParts(now);

    let hijriDay, hijriMonth, hijriYear;
    hijriParts.forEach(part => {
        if (part.type === "day") hijriDay = part.value.padStart(2, '0');
        if (part.type === "month") hijriMonth = parseInt(part.value, 10);
        if (part.type === "year") hijriYear = part.value;
    });

    const hijriMonthName = hijriMonths[hijriMonth - 1];
    const formattedHijriDate = `${hijriDay} ${hijriMonthName} ${hijriYear}`;
    dateArEl.textContent = formattedHijriDate;

    updateNextPrayerActive();
};

updateTime();
setInterval(updateTime, 1000);

fetch('/src/static/py/confData.json')
  .then(res => res.json())
  .then(data => {
    const now = new Date();
    const mois = now.getMonth();      // 0-based
    const jour = now.getDate();       // 1-based

    const calendar = data.calendar;
    const iqamaCalendar = data.iqamaCalendar;

    const prayers = calendar[mois][jour - 1];
    const iqamas = iqamaCalendar[mois][jour - 1];

    // remove shuruq
    filteredPrayers = [prayers[0], prayers[2], prayers[3], prayers[4], prayers[5]];
    const filteredIqamas = iqamas; // même ordre

    prayerBoxes = document.querySelectorAll('.prayer-box > div');

    filteredPrayers.forEach((time, i) => {
      const box = prayerBoxes[i];
      if (!box) return;

      const timeEl = box.querySelector('.time h1');
      const extraTimeEl = box.querySelector('.extra-time p');

      if (timeEl) timeEl.textContent = time;
      if (extraTimeEl) extraTimeEl.textContent = filteredIqamas[i];
    });

    // Mettre à jour la prière active immédiatement
    updateNextPrayerActive();
  })
  .catch(err => {
    console.error("❌ Erreur de chargement du fichier JSON :", err);
  });

function updateNextPrayerActive() {
  if (!filteredPrayers.length || !prayerBoxes.length) return;

  const now = new Date();

  const parseTimeToDate = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  };

  let nextIndex = -1;
  for (let i = 0; i < filteredPrayers.length; i++) {
    const prayerTime = parseTimeToDate(filteredPrayers[i]);
    if (now < prayerTime) {
      nextIndex = i;
      break;
    }
  }

  if (nextIndex === -1) nextIndex = filteredPrayers.length - 1;

  prayerBoxes.forEach((box, i) => {
    box.classList.toggle("active", i === nextIndex);
  });
}




