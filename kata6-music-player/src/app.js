class Logger {
  constructor() {
    this.prefix = "Music Player";
    this.currentlyPlaying = null;
  }

  log(message, type = "log") {
    switch (type) {
      case "info":
        console.info(
          `%c${this.prefix} [INFO]: ${message}`,
          "color: lightblue;",
        );
        break;
      case "warn":
        console.warn(`%c${this.prefix} [WARN]: ${message}`, "color: orange;");
        break;
      case "error":
        console.error(`%c${this.prefix} [ERROR]: ${message}`, "color: red;");
        break;
      case "debug":
        console.debug(`%c${this.prefix} [DEBUG]: ${message}`, "color: grey;");
        break;
      default:
        console.log(
          `%c${this.prefix} [${type.toUpperCase()}]: ${message}`,
          "color: white;",
        );
    }
  }
}

class Library {
  constructor(libraryData, logger) {
    this.libraryData = libraryData;
    this.appElement = document.getElementById("app");
    this.logger = logger;
    this.path = "./../public/assets";
    this.currentVolume = 0.5;
  }

  createSoundWaveElement() {
    const bars = document.createElement("div");
    bars.classList.add("bars");

    for (let i = 0; i < 5; i++) {
      const bar = document.createElement("div");
      bar.classList.add("bars__bar");
      bar.classList.add(`bar__${i}`);
      bars.appendChild(bar);
    }

    bars.style.display = "none";

    return bars;
  }

  createLibraryFragment() {
    const fragment = document.createDocumentFragment();

    const ulElement = document.createElement("ul");
    ulElement.classList.add("library");

    this.libraryData.forEach((music) => {
      const listItem = document.createElement("li");
      listItem.classList.add("library__song");

      const leftSide = document.createElement("div");
      leftSide.classList.add("song--left");

      const playButton = document.createElement("button");
      playButton.textContent = "▶️";
      playButton.classList.add("song__button");
      playButton.addEventListener("click", () => {
        this.handlePlayButtonClick(music);
      });
      leftSide.appendChild(playButton);

      const imageFile =
        music?.imageFile != null ? music.imageFile : "blank.png";

      const songImage = document.createElement("img");
      songImage.src = `${this.path}/images/albums/${imageFile}`;
      songImage.alt = music.name;
      songImage.classList.add("song__image");
      leftSide.appendChild(songImage);

      const songName = document.createElement("div");
      songName.classList.add("song__name");
      songName.textContent = music.name;
      leftSide.appendChild(songName);

      const artistNames = document.createElement("div");
      artistNames.classList.add("song__artists");
      music.artists.forEach((artist) => {
        const artistName = document.createElement("div");
        artistName.classList.add("song__artist");
        artistName.textContent = artist;
        artistNames.appendChild(artistName);
      });
      leftSide.appendChild(artistNames);
      listItem.appendChild(leftSide);

      const rightSide = document.createElement("div");
      rightSide.classList.add("song--right");

      const soundWave = this.createSoundWaveElement();
      rightSide.appendChild(soundWave);

      listItem.appendChild(rightSide);

      const songPreview = document.createElement("div");
      songPreview.classList.add("song__preview");

      const songImageBig = document.createElement("img");
      songImageBig.src = `${this.path}/images/albums/${imageFile}`;
      songImageBig.alt = music.name;
      songImageBig.classList.add("preview__image");
      songPreview.appendChild(songImageBig);

      const songInfo = document.createElement("div");
      songInfo.classList.add("preview__song");

      const previewSongName = document.createElement("div");
      previewSongName.classList.add("song__name");
      previewSongName.textContent = music.name;
      songInfo.appendChild(previewSongName);

      const previewArtistNames = document.createElement("div");
      previewArtistNames.classList.add("song__artists");
      music.artists.forEach((artist) => {
        const previewArtistName = document.createElement("div");
        previewArtistName.classList.add("song__artist");
        previewArtistName.textContent = artist;
        previewArtistNames.appendChild(previewArtistName);
      });
      songInfo.appendChild(previewArtistNames);
      songPreview.appendChild(songInfo);

      const controlButtons = document.createElement("div");
      controlButtons.classList.add("control__buttons");

      const prevButton = document.createElement("button");
      prevButton.textContent = "⏮️";
      prevButton.classList.add("control__button");
      prevButton.addEventListener("click", () => {
        this.playPreviousSong();
      });
      controlButtons.appendChild(prevButton);

      const playButtonPreviw = document.createElement("button");
      playButtonPreviw.textContent = "▶️";
      playButtonPreviw.classList.add("control__button");
      playButtonPreviw.addEventListener("click", () => {
        this.handlePlayButtonClick(music);
      });
      controlButtons.appendChild(playButtonPreviw);

      const nextButton = document.createElement("button");
      nextButton.textContent = "⏭️";
      nextButton.classList.add("control__button");
      nextButton.addEventListener("click", () => {
        this.playNextSong();
      });
      controlButtons.appendChild(nextButton);

      songPreview.appendChild(controlButtons);

      listItem.appendChild(songPreview);
      ulElement.appendChild(listItem);

      music.songPreview = songPreview;
      music.listItem = listItem;
      music.playButtonPreviw = playButtonPreviw;
      music.playButton = playButton;
      music.audioElement = new Audio(`${this.path}/music/${music.audioFile}`);
      music.soundWave = soundWave;
    });

    const volumeSliderContainer = document.createElement("div");
    volumeSliderContainer.classList.add("volume-slider");

    const volumeIcon = document.createElement("span");
    volumeIcon.textContent = "🔊";
    volumeIcon.classList.add("volume-icon");
    volumeSliderContainer.appendChild(volumeIcon);

    const volumeSlider = document.createElement("input");
    volumeSlider.type = "range";
    volumeSlider.min = 0;
    volumeSlider.max = 1;
    volumeSlider.step = 0.1;
    volumeSlider.value = this.currentVolume;
    volumeSlider.classList.add("volume-slider__input");

    volumeSlider.addEventListener("input", () => {
      this.handleVolumeChange(volumeSlider.value);
    });

    volumeSliderContainer.appendChild(volumeSlider);

    fragment.appendChild(volumeSliderContainer);
    fragment.appendChild(ulElement);

    return fragment;
  }

  playNextSong() {
    const currentIndex = this.libraryData.indexOf(this.currentlyPlaying);
    const nextIndex = (currentIndex + 1) % this.libraryData.length;
    this.handlePlayButtonClick(this.libraryData[nextIndex]);
  }

  playPreviousSong() {
    const currentIndex = this.libraryData.indexOf(this.currentlyPlaying);
    const prevIndex =
      (currentIndex - 1 + this.libraryData.length) % this.libraryData.length;
    this.handlePlayButtonClick(this.libraryData[prevIndex]);
  }

  handlePlayButtonClick(music) {
    // Check if a song is currently playing
    if (this.currentlyPlaying && this.currentlyPlaying !== music) {
      // Stop the currently playing song
      this.stopSong(this.currentlyPlaying);
    }

    // Check if the clicked song is already playing
    if (this.currentlyPlaying === music) {
      this.stopSong(music);
    } else {
      // Play the clicked song
      music.audioElement.play();
      music.audioElement.volume = this.currentVolume;
      music.playButton.textContent = "⏸️";
      music.playButtonPreviw.textContent = "⏸️";
      music.listItem.classList.add("library__song--playing");
      music.songPreview.classList.add("song__preview--visible");
      this.currentlyPlaying = music;
      this.logger.log(`Playing ${music.name}`, "log");

      // Show soundWave only on the currently playing song
      this.libraryData.forEach((song) => {
        song.soundWave.style.display = song === music ? "flex" : "none";
      });

      // Event listener for handling the end of audio playback
      music.audioElement.addEventListener("ended", () => {
        this.playNextSong();
      });
    }
  }

  handleVolumeChange(volume) {
    this.logger.log(`Volume changed to ${Math.round(volume * 100)}%`, "log");

    // Set the volume for the currently playing song (if any)
    if (this.currentlyPlaying) {
      this.currentlyPlaying.audioElement.volume = parseFloat(volume);
      this.currentVolume = volume;
    }
  }

  stopSong(music) {
    if (music.playButton) {
      music.playButton.textContent = "▶️";
    }
    if (music.playButtonPreviw) {
      music.playButtonPreviw.textContent = "▶️";
    }
    if (music.listItem) {
      music.listItem.classList.remove("library__song--playing");
      music.songPreview.classList.remove("song__preview--visible");
    }
    if (this.currentlyPlaying === music) {
      this.currentlyPlaying = null;
    }
    if (music.audioElement) {
      music.audioElement.pause();
      music.audioElement.currentTime = 0;
      this.logger.log(`Stopped ${music.name}`, "log");

      // Hide soundWave when the song stops
      if (music.soundWave) {
        music.soundWave.style.display = "none";
      }
    }
  }

  showLibraryFragment() {
    const container = this.createLibraryFragment();

    // Set initial volume value (you can adjust this as needed)
    this.handleVolumeChange(1);

    this.appElement.appendChild(container);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const logger = new Logger();
    const response = await fetch("./library.json");
    const libraryData = await response.json();

    const musicLibrary = new Library(libraryData, logger);

    musicLibrary.showLibraryFragment();
  } catch (error) {
    console.error(error);
  }
});
