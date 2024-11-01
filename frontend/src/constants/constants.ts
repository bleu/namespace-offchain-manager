import { mainnet, sepolia, goerli } from "wagmi/chains";

export const NAMESPACE_RESOLVER_ADDRESS: { [key: number]: string } = {
  [mainnet.id]: "0xF12d6Aa997F7c9Fc2E8968A19623211e8C8C1bF4",
  [sepolia.id]: "0x48243237e97257bCC97e53E53149Cbd49DD218EB",
  [goerli.id]: "0x0aBA2351994423770A35218c202c34B88BEa8041",
};

export const ENS_REGISTRY_ADDRESS: { [key: number]: string } = {
  [mainnet.id]: "0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401",
  [sepolia.id]: "0x0635513f179D50A207757E05759CbD106d7dFcE8",
  [goerli.id]: "0x114D4603199df73e7D157787f8778E21fCd13066",
};