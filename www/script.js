let isPlaying = false;

function togglePlay() {
    const playBtn = document.getElementById('playBtn');
    isPlaying = !isPlaying;
    if(isPlaying) {
        playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    } else {
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    }
}
