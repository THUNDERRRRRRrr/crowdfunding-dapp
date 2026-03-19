#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env, String, Symbol, Vec,
};

const CAMPAIGNS: Symbol = symbol_short!("CAMPAIGNS");
const COUNT: Symbol = symbol_short!("COUNT");

#[contracttype]
#[derive(Clone)]
pub struct Campaign {
    pub id: u32,
    pub title: String,
    pub description: String,
    pub goal: i128,
    pub raised: i128,
    pub creator: Address,
    pub deadline: u64,
    pub claimed: bool,
}

#[contract]
pub struct CrowdfundingContract;

#[contractimpl]
impl CrowdfundingContract {
    pub fn create_campaign(
        env: Env,
        title: String,
        description: String,
        goal: i128,
        deadline: u64,
        creator: Address,
    ) -> u32 {
        creator.require_auth();
        let id: u32 = env.storage().instance().get(&COUNT).unwrap_or(0);
        let campaign = Campaign {
            id,
            title,
            description,
            goal,
            raised: 0,
            creator,
            deadline,
            claimed: false,
        };
        let mut campaigns: Vec<Campaign> = env
            .storage()
            .instance()
            .get(&CAMPAIGNS)
            .unwrap_or(Vec::new(&env));
        campaigns.push_back(campaign);
        env.storage().instance().set(&CAMPAIGNS, &campaigns);
        env.storage().instance().set(&COUNT, &(id + 1));
        env.storage().instance().extend_ttl(100, 100);
        id
    }

    pub fn donate(env: Env, campaign_id: u32, amount: i128, donor: Address) {
        donor.require_auth();
        let mut campaigns: Vec<Campaign> = env
            .storage()
            .instance()
            .get(&CAMPAIGNS)
            .unwrap_or(Vec::new(&env));
        let mut campaign = campaigns.get(campaign_id).unwrap();
        campaign.raised += amount;
        campaigns.set(campaign_id, campaign);
        env.storage().instance().set(&CAMPAIGNS, &campaigns);
        env.storage().instance().extend_ttl(100, 100);
    }

    pub fn get_campaigns(env: Env) -> Vec<Campaign> {
        env.storage()
            .instance()
            .get(&CAMPAIGNS)
            .unwrap_or(Vec::new(&env))
    }

    pub fn get_campaign(env: Env, campaign_id: u32) -> Campaign {
        let campaigns: Vec<Campaign> = env
            .storage()
            .instance()
            .get(&CAMPAIGNS)
            .unwrap_or(Vec::new(&env));
        campaigns.get(campaign_id).unwrap()
    }

    pub fn get_count(env: Env) -> u32 {
        env.storage().instance().get(&COUNT).unwrap_or(0)
    }
}

mod test;
