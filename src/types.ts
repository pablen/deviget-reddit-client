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

export type RawPostData = {
  data: Post & { preview?: { images: { source: { url: string } }[] } }
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
