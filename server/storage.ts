import {
  hostels,
  rooms,
  students,
  swapRequests,
  swapChains,
  messages,
  type Hostel,
  type Room,
  type Student,
  type SwapRequest,
  type SwapChain,
  type Message,
  type InsertHostel,
  type InsertRoom,
  type InsertStudent,
  type InsertSwapRequest,
  type InsertMessage,
} from "@shared/schema";

export interface IStorage {
  // Hostels
  getHostels(): Promise<Hostel[]>;
  getHostel(id: number): Promise<Hostel | undefined>;
  createHostel(hostel: InsertHostel): Promise<Hostel>;

  // Rooms
  getRooms(): Promise<Room[]>;
  getRoomsByHostel(hostelId: number): Promise<Room[]>;
  getRoom(id: number): Promise<Room | undefined>;
  createRoom(room: InsertRoom): Promise<Room>;

  // Students
  getStudents(): Promise<Student[]>;
  getStudent(id: number): Promise<Student | undefined>;
  getStudentByStudentId(studentId: string): Promise<Student | undefined>;
  getStudentByEmail(email: string): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: number, updates: Partial<Student>): Promise<Student | undefined>;
  getStudentsLookingToSwap(): Promise<Student[]>;
  getStudentsByRoom(roomId: number): Promise<Student[]>;

  // Swap Requests
  getSwapRequests(): Promise<SwapRequest[]>;
  getSwapRequest(id: number): Promise<SwapRequest | undefined>;
  getSwapRequestsByStudent(studentId: number): Promise<SwapRequest[]>;
  getIncomingSwapRequests(studentId: number): Promise<SwapRequest[]>;
  createSwapRequest(request: InsertSwapRequest): Promise<SwapRequest>;
  updateSwapRequest(id: number, updates: Partial<SwapRequest>): Promise<SwapRequest | undefined>;

  // Messages
  getMessages(): Promise<Message[]>;
  getMessagesBetweenStudents(student1Id: number, student2Id: number): Promise<Message[]>;
  getMessagesForStudent(studentId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private hostels: Map<number, Hostel> = new Map();
  private rooms: Map<number, Room> = new Map();
  private students: Map<number, Student> = new Map();
  private swapRequests: Map<number, SwapRequest> = new Map();
  private swapChains: Map<number, SwapChain> = new Map();
  private messages: Map<number, Message> = new Map();
  
  private currentHostelId = 1;
  private currentRoomId = 1;
  private currentStudentId = 1;
  private currentSwapRequestId = 1;
  private currentSwapChainId = 1;
  private currentMessageId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create hostels
    const hostelA = this.createHostelSync({ name: "Hostel A", description: "Main hostel block" });
    const hostelB = this.createHostelSync({ name: "Hostel B", description: "Second block" });
    const hostelC = this.createHostelSync({ name: "Hostel C", description: "Third block" });
    const hostelD = this.createHostelSync({ name: "Hostel D", description: "Fourth block" });

    // Create rooms for each hostel
    for (let i = 1; i <= 3; i++) {
      for (let j = 1; j <= 10; j++) {
        const roomNumber = `${String.fromCharCode(64 + i)}-${i}${j.toString().padStart(2, '0')}`;
        this.createRoomSync({ hostelId: i, roomNumber, capacity: 2, floor: Math.ceil(j / 3) });
      }
    }

    // Create sample students
    const sampleStudents = [
      { studentId: "CS21B047", name: "Rahul Sharma", email: "rahul@example.com", password: "password123", currentRoomId: 1 },
      { studentId: "CS21B023", name: "Amit Kumar", email: "amit@example.com", password: "password123", currentRoomId: 1 },
      { studentId: "CS21B089", name: "Priya Kashyap", email: "priya@example.com", password: "password123", currentRoomId: 15, isLookingToSwap: true },
      { studentId: "CS21B012", name: "Arjun Joshi", email: "arjun@example.com", password: "password123", currentRoomId: 25, isLookingToSwap: true },
      { studentId: "CS21B092", name: "Sneha Kapoor", email: "sneha@example.com", password: "password123", currentRoomId: 35, isLookingToSwap: true },
      { studentId: "CS21B078", name: "Rohit Gupta", email: "rohit@example.com", password: "password123", currentRoomId: 16, isLookingToSwap: true },
    ];

    sampleStudents.forEach(student => {
      const created = this.createStudentSync(student);
      // Set roommates
      if (student.currentRoomId === 1) {
        this.updateStudentSync(created.id, { 
          currentRoommateId: student.studentId === "CS21B047" ? 2 : 1,
          preferences: "Non-smoking environment, Quiet study hours, Early sleeper (10 PM)"
        });
      }
    });
  }

  private createHostelSync(hostel: InsertHostel): Hostel {
    const id = this.currentHostelId++;
    const newHostel: Hostel = { id, ...hostel };
    this.hostels.set(id, newHostel);
    return newHostel;
  }

  private createRoomSync(room: InsertRoom): Room {
    const id = this.currentRoomId++;
    const newRoom: Room = { id, ...room };
    this.rooms.set(id, newRoom);
    return newRoom;
  }

  private createStudentSync(student: InsertStudent & { currentRoomId?: number }): Student {
    const id = this.currentStudentId++;
    const newStudent: Student = {
      id,
      ...student,
      currentRoomId: student.currentRoomId || null,
      currentRoommateId: null,
      preferences: student.preferences || null,
      isLookingToSwap: student.isLookingToSwap || false,
    };
    this.students.set(id, newStudent);
    return newStudent;
  }

  private updateStudentSync(id: number, updates: Partial<Student>): Student | undefined {
    const student = this.students.get(id);
    if (!student) return undefined;
    
    const updated = { ...student, ...updates };
    this.students.set(id, updated);
    return updated;
  }

  // Hostels
  async getHostels(): Promise<Hostel[]> {
    return Array.from(this.hostels.values());
  }

  async getHostel(id: number): Promise<Hostel | undefined> {
    return this.hostels.get(id);
  }

  async createHostel(hostel: InsertHostel): Promise<Hostel> {
    return this.createHostelSync(hostel);
  }

  // Rooms
  async getRooms(): Promise<Room[]> {
    return Array.from(this.rooms.values());
  }

  async getRoomsByHostel(hostelId: number): Promise<Room[]> {
    return Array.from(this.rooms.values()).filter(room => room.hostelId === hostelId);
  }

  async getRoom(id: number): Promise<Room | undefined> {
    return this.rooms.get(id);
  }

  async createRoom(room: InsertRoom): Promise<Room> {
    return this.createRoomSync(room);
  }

  // Students
  async getStudents(): Promise<Student[]> {
    return Array.from(this.students.values());
  }

  async getStudent(id: number): Promise<Student | undefined> {
    return this.students.get(id);
  }

  async getStudentByStudentId(studentId: string): Promise<Student | undefined> {
    return Array.from(this.students.values()).find(s => s.studentId === studentId);
  }

  async getStudentByEmail(email: string): Promise<Student | undefined> {
    return Array.from(this.students.values()).find(s => s.email === email);
  }

  async createStudent(student: InsertStudent): Promise<Student> {
    return this.createStudentSync(student);
  }

  async updateStudent(id: number, updates: Partial<Student>): Promise<Student | undefined> {
    return this.updateStudentSync(id, updates);
  }

  async getStudentsLookingToSwap(): Promise<Student[]> {
    return Array.from(this.students.values()).filter(s => s.isLookingToSwap);
  }

  async getStudentsByRoom(roomId: number): Promise<Student[]> {
    return Array.from(this.students.values()).filter(s => s.currentRoomId === roomId);
  }

  // Swap Requests
  async getSwapRequests(): Promise<SwapRequest[]> {
    return Array.from(this.swapRequests.values());
  }

  async getSwapRequest(id: number): Promise<SwapRequest | undefined> {
    return this.swapRequests.get(id);
  }

  async getSwapRequestsByStudent(studentId: number): Promise<SwapRequest[]> {
    return Array.from(this.swapRequests.values()).filter(r => r.requesterId === studentId);
  }

  async getIncomingSwapRequests(studentId: number): Promise<SwapRequest[]> {
    return Array.from(this.swapRequests.values()).filter(r => r.targetStudentId === studentId);
  }

  async createSwapRequest(request: InsertSwapRequest): Promise<SwapRequest> {
    const id = this.currentSwapRequestId++;
    const now = new Date();
    const newRequest: SwapRequest = {
      id,
      ...request,
      createdAt: now,
      updatedAt: now,
    };
    this.swapRequests.set(id, newRequest);
    return newRequest;
  }

  async updateSwapRequest(id: number, updates: Partial<SwapRequest>): Promise<SwapRequest | undefined> {
    const request = this.swapRequests.get(id);
    if (!request) return undefined;
    
    const updated = { ...request, ...updates, updatedAt: new Date() };
    this.swapRequests.set(id, updated);
    return updated;
  }

  // Messages
  async getMessages(): Promise<Message[]> {
    return Array.from(this.messages.values());
  }

  async getMessagesBetweenStudents(student1Id: number, student2Id: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(m => 
      (m.senderId === student1Id && m.receiverId === student2Id) ||
      (m.senderId === student2Id && m.receiverId === student1Id)
    ).sort((a, b) => a.createdAt!.getTime() - b.createdAt!.getTime());
  }

  async getMessagesForStudent(studentId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(m => 
      m.senderId === studentId || m.receiverId === studentId
    );
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const newMessage: Message = {
      id,
      ...message,
      isRead: false,
      createdAt: new Date(),
    };
    this.messages.set(id, newMessage);
    return newMessage;
  }

  async markMessageAsRead(id: number): Promise<void> {
    const message = this.messages.get(id);
    if (message) {
      this.messages.set(id, { ...message, isRead: true });
    }
  }
}

export const storage = new MemStorage();
