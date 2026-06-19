import { useQuery } from "@tanstack/react-query";
import type { Employee } from "../../../entities/employee/models/employee.model";
import { employeeApi } from "../../../infrastructure/api/employee.api";

export function useEmployeeList() {
  const { data, isLoading, error } = useQuery<Employee[], Error>({
    queryKey: ["employees"],
    queryFn: employeeApi.getAll,
  });

  return {
    employees: data ?? [],
    loading: isLoading,
    error: error ? "Failed to load employees" : null,
  };
}
