import { ethers } from 'hardhat'

export const convertStringArrayToBytes32Array = (array: string[]) => {
    const bytes32Array = []
    for (let index = 0; index < array.length; index++) {
        bytes32Array.push(ethers.utils.formatBytes32String(array[index]))
    }
    return bytes32Array
}

export const convertBytes32ArrayToStringArray = (array: string[]) => {
    const StringArray = []
    for (let index = 0; index < array.length; index++) {
        StringArray.push(ethers.utils.parseBytes32String(array[index]))
    }
    return StringArray
}
