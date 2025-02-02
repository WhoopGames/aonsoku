import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import ImageHeader from '@/app/components/album/image-header'
import { ArtistInfo } from '@/app/components/artist/info'
import { AlbumFallback } from '@/app/components/fallbacks/album-fallbacks'
import { BadgesData } from '@/app/components/header-info'
import { PreviewCard } from '@/app/components/preview-card/card'
import ListWrapper from '@/app/components/list-wrapper'
import { useGetArtist } from '@/app/hooks/use-artist'
import ErrorPage from '@/app/pages/error-page'
import { ROUTES } from '@/routes/routesList'
import { getCoverArtUrl } from '@/api/httpClient'
import { subsonic } from '@/service/subsonic'
import { usePlayerActions } from '@/store/player.store'

export default function Artist() {
  const { t } = useTranslation()
  const { artistId } = useParams() as { artistId: string }
  const { setSongList } = usePlayerActions()

  const {
    data: artist,
    isLoading: artistIsLoading,
    isFetched,
  } = useGetArtist(artistId)

  if (artistIsLoading) return <AlbumFallback />
  if (isFetched && !artist) {
    return <ErrorPage status={404} statusText="Not Found" />
  }
  if (!artist) return <AlbumFallback />

  function getSongCount() {
    if (artist?.albumCount === undefined) return null
    if (artist?.albumCount === 0) return null
    let artistSongCount = 0

    artist.album.forEach((album) => {
      artistSongCount += album.songCount
    })

    return t('playlist.songCount', { count: artistSongCount })
  }

  function formatAlbumCount() {
    if (artist?.albumCount === undefined) return null
    return t('artist.info.albumsCount', { count: artist.albumCount })
  }

  const albumCount = formatAlbumCount()
  const songCount = getSongCount()

  const badges: BadgesData = [
    {
      content: albumCount,
      type: 'link',
      link: ROUTES.ALBUMS.ARTIST(artist.id, artist.name),
    },
    {
      content: songCount,
      type: 'link',
      link: ROUTES.SONGS.ARTIST_TRACKS(artist.id, artist.name),
    },
  ]

  const albums = artist.album.sort((a, b) => {
    const yearA = a.year ?? -Infinity
    const yearB = b.year ?? -Infinity
    return yearA - yearB
  })

  async function handlePlayAlbum(albumId: string) {
    const album = await subsonic.albums.getOne(albumId)

    if (album) {
      setSongList(album.song, 0)
    }
  }

  return (
    <div className="w-full">
      <ImageHeader
        type={t('artist.headline')}
        title={artist.name}
        coverArtId={artist.coverArt}
        coverArtType="artist"
        coverArtSize="700"
        coverArtAlt={artist.name}
        badges={badges}
      />

<ListWrapper>
  <ArtistInfo artist={artist} />
  <div className="grid grid-cols-6 2xl:grid-cols-8 gap-4 mt-6">
    {albums.map((album) => (
      <PreviewCard.Root key={album.id}>
        <PreviewCard.ImageWrapper link={ROUTES.ALBUM.PAGE(album.id)}>
          <PreviewCard.Image
            src={getCoverArtUrl(album.coverArt, 'album', 'original')}
            alt={album.name}
          />
          <PreviewCard.PlayButton
            onClick={() => handlePlayAlbum(album.id)}
          />
        </PreviewCard.ImageWrapper>
        <PreviewCard.InfoWrapper>
          <PreviewCard.Title link={ROUTES.ALBUM.PAGE(album.id)}>
            {album.name}
          </PreviewCard.Title>
          <PreviewCard.Subtitle link={ROUTES.ALBUM.PAGE(album.id)}>
            {album.year?.toString() ?? ''}
          </PreviewCard.Subtitle>
        </PreviewCard.InfoWrapper>
      </PreviewCard.Root>
    ))}
  </div>
</ListWrapper>
    </div>
  )
}