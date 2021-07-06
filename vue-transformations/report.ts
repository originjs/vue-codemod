export function getCntFunc(key: string) {
    if (!global.outputReport.hasOwnProperty(key)) {
        global.outputReport[key] = 0
    }
    function cntFunc() {
        global.outputReport[key] += 1
    }
    return cntFunc
}

