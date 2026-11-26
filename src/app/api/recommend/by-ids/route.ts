import { NextResponse, type NextRequest } from "next/server";
import { getProductsByIds } from "@/lib/recommend";

const MAX_IDS = 20;

const BASE_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow",
  "Cache-Control": "no-store",
};

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("ids");
  if (!raw || !raw.trim()) {
    return NextResponse.json(
      { error: "Thiếu danh sách ids" },
      { status: 400, headers: BASE_HEADERS },
    );
  }

  const parts = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    return NextResponse.json(
      { error: "Danh sách ids trống" },
      { status: 400, headers: BASE_HEADERS },
    );
  }

  if (parts.length > MAX_IDS) {
    return NextResponse.json(
      { error: `Tối đa ${MAX_IDS} mã sản phẩm mỗi lần gọi` },
      { status: 400, headers: BASE_HEADERS },
    );
  }

  const ids: number[] = [];
  const seen = new Set<number>();
  for (const part of parts) {
    if (!/^[1-9]\d*$/.test(part)) {
      return NextResponse.json(
        { error: "Danh sách ids chứa giá trị không hợp lệ" },
        { status: 400, headers: BASE_HEADERS },
      );
    }
    const num = Number(part);
    if (!Number.isSafeInteger(num)) {
      return NextResponse.json(
        { error: "Danh sách ids chứa giá trị vượt giới hạn" },
        { status: 400, headers: BASE_HEADERS },
      );
    }
    if (!seen.has(num)) {
      seen.add(num);
      ids.push(num);
    }
  }

  const items = await getProductsByIds(ids);

  return NextResponse.json(
    { items },
    {
      status: 200,
      headers: BASE_HEADERS,
    },
  );
}
