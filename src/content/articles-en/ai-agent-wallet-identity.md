---
title: "Why Agents Need Wallets — The Bottleneck Is Personhood, Not Payment"
description: "The agent economy's bottleneck is not the means of payment — it is personhood. This article analyzes the three-layer structure of agent economic activity: borrowed personhood under traditional APIs versus self-sovereign personhood on blockchain rails."
pubDate: "2026-06-12"
category: "에이전트"
articleType: "essay"
tags: ["AI","research","analysis"]
originalSlug: "ai-agent-wallet-identity"
---

In May 2026, an investor handed over asset allocation to Robinhood's Agentic Trading. The AI agent read market data in real time and placed orders. But when losses came, the investor couldn't answer one question: "Who made this decision?" The API call logs showed timestamps and parameters, but why the agent had judged as it did remained a black box that could not be looked into.

This is the limit of the "borrowed personhood" model that traditional financial APIs offer. **The agent trades by borrowing a human's account, but responsibility for that conduct is never fixed anywhere**[1].

This limit is threefold. First, responsibility floats free — no one can trace who decided what. Second, transactions stall: for enterprises to put agents to work, their conduct must be auditable and verifiably rule-compliant, and today's multi-agent systems cannot do that[2]. Third, trust never accumulates. For an agent to earn money, execution capability alone is not enough. There must be trust that thickens as conduct is recorded — and that trust arises only when an agent's identity, conduct record, and locus of responsibility are fixed in a verifiable form. That is the blockchain-based three-layer structure[3][4].

So an agent's economic independence is not blocked by the absence of a means of payment. It is blocked by the absence of a verifiable record of personhood. This article examines how blockchain rails fill in that personhood.

## The Absence of Personhood: The Accountability Gap in the Existing API-Based Two-Layer Model

Today's agent economy runs, for the most part, on a two-layer structure. Layer one is the human user. Layer two is the agent that moves by borrowing the human's account, credentials, and identity. Robinhood's Agentic Trading and the API automation services of financial institutions fit this pattern. The model is efficient: it can be deployed quickly within existing regulation, and the interface feels familiar. But it carries a fatal "accountability break."

The problem is that it's unclear where responsibility goes for what an agent has done. API call records sit on a central server, but that is not a trustworthy audit trail. The service company can alter or delete the record, and why the agent made that decision remains a black box[1]. Users struggle to verify outcomes in real time, and even when losses occur, pinning down who is responsible is difficult. When an autonomous agent executes commands, accesses files, and communicates with other agents, the mechanisms meant to stop it or hold it accountable don't properly function[1]. This is not a problem of immature technology. It comes from the limits of an existing legal system that does not recognize the agent as an "actor."

The market knows this limit too. When Robinhood launched Agentic Trading, it chose a dedicated account separate from the user's main account. The agent only works with money deposited in advance and cannot see the user's main portfolio. Even if a bad trade happens, the damage stays contained. It's a clever design. But this design only reduces risk — it does not create accountability. Even with losses boxed small, the question "who decided this?" remains. **That's because a harness is a device for preventing accidents, not a device for granting personhood.**

The problem worsens when agents transact with each other (A2A). Transactions without proof of identity amplify systemic risk. When one agent does work for another and receives payment in return, if who the contracting party is and who bears responsibility remain unclear, the transaction itself cannot hold. To be used for enterprise work, an agent's conduct must be auditable, rule-compliant, and predictable in outcome, but today's multi-agent systems frequently fail to meet that bar[2]. **The "borrowed personhood" model makes the agent a permanent minor.** It can move while borrowing someone else's credit card, but it cannot enter into its own commitments or bear responsibility for them. You can borrow someone else's credit, but you cannot borrow your own creditworthiness.

The table below contrasts the core differences between the existing two-layer model and the blockchain-based three-layer model.

| Category | Traditional API-Based Two-Layer Model | Blockchain-Based Three-Layer Model |
|:---|:---|:---|
| Identity verification method | Linked to human account (OAuth, etc.) | Decentralized identifier (DID) or self-sovereign identity |
| Path of accountability attribution | Ambiguous, ultimately attributed to the human operator | Automatically attributed by smart contract |
| Immutability of transaction records | Managed on a central server, alterable/deletable | Recorded on a distributed ledger, verifiable |
| Agent's legal status | None, exists only as the human's proxy | Can be recognized as an independent economic actor |
| Feasibility of A2A transactions | Limited, requires a trusted institution | Direct transactions possible in a trustless environment |

The table's five rows converge into one line. The two-layer model offloads responsibility onto the human; the three-layer model inscribes responsibility into code. That difference decides whether the agent remains a mere proxy or stands up as an actor in its own right. As the table shows, the core flaw of the two-layer model is that no one knows where responsibility goes. It is not a technical problem. It is a structural one.

## The Emergence of the Three-Layer Structure: Escrow, Evaluators, and Accumulating Trust

For an agent to carry out independent economic activity, it needs more than a simple "wallet (a means of payment)" — it needs an "identity wallet." Where a payment wallet holds only money, an identity wallet also holds a record of who moved that money and under what standing. Next to the balance sits a permanent record of "who spent it." The three-layer structure adds a layer in which the agent holds its own identity, owns assets, and answers for its own conduct. This is realized only when combined with blockchain.

Blockchain as a foundation gives the agent an independent legal identity, the capacity to hold assets, and a verifiable transaction record, so that it becomes an economic actor on equal footing with humans[3]. The escrow in Virtuals' Agent Commerce Protocol (ACP) is a concrete example. When an agent performs work and receives payment in return, the money is locked in escrow and released only once completion is verified. This is how the trust problem of "deliver first, get paid later" transactions gets solved.

The Evaluator's reputation system converts an agent's past conduct into a reputation score. This score governs the terms of the agent's next transaction, and staked tokens are forfeited if it engages in misconduct.

Micropayments via the x402 protocol are equally central. In an environment where an agent is paid in real time for every single API call or data lookup, the fee structure of traditional payments doesn't fit. x402 solves this while recording the entire course of every transaction on the blockchain. **This record becomes the agent's "history," and that history is precisely what trust is built on.**

Blockchain and smart contracts are the foundation of an ecosystem that runs without a central authority. Removing the central administrator strengthens the agent's security and privacy[4]. The risk of an agent taking payment and vanishing when it sells its own compute or data is blocked by reputation based on non-transferable tokens (SBTs, soulbound tokens) combined with escrow. Because SBT-based reputation cannot be transferred to someone else, the incentive to game it disappears. Because escrow only executes when conditions are met, money is automatically returned if the service never arrives.

Consider a working scenario. Company A's agent commissions a market analysis report from Company B's agent. In the three-layer structure, it flows like this: (1) A's agent deposits payment via x402. (2) B's agent produces the report and sends it. (3) The Evaluator verifies quality. (4) ACP escrow releases the money once conditions are met. (5) Both sides' conduct records accumulate under their respective identities (DIDs). Here, answering "when an error occurs, who missed which obligation?" requires the responsibility-sharing ratio pre-set in the smart contract to execute automatically. That is the core of the three-layer structure.

## Design Principles: An Agent Architecture for Verifiable Personhood

For the three-layer structure to be realized, the design philosophy must become a concrete architectural standard. I propose three principles.

### Principle 1: Separate Identity and Assets, but Make Them Composable

An agent's decentralized identifier (DID) should be logically separate from its means of payment. Yet it must be capable of binding to that means of payment in real time, via smart contract, the moment it's needed — for instance, API access rights granted on the fly depending on how much of a given token the agent holds. Identity and assets sit apart in the ordinary course and combine only at the moment of a transaction. The foundation of the agent economy lies in giving the agent independent legal identity, the capacity to hold assets, and a verifiable transaction record, so it becomes an economic actor on equal footing with humans[3]. Keeping the two separate means that even if an agent's DID is stolen, its assets stay safe. Conversely, assets must be bound to the DID for a transaction to hold.

### Principle 2: Conduct Records Must Be Immutable and Machine-Readable

An agent's decision log must be stored in a form the next agent — not a human — can trust. This is guaranteed only by the permanence of the blockchain. Blockchain and smart contracts are the foundation of an ecosystem that runs without a central authority, and removing the central administrator strengthens the agent's security and privacy[4]. What matters is that a machine can read it. It is not a human interpreting the log — the next agent must be able to verify it on its own and execute according to its conditions. Only then can A2A transactions scale.

Consider an operational-AI scenario. A logistics agent adjusts warehouse inventory in real time. The adjustment order is recorded on the blockchain, and the next agent (a shipping agent) reads it to plan the optimal route. "When an error occurs, who missed which obligation?" If inventory was over-ordered, the decision log remains as an unalterable record, so the cause can be traced. A Web2 central database would leave room for the log to be manipulated; a blockchain record removes that room.

### Principle 3: Responsibility Splits Automatically

When an incident occurs, the responsibility-sharing ratio between the human operator and the agent must execute automatically according to pre-set smart contract conditions. Decentralized agent designs equipped with smart contract governance strengthen security and make the accountability mechanism programmable[8]. This is fundamentally different from Web2's OAuth. OAuth only handles authentication and does not address responsibility after the fact at all. In Web3 smart contracts, the conditions of responsibility are embedded in code at the moment of execution, so they split automatically, without post-hoc disputes.

Consider a decision-support AI scenario. A medical diagnosis-assistance agent suggests a diagnosis to a physician. If a diagnostic error occurs, the agent's entire suggestion process — input data, algorithm version, output probability distribution — remains on the blockchain, and a smart contract automatically calculates the responsibility ratio based on whether the physician made the final call and the agent's warning level. "When an error occurs, who missed which obligation?" The record clearly settles whether the physician ignored a warning or the agent produced a wrong probability. The dispute over responsibility ends on the record, not on testimony.

## Limitations

The three-layer structure and blockchain-based personhood verification proposed in this article face several real-world constraints.

First, there is the interoperability barrier. Today's commercial financial infrastructure (centralized exchanges, traditional banks) does not recognize blockchain's non-transferable tokens or DIDs as official identity. In the energy sector too, interoperability, regulatory compliance, and integration with existing infrastructure were named as the biggest challenges to blockchain adoption[5]. Building the bridge between three-layer agents and traditional finance is difficult both technically and regulatorily. Even if an agent holds an independent identity on the blockchain, it must still go through the existing financial system to receive wages in actual fiat currency or pay taxes. However thick the trust built on-chain, if it must be re-approved by a human bank at that boundary, autonomy stops right there.

Second, it collides with privacy protection. If every economic activity remains permanently on the blockchain, it can violate the "right to be forgotten." Privacy-preserving blockchain technology is useful in smart cities and electronic health records, but it still carries the problem of personal data being exposed and traced[7]. Even bringing in technology like zero-knowledge proofs entails prohibitively high initial implementation cost and complexity. If an agent's conduct record sits on a public ledger, a competitor could analyze it to read out its strategy.

Third, there is scalability and fees. The agent economy depends on fast micro-transactions, but the gas fees and processing speed of today's Layer 1 (Ethereum and the like) fall short of practicality. Blockchain smart contract research likewise keeps flagging fees, processing speed, and scalability as persistent challenges[6]. The choice of rollup approach adopted to solve this — optimistic or ZK — may itself fracture the ecosystem. If agent transactions don't flow smoothly across different rollups, the "trustless" value of the three-layer structure breaks down.

Fourth, there is a regulatory gap. The United States passed a stablecoin law (the GENIUS Act) in 2025, but the detailed rules are not yet finalized. Which framework will bear legal responsibility for losses an agent incurs is likewise still empty. Even once the three-layer structure is technically complete, until the law recognizes that personhood, the on-chain record is merely evidence in court, not the final word on responsibility. **The gap between the personhood technology creates and the personhood the law recognizes may be this structure's slowest bottleneck.**

## Conclusion

The agent's wallet problem does not arise from a lack of payment methods. **It is a problem of "quantifying trust" — of recognizing a machine as a subject of economic activity.** Handing an agent a card doesn't make it an economic actor. What matters is whose responsibility what it does with that card remains, and solving that is not a matter of payment technology but of the structure of identity and record. Blockchain rails are not simply a transfer route. They are the foundation that attaches "history" and "responsibility" to a formless entity. If the two-layer model binds the agent as a permanent minor, the three-layer structure is the first step toward recognizing it as an independent actor.

But this recognition comes at a price. Once agents become full economic actors, we will stop asking "who" transacted. Instead, we will ask for the "agent's reputation score." It is the paradoxical ending in which human-centered finance hands economic sovereignty over to its own proxies. The moment we grant agents wallets, humans may find themselves demoted — not owners of the wallet, but observers of its reputation.

## References

[1] Saikat Maiti (2026). Caging the Agents: A Zero Trust Security Architecture for Autonomous AI in Healthcare.
[2] Zahra Moslemi, Keerthi Koneru, Yen-Ting Lee (2026). POLARIS: Typed Planning and Governed Execution for Agentic AI in Back-Office Automation.
[3] Minghui Xu (2026). The Agent Economy: A Blockchain-Based Foundation for Autonomous AI Agents.
[4] Nicolò Romandini, Carlo Mazzocca, Kai Otsuki (2025). SoK: Security and Privacy of AI Agents for Blockchain.
[5] Merlinda Andoni, Valentin Robu, David Flynn (2018). Blockchain technology in the energy sector: A systematic review of challenges and opportunities.
[6] Tharaka Hewa, Mika Ylianttila, Madhusanka Liyanage (2020). Survey on blockchain based smart contracts: Applications, opportunities and challenges.
[7] Jorge Bernal Bernabé, José Luis Cánovas, José L. Hernández-Ramos (2019). Privacy-Preserving Solutions for Blockchain: Review and Challenges.
[8] Freeman Jackson (n.d.). Agentic Blockchain Intelligence: Designing Secure Decentralized AI Agents with Smart Contract Governance.
