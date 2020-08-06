/**
 * Just a type alias to better document other types requiring post names
 */
export type PostName = string

/**
 * A Post according to this app
 */
export type Post = {
  fullSizePicture?: string
  numComments: number
  thumbnail?: string
  createdAt: number
  author: string
  title: string
  name: PostName
  url: string
}

/**
 * A Post according to the Reddit API
 */
export type RawPostData = {
  data: {
    num_comments: number
    created_utc: number
    thumbnail: string
    preview?: { images: { source: { url: string } }[] }
    author: string
    title: string
    name: PostName
    url: string
  }
}

/**
 * An API Response according to the Reddit API
 */
export type RawApiResponse = {
  data: {
    children: RawPostData[]
    after: PostName
  }
}

/**
 * All the supported Redux Actions.
 * Declaring them this way makes it unnecessary to write action creators or
 * defining action type constants as the TypeScript compiler will prevent
 * us from dispatching invalid action objects.
 */
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

/**
 * The Redux Store state shape
 */
export type State = {
  selectedPost?: Post
  oldestPost?: PostName
  posts: Post[]
  /**
   * Making readPosts a map allow us to check if a post is read in O(1) time
   * instead of O(n) time.
   */
  readPosts: { [key: string]: boolean }
}
