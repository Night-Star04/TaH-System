import { NextRequest, NextResponse } from "next/server";

import { UUID } from "@/util";
import { IsExistDevice, AddDevice, GetDeviceInfo } from "@/tool/db";

async function POST(req: NextRequest) {
  const { headers } = req;
  if (headers.get("content-type") !== "application/json") {
    return new NextResponse("Method Not Allowed", {
      status: 405,
    });
  }

  const { id } = await req.json();
  const reg = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/gm;

  if (!id || !reg.test(id)) {
    return new NextResponse("bad request", {
      status: 400,
    });
  }

  if (IsExistDevice({ mac: id })) {
    return new NextResponse(GetDeviceInfo({ mac: id })?.uid, {
      status: 200,
    });
  }

  const uid = UUID(8);
  AddDevice({ mac: id, uid });

  return new NextResponse(uid, {
    status: 200,
  });
}

export { POST };
