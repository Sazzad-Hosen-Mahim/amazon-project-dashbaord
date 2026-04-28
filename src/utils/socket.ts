import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

// Extract base URL (origin only) for Socket.IO - it doesn't need the /api/v1 path
const getSocketUrl = () => {
    // Use separate socket URL if defined, otherwise extract origin from API URL
    if (import.meta.env.VITE_SOCKET_URL) {
        return import.meta.env.VITE_SOCKET_URL;
    }

    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    try {
        const url = new URL(apiUrl);
        return url.origin;
    } catch {
        return apiUrl;
    }
};

// Store listeners to attach when socket connects/reconnects
type Listener = { event: string; fn: (...args: any[]) => void };
let listeners: Listener[] = [];

export const addSocketListener = (event: string, fn: (...args: any[]) => void) => {
    // Avoid adding duplicates
    const exists = listeners.some(l => l.event === event && l.fn === fn);
    if (!exists) {
        listeners.push({ event, fn });
        if (socket) {
            socket.on(event, fn);
        }
    }
};

export const removeSocketListener = (event: string, fn: (...args: any[]) => void) => {
    listeners = listeners.filter(l => l.event !== event || l.fn !== fn);
    if (socket) {
        socket.off(event, fn);
    }
};

export const connectSocket = (token: string) => {
    if (socket?.connected) return; // Already connected

    const socketUrl = getSocketUrl();
    console.log("Connecting to socket at:", socketUrl);

    socket = io(socketUrl, {
        auth: {
            token: `Bearer ${token}` // Try adding Bearer prefix 
        },
        // Some backends check 'authorization' in extraHeaders or handshake.headers
        extraHeaders: {
            Authorization: `Bearer ${token}`
        },
        transports: ["websocket", "polling"],
    });

    // Attach pending listeners
    listeners.forEach(({ event, fn }) => {
        socket!.on(event, fn);
    });

    // Debug: Log all incoming events
    socket.onAny((event, ...args) => {
        console.log(`[Socket Debug] Event: ${event}`, args);
    });

    socket.on("connect", () => {
        console.log("🟢 Socket connected");
    });
    socket.on("disconnect", () => {
        console.log("🔴 Socket disconnected");
    });
    socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error.message);
    });
};
export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
        console.log("🔴 Socket manually disconnected");
    }
};
export const getSocket = () => socket;
