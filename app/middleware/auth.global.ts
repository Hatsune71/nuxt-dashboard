export default defineNuxtRouteMiddleware(async (to) => {
  const { status, data: session } = useAuth();

  if (status.value === 'unauthenticated') {
    if (to.path !== '/login' && to.path !== '/register') {
      return navigateTo('/login');
    }
  }

  if (status.value === 'authenticated' && to.path === '/') {
    return navigateTo('/dashboard');
  }
});
