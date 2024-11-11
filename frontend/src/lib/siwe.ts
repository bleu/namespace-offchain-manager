import {  SiweMessage } from "siwe";

export function generateSiweMessage(address: string, chainId: number) {
  return new SiweMessage({
    domain: window.location.host,
    address,
    statement: "Sign in with Ethereum to the app.",
    uri: window.location.origin,
    version: "1",
    chainId,
    nonce: Math.random().toString(36).slice(2),
    issuedAt: new Date().toISOString(),
  });
}