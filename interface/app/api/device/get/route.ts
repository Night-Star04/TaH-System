import { type NextRequest, NextResponse } from "next/server";

import type { DeviceData } from "@/interface/db";
import { GetDeviceList } from "@/tool/db";

const revalidate = 10;

async function GET(_req: NextRequest) {
  const list = GetDeviceList();

  const data = list.map<DeviceData>((v) => {
    const { uid, name, scope } = v;
    return { uid, name, scope };
  });

  return NextResponse.json(data, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

export { GET, revalidate };
