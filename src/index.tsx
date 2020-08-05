import { createStore } from 'redux'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import React from 'react'

import * as serviceWorker from './serviceWorker'
import { State, Action } from './types'
import reducer from './reducer'
import App from './components/App'

import '@reach/dialog/styles.css'
import './index.css'

const store = createStore<State, Action, undefined, undefined>(reducer)

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
