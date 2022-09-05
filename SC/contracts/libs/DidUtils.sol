// SPDX-License-Identifier: LGPL-3.0-or-later
pragma solidity 0.5.6;
pragma experimental ABIEncoderV2;

import "./BytesUtils.sol";

library DidUtils {
    // example: did:klay:5Ee76017be7F983a520a778B413758A9DB49cBe9
    /**
     * @dev verify did format
     * @param did did
     */
    function verifyDIDFormat(string memory did) public pure returns (bool) {
        bytes memory didData = bytes(did);
        if (didData.length != 49) {
            return false;
        }
        bytes memory prefix = bytes("did:klay:");
        if (
            !BytesUtils.equal(
                BytesUtils.slice(didData, 0, prefix.length),
                prefix
            )
        ) {
            return false;
        }
        bytes memory addressBytesData = BytesUtils.slice(
            didData,
            prefix.length,
            didData.length - prefix.length
        );
        bytes memory addressBytes = BytesUtils.fromHex(
            string(addressBytesData)
        );
        return addressBytes.length == 20;
    }

    function parseAddrFromDID(bytes memory did) public pure returns (address) {
        uint256 prefixLen = 9;
        bytes memory addressBytesData = BytesUtils.slice(
            did,
            prefixLen,
            did.length - prefixLen
        );
        bytes memory addressBytes = BytesUtils.fromHex(
            string(addressBytesData)
        );
        return BytesUtils.bytesToAddress(addressBytes);
    }

    /**
     * @dev parse public key to address
     * @param pubKey public key
     */
    function pubKeyToAddr(bytes memory pubKey) public pure returns (address) {
        return address(uint256(keccak256(pubKey)));
    }

    function byteFromDid(string memory did) public pure returns (bytes memory) {
        bytes memory res = bytes(did);
        return res;
    }
}
