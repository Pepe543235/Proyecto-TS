import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './modulos/dashboard/Dashboard'
import routes from './core/menuRoutes'
import { useState } from 'react'
import AuthRoutes from './auth/AuthRoutes'
import Login from './modulos/login/login'
import ProtectedRoute from './auth/ProtectedRoute';

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
              <ProtectedRoute allowedRoles={['admin','user']}>
                <Dashboard />
              </ProtectedRoute>
          }
        >

        <Route 
          index element={<Dashboard />}        
        />

        {routes.map(route => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
        ))}
        </Route>

        <Route path="/unauthorized" element={<p>Acceso no autorizado</p>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
