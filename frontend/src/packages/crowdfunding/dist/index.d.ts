import { Buffer } from "buffer";
import { AssembledTransaction, Client as ContractClient, ClientOptions as ContractClientOptions, MethodOptions } from "@stellar/stellar-sdk/contract";
import type { u32, u64, i128 } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
export declare const networks: {
    readonly testnet: {
        readonly networkPassphrase: "Test SDF Network ; September 2015";
        readonly contractId: "CA7Q5MJS4QPBMHUG6Q2WOE3N666NADCGQN4RPMYU6Z5DZI5VHKPX6S4R";
    };
};
export interface Campaign {
    claimed: boolean;
    creator: string;
    deadline: u64;
    description: string;
    goal: i128;
    id: u32;
    raised: i128;
    title: string;
}
export interface Client {
    /**
     * Construct and simulate a donate transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    donate: ({ campaign_id, amount, donor }: {
        campaign_id: u32;
        amount: i128;
        donor: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a get_count transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    get_count: (options?: MethodOptions) => Promise<AssembledTransaction<u32>>;
    /**
     * Construct and simulate a get_campaign transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    get_campaign: ({ campaign_id }: {
        campaign_id: u32;
    }, options?: MethodOptions) => Promise<AssembledTransaction<Campaign>>;
    /**
     * Construct and simulate a get_campaigns transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    get_campaigns: (options?: MethodOptions) => Promise<AssembledTransaction<Array<Campaign>>>;
    /**
     * Construct and simulate a create_campaign transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    create_campaign: ({ title, description, goal, deadline, creator }: {
        title: string;
        description: string;
        goal: i128;
        deadline: u64;
        creator: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<u32>>;
}
export declare class Client extends ContractClient {
    readonly options: ContractClientOptions;
    static deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions & Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
    }): Promise<AssembledTransaction<T>>;
    constructor(options: ContractClientOptions);
    readonly fromJSON: {
        donate: (json: string) => AssembledTransaction<null>;
        get_count: (json: string) => AssembledTransaction<number>;
        get_campaign: (json: string) => AssembledTransaction<Campaign>;
        get_campaigns: (json: string) => AssembledTransaction<Campaign[]>;
        create_campaign: (json: string) => AssembledTransaction<number>;
    };
}
