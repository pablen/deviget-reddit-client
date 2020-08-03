import { formatDistanceToNowStrict } from 'date-fns'
import PropTypes from 'prop-types'
import React from 'react'

import styles from './PostDetail.module.css'

function PostDetail(props: Props) {
  return (
    <article>
      <h1 className={styles.author}>{props.author}</h1>
      <p className={styles.created}>
        Created{' '}
        <time>
          {formatDistanceToNowStrict(props.created * 1000, {
            addSuffix: true,
          })}
        </time>
      </p>
      <p>{props.title}</p>
      {props.thumbnail && <img src={props.thumbnail} alt="" />}
      <p>
        {props.numComments} {props.numComments > 1 ? 'comments' : 'comment'}
      </p>
      <p>
        URL:{' '}
        <a target="_blank" href={props.url} rel="noreferrer noopener">
          {props.url}
        </a>
      </p>
    </article>
  )
}

const PostDetailPropTypes = {
  numComments: PropTypes.number.isRequired,
  thumbnail: PropTypes.string,
  created: PropTypes.number.isRequired,
  author: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
}

PostDetail.propTypes = PostDetailPropTypes

type Props = PropTypes.InferProps<typeof PostDetailPropTypes>

export default PostDetail
