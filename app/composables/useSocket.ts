import { io, type Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const useSocket = () => {
  // Inisialisasi socket hanya sekali
  if (!socket && process.client) {
    const runtimeConfig = useRuntimeConfig();
    const SERVER_URL = runtimeConfig.public.backendUrl || 'http://localhost:3001';
    
    socket = io(SERVER_URL, {
      autoConnect: true,
      transports: ['websocket'],
    });
  }

  // Fungsi ini sekarang secara otomatis mendapatkan userId dari sesi
  const joinUserRoom = () => {
    // Panggil useAuth() di sini, di dalam fungsi composable
    const { data: session } = useAuth();
    const userId = session.value?.user?.id;
    
    if (socket && userId) {
      socket.emit('join_user_room', userId);
    } else {
      console.warn('Tidak bisa bergabung ke room socket: userId tidak ditemukan.');
    }
  };

  const leaveUserRoom = () => {
    const { data: session } = useAuth();
    const userId = session.value?.user?.id;
    if (socket && userId) {
      // Implementasi di server jika diperlukan
      // socket.emit('leave_user_room', userId);
    }
  };

  return { socket, joinUserRoom, leaveUserRoom };
};