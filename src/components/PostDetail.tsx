import { formatDistanceToNowStrict } from 'date-fns'
import unescape from 'lodash/unescape'
import React from 'react'

import { useSelector } from '../reducer'
import styles from './PostDetail.module.css'

function PostDetail() {
  const selectedPost = useSelector((s) => s.selectedPost)
  if (!selectedPost) return null
  return (
    <article>
      <h1 className={styles.author}>{selectedPost.author}</h1>
      <p className={styles.created}>
        Created{' '}
        <time>
          {formatDistanceToNowStrict(selectedPost.created * 1000, {
            addSuffix: true,
          })}
        </time>
      </p>
      <p>{selectedPost.title}</p>
      {selectedPost.fullSizePicture && selectedPost.thumbnail ? (
        <a
          target="_blank"
          href={unescape(selectedPost.fullSizePicture)}
          rel="noopener noreferrer"
        >
          <img src={selectedPost.thumbnail} alt="" />
        </a>
      ) : selectedPost.thumbnail ? (
        <img src={selectedPost.thumbnail} alt="" />
      ) : null}
      <p>
        {selectedPost.num_comments}{' '}
        {selectedPost.num_comments > 1 ? 'comments' : 'comment'}
      </p>
      <p>
        URL:{' '}
        <a target="_blank" href={selectedPost.url} rel="noreferrer noopener">
          {selectedPost.url}
        </a>
      </p>
    </article>
  )
}

export default React.memo(PostDetail)
