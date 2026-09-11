import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';

export type QuranPlaybackState = {
  isPlaying: boolean;
  playingKey: string | null;
  rangeEnd: number | null;
  repeatCount: number;
  currentRepeat: number;
  visible: boolean;
};

const listeners = new Set<(state: QuranPlaybackState) => void>();

const initialState: QuranPlaybackState = {
  isPlaying: false,
  playingKey: null,
  rangeEnd: null,
  repeatCount: 1,
  currentRepeat: 0,
  visible: false,
};

let playbackState: QuranPlaybackState = { ...initialState };

export const quranAudioPlayer = createAudioPlayer(null, { updateInterval: 100 });

const notify = () => {
  const snapshot = { ...playbackState };
  listeners.forEach((listener) => listener(snapshot));
};

export const subscribeQuranPlayback = (listener: (state: QuranPlaybackState) => void) => {
  listeners.add(listener);
  listener({ ...playbackState });
  return () => {
    listeners.delete(listener);
  };
};

export const getQuranPlaybackState = () => ({ ...playbackState });

export const setQuranPlaybackVisibility = (visible: boolean) => {
  playbackState = { ...playbackState, visible };
  notify();
};

export const setQuranPlaybackState = (patch: Partial<QuranPlaybackState>) => {
  playbackState = { ...playbackState, ...patch };
  notify();
};

export const stopQuranPlayback = () => {
  try {
    quranAudioPlayer.pause();
  } catch {
    // no-op
  }

  playbackState = { ...initialState };
  notify();
};

export const playQuranAudio = ({
  url,
  key,
  repeatCount = 1,
  rangeEnd = null,
}: {
  url: string;
  key: string;
  repeatCount?: number;
  rangeEnd?: number | null;
}) => {
  setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'duckOthers' }).catch(() => {});
  quranAudioPlayer.replace(url);
  quranAudioPlayer.play();
  playbackState = {
    isPlaying: true,
    playingKey: key,
    rangeEnd,
    repeatCount,
    currentRepeat: 1,
    visible: true,
  };
  notify();
};
