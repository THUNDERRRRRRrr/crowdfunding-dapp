#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String};

#[test]
fn test() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(CrowdfundingContract, ());
    let client = CrowdfundingContractClient::new(&env, &contract_id);

    let creator = Address::generate(&env);
    let donor = Address::generate(&env);

    let id = client.create_campaign(
        &String::from_str(&env, "Save the Oceans"),
        &String::from_str(&env, "Help us clean the oceans"),
        &1000_0000000i128,
        &1000u64,
        &creator,
    );

    assert_eq!(id, 0);
    assert_eq!(client.get_count(), 1);

    client.donate(&0u32, &100_0000000i128, &donor);

    let campaign = client.get_campaign(&0u32);
    assert_eq!(campaign.raised, 100_0000000i128);
}
