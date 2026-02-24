import { Dialog, DialogContent } from "@/components/ui/dialog"
import Login from "@/pages/auth/login"
import Signup from "@/pages/auth/signUp"

type Props = {
  open: boolean
  setOpen: (value: boolean) => void
  type: "login" | "signup"
  setType: (value: "login" | "signup") => void
}

export default function AuthModal({
  open,
  setOpen,
  type,
  setType,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        {type === "login" ? (
          <Login onSuccess={() => setOpen(false)} />
        ) : (
          <Signup
            onClose={() => setOpen(false)}
            switchToLogin={() => {
              setType("login")
              setOpen(true)
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}