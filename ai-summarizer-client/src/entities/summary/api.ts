import { config } from "@/src/shared/utils";
import { Summary } from "./types";

export class SummaryApi {
  static async summarize(file: File): Promise<void> {
    const form = new FormData();
    form.append("file", file);

    await fetch(`${config.apiBaseUrl}/summary/summarize`, {
      method: "POST",
      body: form,
    });
  }

  static async getLatest(): Promise<Summary[]> {
    const response = await fetch(`${config.apiBaseUrl}/summary/latest`, {
      method: "GET",
    });

    return response.json();
  }

  static async getById(id: string): Promise<Summary> {
    const response = await fetch(`${config.apiBaseUrl}/summary/${id}`, {
      method: "GET",
    });

    return response.json();
  }
}
