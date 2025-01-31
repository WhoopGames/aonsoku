import { useInfiniteQuery } from '@tanstack/react-query'
import debounce from 'lodash/debounce'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { getCoverArtUrl } from '@/api/httpClient'
import { ShadowHeader } from '@/app/components/album/shadow-header'
import { SongListFallback } from '@/app/components/fallbacks/song-fallbacks'
import { HeaderTitle } from '@/app/components/header-title'
import ListWrapper from '@/app/components/list-wrapper'
import { PreviewCard } from '@/app/components/preview-card/card'
import { useSongList } from '@/app/hooks/use-song-list'
import { subsonic } from '@/service/subsonic'
import { usePlayerActions } from '@/store/player.store'
import { ROUTES } from '@/routes/routesList'
import { queryKeys } from '@/utils/queryKeys'

export default function ArtistsList() {
  const { t } = useTranslation()
  const { getArtistAllSongs } = useSongList()
  const { setSongList } = usePlayerActions()
  const scrollDivRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    scrollDivRef.current = document.querySelector(
      '#main-scroll-area #scroll-viewport',
    ) as HTMLDivElement
  }, [])

  const fetchArtists = async () => {
    const response = await subsonic.artists.getAll()
    return {
      artists: response,
      nextOffset: undefined
    }
  }

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: [queryKeys.artist.all],
    queryFn: fetchArtists,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
  })

  useEffect(() => {
    const handleScroll = debounce(() => {
      if (!scrollDivRef.current) return

      const { scrollTop, clientHeight, scrollHeight } = scrollDivRef.current
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - scrollHeight / 4

      if (isNearBottom && hasNextPage) {
        fetchNextPage()
      }
    }, 200)

    const scrollElement = scrollDivRef.current
    scrollElement?.addEventListener('scroll', handleScroll)
    return () => scrollElement?.removeEventListener('scroll', handleScroll)
  }, [fetchNextPage, hasNextPage])

  async function handlePlayArtistRadio(artist: any) {
    const songList = await getArtistAllSongs(artist.name)
    if (songList) setSongList(songList, 0)
  }

  if (isLoading) return <SongListFallback />
  if (!data) return null

  const items = data.pages.flatMap((page) => page.artists) || []

  return (
    <div className="w-full h-full">
      <ShadowHeader>
        <HeaderTitle title={t('sidebar.artists')} count={items.length} />
      </ShadowHeader>

      <ListWrapper className="pt-[--shadow-header-distance]">
        <div className="grid grid-cols-6 2xl:grid-cols-8 gap-4 h-full">
          {items.map((artist) => (
            <PreviewCard.Root key={`artist-${artist.id}`}>
              <PreviewCard.ImageWrapper link={ROUTES.ARTIST.PAGE(artist.id)}>
                <PreviewCard.Image
                  src={getCoverArtUrl(artist.coverArt, 'artist', '1000')}
                  alt={artist.name}
                />
                <PreviewCard.PlayButton onClick={() => handlePlayArtistRadio(artist)} />
              </PreviewCard.ImageWrapper>
              <PreviewCard.InfoWrapper>
                <PreviewCard.Title link={ROUTES.ARTIST.PAGE(artist.id)}>
                  {artist.name}
                </PreviewCard.Title>
              </PreviewCard.InfoWrapper>
            </PreviewCard.Root>
          ))}
        </div>
      </ListWrapper>
    </div>
  )
}