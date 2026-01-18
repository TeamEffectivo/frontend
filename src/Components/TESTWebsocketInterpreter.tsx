import { useRef, useEffect, useState } from 'react';

type SignResults = {
    sign: string
    latency_seconds: string
}

const SignInterpreter = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ws = useRef<WebSocket>(new WebSocket(""));

    const [result, setResult] = useState<SignResults | null>(null);
    const [loading, setLoading] = useState(false);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        ws.current = new WebSocket("ws://localhost:8000/ws/sign-language");

        ws.current.onopen = () => setConnected(true);
        ws.current.onclose = () => setConnected(false);
        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setResult(data);
            setLoading(false);
        };

        // Initialize Webcam
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => { if (videoRef.current) videoRef.current.srcObject = stream; })
            .catch(err => console.error("Webcam Error:", err));

        return () => ws.current?.close();
    }, []);

    const captureAndSend = () => {
        if (!connected) return;

        setLoading(true);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const video = videoRef.current;
        if (!video) return;
        canvas.width = 640; // Downscale slightly for faster upload
        canvas.height = 480;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Extract base64
        const imageData = canvas.toDataURL('image/jpeg', 0.7);

        // Send via WebSocket
        ws.current.send(JSON.stringify({ image: imageData }));
    };

    return (
        <div className="flex flex-col items-center p-4 gap-4">
            <h2 className="text-xl font-bold">SignQuest Interpreter</h2>

            <div className="relative">
                <video ref={videoRef} autoPlay playsInline className="rounded-lg border-4 border-gray-700 w-full max-w-md" />
                <canvas ref={canvasRef} className="hidden" />
            </div>

            <button
                onClick={captureAndSend}
                disabled={!connected || loading}
                className={`px-6 py-2 rounded-full text-white font-bold ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
                {loading ? "Analyzing..." : "Capture & Interpret"}
            </button>

            {result && (
                <div className="mt-4 p-4 bg-white shadow-md rounded-lg border-l-4 border-green-500">
                    <p className="text-lg font-semibold">Detected Sign: {result.sign}</p>
                    <p className="text-sm text-gray-500">Latency: {result.latency_seconds}s</p>
                </div>
            )}
            {!connected && <p className="text-red-500">WebSocket Disconnected</p>}
        </div>
    );
};

export default SignInterpreter;