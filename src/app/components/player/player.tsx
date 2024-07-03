import { clsx } from 'clsx'
import { Heart, ListVideo } from 'lucide-react'
import { useEffect, useRef, useCallback } from 'react'

import { getSongStreamUrl } from '@/api/httpClient'
import { RadioInfo } from '@/app/components/player/radio-info'
import { TrackInfo } from '@/app/components/player/track-info'
import { Button } from '@/app/components/ui/button'
import {
  usePlayerActions,
  usePlayerDuration,
  usePlayerIsPlaying,
  usePlayerLoop,
  usePlayerMediaType,
  usePlayerRef,
  usePlayerSongStarred,
  usePlayerSonglist,
} from '@/store/player.store'
import { PlayerControls } from './controls'
import { PlayerProgress } from './progress'
import { PlayerVolume } from './volume'

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const {
    setAudioPlayerRef,
    setCurrentDuration,
    setProgress,
    hasNextSong,
    playNextSong,
    clearPlayerState,
    starCurrentSong,
    setPlayingState,
  } = usePlayerActions()
  const { currentList, currentSongIndex, radioList } = usePlayerSonglist()
  const isPlaying = usePlayerIsPlaying()
  const mediaType = usePlayerMediaType()
  const isSongStarred = usePlayerSongStarred()
  const isLoopActive = usePlayerLoop()
  const currentDuration = usePlayerDuration()
  const audioPlayerRef = usePlayerRef()

  const song = currentList[currentSongIndex]
  const radio = radioList[currentSongIndex]

  useEffect(() => {
    if (mediaType !== 'song' && !song) return

    if (audioPlayerRef === null && audioRef.current)
      setAudioPlayerRef(audioRef.current)
  }, [audioPlayerRef, audioRef, mediaType, setAudioPlayerRef, song])

  useEffect(() => {
    if (!audioRef.current) return

    if (mediaType === 'radio') {
      if (isPlaying) {
        audioRef.current.src = ''
        audioRef.current.src = radio.streamUrl
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }

    if (mediaType === 'song') {
      isPlaying ? audioRef.current.play() : audioRef.current.pause()
    }
  }, [isPlaying, mediaType, radio])

  const setupProgressListener = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = 0
    const audioDuration = Math.floor(audio.duration)

    if (currentDuration !== audioDuration) {
      setCurrentDuration(audioDuration)
    }

    const handleTimeUpdate = () => {
      setProgress(Math.floor(audio.currentTime))
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [currentDuration, setCurrentDuration, setProgress])

  const handleSongEnded = useCallback(() => {
    if (hasNextSong()) {
      playNextSong()
      audioRef.current?.play()
    } else {
      clearPlayerState()
    }
  }, [clearPlayerState, hasNextSong, playNextSong])

  return (
    <div className="border-t h-[100px] w-full flex items-center">
      <div className="w-full h-full grid grid-cols-player gap-2 px-4">
        {/* Track Info */}
        <div className="flex items-center gap-2">
          {mediaType === 'song' && <TrackInfo song={song} />}
          {mediaType === 'radio' && <RadioInfo radio={radio} />}
        </div>
        {/* Main Controls */}
        <div className="col-span-2 flex flex-col justify-center items-center px-4 gap-1">
          <PlayerControls song={song} radio={radio} />

          {mediaType === 'song' && (
            <PlayerProgress audioRef={audioRef} song={song} />
          )}
        </div>
        {/* Remain Controls and Volume */}
        <div className="flex items-center w-full justify-end">
          <div className="flex items-center gap-1">
            {mediaType === 'song' && (
              <Button
                variant="ghost"
                className="rounded-full w-10 h-10 p-3"
                disabled={!song}
                onClick={starCurrentSong}
              >
                <Heart
                  className={clsx(
                    'w-5 h-5',
                    isSongStarred && 'text-red-500 fill-red-500',
                  )}
                />
              </Button>
            )}

            {mediaType === 'song' && (
              <Button
                variant="ghost"
                className="rounded-full w-10 h-10 p-2"
                disabled={!song}
              >
                <ListVideo className="w-4 h-4" />
              </Button>
            )}

            <PlayerVolume audioRef={audioRef} disabled={!song && !radio} />
          </div>
        </div>
      </div>

      {mediaType === 'song' && song && (
        <audio
          src={getSongStreamUrl(song.id)}
          autoPlay={true}
          ref={audioRef}
          loop={isLoopActive}
          onPlay={() => setPlayingState(true)}
          onPause={() => setPlayingState(false)}
          onLoadedMetadata={setupProgressListener}
          onEnded={handleSongEnded}
        />
      )}

      {mediaType === 'radio' && radio && (
        <audio
          src={radio.streamUrl}
          autoPlay={true}
          ref={audioRef}
          onPlay={() => setPlayingState(true)}
          onPause={() => setPlayingState(false)}
        />
      )}
    </div>
  )
}
