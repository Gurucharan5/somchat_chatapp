let readQueue: Promise<void> = Promise.resolve();

export function queueRead<T>(fn: () => Promise<T>): Promise<T> {
  const next = readQueue.then(fn);
  readQueue = next.then(
    () => undefined,
    () => undefined
  );
  return next;
}
