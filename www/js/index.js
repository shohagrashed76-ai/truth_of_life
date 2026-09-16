var allSurahs = [];

const sajdahAyahs = {
    "7": [206], "13": [15], "16": [50], "17": [109], "19": [58],
    "22": [18, 77], "25": [60], "27": [26], "32": [15], "38": [24],
    "41": [38], "53": [62], "84": [21], "96": [19]
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
    html += '<input type="text" id="searchInput" class="search-box" placeholder="Search Surah (e.g. Baqara, Baqara 7, 36:12)..." onkeyup="filterSurahs()">';
    
    // Bottom Navigation Switcher
    html += `<div style="display:flex; justify-content:space-around; margin-bottom:15px; border-bottom:2px solid #ddd; padding-bottom:5px;">
        <button style="flex:1; padding:10px; background:#1a237e; color:white; border:none; border-radius:5px; margin-right:5px; font-weight:bold;" onclick="loadSurahList()">📖 Quran Reader</button>
        <button style="flex:1; padding:10px; background:#2e7d32; color:white; border:none; border-radius:5px; margin-left:5px; font-weight:bold;" onclick="loadPrayerTimes()">🕌 Prayer Times</button>
    </div>`;

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
    if (!rawQuery) {
        renderSurahListContent(allSurahs);
        return;
    }

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

    if (surahs.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:gray; padding:20px;">No Surah found</p>';
        return;
    }

    surahs.forEach(surah => {
        var hasSajdah = sajdahAyahs[surah.number] ? ' <span style="color:#d32f2f; font-weight:bold;">[۩ Sajdah]</span>' : '';
        var clickAction = targetAyah ? `loadSurahDetail(${surah.number}, ${targetAyah})` : `loadSurahDetail(${surah.number})`;
        var targetAyahBadge = targetAyah ? ` <span style="color:#1a237e; font-weight:bold; font-size:13px;">→ Go to Ayah ${targetAyah}</span>` : '';

        html += `<div class="surah-card" onclick="${clickAction}">
            <div class="surah-title">${surah.number}. ${surah.englishName} (${surah.name}) ${hasSajdah} ${targetAyahBadge}</div>
            <div style="color:gray; font-size:14px; margin-top:5px;">Meaning: ${surah.englishNameTranslation} | Ayahs: ${surah.numberOfAyahs}</div>
        </div>`;
    });
    container.innerHTML = html;
}

function loadSurahDetail(surahNumber, targetAyah = null) {
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
            var isTargetAyah = targetAyah && ayahNum === targetAyah;

            var sajdahTag = isSajdah ? '<span style="background-color: #d32f2f; color: white; padding: 3px 8px; border-radius: 4px; font-size: 13px; margin-left: 10px;">[Sajdah Ayah - Wajib]</span>' : '';

            var boxStyle = '';
            var boxId = '';
            if (isTargetAyah) {
                boxStyle = 'style="border: 3px solid #1a237e; background-color: #e8eaf6;"';
                boxId = 'id="targetAyahBox"';
            } else if (isSajdah) {
                boxStyle = 'style="border-left: 6px solid #d32f2f; background-color: #fffde7;"';
            }

            html += `<div class="ayah-box" ${boxStyle} ${boxId}>
                <div class="arabic-text">${ayah.text} <span style="font-size:18px; color:#1a237e;">(${ayahNum})</span></div>
                <div class="bangla-text"><b>Bangla:</b> ${bnText} ${sajdahTag}</div>
            </div>`;
        });

        appDiv.innerHTML = html;

        if (targetAyah) {
            setTimeout(() => {
                var elem = document.getElementById('targetAyahBox');
                if (elem) {
                    elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 400);
        } else {
            window.scrollTo(0, 0);
        }
    })
    .catch(err => {
        appDiv.innerHTML = '<h3 style="color:red; text-align:center;">Failed to load Surah.</h3>';
    });
}

// Prayer Times Functionality
function loadPrayerTimes() {
    var appDiv = document.getElementById('app');
    appDiv.innerHTML = '<h3 style="text-align:center; padding:20px;">Fetching Prayer Times...</h3>';

    // Default: Dhaka, Bangladesh
    fetch('https://api.aladhan.com/v1/timingsByCity?city=Dhaka&country=Bangladesh&method=1')
        .then(res => res.json())
        .then(data => {
            var timings = data.data.timings;
            var dateInfo = data.data.date.readable;
            var hijriDate = data.data.date.hijri.day + ' ' + data.data.date.hijri.month.en + ' ' + data.data.date.hijri.year;

            var html = '<button class="btn-back" onclick="renderSurahList(allSurahs)">← Back to Quran Reader</button>';
            html += '<h2 style="text-align:center; color:#2e7d32;">🕌 Daily Prayer Times</h2>';
            html += `<p style="text-align:center; color:gray; font-size:14px; margin-bottom:15px;">Date: ${dateInfo} | Hijri: ${hijriDate}</p>`;

            var prayerList = [
                { name: "Fajr (ফজর)", start: timings.Fajr, end: timings.Sunrise },
                { name: "Dhuhr (জোহর)", start: timings.Dhuhr, end: timings.Asr },
                { name: "Asr (আসর)", start: timings.Asr, end: timings.Sunset },
                { name: "Maghrib (মাগরিব)", start: timings.Maghrib, end: timings.Isha },
                { name: "Isha (ইশা)", start: timings.Isha, end: timings.Fajr }
            ];

            html += '<div style="display:flex; flex-direction:column; gap:10px;">';
            prayerList.forEach(p => {
                html += `<div style="padding:15px; background:#f1f8e9; border-left:5px solid #2e7d32; border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <strong style="font-size:16px; color:#1b5e20;">${p.name}</strong>
                    </div>
                    <div style="text-align:right; font-size:14px; color:#333;">
                        <div><b>Start:</b> ${p.start}</div>
                        <div><b>Ends:</b> ${p.end}</div>
                    </div>
                </div>`;
            });
            html += '</div>';

            appDiv.innerHTML = html;
        })
        .catch(err => {
            appDiv.innerHTML = '<h3 style="color:red; text-align:center;">Failed to fetch prayer times. Check Internet.</h3>';
        });
}
