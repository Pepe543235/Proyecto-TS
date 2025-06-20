import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Dashboard from "./modulos/dashboard/Dashboard"
import routes from "./core/menuRoutes"
import { BrowserRouter as Router, Routes, Route, Link, BrowserRouter } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  const handlerClick = () => {
    setCount((count) => count + 1)
  }
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />}>
          {routes.map(route =>
            <Route key={route.path} path={route.path} element={route.element} />
          )}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
