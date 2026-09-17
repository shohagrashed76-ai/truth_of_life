let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, { passive: false });

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, { passive: false });

function handleSwipe() {
    let diffX = touchEndX - touchStartX;
    let diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 60) {
        if (diffX < 0) {
            if (typeof loadNextSurah === 'function') loadNextSurah();
            else if (typeof nextSurah === 'function') nextSurah();
        } else {
            if (typeof loadPreviousSurah === 'function') loadPreviousSurah();
            else if (typeof prevSurah === 'function') prevSurah();
        }
    }
}

function fetchPrayerTimes() {
    fetch('https://api.aladhan.com/v1/timingsByCity?city=Dhaka&country=Bangladesh&method=1')
        .then(response => response.json())
        .then(data => {
            if (data && data.data && data.data.timings) {
                const timings = data.data.timings;
                const prayerContainer = document.getElementById('prayer-times');
                if (prayerContainer) {
                    prayerContainer.innerHTML = `
                        <div class="prayer-card">
                            <h3>Prayer Times (Dhaka)</h3>
                            <p>Fajr: ${timings.Fajr}</p>
                            <p>Dhuhr: ${timings.Dhuhr}</p>
                            <p>Asr: ${timings.Asr}</p>
                            <p>Maghrib: ${timings.Maghrib}</p>
                            <p>Isha: ${timings.Isha}</p>
                        </div>
                    `;
                }
            }
        })
        .catch(err => console.error('Prayer times fetch error:', err));
}

document.addEventListener('DOMContentLoaded', function() {
    fetchPrayerTimes();
});
