import { NextRequest, NextResponse } from "next/server";

import { getQuery } from "@/util";
import { AddRecord, IsExistDevice } from "@/tool/db";

async function GET(req: NextRequest) {
  const { h, t, id: uid } = getQuery(req);

  if (!h || !t || !uid || !IsExistDevice({ uid })) {
    return new NextResponse("bad request", {
      status: 400,
    });
  }

  AddRecord(uid, { h, t, time: new Date().getTime() });

  return new NextResponse("ok", {
    status: 200,
  });
}

export { GET };
