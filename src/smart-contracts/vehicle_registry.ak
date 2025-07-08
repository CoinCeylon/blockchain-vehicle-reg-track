

use aiken/hash.{Blake2b_224, Hash}
use aiken/list
use aiken/transaction.{ScriptContext, Transaction}
use aiken/transaction/credential.{Script, VerificationKey}
use aiken/transaction/value
// Define the Vehicle struct to store on-chain
type Vehicle {
  license_plate: ByteArray,
  chassis_number: ByteArray,
  make: ByteArray,
  model: ByteArray,
  year: Int,
  color: ByteArray,
  registration_date: Int,
  owner: Hash<Blake2b_224, VerificationKey>,
}
// Define the datum that will be stored with the UTxO
type VehicleRegistryDatum {
  vehicles: List<Vehicle>,
  registry_admin: Hash<Blake2b_224, VerificationKey>,
}
// Define the redeemer for different actions
type Action {
  RegisterVehicle { vehicle: Vehicle }
  TransferVehicle { vehicle_id: ByteArray, new_owner: Hash<Blake2b_224, VerificationKey> }
  UpdateVehicle { vehicle_id: ByteArray, updated_vehicle: Vehicle }
}
// Main validator function
validator {
  fn vehicle_registry(datum: VehicleRegistryDatum, redeemer: Action, ctx: ScriptContext) -> Bool {
    let Transaction { inputs, outputs, .. } = ctx.transaction
    // Get the signing key hash from the transaction
    let signing_key_hash = transaction.find_first_key_hash(inputs)
    when signing_key_hash is {
      None -> False
      Some(key_hash) -> {
        // Check if the signer is authorized (owner or admin)
        let is_admin = key_hash == datum.registry_admin
        when redeemer is {
          // Handle vehicle registration
          RegisterVehicle { vehicle } -> {
            // Only admin can register vehicles
            if !is_admin {
              False
            } else {
              // Ensure the vehicle doesn't already exist
              let vehicle_exists = 
                list.any(
                  datum.vehicles, 
                  fn(v) { v.license_plate == vehicle.license_plate || v.chassis_number == vehicle.chassis_number }
                )
              if vehicle_exists {
                False
              } else {
                // Add the new vehicle to the registry
                let new_vehicles = list.concat(datum.vehicles, [vehicle])
                // Ensure the output datum is updated correctly
                expect Some(output_datum) = transaction.find_datum(outputs, ctx.purpose)
                expect VehicleRegistryDatum { vehicles: output_vehicles, registry_admin } = output_datum
                // Verify the update is correct
                registry_admin == datum.registry_admin && output_vehicles == new_vehicles
              }
            }
          }
          // Handle vehicle ownership transfer
          TransferVehicle { vehicle_id, new_owner } -> {
            // Find the vehicle by ID (license plate)
            expect Some(vehicle_index) = 
              list.find_index(
                datum.vehicles, 
                fn(v) { v.license_plate == vehicle_id }
              )
            let vehicle = list.at(datum.vehicles, vehicle_index)
            // Check if signer is the owner or admin
            if key_hash != vehicle.owner && !is_admin {
              False
            } else {
              // Update the vehicle owner
              let updated_vehicle = Vehicle {
                license_plate: vehicle.license_plate,
                chassis_number: vehicle.chassis_number,
                make: vehicle.make,
                model: vehicle.model,
                year: vehicle.year,
                color: vehicle.color,
                registration_date: vehicle.registration_date,
                owner: new_owner,
              }
              // Replace the vehicle in the list
              let updated_vehicles = list.replace_at(datum.vehicles, vehicle_index, updated_vehicle)
              // Ensure the output datum is updated correctly
              expect Some(output_datum) = transaction.find_datum(outputs, ctx.purpose)
              expect VehicleRegistryDatum { vehicles: output_vehicles, registry_admin } = output_datum
              // Verify the update is correct
              registry_admin == datum.registry_admin && output_vehicles == updated_vehicles
            }
          }
          // Handle vehicle details update
          UpdateVehicle { vehicle_id, updated_vehicle } -> {
            // Find the vehicle by ID (license plate)
            expect Some(vehicle_index) = 
              list.find_index(
                datum.vehicles, 
                fn(v) { v.license_plate == vehicle_id }
              )
            let vehicle = list.at(datum.vehicles, vehicle_index)
            // Check if signer is the owner or admin
            if key_hash != vehicle.owner && !is_admin {
              False
            } else {
              // Ensure the license plate and chassis number aren't changed
              if updated_vehicle.license_plate != vehicle.license_plate || 
                 updated_vehicle.chassis_number != vehicle.chassis_number {
                False
              } else {
                // Replace the vehicle in the list
                let updated_vehicles = list.replace_at(datum.vehicles, vehicle_index, updated_vehicle)
                // Ensure the output datum is updated correctly
                expect Some(output_datum) = transaction.find_datum(outputs, ctx.purpose)
                expect VehicleRegistryDatum { vehicles: output_vehicles, registry_admin } = output_datum
                // Verify the update is correct
                registry_admin == datum.registry_admin && output_vehicles == updated_vehicles
              }
            }
          }
        }
      }
    }
  }
}