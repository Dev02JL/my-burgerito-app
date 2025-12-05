import { expect, it, describe } from '@jest/globals';

describe('API Session Routes', () => {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://node-eemi.vercel.app';

  it('should have API base URL configured', () => {
    expect(API_BASE).toBeDefined();
    expect(typeof API_BASE).toBe('string');
    expect(API_BASE.length).toBeGreaterThan(0);
  });

  it('should validate API base URL format', () => {
    expect(API_BASE).toMatch(/^https?:\/\//);
  });

  it('should have correct API endpoint structure', () => {
    const endpoints = {
      login: `${API_BASE}/api/session/login`,
      register: `${API_BASE}/api/session/register`,
      me: `${API_BASE}/api/session/me`,
    };

    expect(endpoints.login).toContain('/api/session/login');
    expect(endpoints.register).toContain('/api/session/register');
    expect(endpoints.me).toContain('/api/session/me');
  });
});
