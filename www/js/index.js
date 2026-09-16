var allSurahs = [];

const sajdahAyahs = {
    "7": [206], "13": [15], "16": [50], "17": [109], "19": [58],
    "22": [18, 77], "25": [60], "27": [26], "32": [15], "38": [24],
    "41": [38], "53": [62], "84": [21], "96": [19]
};

const namesOfAllah = [
    { ar: "الله", en: "Allah", bn: "Allah (The Only God)" },
    { ar: "الرَّحْمَٰنُ", en: "Ar-Rahman", bn: "The Most Gracious" },
    { ar: "الرَّحِيمُ", en: "Ar-Raheem", bn: "The Most Merciful" },
    { ar: "الْمَلِكُ", en: "Al-Malik", bn: "The King and Sovereign Owner" },
    { ar: "الْقُدُّوسُ", en: "Al-Quddus", bn: "The Absolutely Pure" },
    { ar: "السَّلَامُ", en: "As-Salam", bn: "The Source of Peace" }
];

const dailyDuas = [
    { title: "Dua after waking up", ar: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ", bn: "Praise be to Allah who gave us life after taking it from us and unto Him is the resurrection." },
    { title: "Dua before eating", ar: "بِسْمِ اللَّهِ", bn: "In the name of Allah." },
    { title: "Dua when entering mosque", ar: "اللَّهُمَّ افتَح لِي أَبوَابَ رَحمَتِكَ", bn: "O Allah, open for me the doors of Your mercy." }
];

document.addEventListener('deviceready', onDeviceReady, false);
if (!window.cordova) {
    document.addEventListener('DOMContentLoaded', onDeviceReady);
}

function onDeviceReady() {
    loadSurahList();
}

function loadSurahList() {
    var appDiv = document.getElementById('app');
    appDiv.innerHTML = '<h3 style="text-align:center; padding:20px;">Loading...</h3>';

    fetch('https://api.alquran.cloud/v1/surah')
        .then(res => res.json())
        .then(data => {
            allSurahs = data.data;
            renderSurahList(allSurahs);
        })
        .catch(err => {
            appDiv.innerHTML = '<h3 style="color:red; text-align:center;">Internet Connection Required!</h3>';
        });
}

function renderSurahList(surahs) {
    var appDiv = document.getElementById('app');
    var html = '<h2 class="header">THE TRUTH OF LIFE</h2>';
    html += '<input type="text" id="searchInput" class="search-box" placeholder="Search Surah..." onkeyup="filterSurahs()">';
    
    html += `<div style="display:flex; gap:5px; margin-bottom:15px; overflow-x:auto; padding-bottom:5px;">
        <button style="padding:8px 12px; background:#1a237e; color:white; border:none; border-radius:4px; font-weight:bold; shrink:0;" onclick="loadSurahList()">Quran</button>
        <button style="padding:8px 12px; background:#2e7d32; color:white; border:none; border-radius:4px; font-weight:bold; shrink:0;" onclick="loadPrayerTimes()">Prayer</button>
        <button style="padding:8px 12px; background:#e65100; color:white; border:none; border-radius:4px; font-weight:bold; shrink:0;" onclick="loadTasbeeh()">Tasbeeh</button>
        <button style="padding:8px 12px; background:#00838f; color:white; border:none; border-radius:4px; font-weight:bold; shrink:0;" onclick="loadAllahNames()">Names</button>
        <button style="padding:8px 12px; background:#4a148c; color:white; border:none; border-radius:4px; font-weight:bold; shrink:0;" onclick="loadDuas()">Dua</button>
    </div>`;

    var lastSurah = localStorage.getItem('lastReadSurahName');
    var lastAyah = localStorage.getItem('lastReadAyah');
    if (lastSurah && lastAyah) {
        html += `<div style="background:#e8eaf6; padding:10px; border-radius:6px; margin-bottom:15px; text-align:center;">
            <b>Last Read:</b> ${lastSurah} (Ayah ${lastAyah}) 
            <button style="margin-left:8px; padding:3px 8px; background:#1a237e; color:white; border:none; border-radius:3px;" onclick="loadSurahDetail(${localStorage.getItem('lastReadSurahNum')}, ${lastAyah})">Continue</button>
        </div>`;
    }

    html += '<div id="surahListContainer">';
    surahs.forEach(surah => {
        var hasSajdah = sajdahAyahs[surah.number] ? ' <span style="color:#d32f2f; font-weight:bold;">[Sajdah]</span>' : '';
        html += `<div class="surah-card" onclick="loadSurahDetail(${surah.number})">
            <div class="surah-title">${surah.number}. ${surah.englishName} (${surah.name}) ${hasSajdah}</div>
            <div style="color:gray; font-size:14px; margin-top:5px;">Meaning: ${surah.englishNameTranslation} | Ayahs: ${surah.numberOfAyahs}</div>
        </div>`;
    });
    html += '</div>';
    appDiv.innerHTML = html;
}

function filterSurahs() {
    var rawQuery = document.getElementById('searchInput').value.toLowerCase().trim();
    if (!rawQuery) { renderSurahListContent(allSurahs); return; }

    var ayahMatch = rawQuery.match(/[\s:]+(\d+)$/);
    var targetAyah = ayahMatch ? parseInt(ayahMatch[1]) : null;

    var surahSearchText = rawQuery.replace(/[\s:]+\d+$/, '').replace(/\bsurah\b/g, '').replace(/\bal\b/g, '').replace(/[^a-z0-9]/g, '').trim();
    var surahSearchNum = rawQuery.match(/^(\d+)/) ? parseInt(rawQuery.match(/^(\d+)/)[1]) : null;

    var filtered = allSurahs.filter(surah => {
        var cleanSurahName = surah.englishName.toLowerCase().replace(/\bal\b/g, '').replace(/[^a-z0-9]/g, '');
        var isSajdahMatch = rawQuery.includes('sajdah') && sajdahAyahs[surah.number];
        var isNameMatch = surahSearchText.length > 0 && cleanSurahName.includes(surahSearchText);
        var isNumberMatch = surahSearchNum && surah.number === surahSearchNum;
        return isNameMatch || isNumberMatch || isSajdahMatch;
    });

    renderSurahListContent(filtered, targetAyah);
}

function renderSurahListContent(surahs, targetAyah = null) {
    var container = document.getElementById('surahListContainer');
    var html = '';
    if (surahs.length === 0) { container.innerHTML = '<p style="text-align:center; color:gray; padding:20px;">No Surah found</p>'; return; }

    surahs.forEach(surah => {
        var hasSajdah = sajdahAyahs[surah.number] ? ' <span style="color:#d32f2f; font-weight:bold;">[Sajdah]</span>' : '';
        var clickAction = targetAyah ? `loadSurahDetail(${surah.number}, ${targetAyah})` : `loadSurahDetail(${surah.number})`;
        var targetAyahBadge = targetAyah ? ` <span style="color:#1a237e; font-weight:bold; font-size:13px;">-> Go to Ayah ${targetAyah}</span>` : '';

        html += `<div class="surah-card" onclick="${clickAction}">
            <div class="surah-title">${surah.number}. ${surah.englishName} (${surah.name}) ${hasSajdah} ${targetAyahBadge}</div>
            <div style="color:gray; font-size:14px; margin-top:5px;">Meaning: ${surah.englishNameTranslation} | Ayahs: ${surah.numberOfAyahs}</div>
        </div>`;
    });
    container.innerHTML = html;
}

function loadSurahDetail(surahNumber, targetAyah = null) {
    var appDiv = document.getElementById('app');
    appDiv.innerHTML = '<h3 style="text-align:center; padding:20px;">Loading Surah & Audio...</h3>';

    Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`).then(res => res.json()),
        fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/bn.bengali`).then(res => res.json())
    ])
    .then(results => {
        var arabicData = results[0].data;
        var bnData = results[1].data;

        var html = '<button class="btn-back" onclick="renderSurahList(allSurahs)">< Back to List</button>';
        html += `<h2 style="text-align:center; color:#1a237e;">${arabicData.name}</h2>`;
        html += `<p style="text-align:center; color:gray;">${arabicData.englishName} - ${arabicData.numberOfAyahs} Ayahs</p>`;

        arabicData.ayahs.forEach((ayah, idx) => {
            var bnText = (bnData.ayahs[idx]) ? bnData.ayahs[idx].text : '';
            var ayahNum = ayah.numberInSurah;
            var isSajdah = sajdahAyahs[surahNumber] && sajdahAyahs[surahNumber].includes(ayahNum);
            var isTargetAyah = targetAyah && ayahNum === targetAyah;

            var sajdahTag = isSajdah ? '<span style="background-color: #d32f2f; color: white; padding: 3px 8px; border-radius: 4px; font-size: 13px; margin-left: 10px;">[Sajdah Ayah - Wajib]</span>' : '';
            var boxStyle = isTargetAyah ? 'style="border: 3px solid #1a237e; background-color: #e8eaf6;" id="targetAyahBox"' : (isSajdah ? 'style="border-left: 6px solid #d32f2f; background-color: #fffde7;"' : '');

            html += `<div class="ayah-box" ${boxStyle}>
                <div class="arabic-text">${ayah.text} <span style="font-size:18px; color:#1a237e;">(${ayahNum})</span></div>
                <div class="bangla-text"><b>Bangla:</b> ${bnText} ${sajdahTag}</div>
                <div style="margin-top:10px; display:flex; justify-content:space-between; align-items:center;">
                    <audio controls style="height:30px; width:70%;">
                        <source src="${ayah.audio}" type="audio/mpeg">
                    </audio>
                    <button style="padding:4px 8px; background:#1a237e; color:white; border:none; border-radius:4px; font-size:12px;" onclick="saveBookmark('${arabicData.englishName}', ${surahNumber}, ${ayahNum})">Save</button>
                </div>
            </div>`;
        });

        appDiv.innerHTML = html;
        if (targetAyah) {
            setTimeout(() => {
                var elem = document.getElementById('targetAyahBox');
                if (elem) elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 400);
        } else { window.scrollTo(0, 0); }
    })
    .catch(err => { appDiv.innerHTML = '<h3 style="color:red; text-align:center;">Failed to load Surah.</h3>'; });
}

function saveBookmark(surahName, surahNum, ayahNum) {
    localStorage.setItem('lastReadSurahName', surahName);
    localStorage.setItem('lastReadSurahNum', surahNum);
    localStorage.setItem('lastReadAyah', ayahNum);
    alert(`Bookmarked: ${surahName} - Ayah ${ayahNum}`);
}

function loadPrayerTimes() {
    var appDiv = document.getElementById('app');
    appDiv.innerHTML = '<h3 style="text-align:center; padding:20px;">Fetching Prayer Times...</h3>';

    fetch('https://api.aladhan.com/v1/timingsByCity?city=Dhaka&country=Bangladesh&method=1')
        .then(res => res.json())
        .then(data => {
            var timings = data.data.timings;
            var html = '<button class="btn-back" onclick="renderSurahList(allSurahs)">< Back</button>';
            html += '<h2 style="text-align:center; color:#2e7d32;">Prayer Times</h2>';
            var prayerList = [
                { name: "Fajr", start: timings.Fajr, end: timings.Sunrise },
                { name: "Dhuhr", start: timings.Dhuhr, end: timings.Asr },
                { name: "Asr", start: timings.Asr, end: timings.Sunset },
                { name: "Maghrib", start: timings.Maghrib, end: timings.Isha },
                { name: "Isha", start: timings.Isha, end: timings.Fajr }
            ];
            html += '<div style="display:flex; flex-direction:column; gap:10px;">';
            prayerList.forEach(p => {
                html += `<div style="padding:15px; background:#f1f8e9; border-left:5px solid #2e7d32; border-radius:6px; display:flex; justify-content:space-between;">
                    <strong>${p.name}</strong>
                    <div><b>Start:</b> ${p.start} | <b>End:</b> ${p.end}</div>
                </div>`;
            });
            html += '</div>';
            appDiv.innerHTML = html;
        });
}

var count = 0;
function loadTasbeeh() {
    var appDiv = document.getElementById('app');
    var html = '<button class="btn-back" onclick="renderSurahList(allSurahs)">< Back</button>';
    html += '<h2 style="text-align:center; color:#e65100;">Digital Tasbeeh</h2>';
    html += `<div style="text-align:center; margin-top:30px;">
        <h1 id="counter" style="font-size:72px; color:#e65100; margin:10px;">${count}</h1>
        <button style="width:150px; height:150px; border-radius:50%; background:#e65100; color:white; font-size:24px; border:none; margin-bottom:20px; font-weight:bold;" onclick="incrementTasbeeh()">COUNT</button><br>
        <button style="padding:8px 16px; background:gray; color:white; border:none; border-radius:4px;" onclick="resetTasbeeh()">Reset</button>
    </div>`;
    appDiv.innerHTML = html;
}
function incrementTasbeeh() { count++; document.getElementById('counter').innerText = count; }
function resetTasbeeh() { count = 0; document.getElementById('counter').innerText = count; }

function loadAllahNames() {
    var appDiv = document.getElementById('app');
    var html = '<button class="btn-back" onclick="renderSurahList(allSurahs)">< Back</button>';
    html += '<h2 style="text-align:center; color:#00838f;">99 Names of Allah</h2>';
    html += '<div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">';
    namesOfAllah.forEach(n => {
        html += `<div style="padding:15px; background:#e0f7fa; border-radius:6px; text-align:center;">
            <h2 style="margin:5px; color:#006064;">${n.ar}</h2>
            <b>${n.en}</b><br><small>${n.bn}</small>
        </div>`;
    });
    html += '</div>';
    appDiv.innerHTML = html;
}

function loadDuas() {
    var appDiv = document.getElementById('app');
    var html = '<button class="btn-back" onclick="renderSurahList(allSurahs)">< Back</button>';
    html += '<h2 style="text-align:center; color:#4a148c;">Daily Duas</h2>';
    dailyDuas.forEach(d => {
        html += `<div style="padding:15px; background:#f3e5f5; border-left:5px solid #4a148c; border-radius:6px; margin-bottom:10px;">
            <h3 style="margin-top:0; color:#4a148c;">${d.title}</h3>
            <div style="font-size:20px; text-align:right; margin-bottom:5px;">${d.ar}</div>
            <p style="color:#333; margin:0;"><b>Meaning:</b> ${d.bn}</p>
        </div>`;
    });
    appDiv.innerHTML = html;
}
