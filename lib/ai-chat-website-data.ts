import { chatWithTextData, type ChatTextDataResult } from "@/lib/ai-chat-text-data";
import { convertWebpageToMarkdown } from "@/lib/converter";

export type ChatWebsiteDataInput = {
  url: string;
  question: string;
};

export type ChatWebsiteDataResult = ChatTextDataResult & {
  url: string;
  title: string;
  description: string;
  favicon: string | null;
};

export async function chatWithWebsiteData(input: ChatWebsiteDataInput): Promise<ChatWebsiteDataResult> {
  const page = await convertWebpageToMarkdown(input.url);
  const chat = chatWithTextData({
    text: page.markdown,
    question: input.question,
  });

  return {
    ...chat,
    url: page.url,
    title: page.title,
    description: page.description,
    favicon: page.favicon,
  };
}
