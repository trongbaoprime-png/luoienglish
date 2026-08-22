"use client";

import React, { useState } from "react";
import { listRegisteredSounds, SoundMetadata } from "@/lib/assets/soundRegistry";
import { AudioMixer } from "@/lib/audio/AudioMixer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Play, Sliders } from "lucide-react";

export default function DevAudioPage() {
  const sounds = listRegisteredSounds();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [ducked, setDucked] = useState(false);

  const handlePlay = (sound: SoundMetadata) => {
    setPlayingId(sound.id);

    if (sound.channel === "VOICE") {
      AudioMixer.duckAmbience(0.2);
      setDucked(true);
    }

    setTimeout(() => {
      setPlayingId(null);
      if (sound.channel === "VOICE") {
        AudioMixer.unduckAmbience();
        setDucked(false);
      }
    }, sound.durationMs || 1000);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto flex flex-col gap-6">
      <div>
        <Badge variant="primary" className="mb-1">Development Only</Badge>
        <h1 className="text-2xl font-black text-foreground">Sound & AudioMixer Inspector (/dev/audio)</h1>
        <p className="text-xs text-muted-foreground">
          Kiểm thử kênh âm thanh, âm lượng, thời lượng và cơ chế tự động Ducking khi phát giọng nói tiếng Anh.
        </p>
      </div>

      {/* Mixer Status Banner */}
      <Card className="p-4 bg-white/90 border-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Sliders className="w-5 h-5 text-primary" />
          <div>
            <h4 className="text-sm font-black text-foreground">AudioMixer Trạng Thái</h4>
            <p className="text-xs text-muted-foreground">
              Ducking: <strong className={ducked ? "text-amber-600" : "text-emerald-600"}>{ducked ? "ACTIVE (20% Ambience)" : "IDLE (100% Ambience)"}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              AudioMixer.duckAmbience(0.2);
              setDucked(true);
            }}
          >
            Mô phỏng Duck Ambience
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              AudioMixer.unduckAmbience();
              setDucked(false);
            }}
          >
            Khôi phục Un-duck
          </Button>
        </div>
      </Card>

      {/* Sound Table */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {sounds.map((sound: SoundMetadata) => (
          <Card key={sound.id} className="p-4 flex flex-col justify-between gap-3 bg-white/90 border-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-muted-foreground">
                  {sound.category} • {sound.channel}
                </span>
                <Badge variant={sound.status === "PRODUCTION" ? "secondary" : "primary"} className="text-[10px]">
                  {sound.status}
                </Badge>
              </div>
              <h4 className="text-xs font-black text-foreground font-mono">{sound.id}</h4>
              <p className="text-xs text-muted-foreground mt-1">{sound.descriptionVi}</p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePlay(sound)}
              className="w-full gap-2 font-bold text-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{playingId === sound.id ? "Đang phát..." : "Phát Thử"}</span>
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
