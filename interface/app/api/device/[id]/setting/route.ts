import { NextRequest, NextResponse } from "next/server";
import { FormDataToJSON } from "@/util";
import { DeviceData, ScopeType } from "@/interface/db";
import { EditDevice, GetDeviceInfo } from "@/tool/db";

async function POST(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;

  let data = GetDeviceInfo({ uid: id });
  if (!data) {
    return new NextResponse("device not found", {
      status: 404,
    });
  }

  const regex = /multipart\/form-data; boundary=(.*)/;
  if (!regex.test(req.headers.get("content-type") || "")) {
    return new NextResponse("Method Not Allowed", {
      status: 405,
    });
  }

  const formData = await req.formData();
  const { name, scope } = FormDataToJSON(formData).fields;
  if (!name && !scope) {
    return new NextResponse("bad request", {
      status: 400,
    });
  }

  try {
    const scope_json: ScopeType = JSON.parse(scope);
    const { t, h } = scope_json || {};

    if (t) {
      const { max, min } = t;
      if (max && (typeof max !== "number" || isNaN(max))) {
        return new NextResponse("bad request", {
          status: 400,
        });
      }
      if (min && (typeof min !== "number" || isNaN(min))) {
        return new NextResponse("bad request", {
          status: 400,
        });
      }
      if (max && min && max < min) {
        return new NextResponse("bad request", {
          status: 400,
        });
      }
    }

    if (h) {
      const { max, min } = h;
      if (max && (typeof max !== "number" || isNaN(max))) {
        return new NextResponse("bad request", {
          status: 400,
        });
      }
      if (min && (typeof min !== "number" || isNaN(min))) {
        return new NextResponse("bad request", {
          status: 400,
        });
      }
      if (max && min && (max > 100 || min < 0 || max < min)) {
        return new NextResponse("bad request", {
          status: 400,
        });
      }
    }

    data = {
      ...data,
      name: name || data.name,
      scope: {
        // ...data.scope,
        t: t || data.scope?.t,
        h: h || data.scope?.h,
      },
    };
    EditDevice(id, data);

    return new NextResponse("ok", {
      status: 200,
    });
  } catch (e) {
    console.error(e);
    return new NextResponse("Server Error", {
      status: 500,
    });
  }
}

export { POST };
