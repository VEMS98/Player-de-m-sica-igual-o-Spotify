const songName = document.getElementById('song-name');
const bandName = document.getElementById('band-name');
const song = document.getElementById('audio');
const cover= document.getElementById('cover');
const play = document.getElementById('play');
const next = document.getElementById('next');
const previous= document.getElementById('previous');
const likeButton= document.getElementById('like');
const currentProgress= document.getElementById('current-progress');
const progressContainer= document.getElementById('progress-container');
const shuffleButton= document.getElementById('shuffle');
const repeatButton= document.getElementById('repeat');
const songTime = document.getElementById('song-time');
const totalTime = document.getElementById('total-time');

const cupidTwinVersion ={
    songName: 'Cupid (Twin Version)',
    artist : 'Fifty Fifty',
    file: 'Cupid (Twin Version)',
    liked: false,
};
const ditto={
    songName: 'Ditto',
    artist : 'NewJeans',
    file: 'Ditto',
    liked: true,
};
const holdOnTight ={
    songName: 'Hold On Tight',
    artist : 'Aespa',
    file: 'Hold On Tight',
    liked: false,
};
const loveMeLikeThis ={
    songName: 'Love Me Like This',
    artist : 'Nmixx',
    file: 'Love Me Like This',
    liked: false,
};
let isPlaying = false;
let isShuffled = false;
let repeatOn = false;
const originalPlaylist = JSON.parse(localStorage.getItem('playlist')) ?? [cupidTwinVersion, ditto, holdOnTight, loveMeLikeThis];
let sortedPlaylist =[...originalPlaylist];
let index = 0;

function playSong(){
    play.querySelector('.bi').classList.remove('bi-play-circle-fill');
    play.querySelector('.bi').classList.add('bi-pause-circle-fill');
    song.play();
    isPlaying = true;
}


function pauseSong(){
    play.querySelector('.bi').classList.add('bi-play-circle-fill');
    play.querySelector('.bi').classList.remove('bi-pause-circle-fill');
    song.pause();
    isPlaying = false;
}

function playPauseDecider(){
    if(isPlaying === true){
        pauseSong();
    }
    else {
        playSong();
    }
}

// função para o botão de like
function likeButtonRender(){
    if (sortedPlaylist[index].liked === true){
        likeButton.querySelector('.bi').classList.remove('bi-heart');
        likeButton.querySelector('.bi').classList.add('bi-heart-fill');
        likeButton.classList.add('button-active');
    }
    else {
        likeButton.querySelector('.bi').classList.add('bi-heart');
        likeButton.querySelector('.bi').classList.remove('bi-heart-fill');
        likeButton.classList.remove('button-active');
    }
}

// função da música atual
function initializeSong(){
    cover.src = `imagens/${sortedPlaylist[index].file}.png`;
    song.src = `songs/${sortedPlaylist[index].file}.mp3`;
    songName.innerText = sortedPlaylist[index].songName;
    bandName.innerText = sortedPlaylist[index].artist;
    likeButtonRender();
}

function previousSong(){
    if (index === 0){
        index = sortedPlaylist.length;
        // para voltar a musica index -=1  ou index = index - 1, sem voltar para a ultima musica
    }
    else{
        index -=1;
    }
    initializeSong();
    playSong();
}

function nextSong(){
    if (index === sortedPlaylist.length - 1){
        index = 0;
        // para voltar a musica index -=1  ou index = index - 1, sem voltar para a ultima musica
    }
    else{
        index +=1;
    }
    initializeSong();
    playSong();
}

function updateProgress(){
    const barWidth = (song.currentTime/song.duration)*100;
    currentProgress.style.setProperty('--progress', `${barWidth}%`);
    // atualizar o tempo atual da música
    songTime.innerText = toHHMMSS(song.currentTime);
}

// como avançar na barra de progresso
function jumpTo(event){
    const width = progressContainer.clientWidth;
    const clickPosition = event.offsetX;
    const jumpToTime = (clickPosition/width)* song.duration;
    song.currentTime = jumpToTime;
}

// função que embaralha Array
function shuffleArray(preShuffleArray){
    const size = preShuffleArray.length;
    let currentIndex = size - 1;
    while(currentIndex > 0){
     let randomIndex = Math.floor(Math.random()* size);
     let aux = preShuffleArray[currentIndex];
     preShuffleArray[currentIndex] = preShuffleArray[randomIndex];
     preShuffleArray[randomIndex] = aux;
     currentIndex -= 1;
    }
}


// funçaõ do botão shuffle
function shuffleButtonClicked(){
 if(isShuffled === false){
    isShuffled = true;
    shuffleArray(sortedPlaylist);
    shuffleButton.classList.add('button-active');
 }
 else{
    isShuffled = false;
    sortedPlaylist = [...originalPlaylist];
    shuffleButton.classList.remove('button-active');
 }
}

//função notão repetir
function repeatButtonClicked(){
    if(repeatOn === false){
        repeatOn = true;
        repeatButton.classList.add('button-active');
    }
    else{
        repeatOn = false;
        repeatButton.classList.remove('button-active');
    }
}

//função para continuar a playlist ou repetir
function nextOrRepeat(){
    if(repeatOn === false){
        nextSong();
    }
    else{
        playSong();
    }
}

//função para mudar para minutos
function toHHMMSS(originalNumber){
    let hours = Math.floor(originalNumber/3600);
    let min = Math.floor((originalNumber - hours * 3600)/60);
    let secs = Math.floor(originalNumber - hours* 3600 - min* 60);

    return `${hours.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// função para o tempo total da música
function updatedTotalTime(){
    totalTime.innerText = toHHMMSS(song.duration);
}

// função  de atualizar o botão de like
function likeButtonClicked(){
    if(sortedPlaylist[index].liked === false){
        sortedPlaylist[index].liked = true;
    }
    else{
        sortedPlaylist[index].liked = false;
    }
    likeButtonRender();
    localStorage.setItem('playlist', JSON.stringify(originalPlaylist));
}

initializeSong();

play.addEventListener('click', playPauseDecider);
previous.addEventListener('click', previousSong);
next.addEventListener('click', nextSong);
song.addEventListener('timeupdate', updateProgress);
song.addEventListener('ended', nextOrRepeat);
song.addEventListener('loadedmetadata', updatedTotalTime);
progressContainer.addEventListener('click', jumpTo);
shuffleButton.addEventListener('click', shuffleButtonClicked);
repeatButton.addEventListener('click', repeatButtonClicked);
likeButton.addEventListener('click', likeButtonClicked);