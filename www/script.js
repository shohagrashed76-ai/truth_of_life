let startX = 0;
let endX = 0;

document.addEventListener('touchstart', e => {
    startX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    endX = e.changedTouches[0].screenX;
    if (startX - endX > 70) {
        if (typeof loadNextSurah === 'function') loadNextSurah();
    }
    if (endX - startX > 70) {
        if (typeof loadPreviousSurah === 'function') loadPreviousSurah();
    }
});

function fetchPrayerTimes() {
    fetch('https://api.aladhan.com/v1/timingsByCity?city=Dhaka&country=Bangladesh&method=1')
        .then(response => response.json())
        .then(data => {
            console.log(data.data.timings);
        })
        .catch(err => console.error(err));
}

fetchPrayerTimes();

