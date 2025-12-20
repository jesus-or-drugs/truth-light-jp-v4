import { createError, getRouterParam } from "h3";
import { readFile } from "fs/promises";
import { join } from "path";

export default defineEventHandler(
  async (event) => {
    const id = getRouterParam(event, "id");

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing substance id",
      });
    }

    const jsonFilePath = join(
      process.cwd(),
      "content",
      "substances",
      `${id}.json`
    );

    try {
      const raw = await readFile(jsonFilePath, "utf-8");
      return JSON.parse(raw);
    } catch {
      throw createError({
        statusCode: 404,
        statusMessage: `Substance not found: ${id}`,
      });
    }
  }
);
