import apiClient from "../http/api-client";
import type { Employee } from "../../entities/employee/models/employee.model";
import type { CreateEmployeeDto } from "../../features/employee/types/create-employee.dto";
import type { CreateEmployeeResponse } from "../../features/employee/create/api";

export const employeeApi = {
  async create(payload: CreateEmployeeDto): Promise<CreateEmployeeResponse> {
    return apiClient.post<CreateEmployeeResponse>("/employees", payload);
  },
  async getAll(): Promise<Employee[]> {
    return [];
  },
  //getById
  //update id: string, payload: Partial<Employee>
  //remove
};
