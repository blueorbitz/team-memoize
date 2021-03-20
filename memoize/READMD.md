# memoize

Basic EOSIO smart contract, including the use of multi-index table to store persistance data.

Contract actions:
- addplate -> create a plate_number (aka vehicle) in the user record.
- delplate -> remove plate_number from user record
- updvehicle -> update basic vehicle information
- addservice -> update service or repair information
- delservice -> remove service or repair information

## Get Started

1. Setup [Docker](https://www.docker.com/products/docker-desktop). Ensure that is is already running
1. Install [EOSIO studio](https://www.eosstudio.io/)
1. Run EOSIO studio, follow the guide to run the require docker container.
1. Create a new contract named `memoize`.
1. Run the local eos network.
1. Build the application and deploy the contract.


