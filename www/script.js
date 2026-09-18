let currentDate = new Date();

function formatDate(date) {
    const options = { day: 'numeric', month: 'long' };
    const dateStr = date.toLocaleDateString('en-US', options);
    
    const today = new Date();
    if(date.toDateString() === today.toDateString()) {
        return `Today, ${dateStr}`;
    }
    return dateStr;
}

function fetchPrayerTimes() {
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    document.getElementById('display-date').innerText = formatDate(currentDate);

    // Aladhan API for Kaliganj Location
    fetch(`https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=23.41&longitude=89.14&method=1`)
        .then(res => res.json())
        .then(data => {
            const timings = data.data.timings;
            const hijri = data.data.date.hijri;

            // Update Hijri Date
            document.getElementById('display-hijri').innerText = `${hijri.day} ${hijri.month.en} ${hijri.year} AH`;

            // Update Prayer Times
            document.getElementById('time-fajr').innerText = timings.Fajr;
            document.getElementById('time-sunrise').innerText = timings.Sunrise;
            document.getElementById('time-dhuhr').innerText = timings.Dhuhr;
            document.getElementById('time-asr').innerText = timings.Asr;
            document.getElementById('time-maghrib').innerText = timings.Maghrib;
            document.getElementById('time-isha').innerText = timings.Isha;
        });
}

function changeDate(days) {
    currentDate.setDate(currentDate.getDate() + days);
    fetchPrayerTimes();
}

document.addEventListener('DOMContentLoaded', () => {
    fetchPrayerTimes();
});
