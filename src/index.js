import { createStore } from 'redux'
import todoApp from '../src/reducers/reducers'
import { Provider } from 'react-redux'
import React from 'react'
import { render } from 'react-dom'
import  App from '../src/components/App'


const store = createStore(todoApp)

render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
)