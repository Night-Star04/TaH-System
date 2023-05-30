import { type NextRequest, NextResponse } from "next/server";

import { UUID, getQuery } from "@/util";
import { AddRecord, IsExistDevice } from "@/tool/db";

async function GET(req: NextRequest, context: { params: { id: string } }) {
  const { id: uid } = context.params;

  const { h, t } = getQuery(req);

  if (!h || !t || !uid || !IsExistDevice({ uid })) {
    return new NextResponse("bad request", {
      status: 400,
    });
  }

  const temp = Number(t);
  const humi = Number(h);

  if (isNaN(temp) || isNaN(humi) || humi < 0 || humi > 100) {
    return new NextResponse("bad request", {
      status: 400,
    });
  }

  AddRecord(uid, { uid: UUID(), h: humi, t: temp, time: Date.now() });

  return new NextResponse("ok", {
    status: 200,
  });
}

export { GET };
