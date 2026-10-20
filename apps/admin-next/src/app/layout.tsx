import type { Metadata, Viewport } from 'next'
import type { JSX } from 'react'
import { colors } from '@repo/ui-config/colors'
import { SidebarProvider } from '@repo/ui-web/primitives/sidebar'
import { Toaster } from '@repo/ui-web/primitives/toast'
import { TooltipProvider } from '@repo/ui-web/primitives/tooltip'
import { ThemeProvider } from '@repo/ui-web/theme-provider'
import { ThemeToggle } from '@repo/ui-web/theme-toggle'
import { Geist, Geist_Mono } from 'next/font/google'
import { AppSidebar } from '@/components/app-sidebar'
import { ScriptTheme } from '@/components/script-theme'
import { ReactQueryProvider } from '@/providers/react-query'
import '@/styles/base.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Starter Template',
  // The admin panel must never be indexed.
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: colors.light.background },
    { media: '(prefers-color-scheme: dark)', color: colors.dark.background },
  ],
}

export default async function Layout({ children, header }: LayoutProps<'/'>): Promise<JSX.Element> {
  return (
    // `suppressHydrationWarning`: the theme bootstrap script sets the color scheme class before hydration.
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ScriptTheme />
        <ThemeProvider>
          <ReactQueryProvider>
            <TooltipProvider>
              {/* `isolate` keeps Base UI popups (portaled to the body) above the app content. */}
              <SidebarProvider className="isolate">
                <AppSidebar />
                <main className="flex h-screen w-full flex-col overflow-hidden">
                  <header className="flex h-12 items-center justify-between gap-4 border-b px-4">
                    {header}
                    <ThemeToggle labels={{ light: 'Light', dark: 'Dark', system: 'System', toggle: 'Toggle theme' }} />
                  </header>
                  <div className="flex-1 overflow-auto p-4">{children}</div>
                </main>
              </SidebarProvider>
            </TooltipProvider>
          </ReactQueryProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
