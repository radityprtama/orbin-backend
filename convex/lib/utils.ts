export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

export function generateToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const DEFAULT_RETRY_POLICY = {
  maxAttempts: 3,
  backoffCoefficient: 2,
  initialInterval: 1000,
  maxInterval: 60000,
};

export const PLAN_LIMITS: Record<string, number> = {
  free: 1000,
  pro: 10000,
  business: 100000,
  enterprise: 1000000,
};
