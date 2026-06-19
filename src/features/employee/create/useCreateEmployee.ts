import { useCallback, useState } from "react";
import type { CreateEmployeeDto } from "../types/create-employee.dto";
import { AddressType, EmployeeRoleType } from "../types/employee.types";
import { createEmployee } from "./api";

export const useCreateEmployee = () => {
  const [formData, setFormData] = useState<CreateEmployeeDto>({
    empId: "",
    firstName: "",
    lastName: "",
    email: "",
    role: EmployeeRoleType.EMPLOYEE,
    addresses: [
      {
        type: AddressType.HOME,
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
      },
    ],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle basic field change
   */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [],
  );

  /**
   * Handle address field change
   */
  const handleAddressChange = useCallback(
    (
      index: number,
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
      const { name, value } = e.target;

      setFormData((prev) => {
        const updatedAddresses = [...prev.addresses];

        updatedAddresses[index] = {
          ...updatedAddresses[index],
          [name]: value,
        };

        return {
          ...prev,
          addresses: updatedAddresses,
        };
      });
    },
    [],
  );

  /**
   * Add new address
   */
  const addAddress = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      addresses: [
        ...prev.addresses,
        {
          type: AddressType.HOME,
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "India",
        },
      ],
    }));
  }, []);

  /**
   * Remove address
   */
  const removeAddress = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((_, i) => i !== index),
    }));
  }, []);

  /**
   * Submit form
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      try {
        setIsLoading(true);
        setError(null);

        const response = await createEmployee(formData);

        alert(response.message);

        setIsLoading(false);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to create employee";
        setError(message);
        setIsLoading(false);
      }
    },
    [formData],
  );

  return {
    formData,
    isLoading,
    error,
    handleChange,
    handleAddressChange,
    addAddress,
    removeAddress,
    handleSubmit,
  };
};
