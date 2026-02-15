// @ffmpeg/ffmpeg 타입 선언 (런타임 동적 로드용)
declare module '@ffmpeg/ffmpeg' {
  export class FFmpeg {
    isLoaded(): boolean;
    load(): Promise<void>;
    writeFile(name: string, data: Uint8Array): Promise<void>;
    exec(args: string[]): Promise<void>;
    readFile(name: string): Promise<Uint8Array>;
    deleteFile(name: string): Promise<void>;
    on(event: string, callback: (...args: unknown[]) => void): void;
  }
  export function fetchFile(input: string | File | Blob): Promise<Uint8Array>;
}
