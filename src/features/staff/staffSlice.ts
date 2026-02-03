import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Staff, StaffRole } from '@/types';

interface StaffMarketEntry {
  name: string;
  role: StaffRole;
  hireCost: number;
  dailyWage: number;
  quality: 'poor' | 'average' | 'good' | 'excellent';
}

interface StaffState {
  employees: Staff[];
  availableHires: Staff[];
  staffMarket: StaffMarketEntry[];
  totalDailyWages: number;
}

const initialState: StaffState = {
  employees: [],
  availableHires: [],
  staffMarket: [],
  totalDailyWages: 0,
};

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    // Hiring
    hireStaff: (state, action: PayloadAction<Staff>) => {
      state.employees.push(action.payload);
      state.availableHires = state.availableHires.filter(s => s.id !== action.payload.id);
      state.totalDailyWages = state.employees.reduce((sum, s) => sum + s.dailyWage, 0);
    },
    fireStaff: (state, action: PayloadAction<string>) => {
      state.employees = state.employees.filter(s => s.id !== action.payload);
      state.totalDailyWages = state.employees.reduce((sum, s) => sum + s.dailyWage, 0);
    },
    
    // Available hires
    setAvailableHires: (state, action: PayloadAction<Staff[]>) => {
      state.availableHires = action.payload;
    },
    addAvailableHire: (state, action: PayloadAction<Staff>) => {
      state.availableHires.push(action.payload);
    },
    
    // Update staff
    updateStaff: (state, action: PayloadAction<{ id: string; updates: Partial<Staff> }>) => {
      const index = state.employees.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.employees[index] = { ...state.employees[index], ...action.payload.updates };
        state.totalDailyWages = state.employees.reduce((sum, s) => sum + s.dailyWage, 0);
      }
    },
    
    // Satisfaction
    updateSatisfaction: (state, action: PayloadAction<{ id: string; satisfaction: number }>) => {
      const staff = state.employees.find(s => s.id === action.payload.id);
      if (staff) {
        staff.satisfaction = Math.max(0, Math.min(100, action.payload.satisfaction));
      }
    },
    adjustAllSatisfaction: (state, action: PayloadAction<number>) => {
      state.employees.forEach(staff => {
        staff.satisfaction = Math.max(0, Math.min(100, staff.satisfaction + action.payload));
      });
    },
    
    // Wages
    markUnpaid: (state, action: PayloadAction<string>) => {
      const staff = state.employees.find(s => s.id === action.payload);
      if (staff) {
        staff.daysUnpaid += 1;
        staff.satisfaction = Math.max(0, staff.satisfaction - 10);
      }
    },
    markPaid: (state, action: PayloadAction<string>) => {
      const staff = state.employees.find(s => s.id === action.payload);
      if (staff) {
        staff.daysUnpaid = 0;
      }
    },
    markAllPaid: (state) => {
      state.employees.forEach(staff => {
        staff.daysUnpaid = 0;
      });
    },
    
    // Experience and leveling
    addExperience: (state, action: PayloadAction<{ id: string; amount: number }>) => {
      const staff = state.employees.find(s => s.id === action.payload.id);
      if (staff) {
        staff.experience += action.payload.amount;
      }
    },
    levelUp: (state, action: PayloadAction<{ id: string }>) => {
      const staff = state.employees.find(s => s.id === action.payload.id);
      if (staff && staff.level < 5) {
        staff.level += 1;
      }
    },
    
    // Skills (legacy - kept for compatibility)
    unlockSkill: (state, action: PayloadAction<{ staffId: string; skillId: string }>) => {
      const staff = state.employees.find(s => s.id === action.payload.staffId);
      if (staff && !staff.skills.includes(action.payload.skillId)) {
        staff.skills.push(action.payload.skillId);
      }
    },
    
    // Learn skill (simplified - adds skill ID to skills array)
    learnStaffSkill: (state, action: PayloadAction<{ staffId: string; skillId: string }>) => {
      const staff = state.employees.find(s => s.id === action.payload.staffId);
      if (staff && !staff.skills.includes(action.payload.skillId)) {
        staff.skills.push(action.payload.skillId);
      }
    },
    
    // Staff market
    setStaffMarket: (state, action: PayloadAction<StaffMarketEntry[]>) => {
      state.staffMarket = action.payload;
    },
    addToStaffMarket: (state, action: PayloadAction<StaffMarketEntry>) => {
      state.staffMarket.push(action.payload);
    },
    removeFromStaffMarket: (state, action: PayloadAction<number>) => {
      state.staffMarket.splice(action.payload, 1);
    },
    
    // Recalculate wages
    recalculateWages: (state) => {
      state.totalDailyWages = state.employees.reduce((sum, s) => sum + s.dailyWage, 0);
    },
    
    // Reset
    resetStaff: () => initialState,
  },
});

export const {
  hireStaff,
  fireStaff,
  setAvailableHires,
  addAvailableHire,
  updateStaff,
  updateSatisfaction,
  adjustAllSatisfaction,
  markUnpaid,
  markPaid,
  markAllPaid,
  addExperience,
  levelUp,
  unlockSkill,
  learnStaffSkill,
  setStaffMarket,
  addToStaffMarket,
  removeFromStaffMarket,
  recalculateWages,
  resetStaff,
} = staffSlice.actions;

// Selectors
export const selectEmployees = (state: { staff: StaffState }) => state.staff.employees;
export const selectAvailableHires = (state: { staff: StaffState }) => state.staff.availableHires;
export const selectStaffByRole = (state: { staff: StaffState }, role: StaffRole) => 
  state.staff.employees.find(s => s.role === role);
export const selectTotalDailyWages = (state: { staff: StaffState }) => state.staff.totalDailyWages;
export const selectUnhappyStaff = (state: { staff: StaffState }) => 
  state.staff.employees.filter(s => s.satisfaction < 25);

export default staffSlice.reducer;
