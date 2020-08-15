import { React } from 'react'
import { Footer } from '../components/presentational/Footer'
import { AddTodo } from '../components/container/AddTodo'
import { VisibleTodoList} from '../components/container/VisibleTodoList'
  
const App = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
)

export default App