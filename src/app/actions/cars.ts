'use server'

import { revalidatePath } from 'next/cache'

import { Car } from '@/generated/client'
import { prisma } from '@/lib/prisma'

export const getCars = async (): Promise<{ cars?: Car[]; error?: string }> => {
  try {
    const cars = await prisma.car.findMany({ orderBy: { seq: 'asc' } })
    return { cars }
  } catch (error) {
    console.error('Error fetching cars:', error)
    return { error: '車両の取得に失敗しました' }
  }
}

export const createCar = async (formData: FormData) => {
  try {
    const name = formData.get('name') as string
    const seq = Number(formData.get('seq'))
    const maker = formData.get('maker') as string
    const model = formData.get('model') as string
    const modelYear = Number(formData.get('modelYear'))
    const licensePlate = formData.get('licensePlate') as string
    const tankCapacity = Number(formData.get('tankCapacity'))
    await prisma.car.create({
      data: {
        name,
        seq,
        maker,
        model,
        modelYear,
        licensePlate,
        tankCapacity,
      },
    })
    revalidatePath('/car')
  } catch (error) {
    console.error('Error creating car:', error)
  }
}

export const updateCar = async (formData: FormData) => {
  try {
    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const seq = Number(formData.get('seq'))
    const maker = formData.get('maker') as string
    const model = formData.get('model') as string
    const modelYear = Number(formData.get('modelYear'))
    const licensePlate = formData.get('licensePlate') as string
    const tankCapacity = Number(formData.get('tankCapacity'))
    await prisma.car.update({
      where: { id },
      data: {
        name,
        seq,
        maker,
        model,
        modelYear,
        licensePlate,
        tankCapacity,
      },
    })
    revalidatePath('/car')
  } catch (error) {
    console.error('Error updating car:', error)
  }
}

export const deleteCar = async (formData: FormData) => {
  try {
    const id = formData.get('id') as string
    await prisma.car.delete({ where: { id } })
    revalidatePath('/car')
  } catch (error) {
    console.error('Error deleting car:', error)
  }
}
