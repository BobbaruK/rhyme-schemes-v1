import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface Settings {
  whenFinishedTo?: string;
}

const useAudio = (settings?: Settings) => {
  const searchParams = useSearchParams();
  const timeJump = searchParams.get("time");

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioPlayer = useRef<HTMLVideoElement>(null);
  const progressBar = useRef<HTMLInputElement>(null);
  const animationRef = useRef<number | null>(null);

  const getSeconds = (secs: number) => Math.floor(secs);

  useEffect(() => {
    if (timeJump) {
      timeTravel(parseInt(timeJump));
    } else {
      timeTravel(0);
    }

    play();

    if (audioPlayer.current === null) return;

    audioPlayer.current.onplay = () => {
      setIsPlaying(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeJump]);

  useEffect(() => {
    if (audioPlayer.current === null || progressBar.current === null) return;
    const player = audioPlayer.current;
    setDuration(getSeconds(player.duration));

    player.onloadedmetadata = () => {
      setDuration(getSeconds(player.duration));
    };

    progressBar.current.max = getSeconds(player.duration) as unknown as string;
  }, [audioPlayer?.current?.readyState, audioPlayer.current?.onloadedmetadata]);

  const whilePlaying = () => {
    if (audioPlayer.current === null || progressBar.current === null) return;

    progressBar.current.value = audioPlayer.current
      .currentTime as unknown as string;

    setCurrentTime(parseInt(progressBar.current.value as unknown as string));

    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const togglePlayPause = () => {
    if (audioPlayer.current === null) return;

    const prevValue = isPlaying;
    setIsPlaying(!prevValue);

    if (!isPlaying) {
      play();
      return;
    }

    audioPlayer.current.pause();
    cancelAnimationFrame(animationRef.current as unknown as number);
  };

  const calculateTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = (minutes < 10 ? `0${minutes}` : minutes) as string;

    const seconds = Math.floor(secs % 60);
    const returnedSeconds = (seconds < 10 ? `0${seconds}` : seconds) as string;

    return `${returnedMinutes}:${returnedSeconds}`;
  };

  const play = () => {
    if (!audioPlayer.current) return;

    audioPlayer.current.play();

    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const changeProgress = () => {
    if (audioPlayer.current === null || progressBar.current === null) return;

    audioPlayer.current.currentTime = progressBar.current
      .value as unknown as number;

    setCurrentTime(
      (oldVal) => (oldVal = progressBar.current?.value as unknown as number),
    );
  };

  const timeTravel = (newTime: number) => {
    if (!progressBar.current) return;

    progressBar.current.value = newTime as unknown as string;
    changeProgress();
  };

  useEffect(() => {
    console.log(currentTime, duration);
    if (settings && settings.whenFinishedTo) {
      if (currentTime === duration && duration !== 0) {
        console.log("done");
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTime]);

  return {
    audioPlayer,
    calculateTime,
    changeProgress,
    currentTime,
    duration,
    isPlaying,
    progressBar,
    togglePlayPause,
  };
};

export { useAudio };
