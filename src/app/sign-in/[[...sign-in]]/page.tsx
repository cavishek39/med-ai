'use client'

import { SignIn, SignUp } from '@clerk/nextjs'
import { Suspense, useState } from 'react'

export default function Page() {
  const [isSignUp, setIsSignUp] = useState(false)

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        // backgroundColor: '#f0f2f5',
      }}>
      <div
        style={{
          padding: '2rem',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}>
        {isSignUp ? <SignUp /> : <SignIn />}
        {/* <Suspense fallback='Loading...'>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            style={{
              marginTop: '1rem',
              padding: '0.5rem',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'background-color 0.3s ease',
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = '#218838')
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)')
            }>
            {isSignUp
              ? 'Already have an account? Sign In'
              : "Don't have an account? Sign Up"}
          </button>
        </Suspense> */}
      </div>
    </div>
  )
}
