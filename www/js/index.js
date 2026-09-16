var allSurahs = [];

const sajdahAyahs = {
    "7": [206], "13": [15], "16": [50], "17": [109], "19": [58],
    "22": [18, 77], "25": [60], "27": [26], "32": [15], "38": [24],
    "41": [38], "53": [62], "84": [21], "96": [19]
};

const namesOfAllah = [
    { ar: "الله", en: "Allah", bn: "আল্লাহ (একমাত্র উপাস্য)" },
    { ar: "الرَّحْمَٰنُ", en: "Ar-Rahman", bn: "পরম করুণাময়" },
    { ar: "الرَّحِيمُ", en: "Ar-Raheem", bn: "অতি দয়ালু" },
    { ar: "الْمَلِكُ", en: "Al-Malik", bn: "সর্বভৌম ক্ষমতার অধিকারী" },
    { ar: "الْقُدُّوسُ", en: "Al-Quddus", bn: "পবিত্র ও নিষ্কলঙ্ক" },
    { ar: "السَّلَامُ", en: "As-Salam", bn: "শান্তিদাতা" },
    { ar: "الْمُؤْمِنُ", en: "Al-Mu'min", bn: "নিরাপত্তা ও ঈমান দাতা" },
    { ar: "الْمُهَيْمِنُ", en: "Al-Muhaymin", bn: "রক্ষণাবেক্ষণকারী" },
    { ar: "الْعَزِيزُ", en: "Al-Aziz", bn: "মহাপরাক্রমশালী" },
    { ar: "الْجَبَّارُ", en: "Al-Jabbar", bn: "দুর্নিবার প্রতাপশালী" },
    { ar: "الْمُتَكَبِّرُ", en: "Al-Mutakabbir", bn: "নিরঙ্কুশ মহিমাময়" },
    { ar: "الْخَالِقُ", en: "Al-Khaliq", bn: "সৃষ্টিকর্তা" },
    { ar: "الْبَارِئُ", en: "Al-Bari'", bn: "সঠিক রূপদাতা" },
    { ar: "الْمُصَوِّرُ", en: "Al-Musawwir", bn: "আকৃতিদানকারী" },
    { ar: "الْغَفَّارُ", en: "Al-Ghaffar", bn: "মহাক্ষমাশীল" },
    { ar: "الْقَهَّارُ", en: "Al-Qahhar", bn: "কঠোর দমনকারী" },
    { ar: "الْوَهَّابُ", en: "Al-Wahhab", bn: "মহাদাতা" },
    { ar: "الرَّزَّاقُ", en: "Ar-Razzaq", bn: "রিজিকদাতা" },
    { ar: "الْفَتَّاحُ", en: "Al-Fattah", bn: "উন্মোচনকারী ও বিজয়দাতা" },
    { ar: "الْعَلِيمُ", en: "Al-Alim", bn: "সর্বজ্ঞাত" },
    { ar: "الْقَابِضُ", en: "Al-Qabid", bn: "সংকোচনকারী" },
    { ar: "الْبَاسِطُ", en: "Al-Basit", bn: "প্রসারণকারী" },
    { ar: "الْخَافِضُ", en: "Al-Khafid", bn: "অবনতকারী" },
    { ar: "الرَّافِعُ", en: "Ar-Rafi'", bn: "উন্নতকারী" },
    { ar: "الْمُعِزُّ", en: "Al-Mu'izz", bn: "সম্মানদাতা" },
    { ar: "الْمُذِلُّ", en: "Al-Mudhill", bn: "অপমানকারী" },
    { ar: "السَّمِيعُ", en: "As-Sami'", bn: "সর্বশ্রোতা" },
    { ar: "الْبَصِيرُ", en: "Al-Basir", bn: "সর্বদ্রষ্টা" },
    { ar: "الْحَكَمُ", en: "Al-Hakam", bn: "বিচারক" },
    { ar: "الْعَدْلُ", en: "Al-Adl", bn: "পরম ন্যায়বিচারক" },
    { ar: "اللَّطِيفُ", en: "Al-Latif", bn: "সুক্ষ্মদর্শী ও মেহেরবান" },
    { ar: "الْخَبِيرُ", en: "Al-Khabir", bn: "সর্ববিষয় অবহিত" },
    { ar: "الْحَلِيمُ", en: "Al-Halim", bn: "ধৈর্যশীল" },
    { ar: "الْعَظِيمُ", en: "Al-Azim", bn: "মহান ও সুউচ্চ" },
    { ar: "الْغَفُورُ", en: "Al-Ghafur", bn: "ক্ষমাশীল" },
    { ar: "الشَّكُورُ", en: "Ash-Shakur", bn: "গুণগ্রাহী" },
    { ar: "الْعَلِيُّ", en: "Al-Ali", bn: "উচ্চ মর্যাদাশীল" },
    { ar: "الْكَبِيرُ", en: "Al-Kabir", bn: "মহামহিম" },
    { ar: "الْحَفِيظُ", en: "Al-Hafiz", bn: "হেফাজতকারী" },
    { ar: "الْمُقِيتُ", en: "Al-Muqit", bn: "জীবনোপকরণ দাতা" },
    { ar: "الْحَسِيبُ", en: "Al-Hasib", bn: "হিসাব গ্রহণকারী" },
    { ar: "الْجَلِيلُ", en: "Al-Jalil", bn: "মহিমান্বিত" },
    { ar: "الْكَرِيمُ", en: "Al-Karim", bn: "মহাদানশীল" },
    { ar: "الرَّقِيبُ", en: "Ar-Raqib", bn: "তত্ত্বাবধানকারী" },
    { ar: "الْمُجِيبُ", en: "Al-Mujib", bn: "দোয়া কবুলকারী" },
    { ar: "الْوَاسِعُ", en: "Al-Wasi'", bn: "সর্বব্যাপী" },
    { ar: "الْحَكِيمُ", en: "Al-Hakim", bn: "প্রজ্ঞাময়" },
    { ar: "الْوَدُودُ", en: "Al-Wadud", bn: "প্রেমময়" },
    { ar: "الْمَجِيدُ", en: "Al-Majid", bn: "মহামহিম" },
    { ar: "الْبَاعِثُ", en: "Al-Ba'ith", bn: "পুনরুজ্জীবিতকারী" },
    { ar: "الشَّهِيدُ", en: "Ash-Shahid", bn: "সর্বদর্শী সাক্ষী" },
    { ar: "الْحَقُّ", en: "Al-Haqq", bn: "পরম সত্য" },
    { ar: "الْوَكِيلُ", en: "Al-Wakil", bn: "কর্মবিধায়ক" },
    { ar: "الْقَوِيُّ", en: "Al-Qawiyy", bn: "শক্তিশালী" },
    { ar: "الْمَتِينُ", en: "Al-Matin", bn: "সুদৃঢ়" },
    { ar: "الْوَلِيُّ", en: "Al-Waliyy", bn: "অভিভাবক" },
    { ar: "الْحَمِيدُ", en: "Al-Hamid", bn: "প্রশংসিত" },
    { ar: "الْمُحْصِي", en: "Al-Muhsi", bn: "হিসাব সংরক্ষণকারী" },
    { ar: "الْمُبْدِئُ", en: "Al-Mubdi'", bn: "প্রারম্ভকারী" },
    { ar: "الْمُعِيدُ", en: "Al-Mu'id", bn: "পুনরায় সৃষ্টিকারী" },
    { ar: "الْمُحْيِي", en: "Al-Muhyi", bn: "জীবনদাতা" },
    { ar: "الْمُمِيتُ", en: "Al-Mumit", bn: "মৃত্যুদাতা" },
    { ar: "الْحَيُّ", en: "Al-Hayy", bn: "চিরঞ্জীব" },
    { ar: "الْقَيُّومُ", en: "Al-Qayyum", bn: "স্বয়ংসম্পূর্ণ" },
    { ar: "الْوَاجِدُ", en: "Al-Wajid", bn: "প্রাপক" },
    { ar: "الْمَاجِدُ", en: "Al-Majid", bn: "শ্রেষ্ঠত্বের অধিকারী" },
    { ar: "الْوَاحِدُ", en: "Al-Wahid", bn: "একক" },
    { ar: "الأَحَدُ", en: "Al-Ahad", bn: "এক ও অদ্বিতীয়" },
    { ar: "الصَّمَدُ", en: "As-Samad", bn: "অমুখাপেক্ষী" },
    { ar: "الْقَادِرُ", en: "Al-Qadir", bn: "সর্বশক্তিমান" },
    { ar: "الْمُقْتَدِرُ", en: "Al-Muqtadir", bn: "পূর্ণ ক্ষমতাবান" },
    { ar: "الْمُقَدِّمُ", en: "Al-Muqaddim", bn: "অগ্রসরকারী" },
    { ar: "الْمُؤَخِّرُ", en: "Al-Mu'akhkhir", bn: "পশ্চাৎগামীকারী" },
    { ar: "الأَوَّلُ", en: "Al-Awwal", bn: "অনাদি / প্রথম" },
    { ar: "الأَخِرُ", en: "Al-Akhir", bn: "অনন্ত / শেষ" },
    { ar: "الظَّاهِرُ", en: "Az-Zahir", bn: "প্রকাশ্য" },
    { ar: "الْبَاطِنُ", en: "Al-Batin", bn: "গুপ্ত" },
    { ar: "الْوَالِي", en: "Al-Wali", bn: "শাসক" },
    { ar: "الْمُتَعَالِي", en: "Al-Muta'ali", bn: "সুউচ্চ" },
    { ar: "الْبَرُّ", en: "Al-Barr", bn: "অনুগ্রহকারী" },
    { ar: "التَّوَّابُ", en: "At-Tawwab", bn: "তওবা কবুলকারী" },
    { ar: "الْمُنْتَقِمُ", en: "Al-Muntaqim", bn: "প্রতিশোধ গ্রহণকারী" },
    { ar: "العَفُوُّ", en: "Al-Afuww", bn: "মার্জনাকারী" },
    { ar: "الرَّءُوفُ", en: "Ar-Ra'uf", bn: "পরম স্নেহশীল" },
    { ar: "مَالِكُ الْمُلْكِ", en: "Malik-ul-Mulk", bn: "বিশ্বসাম্রাজ্যের মালিক" },
    { ar: "ذُو الْجَلَالِ وَالإِكْرَامِ", en: "Zul-Jalali wal-Ikram", bn: "মহিমান্বিত ও মহানুভব" },
    { ar: "الْمُقْسِطُ", en: "Al-Muqsit", bn: "সুসংগত বিচারক" },
    { ar: "الْجَامِعُ", en: "Al-Jami'", bn: "একত্রকারী" },
    { ar: "الْغَنِيُّ", en: "Al-Ghaniyy", bn: "ধনী ও স্বাবলম্বী" },
    { ar: "الْمُغْنِي", en: "Al-Mughni", bn: "অভাবমোচনকারী" },
    { ar: "الْمَانِعُ", en: "Al-Mani'", bn: "প্রতিরোধকারী" },
    { ar: "الضَّارُّ", en: "Ad-Darr", bn: "ক্ষতি সাধনকারী" },
    { ar: "النَّافِعُ", en: "An-Nafi'", bn: "উপকারকারী" },
    { ar: "النُّورُ", en: "An-Nur", bn: "জ্যোতি" },
    { ar: "الْهَادِي", en: "Al-Hadi", bn: "পথপ্রদর্শক" },
    { ar: "الْبَدِيعُ", en: "Al-Badi'", bn: "অনুপম রূপকার" },
    { ar: "الْبَاقِي", en: "Al-Baqi", bn: "চিরস্থায়ী" },
    { ar: "الْوَارِثُ", en: "Al-Warith", bn: "সর্বোচ্চ উত্তরাধিকারী" },
    { ar: "الرَّشِيدُ", en: "Ar-Rashid", bn: "সঠিক পথনির্দেশক" },
    { ar: "الصَّبُورُ", en: "As-Sabur", bn: "অত্যন্ত ধৈর্যশীল" }
];

const dailyDuas = [
    { title: "ঘুম থেকে ওঠার দোয়া", ar: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ", pron: "আলহামদু লিল্লাহিল্লাজি আহইয়ানা বা'দা মা আমাতানা ওয়া ইলাইহিন নুশূর।", bn: "সকল প্রশংসা আল্লাহর জন্য, যিনি আমাদের মৃত্যুর (ঘুমের) পর পুনরায় জীবিত করলেন এবং তাঁর দিকেই সবার উত্থান।" },
    { title: "ঘুমাতে যাওয়ার দোয়া", ar: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا", pron: "বিস্মিকা আল্লাহুম্মা আমূতু ওয়া আহইয়া।", bn: "হে আল্লাহ! আপনারই নামে আমি মৃত্যুবরণ করছি (ঘুমাচ্ছি) এবং আপনার নামেই জীবিত (জাগ্রত) হচ্ছি।" },
    { title: "খাওয়ার আগের দোয়া", ar: "بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ", pron: "বিসমিল্লাহি ওয়া 'আলা বারাকাতিল্লাহ।", bn: "আল্লাহর নামে এবং আল্লাহর বরকতের ওপর খাওয়া শুরু করছি।" },
    { title: "খাওয়ার শেষের দোয়া", ar: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مِنَ الْمُسْلِمِينَ", pron: "আলহামদু লিল্লাহিল্লাজি আত'আমানা ওয়া সাকানা ওয়া জা'আলানা মিনাল মুসলিমীন।", bn: "সকল প্রশংসা সেই আল্লাহর জন্য, যিনি আমাদের খাওয়ালেন, পান করালেন এবং মুসলমানদের অন্তর্ভুক্ত করলেন।" },
    { title: "মসজিদে প্রবেশের দোয়া", ar: "اللَّهُمَّ افتَح لِي أَبوَابَ رَحمَتِكَ", pron: "আল্লাহুম্মাফতাহ লী আবওয়াবা রাহমাতিক।", bn: "হে আল্লাহ! আমার জন্য আপনার রহমতের দরজাগুলো খুলে দিন।" },
    { title: "মসজিদ থেকে বের হওয়ার দোয়া", ar: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ", pron: "আল্লাহুম্মা ইন্নী আসআলুকা মিন ফাদলিক।", bn: "হে আল্লাহ! নিশ্চয়ই আমি আপনার কাছে আপনার অনুগ্রহ প্রার্থনা করছি।" },
    { title: "ঘরে প্রবেশের দোয়া", ar: "بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا", pron: "বিসমিল্লাহি ওয়ালাজনা, ওয়া বিসমিল্লাহি খারাজনা, ওয়া 'আলা রাব্বিনা তাওয়াক্কালনা।", bn: "আল্লাহর নামে আমরা প্রবেশ করলাম, আল্লাহর নামেই বের হলাম এবং আমাদের রব্ব-এর ওপর ভরসা করলাম।" },
    { title: "যানবাহনে চড়ার দোয়া", ar: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنْقَلِبُونَ", pron: "সুবহানাল্লাজি সাখখারা লানা হাজা ওয়ামা কুন্না লাহু মুকরিনীন, ওয়া ইন্না ইলা রাব্বিনা লামুনকালিবুন।", bn: "পবিত্র তিনি যিনি একে আমাদের বশীভূত করে দিয়েছেন, অথচ আমরা একে বশীভূত করতে সক্ষম ছিলাম না। আর আমরা আমাদের রব্ব-এর দিকেই প্রত্যাবর্তনকারী।" }
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
        html += `<div style="padding:12px; background:#e0f7fa; border-radius:6px; text-align:center;">
            <h2 style="margin:5px 0; color:#006064;">${n.ar}</h2>
            <b style="font-size:14px; color:#00838f;">${n.en}</b><br>
            <span style="font-size:12px; color:#333;">${n.bn}</span>
        </div>`;
    });
    html += '</div>';
    appDiv.innerHTML = html;
}

function loadDuas() {
    var appDiv = document.getElementById('app');
    var html = '<button class="btn-back" onclick="renderSurahList(allSurahs)">< Back</button>';
    html += '<h2 style="text-align:center; color:#4a148c;">দৈনন্দিন গুরুত্বপূর্ণ দোয়া</h2>';
    dailyDuas.forEach(d => {
        html += `<div style="padding:15px; background:#f3e5f5; border-left:5px solid #4a148c; border-radius:6px; margin-bottom:12px;">
            <h3 style="margin-top:0; color:#4a148c;">${d.title}</h3>
            <div style="font-size:20px; text-align:right; margin-bottom:8px; line-height:1.6;">${d.ar}</div>
            <p style="color:#2c3e50; margin:4px 0; font-size:14px;"><b>উচ্চারণ:</b> ${d.pron}</p>
            <p style="color:#1b5e20; margin:4px 0; font-size:14px;"><b>অর্থ:</b> ${d.bn}</p>
        </div>`;
    });
    appDiv.innerHTML = html;
}
