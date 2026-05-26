/**
 * RBAC Guard - Role-Based Access Control
 * Authority: D18 (Security/Privacy)
 *
 * Roles: USER, ADMIN, SUPER_ADMIN
 * Principles:
 * 1. Users can only access their own org's data
 * 2. Admins can read all, write with audit
 * 3. All admin writes MUST be audited
 * 4. Sensitive fields MUST be masked for non-owners
 */

export type Role = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

export interface AuthContext {
  userId: string;
  orgId: string;
  role: Role;
  email: string;
}

export interface Permission {
  resource: string;
  action: 'read' | 'write' | 'delete' | 'admin';
  ownOnly: boolean;
}

// --- Role permissions matrix ---
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  USER: [
    { resource: 'profile', action: 'read', ownOnly: true },
    { resource: 'profile', action: 'write', ownOnly: true },
    { resource: 'task', action: 'read', ownOnly: true },
    { resource: 'task', action: 'write', ownOnly: true },
    { resource: 'asset', action: 'read', ownOnly: true },
    { resource: 'asset', action: 'write', ownOnly: true },
    { resource: 'billing', action: 'read', ownOnly: true },
    { resource: 'report', action: 'read', ownOnly: true },
    { resource: 'export', action: 'read', ownOnly: true },
    { resource: 'export', action: 'write', ownOnly: true },
    { resource: 'feedback', action: 'write', ownOnly: true },
  ],
  ADMIN: [
    { resource: 'task', action: 'read', ownOnly: false },
    { resource: 'task', action: 'admin', ownOnly: false },
    { resource: 'user', action: 'read', ownOnly: false },
    { resource: 'billing', action: 'read', ownOnly: false },
    { resource: 'billing', action: 'admin', ownOnly: false },
    { resource: 'risk', action: 'read', ownOnly: false },
    { resource: 'risk', action: 'admin', ownOnly: false },
    { resource: 'review', action: 'read', ownOnly: false },
    { resource: 'review', action: 'write', ownOnly: false },
    { resource: 'complaint', action: 'read', ownOnly: false },
    { resource: 'complaint', action: 'write', ownOnly: false },
    { resource: 'audit', action: 'read', ownOnly: false },
    { resource: 'cost', action: 'read', ownOnly: false },
  ],
  SUPER_ADMIN: [
    { resource: '*', action: 'read', ownOnly: false },
    { resource: '*', action: 'write', ownOnly: false },
    { resource: '*', action: 'delete', ownOnly: false },
    { resource: '*', action: 'admin', ownOnly: false },
  ],
};

/**
 * Check if a user has permission to perform an action.
 */
export function hasPermission(
  auth: AuthContext,
  resource: string,
  action: Permission['action'],
  resourceOrgId?: string,
): boolean {
  const permissions = ROLE_PERMISSIONS[auth.role] || [];

  for (const perm of permissions) {
    if (perm.resource !== '*' && perm.resource !== resource) continue;
    if (perm.action !== action && perm.resource !== '*') continue;
    if (perm.ownOnly && resourceOrgId && resourceOrgId !== auth.orgId) continue;
    return true;
  }

  return false;
}

/**
 * Mask sensitive fields for non-owner access.
 * Per D18: Admin can see masked version, not raw data.
 */
export function maskSensitiveFields(data: Record<string, any>, viewerRole: Role): Record<string, any> {
  const sensitiveFields = ['passwordHash', 'ipAddress', 'userAgent', 'email'];
  
  if (viewerRole === 'SUPER_ADMIN') return data;

  const masked = { ...data };
  for (const field of sensitiveFields) {
    if (field in masked) {
      if (field === 'email' && viewerRole === 'ADMIN') {
        // Admins see partial email
        const email = masked[field] as string;
        const [local, domain] = email.split('@');
        masked[field] = `${local.slice(0, 2)}***@${domain}`;
      } else if (viewerRole === 'ADMIN') {
        masked[field] = '***MASKED***';
      }
    }
  }
  return masked;
}

/**
 * Validate environment for production safety.
 * Per D23: Production MUST NOT have mock providers enabled.
 */
export function validateProductionEnvironment(): { safe: boolean; issues: string[] } {
  const issues: string[] = [];
  const env = process.env;

  if (env.NODE_ENV === 'production') {
    if (env.FEATURE_MOCK_AI === 'true') {
      issues.push('CRITICAL: FEATURE_MOCK_AI=true in production');
    }
    if (env.OPENAI_API_KEY?.startsWith('sk-placeholder')) {
      issues.push('CRITICAL: Placeholder API key in production');
    }
    if (env.JWT_SECRET === 'dev-jwt-secret-change-in-production') {
      issues.push('CRITICAL: Default JWT secret in production');
    }
    if (env.DATABASE_URL?.includes('postgres_dev_password')) {
      issues.push('CRITICAL: Dev database password in production');
    }
  }

  return { safe: issues.length === 0, issues };
}
