"use strict";

var Metronome = Metronome || class {
	constructor() {
		const AudioContext = window.AudioContext || window.webkitAudioContext;
		this.audioCtx = new AudioContext();

		this.bpm = 120.0;
	}

	start(bpm) {
		if (bpm) {
			this.bpm = bpm;
		}
		this.audioCtx.resume();
		this.scheduleClick();
		this.playing = true;
		console.log("start");
		return true;
	}

	stop() {
		if (this.tID) {
			clearTimeout(this.tID);
			this.tID = null;
		}
		if (this.gainNode) {
			this.gainNode.disconnect();
			this.gainNode = null;
		}
		this.playing = false;
		console.log("stop");
	}

	scheduleClick() {
		if (this.tID) {
			clearTimeout(this.tID);
			this.tID = null;
		}
		if (this.gainNode) {
			this.gainNode.disconnect();
			this.gainNode = null;
		}

		const audioCtx = this.audioCtx;
		this.gainNode = audioCtx.createGain();
		this.gainNode.gain.value = Metronome.GAIN;
		this.gainNode.connect(audioCtx.destination);

		for (let n = 0; n < Metronome.SCHEDULE_TIMES; n++) {
			const oscNode = audioCtx.createOscillator();
			oscNode.type = Metronome.CLICK_WAVE_TYPE;
			oscNode.frequency.value = Metronome.CLICK_FREQ;
			oscNode.connect(this.gainNode);
			const startInterval = n * (60.0 / this.bpm);
			oscNode.start(audioCtx.currentTime + startInterval);
			oscNode.stop(audioCtx.currentTime + startInterval + Metronome.CLICK_LEN_SEC);
		}
		this.tID = setTimeout(this.scheduleClick.bind(this),
				Math.round(Metronome.SCHEDULE_TIMES * (60.0 / this.bpm) * 1000.0));
		console.log("scheduleClick");
	}
};

Metronome.CLICK_FREQ = 880.0;
Metronome.CLICK_LEN_SEC = 1.0 / Metronome.CLICK_FREQ * 15.0;
Metronome.CLICK_WAVE_TYPE = "triangle";
Metronome.SCHEDULE_TIMES = 32;
Metronome.GAIN = 1.0;
Metronome.MIN_BPM = 1;
Metronome.MAX_BPM = 999;
