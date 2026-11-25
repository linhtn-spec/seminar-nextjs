import { z } from "zod";

export const statuses = ["Chưa làm", "Đang làm", "Hoàn thành"] as const;
export const priorities = ["Thấp", "Vừa", "Cao"] as const;

export const taskTitleLengthSchema = z
  .string()
  .trim()
  .max(90, "Tên nhiệm vụ tối đa 90 ký tự.");

export const taskInputSchema = z.object({
  title: taskTitleLengthSchema,
  note: z.string().trim().max(240, "Ghi chú tối đa 240 ký tự."),
  status: z.enum(statuses),
  priority: z.enum(priorities),
});

export const taskSchema = taskInputSchema.extend({
  id: z.string(),
  origin: z.enum(["sample", "personal"]),
  title: taskTitleLengthSchema,
});
export const storedTasksSchema = z.array(taskSchema);
export type TaskInput = z.infer<typeof taskInputSchema>;
export type Task = z.infer<typeof taskSchema>;
export type TaskStatus = TaskInput["status"];

export const sampleTasks: Task[] = [
  {
    id: "sample-1",
    title: "Quan sát Pikachu ở rừng thưa",
    note: "Ghi lại dấu hiệu hoạt động gần bìa rừng Kanto.",
    status: "Đang làm",
    priority: "Cao",
    origin: "sample",
  },
  {
    id: "sample-2",
    title: "Khảo sát Squirtle ven hồ",
    note: "Đánh dấu điểm quan sát trên tuyến ven hồ.",
    status: "Chưa làm",
    priority: "Vừa",
    origin: "sample",
  },
  {
    id: "sample-3",
    title: "Ghi chép về Bulbasaur",
    note: "Tổng hợp thông tin môi trường sống vào sổ nghiên cứu.",
    status: "Hoàn thành",
    priority: "Thấp",
    origin: "sample",
  },
];

export function filterTasks(
  tasks: Task[],
  search: string,
  status: TaskStatus | "",
) {
  const term = search.trim().toLocaleLowerCase("vi");
  return tasks.filter(
    (task) =>
      (!status || task.status === status) &&
      task.title.toLocaleLowerCase("vi").includes(term),
  );
}
