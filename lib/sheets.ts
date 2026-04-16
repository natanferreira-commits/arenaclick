import { google } from "googleapis";

export async function saveLeadToSheets(data: {
  name: string;
  email: string;
  whatsapp: string;
  instagram: string;
  niche: string;
  source: string;
}) {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!);

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: "Leads!A:G",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          new Date().toISOString(),
          data.name,
          data.email,
          data.whatsapp,
          data.instagram,
          data.niche,
          data.source,
        ],
      ],
    },
  });
}
