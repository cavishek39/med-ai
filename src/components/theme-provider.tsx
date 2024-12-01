'use client'

import * as React from 'react'
import { ThemeProvider as NextThemeProvider } from 'next-themes'

interface ThemeProviderProps
  extends React.ComponentProps<typeof NextThemeProvider> {
  children: React.ReactNode
}

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps): React.ReactElement {
  return <NextThemeProvider {...props}>{children}</NextThemeProvider>
}
