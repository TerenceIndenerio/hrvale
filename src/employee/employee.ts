import axios from "axios";

/** === Types === */
interface ApiEmployee {
  username: string;
  face_signature: string | null;
}

interface Employee {
  id: string;
  name: string;
  face?: string;
}

interface EmployeeState {
  employees: Employee[];
  selectedEmployee: Employee | null;
  isScanning: boolean;
  scanError: string | null;
}

/** === Vuex Module === */
export default {
  namespaced: true,

  /** === State === */
  state: {
    employees: [] as Employee[],
    selectedEmployee: null as Employee | null,
    isScanning: false,
    scanError: null as string | null,
  },

  /** === Getters === */
  getters: {
    getEmployees: (state: EmployeeState) => state.employees,

    getFilteredEmployees: (state: EmployeeState) => (query: string) => {
      const lowercaseQuery = query.toLowerCase();
      return state.employees.filter(
        (employee) =>
          employee.name.toLowerCase().includes(lowercaseQuery) ||
          employee.id.toLowerCase().includes(lowercaseQuery)
      );
    },

    getSelectedEmployee: (state: EmployeeState) => state.selectedEmployee,
    isScanning: (state: EmployeeState) => state.isScanning,
    scanError: (state: EmployeeState) => state.scanError,
  },

  /** === Mutations === */
  mutations: {
    setEmployees(state: EmployeeState, apiEmployees: ApiEmployee[]) {
      state.employees = apiEmployees.map((emp) => ({
        id: emp.username,
        name: emp.username,
        face:
          emp.face_signature === "undefined"
            ? undefined
            : emp.face_signature || undefined,
      }));
    },

    setSelectedEmployee(state: EmployeeState, employee: Employee | null) {
      state.selectedEmployee = employee;
    },

    setIsScanning(state: EmployeeState, value: boolean) {
      state.isScanning = value;
    },

    setScanError(state: EmployeeState, error: string | null) {
      state.scanError = error;
    },

    updateEmployeeFace(
      state: EmployeeState,
      { employeeId, face }: { employeeId: string; face: string }
    ) {
      const employee = state.employees.find(
        (emp: Employee) => emp.id === employeeId
      );
      if (employee) {
        employee.face = face;
      }
    },
  },

  /** === Actions === */
  actions: {
    async fetchEmployees({ commit }: any) {
      try {
        const response = await axios.get(
          "https://hrvale.bapplware.com/users/data"
        );
        commit("setEmployees", response.data.data);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    },

    selectEmployee({ commit }: any, employee: Employee | null) {
      commit("setSelectedEmployee", employee);
    },

    cancelEnrollment({ commit }: any) {
      commit("setIsScanning", false);
      commit("setScanError", null);
    },
  },
};
