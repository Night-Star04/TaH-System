import { type NextRequest, NextResponse } from "next/server";

import type { DeviceData } from "@/interface/db";
import { GetDeviceList } from "@/tool/db";

async function GET(_req: NextRequest) {
  const list = GetDeviceList();

  const data = list.map<DeviceData>((v) => {
    const { uid, name } = v;
    return { uid, name };
  });

  return NextResponse.json(data);
}

export { GET };
