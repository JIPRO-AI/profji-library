---
title: "Physical AI Cannot See 95% of the Risk"
description: "Robots raise the metrics that are measured while accumulating the risks that are not. On measurement asymmetry in Physical AI, and the human judgment that must calibrate it."
pubDate: "2026-05-30"
category: "AI 심리학"
articleType: "analysis"
tags: ["Physical AI","측정 비대칭","거버넌스","자동화 편향","전문성 재생산"]
originalSlug: "physical-ai-measurement-asymmetry-and-governance"
---

## The 95 Percent That Robots Cannot See

Researchers gave foundation-model-driven robot agents physically dangerous situations and asked them to plan tasks. The result is shocking: the average rate at which the agents failed to notice the danger and simply executed the plan anyway was 95.75 percent [1]. Even the most advanced, supposedly smartest models were no exception. They sailed past situations that would break a cup or strike a person, almost every time.

There is a heavier point still. The researchers tried attaching two prompt-based mitigation strategies to reduce the risk. They helped, but only marginally [1]. This means risk awareness is not the kind of defect that a few smarter lines of instruction can patch over. The organ that sees risk is, from the outset, built into the model only in rudimentary form.

Yet the same robot's success metrics — tasks completed, average speed, completion rate — improve cleanly. The visible numbers rise while the invisible risk accumulates. **The problem is that the two never appear in the same report.**

Physical AI is cognition that carries through to action. When a text-based AI errs, you refresh the page and move on. When a robot errs, a cup breaks, equipment stops, a person gets hurt. The moment irreversibility — the property that once something happens it cannot be undone — enters the center of the system, the gap between what is measured and what is not stops being a statistical problem and becomes a safety problem.

This article makes one core argument: **What makes Physical AI dangerous is not that the model is incompetent, but that its incompetence goes unmeasured.**

## Measurement Asymmetry — First, What It Is Not

To see measurement asymmetry clearly, we must first establish what it is not. The moment a concept gets absorbed into a familiar frame, the critical eye that examines it disappears.

Measurement asymmetry is not a model performance problem. It is not something that scaling the model further will resolve. The 95 percent figure above held almost equally across the most advanced models and the smaller ones [1]. Raising performance does not raise risk awareness along with it. The two sit on different axes.

Nor is measurement asymmetry a sensor-accuracy problem. Even as cameras sharpen and tactile sensors grow more sensitive, interpreting that signal as danger is a separate matter. Real-time judgment under uncertainty remains one of the core unsolved challenges in embodied AI [2]. Seeing better and knowing the risk are not the same thing.

Here is the definition: **the structural gap between the rate at which AI generates physical performance and the rate at which the risk, verification, and recovery costs hidden behind that performance accumulate.** The former is captured by KPIs; the latter is not.

This asymmetry touches an old paradox of automation. Bainbridge already pointed it out in 1983: automation pushes the human into the role of monitor for normal operation, while simultaneously demanding the capacity to intervene immediately in exceptional situations [3]. The more automated a system becomes, the rarer and more dangerous the moments when a human must step in. Physical AI carries this paradox into the physical world.

## The Gate Embalms Judgment

A robot in the field does not run on a single brain. It runs on three layers: a low-level controller handling immediate reflexes, a harness executing verified skills, and a high-level planner handling complex judgment. What connects these layers is the gate.

The critical piece is the affordance gate. Affordance is a term the psychologist Gibson drew from perception theory, meaning the immediate reading of what the environment in front of you lets you do. See a handle, and you instantly know you can pull it [4]. This gate determines whether the currently sensed situation can be safely handled by an action already learned. If it can, the system executes the routine as always; if not, it calls the planner above. It is a clean design. But there is a trap here.

**The gate itself is a form of judgment.** The threshold that decides whether this situation matches the familiar is the very core of skill. A veteran welder's real talent is not welding fast. It is noticing that a seam that looks ordinary is actually unprecedented. This is the usual job — but something is off. This meta-judgment — knowing when to stop and escalate — is the hardest capability to automate, and the last.

This is exactly where the gate's false negatives live. When a novel danger is misclassified as a familiar routine, the system executes the default without suspicion. Accidents do not arrive loudly. They arrive quietly, at the exact spot the gate judged fine. What Parasuraman and Manzey codified as automation bias and complacency shows up in the physical world not as a broken cup but as wrecked equipment [5].

Automation embalms this gate's judgment into preconditions and postconditions. Once the designer reasons through it once and freezes it into a rule, reasoning at the moment of action converges to zero. The robot picking up the cup does not reason. The designer has already done all the reasoning for it. This is why Physical AI does not distribute reasoning. It relocates reasoning away from the operating hand and locks it inside the designing head. The authority shift this library identified in "AI Doesn't Steal Jobs; It Steals Discretion" repeats itself here, unchanged, in the physical world.

Consider one scene from the field. A robot arm in a logistics warehouse picks up a box and places it on a conveyor. It does this thousands of times a day without incident. The throughput graph climbs smoothly up and to the right. Then, one day, a box arrives with its tape half peeled off, its center of gravity thrown off. A human would feel the wrongness the instant their hand touched it, and regrip. The robot's affordance gate classifies the box as identical to the boxes it always picks up — the shape and size are similar enough. The gate executes the default skill, and the box slips and falls onto the foot of the worker standing nearby. The incident report records one box. But that one box reveals the entire category of misclassification that the gate had, up to that point, gotten away with thousands of times. Nowhere on the throughput graph was this accumulation ever plotted.

## What Gets Measured, What Gets Left Out

Measurement asymmetry does not show up in robotic fieldwork in just one way. Pairing the visible metrics against the hidden costs reveals the structure.

| Visible KPI (Measured) | Hidden Real Cost (Unmeasured) |
|---|---|
| Tasks completed ↑ | Risk of misclassifying novel situations as familiar ↑ |
| Average execution speed ↑ | Near-miss frequency and recovery time ↑ |
| Automated-execution coverage ↑ | Degradation of human intervention capability ↑ |
| Success rate ↑ | Depletion of gate-calibration capacity ↑ |
| Model benchmark scores ↑ | Physical risk-awareness rate (under 5 percent by EARBench) |

Organizations look only at the left column. The right column exists, but it appears on no dashboard. What is not measured is not managed, and what is not managed accumulates until an accident breaks it open.

This is where Polanyi's old insight lands with its full weight. We know more than we can tell [6]. A nurse senses something is wrong with a patient before the test numbers move; a mechanic knows just from the sound of the engine. This embodied knowing — tacit knowledge — is not replicated by adding more sensors. It is the residue of meaning steeped into years of experience. A robot processes an incoming signal as it is; a human reads meaning into it. Moravec's paradox [7] — that perception and movement are harder than reasoning — gains physical weight here. Reasoning, where progress looks vivid and clear to our eyes, is in fact the easy layer; meaning-laden perception is the hard layer that has quietly fallen behind. That difference is exactly where the unmeasured 5 percent lives.

The asymmetry tilts economically as well. Visible performance is immediate, visible, and measurable. Hidden cost is delayed, invisible, and immeasurable. In the era of text-based AI, this asymmetry showed up as human costs like burnout and verification labor. In Physical AI, the same asymmetry shows up as broken equipment and injured people. Irreversibility changes the unit of cost. The habit of reading only one ledger stays the same, but the magnitude of the loss entered in the other ledger changes by orders of magnitude.

So by 2026, this problem crossed over from academic discussion into a governance question. Standards bodies, regulators, insurers, and corporate buyers all began asking, simultaneously, how to evaluate, monitor, and govern learning-based systems [8]. An error by a surgical robot carries a different weight than a hallucination by a language model. Yet the yardstick used to evaluate both is still calibrated to the latter. Benchmark scores keep climbing, but the fact that those scores do not guarantee physical safety is the first place where measurement asymmetry gets translated into the language of regulation.

## Principles for Redesigning Measurement and Governance

The solution is not to eliminate KPIs. It is to add a measurement layer that makes the hidden costs visible. Read the figures below not as definitive standards but as starting points that presume field-specific calibration.

**Principle 1: Measure risk awareness directly.** Place the novelty false-negative rate alongside the success rate as a mandatory metric. The success rate counts only the cases the gate passed correctly; the false-negative rate counts the cases where the gate misread danger as routine. The two measure different things. Use a risk-scenario battery like EARBench to measure risk-awareness rate both before and after deployment [1]. The key is to measure this on deliberately seeded danger scenarios, not on normal operation logs — because accidents arrive from outside the normal distribution. Application condition: task units that perform irreversible actions. Do not apply to: environments that are fully reversible and allow unlimited simulated retries — there, the failure rate itself is the more direct metric.

**Principle 2: Codify the boundary of irreversibility.** Classify every action by its recoverability. Draw a line of de facto irreversibility based on recovery cost, duration, and safety impact, and prevent the gate from auto-passing any action that crosses that line. Where it is ambiguous, default conservatively to stopping. Do not apply to: an early deployment stage where the boundary itself is still unclear and excessive halting would paralyze operations — here, shadow observation that records the gate's judgments without actually moving the robot (see Principle 3) comes first.

**Principle 3: Leave gate calibration in human hands.** Only someone who has physically experienced where the gate fails can calibrate it well. Rotate designers and engineers through regular field duty to keep their hands calibrated. Archive near-misses that could have escalated into major accidents — video and sensor logs included — as a case library, and bring them back to life as training material and test questions. Concretely, run a two- to four-week shadow-observation period before deployment. Without actually moving the robot, record the gate's judgment side by side with a field expert's judgment, and collect the points where they diverge as misclassification cases. These cases become the evidentiary basis for adjusting thresholds with data, and simultaneously become the textbook for the next generation of apprentices. Measurement and training draw from the same data. Application condition: physical work with a high share of tacit knowledge. Do not apply to: simple, repetitive processes where the rules are fully specifiable.

**Principle 4: Deliberately rebuild the apprenticeship ladder.** When Physical AI absorbs the action itself, the place where a novice learns by hand disappears. Build a staged curriculum running from haptics and VR, to teleoperation, to supervised live practice, to independent operation. Tie field mastery to promotion and compensation so that experience becomes a career path worth pursuing. The crisis this library's piece "The Crisis of Expertise Reproduction" described for white-collar apprenticeship spreads here into blue-collar skilled trades.

## The Limits of This Frame

The measurement asymmetry frame does not apply equally to every instance of Physical AI.

First, measurement itself creates a new burden. Stacking on yet another monitoring layer to measure the risk-awareness rate becomes, in turn, its own cognitive load. Measurement design must follow a principle of minimal intervention.

Second, not all irreversibility carries the same weight. A broken cup and a surgical accident do not belong on the same table. Every domain needs its own separate risk standards and thresholds, and this demands a measurement infrastructure that most organizations do not yet have.

Third, and heaviest: every prescription for rebuilding apprenticeship raises cost. But the market brings in Physical AI precisely to lower cost. Efficiency is measured every quarter; apprenticeship collapse reveals itself only a decade later. If a technically correct measurement system fails to survive organizational politics, this frame's effectiveness evaporates.

## The Visible 95 Percent and the Invisible 5 Percent

EARBench's 95 percent can be read two ways. One is the technical diagnosis that the model still has a long way to go. The other is heavier: **we know this only because we measured that 95 percent.** Had it not been measured, the robot would have climbed only the success-rate graph while quietly stacking up risk.

The real task of the Physical AI era is not making the model smarter. It is making incompetence measurable. It is dragging into numbers the places where the gate misses, where apprenticeship breaks off, where tacit knowledge fails to replicate.

And that work of dragging it out cannot be automated. The capacity to calibrate the gate comes only from people who have lived through failure in their own bodies, and the apprenticeship that trains those people costs money. The market brings in Physical AI precisely to cut that cost. So measurement asymmetry is not a simple design flaw. It is a structural tension in which the force chasing efficiency and the force guarding safety pull in exactly opposite directions. Left unrecognized, this tension leads organizations to repeat the choice that looks most rational while stacking up the least-measured risk the fastest. This is why resolving measurement asymmetry is not a technical problem but a question of what an organization chooses to value.

Robots will keep accomplishing more and more, visibly. One question remains: who is watching what they cannot see.

## References

[1] Zhu, Z., Wu, B., Zhang, Z., Han, L., Liu, Q., & Wu, B. (2024). "EARBench: Towards Evaluating Physical Risk Awareness for Task Planning of Foundation Model-based Embodied AI Agents." *arXiv:2408.04449*. — Reports an average task risk rate (TRR) of 95.75% for foundation-model-based embodied AI agents. Prompt-based mitigation strategies show only limited effect.

[2] Lisondra, M., et al. (2026). "Embodied AI with Foundation Models for Mobile Service Robots: A Systematic Review." *Robotics*, 15(3), 55. (arXiv:2505.20503) — Identifies real-time judgment under uncertainty as a core unsolved challenge in embodied AI.

[3] Bainbridge, L. (1983). "Ironies of Automation." *Automatica*, 19(6), 775–779. — The paradox by which automation weakens a human monitor's capacity to intervene.

[4] Gibson, J. J. (1979). *The Ecological Approach to Visual Perception*. Houghton Mifflin. — The original source of the concept of affordance.

[5] Parasuraman, R., & Manzey, D. H. (2010). "Complacency and Bias in Human Use of Automation: An Attentional Integration." *Human Factors*, 52(3), 381–410. — Automation bias and complacency.

[6] Polanyi, M. (1966). *The Tacit Dimension*. University of Chicago Press. — Tacit knowledge: "We know more than we can tell."

[7] Moravec, H. (1988). *Mind Children: The Future of Robot and Human Intelligence*. Harvard University Press. — Moravec's paradox: perception and movement are harder than reasoning.

[8] Li, J.-M., et al. (2026). "Embodied AI in Action: Insights from SAE World Congress 2026 on Safety, Trust, Robotics, and Real-World Deployment." *arXiv:2605.10653*. — Calls from regulators and industry to evaluate the safety, trust, and real-world deployment of embodied AI.
