export function getCntFunc(key: string, outputObj: { [key: string]: number; } = outputReport ) {
    if (!outputObj.hasOwnProperty(key)) {
        outputObj[key] = 0
    }
    function cntFunc(quantity: number = 1) {
        outputObj[key] += quantity
    }
    return cntFunc
}

