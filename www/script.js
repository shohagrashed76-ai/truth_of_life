let currentSurahNum = 1;
const audioPlayer = document.getElementById('quranAudio');
let isPlaying = false;

function initSurahList() {
    const select = document.getElementById('surahSelect');
    fetch('https://api.alquran.cloud/v1/surah')
        .then(res => res.json())
        .then(data => {
            select.innerHTML = data.data.map(s => 
                `<option value="${s.number}">${s.number}. ${s.englishName}</option>`
            ).join('');
            loadSurah(1);
        });
}

function loadSurah(surahNum) {
    currentSurahNum = parseInt(surahNum);
    document.getElementById('surahSelect').value = currentSurahNum;
    const container = document.getElementById('ayatsContainer');
    container.innerHTML = '<p style="text-align:center; padding:20px; color:#aaa;">আয়াত লোড হচ্ছে...</p>';

    fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/editions/quran-uthmani,bn.bengali`)
        .then(res => res.json())
        .then(data => {
            const arAyahs = data.data[0].ayahs;
            const bnAyahs = data.data[1].ayahs;
            const surahInfo = data.data[0];

            document.getElementById('surahArabicTitle').innerText = surahInfo.name;
            document.getElementById('surahEnglishMeaning').innerText = surahInfo.englishNameTranslation;
            document.getElementById('audioTrackTitle').innerText = surahInfo.englishName;

            let html = '';
            for(let i = 0; i < arAyahs.length; i++) {
                // সিজদাহ আয়াত কিনা চেক করা
                const isSajdah = arAyahs[i].sajda ? true : false;
                const sajdahBadge = isSajdah ? '<span style="background:#059669; color:#fff; font-size:0.7rem; padding:2px 8px; border-radius:10px; margin-left:6px;">۩ Sajdah</span>' : '';

                html += `
                    <div class="aya-card">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span class="aya-badge">Aya ${surahNum}:${i+1} ${sajdahBadge}</span>
                        </div>
                        <div class="ar-text">${arAyahs[i].text} ﴿${i+1}﴾</div>
                        <div class="bn-text">${bnAyahs[i].text}</div>
                    </div>
                `;
            }
            container.innerHTML = html;
        })
        .catch(err => {
            container.innerHTML = '<p style="text-align:center; color:red;">নেটওয়ার্ক সমস্যা! ইন্টারনেট কানেকশন চেক করুন।</p>';
        });

    audioPlayer.src = `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahNum}.mp3`;
    if(isPlaying) {
        audioPlayer.play();
    }
}

function togglePlay() {
    const playBtn = document.getElementById('playBtn');
    if(isPlaying) {
        audioPlayer.pause();
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        isPlaying = false;
    } else {
        audioPlayer.play();
        playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        isPlaying = true;
    }
}

function nextSurah() {
    if(currentSurahNum < 114) loadSurah(currentSurahNum + 1);
}

function prevSurah() {
    if(currentSurahNum > 1) loadSurah(currentSurahNum - 1);
}

document.addEventListener('DOMContentLoaded', () => {
    initSurahList();
});
