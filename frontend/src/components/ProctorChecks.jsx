import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';

const ProctorChecks = ({ onViolation }) => {
    const webcamRef = useRef(null);
    const [model, setModel] = useState(null);
    const [status, setStatus] = useState('Initializing AI...');
    const [streamActive, setStreamActive] = useState(false);

    useEffect(() => {
        const loadModel = async () => {
            try {
                await tf.ready();
                const loadedModel = await blazeface.load();
                setModel(loadedModel);
                setStatus('Monitoring Active');
            } catch (err) {
                console.error("AI Load Error:", err);
                setStatus('AI Error (Check Connection)');
            }
        };
        loadModel();
    }, []);

    useEffect(() => {
        let interval;
        const detectFace = async () => {
            if (
                model &&
                webcamRef.current &&
                webcamRef.current.video &&
                webcamRef.current.video.readyState === 4
            ) {
                const video = webcamRef.current.video;

                // Ensure video has dimensions
                if (video.videoWidth === 0 || video.videoHeight === 0) return;

                try {
                    const returnTensors = false;
                    const predictions = await model.estimateFaces(video, returnTensors);

                    if (predictions.length === 0) {
                        setStatus('⚠️ No Face Detected!');
                        onViolation('No face detected');
                    } else if (predictions.length > 1) {
                        setStatus('⚠️ Multiple Faces Detected!');
                        onViolation('Multiple faces detected');
                    } else {
                        setStatus('✅ Proctoring Active');
                    }
                } catch (err) {
                    console.warn("Detection warning:", err);
                }
            }
        };

        if (model) {
            // Check every 1 second (1000ms) for better responsiveness
            interval = setInterval(detectFace, 1000);
        }

        return () => clearInterval(interval);
    }, [model, onViolation]);

    // Enhanced Tab Switching & Focus Detection
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                onViolation('Tab switch / Minimized detected');
            }
        };

        const handleWindowBlur = () => {
            // Optional: differentiate between clicking outside vs minimizing
            // onViolation('Window lost focus'); 
            // Keeping it strict for now:
            onViolation('Window focus lost (Clicking outside?)');
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleWindowBlur);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleWindowBlur);
        };
    }, [onViolation]);

    return (
        <div className="glass-card" style={{ padding: '10px', position: 'fixed', bottom: '20px', right: '20px', width: '220px', zIndex: 1000, textAlign: 'center' }}>
            <h4 style={{ marginBottom: '10px', fontSize: '0.9rem' }}>🛡️ AI Proctoring</h4>
            <div style={{ position: 'relative', width: '100%', height: '150px', background: '#000', borderRadius: '8px', overflow: 'hidden' }}>
                <Webcam
                    ref={webcamRef}
                    audio={false}
                    onUserMedia={() => setStreamActive(true)}
                    onUserMediaError={() => setStatus('Camera Access Denied')}
                    screenshotFormat="image/jpeg"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {!streamActive && <div style={{ position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem' }}>Starting Camera...</div>}
            </div>
            <div style={{ marginTop: '10px', fontSize: '0.8rem', fontWeight: 'bold', color: status.includes('⚠️') ? 'var(--error)' : 'var(--success)' }}>
                {status}
            </div>
        </div>
    );
};

export default ProctorChecks;
