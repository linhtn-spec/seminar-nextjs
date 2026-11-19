'use client'

import { useMemo, useSyncExternalStore } from 'react'
import { sampleTasks, storedTasksSchema, type Task } from '../lib/tasks'

const key = 'pokedex-seminar:tasks:v1'
const changed = 'pokedex-seminar:tasks-changed'
let fallback: string | null = null

function subscribe(listener: () => void) {
  function sync(event: StorageEvent) {
    if (event.key === key || event.key === null) listener()
  }
  window.addEventListener('storage', sync)
  window.addEventListener(changed, listener)
  return () => {
    window.removeEventListener('storage', sync)
    window.removeEventListener(changed, listener)
  }
}

function getSnapshot() {
  if (fallback !== null) return fallback
  try {
    return localStorage.getItem(key)
  } catch {
    return fallback
  }
}

function readTasks(raw: string | null) {
  if (raw === null) return sampleTasks
  try {
    const stored = storedTasksSchema.safeParse(JSON.parse(raw))
    return stored.success ? stored.data : sampleTasks
  } catch {
    return sampleTasks
  }
}

export function updateTasks(change: (tasks: Task[]) => Task[]) {
  const raw = JSON.stringify(change(readTasks(getSnapshot())))
  try {
    localStorage.setItem(key, raw)
    fallback = null
  } catch {
    fallback = raw
  }
  window.dispatchEvent(new Event(changed))
}

export function useTasks() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => null)
  return useMemo(() => readTasks(raw), [raw])
}
