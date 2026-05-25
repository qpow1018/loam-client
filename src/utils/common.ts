export function isClient(): boolean {
  return typeof window !== 'undefined';
}

export function waitFor(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}
