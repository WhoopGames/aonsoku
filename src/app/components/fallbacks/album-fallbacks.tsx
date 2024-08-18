import { SongsCarouselFallback } from '@/app/components/fallbacks/home-fallbacks'
import { TableFallback } from '@/app/components/fallbacks/table-fallbacks'
import { ShadowHeaderFallback } from '@/app/components/fallbacks/ui-fallbacks'
import ListWrapper from '@/app/components/list-wrapper'
import { Skeleton } from '@/app/components/ui/skeleton'

export function AlbumHeaderFallback() {
  return (
    <div className="w-full px-8 py-6 bg-muted-foreground flex gap-4 bg-gradient-to-b from-white/50 to-white/50 dark:from-black/50 dark:to-black/50">
      <Skeleton className="rounded shadow-lg w-[200px] h-[200px] min-w-[200px] min-h-[200px] 2xl:w-[250px] 2xl:h-[250px] 2xl:min-w-[250px] 2xl:min-h-[250px] aspect-square" />
      <div className="flex flex-col justify-end">
        <Skeleton className="h-[20px] w-16 mb-2" />
        <Skeleton className="h-12 w-[260px] mb-2" />

        <div className="flex gap-2 mt-2">
          <Skeleton className="h-[22px] w-12 rounded-full" />
          <Skeleton className="h-[22px] w-12 rounded-full" />
          <Skeleton className="h-[22px] w-12 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function PlayButtonsFallback() {
  return (
    <div className="my-6 flex gap-1 items-center">
      <Skeleton className="rounded-full w-14 h-14" />
      <div className="flex items-center justify-center w-14 h-14">
        <Skeleton className="rounded-full w-7 h-7" />
      </div>
      <div className="flex items-center justify-center w-14 h-14">
        <Skeleton className="rounded-full w-7 h-7" />
      </div>
    </div>
  )
}

export function AlbumFallback() {
  return (
    <div className="w-full">
      <AlbumHeaderFallback />
      <ListWrapper>
        <PlayButtonsFallback />
        <TableFallback />
      </ListWrapper>
    </div>
  )
}

export function AlbumsFallback() {
  return (
    <div className="w-full">
      <ShadowHeaderFallback />

      <ListWrapper className="mt-8 flex flex-col gap-4">
        <SongsCarouselFallback />
        <SongsCarouselFallback />
        <SongsCarouselFallback />
        <SongsCarouselFallback />
        <SongsCarouselFallback />
      </ListWrapper>
    </div>
  )
}
