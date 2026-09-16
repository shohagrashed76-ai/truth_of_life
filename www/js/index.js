document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    loadSurahList();
}

// Fallback in case deviceready doesn't trigger in browser test
if (!window.cordova) {
    document.addEventListener('DOMContentLoaded', loadSurahList);
}

function loadSurahList() {
    var appDiv = document.getElementById('app');
    appDiv.innerHTML = '<h3 style="text-align:center; padding:20px;">Loading Surah List...</h3>';

    fetch('https://api.alquran.cloud/v1/surah')
        .then(function(res) { return res.json(); })
        .then(function(data) {
            var html = '<h2 style="text-align:center; color:#1a237e;">Al-Quran</h2>';
            data.data.forEach(function(surah) {
                html += '<div class="surah-card" onclick="loadSurahDetail(' + surah.number + ')">' +
                    '<div class="surah-title">' + surah.number + '. ' + surah.englishName + ' (' + surah.name + ')</div>' +
                    '<div style="color:gray; font-size:14px; margin-top:5px;">Meaning: ' + surah.englishNameTranslation + ' | Ayahs: ' + surah.numberOfAyahs + '</div>' +
                '</div>';
            });
            appDiv.innerHTML = html;
        })
        .catch(function(err) {
            appDiv.innerHTML = '<h3 style="color:red; text-align:center;">Internet Connection Required!</h3>';
        });
}

function loadSurahDetail(surahNumber) {
    var appDiv = document.getElementById('app');
    appDiv.innerHTML = '<h3 style="text-align:center; padding:20px;">Loading Surah & Bangla Translation...</h3>';

    Promise.all([
        fetch('https://api.alquran.cloud/v1/surah/' + surahNumber + '/ar.alafasy').then(function(res) { return res.json(); }),
        fetch('https://api.alquran.cloud/v1/surah/' + surahNumber + '/bn.bengali').then(function(res) { return res.json(); })
    ])
    .then(function(results) {
        var arabicData = results[0].data;
        var bnData = results[1].data;

        var html = '<button class="btn-back" onclick="loadSurahList()">← Back to List</button>';
        html += '<h2 style="text-align:center; color:#1a237e;">' + arabicData.name + '</h2>';
        html += '<p style="text-align:center; color:gray;">' + arabicData.englishName + ' - ' + arabicData.numberOfAyahs + ' Ayahs</p>';

        arabicData.ayahs.forEach(function(ayah, idx) {
            var bnText = (bnData.ayahs[idx]) ? bnData.ayahs[idx].text : '';
            html += '<div class="ayah-box">' +
                '<div class="arabic-text">' + ayah.text + ' <span style="font-size:18px; color:#1a237e;">(' + ayah.numberInSurah + ')</span></div>' +
                '<div class="bangla-text"><b>Bangla:</b> ' + bnText + '</div>' +
            '</div>';
        });

        appDiv.innerHTML = html;
        window.scrollTo(0, 0);
    })
    .catch(function(err) {
        appDiv.innerHTML = '<h3 style="color:red; text-align:center;">Failed to load Surah. Check internet connection!</h3>';
    });
}
