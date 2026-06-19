//frontend\src\entities\employee\employee.model.ts

import type { EmployeeRoleType } from "../../../features/employee/types/employee.types";

export type Employee = {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  roleType: EmployeeRoleType;
  dob: string;
  bloodGroup: BloodType;
  managerId?: string;
  profilePicUrl?: string;
  hireDate: string;
  gender: string;
  status: "ACTIVE" | "INACTIVE";
  addresses: Address[];
};

export type Address = {
  type: string;
  dno: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type BloodType = "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";
