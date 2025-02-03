import { withAuth } from "@/lib/withAuth";
import { Resend } from "resend";
import { type NextRequest, NextResponse } from "next/server";
import { ApiKeyEmailTemplate } from "@/emails/api-key";

const resend = new Resend(process.env.RESEND_API_KEY);

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const { to, apiKey } = await request.json();

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "",
      to: [to],
      subject: "Your API Key for Namespace Offchain Manager API",
      react: ApiKeyEmailTemplate({ apiKey }),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
});
