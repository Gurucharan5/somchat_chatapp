type Callback = () => void;

let subscribers: Callback[] = [];

export function subscribeUserUpdates(cb: Callback) {
  subscribers.push(cb);
  return () => {
    subscribers = subscribers.filter(x => x !== cb);
  };
}

export function emitUserUpdated() {
  subscribers.forEach(cb => cb());
}
