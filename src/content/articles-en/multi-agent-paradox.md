---
title: "The Multi-Agent Paradox"
description: "When individually rational agents converge on collectively suboptimal outcomes — the structural dilemma of distributed AI cooperation."
pubDate: "2026-03-07"
category: "에이전트"
articleType: "research synthesis"
tags: ["AI","research","analysis"]
originalSlug: "multi-agent-paradox"
---

## A Collapse With No Failed Part

On the afternoon of May 6, 2010, a large automated selling program began executing in the E-mini S&P 500 futures market at the Chicago Mercantile Exchange. The market was already full of high-frequency trading algorithms, each following its own strategy. Within minutes, futures prices plunged and the cash market followed, and within minutes more, most of the decline was recovered. The conclusion of the post-mortem is strange. No algorithm malfunctioned. The most active high-frequency traders kept their usual strategies on the day of the crash[7], and that very normal operation drained liquidity and amplified the fall.

The event compresses the core problem of multi-agent systems. First, the interactions of individually rational agents can converge on an outcome that is bad for everyone. Second, this failure comes not from a bug but from structure. However much each agent is improved, the failure recurs as long as the incentive structure of the interaction stays the same. Third, the unit to fix is therefore not the agent but the game itself. I will call this bundle of three propositions the multi-agent paradox.

The name "paradox" is not an exaggeration. When we explain a failure of the whole, we habitually look for a defect somewhere. But this class of failure has no defect. Every part working to spec is itself the condition of failure. Anyone who builds a system by linking multiple artificial intelligence (AI) agents has to accept this inverted causality first.

The problem has become urgent because of a change in how systems are deployed. Until now, AI has mostly been deployed as a single system serving one user. Now agents that search, buy, and negotiate face each other on the same platforms, the same APIs, and the same markets. A single agent's error ends as that user's loss, but a flaw in the incentive structure between agents is amplified at the scale of the market. That amplification is exactly what the Flash Crash showed.

## The Structure of the Dilemma: When Rationality Is the Problem

AI did not invent this structure. Hardin showed the same structure with the metaphor of a common pasture. For each herder, turning one more cow onto the pasture is always a gain. The extra revenue goes to the herder, while the cost of degrading the pasture is shared by all. Everyone makes the same calculation, and the pasture disappears[1]. The point is not that the herders are foolish but that each one's calculation is correct.

The Prisoner's Dilemma is the minimal model of this structure. If betrayal pays better no matter what the other side does, betrayal becomes the dominant strategy, and the system is locked into a state worse than mutual cooperation. A Nash equilibrium is a state in which each player does their best while taking the other's strategy as given, and there is no reason this equilibrium should coincide with the collective optimum. In the Prisoner's Dilemma, mutual betrayal is an equilibrium and mutual cooperation is not.

Game theory also built tools to quantify this gap. Roughgarden and Tardos analyzed how much total delay worsens in a congested network when each actor optimizes only its own route. When delay grows linearly, the total cost of selfish routing is at most four-thirds of the centrally optimized cost, a loss of 33%. But when the delay function is nonlinear, the loss has no upper bound[4]. The lesson of this measure, called the price of anarchy, is twofold. The cost of local optimization can be measured. And that cost can grow without limit depending on the physical properties of the system.

The way out also lies inside the structure. Axelrod and Hamilton showed that when a game is repeated and the probability of meeting again is high enough, conditional cooperation strategies can become evolutionarily stable[3]. What sustains cooperation is not goodwill but the future. When a relationship is one-off, betrayal wins; when the future is long, retaliation and reputation change the arithmetic of betrayal. As discussed in "Cooperative Thresholds: Multi-Agent Systems Transition at Structure, Not Scale," what decides whether cooperation holds is not the number of agents but structural variables like these.

## Learning Agents Discover Betrayal

The actors of classical game theory are given strategies. Reinforcement learning agents find strategies on their own. That difference brought the paradox into the lab. DeepMind researchers trained agents to maximize their own rewards in a two-player apple-gathering game. While resources were plentiful, the agents coexisted peacefully; once resources grew scarce, they learned an aggressive policy of firing a beam to knock the other player out of the game for a while[5]. No one taught aggression. When the environmental condition of scarcity met the goal of individual reward maximization, betrayal was discovered.

This line of experiments matters because it moved the social dilemma from a one-shot choice in a matrix game to a question of policy in an environment that unfolds over time. Cooperation or betrayal is not a single decision but emerges from a chain of actions: observing, moving, and aiming[5]. The dilemma lies not inside the agent's head but between the environment and the policy.

In common-pool resource environments, Hardin's metaphor was reproduced exactly. In experiments where multiple agents harvest a renewable resource, agents early in training over-harvested without giving the resource time to recover and collapsed the commons[6]. What comes next deserves more attention. As training progressed, some agents acquired exclusion behavior that pushed other agents out, and the system stabilized in an unequal state in which the resource was preserved but monopolized by a few. Efficiency and fairness were not achieved together; efficiency was restored through exclusion.

These results connect directly to the problem of reward design. If each agent's reward function is misaligned with the global objective, learning finds policies that exploit that misalignment. The alignment of local rewards and global performance discussed in "Reward Design for AI Agents: The Optimal Mix of Stick and Carrot" is, in a multi-agent environment, not an option but a condition of survival.

## A Taxonomy of Failure Modes

If multi-agent failure is treated as a single disease, there is only one prescription. In practice, at least three structures can be distinguished.

| Failure mode | Incentive structure | Classic case | AI system case | Point of intervention |
|---|---|---|---|---|
| Common-resource depletion | Gains privatized, costs shared | Tragedy of the common pasture[1] | Learned over-harvesting of a common resource[6] | Access rules, monitoring and sanctions |
| Congestion externality | Each actor's shortest-path choice raises everyone's cost | Delay loss of selfish routing[4] | Contention over shared APIs and compute queues | Price signals, congestion tolls |
| Interaction amplification | Normal responses form a feedback loop | Flash Crash[7] | Runaway cascades of agent retries | Circuit breakers, rate limits |

The three modes call for different prescriptions. Depletion needs access rules and sanctions, congestion needs price signals, and amplification needs circuit breakers. Congestion is the structure most likely to recur in agent systems inside organizations. Agents inside an organization usually call the same model API, the same vector store, and the same internal systems. For each agent, retries and parallel calls are always rational. As latency grows, retrying more aggressively is how each one protects its own performance. When that rationality adds up, the queues lengthen and everyone's latency rises together.

Amplification is especially dangerous because it is invisible in normal times. During the Flash Crash, trades in which high-frequency traders rapidly passed the same positions back and forth among themselves surged, the market's buying capacity was exhausted, and the fall deepened. A feedback loop closes only under specific load conditions. That is why unit tests do not find it.

Moved into a practical setting, it looks like this. Suppose an organization has deployed a procurement negotiation agent, an inventory management agent, and a pricing agent. All three excel on their own metrics. But the inventory agent's rush orders undermine the procurement agent's negotiating leverage, and the pricing agent passes the higher cost on to selling prices, which shakes the demand forecast again. No team's dashboard shows a problem, yet margins shrink. The audit question to ask here is not "Which agent was wrong?" It is "Who designed the game among these three agents, and who was responsible for monitoring the overall profit and loss?"

## Principles for Fixing the Game

By the definition of the paradox, the prescription is not agent improvement but game redesign. Four principles accumulated in human communities and safety engineering translate into AI multi-agent design.

### Principle 1: Make the rules of interaction, not the agents, the object of design

Model quality, prompts, and tool lists are agent-level variables. The paradox arises from game-level variables such as payoff structure, rules of resource access, and the scope of information disclosure. If a design document contains only agent specifications and no game specification, the system has not yet been designed.

### Principle 2: Build in monitoring and graduated sanctions

At the core of the design principles Ostrom drew from common-resource communities that lasted for centuries were mutual monitoring among members and graduated sanctions proportional to the severity of a violation[2]. Translated into AI systems: make agent behavior logs mutually verifiable, and when a violation is detected, respond in steps, from rate limits to reduced permissions to isolation, rather than immediate expulsion. A rule that expels after a single violation is vulnerable to false positives and ends up disabling the monitoring system itself. There is also a part of Ostrom's findings that is often forgotten. In the successful communities, the resource users themselves, not an outside authority, could make and change the rules[2]. Where to place the authority to adjust the rules of the game is a design decision as weighty as monitoring.

### Principle 3: Lengthen the shadow of the future

Repeated interaction and identifiability are the foundation of cooperation[3]. Give agents persistent identities and reputation records, and instead of resetting memory every episode, let past behavior shape future opportunities for interaction. A structure in which anonymous, one-off agents brush past each other makes betrayal the default.

### Principle 4: Set up system-level constraints as a separate layer

Leveson's theory of system safety sees accidents not as component failures but as the result of constraints on the interactions between components going unenforced. Because safety is an emergent property of the system, not a property of its parts, a separate control structure is needed to enforce it[8]. Translated to multi-agent systems, this is a layer of global constraints that works independently of each agent's optimization. Aggregate limits, circuit breakers, and trading-halt rules belong here, and this layer, at least, must not be something agents can learn to bypass.

### Principle 5: Measure the loss from local optimization as a metric

The price of anarchy is too useful a metric to leave as a theoretical concept[4]. Compare, by simulation, the global performance of the current state in which every agent optimizes for itself with the performance reachable under central allocation, and the system's structural loss shows up as a number. If this gap is small and stable, the game is healthy. If it is large or spikes with load, it is a signal to redesign the payoff structure. Running a multi-agent system without this measurement is like a herder who never counts how much grass is left.

## Limitations

The argument of this essay carries three reservations. First, the scale of the experimental evidence. The reinforcement learning experiments cited were run with a small number of agents in simple grid environments[5][6]. There is no guarantee that the same dynamics appear in the same form in environments where thousands of large language model (LLM)-based agents negotiate in natural language. Language opens a new strategic space of promises, persuasion, and deception, so the dilemma could ease, or more sophisticated betrayal could emerge. There is also a difference: a dilemma in the lab is a game the researchers designed with full knowledge of the payoff structure, while a game in a real deployment proceeds with no one knowing the full payoff matrix.

Second, analogies to human institutions have limits. Ostrom's design principles assume humans who value their reputation and fear punishment[2]. An agent's reputation and sanctions are artificial incentives created by designers, and they can themselves become new targets of reward hacking. Transplanting the form of an institution and transplanting the conditions under which that institution worked are different problems.

Third, this essay assumed cooperation to be good, but there are domains where that assumption flips. If pricing algorithms learn to cooperate without any explicit agreement, that is collusion. Cooperation among seller agents is a failure for consumers. Whether cooperation or betrayal is desirable is decided by a perspective outside the game, and technology cannot make that normative judgment for us.

## Conclusion: What Game Are You Deploying?

Let us return to the opening question. If no one failed and yet the whole collapsed, where does responsibility lie? This essay's answer is that it lies not in the moves the agents make but in the game they are playing. Whoever set the payoff structure, skipped monitoring, and approved deployment is the designer of that game. The plea "I never designed it" does not hold. Leaving the game specification blank is also a design, and usually the worst one. The decision not to fence the pasture also decides the pasture's fate.

So the safety question for multi-agent systems has to shift from "Is this agent smart enough?" to "What game are we deploying?" One last paradox remains. A system in which every agent works perfectly is exactly the system that must be watched most closely. A defective part announces itself, but a defective game stays silent until the moment it collapses.

## References

[1] Hardin, G. (1968). The Tragedy of the Commons. Science, 162(3859), 1243-1248.

[2] Ostrom, E. (1990). Governing the Commons: The Evolution of Institutions for Collective Action. Cambridge University Press.

[3] Axelrod, R., & Hamilton, W. D. (1981). The Evolution of Cooperation. Science, 211(4489), 1390-1396.

[4] Roughgarden, T., & Tardos, É. (2002). How Bad Is Selfish Routing? Journal of the ACM, 49(2), 236-259.

[5] Leibo, J. Z., Zambaldi, V., Lanctot, M., Marecki, J., & Graepel, T. (2017). Multi-agent Reinforcement Learning in Sequential Social Dilemmas. Proceedings of the 16th International Conference on Autonomous Agents and Multiagent Systems (AAMAS 2017), 464-473.

[6] Perolat, J., Leibo, J. Z., Zambaldi, V., Beattie, C., Tuyls, K., & Graepel, T. (2017). A Multi-agent Reinforcement Learning Model of Common-Pool Resource Appropriation. Advances in Neural Information Processing Systems 30 (NIPS 2017).

[7] Kirilenko, A., Kyle, A. S., Samadi, M., & Tuzun, T. (2017). The Flash Crash: High-Frequency Trading in an Electronic Market. The Journal of Finance, 72(3), 967-998.

[8] Leveson, N. G. (2011). Engineering a Safer World: Systems Thinking Applied to Safety. MIT Press.
