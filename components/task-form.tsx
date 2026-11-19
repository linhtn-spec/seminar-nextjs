'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { priorities, statuses, taskInputSchema, type TaskInput } from '../lib/tasks'

const defaults: TaskInput = { title: '', note: '', status: 'Chưa làm', priority: 'Vừa' }

export function TaskForm({ initial, onSave, onCancel, validationSchema = taskInputSchema }: {
  initial?: TaskInput
  validationSchema?: typeof taskInputSchema
  onSave: (task: TaskInput) => void
  onCancel: () => void
}) {
  const { register, handleSubmit, setFocus, formState: { errors } } = useForm<TaskInput>({
    resolver: zodResolver(validationSchema),
    defaultValues: initial ?? defaults,
  })

  useEffect(() => setFocus('title'), [setFocus])

  return <form className="panel task-form" onSubmit={handleSubmit(onSave)} noValidate aria-label={initial ? 'Chỉnh sửa nhiệm vụ' : 'Nhiệm vụ mới'}>
    <h3>{initial ? 'Chỉnh sửa nhiệm vụ' : 'Nhiệm vụ mới'}</h3>
    <label>Tên nhiệm vụ<input {...register('title')} aria-invalid={!!errors.title} aria-describedby={errors.title ? 'title-error' : undefined} placeholder="Ví dụ: Quan sát Eevee ở đồng cỏ" /></label>
    {errors.title && <p id="title-error" className="field-error" role="alert">{errors.title.message}</p>}
    <label>Ghi chú<textarea {...register('note')} aria-invalid={!!errors.note} aria-describedby={errors.note ? 'note-error' : undefined} rows={2} /></label>
    {errors.note && <p id="note-error" className="field-error" role="alert">{errors.note.message}</p>}
    <div className="form-row">
      <label>Trạng thái<select {...register('status')}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
      <label>Ưu tiên<select {...register('priority')}>{priorities.map((priority) => <option key={priority}>{priority}</option>)}</select></label>
    </div>
    <div className="actions">
      <button className="button primary" type="submit">Lưu nhiệm vụ</button>
      <button className="button" type="button" onClick={onCancel}>Hủy</button>
    </div>
  </form>
}
