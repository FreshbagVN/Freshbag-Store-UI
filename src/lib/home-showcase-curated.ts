export type CuratedShowcaseItem = {
  item_id: number;
  sku_image: string;
};

/**
 * 27 sản phẩm trang chủ đã duyệt trực quan: 100% ảnh SKU nền trắng/xám studio sạch,
 * phối đa dạng màu sắc và kiểu dáng (balo, túi đeo chéo, túi du lịch, túi tote)
 * cho carousel 3 cột × 3 hàng (3 trang mượt mà).
 */
export const HOME_CURATED_SHOWCASE: readonly CuratedShowcaseItem[] = [
  // Trang 1 (9 sản phẩm)
  { item_id: 29655421704, sku_image: "https://cf.shopee.vn/file/sg-11134201-7rdwg-md1hx4r2w8r200" }, // Kem - Balo 9985
  { item_id: 49266973580, sku_image: "https://cf.shopee.vn/file/sg-11134201-825am-msgisl7kvs3qe3" }, // Hồng - Balo 1055
  { item_id: 44086486704, sku_image: "https://cf.shopee.vn/file/sg-11134201-8258s-mv1f5w6znqbq94" }, // Nâu Đất - Túi đeo chéo U03
  { item_id: 26805599717, sku_image: "https://cf.shopee.vn/file/sg-11134201-81zws-mip7xpxo8d1d88" }, // Nâu Kem - Balo 9726
  { item_id: 47956789969, sku_image: "https://cf.shopee.vn/file/sg-11134201-82614-mlg2zzg3mexbeb" }, // Xám - Túi du lịch 5551
  { item_id: 55504737550, sku_image: "https://cf.shopee.vn/file/sg-11134201-8262d-mjifjtm25s7b0b" }, // Kem - Balo 9013
  { item_id: 26636191933, sku_image: "https://cf.shopee.vn/file/sg-11134201-81zwe-mipcwkntul8j51" }, // Navy - Balo laptop HW2722
  { item_id: 19467470861, sku_image: "https://cf.shopee.vn/file/sg-11134201-8257z-mthxrmwz668765" }, // Be - Túi đeo chéo N020
  { item_id: 42811947714, sku_image: "https://cf.shopee.vn/file/vn-11134207-81ztc-msc973zzj6roe7" }, // Xanh lá pastel - Balo 9976

  // Trang 2 (9 sản phẩm)
  { item_id: 40535190755, sku_image: "https://cf.shopee.vn/file/sg-11134201-8258n-mubv5g5k000709" }, // Vàng cát - Túi trống 34335
  { item_id: 46719412080, sku_image: "https://cf.shopee.vn/file/sg-11134201-82595-muesg0fozj7u28" }, // Hồng pastel - Balo 2763
  { item_id: 22755741598, sku_image: "https://cf.shopee.vn/file/sg-11134201-820l9-mnqp2flrihhh6f" }, // Đen điểm nhấn - Balo M2655
  { item_id: 40714981795, sku_image: "https://cf.shopee.vn/file/sg-11134201-7rep9-mdu0vee6hst5a9" }, // Kaki - Balo 9010
  { item_id: 46269292633, sku_image: "https://cf.shopee.vn/file/sg-11134201-8257t-mubroc7hz9j75b" }, // Xám - Túi thể thao 34338
  { item_id: 57921940981, sku_image: "https://cf.shopee.vn/file/sg-11134201-825b4-mvsr6m0a16a231" }, // Tím kem - Balo 0953
  { item_id: 56012354480, sku_image: "https://cf.shopee.vn/file/sg-11134201-824hg-mpkk6ik7pibx83" }, // Xám xanh - Túi du lịch 832
  { item_id: 25863787734, sku_image: "https://cf.shopee.vn/file/vn-11134207-7ras8-m3kclqfrj2qwb4" }, // Khaki - Balo 9676
  { item_id: 29694897714, sku_image: "https://cf.shopee.vn/file/sg-11134201-823qg-monuginll0r17a" }, // Trắng kem - Balo A807

  // Trang 3 (9 sản phẩm)
  { item_id: 23000677410, sku_image: "https://cf.shopee.vn/file/sg-11134201-8259s-ms5dhuz0u6f80b" }, // Nâu trắng - Balo 0152
  { item_id: 44519192436, sku_image: "https://cf.shopee.vn/file/sg-11134201-8259m-mu944ydjgc1uf1" }, // Hồng nơ - Balo 1093
  { item_id: 29129977788, sku_image: "https://cf.shopee.vn/file/sg-11134201-82589-mubqprfsw35zcb" }, // Đen điểm nhấn - Túi đeo chéo nam 7109
  { item_id: 26735366304, sku_image: "https://cf.shopee.vn/file/sg-11134201-82588-msaueah2hx546a" }, // Kaki sáng - Balo 9839
  { item_id: 15693449375, sku_image: "https://cf.shopee.vn/file/sg-11134201-8258s-mt4tlt3ydj42ab" }, // Caro tím - Túi tote M822
  { item_id: 23680196337, sku_image: "https://cf.shopee.vn/file/sg-11134201-8259p-mqyk625btwcn34" }, // Xám nhạt - Balo laptop 2010
  { item_id: 52019268632, sku_image: "https://cf.shopee.vn/file/sg-11134201-82585-mtrxtl5i2osi0b" }, // Nâu - Túi du lịch 8818
  { item_id: 26103870739, sku_image: "https://cf.shopee.vn/file/sg-11134201-8259c-msau5xwk9a820f" }, // Tím pastel - Balo 9731
  { item_id: 51771562264, sku_image: "https://cf.shopee.vn/file/sg-11134201-825ax-mvfi7461x1qe55" }, // Hồng kem - Balo A805
];
