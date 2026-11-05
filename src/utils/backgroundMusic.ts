export const MUSIC_EVENTS = {
  toggle: 'jeremy:music-toggle',
  query: 'jeremy:music-query',
  state: 'jeremy:music-state',
  mediaPlay: 'site:media-play'
} as const

export const MUSIC_TITLE = '人間有味是清歡'
export const MUSIC_SOURCE = '/music/qinghuan.mp3'
export const MUSIC_VOLUME = 0.12

export interface BackgroundMusicState {
  enabled: boolean
  playing: boolean
  blocked: boolean
  interrupted: boolean
  loading: boolean
  error: boolean
  volume: number
}

export const INITIAL_MUSIC_STATE: BackgroundMusicState = {
  enabled: true,
  playing: false,
  blocked: false,
  interrupted: false,
  loading: true,
  error: false,
  volume: MUSIC_VOLUME
}
