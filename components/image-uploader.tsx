"use client";

import type React from "react";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, ImageIcon, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
  disabled?: boolean;
}

export default function ImageUploader({
  onImageSelected,
  disabled = false,
}: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Pass file to parent component
    onImageSelected(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-gray-300 dark:border-gray-700",
          disabled && "opacity-60 cursor-not-allowed"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-xs mx-auto mb-4"
            >
              <img
                src={previewUrl || "/placeholder.svg"}
                alt="Product preview"
                className="rounded-md max-h-64 mx-auto object-contain"
              />
            </motion.div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Image ready for analysis
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 mb-4">
              <Upload className="h-8 w-8 text-gray-500 dark:text-gray-400" />
            </div>
            <p className="text-lg font-medium mb-2">Upload Product Image</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Drag and drop or click to upload a product label or barcode
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="flex items-center gap-2"
              >
                <ImageIcon className="h-4 w-4" />
                Select Image
              </Button>
              {/* <Button
                variant="outline"
                onClick={() => {
                  // This would typically open the camera
                  // For now, just open file selector
                  fileInputRef.current?.click()
                }}
                disabled={disabled}
                className="flex items-center gap-2"
              >
                <Camera className="h-4 w-4" />
                Take Photo
              </Button> */}
            </div>
          </div>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
}
