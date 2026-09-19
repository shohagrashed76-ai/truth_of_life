let currentDate = new Date();
let currentCity = localStorage.getItem('userCity') || 'Darsana';
let currentLat = localStorage.getItem('userLat') || null;
let currentLng = localStorage.getItem('userLng') || null;
let qiblaAngle = 277; // Default Qibla angle for BD (~277 deg)
let surahList = [];
let tasbihCount = 0;

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

    document.getElementById('display-date').innerText = currentDate.toLocaleDateString('bn-BD', { month: 'long', day: 'numeric', year: 'numeric' });
    updateCityDisplays(currentCity);

    let primaryUrl = (currentLat && currentLng) 
        ? `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${currentLat}&longitude=${currentLng}&method=1`
        : `https://api.aladhan.com/v1/timingsByCity/${day}-${month}-${year}?city=${encodeURIComponent(currentCity)}&country=Bangladesh&method=1`;

    let fallbackUrl = `https://api.aladhan.com/v1/timingsByCity/${day}-${month}-${year}?city=Chuadanga&country=Bangladesh&method=1`;

    const applyTimings = (data) => {
        if(data && data.code === 200 && data.data) {
            const timings = data.data.timings;
            const hijri = data.data.date.hijri;

            document.getElementById('display-hijri').innerText = `${hijri.day} ${hijri.month.en} ${hijri.year} হিজরী`;

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

    calculateQibla();
}

function calculateQibla() {
    if (currentLat && currentLng) {
        let lat = parseFloat(currentLat) * Math.PI / 180;
        let lng = parseFloat(currentLng) * Math.PI / 180;
        let meccaLat = 21.422487 * Math.PI / 180;
        let meccaLng = 39.826206 * Math.PI / 180;

        let y = Math.sin(meccaLng - lng);
        let x = Math.cos(lat) * Math.tan(meccaLat) - Math.sin(lat) * Math.cos(meccaLng - lng);
        qiblaAngle = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
    }
}

function updateNextPrayerCard(timings) {
    const now = new Date();
    const prayerOrder = [
        { name: 'ফজর', time: timings.Fajr, key: 'Fajr' },
        { name: 'সূর্যোদয়', time: timings.Sunrise, key: 'Sunrise' },
        { name: 'জোহর', time: timings.Dhuhr, key: 'Dhuhr' },
        { name: 'আসর', time: timings.Asr, key: 'Asr' },
        { name: 'মাগরিব', time: timings.Maghrib, key: 'Maghrib' },
        { name: 'ইশা', time: timings.Isha, key: 'Isha' }
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

    document.getElementById('current-prayer-name').innerText = `পরবর্তী নামাজ: ${nextPrayer.name}`;
    document.getElementById('current-prayer-time').innerText = nextPrayer.time;

    const rowEl = document.getElementById(`row-${nextPrayer.key}`);
    if(rowEl) rowEl.classList.add('active');

    const diffMs = nextPrayerTimeDate - now;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    document.getElementById('next-prayer-countdown').innerText = `বাকি আছে ${diffHrs} ঘণ্টা ${diffMins} মিনিট (${nextPrayer.name})`;
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
                alert("GPS Location Safolvabe Set Hoya Geche!");
            },
            err => {
                alert("GPS Location On Korun ba Permissn Din.");
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    } else {
        alert("GPS Support Korche Na.");
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
        container.innerHTML = '<p style="text-align:center; padding:20px; color:#9ca3af;">কোনো সূরা পাওয়া যায়নি!</p>';
        return;
    }

    container.innerHTML = list.map(s => `
        <div class="surah-item" onclick="openSurahDetail(${s.number}, '${s.englishName.replace(/'/g, "\\'")}')">
            <div class="surah-left">
                <div class="surah-num">${s.number}</div>
                <div class="surah-names">
                    <h4>${s.englishName}</h4>
                    <small>${s.revelationType === 'Meccan' ? 'মক্কী' : 'মাদানী'} • ${s.numberOfAyahs} আয়াত</small>
                </div>
            </div>
            <div class="surah-ar-name">${s.name}</div>
        </div>
    `).join('');
}

function normalizeStr(str) {
    return str.toLowerCase().replace(/^al[\s\-']*/i, '').replace(/[^a-z0-9]/g, '');
}

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
            openSurahDetail(surahNum, sObj ? sObj.englishName : `সূরা ${surahNum}`, targetAyat);
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
        return cleanEng.includes(cleanQuery) || arName.includes(searchStr.toLowerCase()) || numStr === cleanQuery;
    });

    if(isSubmit) {
        if(filtered.length > 0) {
            openSurahDetail(filtered[0].number, filtered[0].englishName, targetAyat);
        } else {
            alert("সূরা খুঁজে পাওয়া যায়নি!");
        }
        return;
    }

    renderSurahList(filtered);
}

function openSurahDetail(surahNum, englishName, targetAyat = null) {
    document.getElementById('quran-list-view').style.display = 'none';
    document.getElementById('quran-detail-view').style.display = 'block';
    document.getElementById('surahDetailTitle').innerText = englishName || `সূরা ${surahNum}`;
    
    const container = document.getElementById('ayatsContainer');
    container.innerHTML = '<p style="text-align:center; padding:20px; color:#9ca3af;">সূরা লোড হচ্ছে...</p>';

    fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/editions/quran-uthmani,bn.bengali`)
        .then(res => res.json())
        .then(data => {
            if(data && data.data && data.data.length >= 2) {
                const arAyahs = data.data[0].ayahs;
                const bnAyahs = data.data[1].ayahs;

                let bismillahHeader = '';
                if(surahNum !== 9) {
                    bismillahHeader = `
                        <div style="text-align:center; padding:18px; margin-bottom:20px; background:rgba(16,185,129,0.12); border:1px solid rgba(16,185,129,0.3); border-radius:15px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                            <div style="font-size:1.8rem; color:#10b981; font-family:'Amiri', serif; font-weight:bold; line-height:1.6;">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
                            <small style="color:#d1d5db; display:block; margin-top:6px; font-size:0.95rem;">পরম করুণাময় অসীম দয়ালু আল্লাহর নামে শুরু করছি</small>
                        </div>
                    `;
                }

                container.innerHTML = bismillahHeader + arAyahs.map((ar, i) => {
                    let arText = ar.text;
                    if(surahNum !== 1 && surahNum !== 9 && i === 0) {
                        arText = arText.replace("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", "").replace("بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ", "").trim();
                    }
                    return `
                        <div class="aya-card" id="aya-${i+1}" style="margin-bottom:15px; padding:15px; background:rgba(255,255,255,0.03); border-radius:12px; border:1px solid rgba(255,255,255,0.05);">
                            <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                                <span style="font-size:0.85rem; background:#10b981; color:#fff; padding:2px 8px; border-radius:10px; font-weight:bold;">আয়াত ${i+1}</span>
                            </div>
                            <div class="ar-text" style="font-size:1.6rem; text-align:right; line-height:2.2; color:#10b981; font-family:'Amiri', serif;">${arText} ﴿${i+1}﴾</div>
                            <div class="bn-text" style="margin-top:10px; color:#e5e7eb; font-size:1rem; line-height:1.6;">${bnAyahs[i] ? bnAyahs[i].text : ''}</div>
                        </div>
                    `;
                }).join('');

                if(targetAyat && targetAyat <= arAyahs.length) {
                    setTimeout(() => {
                        let el = document.getElementById(`aya-${targetAyat}`);
                        if(el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            el.style.backgroundColor = 'rgba(16, 185, 129, 0.25)';
                        }
                    }, 400);
                }
            }
        });
}

function openSurahDirect(surahNum) {
    switchTab('quran');
    openSurahDetail(surahNum, 'সূরা আল-কাহফ');
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

function initQiblaCompass() {
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', handleOrientation, true);
    }
}

function handleOrientation(event) {
    let compass = event.alpha;
    if (event.webkitCompassHeading) {
        compass = event.webkitCompassHeading;
    }
    if (compass !== null && compass !== undefined) {
        let heading = Math.round(compass);
        let dialEl = document.getElementById('compassDial');
        let degEl = document.getElementById('compassDegreeText');
        let dirEl = document.getElementById('compassDirText');
        let qiblaIconEl = document.getElementById('qiblaPointer');

        if (dialEl) {
            dialEl.style.transform = `rotate(${-heading}deg)`;
        }

        if (degEl) {
            degEl.innerText = `${heading}°`;
        }

        if (dirEl) {
            let dirs = ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest'];
            let index = Math.round(heading / 45) % 8;
            dirEl.innerText = dirs[index];
        }

        if (qiblaIconEl) {
            let relativeQibla = qiblaAngle - heading;
            qiblaIconEl.style.transform = `rotate(${relativeQibla}deg)`;
        }
    }
}

function loadDuas() {
    const duas = [
        { title: "ঘুম থেকে ওঠার দোয়া", ar: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ", bn: "উচ্চারণ: আলহামদু লিল্লাহিল্লাজি আহইয়ানা বা'দা মা আমাতানা ওয়া ইলাইহিন নুশূর।\nঅর্থ: সমস্ত প্রশংসা আল্লাহর জন্য, যিনি আমাদের মৃত্যুর (ঘুমের) পর পুনরায় জীবিত করলেন এবং তাঁর দিকেই আমাদের প্রত্যাবর্তন।" },
        { title: "ঘুমোতে যাওয়ার দোয়া", ar: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي ، وَبِكَ أَرْفَعُهُ", bn: "উচ্চারণ: বিসমিকা রব্বি ওয়াদাতু জাম্বি ওয়া বিকা আরফাউহ।\nঅর্থ: হে আমার প্রতিপালক! আপনার নাম নিয়েই আমি শয়ন করলাম এবং আপনার নামেই পুনরায় উঠব।" },
        { title: "খাবার খাওয়ার আগের দোয়া", ar: "بِسْمِ اللهِ", bn: "উচ্চারণ: বিসমিল্লাহ।\nঅর্থ: আল্লাহর নামে শুরু করছি।" },
        { title: "খাবার খাওয়ার পরের দোয়া", ar: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مِنَ الْمُسْلِمِينَ", bn: "উচ্চারণ: আলহামদু লিল্লাহিল্লাজি আত'আমানা ওয়া সাকানা ওয়া জা'আলানা মিনাল মুসলিমিন।\nঅর্থ: সমস্ত প্রশংসা আল্লাহর জন্য, যিনি আমাদের আহার করিয়েছেন, পানীয় দান করেছেন এবং মুসলিম হিসেবে সৃষ্টি করেছেন।" },
        { title: "ঘর থেকে বের হওয়ার দোয়া", ar: "بِسْمِ اللهِ تَوَكَّلْتُ عَلَى اللهِ وَلاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بَاللَّهِ", bn: "উচ্চারণ: বিসমিল্লাহি তাওয়াক্কালতু আলাল্লাহ, ওয়া লা হাওলা ওয়া লা কুওয়াতা ইল্লা বিল্লাহ।\nঅর্থ: আল্লাহর নামে বের হচ্ছি, আল্লাহর ওপর সম্পূর্ণ ভরসা করলাম।" },
        { title: "মসজিদে প্রবেশের দোয়া", ar: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ", bn: "উচ্চারণ: আল্লাহুম্মাফতাহ লি আবওয়াবা রহমাতিক।\nঅর্থ: হে আল্লাহ! আমার জন্য আপনার রহমতের দরজাগুলো খুলে দিন।" },
        { title: "মসজিদ থেকে বের হওয়ার দোয়া", ar: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ", bn: "উচ্চারণ: আল্লাহুম্মা ইন্নি আসআলুকা মিন ফাদলিক।\nঅর্থ: হে আল্লাহ! আমি আপনার নিকট অনুগ্রহ ও বরকত প্রার্থনা করছি।" },
        { title: "টয়লেটে প্রবেশের দোয়া", ar: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ", bn: "উচ্চারণ: আল্লাহুম্মা ইন্নি আউজু বিকা মিনাল খুবুসি ওয়াল খাবাইস।\nঅর্থ: হে আল্লাহ! আমি অপবিত্র শয়তান থেকে আপনার আশ্রয় প্রার্থনা করছি।" },
        { title: "টয়লেট থেকে বের হওয়ার দোয়া", ar: "غُفْرَانَكَ", bn: "উচ্চারণ: গুফরানাকা।\nঅর্থ: হে আল্লাহ! আমি আপনার নিকট ক্ষমা প্রার্থনা করছি।" },
        { title: "বিপদ ও দুশ্চিন্তা মুক্তির দোয়া", ar: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ", bn: "উচ্চারণ: লা ইলাহা ইল্লা আন্তা সুবহানাকা ইন্নি কুন্তু মিনাজ জ্বালিমীন।\nঅর্থ: তুমি ছাড়া কোনো উপাস্য নেই, তুমি অতি পবিত্র! নিশ্চয়ই আমি অপরাধীদের অন্তর্ভুক্ত।" },
        { title: "ক্ষমা প্রার্থনার দোয়া", ar: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ", bn: "উচ্চারণ: আল্লাহুম্মা আন্তা রব্বি লা ইলাহা ইল্লা আন্তা খালাকতানি ওয়া আনা আবদুকা।\nঅর্থ: হে আল্লাহ! তুমিই আমার একমাত্র প্রতিপালক, তুমি ছাড়া কোনো ইলাহ নেই।" }
    ];
    document.getElementById('duasContainer').innerHTML = duas.map(d => `
        <div class="aya-card" style="margin-bottom:15px; padding:15px; background:rgba(255,255,255,0.03); border-radius:12px; border:1px solid rgba(16,185,129,0.2);">
            <h4 style="color:#10b981; margin-bottom:8px; font-size:1.1rem;">${d.title}</h4>
            <div class="ar-text" style="font-size:1.5rem; color:#e5e7eb; line-height:2; text-align:right; font-family:'Amiri', serif;">${d.ar}</div>
            <div class="bn-text" style="white-space:pre-line; color:#d1d5db; font-size:0.95rem; margin-top:8px; line-height:1.6;">${d.bn}</div>
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
    notes.unshift({ text, date: new Date().toLocaleDateString('bn-BD') });
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
        window.open(`https://www.google.com/maps/search/mosque/@${currentLat},${currentLng},16z`, '_system');
    } else {
        window.open(`https://www.google.com/maps/search/mosque+near+me/`, '_system');
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
