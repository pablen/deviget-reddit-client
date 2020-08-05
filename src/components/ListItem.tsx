import { formatDistanceToNowStrict } from 'date-fns'
import PropTypes from 'prop-types'
import React from 'react'

import DismissIcon from './DismissIcon'
import styles from './ListItem.module.css'

function ListItem(props: Props) {
  return (
    <div className={styles.container} data-testid={`post-${props.name}`}>
      <button
        data-postname={props.name}
        aria-current={props.isSelected}
        onClick={props.onSelect}
        type="button"
      >
        <div className={styles.row1}>
          <div
            aria-label={props.isRead ? 'Read' : 'Unread'}
            className={styles.isReadMarker}
          >
            <svg aria-hidden="true" viewBox="0 0 2 2" width={10}>
              <circle cx={1} cy={1} r={1} opacity={props.isRead ? 0 : 1} />
            </svg>
          </div>
          <div className={styles.author} data-testid="author">
            {props.author}
          </div>
          <div className={styles.createdTime} data-testid="createdAt">
            Created{' '}
            <time>
              {formatDistanceToNowStrict(props.createdAt * 1000, {
                addSuffix: true,
              })}
            </time>
          </div>
        </div>
        <div className={styles.row2}>
          {props.thumbnail && (
            <img className={styles.thumbnail} src={props.thumbnail} alt="" />
          )}
          <p className={styles.title} data-testid="title">
            {props.title}
          </p>
        </div>
        <div className={styles.row3}>
          <div className={styles.comments} data-testid="numComments">
            {props.numComments} {props.numComments > 1 ? 'comments' : 'comment'}
          </div>
        </div>
      </button>
      <button
        data-postname={props.name}
        className={styles.dismissBtn}
        onClick={props.onDismiss}
        type="button"
      >
        <DismissIcon />
        Dismiss
      </button>
    </div>
  )
}

const ListItemPropTypes = {
  numComments: PropTypes.number.isRequired,
  isSelected: PropTypes.bool.isRequired,
  createdAt: PropTypes.number.isRequired,
  onDismiss: PropTypes.func.isRequired,
  thumbnail: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  author: PropTypes.string.isRequired,
  isRead: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}

ListItem.propTypes = ListItemPropTypes

type Props = PropTypes.InferProps<typeof ListItemPropTypes>

export default React.memo(ListItem)
