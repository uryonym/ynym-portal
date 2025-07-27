'use server'

import { revalidatePath } from 'next/cache'

import { auth } from '@/auth'
import { Refueling } from '@/generated/client'
import { prisma } from '@/lib/prisma'

export async function getRefuelings(carId: string): Promise<Refueling[]> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('ユーザー情報が取得できませんでした')
    }
    const refuelings = await prisma.refueling.findMany({
      where: { uid: session.user.id, carId },
      orderBy: { refuelDatetime: 'desc' },
    })
    return refuelings
  } catch (error) {
    console.error('Error fetching refuelings:', error)
    throw new Error('給油記録の取得に失敗しました')
  }
}

export async function createRefueling(formData: FormData) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('ユーザー情報が取得できませんでした')
    }
    const refuelDatetime = formData.get('refuelDatetime') as string
    const odometer = Number(formData.get('odometer'))
    const fuelType = formData.get('fuelType') as string
    const price = Number(formData.get('price'))
    const totalCost = Number(formData.get('totalCost'))
    const isFull = formData.get('isFull') === 'true'
    const gasStand = formData.get('gasStand') as string
    const carId = formData.get('carId') as string
    await prisma.refueling.create({
      data: {
        refuelDatetime: new Date(refuelDatetime),
        odometer,
        fuelType,
        price,
        totalCost,
        isFull,
        gasStand,
        uid: session.user.id,
        carId,
      },
    })
    revalidatePath('/refueling')
  } catch (error) {
    console.error('Error creating refueling:', error)
  }
}

export async function updateRefueling(formData: FormData) {
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

export async function deleteRefueling(formData: FormData) {
  try {
    const id = formData.get('id') as string
    await prisma.refueling.delete({ where: { id } })
    revalidatePath('/refueling')
  } catch (error) {
    console.error('Error deleting refueling:', error)
  }
}
