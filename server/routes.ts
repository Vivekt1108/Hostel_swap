import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStudentSchema, insertSwapRequestSchema, insertMessageSchema, loginSchema } from "@shared/schema";
import { z } from "zod";

// Simple session storage for authentication
const sessions = new Map<string, { studentId: number; expires: Date }>();

// Middleware to check authentication
const requireAuth = (req: any, res: any, next: any) => {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  if (!sessionId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const session = sessions.get(sessionId);
  if (!session || session.expires < new Date()) {
    sessions.delete(sessionId);
    return res.status(401).json({ message: "Session expired" });
  }

  req.studentId = session.studentId;
  next();
};

// Generate session ID
const generateSessionId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const data = loginSchema.parse(req.body);
      const student = await storage.getStudentByStudentId(data.studentId);
      
      if (!student || student.password !== data.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const sessionId = generateSessionId();
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      sessions.set(sessionId, { studentId: student.id, expires });

      res.json({ 
        sessionId, 
        student: { 
          id: student.id, 
          studentId: student.studentId, 
          name: student.name, 
          email: student.email 
        } 
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = insertStudentSchema.parse(req.body);
      
      // Check if student already exists
      const existingStudent = await storage.getStudentByStudentId(data.studentId);
      if (existingStudent) {
        return res.status(400).json({ message: "Student ID already exists" });
      }

      const existingEmail = await storage.getStudentByEmail(data.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const student = await storage.createStudent(data);
      res.json({ 
        student: { 
          id: student.id, 
          studentId: student.studentId, 
          name: student.name, 
          email: student.email 
        } 
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/logout", requireAuth, (req, res) => {
    const sessionId = req.headers.authorization?.replace('Bearer ', '');
    if (sessionId) {
      sessions.delete(sessionId);
    }
    res.json({ message: "Logged out successfully" });
  });

  // Student routes
  app.get("/api/students/me", requireAuth, async (req, res) => {
    try {
      const student = await storage.getStudent(req.studentId);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      // Get room and hostel details
      let roomDetails = null;
      if (student.currentRoomId) {
        const room = await storage.getRoom(student.currentRoomId);
        if (room) {
          const hostel = await storage.getHostel(room.hostelId);
          roomDetails = { ...room, hostel };
        }
      }

      // Get roommate details
      let roommateDetails = null;
      if (student.currentRoommateId) {
        roommateDetails = await storage.getStudent(student.currentRoommateId);
      }

      res.json({ 
        ...student, 
        password: undefined,
        roomDetails,
        roommateDetails 
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/students/me", requireAuth, async (req, res) => {
    try {
      const updates = req.body;
      delete updates.id;
      delete updates.studentId;
      delete updates.email;
      
      const student = await storage.updateStudent(req.studentId, updates);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      res.json({ ...student, password: undefined });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Hostel and room routes
  app.get("/api/hostels", async (req, res) => {
    try {
      const hostels = await storage.getHostels();
      res.json(hostels);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/rooms", async (req, res) => {
    try {
      const { hostelId } = req.query;
      let rooms;
      
      if (hostelId) {
        rooms = await storage.getRoomsByHostel(parseInt(hostelId as string));
      } else {
        rooms = await storage.getRooms();
      }
      
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Swap request routes
  app.get("/api/swap-requests", requireAuth, async (req, res) => {
    try {
      const myRequests = await storage.getSwapRequestsByStudent(req.studentId);
      const incomingRequests = await storage.getIncomingSwapRequests(req.studentId);
      
      // Add student details to requests
      const requestsWithDetails = await Promise.all([
        ...myRequests.map(async (request) => {
          const targetStudent = request.targetStudentId ? await storage.getStudent(request.targetStudentId) : null;
          return { ...request, targetStudent, type: 'outgoing' };
        }),
        ...incomingRequests.map(async (request) => {
          const requester = await storage.getStudent(request.requesterId);
          return { ...request, requester, type: 'incoming' };
        })
      ]);

      res.json(requestsWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/swap-requests", requireAuth, async (req, res) => {
    try {
      const data = insertSwapRequestSchema.parse({
        ...req.body,
        requesterId: req.studentId
      });
      
      const request = await storage.createSwapRequest(data);
      res.json(request);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.put("/api/swap-requests/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const request = await storage.updateSwapRequest(id, updates);
      if (!request) {
        return res.status(404).json({ message: "Swap request not found" });
      }

      res.json(request);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Available swaps route
  app.get("/api/available-swaps", requireAuth, async (req, res) => {
    try {
      const currentStudent = await storage.getStudent(req.studentId);
      if (!currentStudent) {
        return res.status(404).json({ message: "Student not found" });
      }

      const studentsLookingToSwap = await storage.getStudentsLookingToSwap();
      const availableSwaps = studentsLookingToSwap.filter(s => s.id !== req.studentId);

      // Add room and hostel details
      const swapsWithDetails = await Promise.all(
        availableSwaps.map(async (student) => {
          let roomDetails = null;
          if (student.currentRoomId) {
            const room = await storage.getRoom(student.currentRoomId);
            if (room) {
              const hostel = await storage.getHostel(room.hostelId);
              roomDetails = { ...room, hostel };
            }
          }
          return { 
            ...student, 
            password: undefined,
            roomDetails 
          };
        })
      );

      res.json(swapsWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Messages routes
  app.get("/api/messages", requireAuth, async (req, res) => {
    try {
      const { otherStudentId } = req.query;
      
      if (otherStudentId) {
        const messages = await storage.getMessagesBetweenStudents(
          req.studentId, 
          parseInt(otherStudentId as string)
        );
        res.json(messages);
      } else {
        const messages = await storage.getMessagesForStudent(req.studentId);
        res.json(messages);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/messages", requireAuth, async (req, res) => {
    try {
      const data = insertMessageSchema.parse({
        ...req.body,
        senderId: req.studentId
      });
      
      const message = await storage.createMessage(data);
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}