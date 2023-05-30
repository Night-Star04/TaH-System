import { NextRequest, NextResponse } from "next/server";

import { UUID, getQuery } from "@/util";
import { IsExistDevice, AddDevice, GetDeviceInfo } from "@/tool/db";

async function GET(req: NextRequest) {
  const { id } = getQuery(req);

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

export { GET };
