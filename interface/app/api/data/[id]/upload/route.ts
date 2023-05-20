import { type NextRequest, NextResponse } from "next/server";

import { getQuery } from "@/util";
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

  AddRecord(uid, { h: humi, t: temp, time: new Date().getTime() });

  return new NextResponse("ok", {
    status: 200,
  });
}

export { GET };
