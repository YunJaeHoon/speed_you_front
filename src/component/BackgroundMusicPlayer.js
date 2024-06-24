import React, { useEffect } from 'react';
import useSound from 'use-sound';

function BackgroundMusicPlayer({ soundSource, volume }) {
  const [play, { stop }] = useSound(soundSource, { loop: true, volume: volume });

  useEffect(() => {

    play();
    return () => {
      stop();
    };

  }, [play, stop]);

  useEffect(() => {

    play();
    return () => {
      stop();
    };

  }, []);

  return null;
}

export default BackgroundMusicPlayer;