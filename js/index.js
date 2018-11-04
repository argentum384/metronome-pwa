"use strict";

var metronome = metronome || new Metronome();

document.addEventListener("DOMContentLoaded", () => {
	const addClickEventListener = function (elem, func) {
		elem.addEventListener("touchstart", e => {
			if (!elem.disabled) func();
			e.preventDefault();
		});
		elem.addEventListener("mousedown", () => {
			if (!elem.disabled) func();
		});
	}

	const bpmStorage = localStorage.getItem("bpm");
	if (bpmStorage) {
		inputBpm.value = bpmStorage;
	}

	const saveBpm = function (bpm) {
		localStorage.setItem("bpm", bpm);
	}

	const startOrStop = function () {
		if (metronome.playing) {
			btnStartOrStop.textContent = "START";
			metronome.stop();
		} else {
			const bpm = parseInt(inputBpm.value);
			if (!bpm || bpm < Metronome.MIN_BPM || bpm > Metronome.MAX_BPM) {
				return;
			}
			btnStartOrStop.textContent = "STOP";
			metronome.start(bpm);
		}
	};
	addClickEventListener(btnStartOrStop, startOrStop);

	btnStartOrStop.addEventListener("keydown", e => {
		if (e.keyCode && e.keyCode === 32) {
			e.preventDefault();
		}
	});

	const addBpm = function (diff) {
		const curBpm = parseInt(inputBpm.value);
		if (curBpm == null) {
			return;
		}
		const bpm = curBpm + diff;
		if (!bpm || bpm < Metronome.MIN_BPM || bpm > Metronome.MAX_BPM) {
			return;
		}
		inputBpm.value = bpm;
		metronome.changeBpm(bpm);
		saveBpm(bpm);
	};
	addClickEventListener(btnUp10, addBpm.bind(null, 10));
	addClickEventListener(btnUp1, addBpm.bind(null, 1));
	addClickEventListener(btnDown1, addBpm.bind(null, -1));
	addClickEventListener(btnDown10, addBpm.bind(null, -10));

	inputBpm.addEventListener("keydown", e => {
		if (e.keyCode && (e.keyCode === 38 || e.keyCode === 40)) {
			e.preventDefault();
		}
	});

	let oldBpm = inputBpm.value;
	inputBpm.addEventListener("input", e => {
		if (inputBpm.value.length > 3) {
			inputBpm.value = inputBpm.value.slice(0, 3);
		}
		if (inputBpm.value.length === 0 || inputBpm.value <= 0) {
			inputBpm.value = oldBpm;
		} else {
			oldBpm = inputBpm.value;
			metronome.changeBpm(inputBpm.value);
			saveBpm(inputBpm.value);
		}
	});

	window.addEventListener("keydown", e => {
		if (!e.keyCode) {
			return;
		}
		switch (e.keyCode) {
			case 32:
				startOrStop();
				break;
			case 38:
				e.shiftKey ? addBpm(10) : addBpm(1);
				break;
			case 40:
				e.shiftKey ? addBpm(-10) : addBpm(-1);
				break;
		}
	});
	
	addClickEventListener(divShowHelp, () => {
		divHelp.style.display = divHelp.style.display === "block" ? "none" : "block";
	});

	addClickEventListener(divHelp, () => {
		divHelp.style.display = "none";
	});
});

if (navigator.serviceWorker) {
	navigator.serviceWorker.register("service-worker.js").then(registration => {
		console.log("ServiceWorker registration successful with scope: ", registration.scope);
	}).catch(err => {
		console.log("ServiceWorker registration failed", err);
	});
}
