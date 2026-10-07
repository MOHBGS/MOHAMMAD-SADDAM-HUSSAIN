import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Download,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Message } from '../../types';

interface ChatImageLightboxProps {
  isOpen: boolean;
  activeImageIndex: number;
  imageMessages: Message[];
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const ChatImageLightbox: React.FC<ChatImageLightboxProps> = ({
  isOpen,
  activeImageIndex,
  imageMessages,
  onClose,
  onNavigate,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const currentMsg = imageMessages[activeImageIndex];
  const totalImages = imageMessages.length;
  const hasMultiple = totalImages > 1;

  // Reset zoom & loading when image index changes
  useEffect(() => {
    if (isOpen) {
      setZoomLevel(1);
      setIsLoading(true);
      setHasError(false);
    }
  }, [activeImageIndex, isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && activeImageIndex > 0) {
        onNavigate(activeImageIndex - 1);
      } else if (e.key === 'ArrowRight' && activeImageIndex < totalImages - 1) {
        onNavigate(activeImageIndex + 1);
      } else if (e.key === '+' || e.key === '=') {
        setZoomLevel((prev) => Math.min(prev + 0.25, 3));
      } else if (e.key === '-') {
        setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
      } else if (e.key === '0') {
        setZoomLevel(1);
      }
    },
    [isOpen, activeImageIndex, totalImages, onClose, onNavigate]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen || !currentMsg) return null;

  const currentImageUrl = currentMsg.mediaUrl || currentMsg.thumbnailUrl;

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Full-screen image viewer"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/92 backdrop-blur-md animate-fade-in select-none"
      onClick={onClose}
    >
      {/* Top Controls Bar */}
      <div
        className="absolute top-0 inset-x-0 p-4 sm:p-5 flex items-center justify-between text-white z-20 bg-gradient-to-b from-black/70 to-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image info & count */}
        <div className="flex items-center gap-3">
          <div className="text-xs sm:text-sm font-semibold text-slate-200">
            {hasMultiple ? `Image ${activeImageIndex + 1} of ${totalImages}` : 'Campus Chat Image'}
          </div>
          {currentMsg.fileName && (
            <span className="hidden sm:inline-block text-[11px] text-slate-400 bg-white/10 px-2.5 py-0.5 rounded-full">
              {currentMsg.fileName}
            </span>
          )}
          <span className="text-[11px] text-slate-400">{currentMsg.createdAt}</span>
        </div>

        {/* Toolbar buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Zoom In */}
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer"
            title="Zoom In (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Zoom Out */}
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer"
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Fit to screen / reset */}
          <button
            type="button"
            onClick={handleResetZoom}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer"
            title="Reset Zoom (0)"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Download */}
          {currentImageUrl && (
            <a
              href={currentImageUrl}
              download={currentMsg.fileName || 'campus_chat_image.jpg'}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer inline-flex items-center"
              title="Open full size"
            >
              <Download className="w-4 h-4" />
            </a>
          )}

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-rose-500/80 hover:bg-rose-600 transition-colors text-white ml-2 cursor-pointer"
            title="Close viewer (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Viewport */}
      <div
        className="relative w-full h-full flex items-center justify-center p-6 sm:p-12 overflow-hidden"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* Loading Spinner */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white space-y-2 z-10 pointer-events-none">
            <RefreshCw className="w-8 h-8 animate-spin text-pink-400" />
            <span className="text-xs text-slate-300">Loading high-resolution image...</span>
          </div>
        )}

        {/* Error state */}
        {hasError ? (
          <div
            className="p-6 bg-slate-900/80 rounded-2xl border border-rose-500/30 text-center text-white space-y-3 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
            <div>
              <p className="text-sm font-bold text-rose-300">Unable to load image</p>
              <p className="text-xs text-slate-400 mt-1">
                The image file could not be retrieved from campus storage.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setHasError(false);
                setIsLoading(true);
              }}
              className="px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : (
          <div
            className="transition-transform duration-200 ease-out max-w-full max-h-full flex items-center justify-center"
            style={{ transform: `scale(${zoomLevel})` }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImageUrl}
              alt={currentMsg.fileName || 'Chat image'}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
              className="max-h-[82vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl transition-opacity duration-300"
              style={{ opacity: isLoading ? 0.3 : 1 }}
            />
          </div>
        )}

        {/* Previous Image Arrow */}
        {hasMultiple && activeImageIndex > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(activeImageIndex - 1);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-black/50 hover:bg-black/80 text-white transition-all cursor-pointer backdrop-blur-xs z-20"
            title="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next Image Arrow */}
        {hasMultiple && activeImageIndex < totalImages - 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(activeImageIndex + 1);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-black/50 hover:bg-black/80 text-white transition-all cursor-pointer backdrop-blur-xs z-20"
            title="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip if multiple images */}
      {hasMultiple && (
        <div
          className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-2 p-2 z-20 overflow-x-auto no-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >
          {imageMessages.map((m, idx) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onNavigate(idx)}
              className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer flex-shrink-0 ${
                idx === activeImageIndex
                  ? 'border-pink-500 scale-105 shadow-md shadow-pink-500/50'
                  : 'border-white/30 opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={m.thumbnailUrl || m.mediaUrl}
                alt="thumb"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
