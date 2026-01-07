import { Browser } from "puppeteer";
import xlsx from "xlsx";

export async function getDOMBody(
  browser: Browser,
  url: string
): Promise<string> {
  const page = await browser.newPage();

  try {
    await page.goto(url, {
      waitUntil: "domcontentloaded",
    });
  } catch (error) {
    console.error(`Failed to navigate to ${url}:`, error);
    await page.close();
    return "";
  }

  const body = await page.$eval("body", (el) => el.innerHTML);

  await page.close();
  return body;
}

export function readSourcesFromExcel(path: string) {
  const workbook = xlsx.readFile(path);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const rows: any[] = xlsx.utils.sheet_to_json(sheet);

  return rows;
}
