import { useState } from "react"
import { Button } from "@/components/ui/button"
import AuthModal from "@/components/auth/AuthModal"
import { useAuth } from "@/context/AuthContext"

export default function Header() {
  const { user, loading, logout } = useAuth()

  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<"login" | "signup">("login")

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="flex justify-between items-center px-6 py-4 border-b">
      <h1 className="text-xl font-bold">Notes App</h1>

      <div className="flex items-center gap-4">
        {loading ? null : user ? (
          <>
            <span className="text-sm text-muted-foreground">
              {user.email}
            </span>

            <Button
              variant="destructive"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={() => {
                setModalType("login")
                setModalOpen(true)
              }}
            >
              Login
            </Button>

            <Button
              onClick={() => {
                setModalType("signup")
                setModalOpen(true)
              }}
            >
              Signup
            </Button>
          </>
        )}
      </div>

      <AuthModal
        open={modalOpen}
        setOpen={setModalOpen}
        type={modalType}
        setType={setModalType}
      />
    </header>
  )
}