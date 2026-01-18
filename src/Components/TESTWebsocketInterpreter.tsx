import { useRef, useEffect, useState } from 'react';

type SignResults = {
    sign: string;
    latency_seconds: number;
    frame_id?: number;
};

const SignInterpreter = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ws = useRef<WebSocket | null>(null);
    const frameCounter = useRef(0);
    const lastProcessedFrame = useRef(-1);

    const [result, setResult] = useState<SignResults | null>(null);
    const [isActive, setIsActive] = useState(false);
    const [connected, setConnected] = useState(false);

    // 1. WebSocket Management
    const toggleService = () => {
        if (isActive) {
            ws.current?.close();
            setIsActive(false);
        } else {
            const socket = new WebSocket("ws://localhost:8000/ws/sign-language");

            socket.onopen = () => setConnected(true);
            socket.onclose = () => {
                setConnected(false);
                setIsActive(false);
            };
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                // Out-of-order protection
                if (data.frame_id > lastProcessedFrame.current) {
                    lastProcessedFrame.current = data.frame_id;
                    setResult(data);
                }
            };
            ws.current = socket;
            setIsActive(true);
        }
    };

    // 2. Automated Ticker Loop
    useEffect(() => {
        let interval: number | undefined;

        if (isActive && connected) {
            interval = setInterval(() => {
                captureAndSend();
            }, 1000); // 1-second interval
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, connected]);

    // 3. Capture Logic
    const captureAndSend = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || !ws.current || ws.current.readyState !== WebSocket.OPEN) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = 480; // Lower resolution = faster upload & lower latency
        canvas.height = 360;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = canvas.toDataURL('image/jpeg', 0.6); // Compress to save bandwidth

        ws.current.send(JSON.stringify({
            image: imageData,
            frame_id: frameCounter.current
        }));
        frameCounter.current += 1;
    };

    // Initialize Webcam
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => { if (videoRef.current) videoRef.current.srcObject = stream; })
            .catch(err => console.error("Webcam Error:", err));
    }, []);

    return (
        <div className="flex flex-col items-center p-6 gap-6 bg-gray-50 rounded-xl shadow-inner">
            <h2 className="text-2xl font-bold text-gray-800">SignQuest Live Interpreter</h2>

            <div className="relative overflow-hidden rounded-2xl border-4 border-gray-800 shadow-2xl bg-black">
                <video ref={videoRef} autoPlay playsInline className="w-full max-w-md h-auto" />
                <canvas ref={canvasRef} className="hidden" />

                {/* Visual Status Indicator */}
                <div className={`absolute top-4 right-4 w-4 h-4 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            </div>

            <div className="flex gap-4">
                <button
                    onClick={toggleService}
                    className={`px-8 py-3 rounded-full text-white font-bold transition-all transform active:scale-95 ${isActive
                            ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200'
                            : 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200'
                        }`}
                >
                    {isActive ? "Stop Interpreter" : "Start Live Interpreter"}
                </button>
            </div>

            {result && isActive && (
                <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg border-b-4 border-blue-500 animate-in fade-in slide-in-from-bottom-2">
                    <p className="text-sm uppercase tracking-widest text-gray-400 font-bold mb-1">Detected Message</p>
                    <p className="text-3xl font-black text-blue-600 mb-2">{result.sign}</p>
                    <div className="flex justify-between text-xs text-gray-500 font-medium">
                        <span>Latency: {result.latency_seconds}s</span>
                        <span>Frame ID: #{lastProcessedFrame.current}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SignInterpreter;