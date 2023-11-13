export const generateQuartersBetween = (from: string, to: string) => {
    let quarters = [];
    let [yearFrom, quarterFrom] = from.split('K').map(Number);
    let [yearTo, quarterTo] = to.split('K').map(Number);
    
    for (let year = yearFrom; year <= yearTo; year++) {
        for (let quarter = 1; quarter <= 4; quarter++) {
            if (year === yearFrom && quarter < quarterFrom) continue;
            if (year === yearTo && quarter > quarterTo) break;
            quarters.push(`${year}K${quarter}`);
        }
    }
    return quarters;
};

export const compareQuarters = (kvartalFrom: string, kvartalTo: string): boolean => {
    const yearFrom = parseInt(kvartalFrom.substring(0, 4));
    const quarterFrom = parseInt(kvartalFrom.charAt(5));
    const yearTo = parseInt(kvartalTo.substring(0, 4));
    const quarterTo = parseInt(kvartalTo.charAt(5));

    if (yearFrom < yearTo) {
        return true;
    } else if (yearFrom > yearTo) {
        return false;
    } else {
        return quarterFrom <= quarterTo;
    }
  }