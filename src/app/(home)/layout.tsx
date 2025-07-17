import { SiteHeader } from '@/components/site-header';
import React from 'react'

export default function HomeLayout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <SiteHeader />
            <main className="min-h-screen">
                {children}
            </main>
        </>
    )
}
