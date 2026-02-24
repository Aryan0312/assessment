import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import {
  Plus,
  Pencil,
  StickyNote,
  Loader2,
  CalendarDays,
  LogOut,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// ─── Types ───────────────────────────────────────────────────────────
type User = {
  name: string
  email: string
}

type Note = {
  id: number
  user_id: number
  title: string
  content: string
  created_at: string
  updated_at: string
}

// ─── Helpers ─────────────────────────────────────────────────────────
const API = import.meta.env.VITE_API_URL

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}



// ─── Component ───────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate()

  // Auth
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [unauthorized, setUnauthorized] = useState(false)

  // Notes
  const [notes, setNotes] = useState<Note[]>([])
  const [notesLoading, setNotesLoading] = useState(true)

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // ── Auth check ────────────────────────────────────────────────────
  useEffect(() => {
    ; (async () => {
      try {
        const res = await fetch(`${API}/api/auth/me`, {
          credentials: "include",
        })
        if (!res.ok) {
          setUnauthorized(true)
          return
        }
        const json = await res.json()
        console.log('[DEBUG Dashboard] /me raw response:', JSON.stringify(json)) // DEBUG - REMOVE LATER
        console.log('[DEBUG Dashboard] json.data:', JSON.stringify(json.data)) // DEBUG - REMOVE LATER
        setUser(json.data)
      } catch {
        setUnauthorized(true)
      } finally {
        setAuthLoading(false)
      }
    })()
  }, [])

  // ── Fetch notes ───────────────────────────────────────────────────
  const fetchNotes = async () => {
    setNotesLoading(true)
    try {
      const res = await fetch(`${API}/api/note`, {
        credentials: "include",
      })
      if (!res.ok) throw new Error("Failed to fetch notes")
      const json = await res.json()
      setNotes(json.data ?? [])
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Could not load notes"
      )
    } finally {
      setNotesLoading(false)
    }
  }

  useEffect(() => {
    if (user) fetchNotes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  // ── Dialog helpers ────────────────────────────────────────────────
  const openCreate = () => {
    setEditingNote(null)
    setTitle("")
    setContent("")
    setDialogOpen(true)
  }

  const openEdit = (note: Note) => {
    setEditingNote(note)
    setTitle(note.title)
    setContent(note.content)
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required")
      return
    }

    setSubmitting(true)
    try {
      const isEdit = !!editingNote
      const url = isEdit
        ? `${API}/api/note/${editingNote!.id}`
        : `${API}/api/note`
      const method = isEdit ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), content: content.trim() }),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => null)
        throw new Error(
          errData?.message ?? `Failed to ${isEdit ? "update" : "create"} note`
        )
      }

      toast.success(isEdit ? "Note updated!" : "Note created!")
      setDialogOpen(false)
      fetchNotes()
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong"
      )
    } finally {
      setSubmitting(false)
    }
  }

  // ── Guards ────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
        Loading dashboard…
      </div>
    )
  }

  if (unauthorized || !user) {
    return <Navigate to="/" replace />
  }

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back, {user.name} 👋
            </h1>
            <p className="text-sm text-muted-foreground">
              Ready to crush your tasks today?
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button id="create-note-btn" onClick={openCreate} className="gap-2">
              <Plus className="size-4" />
              New Note
            </Button>
            <Button
              id="logout-btn"
              variant="outline"
              onClick={async () => {
                try {
                  await fetch(`${API}/api/auth/logout`, {
                    method: "POST",
                    credentials: "include",
                  })
                  toast.success("Logged out successfully")
                  navigate("/")
                } catch {
                  toast.error("Logout failed")
                }
              }}
              className="gap-2"
            >
              <LogOut className="size-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-6xl px-6 py-10">
        {notesLoading ? (
          /* ── Skeleton grid ──────────────────────────────────────── */
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl border bg-card p-6"
              >
                <div className="mb-3 h-5 w-2/3 rounded-md bg-muted" />
                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-muted" />
                  <div className="h-3 w-5/6 rounded bg-muted" />
                  <div className="h-3 w-4/6 rounded bg-muted" />
                </div>
                <div className="mt-5 h-3 w-1/3 rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : notes.length === 0 ? (
          /* ── Empty state ────────────────────────────────────────── */
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="mb-6 flex size-20 items-center justify-center rounded-2xl border bg-muted/50">
              <StickyNote className="size-9 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">No notes yet</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Start capturing your ideas — click{" "}
              <span className="font-medium text-foreground">"New Note"</span>{" "}
              to create your first one.
            </p>
            <Button
              onClick={openCreate}
              className="mt-6 gap-2"
            >
              <Plus className="size-4" />
              Create your first note
            </Button>
          </div>
        ) : (
          /* ── Notes grid ─────────────────────────────────────────── */
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <Card
                key={note.id}
                className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-border/60 hover:border-foreground/20"
              >
                <CardHeader>
                  <CardTitle className="line-clamp-1 text-base">
                    {note.title}
                  </CardTitle>
                  <CardAction>
                    <Button
                      id={`edit-note-${note.id}`}
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => openEdit(note)}
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Pencil className="size-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </CardAction>
                  <CardDescription className="line-clamp-3 whitespace-pre-wrap text-xs">
                    {note.content}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1" />

                <CardFooter className="text-[11px] text-muted-foreground">
                  <CalendarDays className="mr-1 size-3" />
                  {formatDate(note.updated_at ?? note.created_at)}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* ── Create / Edit Dialog ────────────────────────────────────── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingNote ? "Edit Note" : "New Note"}
            </DialogTitle>
            <DialogDescription>
              {editingNote
                ? "Update the title or content of your note."
                : "Fill in a title and content to create a new note."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="note-title">Title</Label>
              <Input
                id="note-title"
                placeholder="e.g. Weekly standup notes"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="note-content">Content</Label>
              <Textarea
                id="note-content"
                placeholder="Write your thoughts here…"
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              id="submit-note-btn"
              onClick={handleSubmit}
              disabled={submitting}
              className="gap-2"
            >
              {submitting && <Loader2 className="size-4 animate-spin" />}
              {editingNote ? "Save Changes" : "Create Note"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}