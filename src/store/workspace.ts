import { create } from 'zustand'
import type { SourceKind, SourceStatus } from '../types/api'

export interface SourceCard {
  id: string
  kind: SourceKind
  status?: SourceStatus
  title?: string
  textContent?: string
  urlContent?: string
  fileFormat?: string
  fileUrl?: string
  parsedContentUrl?: string
}

export interface NotebookMeta {
  id: string
  name: string
  desc: string
  sourceCount: number
  iconUrl?: string
}

const createEmptyNotebookMeta = (): NotebookMeta => ({
  id: '',
  name: '',
  desc: '',
  sourceCount: 0,
})

interface WorkspaceStore {
  sources: SourceCard[]
  notebookMeta: NotebookMeta
  addSource: (source: SourceCard) => void
  patchSource: (id: string, patch: Partial<SourceCard>) => void
  removeSource: (id: string) => void
  setSources: (sources: SourceCard[]) => void
  setSourceStatus: (id: string, status: SourceStatus) => void
  setNotebookMeta: (notebookMeta: NotebookMeta) => void
  patchNotebookMeta: (patch: Partial<NotebookMeta>) => void
  reset: () => void
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  sources: [],
  notebookMeta: createEmptyNotebookMeta(),
  addSource: (source) =>
    set((state) => ({
      sources: [source, ...state.sources.filter((item) => item.id !== source.id)],
    })),
  patchSource: (id, patch) =>
    set((state) => {
      const index = state.sources.findIndex((item) => item.id === id)
      if (index < 0) {
        return state
      }
      const current = state.sources[index]
      const next = { ...current, ...patch }
      const unchanged = (Object.keys(patch) as Array<keyof SourceCard>).every(
        (key) => current[key] === next[key],
      )
      if (unchanged) {
        return state
      }
      const sources = state.sources.slice()
      sources[index] = next
      return { sources }
    }),
  removeSource: (id) =>
    set((state) => {
      if (!state.sources.some((item) => item.id === id)) {
        return state
      }
      return {
        sources: state.sources.filter((item) => item.id !== id),
      }
    }),
  setSources: (sources) =>
    set((state) => (state.sources === sources ? state : { sources })),
  setSourceStatus: (id, status) =>
    set((state) => {
      const index = state.sources.findIndex((item) => item.id === id)
      if (index < 0) {
        return state
      }
      const current = state.sources[index]
      if (current.status === status) {
        return state
      }
      const sources = state.sources.slice()
      sources[index] = { ...current, status }
      return { sources }
    }),
  setNotebookMeta: (notebookMeta) =>
    set({
      notebookMeta,
    }),
  patchNotebookMeta: (patch) =>
    set((state) => {
      const next = {
        ...state.notebookMeta,
        ...patch,
      }
      const unchanged = (Object.keys(patch) as Array<keyof NotebookMeta>).every(
        (key) => state.notebookMeta[key] === next[key],
      )
      if (unchanged) {
        return state
      }
      return { notebookMeta: next }
    }),
  reset: () =>
    set({
      sources: [],
      notebookMeta: createEmptyNotebookMeta(),
    }),
}))
