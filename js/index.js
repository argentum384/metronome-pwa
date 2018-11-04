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

	const startOrStop = function () {
		if (metronome.playing) {
			[inputBpm, btnUp10, btnUp1, btnDown1, btnDown10].forEach(x => x.disabled = false);
			btnStartOrStop.textContent = "START";
			metronome.stop();
		} else {
			const bpm = parseInt(inputBpm.value);
			if (bpm < Metronome.MIN_BPM || bpm > Metronome.MAX_BPM) {
				return;
			}
			localStorage.setItem("bpm", bpm);
			[inputBpm, btnUp10, btnUp1, btnDown1, btnDown10].forEach(x => x.disabled = true);
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
		const afterBpm = curBpm + diff;
		if (afterBpm < Metronome.MIN_BPM || afterBpm > Metronome.MAX_BPM) {
			return;
		}
		inputBpm.value = afterBpm;
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

	window.addEventListener("keydown", e => {
		if (!e.keyCode) {
			return;
		}
		switch (e.keyCode) {
			case 32:
				startOrStop();
				break;
			case 38:
				if (!metronome.playing) {
					e.shiftKey ? addBpm(10) : addBpm(1);
				}
				break;
			case 40:
				if (!metronome.playing) {
					e.shiftKey ? addBpm(-10) : addBpm(-1);
				}
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
