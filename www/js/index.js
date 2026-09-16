var allSurahs = [];

const sajdahAyahs = {
    "7": [206],
    "13": [15],
    "16": [50],
    "17": [109],
    "19": [58],
    "22": [18, 77],
    "25": [60],
    "27": [26],
    "32": [15],
    "38": [24],
    "41": [38],
    "53": [62],
    "84": [21],
    "96": [19]
};

document.addEventListener('deviceready', onDeviceReady, false);
if (!window.cordova) {
    document.addEventListener('DOMContentLoaded', onDeviceReady);
}

function onDeviceReady() {
    loadSurahList();
}

function loadSurahList() {
    var appDiv = document.getElementById('app');
    appDiv.innerHTML = '<h3 style="text-align:center; padding:20px;">Loading Surah List...</h3>';

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
    html += '<input type="text" id="searchInput" class="search-box" placeholder="Search Surah Name, Number or Sajdah..." onkeyup="filterSurahs()">';
    html += '<div id="surahListContainer">';

    surahs.forEach(surah => {
        var hasSajdah = sajdahAyahs[surah.number] ? ' <span style="color:#d32f2f; font-weight:bold;">[۩ Sajdah]</span>' : '';
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
    var cleanQuery = rawQuery.replace(/[^a-z0-9]/g, '');

    var filtered = allSurahs.filter(surah => {
        var cleanEnglishName = surah.englishName.toLowerCase().replace(/[^a-z0-9]/g, '');
        var isSajdahMatch = rawQuery === 'sajdah' && sajdahAyahs[surah.number];
        
        return cleanEnglishName.includes(cleanQuery) || 
               surah.number.toString() === rawQuery ||
               surah.name.includes(rawQuery) ||
               isSajdahMatch;
    });

    var container = document.getElementById('surahListContainer');
    var html = '';
    filtered.forEach(surah => {
        var hasSajdah = sajdahAyahs[surah.number] ? ' <span style="color:#d32f2f; font-weight:bold;">[۩ Sajdah]</span>' : '';
        html += `<div class="surah-card" onclick="loadSurahDetail(${surah.number})">
            <div class="surah-title">${surah.number}. ${surah.englishName} (${surah.name}) ${hasSajdah}</div>
            <div style="color:gray; font-size:14px; margin-top:5px;">Meaning: ${surah.englishNameTranslation} | Ayahs: ${surah.numberOfAyahs}</div>
        </div>`;
    });
    container.innerHTML = html;
}

function loadSurahDetail(surahNumber) {
    var appDiv = document.getElementById('app');
    appDiv.innerHTML = '<h3 style="text-align:center; padding:20px;">Loading Surah & Bangla Translation...</h3>';

    Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`).then(res => res.json()),
        fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/bn.bengali`).then(res => res.json())
    ])
    .then(results => {
        var arabicData = results[0].data;
        var bnData = results[1].data;

        var html = '<button class="btn-back" onclick="renderSurahList(allSurahs)">← Back to List</button>';
        html += `<h2 style="text-align:center; color:#1a237e;">${arabicData.name}</h2>`;
        html += `<p style="text-align:center; color:gray;">${arabicData.englishName} - ${arabicData.numberOfAyahs} Ayahs</p>`;

        arabicData.ayahs.forEach((ayah, idx) => {
            var bnText = (bnData.ayahs[idx]) ? bnData.ayahs[idx].text : '';
            var ayahNum = ayah.numberInSurah;
            
            var isSajdah = sajdahAyahs[surahNumber] && sajdahAyahs[surahNumber].includes(ayahNum);
            var sajdahTag = isSajdah ? '<span style="background-color: #d32f2f; color: white; padding: 3px 8px; border-radius: 4px; font-size: 13px; margin-left: 10px;">[Sajdah Ayah - Wajib]</span>' : '';

            html += `<div class="ayah-box" ${isSajdah ? 'style="border-left: 6px solid #d32f2f; background-color: #fffde7;"' : ''}>
                <div class="arabic-text">${ayah.text} <span style="font-size:18px; color:#1a237e;">(${ayahNum})</span></div>
                <div class="bangla-text"><b>Bangla:</b> ${bnText} ${sajdahTag}</div>
            </div>`;
        });

        appDiv.innerHTML = html;
        window.scrollTo(0, 0);
    })
    .catch(err => {
        appDiv.innerHTML = '<h3 style="color:red; text-align:center;">Failed to load Surah.</h3>';
    });
}
