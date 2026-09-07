const { pool } = require("../config/db");

// =====================================================
// GET DASHBOARD OVERVIEW
// GET /api/dashboard/overview
// =====================================================

const getOverview = async (req, res, next) => {
    try {
        // =================================================
        // SHIPMENT STATISTICS
        // =================================================

        const [shipmentStats] = await pool.execute(`
            SELECT
                COUNT(*) AS total_shipments,

                SUM(IF(status = 'pending', 1, 0))
                    AS pending_shipments,

                SUM(IF(status = 'assigned', 1, 0))
                    AS assigned_shipments,

                SUM(IF(status = 'picked_up', 1, 0))
                    AS picked_up_shipments,

                SUM(IF(status = 'in_transit', 1, 0))
                    AS in_transit_shipments,

                SUM(IF(status = 'out_for_delivery', 1, 0))
                    AS out_for_delivery_shipments,

                SUM(IF(status = 'delivered', 1, 0))
                    AS delivered_shipments,

                SUM(IF(status = 'delayed', 1, 0))
                    AS delayed_shipments,

                SUM(IF(status = 'cancelled', 1, 0))
                    AS cancelled_shipments,

                SUM(
                    IF(
                        DATE(created_at) = CURDATE(),
                        1,
                        0
                    )
                ) AS today_shipments,

                SUM(
                    IF(
                        YEARWEEK(created_at, 1)
                        = YEARWEEK(CURDATE(), 1),
                        1,
                        0
                    )
                ) AS weekly_shipments,

                ROUND(
                    (
                        SUM(IF(status = 'delivered', 1, 0))
                        /
                        NULLIF(
                            COUNT(*)
                            -
                            SUM(IF(status = 'cancelled', 1, 0)),
                            0
                        )
                    ) * 100,
                    1
                ) AS delivery_rate,

                ROUND(
                    (
                        SUM(IF(status = 'delayed', 1, 0))
                        /
                        NULLIF(COUNT(*), 0)
                    ) * 100,
                    1
                ) AS delayed_rate,

                ROUND(
                    AVG(
                        IF(
                            actual_delivery_at IS NOT NULL
                            AND created_at IS NOT NULL,
                            TIMESTAMPDIFF(
                                HOUR,
                                created_at,
                                actual_delivery_at
                            ),
                            NULL
                        )
                    ),
                    1
                ) AS average_delivery_hours

            FROM shipments
        `);

        // =================================================
        // LAST 7 DAYS SHIPMENT TREND
        // =================================================

        const [shipmentTrend] = await pool.execute(`
            SELECT
                DATE(created_at) AS date,
                COUNT(*) AS shipments
            FROM shipments
            WHERE created_at >= CURDATE() - INTERVAL 6 DAY
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        `);

        // =================================================
// TOP SHIPPING ROUTES
// =================================================

const [routeStats] = await pool.execute(`
    SELECT
        origin_city,
        destination_city,
        COUNT(*) AS shipment_count,

        SUM(
            IF(status = 'delivered', 1, 0)
        ) AS delivered_count,

        ROUND(
            (
                SUM(
                    IF(status = 'delivered', 1, 0)
                )
                /
                NULLIF(COUNT(*), 0)
            ) * 100,
            1
        ) AS success_rate

    FROM shipments

    WHERE
        origin_city IS NOT NULL
        AND origin_city != ''
        AND destination_city IS NOT NULL
        AND destination_city != ''

    GROUP BY
        origin_city,
        destination_city

    ORDER BY
        shipment_count DESC,
        delivered_count DESC

    LIMIT 5
`);

        // =================================================
        // VEHICLE STATISTICS
        // =================================================

        const [vehicleStats] = await pool.execute(`
            SELECT
                COUNT(*) AS total_vehicles,

                SUM(IF(status = 'available', 1, 0))
                    AS available_vehicles,

                SUM(IF(status = 'in_transit', 1, 0))
                    AS in_transit_vehicles,

                SUM(IF(status = 'maintenance', 1, 0))
                    AS maintenance_vehicles,

                SUM(IF(status = 'inactive', 1, 0))
                    AS inactive_vehicles

            FROM vehicles
        `);

        // =================================================
        // DRIVER STATISTICS
        // =================================================

        const [driverStats] = await pool.execute(`
            SELECT
                COUNT(*) AS total_drivers,

                SUM(IF(status = 'available', 1, 0))
                    AS available_drivers,

                SUM(IF(status = 'on_trip', 1, 0))
                    AS on_trip_drivers,

                SUM(IF(status = 'off_duty', 1, 0))
                    AS off_duty_drivers,

                SUM(IF(status = 'inactive', 1, 0))
                    AS inactive_drivers

            FROM drivers
        `);

        // =================================================
        // TOP DRIVER PERFORMANCE
        // =================================================

        const [topDrivers] = await pool.execute(`
            SELECT
                id,
                employee_code,
                first_name,
                last_name,
                rating,
                total_deliveries,
                status
            FROM drivers
            WHERE status != 'inactive'
            ORDER BY
                rating DESC,
                total_deliveries DESC
            LIMIT 5
        `);

        // =================================================
        // ALERT STATISTICS
        // =================================================

        const [alertStats] = await pool.execute(`
            SELECT
                COUNT(*) AS total_alerts,

                SUM(IF(status = 'open', 1, 0))
                    AS open_alerts,

                SUM(IF(status = 'acknowledged', 1, 0))
                    AS acknowledged_alerts,

                SUM(IF(status = 'resolved', 1, 0))
                    AS resolved_alerts,

                SUM(
                    IF(
                        severity = 'critical'
                        AND status != 'resolved',
                        1,
                        0
                    )
                ) AS critical_alerts

            FROM alerts
        `);

        // =================================================
        // RESPONSE
        // =================================================

        return res.status(200).json({
            success: true,

            data: {
                // =================================================
                // SHIPMENTS
                // =================================================

                shipments: {
                    total: Number(
                        shipmentStats[0].total_shipments || 0
                    ),

                    pending: Number(
                        shipmentStats[0].pending_shipments || 0
                    ),

                    assigned: Number(
                        shipmentStats[0].assigned_shipments || 0
                    ),

                    pickedUp: Number(
                        shipmentStats[0].picked_up_shipments || 0
                    ),

                    inTransit: Number(
                        shipmentStats[0].in_transit_shipments || 0
                    ),

                    outForDelivery: Number(
                        shipmentStats[0].out_for_delivery_shipments || 0
                    ),

                    delivered: Number(
                        shipmentStats[0].delivered_shipments || 0
                    ),

                    delayed: Number(
                        shipmentStats[0].delayed_shipments || 0
                    ),

                    cancelled: Number(
                        shipmentStats[0].cancelled_shipments || 0
                    ),

                    today: Number(
                        shipmentStats[0].today_shipments || 0
                    ),

                    thisWeek: Number(
                        shipmentStats[0].weekly_shipments || 0
                    ),

                    deliveryRate: Number(
                        shipmentStats[0].delivery_rate || 0
                    ),

                    delayedRate: Number(
                        shipmentStats[0].delayed_rate || 0
                    ),

                    averageDeliveryHours: Number(
                        shipmentStats[0].average_delivery_hours || 0
                    ),

                    trend: shipmentTrend.map((item) => ({
                        date: item.date,
                        shipments: Number(
                            item.shipments || 0
                        ),
                    })),
                },

                // =================================================
         // TOP ROUTES
         // =================================================

routes: routeStats.map((route, index) => ({
    id: `${route.origin_city}-${route.destination_city}-${index}`,
    from: route.origin_city,
    to: route.destination_city,
    shipments: Number(route.shipment_count || 0),
    delivered: Number(route.delivered_count || 0),
    successRate: Number(route.success_rate || 0),
})),

                // =================================================
                // VEHICLES
                // =================================================

                vehicles: {
                    total: Number(
                        vehicleStats[0].total_vehicles || 0
                    ),

                    available: Number(
                        vehicleStats[0].available_vehicles || 0
                    ),

                    inTransit: Number(
                        vehicleStats[0].in_transit_vehicles || 0
                    ),

                    maintenance: Number(
                        vehicleStats[0].maintenance_vehicles || 0
                    ),

                    inactive: Number(
                        vehicleStats[0].inactive_vehicles || 0
                    ),
                },

                // =================================================
                // DRIVERS
                // =================================================

                drivers: {
                    total: Number(
                        driverStats[0].total_drivers || 0
                    ),

                    available: Number(
                        driverStats[0].available_drivers || 0
                    ),

                    onTrip: Number(
                        driverStats[0].on_trip_drivers || 0
                    ),

                    offDuty: Number(
                        driverStats[0].off_duty_drivers || 0
                    ),

                    inactive: Number(
                        driverStats[0].inactive_drivers || 0
                    ),

                    topDrivers: topDrivers.map((driver) => ({
                        id: driver.id,

                        employeeCode:
                            driver.employee_code,

                        firstName:
                            driver.first_name,

                        lastName:
                            driver.last_name,

                        rating: Number(
                            driver.rating || 0
                        ),

                        totalDeliveries: Number(
                            driver.total_deliveries || 0
                        ),

                        status: driver.status,
                    })),
                },

                // =================================================
                // ALERTS
                // =================================================

                alerts: {
                    total: Number(
                        alertStats[0].total_alerts || 0
                    ),

                    open: Number(
                        alertStats[0].open_alerts || 0
                    ),

                    acknowledged: Number(
                        alertStats[0].acknowledged_alerts || 0
                    ),

                    resolved: Number(
                        alertStats[0].resolved_alerts || 0
                    ),

                    critical: Number(
                        alertStats[0].critical_alerts || 0
                    ),
                },
            },
        });
    } catch (error) {
        console.error(
            "Dashboard overview error:",
            error
        );

        next(error);
    }
};


// =====================================================
// GET RECENT SHIPMENTS
// GET /api/dashboard/recent-shipments
// =====================================================

const getRecentShipments = async (req, res, next) => {
    try {
        const [shipments] = await pool.execute(`
            SELECT
                id,
                tracking_number,
                customer_id,
                origin_city,
                destination_city,
                priority,
                status,
                created_at,
                updated_at
            FROM shipments
            ORDER BY created_at DESC
            LIMIT 10
        `);

        return res.status(200).json({
            success: true,
            count: shipments.length,
            data: shipments,
        });
    } catch (error) {
        console.error(
            "Recent shipments error:",
            error
        );

        next(error);
    }
};


// =====================================================
// GET ACTIVE ASSIGNMENTS
// GET /api/dashboard/active-assignments
// =====================================================

const getActiveAssignments = async (req, res, next) => {
    try {
        const [assignments] = await pool.execute(`
            SELECT
                a.id AS assignment_id,
                a.status AS assignment_status,
                a.assigned_at,
                a.started_at,
                a.notes,

                s.id AS shipment_id,
                s.tracking_number,
                s.origin_city,
                s.destination_city,
                s.priority AS shipment_priority,
                s.status AS shipment_status,

                d.id AS driver_id,
                d.employee_code,
                d.first_name AS driver_first_name,
                d.last_name AS driver_last_name,
                d.phone AS driver_phone,
                d.rating AS driver_rating,

                v.id AS vehicle_id,
                v.vehicle_number,
                v.registration_number,
                v.vehicle_type,
                v.status AS vehicle_status

            FROM assignments a

            INNER JOIN shipments s
                ON s.id = a.shipment_id

            INNER JOIN drivers d
                ON d.id = a.driver_id

            INNER JOIN vehicles v
                ON v.id = a.vehicle_id

            WHERE a.status IN (
                'assigned',
                'accepted',
                'in_progress'
            )

            ORDER BY a.assigned_at DESC
        `);

        return res.status(200).json({
            success: true,
            count: assignments.length,
            data: assignments,
        });
    } catch (error) {
        console.error(
            "Active assignments error:",
            error
        );

        next(error);
    }
};


// =====================================================
// GET RECENT ALERTS
// GET /api/dashboard/recent-alerts
// =====================================================

const getRecentAlerts = async (req, res, next) => {
    try {
        const [alerts] = await pool.execute(`
            SELECT
                a.id,
                a.type,
                a.severity,
                a.title,
                a.description,
                a.shipment_id,
                a.vehicle_id,
                a.driver_id,
                a.status,
                a.resolved_by,
                a.resolved_at,
                a.created_at,
                a.updated_at

            FROM alerts a

            WHERE a.status != 'resolved'

            ORDER BY
                CASE
                    WHEN a.severity = 'critical' THEN 1
                    WHEN a.severity = 'high' THEN 2
                    WHEN a.severity = 'medium' THEN 3
                    WHEN a.severity = 'low' THEN 4
                    ELSE 5
                END,

                a.created_at DESC

            LIMIT 10
        `);

        return res.status(200).json({
            success: true,
            count: alerts.length,
            data: alerts,
        });
    } catch (error) {
        console.error(
            "Recent alerts error:",
            error
        );

        next(error);
    }
};


// =====================================================
// GET DASHBOARD SUMMARY
// GET /api/dashboard/summary
// =====================================================

const getSummary = async (req, res, next) => {
    try {
        // =================================================
        // TOTAL ASSIGNMENTS
        // =================================================

        const [assignmentStats] = await pool.execute(`
            SELECT
                COUNT(*) AS total,

                SUM(
                    IF(status = 'assigned', 1, 0)
                ) AS assigned,

                SUM(
                    IF(status = 'accepted', 1, 0)
                ) AS accepted,

                SUM(
                    IF(status = 'in_progress', 1, 0)
                ) AS in_progress,

                SUM(
                    IF(status = 'completed', 1, 0)
                ) AS completed,

                SUM(
                    IF(status = 'cancelled', 1, 0)
                ) AS cancelled

            FROM assignments
        `);

        // =================================================
        // TOTAL CUSTOMERS
        // =================================================

        const [customerStats] = await pool.execute(`
            SELECT COUNT(*) AS total
            FROM customers
        `);

        // =================================================
        // TOTAL USERS
        // =================================================

        const [userStats] = await pool.execute(`
            SELECT COUNT(*) AS total
            FROM users
        `);

        // =================================================
        // RESPONSE
        // =================================================

        return res.status(200).json({
            success: true,

            data: {
                assignments: {
                    total: Number(
                        assignmentStats[0].total || 0
                    ),

                    assigned: Number(
                        assignmentStats[0].assigned || 0
                    ),

                    accepted: Number(
                        assignmentStats[0].accepted || 0
                    ),

                    inProgress: Number(
                        assignmentStats[0].in_progress || 0
                    ),

                    completed: Number(
                        assignmentStats[0].completed || 0
                    ),

                    cancelled: Number(
                        assignmentStats[0].cancelled || 0
                    ),
                },

                customers: {
                    total: Number(
                        customerStats[0].total || 0
                    ),
                },

                users: {
                    total: Number(
                        userStats[0].total || 0
                    ),
                },
            },
        });
    } catch (error) {
        console.error(
            "Dashboard summary error:",
            error
        );

        next(error);
    }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
    getOverview,
    getRecentShipments,
    getActiveAssignments,
    getRecentAlerts,
    getSummary,
};