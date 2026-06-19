import type { AddressDto, EmployeeRoleType } from "./employee.types";

export type CreateEmployeeDto = {
  empId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: EmployeeRoleType;
  addresses: AddressDto[];
};
