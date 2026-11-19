'use client'

import { Search } from 'lucide-react'
import { statuses, type TaskStatus } from '../lib/tasks'

export function TaskFilter({ search, status, onSearch, onStatus }: {
  search: string
  status: TaskStatus | ''
  onSearch: (search: string) => void
  onStatus: (status: TaskStatus | '') => void
}) {
  return <div className="filter-row">
    <label className="search"><Search size={17} aria-hidden /><input aria-label="Tìm nhiệm vụ" placeholder="Tìm nhiệm vụ…" value={search} onChange={(event) => onSearch(event.target.value)} /></label>
    <label className="filter-select"><span className="sr-only">Lọc theo trạng thái</span><select value={status} onChange={(event) => onStatus(statuses.find((value) => value === event.target.value) ?? '')}>
      <option value="">Tất cả trạng thái</option>{statuses.map((value) => <option key={value}>{value}</option>)}
    </select></label>
  </div>
}
