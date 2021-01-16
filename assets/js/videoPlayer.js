const videoContainer = document.getElementById("jsVideoPlayer");
const videoPlayer = document.querySelector("#jsVideoPlayer video");
const playBtn = document.getElementById("jsPlayButton");
const volumeBtn = document.getElementById("jsVolumeBtn");
const fullScrnBtn = document.getElementById("jsFullScreen");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeRange = document.getElementById("jsVolume");

const registerView = () => {
	const videoId = window.location.href.split("/videos/")[1];
	fetch(`/api/${videoId}/view`, {
		method: "POST",
	}); // 결과에 신경쓰지 않아 await 작성 안함.
};

// * To Control button
function handlePlayClick() {
	if (videoPlayer.paused) {
		videoPlayer.play();
		videoPlayer.currentTime = 42;
		playBtn.innerHTML = '<i class="fas fa-pause"></i>';
	} else {
		videoPlayer.pause();
		playBtn.innerHTML = '<i class="fas fa-play"></i>';
	}
}

function handleVolumeClick() {
	if (videoPlayer.muted) {
		videoPlayer.muted = false;
		volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
		volumeRange.value = videoPlayer.volume;
	} else {
		volumeRange.value = 0;
		videoPlayer.muted = true;
		volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
	}
}

function handleDrag(event) {
	const {
		target: { value },
	} = event;
	videoPlayer.volume = value;
	if (value > 0.7) {
		volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
	} else if (value > 0.4) {
		volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
	} else {
		volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
	}
}

// * Screen

function goFullScreen() {
	videoContainer.requestFullscreen();
	fullScrnBtn.innerHTML = '<i class="fas fa-compress"></i>';
	fullScrnBtn.removeEventListener("click", goFullScreen);
	fullScrnBtn.addEventListener("click", exitFullScreen);
}

function exitFullScreen() {
	document.exitFullscreen();
	fullScrnBtn.innerHTML = '<i class="fas fa-expand"></i>';
	fullScrnBtn.removeEventListener("click", exitFullScreen);
	fullScrnBtn.addEventListener("click", goFullScreen);
}

let fullKey = false;
document.onkeyup = (e) => {
	console.log(e);
	if (e.key == "f" || e.key == "F") {
		console.log(fullKey);
		if (fullKey == false) {
			fullKey = true;
			goFullScreen();
		} else {
			fullKey = false;
			exitFullScreen();
		}
	}
};

// * Time
const formatDate = (seconds) => {
	const secondsNumber = parseInt(seconds, 10);
	let hours = Math.floor(secondsNumber / 3600);
	let minutes = Math.floor((secondsNumber - hours * 3600) / 60);
	let totalSeconds = secondsNumber - hours * 3600 - minutes * 60;

	if (hours < 10) {
		hours = `0${hours}`;
	}
	if (minutes < 10) {
		minutes = `0${minutes}`;
	}
	if (totalSeconds < 10) {
		totalSeconds = `0${totalSeconds}`;
	}
	return `${hours}:${minutes}:${totalSeconds}`;
};

function setTotalTime() {
	const totalTimeString = formatDate(Math.floor(videoPlayer.duration));
	totalTime.innerHTML = totalTimeString;
}
function setCurrentTime() {
	currentTime.innerHTML = formatDate(videoPlayer.currentTime);
}

function handleEnded() {
	registerView();
	videoPlayer.currentTime = 0;
	playBtn.innerHTML = '<i class="fas fa-pause"></i>';
}

// * For Init
function init() {
	videoPlayer.volume = 1.0;
	playBtn.addEventListener("click", handlePlayClick);
	volumeBtn.addEventListener("click", handleVolumeClick);
	fullScrnBtn.addEventListener("click", goFullScreen);
	videoPlayer.addEventListener("loadedmetadata", setTotalTime);
	videoPlayer.addEventListener("timeupdate", setCurrentTime);
	videoPlayer.addEventListener("ended", handleEnded);
	volumeRange.addEventListener("input", handleDrag);
}

if (videoContainer) {
	init();
}
