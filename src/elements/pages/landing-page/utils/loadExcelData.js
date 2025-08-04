import * as XLSX from 'xlsx';

export async function loadExcelData(fileUrl) {
  const response = await fetch(fileUrl);
  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();

  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet);
}
