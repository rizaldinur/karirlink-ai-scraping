import { summarizeRunResult } from "./summarizeRunResult.ts";

type SummaryData = {
  extractedData: any[];
  usageData: any[];
  numberOfSources: number;
  summaryFilePath: string;
  stopReason: string;
};

export function gracefulShutdown(
  signal: string,
  message: string,
  summaryData: SummaryData,
) {
  if (signal) {
    console.log(`\nSIGNAL: ${signal}`);
  }
  console.log(`${message}`);
  console.log("Menganalisis hasil akhir...");
  summarizeRunResult(
    summaryData.extractedData,
    summaryData.usageData,
    summaryData.numberOfSources,
    summaryData.summaryFilePath,
    summaryData.stopReason,
  );
}
