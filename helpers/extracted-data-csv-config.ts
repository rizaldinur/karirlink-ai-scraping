import { format } from "fast-csv";

export const csvStream = format({
  headers: [
    "nama_perusahaan",
    "posisi",
    "kategori_pekerjaan",
    "tipe_pekerjaan",
    "lokasi",
    "job_description",
    "requirement",
    "salary_type",
    "salary_min",
    "salary_max",
    "email_perusahaan",
    "telepon_perusahaan",
    "posting_date",
    "end_date",
    "url",
  ],
  quoteColumns: true,
  quoteHeaders: true,
  writeBOM: true,
});
