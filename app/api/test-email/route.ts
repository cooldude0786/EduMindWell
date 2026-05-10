import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/mail";

export async function GET() {
    let result ;
  try {
    result = await sendEmail({
      to: process.env.EMAIL_USER!,
      subject: "Test Email",
      html: `
        <div>
          <h1>Email Working</h1>
          <p>Nodemailer is configured correctly.</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      result
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
       result
      },
      {
        status: 500,
      }
    );
  }
}