/**
 * RBAC & Security Tests
 * Authority: D18
 */

import { hasPermission, maskSensitiveFields, validateProductionEnvironment, AuthContext } from '../../packages/shared/src/guards/rbac';

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(`ASSERTION FAILED: ${message}`);
}

function testUserCanOnlyAccessOwnData() {
  const user: AuthContext = { userId: 'u1', orgId: 'org1', role: 'USER', email: 'test@test.com' };
  
  // Own org data
  assert(hasPermission(user, 'task', 'read', 'org1'), 'User should read own tasks');
  assert(hasPermission(user, 'asset', 'write', 'org1'), 'User should write own assets');
  
  // Other org data
  assert(!hasPermission(user, 'task', 'read', 'org2'), 'User must NOT read other org tasks');
  assert(!hasPermission(user, 'asset', 'write', 'org2'), 'User must NOT write other org assets');
}

function testAdminCanReadAll() {
  const admin: AuthContext = { userId: 'a1', orgId: 'org_admin', role: 'ADMIN', email: 'admin@test.com' };
  
  assert(hasPermission(admin, 'task', 'read'), 'Admin should read all tasks');
  assert(hasPermission(admin, 'user', 'read'), 'Admin should read all users');
  assert(hasPermission(admin, 'billing', 'admin'), 'Admin should have billing admin');
  assert(hasPermission(admin, 'review', 'write'), 'Admin should write reviews');
}

function testUserCannotAccessAdmin() {
  const user: AuthContext = { userId: 'u1', orgId: 'org1', role: 'USER', email: 'test@test.com' };
  
  assert(!hasPermission(user, 'review', 'write'), 'User must NOT write reviews');
  assert(!hasPermission(user, 'complaint', 'write'), 'User must NOT process complaints');
  assert(!hasPermission(user, 'audit', 'read'), 'User must NOT read audit logs');
}

function testDataMasking() {
  const data = {
    id: 'u1',
    email: 'john@example.com',
    passwordHash: 'bcrypt_hash_xxx',
    ipAddress: '192.168.1.1',
    displayName: 'John',
  };
  
  // Admin sees masked sensitive fields
  const adminView = maskSensitiveFields(data, 'ADMIN');
  assert(adminView.displayName === 'John', 'Non-sensitive fields should be visible');
  assert(adminView.passwordHash === '***MASKED***', 'Password hash must be masked');
  assert(adminView.ipAddress === '***MASKED***', 'IP must be masked');
  assert(adminView.email.includes('***'), 'Email must be partially masked');
  
  // Super admin sees everything
  const superView = maskSensitiveFields(data, 'SUPER_ADMIN');
  assert(superView.passwordHash === 'bcrypt_hash_xxx', 'Super admin sees all');
}

function testProductionEnvironmentValidation() {
  // Simulate production with bad config
  const originalEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  process.env.FEATURE_MOCK_AI = 'true';
  process.env.JWT_SECRET = 'dev-jwt-secret-change-in-production';
  
  const result = validateProductionEnvironment();
  assert(!result.safe, 'Production with mock AI should be unsafe');
  assert(result.issues.length >= 2, 'Should detect multiple issues');
  
  // Restore
  process.env.NODE_ENV = originalEnv;
  delete process.env.FEATURE_MOCK_AI;
  delete process.env.JWT_SECRET;
}

// Run all tests
testUserCanOnlyAccessOwnData();
testAdminCanReadAll();
testUserCannotAccessAdmin();
testDataMasking();
testProductionEnvironmentValidation();
console.log('All security/RBAC tests passed! (5/5)');
