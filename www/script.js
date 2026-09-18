let currentDate = new Date();
let currentCity = localStorage.getItem('userCity') || 'Dhaka';
let currentLat = localStorage.getItem('userLat') || null;
let currentLng = localStorage.getItem('userLng') || null;
let surahDataList = [];

function switchTab(tabId, btnEl) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`tab-${tabId}`).classList.add('active');
    if(btnEl) {
        btnEl.classList.add('active');
    } else {
        const btns = document.querySelectorAll('.nav-btn');
        if(tabId === 'home') btns[0].classList.add('active');
        if(tabId === 'prayers') btns[1].classList.add('active');
        if(tabId === 'quran') btns[2].classList.add('active');
    }
}

function updateCityDisplays(name) {
    document.querySelectorAll('.city-display-name').forEach(el => {
        el.innerText = name;
    });
}

function fetchPrayerTimes() {
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    document.getElementById('display-date').innerText = currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    updateCityDisplays(currentCity);

    let apiUrl = '';
    if (currentLat && currentLng) {
        apiUrl = `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${currentLat}&longitude=${currentLng}&method=1`;
    } else {
        apiUrl = `https://api.aladhan.com/v1/timingsByCity/${day}-${month}-${year}?city=${encodeURIComponent(currentCity)}&country=`;
    }

    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            if(data.code === 200) {
                const timings = data.data.timings;
                const hijri = data.data.date.hijri;

                document.getElementById('display-hijri').innerText = `${hijri.day} ${hijri.month.en} ${hijri.year} AH`;

                document.getElementById('time-fajr').innerText = timings.Fajr;
                document.getElementById('time-sunrise').innerText = timings.Sunrise;
                document.getElementById('time-dhuhr').innerText = timings.Dhuhr;
                document.getElementById('time-asr').innerText = timings.Asr;
                document.getElementById('time-maghrib').innerText = timings.Maghrib;
                document.getElementById('time-isha').innerText = timings.Isha;

                updateNextPrayerCard(timings);
            }
        })
        .catch(err => console.error("Error fetching timings:", err));
}

function updateNextPrayerCard(timings) {
    const now = new Date();
    const prayerOrder = [
        { name: 'Fajr', time: timings.Fajr },
        { name: 'Sunrise', time: timings.Sunrise },
        { name: 'Dhuhr', time: timings.Dhuhr },
        { name: 'Asr', time: timings.Asr },
        { name: 'Maghrib', time: timings.Maghrib },
        { name: 'Isha', time: timings.Isha }
    ];

    document.querySelectorAll('.p-row').forEach(el => el.classList.remove('active'));

    let nextPrayer = null;
    let nextPrayerTimeDate = null;

    for (let p of prayerOrder) {
        const [h, m] = p.time.split(':').map(Number);
        const pDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);

        if (pDate > now) {
            nextPrayer = p;
            nextPrayerTimeDate = pDate;
            break;
        }
    }

    if (!nextPrayer) {
        nextPrayer = prayerOrder[0];
        const [h, m] = nextPrayer.time.split(':').map(Number);
        nextPrayerTimeDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, h, m);
    }

    document.getElementById('current-prayer-name').innerText = `${nextPrayer.name} Next`;
    document.getElementById('current-prayer-time').innerText = nextPrayer.time;

    const rowEl = document.getElementById(`row-${nextPrayer.name}`);
    if(rowEl) rowEl.classList.add('active');

    const diffMs = nextPrayerTimeDate - now;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    document.getElementById('next-prayer-countdown').innerText = `in ${diffHrs}h ${diffMins}m to ${nextPrayer.name}`;
}

function changeDate(days) {
    currentDate.setDate(currentDate.getDate() + days);
    fetchPrayerTimes();
}

function openLocationModal() { 
    document.getElementById('locationModal').style.display = 'flex';
    document.getElementById('location-error').style.display = 'none';
}
function closeLocationModal() { 
    document.getElementById('locationModal').style.display = 'none'; 
}

function useCurrentLocation() {
    const errDiv = document.getElementById('location-error');
    errDiv.style.display = 'none';

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                currentLat = position.coords.latitude;
                currentLng = position.coords.longitude;
                currentCity = 'GPS Location';

                localStorage.setItem('userLat', currentLat);
                localStorage.setItem('userLng', currentLng);
                localStorage.setItem('userCity', currentCity);

                fetchPrayerTimes();
                closeLocationModal();
            },
            err => {
                errDiv.innerText = "GPS Error! Device Location Access enable karun.";
                errDiv.style.display = 'block';
            }
        );
    } else {
        errDiv.innerText = "Geolocation support korche na.";
        errDiv.style.display = 'block';
    }
}

function searchCity() {
    const input = document.getElementById('citySearchInput').value.trim();
    const errDiv = document.getElementById('location-error');
    errDiv.style.display = 'none';

    if(!input) return;

    fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(input)}&country=`)
        .then(res => res.json())
        .then(data => {
            if(data.code === 200) {
                // Capitalize first letter
                currentCity = input.charAt(0).toUpperCase() + input.slice(1);
                currentLat = null;
                currentLng = null;

                localStorage.removeItem('userLat');
                localStorage.removeItem('userLng');
                localStorage.setItem('userCity', currentCity);

                fetchPrayerTimes();
                closeLocationModal();
                document.getElementById('citySearchInput').value = '';
            } else {
                errDiv.innerText = "City paoya jayni! Sotik shohorer naam likhun.";
                errDiv.style.display = 'block';
            }
        })
        .catch(err => {
            errDiv.innerText = "Network problem! Connection check karun.";
            errDiv.style.display = 'block';
        });
}

function initSurahList() {
    fetch('https://api.alquran.cloud/v1/surah')
        .then(res => res.json())
        .then(data => {
            surahDataList = data.data;
            const select = document.getElementById('surahSelect');
            select.innerHTML = surahDataList.map(s => `<option value="${s.number}">${s.number}. ${s.englishName} (${s.name})</option>`).join('');
            loadSurah(1);
        });
}

function loadSurah(surahNum, targetAyat = null) {
    const container = document.getElementById('ayatsContainer');
    document.getElementById('surahSelect').value = surahNum;
    container.innerHTML = '<p style="text-align:center; padding:20px; color:#9ca3af;">Loading Surah...</p>';

    fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/editions/quran-uthmani,bn.bengali`)
        .then(res => res.json())
        .then(data => {
            const arAyahs = data.data[0].ayahs;
            const bnAyahs = data.data[1].ayahs;

            let html = '';
            for(let i = 0; i < arAyahs.length; i++) {
                const isSajdah = arAyahs[i].sajda ? true : false;
                const sajdahBadge = isSajdah ? '<span style="background:#059669; color:#fff; font-size:0.7rem; padding:2px 8px; border-radius:10px;">۩ Sajdah</span>' : '';

                html += `
                    <div class="aya-card" id="aya-${i+1}">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span style="font-size:0.8rem; color:#10b981; font-weight:bold;">Aya ${surahNum}:${i+1}</span>
                            ${sajdahBadge}
                        </div>
                        <div class="ar-text">${arAyahs[i].text} ﴿${i+1}﴾</div>
                        <div class="bn-text">${bnAyahs[i].text}</div>
                    </div>
                `;
            }
            container.innerHTML = html;

            if(targetAyat && targetAyat <= arAyahs.length) {
                setTimeout(() => {
                    let el = document.getElementById(`aya-${targetAyat}`);
                    if(el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            }
        });
}

function triggerQuranSearch() {
    const query = document.getElementById('quranSearchInput').value.trim().toLowerCase();
    if(!query) return;

    let match = query.match(/^(\d+)[:\s]+(\d+)$/);
    if(match) {
        loadSurah(parseInt(match[1]), parseInt(match[2]));
        return;
    }

    let found = surahDataList.find(s => s.englishName.toLowerCase().includes(query) || s.name.includes(query));
    if(found) {
        loadSurah(found.number);
    } else if(!isNaN(query) && parseInt(query) >= 1 && parseInt(query) <= 114) {
        loadSurah(parseInt(query));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchPrayerTimes();
    initSurahList();
});
