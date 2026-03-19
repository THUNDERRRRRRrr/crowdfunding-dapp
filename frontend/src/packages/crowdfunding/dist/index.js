import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
if (typeof window !== "undefined") {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    testnet: {
        networkPassphrase: "Test SDF Network ; September 2015",
        contractId: "CA7Q5MJS4QPBMHUG6Q2WOE3N666NADCGQN4RPMYU6Z5DZI5VHKPX6S4R",
    }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAAAQAAAAAAAAAAAAAACENhbXBhaWduAAAACAAAAAAAAAAHY2xhaW1lZAAAAAABAAAAAAAAAAdjcmVhdG9yAAAAABMAAAAAAAAACGRlYWRsaW5lAAAABgAAAAAAAAALZGVzY3JpcHRpb24AAAAAEAAAAAAAAAAEZ29hbAAAAAsAAAAAAAAAAmlkAAAAAAAEAAAAAAAAAAZyYWlzZWQAAAAAAAsAAAAAAAAABXRpdGxlAAAAAAAAEA==",
            "AAAAAAAAAAAAAAAGZG9uYXRlAAAAAAADAAAAAAAAAAtjYW1wYWlnbl9pZAAAAAAEAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAABWRvbm9yAAAAAAAAEwAAAAA=",
            "AAAAAAAAAAAAAAAJZ2V0X2NvdW50AAAAAAAAAAAAAAEAAAAE",
            "AAAAAAAAAAAAAAAMZ2V0X2NhbXBhaWduAAAAAQAAAAAAAAALY2FtcGFpZ25faWQAAAAABAAAAAEAAAfQAAAACENhbXBhaWdu",
            "AAAAAAAAAAAAAAANZ2V0X2NhbXBhaWducwAAAAAAAAAAAAABAAAD6gAAB9AAAAAIQ2FtcGFpZ24=",
            "AAAAAAAAAAAAAAAPY3JlYXRlX2NhbXBhaWduAAAAAAUAAAAAAAAABXRpdGxlAAAAAAAAEAAAAAAAAAALZGVzY3JpcHRpb24AAAAAEAAAAAAAAAAEZ29hbAAAAAsAAAAAAAAACGRlYWRsaW5lAAAABgAAAAAAAAAHY3JlYXRvcgAAAAATAAAAAQAAAAQ="]), options);
        this.options = options;
    }
    fromJSON = {
        donate: (this.txFromJSON),
        get_count: (this.txFromJSON),
        get_campaign: (this.txFromJSON),
        get_campaigns: (this.txFromJSON),
        create_campaign: (this.txFromJSON)
    };
}
