import crypto from "crypto";

function getQuery(req: Request): { [key: string]: string } {
  const { searchParams } = new URL(req.url);
  const query: { [key: string]: string } = {};
  searchParams.forEach((value, name) => {
    query[name] = value;
  });

  return query;
}

function UUID(len?: number): string {
  if (len) {
    const chars =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
        ""
      );
    const uid: Array<string> = [];

    for (let i = 0; i < len; i++)
      uid[i] = chars[0 | Math.floor(Math.random() * chars.length)];

    return uid.join("");
  }

  return crypto.randomUUID();
}

async function fetcher_json<T = any>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(async (res) => {
        try {
          if (!res.ok || res.status >= 400 || res.status < 200)
            reject(new Error("Failed to fetch data"));
          resolve(await res.json());
        } catch (e) {
          reject(e);
        }
      })
      .catch((e) => reject(e));
  });
}

export { getQuery, UUID, fetcher_json };
