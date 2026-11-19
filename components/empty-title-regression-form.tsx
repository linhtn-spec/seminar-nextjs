'use client'

import type { ComponentProps } from 'react'
import { taskInputSchema, taskTitleLengthSchema } from '../lib/tasks'
import { TaskForm } from './task-form'

const emptyTitleRegressionSchema = taskInputSchema.extend({
  title: taskTitleLengthSchema,
})

export function EmptyTitleRegressionForm(props: Pick<ComponentProps<typeof TaskForm>, 'onSave' | 'onCancel'>) {
  return <TaskForm {...props} validationSchema={emptyTitleRegressionSchema} />
}
