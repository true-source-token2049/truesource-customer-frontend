"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

interface ResponsiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function ResponsiveModal({
  open,
  onOpenChange,
  children,
  title,
  description,
}: ResponsiveModalProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {/* Overlay */}
      <DialogPrimitive.Overlay
        className={cn(
          "fixed inset-0 z-50 bg-black/50",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        )}
      />

      {/* Content */}
      <DialogPrimitive.Content
        className={cn(
          "fixed z-50 bg-white shadow-lg transition-all",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          // Mobile: Drawer from bottom
          "bottom-0 left-0 right-0 rounded-t-3xl max-h-[85vh]",
          "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
          // Desktop: Center modal
          "md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2",
          "md:bottom-auto md:right-auto md:rounded-2xl md:max-h-[90vh]",
          "md:w-full md:max-w-lg",
          "md:data-[state=closed]:slide-out-to-bottom-0 md:data-[state=open]:slide-in-from-bottom-0",
          "md:data-[state=closed]:zoom-out-95 md:data-[state=open]:zoom-in-95",
          "overflow-hidden flex flex-col"
        )}
      >
        {/* Drag indicator for mobile
        <div className="md:hidden flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div> */}

        {/* Header */}
        {(title || description) && (
          <div className="px-6 py-4 border-b">
            {title && (
              <DialogPrimitive.Title className="text-md font-semibold text-gray-900">
                {title}
              </DialogPrimitive.Title>
            )}
            {description && (
              <DialogPrimitive.Description className="mt-1 text-sm text-gray-500">
                {description}
              </DialogPrimitive.Description>
            )}
          </div>
        )}

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-0">{children}</div>

        {/* Close button */}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Root>
  );
}
