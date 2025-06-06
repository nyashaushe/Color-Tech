export interface Vehicle {
    id: number;
    user_id: number;
    make: string;
    model: string;
    year: number;
    color: string;
    license_plate: string;
    vin?: string;
    notes?: string;
    created_at: Date;
    updated_at: Date;
}
export interface VehicleInput {
    user_id: number;
    make: string;
    model: string;
    year: number;
    color: string;
    license_plate: string;
    vin?: string;
    notes?: string;
}
declare class VehicleModel {
    /**
     * Find all vehicles with pagination
     */
    findAll(limit: number, offset: number): Promise<Vehicle[]>;
    /**
     * Count total vehicles for pagination
     */
    countVehicles(): Promise<number>;
    /**
     * Find vehicles by user ID with pagination
     */
    findByUserId(userId: number, limit: number, offset: number): Promise<Vehicle[]>;
    /**
     * Count vehicles by user ID for pagination
     */
    countByUserId(userId: number): Promise<number>;
    /**
     * Find vehicle by ID
     */
    findById(id: number): Promise<Vehicle | null>;
    /**
     * Create a new vehicle
     */
    create(vehicleData: VehicleInput): Promise<Vehicle>;
    /**
     * Update a vehicle
     */
    update(id: number, vehicleData: Partial<VehicleInput>): Promise<Vehicle | null>;
    /**
     * Delete a vehicle
     */
    delete(id: number): Promise<boolean>;
}
declare const _default: VehicleModel;
export default _default;
