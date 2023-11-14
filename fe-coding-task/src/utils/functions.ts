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

const convertToCSV = (objArray: any) => {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
  let str = '';

  let headerLine = '';
  if (array.length > 0) {
    headerLine = Object.keys(array[0]).join(',');
    str += headerLine + '\r\n';
  }

  for (let i = 0; i < array.length; i++) {
    let line = '';
    for (let index in array[i]) {
      if (line !== '') line += ',';

      line += array[i][index];
    }

    str += line + '\r\n';
  }

  return str;
}

export const downloadCSV = (example: any) => {
  const csvString = convertToCSV(example);
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', 'download.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);

  link.click();
  document.body.removeChild(link);
}
