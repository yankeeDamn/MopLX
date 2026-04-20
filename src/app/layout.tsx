import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "LearnXOps - Master DevOps & Cloud Engineering",
  description:
    "Your go-to newsletter for DevOps, Cloud, and Infrastructure learning. Get weekly curated tutorials, guides, and resources on Kubernetes, CI/CD, Terraform, AWS, and more.",
  keywords: [
    "DevOps",
    "Cloud",
    "Kubernetes",
    "CI/CD",
    "Terraform",
    "AWS",
    "Newsletter",
    "Learning",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
