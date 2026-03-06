import dayjs from "dayjs";
import { formatSegments, fromDateInputValue, parseSegmentsInput, toDateInputValue } from "./utils";

describe("Settings utils", () => {
  test("parseSegmentsInput trims and drops empty segments", () => {
    expect(parseSegmentsInput("a, b,  ,c,, ")).toEqual(["a", "b", "c"]);
  });

  test("formatSegments joins segments with comma+space", () => {
    expect(formatSegments(["alpha", "beta"]))
      .toBe("alpha, beta");
  });

  test("toDateInputValue returns dayjs instance or null", () => {
    expect(toDateInputValue("2024-10-01T10:00:00.000Z")?.isValid()).toBe(true);
    expect(toDateInputValue(null)).toBeNull();
  });

  test("fromDateInputValue returns ISO or null", () => {
    const date = dayjs("2024-10-01T10:00:00.000Z");
    expect(fromDateInputValue(date)).toBe("2024-10-01T10:00:00.000Z");
    expect(fromDateInputValue(null)).toBeNull();
  });
});
