import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "../app.js";
import cors from "cors";
import morgan from "morgan";
// Load environment variables
dotenv.config({ path: "./config.env" });

// MongoDB connection
mongoose
  .connect(process.env.CONN_STR as string)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Create the HTTP server and attach it to the app instance
const httpServer = createServer(app);

// Set up Socket.IO server with CORS
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// In-memory session data
let users = [];
let liveSessions = [];
app.use(cors());
app.use(morgan("combined"));
// Endpoint to view live sessions
app.get("/live-sessions", (req, res) => {
  console.log("Live Session Working");
  res.json({ liveSessions });
});
// Middleware for authenticating Socket.IO users
io.use((socket, next) => {
  const { callerId } = socket.handshake.query;
  if (callerId) {
    socket.data.user = callerId;
    next();
  } else {
    console.log("No caller ID found");
    next(new Error("No caller ID found"));
  }
});

// Handle Socket.IO connections and events
io.on("connection", (socket) => {
  const userId = socket.data.user;
  console.log("User connected:", userId);

  socket.join(userId);

  // Notify the user about existing live sessions
  io.to(userId).emit("live-sessions", { liveSessions });

  // Start a live session
  socket.on("start-live", ({ sessionName }) => {
    console.log(`${userId} started a live session: ${sessionName}`);
    const session = { hostId: userId, sessionName };
    liveSessions.push(session);
    io.emit("new-live-session", session);
  });

  // Handle other socket events (e.g., joining live, ICE candidates)
  socket.on("join-live", ({ hostId }) => {
    console.log(`${userId} is joining the live session hosted by ${hostId}`);
    io.to(hostId).emit("incoming-viewer", { viewerId: userId });
  });

  socket.on("offer", ({ to, offer }) => {
    console.log(`Offer from ${userId} to ${to}`);
    io.to(to).emit("offer", { from: userId, offer });
  });

  socket.on("answer", ({ to, answer }) => {
    console.log(`Answer from ${userId} to ${to}`);
    io.to(to).emit("answer", { from: userId, answer });
  });

  socket.on("ice-candidate", ({ to, candidate }) => {
    console.log(`ICE Candidate from ${userId} to ${to}`);
    io.to(to).emit("ice-candidate", { from: userId, candidate });
  });
  // end video call
  socket.on("end-vdo", () => {

    liveSessions = liveSessions.filter((session) => session.hostId !== userId);

    console.log("vdo call ended by ", userId);
    // io.to(userId).emit("live-sessions", { liveSessions });
    io.emit("live-session-ended", { hostId: userId });
  });

  // Handle disconnection and update live sessions
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${userId}`);
    liveSessions = liveSessions.filter((session) => session.hostId !== userId);
    io.emit("live-session-ended", { hostId: userId });
  });
});

// Start the server on the configured port
const PORT = process.env.PORT || 10000;
httpServer.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
