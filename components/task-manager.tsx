'use client'

import { Plus, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { filterTasks, sampleTasks, type Task, type TaskInput, type TaskStatus } from '../lib/tasks'
import { TaskFilter } from './task-filter'
import { TaskForm } from './task-form'
import { TaskList } from './task-list'
import { updateTasks, useTasks } from './task-storage'

export function TaskManager() {
  const tasks = useTasks()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<TaskStatus | ''>('')
  const [editor, setEditor] = useState<Task | 'new' | null>(null)
  const [message, setMessage] = useState('')
  const visible = filterTasks(tasks, search, status)
  const completed = tasks.filter((task) => task.status === 'Hoàn thành').length

  function save(input: TaskInput) {
    if (editor === 'new') {
      const task: Task = {
        ...input,
        priority: input.priority === 'Cao' ? 'Vừa' : input.priority,
        id: crypto.randomUUID(),
        origin: 'personal',
      }
      updateTasks((current) => [task, ...current])
      setSearch('')
      setStatus('')
      setMessage('Đã thêm nhiệm vụ.')
    } else if (editor) {
      updateTasks((current) => current.map((task) => task.id === editor.id ? { ...task, ...input } : task))
      setMessage('Đã cập nhật nhiệm vụ.')
    }
    setEditor(null)
  }

  return <section id="nhiem-vu" className="section" aria-labelledby="tasks-heading">
    <div className="section-heading">
      <div><h2 id="tasks-heading">Nhiệm vụ nghiên cứu</h2><p>{completed}/{tasks.length} nhiệm vụ hoàn thành</p></div>
      <button className="button primary" onClick={() => setEditor('new')}><Plus size={17} /> Thêm nhiệm vụ</button>
    </div>
    {editor === 'new' && <TaskForm onSave={save} onCancel={() => setEditor(null)} />}
    {editor && editor !== 'new' && <TaskForm key={editor.id} initial={editor} onSave={save} onCancel={() => setEditor(null)} />}
    <TaskFilter search={search} status={status} onSearch={setSearch} onStatus={setStatus} />
    <TaskList tasks={visible} onEdit={setEditor} onToggle={(target) => {
      updateTasks((current) => current.map((task) => task.id === target.id
        ? { ...task, status: task.status === 'Hoàn thành' ? 'Chưa làm' : 'Hoàn thành' } : task))
      setMessage('Đã đổi trạng thái nhiệm vụ.')
    }} onDelete={(target) => {
      if (!window.confirm(`Xóa nhiệm vụ “${target.title}”?`)) return
      updateTasks((current) => current.filter((task) => task.id !== target.id))
      if (editor !== 'new' && editor?.id === target.id) setEditor(null)
      setMessage('Đã xóa nhiệm vụ.')
    }} />
    <div className="task-footer">
      <p className="caption">Nhiệm vụ được lưu trên trình duyệt này.</p>
      <button className="button subtle" onClick={() => {
        if (!window.confirm('Khôi phục dữ liệu mẫu và xóa các thay đổi cá nhân?')) return
        updateTasks(() => sampleTasks)
        setSearch('')
        setStatus('')
        setEditor(null)
        setMessage('Đã khôi phục dữ liệu mẫu.')
      }}><RotateCcw size={15} /> Khôi phục mẫu</button>
    </div>
    <p className="sr-only" role="status">{message}</p>
  </section>
}
