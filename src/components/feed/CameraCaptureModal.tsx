import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Camera,
  X,
  RotateCw,
  Upload,
  AlertCircle,
  RefreshCw,
  Check,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Maximize2,
} from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoAccepted: (photoDataUrl: string) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onPhotoAccepted,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  type CameraState = 'loading' | 'ready' | 'captured' | 'error';
  const [cameraState, setCameraState] = useState<CameraState>('loading');
  const [statusText, setStatusText] = useState('Starting camera…');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorType, setErrorType] = useState<
    'blocked' | 'not-found' | 'in-use' | 'insecure' | 'unsupported' | 'other'
  >('other');

  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [videoReady, setVideoReady] = useState(false);
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [isMirrored, setIsMirrored] = useState(true);

  // Stop camera tracks helper
  const stopCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // ignore
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setVideoReady(false);
  }, []);

  // Start live webcam stream
  const startCamera = useCallback(async () => {
    stopCameraStream();
    setCameraState('loading');
    setStatusText('Starting camera…');
    setErrorMessage('');
    setVideoReady(false);
    setCapturedPhotoUrl(null);

    // 1. Verify Secure Context (HTTPS or localhost)
    const isLocalhost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '::1';
    const isHttps = window.location.protocol === 'https:';

    if (!window.isSecureContext && !isLocalhost && !isHttps) {
      setCameraState('error');
      setErrorType('insecure');
      setErrorMessage(
        'Camera access requires HTTPS or localhost. Please use a secure connection.'
      );
      return;
    }

    // 2. Verify mediaDevices API support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraState('error');
      setErrorType('unsupported');
      setErrorMessage(
        'Your browser does not support webcam video capture. You can upload a photo from your device instead.'
      );
      return;
    }

    try {
      // 3. Request camera stream with smart fallbacks
      let stream: MediaStream;
      const desiredFacing = facingMode;

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: desiredFacing },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch (constraintErr: any) {
        // Fallback to basic constraint if specific resolution or facing mode failed
        if (
          constraintErr.name === 'OverconstrainedError' ||
          constraintErr.name === 'ConstraintNotSatisfiedError'
        ) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        } else {
          throw constraintErr;
        }
      }

      streamRef.current = stream;

      // 4. Attach stream to video preview
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (playErr) {
          // Autoplay may need muted attribute (already set on <video>)
          console.warn('Video play interrupted:', playErr);
        }
      }

      // 5. Enumerate video devices to check if camera switching is possible
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter((d) => d.kind === 'videoinput');
        setHasMultipleCameras(videoInputs.length > 1);
      } catch {
        // Non-critical, fallback to facingMode toggle
        setHasMultipleCameras(true);
      }

      setStatusText('Camera ready');
      setIsMirrored(desiredFacing === 'user');
    } catch (err: any) {
      console.error('Camera access error:', err);
      stopCameraStream();
      setCameraState('error');

      const errName = err.name || '';
      if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError') {
        setErrorType('blocked');
        setErrorMessage(
          'Camera access is blocked. Allow camera permission in Chrome (click the camera/tune icon in the address bar), then click Retry Camera.'
        );
      } else if (
        errName === 'NotFoundError' ||
        errName === 'DevicesNotFoundError'
      ) {
        setErrorType('not-found');
        setErrorMessage(
          'No camera was found on this device. Please connect a webcam or upload a photo directly from your files.'
        );
      } else if (
        errName === 'NotReadableError' ||
        errName === 'TrackStartError'
      ) {
        setErrorType('in-use');
        setErrorMessage(
          'Camera is already in use by another browser tab or app. Please close other camera apps and retry.'
        );
      } else if (errName === 'SecurityError') {
        setErrorType('blocked');
        setErrorMessage(
          'Camera access was denied by your browser security or iframe policy.'
        );
      } else {
        setErrorType('other');
        setErrorMessage(
          err.message ||
            'Unable to start camera preview. Please check your browser permissions.'
        );
      }
    }
  }, [facingMode, stopCameraStream]);

  // Handler for video readiness events
  const handleVideoMetadataLoaded = () => {
    if (videoRef.current) {
      const width = videoRef.current.videoWidth;
      const height = videoRef.current.videoHeight;
      if (width > 0 && height > 0) {
        setVideoReady(true);
        setCameraState('ready');
        setStatusText('Camera ready');
      }
    }
  };

  const handleVideoCanPlay = () => {
    if (videoRef.current && videoRef.current.videoWidth > 0) {
      setVideoReady(true);
      setCameraState('ready');
      setStatusText('Camera ready');
    }
  };

  // Capture still image using canvas
  const handleCapturePhoto = () => {
    const video = videoRef.current;
    if (!video || !videoReady || video.videoWidth === 0 || video.videoHeight === 0) {
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Natural selfie mirroring: if preview was mirrored, mirror the canvas so user gets the selfie they saw
      if (isMirrored) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to high quality JPEG data URL (92% quality)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

      setCapturedPhotoUrl(dataUrl);
      setCameraState('captured');
      setStatusText('Photo captured');

      // Pause live stream during review
      stopCameraStream();
    } catch (captureErr) {
      console.error('Failed to capture frame from video:', captureErr);
      setErrorMessage('Failed to capture photo frame. Please try again.');
    }
  };

  // Retake photo
  const handleRetake = () => {
    setCapturedPhotoUrl(null);
    startCamera();
  };

  // Accept captured photo
  const handleAcceptPhoto = () => {
    if (!capturedPhotoUrl) return;
    onPhotoAccepted(capturedPhotoUrl);
    stopCameraStream();
    onClose();
  };

  // Switch camera front/back
  const handleSwitchCamera = () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    setIsMirrored(newMode === 'user');
  };

  // Fallback device file upload
  const handleDeviceFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onPhotoAccepted(reader.result);
        stopCameraStream();
        onClose();
      }
    };
    reader.readAsDataURL(file);
  };

  // Effect: start camera when modal opens, clean up when modal closes
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCameraStream();
    }

    return () => {
      stopCameraStream();
    };
  }, [isOpen, startCamera, stopCameraStream]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-lg bg-slate-900 rounded-3xl shadow-2xl border border-pink-500/30 overflow-hidden flex flex-col text-white">
        {/* Top Header */}
        <div className="p-4 sm:px-6 bg-slate-900/95 border-b border-white/10 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Campus Camera</span>
                {cameraState === 'ready' && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </h3>
              <p className="text-[11px] text-slate-400">
                {cameraState === 'captured' ? 'Photo review' : statusText}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mirror toggle for selfie */}
            {cameraState === 'ready' && facingMode === 'user' && (
              <button
                type="button"
                onClick={() => setIsMirrored(!isMirrored)}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-semibold transition-colors border ${
                  isMirrored
                    ? 'bg-pink-500/20 text-pink-300 border-pink-500/40'
                    : 'bg-white/10 text-slate-300 border-white/10'
                }`}
                title="Toggle Selfie Mirroring"
              >
                {isMirrored ? 'Mirrored' : 'Normal'}
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                stopCameraStream();
                onClose();
              }}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
              title="Close camera"
              aria-label="Close camera"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video / Preview Viewport */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[4/3] bg-black overflow-hidden flex items-center justify-center">
          {/* Live Video Preview */}
          {cameraState !== 'captured' && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              onLoadedMetadata={handleVideoMetadataLoaded}
              onCanPlay={handleVideoCanPlay}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                videoReady ? 'opacity-100' : 'opacity-0'
              } ${isMirrored ? 'scale-x-[-1]' : ''}`}
            />
          )}

          {/* Captured Static Preview */}
          {cameraState === 'captured' && capturedPhotoUrl && (
            <div className="relative w-full h-full">
              <img
                src={capturedPhotoUrl}
                alt="Captured moment"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-emerald-500/90 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-sm flex items-center gap-1">
                <Check className="w-3 h-3 stroke-[3]" />
                <span>Photo captured</span>
              </div>
            </div>
          )}

          {/* Loading State Overlay */}
          {cameraState === 'loading' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950 p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center animate-spin">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-slate-200">
                Starting camera…
              </div>
              <p className="text-[11px] text-slate-400 max-w-xs">
                Please allow camera access in Google Chrome when prompted.
              </p>
            </div>
          )}

          {/* Error State Overlay */}
          {cameraState === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950 p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-rose-300">
                {errorType === 'blocked'
                  ? 'Camera Permission Blocked'
                  : errorType === 'not-found'
                  ? 'No Camera Found'
                  : errorType === 'insecure'
                  ? 'Insecure Context'
                  : 'Camera Unavailable'}
              </div>
              <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
                {errorMessage}
              </p>

              {/* Action buttons on error */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-4 py-2 text-xs font-bold text-white bg-pink-600 hover:bg-pink-700 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Camera</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 text-xs font-bold text-slate-200 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5 text-pink-400" />
                  <span>Upload From Device</span>
                </button>
              </div>
            </div>
          )}

          {/* Hidden File Input for Device Upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleDeviceFileSelect}
            className="hidden"
          />
        </div>

        {/* Bottom Control Bar */}
        <div className="p-4 sm:p-5 bg-slate-900 border-t border-white/10 flex items-center justify-between gap-3">
          {cameraState === 'captured' ? (
            /* Controls when photo is captured */
            <div className="w-full flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleRetake}
                className="px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retake Photo</span>
              </button>

              <button
                type="button"
                onClick={handleAcceptPhoto}
                className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-xl shadow-md shadow-pink-500/25 transition-all flex items-center gap-2"
              >
                <span>Use Photo in Post</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Live Camera Controls */
            <>
              {/* Fallback upload button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 sm:px-3.5 sm:py-2 text-xs font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 rounded-xl transition-colors flex items-center gap-1.5"
                title="Upload Photo From Device"
              >
                <Upload className="w-4 h-4 text-pink-400" />
                <span className="hidden sm:inline">Upload File</span>
              </button>

              {/* Main Shutter Button */}
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  disabled={!videoReady || cameraState !== 'ready'}
                  onClick={handleCapturePhoto}
                  className={`w-16 h-16 rounded-full p-1.5 border-4 transition-all transform flex items-center justify-center ${
                    videoReady && cameraState === 'ready'
                      ? 'border-pink-500 hover:scale-105 active:scale-95 shadow-lg shadow-pink-500/30 cursor-pointer'
                      : 'border-slate-700 opacity-40 cursor-not-allowed'
                  }`}
                  title={videoReady ? 'Capture Photo' : 'Waiting for camera…'}
                  aria-label="Capture Photo"
                >
                  <div
                    className={`w-full h-full rounded-full transition-colors ${
                      videoReady && cameraState === 'ready'
                        ? 'bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600'
                        : 'bg-slate-700'
                    }`}
                  />
                </button>
              </div>

              {/* Switch camera / cancel */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSwitchCamera}
                  disabled={cameraState !== 'ready'}
                  className={`p-2.5 rounded-xl transition-colors flex items-center gap-1 ${
                    cameraState === 'ready'
                      ? 'bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white'
                      : 'bg-white/5 text-slate-600 cursor-not-allowed'
                  }`}
                  title={
                    facingMode === 'user'
                      ? 'Switch to Back Camera'
                      : 'Switch to Front Camera'
                  }
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    stopCameraStream();
                    onClose();
                  }}
                  className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
