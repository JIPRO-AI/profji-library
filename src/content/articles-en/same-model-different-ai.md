---
title: "Same Model, Different AI: The Gap Isn't the Model, It's the Context Capital You Build Around It"
description: "Two people can use the identical model and the same template, yet their outputs differ. The gap comes not from the model but from the context capital each user has built up around it. On what it means to raise an AI the way you would raise an RPG character."
pubDate: "2026-07-12"
updatedDate: "2026-07-15"
category: "인지 융합"
articleType: "essay"
tags: ["AI","context-capital","personalization","LLM","agent","accumulation"]
originalSlug: "same-model-different-ai"
---
## My Coworker at the Next Desk and I Use the Same AI. The Results Differ.

Everyone at the company uses the same Copilot. Same model. Same internal templates. Yet the draft my coworker at the next desk pulls up is different from the one I get. Some days, embarrassingly different. "Are you using some other version?" "No. The exact same one as you." Same engine, different car rolling off the line.

If you doubt it, you can test this right now. Ask the person next to you to throw the exact same question at their AI that you throw at yours. Same model, different answers come back. Settings neither of you has ever opened, traces of past conversations, a history of corrections and rephrasings — each intervenes differently for each of you.

The common explanation is prompting skill. People who write good questions get good answers. That's not wrong, but it's only half right. One well-written question produces one good answer. The people who get better results every time, consistently, increasingly over time, have something outside the question itself. Curiously, what they share in common is that they never ration their questions. They never finish in one shot.

This essay makes three claims. First, under conditions where everyone uses the same model, the AI gap is not a model gap but an accumulation gap. Even with the same model, if what the user has built up around it — memory, instructions, judgment criteria, work habits — differs, it is effectively a different AI. I will call this accumulated layer **context capital**. Second, this capital does not appear from a single well-crafted prompt. It accumulates only through a review routine of asking, re-asking, and narrowing down "what did I actually want" through repetition. Third, accumulation comes with a bill attached. The more you build up, the more locked in you become to that platform, and if you build it up carelessly, even judgment itself gets handed over wholesale. Accumulation without control is not an asset. It is a liability.

Let me narrow the definition up front. In this essay, context capital is the sum of what a user has verified and stockpiled for reuse: work context, judgment criteria, examples of what worked and what didn't, working procedures. It does not mean a long conversation history, and it does not mean having connected many tools. Why this distinction matters will become clear shortly.

## The Model Is a Rental Car

We do not own the model. We rent it. This morning, I, my coworker, and an employee at a rival company all rented the same model. It's as if we all picked up the same make and model from a car rental counter. If the car is identical but the destinations differ, the reason lies in the driving, not the car.

Tool-use research has an old distinction that captures this intuition precisely. An artifact fresh off the factory line and a tool worn into the hand are different things. The artifact is given identically to everyone. The tool is built by the user, who accumulates their own way of using it over time [1]. A carpenter's chisel and the chisel in my drawer are not the same tool even if they are the same product. The carpenter's chisel carries thousands of handlings within it.

The LLM pushes this old distinction to an extreme. No matter how much you use a chisel, it stays physically the same. But the LLM actually consumes what I leave behind. My work context accumulated in the memory feature. My criteria written into custom instructions. My documents attached to a project. These become the raw material for the next answer. One influential framing compared the model to the kernel of a new kind of computer [2]. Even with the same kernel, what you layer on top of it changes the entire system. You can rent the kernel. The system, each person builds for themselves.

The difference shows up in small things. Ask an AI with empty memory to "draft the weekly report" and you get an inoffensive report that would work anywhere. Send the same handful of words to an AI you've built up over three months, and something different comes back. That our team looks at the numbers first, that the department head hates adjectives, that I revised the item order twice last month. The draft begins already knowing all of this. The question was the same. Only the recipient was different.

So "which model do you use?" becomes a steadily less important question. The better question is this: "What have you built on top of it?"

## The Gap Already Exists Even If I Never Raise My AI

Before getting to the story of raising an AI, there's a fact worth noting. My AI and your AI are already different. This is true even if I've done nothing at all.

A recent study demonstrated this experimentally. Across twelve thousand conversations, merely having a user's occupational role show through implicitly was enough to systematically shift the same model's moral-judgment scores [3]. This means the model responds differently depending on whether a doctor or a lawyer is asking. No persona was assigned, no instruction was inserted. Identity leaking through tone of voice alone was enough to do it. The same observation has emerged for political leaning. Depending on which language you use to ask the same model, the ideological coordinates the model reveals shift [4].

Translated into this essay's terms: reflecting context is not a choice, it is already happening. The choice is not between reflecting it or not, but between neglect and design. Left unattended, the model roughly guesses at me using clues picked up from my tone of voice. That guess has never been checked, so there's no way to know where it goes wrong. Designed deliberately, the model knows me precisely, through criteria I have verified and recorded. Either way, your AI and my AI are not the same. The question is who is steering that difference.

The point at which you insert the model matters too. There's experimental evidence that calling the same model in at the initial idea-generation stage makes everyone's output converge and resemble each other, while calling it in at the selecting-and-polishing stage preserves diversity [5]. The same person using the same model gets different results depending on timing alone. Evidence that the model is not the only variable keeps accumulating this way.

To sum up, what we use is not a single model but a system stacked in layers. At the bottom sits the model, and layered above it are the context of the current conversation, accumulated criteria, connected tools, the sequencing of work, and human judgment. The studies just cited each touch a different layer. The occupation and language studies [3][4] show the layer of present context; the intervention-timing experiment [5] shows the layer of work sequencing. What this essay is after comes next: the gap that opens up when these upper layers accumulate over time and feed on time itself. That is where context capital sits. If the model widens the ceiling, accumulation determines how close you get to that ceiling. The model is a constant, the same for everyone; what generates the difference between people is the accumulation layered on top of it.

## Raising an AI Is an RPG

When people around me ask, "So what exactly am I supposed to do," I reach for a game analogy. If you want to use AI as a personal assistant, you have to raise it the way you raise an RPG character. Everyone starts with the same character: level 1, base equipment, empty skill tree. Three months later, my character and your character are different — not because we're playing different games.

Even people who have never played a game know this structure: a system where everyone starts in the same place but ends up somewhere different. Laid out as a table, the analogy becomes a to-do list.

| RPG | My AI | What You Actually Do |
|---|---|---|
| Equipment | Tool connections | Attaching calendar, documents, code repositories |
| Stats | Memory / context | Writing down and accumulating my work, my criteria, my habits of expression |
| Skill tree | Workflow | Fixing the order and format of frequently repeated tasks |
| Leveling up | Review routine | Narrowing down what I want through repeated questioning |
| Experience points | Verified records | Recording the "why" behind outputs that worked |

The rows of this table differ in kind. Equipment is infrastructure — the foundation that makes context retrievable, and it can be assembled in a day. Stats and experience points are capital — accumulated through verification, and built by time. Leveling up is not capital but operating capability — the ability, residing on the human side, to ask, revise, and verify. The three grow together but are not the same thing. Even with the same model, if infrastructure, capital, and operating capability differ, you effectively get a different AI system.

Of these, the most important cell is leveling up. Equipment can be attached in a day. Stats, too, if you set your mind to it, can have their initial setup finished in half a day. But leveling up alone is a routine and requires time. Just as in a game, the fact that there's no shortcut here is what makes it fair.

An old conclusion from expertise research sits precisely in this cell. Skill comes not from time spent but from deliberate practice [6]. Simply doing something for a long time and repeating it with a goal and feedback are different activities. The same holds for using AI. Use it daily for three years while just taking the first answer and pasting it in, and you accumulate no experience points. Conversely, use it for just three months but ask, every time you get an answer, "Is this what I wanted? What's missing? What should I hand over up front next time?" — and that person's AI is already a different object.

The leveling-up loop is short. Get an answer. Evaluate what was good and bad about it. Save the evaluation criteria, not the answer. Use it as the starting point for the next task. There are only four steps, yet most usage ends at the first one. An AI's first answer is usually plausible, and because it's plausible, you want to stop there. But repetition does more than improve the answer. In the way that you might say "summarize this" on the first try and only realize on the third that what you actually wanted was a counterargument, the outline of what you wanted becomes clear for the first time only through that process. Usage that stops at the first answer is usage that returns the rental car. Nothing is left behind. Saving begins only from the second step onward.

I should also mention that the same thing that happens to a neglected character in a game happens here. Stats get contaminated. Information left over from a former job lays down the wrong premises for current work, and a preference mentioned once in passing hardens into a permanent setting. A character that isn't raised doesn't stay at level 1 — it grows strangely. There is no pause button in this game.

There is no level cap either. As long as my work keeps changing, my criteria keep changing, and as long as criteria change, there is always more to build. That there is no end sounds like bad news, but it's the opposite. Because there is no end, a path to catching up stays open even for someone who starts late.

## Can't I Just Copy Someone Else's Setup?

There's an obvious objection: why not just copy, wholesale, the custom instructions of someone who has raised their AI well? The "insane prompt collections" circulating online are mostly built on this idea. Everyone has probably bookmarked one. If you stop to recall whether that collection, asleep in your bookmarks, ever actually changed your output, the answer is already in front of you.

Anyone who has tried copying knows: someone else's setup, strangely, never performs quite as well in your own hands. You can borrow someone else's character and get temporarily stronger, but the feel of controlling it is never really yours, in the end. The reason lies in an old finding from technology-acceptance research. What makes people keep using a tool is the perception that "this is useful for my work," and that perception strengthens only when it is confirmed directly within one's own work [7]. The sentences of a setup can be copied, but the history of why those sentences are there cannot be. The value of context capital lies not in the sentences themselves but in the record of repetition and failure that produced them. What gets copied is only the explicit knowledge — the part written down as sentences. The tacit knowledge — the history of repetition and failure that made those sentences, the operating instinct embedded in the body — does not transfer. The core of the capital, each person has to earn on their own.

## Principle 1: Accumulate at the Account Level, Not the Session Level

Every time a single conversation ends, do not throw away, along with the session, what you learned within it — your preferences, your banned words, the parts you repeatedly have to correct. It doesn't matter whether the format is custom instructions, memory, or a separate note. What matters is transcribing it somewhere the next conversation can inherit. If you just corrected the AI with "sentences, not a table," that correction belongs in the settings, not in this conversation alone. Let today's correction become tomorrow's default.

## Principle 2: Leave Behind Criteria, Not Answers

When you get a good output, don't save the output — save the reason it was good. Not "I liked the tone of this report" but "it worked because the numbers came first, the interpretation was two sentences, and adjectives were banned." An answer cannot be reused for the next task, but a criterion can. Many people collect their best outputs in a folder. That folder never gets reopened. Stats accumulate as criteria, not as nouns.

## Principle 3: Occasionally Open the Stats Window

About once a month, ask your AI, "Tell me what you know about me." What comes back is your stats window. It will likely show a face stranger than you expected. Delete anything outdated, fill in any missing criteria. A project from two months ago will probably still be listed as "in progress." Everyone performs this check in games; almost no one does it with AI. Neglected stats can be worse than no stats at all, because they are confidently wrong about you.

## Principle 4: Occasionally Hunt Without Your Gear

About once a month, try working without AI. Write the draft bare-handed and make the judgment call on your own. In game terms, this is entering the hunting ground without your gear on, and the point is not self-punishment but inspection. There is no way other than this to check where your own skill ends and where the power of accumulation begins. This routine is also the first to catch the moment accumulation starts making judgments in your place. Capital has to be grown, but you also have to occasionally check that the capital doesn't own you.

## This Gap Soon Becomes a Team Problem

It would be convenient if this stayed a story about individuals, but it doesn't. Pull apart the phrase "AI proficiency preferred" in a job posting, and what it's actually asking is not whether you know how to operate the tool. It's asking whether you have ever built up your own criteria. Because the tool is issued on your first day, but the capital is not.

Departures are more troublesome still. When someone who has spent three years raising an AI leaves, what should go into the handover document? An organization cannot copy an individual's entire context capital. Only as much of the judgment criteria and work history as has been extracted into documents transfers over as an operational asset. The rest — the history behind making those documents, the operating sense embedded in the body — does not transfer. The successor restarts in that role with a level-1 character. The problem addressed in "Judgment Reproduction Crisis" — judgment leaving alongside the person — recurs here as well. Most organizations still do not treat this capital as a formal asset. The gap arrived first, and, as always, the institutions come later.

## Limitations — The Bill for Accumulation

Three invoices come attached to this essay's framework.

The first is lock-in. Unlike an RPG, the experience points in this game do not transfer between accounts. Someone who has spent three years building up on one platform finds it hard to move even when a better model appears next door. The more you build, the better it works; the better it works, the more locked in you become. Here it helps to split capital into two kinds. Memory and conversation history inside a specific service account are platform-locked capital: highly productive, but you cannot take them with you when you move. Notes I own, criteria documents readable anywhere, records of judgment — these are user-owned capital: not complete, but portable across platforms. What accumulates only inside a platform may be an asset I use, but it is not an asset I fully own. It is also worth remembering that every service that encourages accumulation is simultaneously a beneficiary of this cost. So the true owner of context capital is not the person who has accumulated the most. It is the person who can decide what to keep, what to delete, and where to move it.

The second is the slide into delegation. As you build up criteria, at some point you start wanting to hand over not just the application of criteria but the judgment of what the criteria should be. Cross that line, and the capital in this essay turns into the liability described in "Decision Debt." Having AI memorize my criteria and having AI decide my criteria are different things. The former is accumulation. The latter is a transfer of ownership.

The third is depreciation. Accumulated capital ages even when left alone. When the model updates, prompts that used to work well go off-kilter, and parts of a fixed workflow break. When my work changes, old criteria become baggage. So this capital resembles a field more than a savings deposit. Separate from growing it, if you don't tend it, it shrinks.

One more thing about this essay's evidentiary basis needs flagging. The felt sense of an accumulation gap is still at the stage of personal observation and small-scale experiments. No controlled study has split two groups using the same model by level of accumulation and measured the resulting difference in output quality. This essay is a working hypothesis ahead of that research. The studies cited here are adjacent evidence that context and timing change outcomes — they do not directly measure the gap produced by long-term accumulation.

## While Waiting for the Next Model

Every time a new model comes out, the same question circulates: should I switch? They say the benchmark score went up by a few points. That interest isn't wrong. But as access to models levels out, the share of the gap that the model itself accounts for shrinks. What is given equally to everyone approaches a constant rather than a variable. When the exam material is the same for everyone, the textbook can't determine the ranking.

The gap comes not from the constant but from what is built on top of it. And that accumulation can only begin on the model you're using right now. The question of when is the best time to start can only get the same answer as planting a tree: the best time was the day you created your first account, and the next best time is today. While someone waits for the next model, someone else is raising the current one. On the day the new model arrives, that person doesn't start from zero. They move in carrying their criteria and their routines. In the end, there's one reason your AI and my AI are different. Only one of them had an owner.

## References

[1] Rabardel, P. (1995/2002). *People and Technology: A Cognitive Approach to Contemporary Instruments*. — The original source of the distinction between artifact (a given object) and instrument (something the user builds by accumulating a way of using it), and of instrumental genesis theory.

[2] Karpathy, A. (2023). "Intro to Large Language Models." — The "LLM OS" framing that views the LLM as the kernel of a new kind of computer. The system built on top of the kernel is configured by the user.

[3] Fourie, W., Ray, I., & Manicom, G. (2026). "User identity conditions moral wrongness ratings in non-reasoning large language models." *arXiv:2607.07605*. — An experiment across 12,000 conversations. When a user's occupational role is conveyed implicitly, the same model's moral-judgment scores shift systematically.

[4] Levy Yeyati, E., Ciappa, C. M., & Onofri, M. (2026). "Same Model, Different Politics? How Language Shapes AI Ideology." Universidad Torcuato Di Tella, School of Government Working Paper. — A measurement study showing that the same model's expressed ideology varies with the language of the question.

[5] Boussioux, L., Doshi, A., Hauser, O., & Hosanagar, K. (2026). "The Hidden Cost of AI-Assisted Creativity." *MIT Sloan Management Review*. — A multi-domain experiment showing that inserting AI at the early generation stage shrinks the diversity of collective output, while intervening at the selection stage preserves diversity.

[6] Ericsson, K. A., Krampe, R. T., & Tesch-Römer, C. (1993). "The Role of Deliberate Practice in the Acquisition of Expert Performance." *Psychological Review*, 100(3), 363–406. — Expertise comes not from cumulative time but from deliberate practice combining goals, feedback, and repetition.

[7] Davis, F. D. (1989). "Perceived Usefulness, Perceived Ease of Use, and User Acceptance of Information Technology." *MIS Quarterly*, 13(3), 319–340. — The founding statement of the technology acceptance model: what sustains tool use is perceived usefulness confirmed within one's own work.
