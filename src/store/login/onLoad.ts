import axios, { AxiosResponse } from "axios";
import { GlobalConstants } from "@/config/constants";

const baseURL = GlobalConstants.HOST_URL;

async function adminUserDetails(id: string): Promise<void> {
  let empNumber: string | undefined;

  try {
    const storedToken = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${storedToken}`,
    };

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
  } finally {
    if (empNumber) {
      await userDetails(empNumber);
    }
  }
}

async function userDetails(empNumber: string): Promise<void> {
  try {
    const storedToken = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${storedToken}`,
    };
    const api = baseURL + `api/v2/pim/employees/${empNumber}/personal-details`;
    const dataResponse = await axios.get(api, { headers });

    const userDetailsString = JSON.stringify(dataResponse.data.data);
    localStorage.setItem("userDetails", userDetailsString);

    const storedUserString = localStorage.getItem("userDetails");
    const storedUser = storedUserString ? JSON.parse(storedUserString) : null;
  } catch (error) {
    console.error("Error fetching user details: ", error);
  }
}

export { adminUserDetails, userDetails };
