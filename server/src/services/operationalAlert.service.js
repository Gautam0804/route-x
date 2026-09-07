const { pool: db } = require("../config/db");

// =====================================================
// OPERATIONAL ALERT SERVICE
// =====================================================

const generateOperationalAlerts = async () => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        let createdAlerts = 0;

        // =================================================
        // 1. DELAYED SHIPMENTS
        // =================================================

        const [delayedShipments] = await connection.execute(`
            SELECT
                id,
                tracking_number,
                origin_city,
                destination_city
            FROM shipments
            WHERE status = 'delayed'
        `);

        for (const shipment of delayedShipments) {
            const [existingAlerts] = await connection.execute(
                `
                SELECT id
                FROM alerts
                WHERE type = 'shipment'
                  AND shipment_id = ?
                  AND title = 'Shipment Delayed'
                  AND status IN ('open', 'acknowledged')
                LIMIT 1
                `,
                [shipment.id]
            );

            if (existingAlerts.length > 0) {
                continue;
            }

            await connection.execute(
                `
                INSERT INTO alerts (
                    type,
                    severity,
                    title,
                    description,
                    shipment_id,
                    status
                )
                VALUES (
                    'shipment',
                    'high',
                    'Shipment Delayed',
                    ?,
                    ?,
                    'open'
                )
                `,
                [
                    `Shipment ${shipment.tracking_number} is delayed on the ${shipment.origin_city} to ${shipment.destination_city} route.`,
                    shipment.id,
                ]
            );

            createdAlerts++;
        }

        // =================================================
        // 2. OVERDUE SHIPMENTS
        // =================================================

        const [overdueShipments] = await connection.execute(`
            SELECT
                id,
                tracking_number,
                origin_city,
                destination_city,
                estimated_delivery_at
            FROM shipments
            WHERE estimated_delivery_at IS NOT NULL
              AND estimated_delivery_at < NOW()
              AND status NOT IN ('delivered', 'cancelled')
        `);

        for (const shipment of overdueShipments) {
            const [existingAlerts] = await connection.execute(
                `
                SELECT id
                FROM alerts
                WHERE type = 'shipment'
                  AND shipment_id = ?
                  AND title = 'Shipment Overdue'
                  AND status IN ('open', 'acknowledged')
                LIMIT 1
                `,
                [shipment.id]
            );

            if (existingAlerts.length > 0) {
                continue;
            }

            await connection.execute(
                `
                INSERT INTO alerts (
                    type,
                    severity,
                    title,
                    description,
                    shipment_id,
                    status
                )
                VALUES (
                    'shipment',
                    'high',
                    'Shipment Overdue',
                    ?,
                    ?,
                    'open'
                )
                `,
                [
                    `Shipment ${shipment.tracking_number} has passed its estimated delivery time.`,
                    shipment.id,
                ]
            );

            createdAlerts++;
        }

        // =================================================
        // 3. VEHICLES IN MAINTENANCE
        // =================================================

        const [maintenanceVehicles] = await connection.execute(`
            SELECT
                id,
                vehicle_number,
                registration_number
            FROM vehicles
            WHERE status = 'maintenance'
        `);

        for (const vehicle of maintenanceVehicles) {
            const [existingAlerts] = await connection.execute(
                `
                SELECT id
                FROM alerts
                WHERE type = 'vehicle'
                  AND vehicle_id = ?
                  AND title = 'Vehicle Maintenance'
                  AND status IN ('open', 'acknowledged')
                LIMIT 1
                `,
                [vehicle.id]
            );

            if (existingAlerts.length > 0) {
                continue;
            }

            await connection.execute(
                `
                INSERT INTO alerts (
                    type,
                    severity,
                    title,
                    description,
                    vehicle_id,
                    status
                )
                VALUES (
                    'vehicle',
                    'medium',
                    'Vehicle Maintenance',
                    ?,
                    ?,
                    'open'
                )
                `,
                [
                    `Vehicle ${vehicle.vehicle_number} (${vehicle.registration_number}) is currently in maintenance.`,
                    vehicle.id,
                ]
            );

            createdAlerts++;
        }

        // =================================================
        // 4. DRIVER LICENSE EXPIRING
        // =================================================

        const [expiringDrivers] = await connection.execute(`
            SELECT
                id,
                first_name,
                last_name,
                license_expiry_date
            FROM drivers
            WHERE status != 'inactive'
              AND license_expiry_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
              AND license_expiry_date >= CURDATE()
        `);

        for (const driver of expiringDrivers) {
            const [existingAlerts] = await connection.execute(
                `
                SELECT id
                FROM alerts
                WHERE type = 'driver'
                  AND driver_id = ?
                  AND title = 'Driver License Expiring'
                  AND status IN ('open', 'acknowledged')
                LIMIT 1
                `,
                [driver.id]
            );

            if (existingAlerts.length > 0) {
                continue;
            }

            await connection.execute(
                `
                INSERT INTO alerts (
                    type,
                    severity,
                    title,
                    description,
                    driver_id,
                    status
                )
                VALUES (
                    'driver',
                    'high',
                    'Driver License Expiring',
                    ?,
                    ?,
                    'open'
                )
                `,
                [
                    `Driver ${driver.first_name} ${driver.last_name}'s license expires on ${driver.license_expiry_date}.`,
                    driver.id,
                ]
            );

            createdAlerts++;
        }

        await connection.commit();

        return {
            success: true,
            createdAlerts,
        };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = {
    generateOperationalAlerts,
};
