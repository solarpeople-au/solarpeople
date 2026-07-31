import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

type QuotePayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  postcode?: string;
  interest?: string;
  message?: string;
};

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    return NextResponse.json(
      { error: "Quote submissions are not connected yet." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as QuotePayload;
  const enquiry = {
    first_name: clean(body.firstName, 80),
    last_name: clean(body.lastName, 80),
    email: clean(body.email, 160).toLowerCase(),
    phone: clean(body.phone, 40),
    postcode: clean(body.postcode, 10),
    interest: clean(body.interest, 80),
    message: clean(body.message, 2000) || null,
    source: "website",
  };

  if (
    !enquiry.first_name ||
    !enquiry.last_name ||
    !enquiry.email ||
    !enquiry.phone ||
    !enquiry.postcode ||
    !enquiry.interest
  ) {
    return NextResponse.json(
      { error: "Please complete all required fields." },
      { status: 400 },
    );
  }

  const supabase = createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error } = await supabase.from("quote_enquiries").insert(enquiry);

  if (error) {
    console.error("Quote enquiry insert failed", error.code);
    return NextResponse.json(
      { error: "We could not save your enquiry. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
