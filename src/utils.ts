import { PostName, RawApiResponse, RawPostData, State } from './types'

/**
 * Fetches the current top posts from Reddit API.
 *
 * @param after - The post name of the last fetched post, useful for pagination
 */
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
 * Maps raw API data in order to only store fields relevant to this app.
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
    fullSizePicture: rawPost.data.preview?.images[0].source.url,
    numComments: rawPost.data.num_comments,
    createdAt: rawPost.data.created_utc,
    author: rawPost.data.author,
    title: rawPost.data.title,
    name: rawPost.data.name,
    url: rawPost.data.url,
  }
}

/**
 * Saves the provided read posts state in the browser's LocalStorage
 *
 * @param readPosts - The current map of read posts
 */
export function persistReadPosts(readPosts: State['readPosts']): void {
  try {
    window.localStorage.setItem('readPosts', JSON.stringify(readPosts))
  } catch (err) {
    console.warn('Error persisting read posts state:', err.message)
  }
}

/**
 * Retrieves the read posts state from the browser's LocalStorage
 */
export function retrieveReadPosts() {
  let readPosts: State['readPosts'] = {}
  try {
    const value = window.localStorage.getItem('readPosts')
    if (value) {
      readPosts = JSON.parse(value)
    }
  } catch (err) {
    console.warn('Error retrieving read posts state:', err.message)
  }
  return readPosts
}
