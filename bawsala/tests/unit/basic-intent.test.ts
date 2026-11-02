import { describe, expect, it } from "vitest";
import { detectIntent } from "@/server/ai/basic";

describe("basic engine intent routing (5 languages + Arabizi)", () => {
  const cases: Array<[string, string]> = [
    ["How does ANAPEC work?", "knowledge"],
    ["Comment devenir auto-entrepreneur ?", "knowledge"],
    ["Which roles fit me best?", "opportunities"],
    ["chno homa l khdmat li kaynin liya?", "opportunities"],
    ["شنو هي الخدمات اللي مناسبة ليا؟", "opportunities"],
    ["What am I missing for my target role?", "gap"],
    ["dir liya plan dyal 30 yom", "plan"],
    ["خطة ديال 30 يوم", "plan"],
    ["Train me for an interview", "interview"],
    ["Review my CV", "cv"],
    ["How am I doing?", "help"],
    ["chno homa l maharat dyali?", "skills"],
    ["Compare my top options", "compare"],
  ];
  it.each(cases)("%s → %s", (text, kind) => {
    expect(detectIntent(text).kind).toBe(kind);
  });
  it("a long description of an experience is a skill analysis", () => {
    expect(detectIntent("Je travaille le week-end au magasin de mon oncle, je gère la caisse et je conseille les clients sur les produits.").kind).toBe("skills");
  });
});
