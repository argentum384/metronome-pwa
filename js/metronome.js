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
		this.schedule();
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

	changeBpm(bpm) {
		if (bpm === this.bpm || bpm < Metronome.MIN_BPM || bpm > Metronome.MAX_BPM) {
			return;
		}
		this.bpm = bpm;

		if (this.playing) {
			if (this.tID) {
				clearTimeout(this.tID);
				this.tID = null;
			}
			if (this.gainNode) {
				this.gainNode.disconnect();
				this.gainNode = null;
			}
			const elapsed = (performance.now() - this.lastScheduled) / 1000.0;
			const interval = 60.0 / this.bpm;
			this.schedule(Math.max(interval - ((elapsed + interval) % interval), 0.0));
		}
	}

	schedule(wait) {
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

		wait = wait >= 0.0 ? wait : 0.0;
		for (let n = 0; n < Metronome.SCHEDULE_TIMES; n++) {
			const oscNode = audioCtx.createOscillator();
			oscNode.type = Metronome.CLICK_WAVE_TYPE;
			oscNode.frequency.value = Metronome.CLICK_FREQ;
			oscNode.connect(this.gainNode);
			const startInterval = n * (60.0 / this.bpm);
			oscNode.start(wait + audioCtx.currentTime + startInterval);
			oscNode.stop(wait + audioCtx.currentTime + startInterval + Metronome.CLICK_LEN_SEC);
		}
		this.tID = setTimeout(this.schedule.bind(this),
				Math.round((wait + Metronome.SCHEDULE_TIMES * (60.0 / this.bpm)) * 1000.0));
		this.lastScheduled = wait * 1000.0 + performance.now();
		console.log("schedule");
	}
};

Metronome.CLICK_FREQ = 880.0;
Metronome.CLICK_LEN_SEC = 1.0 / Metronome.CLICK_FREQ * 15.0;
Metronome.CLICK_WAVE_TYPE = "triangle";
Metronome.SCHEDULE_TIMES = 32;
Metronome.GAIN = 1.0;
Metronome.MIN_BPM = 1;
Metronome.MAX_BPM = 999;
