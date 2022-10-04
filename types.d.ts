import "video.js";

interface PlayerSettings {
  remainingview: boolean;
  syncerlevel: number;
  volume: number;
  mirror: string;
}

interface DiscordQuote {
  guildId: string;
  channelId: string;
  messageId: string;
  userId: string;
  userName: string;
  userDiscriminator: string;
  userAvatar: string;
  content: string;
  reaction: string;
  reactionUserId: string;
  reactionUserName: string;
  reactionUserDiscriminator: string;
  reactionEmojiUrl: string | null;
}

interface StreamMeta {
  arguments?: { [key: string]: string };
  bitrate: number;
  duration: number;
  isLive: boolean;
  startTime: string;
  viewers: number;
}

interface StreamInfo {
  channel: string;
  meta: StreamMeta;
  servertime: string;
}

interface SocketEvents {
  emit(event: "mtv-mousemove", data: number[]): void;
  emit(event: "mtv-draw", data: number[]): void;
  emit(event: "mtv-mouseleave"): void;

  on(event: "mtv-draw", callback: (data: number[]) => void): void;
  on(event: "mtv-mousemove", callback: (data: { id: string }) => void): void;
  on(event: "mtv-mouseleave", callback: (StreamInfo: StreamInfo) => void): void;
  on(event: "mtv-disconnect", callback: (StreamInfo: StreamInfo) => void): void;

  on(event: "streamStart", callback: () => void): void;
  on(event: "streamEnd", callback: () => void): void;
  on(event: "streamInfo", callback: (StreamInfo: StreamInfo) => void): void;
}

declare module "video.js" {
  interface VideoJsPlayer {
    settings: PlayerSettings;
    socket: SocketEvents;
    missingTime: number;

    // Bad typescript definition
    log(message?: any, ...optionalParams: any[]);
    play(...args: any[]): Promise<any>; // Videojs type doesn't support arguments
  }
}

declare module "#app" {
  interface NuxtApp {
    $socket: SocketEvents;
  }
}
