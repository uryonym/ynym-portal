'use server'

import { revalidatePath } from 'next/cache'

import { Section } from '@/generated/client'
import { prisma } from '@/lib/prisma'

export const getSections = async (): Promise<{ sections?: Section[]; error?: string }> => {
  try {
    const sections = await prisma.section.findMany({ orderBy: { seq: 'asc' } })
    return { sections }
  } catch (error) {
    console.error('Error fetching sections:', error)
    return { error: 'セクションの取得に失敗しました' }
  }
}

export const createSection = async (formData: FormData) => {
  try {
    const name = formData.get('name') as string
    const seq = Number(formData.get('seq'))
    await prisma.section.create({ data: { name, seq } })
    revalidatePath('/section')
  } catch (error) {
    console.error('Error creating section:', error)
  }
}

export const updateSection = async (formData: FormData) => {
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

export const deleteSection = async (formData: FormData) => {
  try {
    const id = formData.get('id') as string
    await prisma.section.delete({ where: { id } })
    revalidatePath('/section')
  } catch (error) {
    console.error('Error deleting section:', error)
  }
}
