import hash from "object-hash";
import { Composer, Context } from "telegraf";
import { InlineKeyboardMarkup, ParseMode } from "telegraf/typings/core/types/typegram";

export interface Page {
    title: string;
    data: string;
}

export class Paginator {
    private readonly actionId: string;
    private currentPage = 0;

    public constructor(private pages: ReadonlyArray<Page>, private header?: string) {
        this.actionId = hash(hash(pages) + hash(header ?? Math.random().toString(64)));
    }

    public text(): string {
        return `${this.header ? (this.header.endsWith("\n") ? this.header : this.header + "\n") : ""}${
            this.pages[this.currentPage].data
        }`;
    }

    public extra(): {
        reply_markup: InlineKeyboardMarkup;
        parseMode: ParseMode;
    } {
        return {
            reply_markup: {
                inline_keyboard: [
                    this.pages.map((x: Page, i: number) => ({
                        text: x.title,
                        callback_data: this.callbackDataForPage(i),
                    })),
                ],
            },
            parseMode: "HTML",
        };
    }

    private callbackDataForPage(page: number) {
        return `${this.actionId}-${page}`;
    }

    public handleAction(bot: Composer<Context>): void {
        bot.action(new RegExp(this.actionId + "-([0-9]+)"), async (ctx) => {
            const newPage = parseInt(ctx.match[1]);
            if (this.currentPage == newPage) return await ctx.answerCbQuery();
            this.currentPage = newPage;

            await ctx.editMessageText(this.text(), this.extra());
        });
    }
}
