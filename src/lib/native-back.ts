type BackHandler = () => boolean;
const handlers: BackHandler[] = [];

export function registerBackHandler(handler: BackHandler) {
  handlers.push(handler);
  return () => {
    const index = handlers.indexOf(handler);
    if (index >= 0) handlers.splice(index, 1);
  };
}
export function handleNativeBack() {
  // Nested screens get first refusal; returning false delegates to the parent.
  for (const handler of [...handlers].reverse()) if (handler()) return true;
  return false;
}
