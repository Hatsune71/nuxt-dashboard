export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, email, password } = body;

  if (!email || !password || !name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Nama, email, dan password wajib diisi.',
    });
  }
const headers = {
    'x-api-key': process.env.API_KEY,
  };
  const config = useRuntimeConfig();
  const backendApiUrl = `${config.public.apiBaseUrl}/auth/register`;

  try {
    const response = await $fetch(backendApiUrl, {
      method: 'POST',
      headers,
      body: {
        name,
        email,
        password,
      },
    });

    return response;
    
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.data?.message || 'Terjadi kesalahan pada server.',
    });
  }
});