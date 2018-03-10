let app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!'
    }
})


if (navigator.mediaDevices) {
    console.log('getUserMedia supported.');
    navigator.mediaDevices.getUserMedia({audio: true, video: false})
    .then(function(stream) {
        // Create a MediaStreamAudioSourceNode
        // Feed the HTMLMediaElement into it
        let audioCtx = new AudioContext();
        let source = audioCtx.createMediaStreamSource(stream);
        let analyser = audioCtx.createAnalyser();

        // Connect the nodes, back to the souput
        source.connect(analyser);
        //analyser.connect(audioCtx.destination);
        
        analyser.fftSize = 4096;
        var bufferLength = analyser.frequencyBinCount;
        var dataArray = new Uint8Array(bufferLength);
        
        var WIDTH = 600;
        var HEIGHT = 300;
        
        var canvasCtxStreamGraph = document.getElementById('canvasStream').getContext('2d');
        var canvasCtxBarGraph = document.getElementById('canvasBars').getContext('2d');
        canvasCtxStreamGraph.clearRect(0, 0, WIDTH, HEIGHT);
        canvasCtxBarGraph.clearRect(0, 0, WIDTH, HEIGHT);
        function draw() {
            drawVisual = requestAnimationFrame(draw);
            analyser.getByteTimeDomainData(dataArray);
            
            canvasCtxStreamGraph.fillStyle = 'rgb(200, 200, 200)';
            canvasCtxStreamGraph.fillRect(0, 0, WIDTH, HEIGHT);
            canvasCtxStreamGraph.lineWidth = 2;
            canvasCtxStreamGraph.strokeStyle = 'rgb(0, 0, 0)';
            canvasCtxStreamGraph.beginPath();
            var sliceWidth = WIDTH * 1.0 / bufferLength;
            var x = 0;
            for(var i = 0; i < bufferLength; i++) {
                var v = dataArray[i] / 128.0;
                var y = v * HEIGHT/2;
                if(i === 0) {
                  canvasCtxStreamGraph.moveTo(x, y);
                } else {
                  canvasCtxStreamGraph.lineTo(x, y);
                }
                x += sliceWidth;
            }
            canvasCtxStreamGraph.lineTo(WIDTH, HEIGHT/2);
            canvasCtxStreamGraph.stroke();
            
            analyser.getByteFrequencyData(dataArray);
            canvasCtxBarGraph.fillStyle = 'rgb(0, 0, 0)';
            canvasCtxBarGraph.fillRect(0, 0, WIDTH, HEIGHT);
            var barWidth = (WIDTH / bufferLength) * 2.5;
            var barHeight;
            var x = 0;
            for(var i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i]*2;
                canvasCtxBarGraph.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
                canvasCtxBarGraph.fillRect(x, HEIGHT-barHeight/2, barWidth, barHeight);
                x += barWidth + 1;
            }
        };
        draw();
        
        console.log(bufferLength);

        canvasCtxBarGraph.clearRect(0, 0, WIDTH, HEIGHT);
        /*// Create a biquadfilter
        let biquadFilter = audioCtx.createBiquadFilter();
        biquadFilter.type = "lowshelf";
        biquadFilter.frequency.value = 1000;
        biquadFilter.gain.value = range.value;

        // connect the AudioBufferSourceNode to the gainNode
        // and the gainNode to the destination, so we can play the
        // music and adjust the volume using the mouse cursor
        source.connect(biquadFilter);
        biquadFilter.connect(audioCtx.destination);

        // Get new mouse pointer coordinates when mouse is moved
        // then set new gain value

        range.oninput = function() {
            biquadFilter.gain.value = range.value;
        }*/
    })
    .catch(function(err) {
        console.log('The following gUM error occured: ' + err);
    });
} else {
   console.log('getUserMedia not supported on your browser!');
}

/*// Create audio context
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let source = audioCtx.createMediaStreamSource(stream);
let analyser = audioCtx.createAnalyser();

// Connect the nodes, back to the souput
source.connect(analyser);
analyser.connect(audioCtx.destination);
*/
