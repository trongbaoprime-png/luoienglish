"use client";

import React, { useState } from "react";
import { listRegisteredSounds, SoundMetadata } from "@/lib/assets/soundRegistry";
import { AudioMixer } from "@/lib/audio/AudioMixer";
import { SoundPlaybackService } from "@/lib/audio/SoundPlaybackService";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Play, Sliders, Volume2 } from "lucide-react";

export default function DevAudioPage() {
  const sounds = listRegisteredSounds();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isDucked, setIsDucked] = useState(false);

  const handlePlay = (sound: SoundMetadata) => {
    setPlayingId(sound.id);

    SoundPlaybackService.playSound(sound.id, {
      onEnded: () => {
        setPlayingId(null);
        setIsDucked(AudioMixer.getIsDucked());
      },
    });

    setIsDucked(AudioMixer.getIsDucked());

    setTimeout(() => {
      setPlayingId(null);
      setIsDucked(AudioMixer.getIsDucked());
    }, sound.durationMs || 1000);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto flex flex-col gap-6">
      <div>
        <Badge variant="primary" className="mb-1">Development Soundboard</Badge>
        <h1 className="text-2xl font-black text-foreground">Sound & AudioMixer Inspector (/dev/audio)</h1>
        <p className="text-xs text-muted-foreground">
          Kiểm thử phát âm thanh thực tế, đo lường Ducking khi phát giọng nói và bảo vệ chống xung đột âm thanh.
        </p>
      </div>

      {/* Mixer Status Banner */}
      <Card className="p-4 bg-white/95 border-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Sliders className="w-5 h-5 text-primary" />
          <div>
            <h4 className="text-sm font-black text-foreground">AudioMixer Trạng Thái</h4>
            <p className="text-xs text-muted-foreground">
              Ducking:{" "}
              <strong className={isDucked ? "text-amber-600 font-black" : "text-emerald-600 font-bold"}>
                {isDucked ? "ACTIVE (Ambience giảm về 20%)" : "IDLE (Ambience 100%)"}
              </strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              AudioMixer.duckAmbience(0.2);
              setIsDucked(true);
            }}
          >
            Mô phỏng Duck Ambience
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              AudioMixer.unduckAmbience();
              setIsDucked(false);
            }}
          >
            Khôi phục Un-duck
          </Button>
        </div>
      </Card>

      {/* Sound Table */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {sounds.map((sound: SoundMetadata) => (
          <Card key={sound.id} className="p-4 flex flex-col justify-between gap-3 bg-white/95 border-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-muted-foreground">
                  {sound.category} • {sound.channel}
                </span>
                <Badge variant={sound.status === "PRODUCTION" ? "secondary" : "primary"} className="text-[10px]">
                  {sound.status}
                </Badge>
              </div>
              <h4 className="text-xs font-black text-foreground font-mono truncate">{sound.id}</h4>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{sound.descriptionVi}</p>
              {sound.durationMs && (
                <span className="text-[10px] font-mono text-muted-foreground/80 mt-1 block">
                  Thời lượng: {sound.durationMs}ms
                </span>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePlay(sound)}
              className="w-full gap-2 font-bold text-xs"
            >
              {playingId === sound.id ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-primary animate-pulse" />
                  <span>Đang phát...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Phát Thử</span>
                </>
              )}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
