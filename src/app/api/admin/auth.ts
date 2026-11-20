export function checkAdminAuth(request: Request): boolean {
  return request.headers.get('x-admin-key') === 'AFAdmin2026!';
}
