import { type NextRequest, NextResponse } from "next/server";

import { getQuery } from "@/util";
import { GetRecordList } from "@/tool/db";

async function GET(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;
  const { limit } = getQuery(req);

  let list = GetRecordList(id).reverse();

  if (limit) {
    const num = Number(limit);
    if (isNaN(num))
      return new NextResponse("limit is not a number", { status: 400 });
    if (num < 1)
      return new NextResponse("limit must be greater than 0", { status: 400 });
    if (num % 1 !== 0)
      return new NextResponse("limit must be an integer", { status: 400 });

    list = list.slice(0, Number(limit));
  }

  return NextResponse.json(list, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

export { GET };
