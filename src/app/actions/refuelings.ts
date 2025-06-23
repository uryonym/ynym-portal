'use server'

import { revalidatePath } from 'next/cache'

import { Refueling } from '@/generated/client'
import { prisma } from '@/lib/prisma'

export const getRefuelings = async (): Promise<{ refuelings?: Refueling[]; error?: string }> => {
  try {
    const refuelings = await prisma.refueling.findMany({ orderBy: { refuelDatetime: 'desc' } })
    return { refuelings }
  } catch (error) {
    console.error('Error fetching refuelings:', error)
    return { error: '給油記録の取得に失敗しました' }
  }
}

export const createRefueling = async (formData: FormData) => {
  try {
    const refuelDatetime = formData.get('refuelDatetime') as string
    const odometer = Number(formData.get('odometer'))
    const fuelType = formData.get('fuelType') as string
    const price = Number(formData.get('price'))
    const totalCost = Number(formData.get('totalCost'))
    const isFull = formData.get('isFull') === 'true'
    const gasStand = formData.get('gasStand') as string
    await prisma.refueling.create({
      data: {
        refuelDatetime: new Date(refuelDatetime),
        odometer,
        fuelType,
        price,
        totalCost,
        isFull,
        gasStand,
      },
    })
    revalidatePath('/refueling')
  } catch (error) {
    console.error('Error creating refueling:', error)
  }
}

export const updateRefueling = async (formData: FormData) => {
  try {
    const id = formData.get('id') as string
    const refuelDatetime = formData.get('refuelDatetime') as string
    const odometer = Number(formData.get('odometer'))
    const fuelType = formData.get('fuelType') as string
    const price = Number(formData.get('price'))
    const totalCost = Number(formData.get('totalCost'))
    const isFull = formData.get('isFull') === 'true'
    const gasStand = formData.get('gasStand') as string
    await prisma.refueling.update({
      where: { id },
      data: {
        refuelDatetime: new Date(refuelDatetime),
        odometer,
        fuelType,
        price,
        totalCost,
        isFull,
        gasStand,
      },
    })
    revalidatePath('/refueling')
  } catch (error) {
    console.error('Error updating refueling:', error)
  }
}

export const deleteRefueling = async (formData: FormData) => {
  try {
    const id = formData.get('id') as string
    await prisma.refueling.delete({ where: { id } })
    revalidatePath('/refueling')
  } catch (error) {
    console.error('Error deleting refueling:', error)
  }
}
