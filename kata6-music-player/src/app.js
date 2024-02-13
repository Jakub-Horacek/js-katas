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

  createLibraryFragment() {
    const fragment = document.createDocumentFragment();

    const ulElement = document.createElement("ul");
    ulElement.classList.add("library");

    this.libraryData.forEach((music) => {
      const listItem = document.createElement("li");
      listItem.classList.add("library__song");

      const playButton = document.createElement("button");
      playButton.textContent = "Play";
      playButton.classList.add("play-button");
      playButton.addEventListener("click", () => {
        this.handlePlayButtonClick(music);
      });
      listItem.appendChild(playButton);

      const songName = document.createElement("div");
      songName.classList.add("song__name");
      songName.textContent = music.name;
      listItem.appendChild(songName);

      const artistNames = document.createElement("div");
      artistNames.classList.add("song__artists");
      music.artists.forEach((artist) => {
        const artistName = document.createElement("div");
        artistName.classList.add("song__artist");
        artistName.textContent = artist;
        artistNames.appendChild(artistName);
      });
      listItem.appendChild(artistNames);

      ulElement.appendChild(listItem);

      // Attach the playButton and audioElement to the music object for reference
      music.playButton = playButton;
      music.audioElement = new Audio(music.path);
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
      music.playButton.textContent = "Stop";
      this.currentlyPlaying = music;
      this.logger.log(`Playing ${music.name}`, "info");

      // Event listener for handling the end of audio playback
      music.audioElement.addEventListener("ended", () => {
        this.stopSong(music);
      });
    }
  }

  stopSong(music) {
    if (music.playButton) {
      music.playButton.textContent = "Play";
    }
    if (this.currentlyPlaying === music) {
      this.currentlyPlaying = null;
    }
    if (music.audioElement) {
      music.audioElement.pause();
      music.audioElement.currentTime = 0;
      this.logger.log(`Stopped ${music.name}`, "info");
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

    logger.log("DOMContentLoaded, Hilldal initialized");

    const response = await fetch("./library.json");
    const libraryData = await response.json();

    const musicLibrary = new Library(libraryData, logger);

    musicLibrary.showLibraryFragment();
  } catch (error) {
    console.error(error);
  }
});
