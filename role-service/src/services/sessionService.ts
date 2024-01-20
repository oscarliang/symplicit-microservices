import { createClient } from 'redis';

export class SessionService {
  private client;
  private ttl: number;

  constructor() {
    console.log('Before client.connect()...');
    this.client = createClient({
      url: `redis://${process.env.REDIS_URL}`,
    });
  }

  async createConnection() {
    await this.client.connect();
    console.log('After client.connect()...');
    console.log(
      `client.isOpen: ${this.client.isOpen}, client.isReady: ${this.client.isReady}`,
    );
  }

  async closeConnection() {
    this.client.quit();
  }

  // [2] generic function, takes `fetcher` argument which is meant to refresh the cache
  async getFromCache<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    // [3] if we're not connected to redis, bypass cache
    if (!this.client.isReady) {
      return await fetcher();
    }

    return new Promise<T>(async (resolve, reject) => {
      try {
        const value = await this.client.get(key);
        if (value) {
          // [4] if value is found in cache, return it
          return resolve(JSON.parse(value));
        }
      } catch (err) {
        if (err) return reject(err);
      }

      const result = await fetcher();
      try {
        await this.client.set(key, JSON.stringify(result), 'EX', this.ttl);
        return resolve(result);
      } catch (err) {
        if (err) return reject(err);
      }
    });
  }

  // [6]
  del(key: string) {
    this.client.del(key);
  }

  async get<T>(key: string): Promise<T> {
    return this.client.get(key);
  }

  async set<T>(key: string, value: string): Promise<T> {
    return this.client.set(key, value);
  }
}
