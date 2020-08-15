import { createStore } from 'redux';
import { todoApp } from './reducers';
import { Provider } from 'react-redux';

const store = createStore(todoApp)

render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
)