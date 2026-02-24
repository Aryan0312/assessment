import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import AuthModal from "@/components/auth/AuthModal"
import Header from "@/components/layout/Header"
import { Button } from "@/components/ui/button"
import { ArrowRight, LogIn, UserPlus } from "lucide-react"

const taglines = [
  "Capture ideas before they disappear.",
  "Think. Write. Organize. Repeat.",
  "Your second brain, always ready.",
  "Less clutter, more clarity.",
  "Notes that move as fast as you do.",
  "Where thoughts become action.",
  "Write it down. Make it happen.",
  "Simple notes. Powerful focus.",
]

export default function Home() {
  const { user, loading } = useAuth()
  const [activeTagline, setActiveTagline] = useState(0)

  // Auth modal
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<"login" | "signup">("login")

  // Rotate taglines every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTagline((prev) => (prev + 1) % taglines.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <div className="flex-1 flex items-center justify-center px-6">
        {loading ? (
          <p className="text-muted-foreground animate-pulse">
            Checking authentication…
          </p>
        ) : user ? (
          /* ── Logged-in state ─────────────────────────────────── */
          <div className="text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Hello, {user.name} 👋
            </h1>

            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Your notes are waiting for you.
            </p>

            <Link to="/dashboard">
              <Button size="lg" className="gap-2 mt-2">
                Go to Dashboard
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        ) : (
          /* ── Logged-out state — rotating taglines ────────────── */
          <div className="text-center space-y-10 max-w-2xl">
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.1]">
              Notes App
            </h1>

            {/* Tagline rotator */}
            <div className="relative h-8 overflow-hidden">
              {taglines.map((line, i) => (
                <p
                  key={i}
                  className={`absolute inset-x-0 text-lg sm:text-xl text-muted-foreground transition-all duration-700 ease-in-out ${i === activeTagline
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                    }`}
                >
                  {line}
                </p>
              ))}
            </div>

            {/* Decorative dots */}
            <div className="flex justify-center gap-1.5 pt-2">
              {taglines.map((_, i) => (
                <span
                  key={i}
                  className={`inline-block size-1.5 rounded-full transition-all duration-500 ${i === activeTagline
                      ? "bg-foreground scale-125"
                      : "bg-muted-foreground/30"
                    }`}
                />
              ))}
            </div>

            {/* Login / Signup prompt */}
            <div className="space-y-3 pt-2">
              <p className="text-sm text-muted-foreground">
                Login or sign up to get started
              </p>
              <div className="flex justify-center gap-3">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    setModalType("login")
                    setModalOpen(true)
                  }}
                >
                  <LogIn className="size-4" />
                  Login
                </Button>
                <Button
                  className="gap-2"
                  onClick={() => {
                    setModalType("signup")
                    setModalOpen(true)
                  }}
                >
                  <UserPlus className="size-4" />
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <AuthModal
        open={modalOpen}
        setOpen={setModalOpen}
        type={modalType}
        setType={setModalType}
      />
    </div>
  )
}