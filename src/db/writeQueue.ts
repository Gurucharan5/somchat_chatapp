let queue: Promise<void> = Promise.resolve();

export function queueWrite(fn: () => Promise<any>): Promise<void> {
  queue = queue.then(() => fn()).catch((err) => {
    console.error("DB Write Error:", err);
  });

  return queue;
}
