"use client";

import { useEffect } from "react";
import { addRecentlyViewed } from "@/lib/recently-viewed";

/** Component client ghi nhận sản phẩm đã xem vào localStorage, không render giao diện. */
export function TrackRecentlyViewed({ productId }: { productId: number }) {
  useEffect(() => {
    addRecentlyViewed(productId);
  }, [productId]);

  return null;
}
