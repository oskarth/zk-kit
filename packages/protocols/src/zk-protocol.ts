/* eslint @typescript-eslint/no-var-requires: "off" */
const { groth16 } = require("snarkjs")
import { SNARK_FIELD_SIZE } from "./utils"
import { FullProof } from "@libsem/types"

export class ZkProtocol {
  /**
   * Generates full proof
   * @param grothInput witness
   * @param wasmFilePath path to wasm file
   * @param finalZkeyPath path to final zkey file
   * @returns zero knowledge proof
   */
  genProof(grothInput: any, wasmFilePath: string, finalZkeyPath: string): Promise<FullProof> {
    return groth16.fullProve(grothInput, wasmFilePath, finalZkeyPath)
  }

  /**
   * Verify ZK proof
   * @param vKey verifikation key
   * @param fullProof proof
   * @returns Is provided proof valid
   */
  verifyProof(vKey: string, fullProof: FullProof): Promise<boolean> {
    const { proof, publicSignals } = fullProof
    return groth16.verify(vKey, publicSignals, proof)
  }

  /**
   * Transforms proof that can be compatible with solidity input
   * @param fullProof
   * @returns Proof
   */
  packToSolidityProof(fullProof: FullProof) {
    const { proof, publicSignals } = fullProof

    return {
      a: proof.pi_a.slice(0, 2),
      b: proof.pi_b.map((x: any) => x.reverse()).slice(0, 2),
      c: proof.pi_c.slice(0, 2),
      inputs: publicSignals.map((x: any) => {
        x = BigInt(x)
        return (x % SNARK_FIELD_SIZE).toString()
      })
    }
  }
}
