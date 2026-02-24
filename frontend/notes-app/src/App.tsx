import { Routes, Route } from "react-router-dom"
import Home from "./pages/home"
import Dashboard from "./pages/dashboard"
import { Toaster } from "sonner"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

      <Toaster richColors position="bottom-right" />
    </>
  )
}

export default App