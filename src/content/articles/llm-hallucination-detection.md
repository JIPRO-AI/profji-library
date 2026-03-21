---
title: "LLM 환각 통제: 신뢰성은 생성이 아니라 검증 라우팅에서 결정된다"
description: "LLM 환각은 모델의 거짓말이 아니라 검증 라우팅 실패가 누적된 시스템 현상이다. 환각 taxonomy, claim-level 검증 파이프라인, 측정 프레임워크까지."
pubDate: "2026-03-11"
category: "AI 기술"
tags: ["AI","research","analysis"]
---

## LLM 환각 통제: 신뢰성은 생성이 아니라 검증 라우팅에서 결정된다

LLM이 사실과 다른 정보를 사실처럼 생성하는 환각(Hallucination) 문제에 대해, 업계의 지배적 접근은 두 가지다. 하나는 "더 좋은 모델을 기다리자"이고, 다른 하나는 "RAG를 붙이면 된다"이다. 둘 다 불충분하다.

더 좋은 모델은 환각의 빈도를 줄이지만, 빈도가 줄어들수록 남은 환각을 탐지하기는 오히려 더 어려워진다 — 희소한 오류는 발견하기 어렵다. RAG는 근거를 추가하지만, 진실을 보장하지는 않는다 [2]. 검색된 소스 자체가 틀렸거나, 모델이 소스를 왜곡 해석하거나, 검색이 아예 실패하면 RAG는 오히려 거짓에 권위를 입힌다.

이 글의 핵심 주장은 이렇다. **환각은 단일 탐지기로 해결되는 버그가 아니라, 검증 라우팅 실패가 누적된 시스템 현상이다.** 따라서 해법도 모델 개선이나 단일 기법이 아니라, 주장 단위(claim-level)로 불확실성을 측정하고, 위험도에 따라 검증 경로를 분기시키며, 확신이 부족하면 응답을 중단하는 시스템 아키텍처에 있다.

이 글은 환각의 "완전 제거"를 목표로 하지 않는다. 현실적 목표는 **bounded reliability** — 검증 가능한 오류로 전환하고, 고위험 오류의 확률을 허용 범위 이하로 억제하며, 허위 확신을 구조적으로 차단하는 것이다.

## 1. 환각은 하나가 아니다: 여섯 가지 유형과 각각의 탐지 경로

환각을 하나의 현상으로 묶으면 탐지 전략도 뭉뚱그려진다. 실무에서는 최소 여섯 가지를 구분해야 한다. 각 유형마다 잡는 방식이 다르기 때문이다.

| 유형 | 정의 | 탐지 경로 |
|------|------|----------|
| **Fabrication** | 존재하지 않는 사실·출처·수치를 생성 | 외부 DB/지식베이스 대조 [10] |
| **Unsupported Inference** | 근거는 있지만 결론이 과도함 | Claim-evidence 정합성 검사 [1] |
| **Retrieval Contamination** | 검색된 소스 자체가 틀렸거나 편향됨 | 소스 신뢰도 평가 + 교차 검증 [2] |
| **Instruction-induced Overclaim** | 답변 압박으로 불확실한 내용을 확신적으로 진술 | 불확실성 점수 vs 표현 확신도 비교 |
| **Reasoning Drift** | 중간 추론에서 논리가 틀어짐 | 단계별 추론 검증 [4] |
| **Tool-use Fabrication** | 실행하지 않은 도구 결과를 지어냄 | 실행 로그 대조 |

이 구분이 왜 중요한가? Fabrication은 외부 DB 대조로 잡을 수 있지만, Unsupported Inference는 같은 방법으로 잡히지 않는다 — 인용한 소스는 실재하지만 결론이 과도한 경우이기 때문이다. Reasoning Drift는 내부 신호(토큰 확률 변동)로 단서를 잡을 수 있지만, Instruction-induced Overclaim은 모델이 높은 확신으로 틀리기 때문에 내부 확률이 오히려 안정적이다.

**내부 확률은 진실의 척도가 아니라 경고 신호일 뿐이다.** 이 한계를 인정하는 것이 신뢰성 설계의 출발점이다.

## 2. 네 가지 검증 차원: 각각의 강점과 실패 모드

환각 대응에 동원할 수 있는 검증 차원은 네 가지다. 어느 것도 단독으로 충분하지 않다.

| 차원 | 강점 | 실패 모드 | 비용/속도 |
|------|------|----------|----------|
| **내부 확률** | 빠름, 저비용, 실시간 | 확률과 진실이 불일치 [6]; OOD에서 무의미 [4] | 최저 |
| **RAG/외부 검색** | 근거 제공, fabrication 탐지 | 검색 실패; 소스 오염; 문맥 과부하 [2] | 중간 |
| **멀티에이전트 교차검증** | 독립적 관점 비교 | 공통 오류 분포 공유; 거짓 합의 | 높음 |
| **인간 검토** | 뉘앙스·윤리·논리 함정 탐지 [7] | 고비용, 저속도, 확장 불가 | 최고 |

### 내부 확률의 한계

LLM은 통계적 예측기다. 가장 그럴듯한 다음 토큰을 선택할 뿐, 그것이 사실인지는 모른다. 낮은 토큰 확률이 항상 오류를 뜻하지 않고, 높은 확률이 항상 진실을 뜻하지 않는다 [6]. 특히 복잡한 추론이나 코드 생성에서는 모델이 여러 경로를 탐색하면서 확률 분포가 자연스럽게 불안정해지기 때문에, 내부 신호의 오경보율이 올라간다 [4].

소형 모델(SLM)을 보조 탐지기로 활용하는 접근도 있지만, 단순 질의에는 효과적인 반면 추상적 개념이나 논리적 함정에서는 정밀도가 급락한다 [6]. 내부 신호는 '명백한 오류 필터'가 아니라 '불확실성 높은 구간 식별기'로 제한해서 써야 한다.

본고의 제안적 해석으로, 네트워크 과학의 임계 전이(critical transition) 이론을 환각 탐지에 연결하는 것도 유망한 방향이다. 시스템이 불안정 상태로 넘어가기 직전에 자기상관 증가, 분산 급증, 스키우니스 변화 등의 통계적 패턴이 나타난다는 관찰 [3][5]을 LLM 출력 스트림에 적용하면, 환각이 발생하기 직전의 전조 신호를 탐지할 수 있을 가능성이 있다. 이는 아직 직접 검증된 표준 기법은 아니지만, 단순 확률값 모니터링을 넘어 동적 변동성 기반의 조기 경보 체계로 발전할 잠재력이 있다.

### RAG의 실패 모드

RAG는 세 가지 방식으로 실패한다 [2].

**검색 부재**: 관련 문서를 찾지 못하면 RAG는 내부 지식에 의존하고, 환각이 재생산된다. 더 위험한 것은 "검색 결과가 없었다"는 사실이 사용자에게 전달되지 않는 경우다.

**소스 오염**: 지식베이스 자체가 부정확하거나 편향을 포함하면, RAG는 거짓에 출처를 붙여 신뢰도를 높인다 [8]. 단순 검색 정합성 검사로는 이 경우를 차단할 수 없다 [1].

**문맥 과부하**: 너무 많은 문서가 문맥 창에 들어가면 모델이 핵심 정보를 놓치거나 관련 없는 내용을 과도하게 통합한다 [2]. RETA-LLM 연구는 검색 범위와 문맥 할당 전략이 결과 신뢰도에 결정적 영향을 미친다고 경고한다.

**RAG는 근거를 추가하지만, 진실을 보장하지는 않는다.** 올바르게 설계된 외부 검증 — 예컨대 Thucy처럼 관계형 DB 스키마를 활용한 주장 대조 [10] — 은 강력한 신뢰성 수단이 될 수 있지만, 이것도 구조화된 데이터가 존재하는 영역에서만 작동한다.

### 멀티에이전트 교차검증의 한계

서로 다른 모델의 출력을 비교해 오류를 탐지하는 전략 [9]은 매력적이지만, 세 가지 함정이 있다.

첫째, **공통 오류 분포**. 같은 훈련 데이터에서 학습한 모델들은 같은 방향으로 틀릴 수 있다. 모델 A와 B가 동의했다고 해서 그것이 참이라는 보장은 없다.

둘째, **거짓 합의(false consensus)**. 여러 모델이 서로의 출력을 보고 "다들 비슷하게 말하니까 맞겠지"라는 형태의 합의에 도달할 수 있다. 합의는 정확성의 필요조건이지 충분조건이 아니다.

셋째, **비용과 지연**. 모든 출력에 교차검증을 적용하면 비용이 2-5배로 늘어나고, 응답 시간도 비례해서 증가한다. 따라서 교차검증도 라우팅의 대상이다 — 모든 답변이 아니라, 불확실성이 높은 답변에만 적용해야 한다.

**합의는 정확성을 보장하지 않는다.** 다만 불일치는 강한 경고 신호다. 멀티에이전트의 진짜 가치는 "일치할 때 맞다고 확신하는 것"이 아니라 "불일치할 때 에스컬레이션을 트리거하는 것"에 있다.

## 3. Claim-level Verification Pipeline

답변 전체를 "환각이다/아니다"로 판정하는 것은 너무 거칠다. 하나의 답변 안에 정확한 주장과 환각이 공존할 수 있다. 따라서 검증 단위는 답변이 아니라 **주장(claim)**이어야 한다.

### 파이프라인 구조

```
답변 생성
  → Claim Segmentation (주장 단위 분리)
  → Claim Confidence Scoring (주장별 불확실성 점수)
  → Routing Decision (점수 기반 검증 경로 분기)
     ├─ 저위험: 바로 출력
     ├─ 중위험: 외부 검증 (RAG/DB 대조) [10]
     ├─ 고위험: 멀티에이전트 교차검증 [9]
     └─ 초고위험: 인간 에스컬레이션 [7]
  → Evidence Matching (주장-근거 정합성 검사) [1]
  → Aggregate Decision
     ├─ 응답 (검증 통과)
     ├─ 부분 응답 (일부 주장 제거/약화)
     ├─ 보류 + 에스컬레이션
     └─ 응답 거부 (Selective Abstention)
```

이 파이프라인의 핵심 설계 원리는 세 가지다.

**원리 1: 불확실하면 말하지 않는다 (Selective Abstention).** 모든 질문에 답하려는 압박이 instruction-induced overclaim의 원인이다. 확신이 충분하지 않으면 "이 부분은 확인이 필요합니다"라고 명시하는 것이 거짓 확신보다 낫다.

**원리 2: 검증 비용은 위험도에 비례한다.** 비공식 채팅에서 날씨를 물으면 내부 필터만으로 충분하다. 의료 진단 보조에서 약물 상호작용을 물으면 DB 대조 + 인간 확인이 필요하다 [7]. 모든 답변에 동일한 검증을 적용하는 것은 비용 낭비이자 지연 증가다.

**원리 3: 피드백은 시스템을 학습시킨다.** 인간 검증 결과, 오경보 로그, 에스컬레이션 기록을 수집해 RLHF와 결합하면 시스템의 불확실성 추정 자체가 개선된다. 임계값도 동적으로 조정될 수 있다 [5]. 이 피드백 루프가 없으면 파이프라인은 정적 필터에 그치고, 있으면 적응형 신뢰성 시스템이 된다.

### 도메인별 적용 분기

- **비공식 채팅/일반 질의**: 1단계(내부 필터)만 적용. 저지연 우선.
- **업무 보고서/분석**: 2단계(외부 검증)까지. 주요 주장에 대해 근거 출처 명시.
- **의료/법률/금융**: 3단계(멀티에이전트) + 인간 확인 의무화. 모든 주장에 evidence trail 기록 [7][8].

## 4. 측정 프레임워크: 표준화는 측정에서 시작된다

"환각을 줄였다"는 선언은 무엇을 측정했느냐에 따라 의미가 달라진다. 표준화를 말하려면 측정 표준이 먼저다.

| 지표 | 정의 | 의미 |
|------|------|------|
| **Claim-level Hallucination Rate** | 총 주장 중 검증 실패 비율 | 핵심 신뢰성 지표 |
| **Abstention Rate** | 응답 거부/보류 비율 | 너무 높으면 유용성 저하, 너무 낮으면 과신 |
| **False Alarm Rate** | 정확한 주장을 환각으로 오분류한 비율 | 검증 시스템의 정밀도 |
| **Evidence Coverage Rate** | 주장 중 외부 근거로 뒷받침된 비율 | 근거 기반 응답의 정도 |
| **Retrieval Mismatch Rate** | 검색 결과와 주장이 불일치하는 비율 | RAG 실패 모드 탐지 |
| **Human Escalation Rate** | 인간 검토로 회부된 비율 | 자동화 수준과 인간 부담 |
| **Mean Verification Latency** | 검증에 걸리는 평균 시간 | 실무 배포 가능성 |
| **Cost per Verified Answer** | 검증 완료 답변 1건당 비용 | 경제적 지속 가능성 |

이 지표들의 핵심은 **trade-off 가시화**에 있다. Abstention Rate를 올리면 Hallucination Rate는 내려가지만 유용성도 내려간다. Human Escalation Rate를 올리면 신뢰성은 올라가지만 비용과 지연이 증가한다. 최적점은 도메인과 use case마다 다르며, 이 지표들을 추적해야만 그 최적점을 찾을 수 있다.

## 5. 결론

LLM 환각 문제에 대한 이 글의 입장을 세 문장으로 압축한다.

- **Confidence is not truth.** 내부 확률은 경고 신호이지 진위 판단 기준이 아니다.
- **Retrieval is not verification.** RAG는 근거를 추가하지만, 근거의 정확성까지 보장하지는 않는다.
- **Consensus is not correctness.** 멀티에이전트 합의는 불일치 탐지에는 강하지만, 일치가 곧 정확성을 의미하지는 않는다.

그래서 다층 검증 라우팅이 필요하다. 이 글에서 제안한 Claim-level Verification Pipeline은 주장 단위로 불확실성을 측정하고, 위험도에 따라 검증 경로를 분기시키며, 확신이 부족하면 응답을 중단하는 구조다. 이 구조의 각 계층을 정리하면:

- **Layer 1: Uncertainty Sensing** — 내부 확률 + 변동성 모니터링
- **Layer 2: Evidence Retrieval** — RAG + 구조화 DB 대조 [10]
- **Layer 3: Claim Verification** — 주장-근거 정합성 검사 [1]
- **Layer 4: Cross-Model Adjudication** — 멀티에이전트 불일치 탐지 [9]
- **Layer 5: Human Escalation** — 고위험 도메인 전문가 검토 [7]
- **Layer 6: Feedback & Governance** — RLHF + 측정 + 임계값 동적 조정

현재 이 분야의 연구 대부분은 개별 계층의 성능 향상에 집중해 있다 [1][2][6]. 이 글에서 제안한 통합 파이프라인과 측정 프레임워크는 기존 연구에서 도출한 설계 원리이지, 전체가 실증 검증된 시스템은 아니다. 특히 전조 신호 기반 조기 경보 [3][5]나 claim-level 라우팅은 아직 개념적 제안 수준에 있다.

그럼에도 방향은 분명하다. **LLM 신뢰성의 핵심은 더 그럴듯하게 말하게 만드는 것이 아니라, 언제 말하지 않게 할지를 설계하는 데 있다.** 미래의 표준은 더 큰 모델이 아니라, 더 정교한 검증 라우팅을 가진 시스템일 가능성이 높다.

## 참고문헌

[1] Rodion Oblovatny, Alexandra Kuleshova, Konstantin Polev (2025). Probabilistic distances-based hallucination detection in LLMs with RAG.
[2] Jiongnan Liu, Jiajie Jin, Zihan Wang (2023). RETA-LLM: A Retrieval-Augmented Large Language Model Toolkit.
[3] Wenhao Li, Selvakumar Manickam, Yung-wey Chong (2025). PhishDebate: An LLM-Based Multi-Agent Framework for Phishing Website Detection.
[4] Muhammad Haseeb (2025). Context Engineering for Multi-Agent LLM Code Assistants Using Elicit, NotebookLM, ChatGPT, and Claude Code.
[5] Kaustubh D. Dhole (2025). To Retrieve or Not to Retrieve? Uncertainty Detection for Dynamic Retrieval Augmented Generation.
[6] Ming Cheung (2025). Hallucination Detection with Small Language Models.
[7] Suhas BN, Han-Chin Shing, Lei Xu (2025). Fact-Controlled Diagnosis of Hallucinations in Medical Text Summarization.
[8] Haoran Huan, Mihir Prabhudesai, Mengning Wu (2025). Can LLMs Lie? Investigation beyond Hallucination.
[9] Weizhou Shen, Chenliang Li, Hongzhan Chen (2024). Small LLMs Are Weak Tool Learners: A Multi-LLM Agent.
[10] Michael Theologitis, Dan Suciu (2025). Thucy: An LLM-based Multi-Agent System for Claim Verification across Relational Databases.
