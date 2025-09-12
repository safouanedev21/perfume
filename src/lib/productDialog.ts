type EditHandler = (product: any) => void;

let handler: EditHandler | null = null;
const queue: any[] = [];

export function registerProductDialogHandler(h: EditHandler | null) {
  handler = h;
  // Flush queued calls when handler becomes available
  if (handler) {
    while (queue.length > 0) {
      const p = queue.shift();
      try {
        handler(p);
      } catch (e) {
        // swallow handler errors to avoid blocking flush
        // but log for visibility
        // eslint-disable-next-line no-console
        console.error('Error invoking product dialog handler during flush:', e);
      }
    }
  }
}

export function openEditDialog(product: any) {
  if (!handler) {
    // queue the request so it will open as soon as the dialog registers
    queue.push(product);
    return;
  }
  handler(product);
}
