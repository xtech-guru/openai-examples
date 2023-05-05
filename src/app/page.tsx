import Image from 'next/image'
import { Inter } from 'next/font/google'
import { SurveysGeneration } from '@/components/SurveysGeneration'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <h1 className="text-6xl font-bold text-center">AI assisted survey generation</h1>
      <SurveysGeneration />
    </main>
  )
}
