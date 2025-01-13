import { describe, expect, it } from "vitest";
import { delay } from "#utils/wait.js";

describe("delay function", () => {
  it("should resolve after the specified time", async () => {
    const ms = 250;
    const start = Date.now();

    await delay(ms);

    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(ms);
  });
});
