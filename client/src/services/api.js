const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";


// ==========================================
// GET AUTH TOKEN
// ==========================================

function getToken() {
    return (
        localStorage.getItem("routex_token") ||
        localStorage.getItem("token")
    );
}


// ==========================================
// API REQUEST
// ==========================================

async function apiRequest(endpoint, options = {}) {

    const token = getToken();

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,

            headers: {
                "Content-Type": "application/json",

                ...(token
                    ? {
                        Authorization: `Bearer ${token}`,
                    }
                    : {}),

                ...(options.headers || {}),
            },
        }
    );


    let data = {};

    try {
        data = await response.json();
    } catch {
        data = {};
    }


    if (!response.ok) {

        throw new Error(
            data.message ||
            `Request failed with status ${response.status}`
        );

    }


    return data;
}


// ==========================================
// AUTH
// ==========================================

export const login = async (
    email,
    password
) => {

    const response = await apiRequest(
        "/auth/login",
        {
            method: "POST",

            body: JSON.stringify({
                email,
                password,
            }),
        }
    );


    const token =
        response.token ||
        response.data?.token ||
        response.data?.accessToken ||
        response.accessToken;


    if (token) {

        localStorage.setItem(
            "routex_token",
            token
        );

    }


    return response;
};


export const getMe = () => {
    return apiRequest("/auth/me");
};


export const logout = () => {

    localStorage.removeItem(
        "routex_token"
    );

    localStorage.removeItem(
        "token"
    );

};


// ==========================================
// DASHBOARD
// ==========================================

export const getDashboardOverview = () => {
    return apiRequest("/dashboard/overview");
};


export const getRecentShipments = () => {
    return apiRequest(
        "/dashboard/recent-shipments"
    );
};


// ==========================================
// SHIPMENTS
// ==========================================

export const getShipments = (
    params = ""
) => {
    return apiRequest(
        `/shipments${params}`
    );
};


export const getShipmentById = (id) => {
    return apiRequest(
        `/shipments/${id}`
    );
};


export const createShipment = (
    shipment
) => {

    return apiRequest(
        "/shipments",
        {
            method: "POST",

            body: JSON.stringify(
                shipment
            ),
        }
    );

};


export const updateShipment = (
    id,
    shipment
) => {

    return apiRequest(
        `/shipments/${id}`,
        {
            method: "PUT",

            body: JSON.stringify(
                shipment
            ),
        }
    );

};


export const deleteShipment = (id) => {

    return apiRequest(
        `/shipments/${id}`,
        {
            method: "DELETE",
        }
    );

};


// ==========================================
// VEHICLES
// ==========================================

export const getVehicles = (
    params = ""
) => {

    return apiRequest(
        `/vehicles${params}`
    );

};


export const getVehicleById = (id) => {

    return apiRequest(
        `/vehicles/${id}`
    );

};


export const createVehicle = (
    vehicle
) => {

    return apiRequest(
        "/vehicles",
        {
            method: "POST",

            body: JSON.stringify(
                vehicle
            ),
        }
    );

};


export const updateVehicle = (
    id,
    vehicle
) => {

    return apiRequest(
        `/vehicles/${id}`,
        {
            method: "PUT",

            body: JSON.stringify(
                vehicle
            ),
        }
    );

};


export const deleteVehicle = (id) => {

    return apiRequest(
        `/vehicles/${id}`,
        {
            method: "DELETE",
        }
    );

};


// ==========================================
// DRIVERS
// ==========================================

export const getDrivers = (
    params = ""
) => {

    return apiRequest(
        `/drivers${params}`
    );

};


export const getDriverById = (
    id
) => {

    return apiRequest(
        `/drivers/${id}`
    );

};


export const createDriver = (
    driver
) => {

    return apiRequest(
        "/drivers",
        {
            method: "POST",

            body: JSON.stringify(
                driver
            ),
        }
    );

};


export const updateDriver = (
    id,
    driver
) => {

    return apiRequest(
        `/drivers/${id}`,
        {
            method: "PUT",

            body: JSON.stringify(
                driver
            ),
        }
    );

};


export const updateDriverStatus = (
    id,
    status
) => {

    return apiRequest(
        `/drivers/${id}/status`,
        {
            method: "PATCH",

            body: JSON.stringify({
                status,
            }),
        }
    );

};


export const deleteDriver = (
    id
) => {

    return apiRequest(
        `/drivers/${id}`,
        {
            method: "DELETE",
        }
    );

};


// ==========================================
// ASSIGNMENTS
// ==========================================

export const getAssignments = (
    params = ""
) => {

    return apiRequest(
        `/assignments${params}`
    );

};


export const getAssignmentById = (
    id
) => {

    return apiRequest(
        `/assignments/${id}`
    );

};


export const createAssignment = (
    data
) => {

    return apiRequest(
        "/assignments",
        {
            method: "POST",

            body: JSON.stringify(
                data
            ),
        }
    );

};


export const updateAssignmentStatus = (
    id,
    status
) => {

    return apiRequest(
        `/assignments/${id}/status`,
        {
            method: "PATCH",

            body: JSON.stringify({
                status,
            }),
        }
    );

};


// ==========================================
// ALERTS
// ==========================================

export const getAlerts = (
    params = ""
) => {

    return apiRequest(
        `/alerts${params}`
    );

};


export const updateAlertStatus = (
    id,
    status
) => {

    return apiRequest(
        `/alerts/${id}/status`,
        {
            method: "PATCH",

            body: JSON.stringify({
                status,
            }),
        }
    );

};


// ==========================================
// TRACKING
// ==========================================

export const getTracking = (
    assignmentId
) => {

    return apiRequest(
        `/tracking/assignment/${assignmentId}`
    );

};


export const getLatestTracking = (
    assignmentId
) => {

    return apiRequest(
        `/tracking/assignment/${assignmentId}/latest`
    );

};


export const getLiveTracking = () => {

    return apiRequest(
        "/tracking/live"
    );

};


export const getShipmentTracking = (
    trackingNumber
) => {

    return apiRequest(
        `/tracking/shipment/${trackingNumber}`
    );

};


export const createTracking = (
    data
) => {

    return apiRequest(
        "/tracking",
        {
            method: "POST",

            body: JSON.stringify(
                data
            ),
        }
    );

};


// ==========================================
// USERS
// ==========================================

export const getUsers = (
    params = ""
) => {

    return apiRequest(
        `/users${params}`
    );

};


export const getUserById = (
    id
) => {

    return apiRequest(
        `/users/${id}`
    );

};


export const createUser = (
    user
) => {

    return apiRequest(
        "/users",
        {
            method: "POST",

            body: JSON.stringify(
                user
            ),
        }
    );

};


export const updateUser = (
    id,
    user
) => {

    return apiRequest(
        `/users/${id}`,
        {
            method: "PUT",

            body: JSON.stringify(
                user
            ),
        }
    );

};


export const updateUserStatus = (
    id,
    status
) => {

    return apiRequest(
        `/users/${id}/status`,
        {
            method: "PATCH",

            body: JSON.stringify({
                status,
            }),
        }
    );

};


export const deleteUser = (
    id
) => {

    return apiRequest(
        `/users/${id}`,
        {
            method: "DELETE",
        }
    );

};


// ==========================================
// DEFAULT EXPORT
// ==========================================

export default apiRequest;