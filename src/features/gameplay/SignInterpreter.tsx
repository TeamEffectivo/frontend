import { useRef, useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader2, RotateCcw, Camera } from 'lucide-react';
import { EnvConfig } from '../../EnvConfig';

type Status = 'idle' | 'checking' | 'success' | 'wrong';

const BASE_URL = EnvConfig.VITE_BACKEND_WS_URL

export const SignInterpreter = ({ expectedAnswer, onSuccess, onFailure }: any) => {
    const vRef = useRef<HTMLVideoElement>(null);
    const ws = useRef<WebSocket | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const timerRef = useRef<any>(null);
    const statusRef = useRef<Status>('idle');
    const frameRef = useRef(0);

    const [status, setStatus] = useState<Status>('idle');
    const [result, setResult] = useState<string>("");
    const [timeLeft, setTimeLeft] = useState(4);

    const updateStatus = (s: Status) => {
        statusRef.current = s;
        setStatus(s);
    };

    const stop = () => {
        if (ws.current) ws.current.close();
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
        }
        if (vRef.current) vRef.current.srcObject = null;
        clearTimeout(timerRef.current);
    };

    // IMPORTANT: Reset everything when the word changes
    useEffect(() => {
        stop();
        updateStatus('idle');
        setResult("");
        setTimeLeft(4);
    }, [expectedAnswer]);

    const validate = (sign: string | null, isTimeout = false) => {
        if (statusRef.current !== 'checking') return;
        const isCorrect = sign?.toLowerCase() === expectedAnswer.toLowerCase();

        if (isCorrect || isTimeout) {
            const final = isCorrect ? 'success' : 'wrong';
            updateStatus(final);
            stop();
            if (isCorrect) onSuccess(); else onFailure();
        }
    };

    const start = async () => {
        try {
            const s = await navigator.mediaDevices.getUserMedia({ video: true });
            streamRef.current = s;
            if (vRef.current) vRef.current.srcObject = s;

            ws.current = new WebSocket(`${BASE_URL}/ws/sign-language`);
            ws.current.onmessage = (e) => {
                const data = JSON.parse(e.data);
                setResult(data.sign);
                validate(data.sign);
            };

            updateStatus('checking');
            setResult(""); 
            setTimeLeft(4);
            frameRef.current = 0;
            timerRef.current = setTimeout(() => validate(null, true), 100000000);
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        let countdown: any;
        if (status === 'checking' && timeLeft > 0) {
            countdown = setInterval(() => setTimeLeft(t => t - 1), 1000);
        }
        return () => clearInterval(countdown);
    }, [status, timeLeft]);

    useEffect(() => {
        const int = setInterval(() => {
            if (statusRef.current !== 'checking' || !vRef.current || ws.current?.readyState !== 1) return;
            const canvas = document.createElement('canvas');
            canvas.width = 480; canvas.height = 360;
            canvas.getContext('2d')?.drawImage(vRef.current, 0, 0, 480, 360);
            ws.current.send(JSON.stringify({ image: canvas.toDataURL('image/jpeg', 0.6), frame_id: frameRef.current++ }));
        }, 1000);
        return () => { clearInterval(int); stop(); };
    }, []);

    return (
        <div className="flex flex-col items-center p-6 gap-6 bg-white rounded-[2.5rem] shadow-xl border-2 border-slate-100 w-full max-w-lg mx-auto">
            <div className="grid grid-cols-2 w-full gap-4 pb-2 border-b-2 border-slate-50">
                <div className="text-center">
                    <p className="text-[10px] font-black uppercase text-slate-400">Target</p>
                    <h2 className="text-4xl font-black text-blue-600">{expectedAnswer}</h2>
                </div>
                <div className="text-center border-l-2 border-slate-100">
                    <p className="text-[10px] font-black uppercase text-slate-400">Your Answer</p>
                    <h2 className={`text-4xl font-black ${result ? 'text-orange-500' : 'text-slate-200'}`}>
                        {result || "—"}
                    </h2>
                </div>
            </div>

            <div className="relative rounded-[2rem] border-4 border-slate-900 bg-black aspect-video w-full overflow-hidden shadow-2xl">
                <video ref={vRef} autoPlay playsInline className={`w-full h-full object-cover ${status !== 'checking' ? 'opacity-40 grayscale' : ''}`} />
                
                {status === 'checking' && (
                    <div className="absolute bottom-0 left-0 h-2 bg-blue-500 animate-[shrink_4s_linear_forwards]" />
                )}

                {status !== 'checking' && status !== 'idle' && (
                    <div className={`absolute inset-0 flex flex-col items-center justify-center backdrop-blur-md animate-in zoom-in ${status === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        {status === 'success' ? <CheckCircle size={80} className="text-green-500 fill-white" /> : <XCircle size={80} className="text-red-500 fill-white" />}
                        <span className="text-white font-black text-3xl mt-4 uppercase italic">
                            {status === 'success' ? 'Brilliant!' : 'Try Again'}
                        </span>
                    </div>
                )}
            </div>

            <div className="w-full">
                {status === 'idle' && <Btn onClick={start} icon={<Camera size={24} />} text="START CAMERA" color="bg-blue-600" />}
                {status === 'wrong' && <Btn onClick={() => { updateStatus('idle'); start(); }} icon={<RotateCcw size={24} />} text="RETRY" color="bg-orange-500" />}
                {status === 'checking' && (
                    <div className="flex items-center justify-center gap-2 text-blue-600 font-black animate-pulse">
                        <Loader2 className="animate-spin" size={20} /> <span>{timeLeft}s REMAINING...</span>
                    </div>
                )}
                {status === 'success' && (
                   <div className="text-center font-black text-green-600 py-2">SIGN MATCHED!</div>
                )}
            </div>
            <style>{`@keyframes shrink { from { width: 100%; } to { width: 0%; } }`}</style>
        </div>
    );
};

const Btn = ({ onClick, icon, text, color }: any) => (
    <button onClick={onClick} className={`w-full py-4 ${color} text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all`}>
        {icon} {text}
    </button>
);