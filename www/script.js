let currentDate = new Date();
let currentLat = 23.41;
let currentLng = 89.14;
let surahDataList = [];

// Tab Navigation
function switchTab(tabId, btnEl) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`tab-${tabId}`).classList.add('active');
    if(btnEl) btnEl.classList.add('active');
}

// Prayer API & Date Logic
function fetchPrayerTimes() {
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    document.getElementById('display-date').innerText = currentDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long' });

    fetch(`https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${currentLat}&longitude=${currentLng}&method=1`)
        .then(res => res.json())
        .then(data => {
            const timings = data.data.timings;
            const hijri = data.data.date.hijri;

            document.getElementById('display-hijri').innerText = `${hijri.day} ${hijri.month.en} ${hijri.year} AH`;

            document.getElementById('time-fajr').innerText = timings.Fajr;
            document.getElementById('time-sunrise').innerText = timings.Sunrise;
            document.getElementById('time-dhuhr').innerText = timings.Dhuhr;
            document.getElementById('time-asr').innerText = timings.Asr;
            document.getElementById('time-maghrib').innerText = timings.Maghrib;
            document.getElementById('time-isha').innerText = timings.Isha;

            document.getElementById('current-prayer-time').innerText = timings.Dhuhr;
        });
}

function changeDate(days) {
    currentDate.setDate(currentDate.getDate() + days);
    fetchPrayerTimes();
}

// Location Modal & GPS
function openLocationModal() { document.getElementById('locationModal').style.display = 'flex'; }
function closeLocationModal() { document.getElementById('locationModal').style.display = 'none'; }

function useCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            currentLat = position.coords.latitude;
            currentLng = position.coords.longitude;
            document.getElementById('location-name').innerText = 'Current Location';
            fetchPrayerTimes();
            closeLocationModal();
        });
    }
}

function searchCity() {
    const city = document.getElementById('citySearchInput').value;
    if(!city) return;
    fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=`)
        .then(res => res.json())
        .then(data => {
            if(data.code === 200) {
                document.getElementById('location-name').innerText = city;
                const timings = data.data.timings;
                document.getElementById('time-fajr').innerText = timings.Fajr;
                document.getElementById('time-dhuhr').innerText = timings.Dhuhr;
                document.getElementById('time-asr').innerText = timings.Asr;
                document.getElementById('time-maghrib').innerText = timings.Maghrib;
                document.getElementById('time-isha').innerText = timings.Isha;
                closeLocationModal();
            }
        });
}

// Quran Search & API
function initSurahList() {
    fetch('https://api.alquran.cloud/v1/surah')
        .then(res => res.json())
        .then(data => {
            surahDataList = data.data;
            const select = document.getElementById('surahSelect');
            select.innerHTML = surahDataList.map(s => `<option value="${s.number}">${s.number}. ${s.englishName}</option>`).join('');
            loadSurah(1);
        });
}

function loadSurah(surahNum, targetAyat = null) {
    const container = document.getElementById('ayatsContainer');
    container.innerHTML = '<p style="text-align:center; padding:20px;">Loading Ayat...</p>';

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
                        <div style="display:flex; justify-content:space-between;">
                            <span class="aya-badge">Aya ${surahNum}:${i+1} ${sajdahBadge}</span>
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

    let found = surahDataList.find(s => s.englishName.toLowerCase().includes(query));
    if(found) loadSurah(found.number);
}

document.addEventListener('DOMContentLoaded', () => {
    fetchPrayerTimes();
    initSurahList();
});
