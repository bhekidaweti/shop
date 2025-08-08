'use client'

import { useState } from 'react'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    const auth = getAuth()

    try {
      await sendPasswordResetEmail(auth, email)
      setMessage('✅ Password reset email sent! Please check your spam folder if you dont see the email')
      setError('')
    } catch (err: any) {
      setError(err.message)
      setMessage('')
    }
  }

  return (
    <main className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h1 className="text-xl font-bold mb-4">Forgot Password</h1>
      <form onSubmit={handleReset} className="space-y-4">
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border px-3 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Send Reset Email
        </button>
      </form>

      {message && <p className="text-green-600 mt-4">{message}</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </main>
  )
}
