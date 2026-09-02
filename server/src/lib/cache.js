/**
 * TTL cache with "last known good" fallback: if the loader throws and a stale
 * value exists, the stale value is returned instead of propagating the error.
 */
export class Cache {
  #entries = new Map();
  #inflight = new Map();

  async get(key, ttlMs, loader) {
    const entry = this.#entries.get(key);
    const now = Date.now();

    if (entry && now - entry.at < ttlMs) return { data: entry.data, stale: false };

    if (this.#inflight.has(key)) return this.#inflight.get(key);

    const promise = (async () => {
      try {
        const data = await loader();
        this.#entries.set(key, { data, at: Date.now() });
        return { data, stale: false };
      } catch (err) {
        if (entry) return { data: entry.data, stale: true, error: err };
        throw err;
      } finally {
        this.#inflight.delete(key);
      }
    })();

    this.#inflight.set(key, promise);
    return promise;
  }
}

export const cache = new Cache();

export const TTL = {
  STANDINGS: 10 * 60 * 1000,
  SCHEDULE: 30 * 60 * 1000,
  SESSION: 60 * 1000,
  DRIVERS: 5 * 60 * 1000,
  LIVE: 4 * 1000,
  WEATHER: 30 * 1000,
};
