// Vehicle Transfer Smart Contract
//! This contract handles secure peer-to-peer vehicle ownership transfers
use aiken/hash.{Blake2b_224, Hash}
use aiken/list
use aiken/transaction.{ScriptContext, Transaction}
use aiken/transaction/credential.{VerificationKey}
use aiken/transaction/value
// Define the transfer datum
type TransferDatum {
  vehicle_id: ByteArray,
  seller: Hash<Blake2b_224, VerificationKey>,
  buyer: Hash<Blake2b_224, VerificationKey>,
  price: Int,
  deadline: Int,
}
// Define the redeemer for different actions
type Action {
  AcceptTransfer
  CancelTransfer
}
// Main validator function
validator {
  fn vehicle_transfer(datum: TransferDatum, redeemer: Action, ctx: ScriptContext) -> Bool {
    let Transaction { inputs, outputs, validity_range, .. } = ctx.transaction
    // Get the signing key hash from the transaction
    let signing_key_hash = transaction.find_first_key_hash(inputs)
    when signing_key_hash is {
      None -> False
      Some(key_hash) -> {
        when redeemer is {
          // Handle transfer acceptance
          AcceptTransfer -> {
            // Check if signer is the buyer
            if key_hash != datum.buyer {
              False
            } else {
              // Check if the transfer deadline has passed
              let current_time = validity_range.upper_bound.bound
              if current_time > datum.deadline {
                False
              } else {
                // Verify payment to seller
                let payment_to_seller = 
                  list.any(
                    outputs,
                    fn(output) {
                      when output.address.payment_credential is {
                        VerificationKey(vk) -> {
                          vk == datum.seller && 
                          value.lovelace_of(output.value) >= datum.price
                        }
                        _ -> False
                      }
                    }
                  )
                payment_to_seller
              }
            }
          }
          // Handle transfer cancellation
          CancelTransfer -> {
            // Only the seller can cancel the transfer
            if key_hash != datum.seller {
              False
            } else {
              // No other checks needed for cancellation
              True
            }
          }
        }
      }
    }
  }
}