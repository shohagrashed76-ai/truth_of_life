// Tab Switching
function switchTab(tabId, el) {
    document.querySelectorAll('.page-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById('tab-' + tabId).classList.add('active');
    el.classList.add('active');
}

// Quran Sub Navigation
function switchQuranSub(type) {
    document.querySelectorAll('.sub-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
}

// Render Surah List
const surahs = [
    { id: 1, name: "Al-Faatiha", meaning: "The Opener", ar: "الفاتحة" },
    { id: 2, name: "Al-Baqara", meaning: "The Cow", ar: "البقرة" },
    { id: 3, name: "Aal-i-Imraan", meaning: "Family of Imran", ar: "آل عمران" },
    { id: 4, name: "An-Nisaa", meaning: "The Women", ar: "النساء" },
    { id: 5, name: "Al-Maa'ida", meaning: "The Table Spread", ar: "المائدة" }
];

function renderSurahs() {
    const container = document.getElementById('sura-list-container');
    if(!container) return;
    
    container.innerHTML = surahs.map(s => `
        <div class="sura-item">
            <div>
                <strong>${s.id}. ${s.name}</strong>
                <p style="font-size:0.8rem; color:var(--text-muted);">${s.meaning}</p>
            </div>
            <span style="font-size:1.2rem; font-family:serif;">${s.ar}</span>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    renderSurahs();
});
