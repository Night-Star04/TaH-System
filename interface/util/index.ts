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

export { getQuery, UUID };
