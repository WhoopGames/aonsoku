import clsx from 'clsx'
import { ListMusic } from 'lucide-react'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { PlaylistOptions } from '@/app/components/playlist/options'
import { ContextMenuProvider } from '@/app/components/table/context-menu'
import { Button } from '@/app/components/ui/button'
import { ROUTES } from '@/routes/routesList'
import { Playlist } from '@/types/responses/playlist'

export interface ISidebarItem {
  title: string
  route: string
  icon: JSX.Element
}

export function SidebarGenerator({ list }: { list: ISidebarItem[] }) {
  const location = useLocation()
  const { t } = useTranslation()

  function isActive(route: string) {
    return location.pathname === route
  }

  return (
    <>
      {list.map((item, index) => (
        <Link
          to={item.route}
          key={index}
          className={clsx(isActive(item.route) && 'pointer-events-none')}
        >
          <Button
            variant={isActive(item.route) ? 'secondary' : 'ghost'}
            size="sm"
            className="w-full justify-start"
          >
            {item.icon}
            {t(item.title)}
          </Button>
        </Link>
      ))}
    </>
  )
}

export function SidebarPlaylistGenerator({
  playlists,
}: {
  playlists: Playlist[]
}) {
  const location = useLocation()

  function isActive(id: string) {
    return location.pathname === ROUTES.PLAYLIST.PAGE(id)
  }

  return (
    <Fragment>
      {playlists.map((playlist) => (
        <Fragment key={playlist.id}>
          <Link
            to={ROUTES.PLAYLIST.PAGE(playlist.id)}
            onClick={(e) => {
              if (isActive(playlist.id)) {
                e.preventDefault()
              }
            }}
          >
            <ContextMenuProvider
              options={
                <PlaylistOptions
                  variant="context"
                  playlist={playlist}
                  showPlay={true}
                />
              }
            >
              <Button
                variant={isActive(playlist.id) ? 'secondary' : 'ghost'}
                size="sm"
                className={clsx(
                  'w-full justify-start',
                  isActive(playlist.id) && 'cursor-default hover:bg-accent',
                )}
              >
                <ListMusic className="mr-2 min-h-4 min-w-4 h-4 w-4" />
                <span className="w-full truncate text-left">
                  {playlist.name}
                </span>
              </Button>
            </ContextMenuProvider>
          </Link>
        </Fragment>
      ))}
    </Fragment>
  )
}
