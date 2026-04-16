"use client";

import { useState, use } from "react";
import Link from "next/link";
import { ChevronLeft, SlidersHorizontal } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import productsData from "@/data/products.json";

interface Persona {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  productCount: number;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  currency: string;
  persona: string;
  image: string;
  affiliateUrl: string;
  tags: string[];
  description: string;
}

interface Filter {
  id: string;
  label: string;
}

const personas: Persona[] = productsData.personas;
const allProducts: Product[] = productsData.products;
const filters: Filter[] = productsData.filters;

export default function PersonaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [activeFilter, setActiveFilter] = useState("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const persona = personas.find((p) => p.id === id);
  const products = allProducts.filter((p) => p.persona === id);

  const filteredProducts =
    activeFilter === "all"
      ? products
      : products.filter((p) => p.tags.includes(activeFilter));

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setDrawerOpen(true);

    // Track product view
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "product_view",
        productId: product.id,
        persona: product.persona,
      }),
    });
  };

  const handleBuyClick = (product: Product) => {
    // Redirect through tracking API
    const trackUrl = `/api/track?url=${encodeURIComponent(product.affiliateUrl)}&productId=${product.id}&persona=${product.persona}`;
    window.open(trackUrl, "_blank");
  };

  if (!persona) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg text-[#666666]">Persona not found</p>
        <Link
          href="/"
          className="mt-4 text-[#1B4332] underline underline-offset-4"
        >
          Go back home
        </Link>
      </div>
    );
  }

  const personaIndex = personas.findIndex((p) => p.id === id) + 1;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-2 pt-5">
        <Link href="/" className="flex items-center gap-2">
          <ChevronLeft className="w-[18px] h-[18px] text-[#111111]" />
          <span className="text-[11px] font-semibold tracking-[2.4px] text-[#111111]">
            PERSONAS
          </span>
        </Link>
        <span className="text-[10px] font-medium tracking-[2px] text-[#666666]">
          — EDIT 0{personaIndex} —
        </span>
        <SlidersHorizontal className="w-[18px] h-[18px] text-[#111111]" />
      </header>

      {/* Divider */}
      <div className="h-px bg-[#E7E8E5] w-full" />

      {/* Masthead */}
      <section className="px-6 pt-12 pb-6 flex flex-col gap-4">
        <span className="text-[10px] font-semibold tracking-[3px] text-[#1B4332]">
          {persona.name.toUpperCase().replace("THE ", "")} · {products.length}{" "}
          PICKS
        </span>
        <h1 className="font-serif text-[36px] italic font-normal leading-[1.1] text-[#111111]">
          {persona.tagline.split(" ").slice(0, 2).join("\n")}
          <br />
          {persona.tagline.split(" ").slice(2).join(" ")}
        </h1>
        <p className="text-[13px] font-normal leading-[1.6] text-[#666666]">
          {persona.description}
        </p>
      </section>

      {/* Filter Chips */}
      <div className="flex gap-2 px-6 py-4 overflow-x-auto">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-[14px] py-2 rounded-full text-[12px] whitespace-nowrap transition-colors ${
              activeFilter === filter.id
                ? "bg-[#111111] text-white font-medium"
                : "border border-[#CBCCC9] text-[#111111]"
            }`}
          >
            {filter.id === "all"
              ? `All ${products.length}`
              : filter.label}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <section className="px-6 pb-8">
        <div className="grid grid-cols-2 gap-x-[14px] gap-y-8">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="text-left group"
            >
              <div className="w-full aspect-[165/205] bg-[#F2F3F0] rounded-lg mb-2 group-hover:bg-[#E7E8E5] transition-colors" />
              <h3 className="font-serif text-lg leading-tight">
                {product.name}
              </h3>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[12px] text-[#666666]">
                  {product.brand}
                </span>
                <span className="text-[12px] font-medium">
                  {formatPrice(product.price)}
                </span>
              </div>
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#666666]">
              No products match this filter yet.
            </p>
          </div>
        )}
      </section>

      {/* Grid Footer */}
      {filteredProducts.length > 0 && (
        <section className="flex flex-col items-center gap-5 px-6 py-10">
          <div className="w-10 h-px bg-[#111111]" />
          <span className="text-[10px] font-semibold tracking-[3px] text-[#111111]">
            {products.length - filteredProducts.length > 0
              ? `${products.length - filteredProducts.length} MORE OBJECTS BELOW`
              : "YOU'VE SEEN IT ALL"}
          </span>
          <p className="font-serif text-base italic text-[#666666]">
            Keep scrolling, or refine by price.
          </p>
        </section>
      )}

      {/* Product Drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="max-h-[85vh]">
          {selectedProduct && (
            <>
              <DrawerHeader className="text-left">
                <div className="text-[10px] font-medium tracking-[2px] text-[#666666] mb-2">
                  MAMTA&apos;S CHOICE · FOR THE{" "}
                  {persona.name.toUpperCase().replace("THE ", "")}
                </div>
                <DrawerTitle className="font-serif text-2xl">
                  {selectedProduct.name}
                </DrawerTitle>
                <DrawerDescription>
                  {selectedProduct.description}
                </DrawerDescription>
              </DrawerHeader>

              <div className="px-4 pb-4 flex flex-col gap-4">
                {/* Product image placeholder */}
                <div className="w-full h-[300px] bg-[#F2F3F0] rounded-lg" />

                {/* Product details */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#666666]">
                      {selectedProduct.brand}
                    </p>
                    <p className="text-lg font-medium">
                      {formatPrice(selectedProduct.price)}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap justify-end">
                    {selectedProduct.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs rounded-full border border-[#CBCCC9] text-[#666666]"
                      >
                        {tag === "under-2k"
                          ? "Under 2k"
                          : tag === "ships-48h"
                            ? "Ships in 48h"
                            : tag.charAt(0).toUpperCase() + tag.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Buy button */}
                <Button
                  onClick={() => handleBuyClick(selectedProduct)}
                  className="w-full h-12 bg-[#111111] hover:bg-[#333333] text-white rounded-full font-medium"
                >
                  Buy Now · {formatPrice(selectedProduct.price)}
                </Button>
              </div>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
