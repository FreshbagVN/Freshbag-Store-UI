import { createClient } from "@supabase/supabase-js";

// Khóa công khai (publishable): chỉ đọc được dữ liệu cho phép bởi RLS. Không dùng secret key ở đây.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  { auth: { persistSession: false } },
);
