import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ArchitecturePage from './pages/ArchitecturePage'
import BuildPage from './pages/BuildPage'
import ParchmentPage from './pages/ParchmentPage'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/architecture" element={<ArchitecturePage />} />
          <Route path="/build" element={<BuildPage />} />
          <Route path="/parchment" element={<ParchmentPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App