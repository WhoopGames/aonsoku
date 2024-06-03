import { httpClient } from "@/api/httpClient"
import { PlaylistWithEntriesResponse, PlaylistsResponse } from "@/types/responses/playlist"
import { SubsonicResponse } from "@/types/responses/subsonicResponse"

async function getAll() {
  const response = await httpClient<PlaylistsResponse>('/getPlaylists', {
    method: 'GET'
  })

  return response?.data.playlists.playlist
}

async function getOne(id: string) {
  const response = await httpClient<PlaylistWithEntriesResponse>('/getPlaylist', {
    method: 'GET',
    query: {
      id
    }
  })

  return response?.data.playlist
}

async function remove(id: string) {
  await httpClient<SubsonicResponse>('/deletePlaylist', {
    method: 'DELETE',
    query: {
      id
    }
  })
}

export const playlists = {
  getAll,
  getOne,
  remove
}