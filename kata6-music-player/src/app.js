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
      ulElement.appendChild(listItem);

      // Attach the playButton, audioElement, and soundWave to the music object for reference
      music.listItem = listItem;
      music.playButton = playButton;
      music.audioElement = new Audio(music.path);
      music.soundWave = soundWave;
    });

    fragment.appendChild(ulElement);
    return fragment;
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
      music.playButton.textContent = "⏸️";
      music.listItem.classList.add("library__song--playing");
      this.currentlyPlaying = music;
      this.logger.log(`Playing ${music.name}`, "log");

      // Show soundWave only on the currently playing song
      this.libraryData.forEach((song) => {
        song.soundWave.style.display = song === music ? "flex" : "none";
      });

      // Event listener for handling the end of audio playback
      music.audioElement.addEventListener("ended", () => {
        this.stopSong(music);
      });
    }
  }

  stopSong(music) {
    if (music.playButton) {
      music.playButton.textContent = "▶️";
    }
    if (music.listItem) {
      music.listItem.classList.remove("library__song--playing");
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

    this.appElement.appendChild(container);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const logger = new Logger();

    logger.log("DOMContentLoaded, Hilldal initialized", "info");

    const response = await fetch("./library.json");
    const libraryData = await response.json();

    const musicLibrary = new Library(libraryData, logger);

    musicLibrary.showLibraryFragment();
  } catch (error) {
    console.error(error);
  }
});
