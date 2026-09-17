let currentSurahIndex = 1;

function loadPrayerTimes() {
    const today = new Date();
    const dateElem = document.getElementById('current-date');
    if (dateElem) dateElem.innerText = today.toDateString();

    fetch('https://api.aladhan.com/v1/timingsByCity?city=Dhaka&country=Bangladesh&method=1')
        .then(res => res.json())
        .then(data => {
            if (data && data.data && data.data.timings) {
                const t = data.data.timings;
                if(document.getElementById('fajr')) document.getElementById('fajr').innerText = t.Fajr;
                if(document.getElementById('dhuhr')) document.getElementById('dhuhr').innerText = t.Dhuhr;
                if(document.getElementById('asr')) document.getElementById('asr').innerText = t.Asr;
                if(document.getElementById('maghrib')) document.getElementById('maghrib').innerText = t.Maghrib;
                if(document.getElementById('isha')) document.getElementById('isha').innerText = t.Isha;
            }
        })
        .catch(err => console.error(err));
}

function loadNextSurah() {
    if (currentSurahIndex < 114) {
        currentSurahIndex++;
        updateSurahDisplay();
    }
}

function loadPreviousSurah() {
    if (currentSurahIndex > 1) {
        currentSurahIndex--;
        updateSurahDisplay();
    }
}

function updateSurahDisplay() {
    const titleElem = document.getElementById('surah-title');
    if (titleElem) titleElem.innerText = "Surah " + currentSurahIndex;
}

let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', e => {
    let touchEndX = e.changedTouches[0].screenX;
    let touchEndY = e.changedTouches[0].screenY;
    
    let diffX = touchEndX - touchStartX;
    let diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX < 0) {
            loadNextSurah();
        } else {
            loadPreviousSurah();
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadPrayerTimes();
    updateSurahDisplay();
});
