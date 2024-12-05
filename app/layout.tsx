import type { Metadata } from "next";
import "../_styles/globals.css";



export const metadata: Metadata = {
  title: "BruinMovies",
  description: "BruinMovies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
     
      >
        {children}
      </body>
    </html>
  );
}
