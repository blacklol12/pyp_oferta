import fs from "fs";
import path from "path";

export function getTelegramConfig() {
  let botToken = process.env.TELEGRAM_BOT || "";
  let chatId = process.env.TELEGRAM_CHAT || "";

  try {
    const configPath = path.join(process.cwd(), "traffic-config.json");
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      if (config.botToken) botToken = config.botToken;
      if (config.chatId) chatId = config.chatId;
    }
  } catch (err) {
    console.error("Error reading traffic config in getTelegramConfig:", err);
  }

  return { botToken, chatId };
}
