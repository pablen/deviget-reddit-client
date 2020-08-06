import {
  useSelector as untypedUseSelector,
  useDispatch as untypedUseDispatch,
  TypedUseSelectorHook,
} from 'react-redux'
import { Dispatch } from 'react'

import { retrieveReadPosts } from './utils'
import { State, Action } from './types'

// Required to have typed useSelector and useDispatch
export const useSelector: TypedUseSelectorHook<State> = untypedUseSelector
export const useDispatch: () => Dispatch<Action> = untypedUseDispatch

const initialState: State = {
  selectedPost: undefined,
  oldestPost: undefined,
  posts: [],
  /**
   * Populate with LocalStorage data. As this is the only key persisted it is
   * simpler to populate it here instead of user `createStore()` rehydration.
   */
  readPosts: retrieveReadPosts(),
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
         * We store the complete selected post data instead of just a post name
         * as the demo video shows we need to keep the data visible even if the
         * selected post is dismissed.
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

    /**
     * The newer/older action types would make more sense in a scenario where
     * the user could scroll down to load more posts and at the same time newer
     * posts could be added on top (e.g. via a websocket subcription).
     */
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
