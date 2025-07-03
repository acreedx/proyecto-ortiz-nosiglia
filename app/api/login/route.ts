import { NextRequest, NextResponse } from "next/server";
import { validateUserLogin } from "../../../lib/nextauth/validateUser";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const user = await validateUserLogin(body);
    return NextResponse.json(user);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}
