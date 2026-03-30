import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // ✅ NO autoConnect: false

export default socket;