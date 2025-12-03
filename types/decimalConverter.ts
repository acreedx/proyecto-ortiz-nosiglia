export default function formatNumber({ value }: { value: number }): number {
  return Number((value / 100).toFixed(2));
}
