// Transitional boundary: retain existing business handlers under native Nest routes.
export function invoke(handlers: any[], req: any, res: any): Promise<void> {
  return new Promise((resolve, reject) => {
    res.once("finish", resolve);
    res.once("close", resolve);
    let index = 0;
    const next = (error?: unknown) => {
      if (error) {
        reject(error);
        return;
      }
      const handler = handlers[index++];
      if (!handler) {
        resolve();
        return;
      }
      try {
        Promise.resolve(handler(req, res, next)).catch(reject);
      } catch (error) {
        reject(error);
      }
    };
    next();
  });
}
