let currentDate = new Date();
let currentCity = localStorage.getItem('userCity') || 'Darsana';
let currentLat = localStorage.getItem('userLat') || null;
let currentLng = localStorage.getItem('userLng') || null;
let surahList = [];
let tasbihCount = 0;
let qiblaHeading = 288; // Default for BD approx

function switchTab(tabId, btnEl) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    closeSubView();
    
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
    document.querySelectorAll('.city-display-name').forEach(el => el.innerText = name);
}

function fetchPrayerTimes() {
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    document.getElementById('display-date').innerText = currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    updateCityDisplays(currentCity);

    let primaryUrl = (currentLat && currentLng) 
        ? `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${currentLat}&longitude=${currentLng}&method=1`
        : `https://api.aladhan.com/v1/timingsByCity/${day}-${month}-${year}?city=${encodeURIComponent(currentCity)}&country=Bangladesh&method=1`;

    let fallbackUrl = `https://api.aladhan.com/v1/timingsByCity/${day}-${month}-${year}?city=Chuadanga&country=Bangladesh&method=1`;

    const applyTimings = (data) => {
        if(data && data.code === 200 && data.data) {
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
    };

    fetch(primaryUrl)
        .then(res => res.json())
        .then(data => {
            if(data.code === 200) {
                applyTimings(data);
            } else {
                fetch(fallbackUrl).then(r => r.json()).then(applyTimings);
            }
        })
        .catch(() => {
            fetch(fallbackUrl).then(r => r.json()).then(applyTimings).catch(e => console.log(e));
        });
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

function openLocationModal() { document.getElementById('locationModal').style.display = 'flex'; }
function closeLocationModal() { document.getElementById('locationModal').style.display = 'none'; }

function searchCity() {
    const input = document.getElementById('citySearchInput').value.trim();
    if(!input) return;
    currentCity = input;
    currentLat = null; 
    currentLng = null;
    localStorage.removeItem('userLat'); 
    localStorage.removeItem('userLng');
    localStorage.setItem('userCity', currentCity);
    fetchPrayerTimes();
    closeLocationModal();
}

function useCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            pos => {
                currentLat = pos.coords.latitude; 
                currentLng = pos.coords.longitude;
                currentCity = 'GPS Location';
                localStorage.setItem('userLat', currentLat); 
                localStorage.setItem('userLng', currentLng);
                localStorage.setItem('userCity', currentCity);
                fetchPrayerTimes(); 
                closeLocationModal();
            },
            err => {
                // IP Geolocation Fallback
                fetch('https://ipapi.co/json/')
                    .then(res => res.json())
                    .then(data => {
                        if(data && data.city) {
                            currentCity = data.city;
                            currentLat = data.latitude;
                            currentLng = data.longitude;
                            localStorage.setItem('userCity', currentCity);
                            localStorage.setItem('userLat', currentLat);
                            localStorage.setItem('userLng', currentLng);
                            fetchPrayerTimes();
                            closeLocationModal();
                        } else {
                            alert("Location detect kora jaini. City name search korun.");
                        }
                    })
                    .catch(() => {
                        alert("Location service enable korun ba city search korun.");
                    });
            },
            { enableHighAccuracy: true, timeout: 5000 }
        );
    }
}

function initQuranList() {
    fetch('https://api.alquran.cloud/v1/surah')
        .then(res => res.json())
        .then(data => {
            if(data && data.data) {
                surahList = data.data;
                renderSurahList(surahList);
            }
        });
}

function renderSurahList(list) {
    const container = document.getElementById('surahListContainer');
    if(!container) return;
    
    if(!list || list.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:20px; color:#9ca3af;">Kono Surah Pawa Jaini!</p>';
        return;
    }

    container.innerHTML = list.map(s => `
        <div class="surah-item" onclick="openSurahDetail(${s.number}, '${s.englishName.replace(/'/g, "\\'")}')">
            <div class="surah-left">
                <div class="surah-num">${s.number}</div>
                <div class="surah-names">
                    <h4>${s.englishName}</h4>
                    <small>${s.revelationType} • ${s.numberOfAyahs} Ayahs</small>
                </div>
            </div>
            <div class="surah-ar-name">${s.name}</div>
        </div>
    `).join('');
}

function normalizeStr(str) {
    return str.toLowerCase().replace(/^al[\s\-']*/i, '').replace(/[^a-z0-9]/g, '');
}

// Search execution only on Submit / Enter / Selection, typeing-e filtering dekhabe
function filterSurahList(isSubmit = false) {
    const rawInput = document.getElementById('quranSearchInput').value.trim();
    if(!rawInput) {
        renderSurahList(surahList);
        return;
    }

    let targetAyat = null;
    let searchStr = rawInput;

    const numColonNum = rawInput.match(/^(\d+)[:\s]+(\d+)$/);
    if(numColonNum) {
        let surahNum = parseInt(numColonNum[1]);
        targetAyat = parseInt(numColonNum[2]);
        if(isSubmit && surahNum >= 1 && surahNum <= 114) {
            let sObj = surahList.find(s => s.number === surahNum);
            openSurahDetail(surahNum, sObj ? sObj.englishName : `Surah ${surahNum}`, targetAyat);
            return;
        }
    }

    const textAndNum = rawInput.match(/^(.+?)\s+(\d+)$/);
    if(textAndNum) {
        searchStr = textAndNum[1].trim();
        targetAyat = parseInt(textAndNum[2]);
    }

    const cleanQuery = normalizeStr(searchStr);

    const filtered = surahList.filter(s => {
        let cleanEng = normalizeStr(s.englishName);
        let arName = s.name.toLowerCase();
        let numStr = s.number.toString();

        if (cleanEng.includes(cleanQuery) || arName.includes(searchStr.toLowerCase()) || numStr === cleanQuery) {
            return true;
        }
        return false;
    });

    if(isSubmit) {
        if(filtered.length > 0) {
            openSurahDetail(filtered[0].number, filtered[0].englishName, targetAyat);
        } else {
            alert("Surah ba Ayat khunje pawa jaini!");
        }
        return;
    }

    renderSurahList(filtered);
}

function openSurahDetail(surahNum, englishName, targetAyat = null) {
    document.getElementById('quran-list-view').style.display = 'none';
    document.getElementById('quran-detail-view').style.display = 'block';
    document.getElementById('surahDetailTitle').innerText = englishName || `Surah ${surahNum}`;
    
    const container = document.getElementById('ayatsContainer');
    container.innerHTML = '<p style="text-align:center; padding:20px; color:#9ca3af;">Loading Surah...</p>';

    fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/editions/quran-uthmani,bn.bengali`)
        .then(res => res.json())
        .then(data => {
            if(data && data.data && data.data.length >= 2) {
                const arAyahs = data.data[0].ayahs;
                const bnAyahs = data.data[1].ayahs;

                container.innerHTML = arAyahs.map((ar, i) => `
                    <div class="aya-card" id="aya-${i+1}">
                        <span style="font-size:0.8rem; color:#10b981; font-weight:bold;">${surahNum}:${i+1}</span>
                        <div class="ar-text">${ar.text} ﴿${i+1}﴾</div>
                        <div class="bn-text">${bnAyahs[i] ? bnAyahs[i].text : ''}</div>
                    </div>
                `).join('');

                if(targetAyat && targetAyat <= arAyahs.length) {
                    setTimeout(() => {
                        let el = document.getElementById(`aya-${targetAyat}`);
                        if(el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            el.style.backgroundColor = 'rgba(16, 185, 129, 0.2)';
                        }
                    }, 400);
                }
            }
        });
}

function openSurahDirect(surahNum) {
    switchTab('quran');
    openSurahDetail(surahNum, 'Surah Al-Kahf');
}

function closeSurahDetail() {
    document.getElementById('quran-detail-view').style.display = 'none';
    document.getElementById('quran-list-view').style.display = 'block';
}

function openFeature(feat) {
    document.querySelectorAll('.sub-view').forEach(el => el.style.display = 'none');
    document.getElementById(`view-${feat}`).style.display = 'block';

    if(feat === 'qibla') initQiblaCompass();
    if(feat === 'duas') loadDuas();
    if(feat === 'journal') loadJournalNotes();
}

function closeSubView() {
    document.querySelectorAll('.sub-view').forEach(el => el.style.display = 'none');
}

// Dynamic Compass & Motion Sensor Logic
function initQiblaCompass() {
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', handleOrientation, true);
    }
}

function handleOrientation(event) {
    let compass = event.alpha;
    if (event.webkitCompassHeading) {
        compass = event.webkitCompassHeading; // iOS support
    }
    if (compass !== null && compass !== undefined) {
        let heading = Math.round(compass);
        let compassEl = document.querySelector('#view-qibla .qibla-compass-icon');
        if (compassEl) {
            compassEl.style.transform = `rotate(${-heading}deg)`;
            compassEl.style.transition = 'transform 0.2s ease-out';
        }
    }
}

function loadDuas() {
    const duas = [
        { title: "Ghum theke uthar doa", ar: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ", bn: "Sob proshongsa Allah r jonno, jini amader jibito korlen." },
        { title: "Khabar ager doa", ar: "بِسْمِ اللهِ", bn: "Allah r name shuru korchi." }
    ];
    document.getElementById('duasContainer').innerHTML = duas.map(d => `
        <div class="aya-card" style="margin-bottom:12px;">
            <h4>${d.title}</h4>
            <div class="ar-text">${d.ar}</div>
            <div class="bn-text">${d.bn}</div>
        </div>
    `).join('');
}

function countTasbih() {
    tasbihCount++;
    document.getElementById('tasbih-counter').innerText = tasbihCount;
}

function resetTasbih() {
    tasbihCount = 0;
    document.getElementById('tasbih-counter').innerText = 0;
}

function saveJournalNote() {
    const text = document.getElementById('journalInput').value.trim();
    if(!text) return;
    let notes = JSON.parse(localStorage.getItem('myJournalNotes') || '[]');
    notes.unshift({ text, date: new Date().toLocaleDateString() });
    localStorage.setItem('myJournalNotes', JSON.stringify(notes));
    document.getElementById('journalInput').value = '';
    loadJournalNotes();
}

function loadJournalNotes() {
    let notes = JSON.parse(localStorage.getItem('myJournalNotes') || '[]');
    document.getElementById('journalNotesList').innerHTML = notes.map(n => `
        <div class="card" style="margin-bottom:10px;">
            <small style="color:#10b981;">${n.date}</small>
            <p style="margin-top:6px;">${n.text}</p>
        </div>
    `).join('');
}

function searchMosquesMap() {
    if(currentLat && currentLng) {
        window.open(`https://www.google.com/maps/search/mosque/@${currentLat},${currentLng},16z`, '_blank');
    } else {
        let areaQuery = encodeURIComponent(`mosque in ${currentCity}`);
        window.open(`https://www.google.com/maps/search/${areaQuery}`, '_blank');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchPrayerTimes();
    initQuranList();

    const searchInput = document.getElementById('quranSearchInput');
    if(searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            if(e.key === 'Enter') {
                filterSurahList(true);
            } else {
                filterSurahList(false);
            }
        });
    }
});
