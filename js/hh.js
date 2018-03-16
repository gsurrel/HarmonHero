"use strict"

let app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!'
    }
})

let audioCtx = new AudioContext();
let analyser = audioCtx.createAnalyser();

if (!navigator.mediaDevices) {
	app.message = "You need a modern browser and a microphone for using this game.";
} else {
	navigator.mediaDevices.getUserMedia({audio: true, video: false})
	.then(function(stream) {
		// Create a MediaStreamAudioSourceNode
		// Feed the HTMLMediaElement into it

		let source = audioCtx.createMediaStreamSource(stream);

		// Connect the nodes, back to the souput
		source.connect(analyser);
		//analyser.connect(audioCtx.destination);

		analyser.fftSize = 2**12;
		let bufferLength = analyser.frequencyBinCount;
		let dataArray = new Uint8Array(bufferLength);

		const WIDTH = 600;
		const HEIGHT = 300;

		var canvasCtxBarGraph = document.getElementById('canvasBars').getContext('2d');
		canvasCtxBarGraph.clearRect(0, 0, WIDTH, HEIGHT);
		function draw() {
			analyser.getByteFrequencyData(dataArray);
			canvasCtxBarGraph.fillStyle = 'rgb(0, 0, 0)';
			canvasCtxBarGraph.fillRect(0, 0, WIDTH, HEIGHT);
			var barWidth = (WIDTH / bufferLength) * 2.5;
			var barHeight;
			var x = 0;
			for(var i = 0; i < bufferLength; i++) {
				barHeight = dataArray[i]*2;
				canvasCtxBarGraph.fillStyle = 'rgb(' + (barHeight*2+100) + ',50,50)';
				canvasCtxBarGraph.fillRect(x, HEIGHT-barHeight/2, barWidth, barHeight);
				x += barWidth + 1;
			}
			requestAnimationFrame(draw);
		};
		draw();
	})
	.catch(function(err) {
		app.message = err;
	});
}

function dumpData() {
	let bufferLength = analyser.frequencyBinCount;
	let dataArray = new Uint8Array(bufferLength);
	analyser.getByteFrequencyData(dataArray);
	app.message = dataArray.toString();
}

/*// Create audio context
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let source = audioCtx.createMediaStreamSource(stream);
let analyser = audioCtx.createAnalyser();

// Connect the nodes, back to the souput
source.connect(analyser);
analyser.connect(audioCtx.destination);
*/
