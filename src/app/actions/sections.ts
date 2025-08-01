'use server'

import { revalidatePath } from 'next/cache'

import { auth } from '@/auth'
import { Section } from '@/generated/client'
import { prisma } from '@/lib/prisma'

export async function getSections(): Promise<Section[]> {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('ユーザー情報が取得できませんでした')
  }
  return await prisma.section.findMany({
    where: { uid: session.user.id },
    orderBy: { seq: 'asc' },
  })
}

export async function getSection(sectionId: string): Promise<Section | null> {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('ユーザー情報が取得できませんでした')
  }
  return await prisma.section.findUnique({
    where: { id: sectionId },
  })
}

export async function createSection(formData: FormData) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('ユーザー情報が取得できませんでした')
    }
    const name = formData.get('name') as string
    const seq = Number(formData.get('seq'))
    await prisma.section.create({ data: { name, seq, uid: session.user.id } })
    revalidatePath('/section')
  } catch (error) {
    console.error('Error creating section:', error)
  }
}

export async function updateSection(formData: FormData) {
  try {
    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const seq = Number(formData.get('seq'))
    await prisma.section.update({ where: { id }, data: { name, seq } })
    revalidatePath('/section')
  } catch (error) {
    console.error('Error updating section:', error)
  }
}

export async function deleteSection(formData: FormData) {
  try {
    const id = formData.get('id') as string
    await prisma.section.delete({ where: { id } })
    revalidatePath('/section')
  } catch (error) {
    console.error('Error deleting section:', error)
  }
}
