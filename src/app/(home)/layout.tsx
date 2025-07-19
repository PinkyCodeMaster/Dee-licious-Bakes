import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import React from 'react'

export default function HomeLayout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <SiteHeader hideOnLanding={true} />
            <main className="min-h-screen">
                {children}
            </main>
            <SiteFooter />
        </>
    )
}
