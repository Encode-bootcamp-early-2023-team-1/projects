import { ethers } from 'hardhat'

export const convertStringArrayToBytes32Array = (array: string[]): string[] => {
    const bytes32Array = []
    for (let index = 0; index < array.length; index++) {
        bytes32Array.push(ethers.utils.formatBytes32String(array[index]))
    }
    return bytes32Array
}

export const convertBytes32ArrayToStringArray = (array: string[]): string[] => {
    const stringArray = []
    for (let index = 0; index < array.length; index++) {
        stringArray.push(ethers.utils.parseBytes32String(array[index]))
    }
    return stringArray
}

export const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
}
