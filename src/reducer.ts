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
  readPosts: retrieveReadPosts(),
  posts: [],
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
         * We store the full selected post insted of just an id as per the demo
         * video we need to keep the data visible even when dismissed.
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
