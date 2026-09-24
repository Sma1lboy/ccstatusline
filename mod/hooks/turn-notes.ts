// Per-turn notes for the transcript's closing line (`Baked for 12s`): what the
// turn cost, how much of its prompt the cache served, and why it missed.
import { fmtTokens } from './ledger'

export type TurnNote = {
  durationMs: number
  usd: number
  /** Cache read over cache read + write, 0..1; null when nothing was cacheable. */
  hit: number | null
  miss: { reason: string; written: number } | null
}

/** Notes kept for drawing; older turns' lines keep what they drew. */
const KEEP = 200

export class TurnNotes {
  private notes: TurnNote[] = []
  private byRequest = new Map<string, TurnNote>()

  add(note: TurnNote): void {
    this.notes.push(note)
    if (this.notes.length > KEEP) this.notes.shift()
  }

  clear(): void {
    this.notes = []
    this.byRequest.clear()
  }

  /**
   * The note for one closing line. The line carries no turn id, so a line is
   * matched the first time it is drawn to the newest unclaimed turn of the same
   * duration, and keeps that note after.
   */
  noteFor(requestId: string, durationMs: number): TurnNote | null {
    const known = this.byRequest.get(requestId)
    if (known) return known
    const claimed = new Set(this.byRequest.values())
    for (let i = this.notes.length - 1; i >= 0; i--) {
      const n = this.notes[i]!
      if (!claimed.has(n) && n.durationMs === durationMs) {
        this.byRequest.set(requestId, n)
        return n
      }
    }
    return null
  }
}

export function noteText(n: TurnNote): string {
  const parts = [`$${n.usd.toFixed(2)}`]
  if (n.hit !== null) parts.push(`cache ${Math.round(n.hit * 100)}%`)
  return parts.join(' · ')
}

export function missText(n: TurnNote): string | null {
  return n.miss ? `miss: ${n.miss.reason}, +${fmtTokens(n.miss.written)} rewritten` : null
}
