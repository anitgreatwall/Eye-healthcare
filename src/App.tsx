import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useAppStore } from './store/appStore'
import Onboarding from './pages/Onboarding'
import Today from './pages/Today'
import SessionRunner from './pages/SessionRunner'
import Progress from './pages/Progress'
import ParentDashboard from './pages/ParentDashboard'
import Settings from './pages/Settings'
import About from './pages/About'

const NAV = [
  { to: '/', label: '今日', icon: '🏠' },
  { to: '/progress', label: '进度', icon: '📈' },
  { to: '/parent', label: '家长', icon: '🧑‍🦰' },
  { to: '/about', label: '关于', icon: 'ℹ️' },
]

function BottomNav() {
  const nav = useNavigate()
  const loc = useLocation()
  if (loc.pathname === '/session' || loc.pathname === '/onboarding') return null
  return (
    <nav className="sticky bottom-0 z-30 bg-white/95 backdrop-blur border-t border-slate-100 grid grid-cols-4 max-w-md mx-auto w-full">
      {NAV.map((n) => {
        const active = loc.pathname === n.to
        return (
          <button
            key={n.to}
            onClick={() => nav(n.to)}
            className={`flex flex-col items-center py-2 text-xs ${active ? 'text-brand-600 font-semibold' : 'text-slate-400'}`}
          >
            <span className="text-xl">{n.icon}</span>
            {n.label}
          </button>
        )
      })}
    </nav>
  )
}

export default function App() {
  const onboarded = useAppStore((s) => s.onboarded)
  return (
    <div className="min-h-full flex flex-col max-w-md mx-auto w-full bg-brand-50 shadow-xl">
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route
            path="/onboarding"
            element={onboarded ? <Navigate to="/" replace /> : <Onboarding />}
          />
          <Route path="/" element={onboarded ? <Today /> : <Navigate to="/onboarding" replace />} />
          <Route path="/session" element={onboarded ? <SessionRunner /> : <Navigate to="/onboarding" replace />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/parent" element={<ParentDashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}
