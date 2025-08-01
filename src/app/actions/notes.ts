'use server'

import { revalidatePath } from 'next/cache'

import { auth } from '@/auth'
import { Note } from '@/generated/client'
import { prisma } from '@/lib/prisma'

export async function getNotes(sectionId: string): Promise<Note[]> {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('ユーザー情報が取得できませんでした')
  }
  return await prisma.note.findMany({
    where: { sectionId: sectionId, uid: session.user.id },
    orderBy: { seq: 'asc' },
  })
}

export async function createNote(formData: FormData) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('ユーザー情報が取得できませんでした')
    }
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const seq = Number(formData.get('seq'))
    const sectionId = formData.get('sectionId') as string
    await prisma.note.create({ data: { title, content, seq, uid: session.user.id, sectionId } })
    revalidatePath('/note')
  } catch (error) {
    console.error('Error creating note:', error)
  }
}

export async function updateNote(formData: FormData) {
  try {
    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const seq = Number(formData.get('seq'))
    await prisma.note.update({ where: { id }, data: { title, content, seq } })
    revalidatePath('/note')
  } catch (error) {
    console.error('Error updating note:', error)
  }
}

export async function deleteNote(formData: FormData) {
  try {
    const id = formData.get('id') as string
    await prisma.note.delete({ where: { id } })
    revalidatePath('/note')
  } catch (error) {
    console.error('Error deleting note:', error)
  }
}
