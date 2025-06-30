import { students, messages, type Student, type InsertStudent, type Message, type InsertMessage, users, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  // User methods (keeping from original)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Student methods
  getStudents(): Promise<Student[]>;
  getStudent(id: number): Promise<Student | undefined>;
  getStudentsByGrade(grade: number): Promise<Student[]>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: number, student: Partial<InsertStudent>): Promise<Student | undefined>;
  deleteStudent(id: number): Promise<boolean>;
  searchStudents(query: string): Promise<Student[]>;
  
  // Message methods
  getMessages(): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  updateMessageStatus(id: number, status: string): Promise<Message | undefined>;
}



// Permanent student data stored in code as JSON array format
const PERMANENT_STUDENTS_DATA: Student[] = [
  {
    id: 1,
    name: "Arjun Mehta",
    grade: 10,
    phone: "+919876543210",
    studentId: "STU001",
    notes: "Excellent student, very active in sports.",
    createdAt: new Date("2025-01-01T00:00:00Z")
  },
  {
    id: 2,
    name: "Priya Sharma",
    grade: 8,
    phone: "+918765432109",
    studentId: "STU002",
    notes: "Good in mathematics",
    createdAt: new Date("2025-01-01T00:00:00Z")
  },
  {
    id: 3,
    name: "Rahul Kumar",
    grade: 12,
    phone: "+917654321098",
    studentId: "STU003",
    notes: "Preparing for entrance exams",
    createdAt: new Date("2025-01-01T00:00:00Z")
  },
  {
    id: 4,
    name: "Sneha Patel",
    grade: 6,
    phone: "+916543210987",
    studentId: "STU004",
    notes: "Creative and artistic",
    createdAt: new Date("2025-01-01T00:00:00Z")
  },
  {
    id: 5,
    name: "Vikash Gupta",
    grade: 9,
    phone: "+915432109876",
    studentId: "STU005",
    notes: "Good in science subjects",
    createdAt: new Date("2025-01-01T00:00:00Z")
  },
  {
    id: 6,
    name: "Ananya Singh",
    grade: 11,
    phone: "+919123456789",
    studentId: "STU006",
    notes: "Strong leadership skills",
    createdAt: new Date("2025-01-01T00:00:00Z")
  },
  {
    id: 7,
    name: "Karan Joshi",
    grade: 7,
    phone: "+918234567890",
    studentId: "STU007",
    notes: "Talented in music and arts",
    createdAt: new Date("2025-01-01T00:00:00Z")
  },
  {
    id: 8,
    name: "Meera Reddy",
    grade: 9,
    phone: "+917345678901",
    studentId: "STU008",
    notes: "Excellent in science competitions",
    createdAt: new Date("2025-01-01T00:00:00Z")
  },
  {
    id: 9,
    name: "Rohan Agarwal",
    grade: 10,
    phone: "+916456789012",
    studentId: "STU009",
    notes: "Future engineer, loves robotics",
    createdAt: new Date("2025-01-01T00:00:00Z")
  },
  {
    id: 10,
    name: "Ishita Bansal",
    grade: 8,
    phone: "+915567890123",
    studentId: "STU010",
    notes: "Creative writer and debater",
    createdAt: new Date("2025-01-01T00:00:00Z")
  }
];

export class PermanentMemStorage implements IStorage {
  private users: Map<number, User>;
  private students: Map<number, Student>;
  private messages: Map<number, Message>;
  private currentUserId: number;
  private currentStudentId: number;
  private currentMessageId: number;

  constructor() {
    this.users = new Map();
    this.students = new Map();
    this.messages = new Map();
    this.currentUserId = 1;
    this.currentStudentId = 11; // Start from 11 since we have 10 permanent students
    this.currentMessageId = 1;
    
    this.initializePermanentData();
  }

  private initializePermanentData() {
    // Load permanent student data into memory
    PERMANENT_STUDENTS_DATA.forEach(student => {
      this.students.set(student.id, student);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Student methods
  async getStudents(): Promise<Student[]> {
    return Array.from(this.students.values());
  }

  async getStudent(id: number): Promise<Student | undefined> {
    return this.students.get(id);
  }

  async getStudentsByGrade(grade: number): Promise<Student[]> {
    return Array.from(this.students.values()).filter(student => student.grade === grade);
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const id = this.currentStudentId++;
    const student: Student = {
      ...insertStudent,
      id,
      notes: insertStudent.notes || null,
      createdAt: new Date(),
    };
    this.students.set(id, student);
    return student;
  }

  async updateStudent(id: number, updateData: Partial<InsertStudent>): Promise<Student | undefined> {
    const student = this.students.get(id);
    if (!student) {
      return undefined;
    }
    
    const updatedStudent: Student = { ...student, ...updateData };
    this.students.set(id, updatedStudent);
    return updatedStudent;
  }

  async deleteStudent(id: number): Promise<boolean> {
    return this.students.delete(id);
  }

  async searchStudents(query: string): Promise<Student[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.students.values()).filter(student =>
      student.name.toLowerCase().includes(lowerQuery) ||
      student.studentId.toLowerCase().includes(lowerQuery) ||
      student.phone.includes(query) ||
      (student.notes && student.notes.toLowerCase().includes(lowerQuery))
    );
  }

  // Message methods
  async getMessages(): Promise<Message[]> {
    return Array.from(this.messages.values());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const message: Message = {
      ...insertMessage,
      id,
      status: "pending",
      targetGrade: insertMessage.targetGrade || null,
      createdAt: new Date(),
    };
    this.messages.set(id, message);
    return message;
  }

  async updateMessageStatus(id: number, status: string): Promise<Message | undefined> {
    const message = this.messages.get(id);
    if (!message) {
      return undefined;
    }
    
    const updatedMessage: Message = { ...message, status };
    this.messages.set(id, updatedMessage);
    return updatedMessage;
  }
}

export const storage = new PermanentMemStorage();
