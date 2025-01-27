class Soundmobile {
  constructor() {
    this.audioBuffers = {};
    this.audioContext;

    this.preloadSounds();
  }

  preloadSounds() {
    // Initialize AudioContext
    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();

    // Load sounds into buffers
    this.loadSound("assets/sounds/slap.mp3", "slap");
    this.loadSound("assets/sounds/pop2.wav", "pop");
  }

  loadSound(url, name) {
    fetch(url)
      .then((response) => response.arrayBuffer())
      .then((data) => this.audioContext.decodeAudioData(data))
      .then((buffer) => {
        this.audioBuffers[name] = buffer;
      })
      .catch((error) => console.error(`Error loading sound: ${name}`, error));
  }

  playSound(name) {
    const buffer = this.audioBuffers[name];
    if (buffer) {
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(this.audioContext.destination);
      source.start(0);
    } else {
      console.error(`Sound not loaded: ${name}`);
    }
  }
}
