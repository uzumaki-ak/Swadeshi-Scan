"use client";

import { useState } from "react";
import Tesseract from "tesseract.js";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ImageUploader from "@/components/image-uploader";
import ResultsDisplay from "@/components/results-display";
import { useProductStore } from "@/lib/store";
import { LoadingSpinner } from "@/components/loading-spinner";

export default function ProductAnalyzer() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [currentStatus, setCurrentStatus] = useState("");
  const { toast } = useToast();
  const { setProductData, productData } = useProductStore();

  const processImage = async (imageFile: File) => {
    setIsProcessing(true);
    setCurrentStatus("Starting OCR process...");
    setOcrProgress(0);

    try {
      // Step 1: Extract text using Tesseract OCR with improved settings
      let text = "";
      try {
        setCurrentStatus("Analyzing image with OCR...");
        // Use better Tesseract settings for product labels
        const result = await Tesseract.recognize(imageFile, "eng", {
          logger: (m) => {
            if (m.status === "recognizing text") {
              setOcrProgress(m.progress * 100);
              setCurrentStatus(
                `Extracting text: ${Math.round(m.progress * 100)}%`
              );
            }
          },
          // Improved settings for product labels
          tessedit_char_whitelist:
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,:%()/-",
          tessjs_create_hocr: false,
          tessjs_create_tsv: false,
        });
        text = result.data.text;

        // If text is too short, try again with different settings
        if (!text || text.trim().length < 20) {
          setCurrentStatus(
            "First attempt generated limited text. Trying again with different settings..."
          );
          const result2 = await Tesseract.recognize(imageFile, "eng", {
            logger: (m) => {
              if (m.status === "recognizing text") {
                setOcrProgress(m.progress * 100);
              }
            },
            tessedit_pageseg_mode: "6", // Assume a single uniform block of text
          });
          text = result2.data.text;
        }

        if (!text || text.trim().length === 0) {
          throw new Error("No text could be extracted from the image");
        }

        // Basic text cleanup
        text = text.replace(/\s+/g, " ").trim();

        // Log extracted text for debugging
        console.log("Extracted text:", text);
      } catch (error) {
        console.error("OCR Error:", error);
        toast({
          title: "Text Extraction Failed",
          description:
            "Could not read text from the image. Please try a clearer image or different angle.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      // Step 2: Send extracted text to our API for Gemini analysis
      setCurrentStatus("Analyzing product information...");
      const formData = new FormData();
      formData.append("text", text);
      formData.append("image", imageFile);

      let response;
      let retries = 0;
      const maxRetries = 3;

      while (retries < maxRetries) {
        try {
          response = await fetch("/api/analyze", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            break;
          }

          retries++;
          if (retries >= maxRetries) {
            throw new Error(
              `Failed to analyze product after ${maxRetries} attempts`
            );
          }

          setCurrentStatus(`Retry attempt ${retries}/${maxRetries}...`);
          // Wait before retrying (exponential backoff)
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * Math.pow(2, retries))
          );
        } catch (error) {
          console.error(`API attempt ${retries} failed:`, error);
          if (retries >= maxRetries) {
            throw error;
          }
        }
      }

      if (!response || !response.ok) {
        throw new Error("Failed to analyze product");
      }

      const analysisResult = await response.json();

      // Add timestamp to result
      analysisResult.timestamp = new Date().toISOString();

      // Step 3: Update state with results
      setProductData(analysisResult);

      // Step 4: Show toast notification based on origin
      if (analysisResult.madeInIndia) {
        toast({
          title: "Made in India",
          description: `${
            analysisResult.productName || "This product"
          } is made in India.`,
          variant: "default",
          className: "bg-green-500 text-white",
        });
      } else {
        toast({
          title: "Not Made in India",
          description: `${
            analysisResult.productName || "This product"
          } is not made in India.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error processing image:", error);
      toast({
        title: "Processing Error",
        description: "Failed to analyze the product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setCurrentStatus("");
      setOcrProgress(0);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-lg">
        <CardContent className="p-6">
          {!productData ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ImageUploader
                onImageSelected={processImage}
                disabled={isProcessing}
              />

              {isProcessing && (
                <div className="mt-8">
                  <LoadingSpinner
                    size="lg"
                    text={
                      currentStatus ||
                      "Processing image and analyzing product..."
                    }
                  />
                  {ocrProgress > 0 && (
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                          style={{ width: `${ocrProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-center mt-1 text-gray-500">
                        {Math.round(ocrProgress)}% complete
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <ResultsDisplay />
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={() => setProductData(null)}
                  className="mt-4"
                >
                  Analyze Another Product
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
