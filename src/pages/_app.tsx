import type { AppProps } from 'next/app';
import { Geist, Geist_Mono, Inter, Rubik, Merriweather } from "next/font/google";
import "../styles/globals.css";

// Fonts configuration
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-rubik",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather",
  display: "swap",
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Contenido de la aplicación */}
      <div className={`${rubik.variable} ${inter.variable} ${geistSans.variable} ${geistMono.variable} ${merriweather.variable} antialiased`}>
        <Component {...pageProps} />
      </div>


    </>
  );
}
