import { PostName, RawApiResponse, RawPostData, State } from './types'

export async function fetchPosts(after?: PostName): Promise<RawApiResponse> {
  return fetch(
    'https://www.reddit.com/top.json' + (after ? `?after=${after}` : '')
  )
    .then((res) => res.json())
    .catch((err) => {
      console.warn('There was a problem fetching posts', err.message)
    })
}

/**
 * Maps API data in order to only store fields relevant to this app
 *
 * @param rawPost - A Reddit posts as retrieved from the API
 */
export function extractPostData(rawPost: RawPostData) {
  /**
   * Apparently some posts (link-only, NSFW, etc.) have the `thumbnail` field
   * set to placeholder strings and not an actual image url.
   */
  const notReallyThumbnails = ['self', 'default', 'nsfw']

  return {
    thumbnail: notReallyThumbnails.includes(rawPost.data.thumbnail as string)
      ? undefined
      : rawPost.data.thumbnail,
    // eslint-disable-next-line @typescript-eslint/camelcase
    num_comments: rawPost.data.num_comments,
    fullSizePicture: rawPost.data.preview?.images[0].source.url,
    created: rawPost.data.created,
    author: rawPost.data.author,
    title: rawPost.data.title,
    name: rawPost.data.name,
    url: rawPost.data.url,
  }
}

export function persistReadPosts(readPosts: State['readPosts']): void {
  try {
    window.localStorage.setItem('readPosts', JSON.stringify(readPosts))
  } catch (err) {
    console.warn('Error persisting read posts state:', err.message)
  }
}

export function retrieveReadPosts() {
  let readPosts: State['readPosts'] = {}
  try {
    readPosts = JSON.parse(window.localStorage.getItem('readPosts') as string)
  } catch (err) {
    console.warn('Error retrieving read posts state:', err.message)
  }
  return readPosts
}
