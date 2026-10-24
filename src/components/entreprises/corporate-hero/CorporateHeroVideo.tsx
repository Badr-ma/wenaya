'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

interface CorporateHeroVideoProps {
  className?: string;
}

export default function CorporateHeroVideo({ className = '' }: CorporateHeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion || videoFailed) return;
    const video = videoRef.current;
    if (!video) return;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => setVideoFailed(true));
    }
  }, [shouldReduceMotion, videoFailed]);

  if (shouldReduceMotion || videoFailed) {
    return (
      <div
        className={'absolute inset-0 ' + className}
        style={{ background: 'radial-gradient(ellipse at 50% 40%, #1a2332 0%, #0b1220 70%)' }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div className={'absolute inset-0 overflow-hidden ' + className} aria-hidden="true">
      <video
        ref={videoRef}
        src="/videos/corporate-hero/iStock-1531443929-1920.mp4"
        muted
        playsInline
        loop
        autoPlay
        preload="metadata"
        onError={() => setVideoFailed(true)}
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
    </div>
  );
}
