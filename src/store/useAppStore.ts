import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// --- TYPES TO KEEP EXISTING APP WORKING ---
export type Phase = 'PREPARATION' | 'FOUILLES' | 'SECHAGE' | 'POSE' | 'RECEPTION';

export interface ChantierLegacy {
  id: string;
  clientName: string;
  phone: string;
  address: string;
  type: string;
  linearMeters: number;
  colorRal: string;
  soilType: string;
  dog: boolean;
  elec: boolean;
  dict: boolean;
  notes: string;
  status: 'NOUVEAU' | 'PLANIFIE' | 'EN_COURS' | 'TERMINE';
  phaseActuelle: Phase;
  progress: number;
}
export interface Equipe { id: string; name: string; members: string; }
export interface PlanningTask { id: string; chantierId: string; equipeId: string; day: string; }
export interface MaterialRequest { id: string; chantierId: string; item: string; status: string; }
export interface Lead { id: string; name: string; status: string; }
export interface FieldAlert { id: string; chantierId: string; type: string; message: string; status: string; timestamp: string; }
export interface TimeRecord { id: string; userId: string; chantierId: string; action: string; timestamp: string; }

// --- NEW BLUEPRINT TYPES ---
export type TaskStatus = 'A_FAIRE' | 'EN_COURS' | 'EN_PAUSE' | 'TERMINEE';
export type Priority = 'BASSE' | 'MOYENNE' | 'HAUTE' | 'URGENTE';
export type Role = 'ADMIN' | 'COLLABORATEUR';

export interface User { id: string; firstName: string; lastName: string; email: string; username?: string; password?: string; role: Role; color: string; isActive: boolean; showInPlanning: boolean; }
export interface Client { id: string; name: string; address: string; phone: string; email: string; startDate: string; }
export interface Chantier { id: string; clientId: string; name: string; address: string; status: string; progress: number; }
export interface Task { id: string; title: string; description: string; clientId: string; chantierId: string; priority: Priority; status: TaskStatus; dueDate?: string; estimatedTime?: number; assigneeId?: string; createdAt: string; }
export interface Vehicle { id: string; name: string; plate: string; type: string; motDate: string; }
export interface Invoice { id: string; artisanId: string; date: string; description: string; hours: number; amount: number; status: string; }
export interface Expense { id: string; userId: string; clientId: string; amount: number; date: string; description: string; status: string; }
export interface Supplier { id: string; companyName: string; contactName: string; phone: string; email: string; }

// --- APP STATE ---
interface AppState {
  // Legacy arrays
  chantiers: ChantierLegacy[];
  equipes: Equipe[];
  planningTasks: PlanningTask[];
  materialRequests: MaterialRequest[];
  leads: Lead[];
  alerts: FieldAlert[];
  timeRecords: TimeRecord[];
  isTrackingTime: boolean;
  
  // New arrays
  users: User[];
  clients: Client[];
  tasks: Task[];
  vehicles: Vehicle[];
  invoices: Invoice[];
  expenses: Expense[];
  suppliers: Supplier[];

  // Auth
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;

  // Legacy actions
  addChantier: (chantier: Omit<ChantierLegacy, 'id' | 'status' | 'phaseActuelle' | 'progress'>) => void;
  updateChantierProgress: (id: string, progress: number, phase: Phase) => void;
  updateTaskLocation: (taskId: string, newEquipeId: string, newDay: string) => void;
  addMaterialRequest: (req: Omit<MaterialRequest, 'id' | 'status'>) => void;
  addFieldAlert: (alert: Omit<FieldAlert, 'id' | 'status' | 'timestamp'>) => void;
  markAlertAsRead: (id: string) => void;
  toggleTimeTracking: (userId: string, chantierId: string) => void;

  // New actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  updateTaskLocation: (taskId: string, newAssigneeId: string, newDay: string) => void;
  removeTask: (id: string) => void;
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => void;
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  addChantier: (chantier: Omit<Chantier, 'id' | 'createdAt'>) => void;
  updateChantier: (id: string, chantier: Partial<Chantier>) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  removeUser: (id: string) => void;
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  removeSupplier: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Legacy init
      chantiers: [{ id: '1', clientName: 'M. Dupont', phone: '06 12 34 56 78', address: '123 rue de la Clôture, Nantes', type: 'Clôture', linearMeters: 45, colorRal: '7016', soilType: 'Terre', dog: true, elec: false, dict: true, notes: '', status: 'EN_COURS', phaseActuelle: 'FOUILLES', progress: 30 }],
      equipes: [{ id: 'eq1', name: 'Équipe 1', members: 'Thomas & Lucas' }],
      planningTasks: [{ id: 't1', chantierId: '1', equipeId: 'eq1', day: 'Lundi' }],
      materialRequests: [],
      leads: [{ id: 'l1', name: 'Mme. Rousseau', status: 'NOUVEAU' }],
      alerts: [],
      timeRecords: [],
      isTrackingTime: false,

      // Auth init
      currentUser: null,

      // New init
      users: [
        { id: 'u1', firstName: 'Admin', lastName: 'Gérant', email: 'admin@noem.fr', username: 'admin', password: '123', role: 'ADMIN', color: '#059669', isActive: true, showInPlanning: false },
        { id: 'u2', firstName: 'Thomas', lastName: 'Poseur', email: 'thomas@noem.fr', username: 'user', password: '123', role: 'COLLABORATEUR', color: '#3b82f6', isActive: true, showInPlanning: true }
      ],
      clients: [{ id: 'c1', name: 'M. Dupont', address: '123 rue de la Clôture', phone: '06 00', email: 'du@po.nt', startDate: '2026-10-10' }],
      tasks: [{ id: 'nt1', title: 'Couler béton', description: 'Scellement', clientId: 'c1', chantierId: '1', priority: 'HAUTE', status: 'A_FAIRE', assigneeId: 'u2', createdAt: new Date().toISOString() }],
      vehicles: [{ id: 'v1', name: 'Peugeot Expert', plate: 'AB-123-CD', type: 'Fourgon', motDate: '2027-05-10' }],
      invoices: [],
      expenses: [],
      suppliers: [],

      // Legacy Actions
      login: (user) => set({ currentUser: user }),
      logout: () => set({ currentUser: null }),
      addChantier: (chantierData) => set((state) => ({ chantiers: [...state.chantiers, { ...chantierData, id: Math.random().toString(36).substring(7), status: 'NOUVEAU', phaseActuelle: 'PREPARATION', progress: 0 }]})),
      updateChantierProgress: (id, progress, phase) => set((state) => ({ chantiers: state.chantiers.map((c) => c.id === id ? { ...c, progress, phaseActuelle: phase, status: progress === 100 ? 'TERMINE' : 'EN_COURS' } : c)})),
      updateTaskLocation: (taskId, newEquipeId, newDay) => set((state) => ({ planningTasks: state.planningTasks.map((t) => t.id === taskId ? { ...t, equipeId: newEquipeId, day: newDay } : t)})),
      addMaterialRequest: (req) => set((state) => ({ materialRequests: [...state.materialRequests, { ...req, id: Math.random().toString(36).substring(7), status: 'PENDING' }]})),
      addFieldAlert: (alert) => set((state) => ({ alerts: [...state.alerts, { ...alert, id: Math.random().toString(36).substring(7), status: 'NON_LU', timestamp: new Date().toISOString() }]})),
      markAlertAsRead: (id) => set((state) => ({ alerts: state.alerts.map((a) => a.id === id ? { ...a, status: 'TRAITE' } : a)})),
      toggleTimeTracking: (userId, chantierId) => set((state) => ({ isTrackingTime: !state.isTrackingTime, timeRecords: [...state.timeRecords, { id: Math.random().toString(36).substring(7), userId, chantierId, action: state.isTrackingTime ? 'STOP' : 'START', timestamp: new Date().toISOString() }]})),

      addTask: (taskData) => set((state) => ({ tasks: [...state.tasks, { ...taskData, id: Math.random().toString(36).substring(7), createdAt: new Date().toISOString() }]})),
      updateTask: (id, taskData) => set((state) => ({ tasks: state.tasks.map(t => t.id === id ? { ...t, ...taskData } : t) })),
      updateTaskStatus: (id, status) => set((state) => ({ tasks: state.tasks.map(t => t.id === id ? { ...t, status } : t)})),
      updateTaskLocation: (id, assigneeId, dueDate) => set((state) => ({ tasks: state.tasks.map(t => t.id === id ? { ...t, assigneeId, dueDate } : t)})),
      removeTask: (id) => set((state) => ({ tasks: state.tasks.filter(t => t.id !== id) })),
      addClient: (clientData) => set((state) => ({ clients: [{ ...clientData, id: Math.random().toString(36).substring(7) }, ...state.clients] })),
      updateClient: (id, clientData) => set((state) => ({ clients: state.clients.map(c => c.id === id ? { ...c, ...clientData } : c) })),
      addVehicle: (vehicleData) => set((state) => ({ vehicles: [{ ...vehicleData, id: Math.random().toString(36).substring(7) }, ...state.vehicles] })),
      updateVehicle: (id, vehicleData) => set((state) => ({ vehicles: state.vehicles.map(v => v.id === id ? { ...v, ...vehicleData } : v) })),
      addInvoice: (invoiceData) => set((state) => ({ invoices: [{ ...invoiceData, id: Math.random().toString(36).substring(7) }, ...state.invoices] })),
      addExpense: (expenseData) => set((state) => ({ expenses: [{ ...expenseData, id: Math.random().toString(36).substring(7) }, ...state.expenses] })),
      addChantier: (chantierData) => set((state) => ({ chantiers: [{ ...chantierData, id: Math.random().toString(36).substring(7), createdAt: new Date().toISOString() }, ...state.chantiers] })),
      updateChantier: (id, chantierData) => set((state) => ({ chantiers: state.chantiers.map(c => c.id === id ? { ...c, ...chantierData } : c) })),
      addUser: (userData) => set((state) => ({ users: [{ ...userData, id: Math.random().toString(36).substring(7), showInPlanning: true }, ...state.users] })),
      updateUser: (id, userData) => set((state) => ({ users: state.users.map(u => u.id === id ? { ...u, ...userData } : u) })),
      removeUser: (id) => set((state) => ({ users: state.users.filter(u => u.id !== id) })),
      addSupplier: (supplierData) => set((state) => ({ suppliers: [{ ...supplierData, id: Math.random().toString(36).substring(7) }, ...state.suppliers] })),
      updateSupplier: (id, supplierData) => set((state) => ({ suppliers: state.suppliers.map(s => s.id === id ? { ...s, ...supplierData } : s) })),
      removeSupplier: (id) => set((state) => ({ suppliers: state.suppliers.filter(s => s.id !== id) })),
    }),
    { name: 'todonoem-storage' }
  )
);
