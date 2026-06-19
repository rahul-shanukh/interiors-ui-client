import apiClient from "../../../infrastructure/http/api-client";
import type { CreateEmployeeDto } from "../types/create-employee.dto";

export interface CreateEmployeeResponse {
  message: string;
}

export const createEmployee = async (
  data: CreateEmployeeDto,
): Promise<CreateEmployeeResponse> => {
  return apiClient.post<CreateEmployeeResponse>("/employees", data);
};
