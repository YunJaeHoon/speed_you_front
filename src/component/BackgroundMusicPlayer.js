import React, { useEffect, useContext } from 'react';
import useSound from 'use-sound';

import SoundContext from "../context/SoundContext.js";

function BackgroundMusicPlayer() {

  // context
  const { isPlayMusic, currentMusic, currentMusicVolume } = useContext(SoundContext);

  const [play, { pause }] = useSound(currentMusic, { loop: true, volume: currentMusicVolume });

  useEffect(() => {

    if (isPlayMusic) {
      play();
    }

    return () => {
      pause();
    };

  }, [play, isPlayMusic, currentMusic, currentMusicVolume]);

  return null;
}

export default BackgroundMusicPlayer;