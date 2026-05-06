import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Training from './pages/Training'
import MealPlan from './pages/MealPlan'
import Weight from './pages/Weight'
import Profile from './pages/Profile'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/"         element={<Dashboard />} />
          <Route path="/training" element={<Training />} />
          <Route path="/meals"    element={<MealPlan />} />
          <Route path="/weight"   element={<Weight />} />
          <Route path="/profile"  element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
