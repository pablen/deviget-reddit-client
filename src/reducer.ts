import {
  useSelector as untypedUseSelector,
  useDispatch as untypedUseDispatch,
  TypedUseSelectorHook,
} from 'react-redux'
import { Dispatch } from 'react'

// Required to have typed useSelector and useDispatch
export const useSelector: TypedUseSelectorHook<State> = untypedUseSelector
export const useDispatch: () => Dispatch<Action> = untypedUseDispatch

export type PostName = string

export type Post = {
  fullSizePicture?: string
  num_comments: number
  thumbnail?: string
  created: number
  author: string
  title: string
  name: PostName
  url: string
}

export type Action =
  | {
      type: 'newer posts received'
      payload: { posts: Post[]; after: PostName }
    }
  | {
      type: 'older posts received'
      payload: { posts: Post[]; after: PostName }
    }
  | { type: 'all posts dismissed' }
  | { type: 'post dismissed'; payload: PostName }
  | { type: 'post selected'; payload: PostName }

export type State = {
  selectedPost?: Post
  oldestPost?: PostName
  readPosts: { [key: string]: boolean }
  posts: Post[]
}

/**
 * Maps API data in order to only store fields relevant to this app
 *
 * @param rawPosts - An array or Reddit posts as retrieved from the API
 */
export function getPostsData(
  rawPosts: {
    data: Post & { preview?: { images: { source: { url: string } }[] } }
  }[]
) {
  /**
   * Apparently some posts (link-only, NSFW, etc.) have the `thumbnail` field
   * set to placeholder strings and not an actual image url.
   */
  const notReallyThumbnails = ['self', 'default', 'nsfw']

  return rawPosts.map((p) => ({
    thumbnail: notReallyThumbnails.includes(p.data.thumbnail as string)
      ? undefined
      : p.data.thumbnail,
    // eslint-disable-next-line @typescript-eslint/camelcase
    num_comments: p.data.num_comments,
    fullSizePicture: p.data.preview?.images[0].source.url,
    created: p.data.created,
    author: p.data.author,
    title: p.data.title,
    name: p.data.name,
    url: p.data.url,
  }))
}

let readPosts = {}
try {
  readPosts = JSON.parse(window.localStorage.getItem('readPosts') as string)
} catch (err) {
  console.warn('Error retrieving read posts state:', err.message)
}

const initialState: State = {
  selectedPost: undefined,
  oldestPost: undefined,
  readPosts,
  posts: [],
}

export default function reducer(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    case 'post selected':
      return {
        ...state,
        readPosts: { ...state.readPosts, [action.payload]: true },

        /**
         * We store the full selected post insted of just an id as per the demo
         * video we need to keep the data visible even when dismissed.
         */
        selectedPost: state.posts.find((p) => p.name === action.payload),
      }

    case 'post dismissed':
      return {
        ...state,
        posts: state.posts.filter((p) => p.name !== action.payload),
      }

    case 'all posts dismissed':
      return { ...state, posts: [] }

    case 'newer posts received':
      return {
        ...state,
        posts: [...action.payload.posts, ...state.posts],
        oldestPost: action.payload.after,
      }

    case 'older posts received':
      return {
        ...state,
        posts: [...state.posts, ...action.payload.posts],
        oldestPost: action.payload.after,
      }

    default:
      return state
  }
}
