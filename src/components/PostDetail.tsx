import { formatDistanceToNowStrict } from 'date-fns'
import { Dialog } from '@reach/dialog'
import unescape from 'lodash/unescape'
import React, { useCallback } from 'react'

import { useSelector } from '../reducer'
import styles from './PostDetail.module.css'

function PostDetail() {
  const selectedPost = useSelector((s) => s.selectedPost)
  const [isDialogVisible, setIsDialogVisible] = React.useState(false)

  const handleThumbnailClick = useCallback(() => {
    setIsDialogVisible(true)
  }, [])

  const handleDialogClose = useCallback(() => {
    setIsDialogVisible(false)
  }, [])

  if (!selectedPost) return <div>No post selected</div>

  return (
    <article>
      <h1 className={styles.author}>{selectedPost.author}</h1>
      <p className={styles.created}>
        Created{' '}
        <time>
          {formatDistanceToNowStrict(selectedPost.createdAt * 1000, {
            addSuffix: true,
          })}
        </time>
      </p>
      <p>{selectedPost.title}</p>
      {selectedPost.thumbnail && (
        <button
          className={styles.thumbBtn}
          disabled={!selectedPost.fullSizePicture}
          onClick={handleThumbnailClick}
          type="button"
        >
          <img src={selectedPost.thumbnail} alt="" />
        </button>
      )}
      <p data-testid="numComments">
        {selectedPost.numComments}{' '}
        {selectedPost.numComments > 1 ? 'comments' : 'comment'}
      </p>
      <p>
        URL:{' '}
        <a target="_blank" href={selectedPost.url} rel="noreferrer noopener">
          {selectedPost.url}
        </a>
      </p>
      {isDialogVisible && (
        <Dialog onDismiss={handleDialogClose} aria-label="Full size picture">
          <div>
            <img
              data-testid="fullsize-image"
              className={styles.fullSizePicture}
              src={unescape(selectedPost.fullSizePicture)}
              alt=""
            />
          </div>
          <button
            className={styles.closeBtn}
            onClick={handleDialogClose}
            type="button"
          >
            Close
          </button>
        </Dialog>
      )}
    </article>
  )
}

export default React.memo(PostDetail)
