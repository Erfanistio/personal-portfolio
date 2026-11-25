import { NextResponse } from "next/server";
import { z } from "zod";
import { deliverContact } from "@/lib/contact";

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(254),
  company: z.string().max(120).optional(),
  budget: z.string().max(80).optional(),
  message: z.string().min(10).max(5000),
  website: z.string().max(200).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, message: "Invalid input. Check the form and try again." },
        { status: 400 },
      );
    }

    // Honeypot: if the hidden field is filled, drop silently but return 200.
    if (parsed.data.website) {
      return NextResponse.json(
        { ok: true, message: "Thanks. I will get back to you shortly." },
        { status: 200 },
      );
    }

    const result = await deliverContact({
      name: parsed.data.name,
      email: parsed.data.email,
      company: parsed.data.company ?? "",
      budget: parsed.data.budget ?? "",
      message: parsed.data.message,
    });

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, message: result.detail ?? "Could not deliver. Please email directly." },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { ok: true, message: "Thanks. I will get back to you shortly." },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { ok: false, message: "Malformed request." },
      { status: 400 },
    );
  }
}