'use server'

import { revalidatePath } from 'next/cache'

import { Task } from '@/generated/client'
import { prisma } from '@/lib/prisma'

export const getTasks = async (): Promise<{ tasks?: Task[]; error?: string }> => {
  try {
    const tasks = await prisma.task.findMany({ orderBy: { createdAt: 'desc' } })
    return { tasks }
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return { error: 'タスクの取得に失敗しました' }
  }
}

export const createTask = async (formData: FormData) => {
  try {
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const dueDate = formData.get('dueDate') as string
    await prisma.task.create({
      data: {
        title,
        description: description || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        completed: false,
      },
    })
    revalidatePath('/task')
  } catch (error) {
    console.error('Error creating task:', error)
  }
}

export const updateTask = async (formData: FormData) => {
  try {
    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const dueDate = formData.get('dueDate') as string
    const completedRaw = formData.get('completed')
    const completed = completedRaw === 'true'
    await prisma.task.update({
      where: { id },
      data: {
        title,
        description: description || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        completed,
      },
    })
    revalidatePath('/task')
  } catch (error) {
    console.error('Error updating task:', error)
  }
}

export const deleteTask = async (formData: FormData) => {
  try {
    const id = formData.get('id') as string
    await prisma.task.delete({ where: { id } })
    revalidatePath('/task')
  } catch (error) {
    console.error('Error deleting task:', error)
  }
}
