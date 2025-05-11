"use client";

import { motion } from "framer-motion";
import {
  Check,
  X,
  AlertTriangle,
  Info,
  MapPin,
  Tag,
  Barcode,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProductStore } from "@/lib/store";
import { SaveResultButton } from "@/components/save-result-button";
import { cn } from "@/lib/utils";

export default function ResultsDisplay() {
  const { productData } = useProductStore();

  if (!productData) return null;

  const {
    productName,
    madeInIndia,
    ingredients,
    boycottedBrands,
    gtin,
    gtinCountry,
    ethicalInsights,
    extractedText,
    timestamp,
  } = productData;

  // Determine which Indian indicators were found
  const lowerText = (extractedText || "").toLowerCase();
  const containsMadeInIndia =
    lowerText.includes("made in india") ||
    lowerText.includes("product of india") ||
    lowerText.includes("manufactured in india");

  const gtinIndicatesIndia = gtin?.startsWith("890") || false;

  const indianBrands = [
    "amul",
    "parle",
    "britannia",
    "haldiram",
    "tata",
    "dabur",
    "patanjali",
    "mother dairy",
  ];
  const foundIndianBrands = indianBrands.filter((brand) =>
    lowerText.includes(brand)
  );

  // Format timestamp if available
  const formattedTime = timestamp ? new Date(timestamp).toLocaleString() : null;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Main Result Card */}
        <Card
          className={cn(
            "overflow-hidden col-span-1 md:col-span-2 shadow-lg border-2",
            madeInIndia
              ? "border-green-500 dark:border-green-700"
              : "border-red-500 dark:border-red-700"
          )}
        >
          <CardHeader
            className={cn(
              "bg-gradient-to-r",
              madeInIndia
                ? "from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20"
                : "from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20"
            )}
          >
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                {madeInIndia ? (
                  <>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50">
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <span>Made in India</span>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/50">
                      <X className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <span>Not Made in India</span>
                  </>
                )}
              </CardTitle>
              <SaveResultButton />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {productName && (
                <div>
                  <h3 className="text-xl font-semibold">{productName}</h3>
                </div>
              )}

              {/* Origin Analysis */}
              <div
                className={cn(
                  "p-4 rounded-lg",
                  madeInIndia
                    ? "bg-green-50 dark:bg-green-950/20"
                    : "bg-red-50 dark:bg-red-950/20"
                )}
              >
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> Origin Analysis
                </h4>
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      madeInIndia ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <span className="font-medium">
                    {madeInIndia ? "Made in India" : "Not Made in India"}
                  </span>
                </div>

                {/* Detected Indian indicators */}
                <div className="mt-3 text-sm space-y-1">
                  {containsMadeInIndia && (
                    <div className="flex items-center gap-1">
                      <Check className="h-3 w-3 text-green-500" />
                      <span>Found "Made in India" text</span>
                    </div>
                  )}

                  {gtinIndicatesIndia && (
                    <div className="flex items-center gap-1">
                      <Check className="h-3 w-3 text-green-500" />
                      <span>GTIN/Barcode indicates India (890 prefix)</span>
                    </div>
                  )}

                  {foundIndianBrands.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Check className="h-3 w-3 text-green-500" />
                      <span>
                        Found Indian brand: {foundIndianBrands.join(", ")}
                      </span>
                    </div>
                  )}

                  {gtinCountry && (
                    <div className="text-sm">
                      <span className="font-medium">GTIN Origin:</span>{" "}
                      {gtinCountry}
                    </div>
                  )}
                </div>
              </div>

              {/* Analysis Timestamp */}
              {formattedTime && (
                <div className="text-xs text-gray-500 flex items-center mt-2">
                  <Clock className="h-3 w-3 mr-1" />
                  Analyzed on: {formattedTime}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Ingredients Card */}
        <Card className="overflow-hidden shadow-md">
          <CardHeader className="bg-blue-50 dark:bg-blue-950/20">
            <CardTitle className="text-base flex items-center gap-2">
              <Tag className="h-4 w-4" /> Ingredients
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {ingredients && ingredients.length > 0 ? (
                ingredients.map((ing, index) => (
                  <Badge
                    key={index}
                    variant={ing.madeInIndia ? "default" : "destructive"}
                    className="animate-fadeIn"
                  >
                    {ing.name}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No ingredients detected
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Boycott List Card */}
        <Card className="overflow-hidden shadow-md">
          <CardHeader className="bg-amber-50 dark:bg-amber-950/20">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" /> Boycott List
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {boycottedBrands && boycottedBrands.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {boycottedBrands.map((brand, index) => (
                  <Badge
                    key={index}
                    variant="destructive"
                    className="animate-fadeIn"
                  >
                    {brand}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No boycotted brands detected
              </p>
            )}
          </CardContent>
        </Card>

        {/* GTIN Card */}
        {gtin && (
          <Card className="overflow-hidden shadow-md">
            <CardHeader className="bg-purple-50 dark:bg-purple-950/20">
              <CardTitle className="text-base flex items-center gap-2">
                <Barcode className="h-4 w-4" /> GTIN/Barcode
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm font-mono">{gtin}</p>
              {gtinCountry && (
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{gtinCountry}</span>
                </div>
              )}
              {gtin?.startsWith("890") && (
                <div className="mt-2 text-xs p-1 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 rounded">
                  <Check className="h-3 w-3 inline mr-1" />
                  <span>890 prefix indicates product from India</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Ethical Insights Card */}
        {ethicalInsights && (
          <Card className="overflow-hidden shadow-md col-span-1 md:col-span-2">
            <CardHeader className="bg-teal-50 dark:bg-teal-950/20">
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="h-4 w-4" /> Ethical Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm">{ethicalInsights}</p>
            </CardContent>
          </Card>
        )}

        {/* Extracted Text Card */}
        <Card className="overflow-hidden shadow-md col-span-1 md:col-span-2">
          <CardHeader className="bg-gray-50 dark:bg-gray-800/20">
            <CardTitle className="text-base">Extracted Text</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="max-h-40 overflow-y-auto text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line p-2 bg-gray-50 dark:bg-gray-900/50 rounded border border-gray-200 dark:border-gray-700">
              {extractedText || "No text extracted"}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
