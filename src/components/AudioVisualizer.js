import React, { useEffect, useRef } from 'react';
import * as Tone from 'tone';

function AudioVisualizer({ stream }) {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyzerRef = useRef(null);

  useEffect(() => {
    if (!stream) return; // Ensure stream is not null

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    const analyzer = audioContext.createAnalyser();

    analyzer.fftSize = 2048;
    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(analyzer);
    analyzer.connect(audioContext.destination);

    const draw = () => {
      requestAnimationFrame(draw);

      analyzer.getByteFrequencyData(dataArray);

      canvasCtx.fillStyle = 'black';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        canvasCtx.fillStyle = 'white';
        canvasCtx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
        x += barWidth + 1;
      }
    };

    draw();

    return () => {
      audioContext.close();
    };
  }, [stream]);

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={200}
      style={{ border: '1px solid white' }}
    ></canvas>
  );
}

export default AudioVisualizer;
