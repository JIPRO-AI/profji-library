---
title: "LLM Hallucination Control: Reliability Is Decided at Verification Routing"
description: "Hallucination is not a model bug but a systemic failure of verification routing. Taxonomy, claim-level pipeline, and measurement framework."
pubDate: "2026-03-11"
category: "AI 기술"
articleType: "framework"
tags: ["AI","research","analysis"]
originalSlug: "llm-hallucination-detection"
---

## LLM Hallucination Control: Reliability Is Decided at Verification Routing

For the problem of hallucination—LLMs generating information that diverges from fact as though it were fact—the industry's two dominant approaches are these: one is "wait for a better model," the other is "just attach RAG." Both are insufficient.

Better models reduce the frequency of hallucination, but the lower that frequency gets, the harder it becomes to detect the hallucinations that remain—rare errors are hard to catch. RAG adds grounding but does not guarantee truth [2]. If the retrieved source itself is wrong, the model misreads the source, or retrieval simply fails, RAG ends up lending authority to falsehood instead.

This article's core argument is this: **hallucination is not a bug that a single detector can solve, but a systemic phenomenon produced by accumulated failures of verification routing.** The solution, accordingly, does not lie in a better model or a single technique, but in a system architecture that measures uncertainty at the claim level, branches the verification path according to risk, and halts the response when confidence is insufficient.

This article does not aim for the "complete elimination" of hallucination. The realistic goal is **bounded reliability**: converting errors into verifiable ones, suppressing the probability of high-risk errors below an acceptable threshold, and structurally blocking false confidence.

## 1. Hallucination Is Not One Thing: Six Types and Their Detection Paths

Lumping hallucination together as a single phenomenon blurs the detection strategy along with it. In practice, at least six types need to be distinguished, because each type calls for a different way of catching it.

| Type | Definition | Detection Path |
|------|------|----------|
| **Fabrication** | Generating facts, sources, or figures that do not exist | Cross-check against external DB/knowledge base [7] |
| **Unsupported Inference** | Grounding exists, but the conclusion overreaches it | Claim-evidence consistency check [1] |
| **Retrieval Contamination** | The retrieved source itself is wrong or biased | Source credibility assessment + cross-verification [2] |
| **Instruction-induced Overclaim** | Pressure to answer causes confident assertion of uncertain content | Compare uncertainty score vs. expressed confidence |
| **Reasoning Drift** | Logic goes off track during intermediate reasoning | Step-by-step reasoning verification |
| **Tool-use Fabrication** | Inventing results for tools that were never executed | Cross-check against execution logs |

Why does this distinction matter? Fabrication can be caught by cross-checking against an external DB, but unsupported inference cannot be caught the same way—the cited source is real; it's the conclusion that overreaches it. Reasoning drift can leave a trace in internal signals (token-probability fluctuation), but instruction-induced overclaim is wrong with high confidence, so the internal probability stays stable instead.

**Internal probability is not a measure of truth, only a warning signal.** Acknowledging this limitation is the starting point of reliability design.

## 2. Four Verification Dimensions: Strengths and Failure Modes

Four verification dimensions can be brought to bear against hallucination. None is sufficient on its own.

| Dimension | Strength | Failure Mode | Cost/Speed |
|------|------|----------|----------|
| **Internal Probability** | Fast, low-cost, real-time | Probability and truth diverge [4]; meaningless on out-of-distribution (OOD) input | Lowest |
| **RAG/External Retrieval** | Provides grounding, detects fabrication | Retrieval failure; source contamination; context overload [2] | Medium |
| **Multi-agent Cross-verification** | Compares independent perspectives | Shares common error distribution; false consensus | High |
| **Human Review** | Detects nuance, ethics, logical traps [5] | High cost, low speed, does not scale | Highest |

### Limits of Internal Probability

An LLM is a statistical predictor. It merely selects the most plausible next token; it does not know whether that token is true. Low token probability does not always mean error, and high probability does not always mean truth [4]. Especially in complex reasoning or code generation, the model explores multiple paths and the probability distribution naturally wobbles as a result, so relying on internal signals alone can drive up false alarms.

There is also an approach that uses small language models (SLMs) as auxiliary detectors; it works well for simple queries, but precision drops sharply on abstract concepts or logical traps [4]. Internal signals should be used in a restricted role, as an "identifier of high-uncertainty zones," not as an "obvious-error filter."

As a speculative reading of its own, this article ventures a connection between critical-transition theory from complex-systems science and hallucination detection. One strand of that theory holds that complex systems—ecosystems, financial markets—display statistical warning signs just before they tip into an unstable state: rising autocorrelation, a spike in variance, a shift in skewness. Carrying that lens over to LLM output streams, one could hypothesize that it might be possible to catch precursor signals just before a hallucination occurs. But this is not a technique validated on LLMs—it is closer to an analogy borrowed from theory built for another field. It should be read as no more than one candidate for an early-warning system that reaches beyond simple probability-value monitoring.

### Failure Modes of RAG

RAG fails in three ways [2].

**Retrieval absence**: When no relevant documents are found, RAG falls back on internal knowledge and reproduces hallucination. What's more dangerous is when the fact that "no retrieval results were found" never gets communicated to the user.

**Source contamination**: If the knowledge base itself is inaccurate or carries bias, RAG attaches a source to the falsehood and raises its perceived credibility [6]. A simple retrieval-consistency check cannot block this case [1].

**Context overload**: When too many documents fill the context window, the model misses key information or over-integrates irrelevant content [2]. The RETA-LLM research warns that retrieval scope and context-allocation strategy critically shape the reliability of the result.

**RAG adds grounding but does not guarantee truth.** Properly designed external verification—claim cross-checking against a relational-DB schema, as in Thucy, for example [7]—can be a powerful reliability tool, but even this only works in domains where structured data exists.

### Limits of Multi-agent Cross-verification

Comparing the outputs of different models to detect errors is an attractive strategy, but it has three pitfalls.

First, **shared error distribution**. Models trained on the same data can be wrong in the same direction. Model A and Model B agreeing is no guarantee that the agreement is true.

Second, **false consensus**. Multiple models can look at each other's outputs and arrive at a consensus of the form "everyone's saying roughly the same thing, so it must be right." Consensus is a necessary condition for accuracy, not a sufficient one.

Third, **cost and latency**. Applying cross-verification to every output multiplies cost several times over and increases response time proportionally. Cross-verification, too, must therefore be an object of routing—applied not to every answer, but only to the answers with high uncertainty.

**Consensus does not guarantee accuracy.** Disagreement, however, is a strong warning signal. The real value of multi-agent verification lies not in "being confident when they agree" but in "triggering escalation when they disagree."

## 3. Claim-level Verification Pipeline

Judging an entire answer as "hallucination / not hallucination" is too blunt an instrument. Accurate claims and hallucinated ones can coexist within a single answer. The unit of verification must therefore be the **claim**, not the answer.

### Pipeline Structure

```
Answer Generation
  → Claim Segmentation (split into individual claims)
  → Claim Confidence Scoring (per-claim uncertainty score)
  → Routing Decision (score-based verification-path branching)
     ├─ Low risk: output directly
     ├─ Medium risk: external verification (RAG/DB cross-check) [7]
     ├─ High risk: multi-agent cross-verification
     └─ Very high risk: human escalation [5]
  → Evidence Matching (claim-evidence consistency check) [1]
  → Aggregate Decision
     ├─ Respond (verification passed)
     ├─ Partial response (some claims removed/weakened)
     ├─ Hold + escalation
     └─ Refuse to respond (selective abstention)
```

This pipeline rests on three core design principles.

### Principle 1: If Uncertain, Don't Speak

Selective abstention is the first principle. The pressure to answer every question is what causes instruction-induced overclaim. When confidence isn't sufficient, stating explicitly that "this part needs verification" beats false confidence.

### Principle 2: Verification Cost Is Proportional to Risk

Ask about the weather in casual chat, and an internal filter alone is enough. Ask about a drug interaction in a medical-diagnosis assistant, and it requires DB cross-checking plus human confirmation [5]. Applying identical verification to every answer is both a waste of cost and a source of added latency.

### Principle 3: Feedback Trains the System

Collecting human-verification results, false-alarm logs, and escalation records, and feeding them back into RLHF, improves the system's own uncertainty estimation. Thresholds, too, can be adjusted dynamically [3]. Without this feedback loop, the pipeline stays a static filter; with it, it becomes an adaptive reliability system.

### Domain-specific Branching

- **Informal chat/general queries**: Apply only Stage 1 (internal filter). Prioritize low latency.
- **Business reports/analysis**: Apply up through Stage 2 (external verification). Cite the evidentiary source for key claims.
- **Medical/legal/financial**: Stage 3 (multi-agent) plus mandatory human confirmation. Record an evidence trail for every claim [5][6].

## 4. Measurement Framework: Standardization Starts with Measurement

The claim "we reduced hallucination" means something different depending on what was actually measured. Before we can talk about standardization, we need a measurement standard.

| Metric | Definition | Meaning |
|------|------|------|
| **Claim-level Hallucination Rate** | Share of total claims that fail verification | Core reliability metric |
| **Abstention Rate** | Share of responses refused/held | Too high erodes usefulness; too low signals overconfidence |
| **False Alarm Rate** | Share of accurate claims misclassified as hallucination | Precision of the verification system |
| **Evidence Coverage Rate** | Share of claims backed by external evidence | Degree to which responses are evidence-based |
| **Retrieval Mismatch Rate** | Share of cases where retrieval results and claim disagree | Detects RAG failure modes |
| **Human Escalation Rate** | Share referred to human review | Level of automation and human burden |
| **Mean Verification Latency** | Average time verification takes | Feasibility of real-world deployment |
| **Cost per Verified Answer** | Cost per fully verified answer | Economic sustainability |

What these metrics are really for is **making trade-offs visible**. Raise the abstention rate and the hallucination rate falls, but so does usefulness. Raise the human-escalation rate and reliability rises, but so do cost and latency. The optimal point differs by domain and use case, and tracking these metrics is the only way to find it.

## 5. Conclusion

This article's position on the LLM hallucination problem compresses into three sentences.

- **Confidence is not truth.** Internal probability is a warning signal, not a criterion for judging truth.
- **Retrieval is not verification.** RAG adds grounding but does not guarantee the accuracy of that grounding.
- **Consensus is not accuracy.** Multi-agent consensus is strong at detecting disagreement, but agreement does not by itself mean accuracy.

That is why multi-layered verification routing is necessary. The claim-level verification pipeline proposed in this article is a structure that measures uncertainty at the claim level, branches the verification path according to risk, and halts the response when confidence is insufficient. Laid out layer by layer, that structure looks like this:

- **Layer 1: Uncertainty Sensing** — internal probability + volatility monitoring
- **Layer 2: Evidence Retrieval** — RAG + structured DB cross-check [7]
- **Layer 3: Claim Verification** — claim-evidence consistency check [1]
- **Layer 4: Cross-model Adjudication** — multi-agent disagreement detection
- **Layer 5: Human Escalation** — expert review in high-risk domains [5]
- **Layer 6: Feedback & Governance** — RLHF + measurement + dynamic threshold adjustment

Most current research in this area concentrates on improving the performance of individual layers [1][2][4]. The integrated pipeline and measurement framework proposed here are design principles drawn from existing research, not a system whose entirety has been empirically validated. Precursor-signal-based early warning and claim-level routing, in particular, remain at the level of conceptual proposals.

Even so, the direction is clear. **The core of LLM reliability lies not in making the model sound more plausible, but in designing when to make it stop talking.** The standard of the future is more likely to be a system with more sophisticated verification routing than simply a bigger model.

## References

[1] Rodion Oblovatny, Alexandra Kuleshova, Konstantin Polev (2025). Probabilistic distances-based hallucination detection in LLMs with RAG.
[2] Jiongnan Liu, Jiajie Jin, Zihan Wang (2023). RETA-LLM: A Retrieval-Augmented Large Language Model Toolkit.
[3] Kaustubh D. Dhole (2025). To Retrieve or Not to Retrieve? Uncertainty Detection for Dynamic Retrieval Augmented Generation.
[4] Ming Cheung (2025). Hallucination Detection with Small Language Models.
[5] Suhas BN, Han-Chin Shing, Lei Xu (2025). Fact-Controlled Diagnosis of Hallucinations in Medical Text Summarization.
[6] Haoran Huan, Mihir Prabhudesai, Mengning Wu (2025). Can LLMs Lie? Investigation beyond Hallucination.
[7] Michael Theologitis, Dan Suciu (2025). Thucy: An LLM-based Multi-Agent System for Claim Verification across Relational Databases.
