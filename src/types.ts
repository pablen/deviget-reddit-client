export type PostName = string

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

export type RawApiResponse = {
  data: {
    children: RawPostData[]
    after: PostName
  }
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
