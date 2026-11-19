import { Check, ClipboardList, Pencil, Trash2 } from 'lucide-react'
import { type Task } from '../lib/tasks'

const statusClass = { 'Chưa làm': 'neutral', 'Đang làm': 'water', 'Hoàn thành': 'leaf' }
const priorityClass = { 'Thấp': 'neutral', 'Vừa': 'electric', 'Cao': 'fire' }

export function TaskList({ tasks, onEdit, onToggle, onDelete }: {
  tasks: Task[]
  onEdit: (task: Task) => void
  onToggle: (task: Task) => void
  onDelete: (task: Task) => void
}) {
  if (!tasks.length) return <div className="state">Không có nhiệm vụ phù hợp.</div>
  return <ul className="task-list" aria-label="Danh sách nhiệm vụ">
    {tasks.map((task) => {
      const title = task.title || 'Nhiệm vụ không có tên'
      return <li className="task-card" key={task.id}>
        <div className={`task-icon tone-${statusClass[task.status]}`}>{task.status === 'Hoàn thành' ? <Check size={20} /> : <ClipboardList size={20} />}</div>
        <div className="task-content">
          <span className="task-origin">{task.origin === 'sample' ? 'Dữ liệu mẫu' : 'Nhiệm vụ của bạn'}</span>
          <h3>{title}</h3>
          {task.note && <p>{task.note}</p>}
          <div className="type-row"><span className={`type-tag tone-${statusClass[task.status]}`}>{task.status}</span><span className={`type-tag tone-${priorityClass[task.priority]}`}>Ưu tiên {task.priority.toLocaleLowerCase('vi')}</span></div>
        </div>
        <div className="task-actions">
          <button className="icon-button" aria-pressed={task.status === 'Hoàn thành'} aria-label={`Đánh dấu hoàn thành: ${title}`} title="Đổi trạng thái hoàn thành" onClick={() => onToggle(task)}><Check size={17} /></button>
          <button className="icon-button" aria-label={`Sửa: ${title}`} title="Sửa nhiệm vụ" onClick={() => onEdit(task)}><Pencil size={16} /></button>
          <button className="icon-button danger" aria-label={`Xóa: ${title}`} title="Xóa nhiệm vụ" onClick={() => onDelete(task)}><Trash2 size={16} /></button>
        </div>
      </li>
    })}
  </ul>
}
