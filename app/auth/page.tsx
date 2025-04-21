import { Suspense } from 'react'
import AuthPageClient from '@/components/AuthPageClient'

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthPageClient />
    </Suspense>
  )
}
