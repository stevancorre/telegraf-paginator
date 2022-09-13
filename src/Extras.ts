import { InlineKeyboardMarkup, ParseMode } from "telegraf/typings/core/types/typegram";

export interface Extras {
    reply_markup: InlineKeyboardMarkup;
    parse_mode: ParseMode;
}
