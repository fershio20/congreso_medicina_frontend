import type { AppProps } from 'next/app';
import { Geist, Geist_Mono, Inter, Rubik, Merriweather, Albert_Sans, Mona_Sans, Hubot_Sans } from "next/font/google";
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

const albertSans = Albert_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-albert-sans",
  display: "swap",
});

const monaSans = Mona_Sans({
  subsets: ["latin"],
  variable: "--font-mona-sans",
  display: "swap",
});

const hubotSans = Hubot_Sans({
  subsets: ["latin"],
  variable: "--font-hubot-sans",
  display: "swap",
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Contenido de la aplicación: font-body aplica Hubot Sans a todo el contenido */}
      <div className={`${monaSans.variable} ${hubotSans.variable} ${rubik.variable} ${inter.variable} ${geistSans.variable} ${geistMono.variable} ${merriweather.variable} ${albertSans.variable} font-body antialiased min-h-screen`}>
        <Component {...pageProps} />
      </div>


    </>
  );
}
