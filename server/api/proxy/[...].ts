import { getToken } from '#auth';

const { public: { apiBaseUrl } } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const sessionToken = await getToken({ event });

  if (!sessionToken || !sessionToken.jwt) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthenticated' });
  }

  const headers = {
    'Authorization': `Bearer ${sessionToken.jwt}`,
    'x-api-key': process.env.API_KEY,
  };
  
  const path = event.path.replace(/^\/api\/proxy\//, '');
  const targetUrl = `${apiBaseUrl}/${path}`;

  try {
    const response = await $fetch.raw(targetUrl, {
      method: event.method,
      headers,
      body: event.method !== 'GET' ? await readBody(event) : undefined,
    });
    return response._data;
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status,
      statusMessage: error.data?.message || 'Error fetching from backend API',
    });
  }
});