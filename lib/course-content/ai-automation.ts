import type { Lesson } from "@/lib/mock-data";

export const aiAutomationLessons: Lesson[] = [
  {
    id: "ai-automation-l01",
    title: "AI in Healthcare & Banking/Finance",
    estMinutes: 6,
    status: "in_progress",
    pdfUrl: "/course-materials/ai-automation/Lesson_01_AI_Healthcare_Banking.pdf",
    content: `AI in Healthcare
Healthcare is one of the highest-impact domains for AI deployment. AI systems now assist at virtually every
stage of care delivery — from diagnostics to drug discovery.
Diagnostics: AI models trained on medical images detect cancer, diabetic retinopathy, and fractures
with radiologist-level accuracy.
Drug Discovery: AI (e.g., AlphaFold) predicts protein structures and screens billions of molecular
candidates, cutting discovery timelines from decades to years.
ICU Prediction: Early-warning systems flag patient deterioration hours before clinical signs appear,
enabling preventive intervention.
Wearables: Smartwatches detect atrial fibrillation, sleep apnoea, and blood oxygen anomalies in real
time.

AI in Banking & Finance
Fraud Detection: ML models analyse thousands of transaction features in milliseconds, flagging
anomalies with far greater accuracy than rule-based systems.
Algorithmic Trading: AI executes trades in microseconds based on market signals — high-frequency
trading now accounts for over 50% of US equity volume.
Risk Simulation: Monte Carlo and ML simulations model portfolio risk, stress-test scenarios, and
regulatory capital requirements.
Banking Chatbots: NLP-powered virtual assistants handle millions of routine customer queries daily
— balance checks, transfers, loan applications.
AI in finance is characterised by speed, scale, and stakes — a biased or faulty model can move
markets or deny credit to millions.

Key Ethical Considerations
• Healthcare: AI misdiagnosis liability; patient data privacy (HIPAA, GDPR); algorithmic bias in clinical
trials historically excluded minorities.
• Finance: Black-box credit scoring denying loans; flash crashes caused by correlated algorithmic
strategies; regulatory lag.
Key Takeaways
• Healthcare AI: diagnostics, drug discovery, ICU prediction, wearables.
• Finance AI: fraud detection, algorithmic trading, risk modelling, chatbots.
• Both domains demand rigorous accountability, transparency, and regulatory oversight.
Quick-Revision Questions
• Name two ways AI is used in diagnostics and two in drug discovery.
• How does AI-based fraud detection differ from rule-based systems?
• What ethical risks are present in AI-driven credit scoring?`,
  },
  {
    id: "ai-automation-l02",
    title: "AI in Creative Industries & Sports Analytics",
    estMinutes: 6,
    status: "not_started",
    pdfUrl: "/course-materials/ai-automation/Lesson_02_AI_Creative_Sports.pdf",
    content: `AI in Creative Industries
Generative Design: AI explores millions of design variations for architecture, product design, and
fashion given constraints (material, weight, cost). Example: Autodesk Generative Design.
Hyper-Personalised Marketing: AI generates personalised ad copy, images, and offers for each
individual user — a/b testing at population scale.
Music & Art Generation: Tools like Suno, DALL-E, and Midjourney create original music tracks and
visual art from text prompts in seconds.
Debate: is AI a creative collaborator or a threat to human creativity? Most practitioners say
'collaborator' — AI handles iteration, humans provide vision.

AI in Sports Analytics
Player Tracking: Computer vision systems (e.g., Second Spectrum in NBA) track every player 25
times per second — speed, positioning, fatigue indicators.
Injury Prevention: ML models predict injury risk from biomechanical and workload data, helping
coaches manage player loads.
Fan Engagement: AI personalises matchday experiences — tailored highlights, real-time stats
chatbots, predictive scorelines.
Automated Highlights: Vision models automatically identify and clip exciting moments for broadcast
and social media.
The Moneyball Effect — Extended
The 2002 Oakland Athletics pioneered data-driven player evaluation. Today every major sports franchise
employs data science and AI teams — from player recruitment to in-game tactics. AI has become the
competitive moat in elite sport.

Key Takeaways
• Generative AI enables designers to explore vast design spaces automatically.
• Marketing AI personalises content at individual scale, increasing conversion rates.
• Sports AI: real-time tracking, injury prediction, fan personalisation, automated highlights.
• Both domains raise IP and attribution questions as AI-generated content proliferates.
Quick-Revision Questions
• How does generative design differ from traditional CAD design?
• Describe two ways sports teams use AI to gain competitive advantage.
• What ethical issues arise when AI creates commercial art or music?`,
  },
  {
    id: "ai-automation-l03",
    title: "Algorithmic Bias",
    estMinutes: 6,
    status: "not_started",
    pdfUrl: "/course-materials/ai-automation/Lesson_03_Algorithmic_Bias.pdf",
    content: `What Is Algorithmic Bias?
Algorithmic bias occurs when an AI system produces systematically unfair outcomes for certain groups —
racial, gender, age, or socioeconomic. AI has no innate sense of fairness; it replicates and often amplifies
the prejudices encoded in its training data.
Key principle: AI reflects the world as it was in the training data, not the world as it should be.
Root Causes of Bias
Historical bias: Training data reflects past discrimination — e.g., historical hiring data underrepresents
women in tech leadership.
Sampling bias: Training data doesn't represent all groups equally — facial recognition trained mostly
on lighter-skinned faces underperforms on darker skin.
Label bias: Human annotators bring their own biases to labelling tasks.
Feedback loops: A biased model makes biased decisions, generating biased data, which trains an
even more biased next model.

Real-World Examples
• COMPAS recidivism tool: predicted higher re-offending risk for Black defendants than white
defendants with similar profiles.
• Amazon's CV-screening AI: downgraded resumes containing the word 'women's' (as in 'women's
chess club') — scrapped in 2018.
• Facial recognition: NIST study found error rates up to 100x higher for dark-skinned women vs.
light-skinned men.
• Healthcare: model allocating care resources used cost as a proxy for need — Black patients received
worse care allocation.

Mitigation Strategies
Diverse data collection: Actively curate training data to represent all demographic groups.
Fairness metrics: Measure demographic parity, equalized odds, and calibration across protected
groups.
Bias audits: Regular third-party audits of model decisions before and after deployment.
Explainability (XAI): Use interpretable models or explainability tools (SHAP, LIME) to surface why
decisions were made.
Human-in-the-loop: High-stakes decisions (credit, parole, hiring) should retain human review.
Key Takeaways
• AI amplifies biases present in training data — it has no innate fairness.
• Bias sources: historical data, sampling imbalance, label bias, feedback loops.
• Mitigation: diverse data, fairness metrics, audits, explainability, human oversight.
Quick-Revision Questions
• Explain why AI systems can be biased even when designers have good intentions.
• Describe two real-world cases of algorithmic bias and their consequences.
• What is a fairness metric? Name two.`,
  },
  {
    id: "ai-automation-l04",
    title: "Hallucinations & the Fact-Checking Checklist",
    estMinutes: 6,
    status: "not_started",
    pdfUrl: "/course-materials/ai-automation/Lesson_04_Hallucinations_FactChecking.pdf",
    content: `What Is an AI Hallucination?
An AI hallucination is a confident, fluent, but factually false output from an LLM. The model generates text by
predicting statistically likely next tokens — not by verifying facts against a trusted database. When it lacks
reliable training signal, it fabricates plausible-sounding content.
Critical insight: hallucinations are a feature of the architecture, not a bug that can simply be 'fixed'
— they require systematic mitigation.
Why Hallucinations Are Dangerous
• Legal: lawyers have submitted AI-generated citations to courts that turned out to be fabricated cases.
• Medical: patients following AI medical advice without verification risk serious harm.
• Academic: hallucinated statistics and sources erode the integrity of research.
• Business: incorrect market data or contract terms generated by AI can cause financial loss.

The Three-Step Fact-Checking Checklist
Apply this checklist before acting on any AI-generated factual claim:
StepActionExample
1. IDENTIFYFlag every specific factual claim: names, dates, statistics, citations.'The study from Harvard (2021) found...' — flag this.
2. SEARCHIndependently verify each flagged claim using authoritative primary sources.Search PubMed, Google Scholar, official government sites.
3. CROSS-REFERENCEConfirm the claim appears in at least two independent, credible sources.If only one source confirms it — or none — treat as unverified.

Reducing Hallucinations — Developer Strategies
• RAG (Retrieval-Augmented Generation): ground responses in retrieved, verified documents.
• Temperature tuning: lower temperature = less creative, more conservative and factual outputs.
• Structured prompts: 'Answer only based on the context below. If unsure, say so.'
• Citation requirements: prompt the model to cite sources for every claim.
• Uncertainty prompting: ask the model to rate its own confidence.
Key Takeaways
• Hallucinations are confident false outputs — a structural feature of LLMs.
• High-stakes domains (law, medicine, finance) require rigorous fact-checking.
• The three-step checklist: Identify → Search → Cross-reference.
• Developer mitigations: RAG, temperature control, structured prompts, citation requirements.
Quick-Revision Questions
• Why do LLMs hallucinate? (architectural explanation)
• Apply the three-step checklist to an AI claim about a historical statistic.
• Name three developer-side strategies to reduce hallucination.`,
  },
  {
    id: "ai-automation-l05",
    title: "Deepfakes & Information Integrity",
    estMinutes: 6,
    status: "not_started",
    pdfUrl: "/course-materials/ai-automation/Lesson_05_Deepfakes_Information_Integrity.pdf",
    content: `What Are Deepfakes?
Deepfakes are synthetic audio, video, or images generated by AI — typically using Generative Adversarial
Networks (GANs) or diffusion models — that realistically impersonate real people. The term combines 'deep
learning' and 'fake'.
Face-swap deepfakes: Replace one person's face on another's body in video with high realism.
Voice cloning: Synthesise a convincing replica of someone's voice from as little as 3 seconds of
audio.
Text-to-video deepfakes: Generate entirely fabricated news segments, speeches, or events.
2025 reality: high-quality deepfakes can be created in minutes using free or low-cost tools —
detection is increasingly difficult.

Risks of Deepfakes
Non-consensual intimate imagery (NCII): The most prevalent harm — 96% of online deepfakes are
non-consensual sexual content targeting women.
Political disinformation: Fabricated speeches, election interference, manufactured evidence of
atrocities.
Financial fraud: CEO voice cloning to authorise wire transfers — multiple $25M+ fraud cases
documented.
Reputation damage: False statements attributed to individuals, eroding trust in authentic content.
Erosion of epistemic trust: The 'liar's dividend' — even real videos can be dismissed as deepfakes.

Preventive Measures
Technical detection: AI detectors (e.g., Microsoft Video Authenticator) analyse inconsistencies in
lighting, blinking, and pixel-level artefacts.
Content provenance (C2PA): Cryptographic watermarks embedded at capture time authenticate the
origin of media.
Digital literacy: Teaching people to pause, verify, and cross-reference before sharing suspicious
media.
Legal frameworks: Deepfake criminalisation laws are being passed in multiple jurisdictions (UK
Online Safety Act, US DEFIANCE Act).
Platform policies: Social media platforms are required to label AI-generated content and remove
NCII.
Key Takeaways
• Deepfakes use AI to synthesise realistic fake audio, video, and images of real people.
• Risks: NCII, political disinformation, fraud, epistemic erosion.
• Countermeasures: AI detection, C2PA provenance, digital literacy, legislation.
Quick-Revision Questions
• What technology underlies most deepfake generation?
• Explain the 'liar's dividend' — how deepfakes harm trust even in authentic content.
• What is C2PA and how does it help authenticate media?`,
  },
  {
    id: "ai-automation-l06",
    title: "Privacy, Environment, Accountability & Workforce Ethics",
    estMinutes: 6,
    status: "not_started",
    pdfUrl: "/course-materials/ai-automation/Lesson_06_Privacy_Ethics_Workforce.pdf",
    content: `Privacy & Surveillance
AI-powered surveillance systems — facial recognition in public spaces, predictive policing, social media
monitoring — raise profound privacy concerns. The capability to identify, track, and profile individuals at
scale without their knowledge or consent challenges fundamental rights.
• Mass facial recognition: China's Social Credit System; police use of Clearview AI in democracies.
• Workplace surveillance: AI monitoring keystrokes, eye-tracking, communication sentiment.
• Ad targeting: detailed behavioural profiles built from data aggregated across devices and platforms.
Key tension: surveillance AI can enhance public safety AND enable authoritarian control —
context and oversight are everything.

Environmental Impact
Training large AI models consumes enormous energy and water. This environmental cost is increasingly
visible as AI scales up:
• GPT-3 training emitted ~552 tonnes of CO2 — equivalent to ~120 petrol cars driven for a year.
• Inference (running) a large model is less energy-intensive per query but happens billions of times
daily.
• Data centres require enormous water for cooling — some models consume millions of litres per day.
• Mitigation: model compression (smaller, efficient models), renewable energy data centres,
mixture-of-experts architectures.
Accountability — The Unresolved Questions
Who is responsible?: When an AI makes a harmful decision — the developer, the deployer, the user,
or the AI itself?
Explainability gap: Many high-stakes AI decisions (credit, medical) cannot be explained in
human-understandable terms.
Regulatory lag: AI capabilities advance faster than governments can legislate — the EU AI Act is a
landmark attempt.

Workforce Ethics
AI automation displaces some roles while creating others. The ethical question is not just economic but
social — how do we ensure the transition is equitable?
• Routine cognitive tasks (data entry, basic analysis, customer service) face the highest automation
risk.
• Roles requiring creativity, empathy, complex judgment, and physical dexterity are more resilient.
• Reskilling is the policy response — lifelong learning, portable benefits, wage support during
transitions.
Estimated: AI will automate ~15% of global work tasks by 2030 (McKinsey) while creating new
roles in AI oversight, data curation, and human-AI collaboration.
Key Takeaways
• Privacy: AI surveillance requires strong legal frameworks and democratic oversight.
• Environment: large model training has significant carbon and water footprints.
• Accountability: liability frameworks and explainability requirements are still evolving.
• Workforce: reskilling and equitable transition policies are essential.
Quick-Revision Questions
• What is the 'explainability gap' and why does it matter for accountability?
• Describe two environmental costs of large AI model training.
• Which types of jobs are most and least at risk from AI automation?`,
  },
  {
    id: "ai-automation-l07",
    title: "Proprietary vs. Open-Source AI",
    estMinutes: 6,
    status: "not_started",
    pdfUrl: "/course-materials/ai-automation/Lesson_07_Proprietary_vs_OpenSource_AI.pdf",
    content: `What Is Proprietary AI?
Proprietary (closed-source) AI is developed by a corporation whose model weights, training data, and
architecture are trade secrets. Users access it via a paid API or product; they cannot inspect, modify, or
reproduce the model.
• Examples: GPT-4 (OpenAI), Gemini (Google), Claude (Anthropic), Grok (xAI).
• Pros: typically best-in-class performance, enterprise SLAs, safety filtering, managed infrastructure.
• Cons: vendor lock-in, no transparency, data privacy concerns (prompts may be used for training),
ongoing subscription cost.

What Is Open-Source AI?
Open-source AI releases model weights (and sometimes training code/data) publicly. Anyone can
download, run, fine-tune, and deploy the model — including on their own hardware.
• Examples: Llama 3 (Meta), Mistral, Falcon, Gemma (Google), Phi (Microsoft).
• Pros: transparency, customisability, privacy (data stays on-premise), no API costs at scale, research
reproducibility.
• Cons: requires ML expertise to deploy, performance may lag frontier proprietary models, no liability
coverage, potential misuse.
Trend: open-source models are closing the performance gap — Llama 3 70B competes with
GPT-3.5 on many benchmarks.

Comparison Table
CriterionProprietaryOpen-Source
AccessAPI / product onlyDownload & run locally
PerformanceState-of-the-artCatching up fast
TransparencyBlack boxInspectable weights
Data PrivacyPrompts may be loggedFull local control
CostPay per tokenFree (compute costs)
CustomisationLimited (fine-tune API)Full fine-tuning access
Safety filtersBuilt-inUser responsibility
Quick-Revision Questions
• What does 'open-source' mean in the context of AI models specifically?
• For a healthcare company with strict data privacy requirements, which would you recommend and
why?
• Name two proprietary and two open-source LLMs.`,
  },
  {
    id: "ai-automation-l08",
    title: "Future AI Careers & Future Trends",
    estMinutes: 6,
    status: "not_started",
    pdfUrl: "/course-materials/ai-automation/Lesson_08_AI_Careers_Future_Trends.pdf",
    content: `Non-Technical AI Career Paths
You do not need a PhD in machine learning to build a career in AI. A wave of AI-adjacent roles has emerged
that require domain expertise, communication skills, ethics, and business acumen rather than advanced
mathematics or coding.
AI Product Manager: Defines the vision, roadmap, and success metrics for AI-powered products.
Requires business sense and understanding of AI capabilities/limits.
Prompt Engineer: Designs, tests, and optimises prompts for LLM applications. Requires
communication skills and systematic experimentation.
AI Ethicist / Policy Analyst: Audits AI systems for bias, privacy, and fairness; advises on regulation
and governance.
AI Trainer / Data Annotator: Labels data, rates model outputs (RLHF), and provides domain expertise
to improve models.
AI Journalist / Educator: Explains AI developments to non-technical audiences — media, e-learning,
corporate training.

Five Key Future Trends in AI
1. Edge AI: Running AI models locally on devices (phones, IoT sensors, cars) rather than in the cloud.
Benefits: lower latency, privacy, offline capability.
2. Multimodal AI: Models that simultaneously process text, images, audio, and video in a single
architecture (e.g., GPT-4o, Gemini). Enables richer, more natural human-AI interaction.
3. AI Regulation: Governments worldwide are legislating AI — EU AI Act (2024), US Executive
Orders, India DPDP Act. Compliance expertise will be in high demand.
4. Green AI: Pressure to reduce the carbon and water footprint of AI through efficient architectures
(MoE, distillation), renewable data centres, and model sharing.
5. Collaborative / Agentic AI: AI agents that autonomously plan, use tools, and collaborate to
complete complex multi-step tasks — the next frontier beyond simple chatbots.

Preparing for an AI-Augmented Career
• Develop AI literacy: understand capabilities, limits, hallucinations, and ethics.
• Master prompt engineering: the universal skill for any role interacting with AI tools.
• Build domain depth: AI augments domain experts — strong expertise in law, medicine, finance, or
design + AI fluency = high value.
• Stay current: AI moves fast; follow trusted sources (Anthropic, OpenAI, Google DeepMind research
blogs, MIT Tech Review).
• Experiment: build small AI-powered projects using free APIs to demonstrate practical skills.
The best AI careers in the next decade will belong to people who understand both the human
problem and the AI tool — not just one or the other.
Quick-Revision Questions
• Name three non-technical AI career paths and their required skills.
• Explain Edge AI and give two use cases where it is preferable to cloud AI.
• What is Agentic AI and how does it differ from a standard chatbot?`,
  },
];
