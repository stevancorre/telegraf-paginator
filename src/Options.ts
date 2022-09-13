import { ParseMode } from "telegraf/typings/core/types/typegram";

export interface PaginatorOptions {
    header: string;
    footer: string;
    maxPagesPerRow: number;
    parseMode: ParseMode;
}
