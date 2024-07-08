import axios, { AxiosResponse } from "axios";
import { GlobalConstants } from "@/config/constants";

async function adminUserDetails(id: string): Promise<void> {
  let empNumber: string | undefined;

  try {
    const storedToken = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${storedToken}`,
    };
    const baseURL = localStorage.getItem("baseUrl");
    const api = baseURL + `api/v2/admin/users/${id}`;
    const dataResponse = await axios.get(api, { headers });

    const adminUserDetails = {
      empNumber: dataResponse.data.data.employee.empNumber,
      employeeId: dataResponse.data.data.employee.employeeId,
      firstName: dataResponse.data.data.employee.firstName,
      lastName: dataResponse.data.data.employee.lastName,
      middleName: dataResponse.data.data.employee.middleName,
      terminationId: dataResponse.data.data.employee.terminationId,
    };

    localStorage.setItem("empNumber", adminUserDetails.empNumber);
    localStorage.setItem(
      "adminUserDetails",
      JSON.stringify(dataResponse.data.data)
    );

    empNumber = adminUserDetails.empNumber;
  } catch (error) {
    console.error("Error fetching admin user details: ", error);
  }
}

export { adminUserDetails };
