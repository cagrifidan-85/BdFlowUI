import dayjs, { Dayjs } from "dayjs";

export const parseSegmentsInput = (value: string) =>
  value
    .split(',')
    .map((segment) => segment.trim())
    .filter(Boolean);

export const formatSegments = (segments: string[] = []) => segments.join(', ');

export const toDateInputValue = (value?: string | null): Dayjs | null => (value ? dayjs(value) : null);

export const fromDateInputValue = (value: Dayjs | null) => (value ? value.toISOString() : null);
