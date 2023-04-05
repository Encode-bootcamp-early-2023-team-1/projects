export const sleep = (ms: number): Promise<NodeJS.Timeout> => new Promise(r => setTimeout(r, ms))
