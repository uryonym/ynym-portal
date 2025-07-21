'use server'

import { revalidatePath } from 'next/cache'

import { auth } from '@/auth'
import { Task } from '@/generated/client'
import { prisma } from '@/lib/prisma'

export async function getTasks(options?: { completed?: boolean }): Promise<Task[]> {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('ユーザー情報が取得できませんでした')
  }
  const { completed } = options ?? {}
  return await prisma.task.findMany({
    where: {
      completed,
      uid: session.user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function createTask(data: { title: string; description?: string }) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('ユーザー情報が取得できませんでした')
  }
  const { title, description } = data
  const result = await prisma.task.create({
    data: {
      title,
      description,
      uid: session.user.id,
    },
  })
  revalidatePath('/task')
  return result
}

export async function updateTask(data: {
  id: string
  title: string
  description?: string
  completed?: boolean
}) {
  const { id, ...rest } = data
  const result = await prisma.task.update({
    where: { id },
    data: rest,
  })
  revalidatePath('/task')
  return result
}

export async function deleteTask(id: string) {
  const result = await prisma.task.delete({
    where: { id },
  })
  revalidatePath('/task')
  return result
}
