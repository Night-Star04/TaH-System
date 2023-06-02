import { NextRequest, NextResponse } from "next/server";

import { GetDeviceInfo } from "@/tool/db";

async function GET(_req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;

  const data = GetDeviceInfo({ uid: id });

  if (!data) {
    return new NextResponse("device not found", {
      status: 404,
    });
  }

  return NextResponse.json(data, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

export { GET };
