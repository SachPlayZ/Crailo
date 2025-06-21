"use client";

import { FileText, Github, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 sm:px-6 lg:px-8 border-t">
      <div className="flex items-center space-x-2 group">
        <div className="h-6 w-6 rounded bg-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
          <span className="text-white font-bold text-xs">C</span>
        </div>
        <span className="text-sm font-medium">Crailo</span>
      </div>
      <p className="text-xs text-muted-foreground sm:ml-auto">
        © 2024 Crailo. Building the future of safe trading.
      </p>
      <nav className="flex gap-4 sm:gap-6">
        <a
          href="#"
          className="flex items-center space-x-1 text-xs hover:underline underline-offset-4 hover:scale-105 transition-transform"
        >
          <FileText className="h-3 w-3" />
          <span>Docs</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-1 text-xs hover:underline underline-offset-4 hover:scale-105 transition-transform"
        >
          <Github className="h-3 w-3" />
          <span>GitHub</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-1 text-xs hover:underline underline-offset-4 hover:scale-105 transition-transform"
        >
          <MessageCircle className="h-3 w-3" />
          <span>Discord</span>
        </a>
      </nav>
    </footer>
  );
}
