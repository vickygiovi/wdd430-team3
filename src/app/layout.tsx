import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import { Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { auth, signIn, signOut } from "@/auth";
import NavbarLinks from "@/app/ui/navbar-links";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Handcrafted Haven",
  description: "A curated marketplace for artisans and creators",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth();
  const userRole = session?.user?.role; // 'artesano' o 'cliente'

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* =========================
          HEADER / NAVBAR
      ========================== */}
      <header>
        <nav className="navbar">
          <div className="logo">
            <Image src="/logo2.png" alt="Logo" width={50} height={50} />
          </div>

          {/* <ul>
            <li><Link href="/catalog">Browse Catalog</Link></li>
            <li><Link href="/articles">Stories</Link></li>
            <li><a href="#">My Reviews</a></li>
            <li><a href="#">Contact</a></li>
          </ul> */}

          <NavbarLinks />

          <div className="nav-actions">
      {/* 1. SI NO HAY SESIÓN: Mostrar Sign in y Register */}
      {!session ? (
        <>
          <Link href="/login" className="btn btn-outline">
            Sign in
          </Link>
          <Link href="/register">
            <button className="btn btn-solid">Register</button>
          </Link>
        </>
      ) : (
        /* 2. SI HAY SESIÓN: Mostrar elementos según el rol */
        <>
          {/* Si es Artesano, mostrar sus herramientas */}
          {userRole === 'artesano' && (
            <>
              <Link href="/profile">
                <button className="btn btn-profile">My Profile</button>
              </Link>
              <Link href="/mystories">
                <button className="btn btn-stories">My Stories</button>
              </Link>
              <Link href="/products">
                <button className="btn btn-products">My Products</button>
              </Link>
            </>
          )}

          {/* Botón de Sign out (Visible para Cliente y Artesano) */}
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/login' });
            }}
          >
            <button className="btn btn-outline">Sign out</button>
          </form>
        </>
      )}
    </div>
        </nav>
      </header>
      <main className="flex-grow w-full">
        {children}
      </main>
      {/* =========================
          FOOTER
      ========================== */}
      <footer>
        <div className="footer-container">
          <div>
            <div className="logo">
              <Image src="/logo2.png" alt="Logo" width={50} height={50} />
            </div>
            <div className="footer-social">
              <a href="#" aria-label="Twitter">
                <Twitter size={20} strokeWidth={1.5} />
              </a>
              <a href="#" aria-label="Instagram">
                <Instagram size={20} strokeWidth={1.5} />
              </a>
              <a href="#" aria-label="YouTube">
                <Youtube size={20} strokeWidth={1.5} />
              </a>
              <a href="#" aria-label="LinkedIn">
                <Linkedin size={20} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h4>Artisans</h4>
            <ul>
              <li><a href="#">View Profile</a></li>
              <li><a href="#">Modify Profile</a></li>
              <li><a href="#">Publish a Crafting</a></li>
              <li><a href="#">Tell a Story</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Users</h4>
            <ul>
              <li><a href="#">Start Browsing</a></li>
              <li><a href="#">Filtering</a></li>
              <li><a href="#">Ratings</a></li>
              <li><a href="#">User Reviews</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>About Us</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Our Mission</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
        </div>
      </footer>

      </body>
    </html>
  );
}
