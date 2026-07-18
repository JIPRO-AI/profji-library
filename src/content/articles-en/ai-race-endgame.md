---
title: "The AI Race Endgame"
description: "When model performance is commoditized, the axis of competition shifts from the model itself to distribution, compute, and regulation. Starting from data on collapsing inference costs and converging benchmarks, this piece redefines the endgame of the AI race — not as a contest to build the better model, but as a fight for an irreplaceable position."
pubDate: "2026-03-07"
category: "AI 기술"
articleType: "analysis"
tags: ["AI","research","analysis"]
originalSlug: "ai-race-endgame"
---

## From $20 to 7 Cents

In November 2022, sending a million tokens' worth of queries to a model performing at GPT-3.5 level cost $20. By October 2024, the same level of performance sold for 7 cents. That's a 280-fold drop in eighteen months[2]. Over the same period, the upper end of the performance leaderboard compressed to near-collapse. On major benchmarks, the gap between the top-ranked model and the tenth-ranked model narrowed from 11.9% to 5.4% within a year, and the gap between first and second place was just 0.7%[2].

These two figures are this article's starting point. Three propositions follow from them. First, model performance is being commoditized. Performance keeps rising, but the differences in performance are disappearing, and the price of a good whose differences have disappeared falls toward marginal cost. Second, in a commoditized market, the axis of competition shifts to bottlenecks outside the product itself. In the AI industry, those bottlenecks are three: distribution, compute, and regulation. Third, the endgame of this race is therefore not a state of having built the better model, but a state of occupying an irreplaceable position.

Let's start by defining "endgame." In chess, the endgame is not a state in which the game has ended, but a phase in which the pieces have been cleared away and the character of the remaining moves has been settled. The endgame of the AI race, likewise, does not mean a state in which the winner has been decided, but a phase in which what determines winning and losing has been settled. This article's argument is that this phase has already begun, and that the model itself is being removed from the variables that decide the contest.

## The Economics of Commoditization: A Performance Lead Is Not an Asset, It's Living on Borrowed Time

The cost structure of information goods was worked out long ago. Producing them requires large fixed costs, but reproducing them costs almost nothing. When such a good fails to differentiate itself, competition drives the price down toward marginal cost, and the market becomes a commodity market[1]. Language models fit this definition precisely. Training costs hundreds of millions of dollars, but the marginal cost of inference is low and keeps falling. A benchmark gap of 5.4% is a difference most users cannot feel, and a difference that cannot be felt cannot sustain a price premium.

The speed at which a performance edge disappears is also structural. When a leading model pulls ahead with a new technique, competitors reach comparable performance within months. Public benchmarks, distillation practices, and the movement of research talent all accelerate the diffusion. In its analysis of the foundation model market, the UK's Competition and Markets Authority (CMA) found that access to inputs — chips, cloud compute, data, and talent — matters more to competition than development capability itself[5]. The ability to build a good model is not scarce. What's scarce is the material to build it with, and the channels to sell it through.

Translated into the language of corporate strategy, this situation yields a single conclusion. A performance gap is not a defensible asset but a fast-depreciating lead on borrowed time. The only rational thing to do with a lead on borrowed time is to convert it, while it still lives, into a more durable position. Securing a user base through free distribution, locking in long-term compute contracts, and taking a seat at the table where standards and regulations are discussed — all of these are moves in that conversion.

## Three Bottlenecks: Where Competition Relocates

If the model is a commodity, profit arises at the narrow neck the commodity must pass through. Comparing the character of the three bottlenecks yields the following.

| Axis of Competition | Source of Scarcity | Durability of Advantage | Representative Strategy |
|---|---|---|---|
| Model performance | Training techniques, talent | Low. Eroded by imitation and distillation[2][5] | Maintaining the benchmark lead |
| Distribution | Default placement, two-sided network effects[3] | High | Pre-installation on OS, browsers, workplace tools |
| Compute | Extremely concentrated chip supply chain[4] | Medium to high | Long-term supply contracts, vertical integration |
| Regulation | Asymmetric compliance costs[6] | High | Participating in standard-setting, designing licensing requirements |

The first bottleneck is distribution. As platform economics has shown, a two-sided market platform can design a price structure that subsidizes one side and extracts revenue from the other, and when the network effects on both sides interlock, they erect an entry barrier that latecomers find hard to breach[3]. In the AI deployment race, chatbots released free to consumers are not charity — they are the subsidized side of a two-sided market. A model bundled as the default on an operating system, browser, office suite, or search bar becomes the leader in usage even if it ranks second in performance. The power of the default is a script already proven in the search market.

The second bottleneck is compute. Compute is distinctive among AI's inputs in being the only one that is physical. Data and algorithms can be copied and leaked, but compute is detectable, excludable, and quantifiable, and it can only be produced through an extremely concentrated supply chain[4]. These four properties make compute an instrument of state governance and, turned around, a point of strategic control for firms. This is why export controls on advanced chips have become a lever of state-level competition, and, as seen in "US-China AI Race: Neither Purely Open Nor Purely Closed," a variable that determines the mix of openness and closure. At the firm level, this appears in the form of partnerships between cloud giants and model developers. The CMA placed the Microsoft–Mistral AI, Microsoft–Inflection AI, and Amazon–Anthropic combinations under monitoring because it judged that a bond mediated by the provision of compute — even absent an equity acquisition — could alter market structure[5].

The third bottleneck is regulation. Stigler's old proposition grows young again here. Regulation is, as a rule, acquired by the industry, and is designed and operated primarily for that industry's benefit[6]. Regulatory devices such as safety assessments, audits, and registration requirements are neutral in themselves, but the moment compliance costs take on the character of a fixed cost, they function as entry barriers favoring large incumbents. The phenomenon of frontier firms participating voluntarily — sometimes taking the lead — in regulatory discussions is not explained by civic responsibility alone. Taking a seat at the table where rules are written is itself a competitive strategy. Whoever designs the height of a licensing threshold is someone who has already cleared it.

## Principles: How to Read an Endgame Position

If this analysis is right, AI companies, their customers, and regulators each need to change their criteria for judgment. What follows are four principles for reading a position.

### Principle 1: Measure a Performance Gap by Its Half-Life

For any performance advantage, the question to ask is not its size but its duration. The time it takes competitors to reach the same level is the advantage's real value. Given the speed of benchmark convergence[2], a business plan built on a performance lead is credible only if it also presents a revenue model for after the lead has vanished.

### Principle 2: Evaluate Position by Bottleneck Ownership

When judging a company's value, look not at the model leaderboard but at its command of each of the three bottlenecks. Does it hold the default position in distribution? Does it own compute, or has it locked it in through long-term contracts? Does it participate in designing regulation? A company with none of the three and only a good model is a commodity supplier, and time whittles away a commodity supplier's margin.

### Principle 3: Read Partnerships by Exclusivity, Not Equity Share

In an alliance between a cloud provider and a model developer, what matters is not the amount invested but the structure of the contract. Exclusive compute supply clauses, priority access to the model, and the movement of personnel are what create real control[5]. The focus of review should be whether a tie-up between formally independent companies produces the same effect as a merger while bypassing merger review.

### Principle 4: Read Regulatory Demands as Strategy, Not Cost

When a company supports a specific regulation, calculate side by side the cost that regulation imposes on that company and the cost it imposes on potential competitors. If the former is already a sunk cost and the latter is a threshold for new entry, it is safe to read that support as a signal of capture[6]. This is not a reason to oppose regulation itself, but it is a reason to ask who wrote the text of the rule.

Add one scene from practice. Suppose an IT department at some company selects a model vendor, deciding the contract on the basis of a 2% difference in benchmark scores. Six months later, when the rankings flip, what the organization discovers is that its prompt library, evaluation pipeline, and fine-tuning data are all optimized for the incumbent vendor. Lock-in arises from the accumulation of small switching costs, and its size is a strategic variable the supplier designs[1]. If the selection criteria included only performance scores and no switching-cost clause, what an audit should interrogate is not the model choice but responsibility for the contract's design.

## Limitations

This article's argument has three points open to challenge. First, the commoditization premise could break down. Benchmark convergence[2] may reflect the saturation of the measurement instrument rather than the convergence of capability. If a discontinuous leap occurs on some new axis of capability that existing benchmarks cannot discriminate — long-horizon autonomous task execution, for instance — performance returns to the center of competition. Even in that case, the value of the bottlenecks does not disappear, but the timing of the phase shift this article describes is pushed back.

Second, the spread of open-weight models partially erodes the distribution and compute bottlenecks. For organizations that download the weights and run them on their own infrastructure, the power of default placement and cloud lock-in weakens. Still, the concentration of compute required for large-scale training is not something the open-model camp escapes either[4], and insofar as the open strategy itself may be a complementary-goods strategy of large incumbents, this looks less like a refutation of the bottleneck logic than a variation on it.

Third, the regulatory-capture reading has a falsifiability problem. If a company supporting regulation counts as capture and a company opposing it counts as defending its profits, then the theory can be rejected by nothing[6]. The capture claim holds up only when the cost asymmetry can be demonstrated at the level of individual provisions, and Principle 4 in this article calls for that verification procedure rather than assuming the conclusion in advance. In addition, the figures this article relies on share the limitation of being a snapshot from a particular point in time[2].

## Conclusion: What It Takes to Be the One Left Standing

It is time to invert the question posed at the outset. "Who builds the best model?" was the midgame question. The endgame question is: "Once all the models look alike, whom can nothing get done without passing through?" In a market where $20 becomes 7 cents, the model stops being the means of winning and becomes the entry fee. Once the entry fee is paid, the contest is decided at the default position where users stay, the narrow supply chain the chips pass through, and the table where the rules are written.

So the final form of this competition is a contest of position rather than a contest of technology, and the winner of a position contest is not recorded on any technology leaderboard. Here is the last twist. The winner of the AI race will not be the company that built the best model, but the company that arranged the board so that it doesn't matter which model wins. To that company, fluctuations in the model leaderboard are not a threat but noise. What we miss while staring hard at the leaderboard is the board itself.

## References

[1] Shapiro, C., & Varian, H. R. (1999). Information Rules: A Strategic Guide to the Network Economy. Harvard Business School Press.

[2] Stanford Institute for Human-Centered Artificial Intelligence (HAI). (2025). Artificial Intelligence Index Report 2025. Stanford University.

[3] Rochet, J.-C., & Tirole, J. (2003). Platform Competition in Two-Sided Markets. Journal of the European Economic Association, 1(4), 990-1029.

[4] Sastry, G., Heim, L., Belfield, H., Anderljung, M., Brundage, M., et al. (2024). Computing Power and the Governance of Artificial Intelligence. arXiv:2402.08797.

[5] Competition and Markets Authority (CMA). (2024). AI Foundation Models: Technical Update Report. UK Competition and Markets Authority.

[6] Stigler, G. J. (1971). The Theory of Economic Regulation. The Bell Journal of Economics and Management Science, 2(1), 3-21.
