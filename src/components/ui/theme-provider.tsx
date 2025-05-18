"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

// Create a context for our theme
const ThemeContext = React.createContext<{
  theme?: string
  setTheme?: (theme: string) => void
}>({})

// This component wraps the NextThemesProvider and provides our theme context
function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useNextTheme()
  
  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(
    () => ({
      theme: theme || 'system',
      setTheme: (newTheme: string) => setTheme?.(newTheme)
    }),
    [theme, setTheme]
  )

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      <ThemeContextProvider>
        {children}
      </ThemeContextProvider>
    </NextThemesProvider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
