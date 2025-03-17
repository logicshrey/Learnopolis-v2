interface Window {
  YT: typeof YT;
  onYouTubeIframeAPIReady: () => void;
}

declare namespace YT {
  class Player {
    constructor(
      elementId: string | HTMLElement,
      options: {
        videoId?: string;
        playerVars?: {
          autoplay?: 0 | 1;
          controls?: 0 | 1;
          modestbranding?: 0 | 1;
          rel?: 0 | 1;
          showinfo?: 0 | 1;
          [key: string]: any;
        };
        events?: {
          onReady?: (event: PlayerEvent) => void;
          onStateChange?: (event: OnStateChangeEvent) => void;
          onError?: (event: OnErrorEvent) => void;
          [key: string]: any;
        };
      }
    );
    
    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    seekTo(seconds: number, allowSeekAhead: boolean): void;
    clearVideo(): void;
    getCurrentTime(): number;
    getDuration(): number;
    getVideoLoadedFraction(): number;
    getPlayerState(): number;
    destroy(): void;
  }
  
  interface PlayerEvent {
    target: Player;
  }
  
  interface OnStateChangeEvent {
    target: Player;
    data: number;
  }
  
  interface OnErrorEvent {
    target: Player;
    data: number;
  }
  
  enum PlayerState {
    UNSTARTED = -1,
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5
  }
} 