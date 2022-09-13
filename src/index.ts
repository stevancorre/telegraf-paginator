import hash from "object-hash";
import { Composer, Context } from "telegraf";
import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";

import { Extras } from "./Extras";
import { PaginatorOptions } from "./Options";
import { Page } from "./Page";

const DEFAULT_OPTIONS: PaginatorOptions = <const>{
    header: "",
    footer: "",
    maxPagesPerRow: 4,
    parseMode: "HTML",
};

export class Paginator {
    private readonly actionId: string;
    private readonly options: Readonly<PaginatorOptions>;
    private currentPage = 0;

    public constructor(private readonly pages: ReadonlyArray<Page>, options?: Partial<PaginatorOptions>) {
        this.actionId = hash(JSON.stringify(pages) + Math.random().toString(16));

        if (options?.header?.endsWith("\n")) options.header += "\n";

        this.options = {
            ...DEFAULT_OPTIONS,
            ...options,
        };
    }

    public text(): string {
        return `${this.options?.header}${this.pages[this.currentPage].data}\n${this.options?.footer}`;
    }

    public extras(): Readonly<Extras> {
        const keyboard: InlineKeyboardButton[][] = [];
        let row: InlineKeyboardButton[] = [];
        for (let i = 0; i < this.pages.length; i++) {
            row.push({
                text: this.pages[i].title,
                callback_data: this.callbackDataForPage(i),
            });

            if (i === this.pages.length - 1 || (i + 1) % (this.options?.maxPagesPerRow ?? 4) === 0) {
                keyboard.push(row);
                row = [];
            }
        }

        return {
            reply_markup: {
                inline_keyboard: keyboard,
            },
            parse_mode: this.options.parseMode,
        };
    }

    private callbackDataForPage(page: number): string {
        return `${this.actionId}-${page}`;
    }

    public handleAction(bot: Composer<Context>): void {
        bot.action(new RegExp(this.actionId + "-([0-9]+)"), async (ctx) => {
            const newPage = parseInt(ctx.match[1]);
            if (this.currentPage == newPage) return await ctx.answerCbQuery();
            this.currentPage = newPage;

            await ctx.editMessageText(this.text(), this.extras());
        });
    }
}

export { Extras, Page, PaginatorOptions };
