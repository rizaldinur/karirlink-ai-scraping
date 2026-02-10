import { existsSync } from "node:fs";
import { CsvFile } from "../types/CsvFile.ts";

export function summarizeRunResult(
  extractedData: Object[],
  usageData: Object[],
  numberOfSources: number,
  outFilePath: string,
  reasonStopScript?: string,
) {
  const fileExist = existsSync(outFilePath);
  const csvFile = new CsvFile({
    headers: [
      "timestamp",
      "reason_script_stop",
      "total_number_of_main_sources",
      "total_number_of_scraping_attempts",
      "successful_extractions",
      "failed_extractions",
      "total_usage_tokens",
    ],
    path: outFilePath,
  });

  console.log("\n=== Rangkuman Running Scraper ===");
  console.log(`Jumlah sumber utama: ${numberOfSources}`);
  console.log(`Total data yang diambil: ${extractedData.length}`);
  const successfulExtractions = extractedData.filter(
    (item: any) => item.success,
  );
  console.log(`Berhasil: ${successfulExtractions.length}`);
  console.log(`Gagal: ${extractedData.length - successfulExtractions.length}`);

  const totalTokensUsed = usageData.reduce((sum: number, usage: any) => {
    return sum + (usage.totalTokenCount || 0);
  }, 0);
  console.log(`Total token yang digunakan: ${totalTokensUsed}`);
  console.log("=== Selesai ===\n");

  const csvRow = {
    timestamp: new Date().toISOString(),
    reason_script_stop: reasonStopScript || "Unknown.",
    total_number_of_main_sources: numberOfSources,
    total_number_of_scraping_attempts: extractedData.length,
    successful_extractions: successfulExtractions.length,
    failed_extractions: extractedData.length - successfulExtractions.length,
    total_usage_tokens: totalTokensUsed,
  };

  console.log("Writing summary to CSV...");

  if (!fileExist) {
    csvFile
      .create([csvRow])
      .then(() => {
        console.log("CSV created!");
      })
      .catch((err) => {
        console.error(err);
      });
  } else {
    csvFile
      .append([csvRow])
      .then(() => console.log("Done writing row to CSV!"))
      .catch((err) => console.error(err));
  }
}
