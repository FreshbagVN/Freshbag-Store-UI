import { NextResponse, type NextRequest } from "next/server";
import { getSimilarProducts } from "@/lib/recommend";

const BASE_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow",
};

function parsePositiveInt(raw: string | null): number | null {
  if (!raw || !/^[1-9]\d*$/.test(raw)) return null;
  const num = Number(raw);
  return Number.isSafeInteger(num) ? num : null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = parsePositiveInt(searchParams.get("id"));
  if (id == null) {
    return NextResponse.json(
      { error: "Tham số id không hợp lệ" },
      { status: 400, headers: { ...BASE_HEADERS, "Cache-Control": "no-store" } },
    );
  }

  const rawLimit = searchParams.get("limit");
  let limit = 12;
  if (rawLimit != null) {
    const parsedLimit = parsePositiveInt(rawLimit);
    if (parsedLimit == null) {
      return NextResponse.json(
        { error: "Tham số limit không hợp lệ" },
        { status: 400, headers: { ...BASE_HEADERS, "Cache-Control": "no-store" } },
      );
    }
    limit = Math.min(24, parsedLimit);
  }

  const items = await getSimilarProducts(id, limit);

  return NextResponse.json(
    { items },
    {
      status: 200,
      headers: {
        ...BASE_HEADERS,
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    },
  );
}
