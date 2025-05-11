import type { Metadata } from "next";
import ProductAnalyzer from "@/components/product-analyzer";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Product Origin Analyzer",
  description:
    "Analyze product images to determine origin and ethical insights",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">Product Origin Analyzer</h1>
          <p className="text-pink-500/50">
            This only works If u upload Back side of Product ImG
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Upload a Back Side Of product image to analyze if it's{" "}
            <span
              className="text-orange-500 
             font-bold underline"
            >
              Made In India{" "}
            </span>
            or Not!
          </p>
        </div>

        {/* Responsive layout */}
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-center gap-6">
          {/* Left Image */}
          <div className="flex flex-col items-center space-y-2 order-2 lg:order-1">
            <span className="text-red-600 font-semibold flex items-center gap-1">
              ❌ Wrong Way
            </span>
            <div className="w-[180px] h-[300px] overflow-hidden rounded-lg shadow-md hover:scale-105 hover:shadow-xl transition-all duration-300">
              <Image
                src="/fortune.webp"
                alt="Right Product"
                width={80}
                height={300}
                className="object-cover h-full w-full"
                priority
              />
            </div>
          </div>

          {/* Main Component */}
          <div className="w-full max-w-2xl order-1 lg:order-2">
            <ProductAnalyzer />
          </div>

          {/* Right Image */}
          <div className="flex flex-col items-center space-y-2 order-3">
            <span className="text-green-500 font-semibold flex items-center gap-1">
              ✅ Right Way
            </span>
            <div className="w-[180px] h-[300px] overflow-hidden rounded-lg shadow-md hover:scale-105 hover:shadow-xl transition-all duration-300">
              <Image
                src="/example-product.webp"
                alt="Wrong Product"
                width={80}
                height={300}
                className="object-cover h-full w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
