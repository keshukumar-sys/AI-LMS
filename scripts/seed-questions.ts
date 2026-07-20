// Idempotent seed script: clears and reinserts the module assessment question bank.
// Module 1 (AI Foundations) uses the exact question bank supplied by the course owner.
// Modules 2-8 are authored to match its structure, style, and difficulty.
//
// Run with: npm run seed:questions

import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import { MongoClient } from "mongodb";

interface RawMcq {
  text: string;
  choices: [string, string, string, string];
  correct: 0 | 1 | 2 | 3;
}
interface RawText {
  text: string;
}
interface RawModuleDef {
  moduleId: string;
  mcqs: RawMcq[]; // 20
  scenarios: RawText[]; // 4
  practical: RawText; // 1
  subjectives: RawText[]; // 2
  challenge: RawText; // 1
}

const OPTION_IDS = ["a", "b", "c", "d"] as const;

function mcq(text: string, choices: [string, string, string, string], correct: 0 | 1 | 2 | 3): RawMcq {
  return { text, choices, correct };
}
function t(text: string): RawText {
  return { text };
}

// ---------------------------------------------------------------------------
// Module 1: AI Foundations (verbatim question bank supplied by the course owner)
// ---------------------------------------------------------------------------
const module1: RawModuleDef = {
  moduleId: "m1-ai-foundations",
  mcqs: [
    mcq(
      `A logistics company uses AI to optimize delivery routes based on weather, traffic, and fuel prices. Which AI capability is most relevant?`,
      [`Reinforcement Learning`, `Computer Vision`, `OCR`, `Rule-based systems`],
      0
    ),
    mcq(
      `Which statement best differentiates Machine Learning from traditional programming?`,
      [
        `Machine Learning uses only structured data.`,
        `Machine Learning learns patterns from data instead of following explicitly programmed rules.`,
        `Traditional programming requires GPUs.`,
        `Machine Learning does not require algorithms.`,
      ],
      1
    ),
    mcq(
      `A recommendation engine that suggests movies based on user history is an example of:`,
      [`Computer Vision`, `Reinforcement Learning`, `Supervised Learning`, `Robotics`],
      2
    ),
    mcq(
      `Which of the following is NOT a characteristic of AGI?`,
      [`Adaptability across domains.`, `Human-level reasoning.`, `Task-specific intelligence.`, `General problem-solving.`],
      2
    ),
    mcq(
      `Why is ASI considered hypothetical?`,
      [
        `It lacks mathematical foundations.`,
        `It has already been developed.`,
        `Current AI systems are still narrow and task-specific.`,
        `ASI requires quantum computers.`,
      ],
      2
    ),
    mcq(`Which AI branch powers speech-to-text systems?`, [`NLP`, `Computer Graphics`, `Reinforcement Learning`, `Databases`], 0),
    mcq(
      `A chatbot answers customer questions but fails when asked unrelated questions. This is an example of:`,
      [`AGI`, `ASI`, `ANI`, `Quantum AI`],
      2
    ),
    mcq(`In supervised learning, labels are:`, [`Hidden neurons.`, `Expected outputs.`, `Model weights.`, `Optimization functions.`], 1),
    mcq(
      `Which industry was among the earliest adopters of AI-driven fraud detection?`,
      [`Agriculture`, `Banking and Finance`, `Construction`, `Tourism`],
      1
    ),
    mcq(
      `Which of the following is a major challenge in AI adoption?`,
      [`Data quality issues`, `Faster processors`, `Better internet`, `More storage`],
      0
    ),
    mcq(`AlphaGo defeating world champions is an example of:`, [`ANI`, `AGI`, `ASI`, `Robotics`], 0),
    mcq(
      `Which of the following best describes intelligence hierarchy?`,
      [`Data → Hardware → Software`, `ANI → AGI → ASI`, `AI → SQL → Python`, `Rules → APIs → Models`],
      1
    ),
    mcq(
      `Which statement about AI replacing jobs is most accurate?`,
      [
        `AI will eliminate all jobs.`,
        `AI only creates jobs.`,
        `AI automates some tasks while creating new opportunities.`,
        `AI affects only IT jobs.`,
      ],
      2
    ),
    mcq(`Which field contributes least to AI?`, [`Psychology`, `Mathematics`, `Philosophy`, `Civil Engineering`], 3),
    mcq(
      `Why are large datasets important for AI systems?`,
      [`To reduce memory usage.`, `To improve pattern recognition.`, `To simplify algorithms.`, `To replace optimization.`],
      1
    ),
    mcq(
      `Which technology enables self-driving cars to detect road signs?`,
      [`NLP`, `Computer Vision`, `SQL`, `OCR only`],
      1
    ),
    mcq(
      `Which of the following is NOT a limitation of current AI systems?`,
      [`Bias in data`, `Lack of common sense`, `Perfect reasoning`, `Hallucinations`],
      2
    ),
    mcq(
      `A factory uses robots to inspect products. Which combination is most likely?`,
      [`NLP + Blockchain`, `Computer Vision + AI`, `Databases + CSS`, `OCR + Networking`],
      1
    ),
    mcq(
      `Which of the following statements about AI ethics is TRUE?`,
      [
        `AI decisions are always unbiased.`,
        `AI systems inherit biases from training data.`,
        `AI ethics only applies to healthcare.`,
        `AI regulation is unnecessary.`,
      ],
      1
    ),
    mcq(
      `Which factor most influences the success of an AI project?`,
      [`Programming language.`, `GPU brand.`, `Data quality and business alignment.`, `Number of developers.`],
      2
    ),
  ],
  scenarios: [
    t(
      `Scenario: A hospital wants to use AI to predict patient diseases.\n\n- Which AI techniques would you use?\n- What data would be required?\n- What ethical risks may arise?`
    ),
    t(
      `Scenario: A retail company wants to recommend products to customers.\n\n- Which AI model would you choose?\n- How would the recommendation system work?\n- Which KPIs would measure success?`
    ),
    t(
      `Scenario: A university wants to detect plagiarism using AI.\n\n- Which AI technologies are required?\n- What challenges might occur?\n- How would you evaluate performance?`
    ),
    t(
      `Scenario: A city plans to implement AI-powered traffic management.\n\n- What data sources would be needed?\n- Which AI methods would be suitable?\n- What societal concerns should be considered?`
    ),
  ],
  practical: t(
    `Practical Task: Choose any industry (healthcare, finance, education, retail, or manufacturing). Prepare a report that includes: existing challenges, processes before AI adoption, AI-based solutions, expected business impact, and risks and limitations.`
  ),
  subjectives: [
    t(`Explain the differences between ANI, AGI, and ASI with real-world examples and discuss why AGI remains a challenge.`),
    t(`Compare industries before and after AI adoption, focusing on productivity, decision-making, and workforce transformation.`),
  ],
  challenge: t(
    `Challenge: You are the Chief AI Officer of a multinational company. Prepare a strategic proposal addressing: why your company should invest in AI, which departments should adopt AI first, which risks and ethical concerns exist, and how success will be measured over five years.`
  ),
};

// ---------------------------------------------------------------------------
// Module 2: How AI Works
// ---------------------------------------------------------------------------
const module2: RawModuleDef = {
  moduleId: "m2-how-ai-works",
  mcqs: [
    mcq(
      `A transformer-based model determines the importance of each word relative to every other word in a sentence using:`,
      [`Convolutional filters`, `Self-attention`, `Recurrent loops`, `Decision trees`],
      1
    ),
    mcq(
      `Which component of a neural network introduces non-linearity, allowing it to model complex patterns?`,
      [`Activation function`, `Loss function`, `Learning rate`, `Batch size`],
      0
    ),
    mcq(
      `During training, a model's weights are adjusted using the gradients computed via:`,
      [`Tokenization`, `Backpropagation`, `Sampling`, `Quantization`],
      1
    ),
    mcq(
      `Why do transformer models require positional encoding?`,
      [`To reduce model size`, `Self-attention has no inherent sense of word order`, `To speed up tokenization`, `To prevent overfitting`],
      1
    ),
    mcq(
      `A stable diffusion model generates images by:`,
      [
        `Directly copying pixels from training images`,
        `Iteratively removing noise from a random starting point guided by a prompt`,
        `Searching a database of pre-made images`,
        `Applying fixed image filters`,
      ],
      1
    ),
    mcq(
      `Which term describes a model performing very well on training data but poorly on new data?`,
      [`Underfitting`, `Overfitting`, `Regularization`, `Convergence`],
      1
    ),
    mcq(
      `Tokenization in an LLM refers to:`,
      [`Encrypting user data`, `Breaking text into sub-word units the model can process`, `Compressing model weights`, `Assigning API rate limits`],
      1
    ),
    mcq(
      `A company notices their AI writing tool sometimes invents fake citations. This is best described as:`,
      [`Overfitting`, `Hallucination`, `Quantization`, `Tokenization`],
      1
    ),
    mcq(
      `Why are GPUs preferred over CPUs for training deep learning models?`,
      [`GPUs are cheaper`, `GPUs can perform many parallel matrix operations simultaneously`, `GPUs use less electricity`, `GPUs require no cooling`],
      1
    ),
    mcq(
      `In a neural network, "weights" represent:`,
      [
        `The number of layers`,
        `The strength of connections between neurons, learned during training`,
        `The size of the training dataset`,
        `The programming language used`,
      ],
      1
    ),
    mcq(
      `Which best explains why large language models can perform tasks they weren't explicitly trained for (emergent behavior)?`,
      [
        `They memorize every possible answer in advance`,
        `Patterns learned at scale generalize to related, unseen tasks`,
        `They query the internet in real time`,
        `They use rule-based lookup tables`,
      ],
      1
    ),
    mcq(
      `What is the primary purpose of an embedding in NLP models?`,
      [
        `To store passwords securely`,
        `To represent words/concepts as numerical vectors capturing semantic meaning`,
        `To compress image files`,
        `To schedule model training jobs`,
      ],
      1
    ),
    mcq(
      `A model's "context window" refers to:`,
      [`The physical screen size it's displayed on`, `The maximum amount of text it can consider at once`, `The number of GPUs used to train it`, `The company that built it`],
      1
    ),
    mcq(
      `Fine-tuning a pretrained model means:`,
      [
        `Training a brand-new model from scratch`,
        `Further training an existing model on a smaller, task-specific dataset`,
        `Deleting unnecessary layers`,
        `Increasing the model's context window automatically`,
      ],
      1
    ),
    mcq(
      `Which of the following best describes "inference" in machine learning?`,
      [`Collecting labeled training data`, `Using a trained model to generate predictions on new input`, `Cleaning a dataset`, `Adjusting the learning rate`],
      1
    ),
    mcq(
      `Why might two runs of the same generative image model with the same prompt produce different results?`,
      [`The model is broken`, `Randomness (seed/noise) in the generation process`, `The GPU changed`, `The prompt was translated`],
      1
    ),
    mcq(
      `What does "quantization" do to a trained model?`,
      [`Increases its training dataset size`, `Reduces the precision of its weights to make it smaller/faster`, `Adds more attention layers`, `Converts it into a rule-based system`],
      1
    ),
    mcq(
      `A chatbot gives a subtly wrong answer with high confidence and no indication of uncertainty. This illustrates a key limitation of:`,
      [`Rule-based systems`, `Neural network-based generative models lacking built-in confidence calibration`, `SQL databases`, `Spreadsheet macros`],
      1
    ),
    mcq(
      `Which describes the relationship between parameters and model capacity?`,
      [
        `Fewer parameters always mean better accuracy`,
        `More parameters generally increase a model's capacity to learn complex patterns, at higher compute cost`,
        `Parameters only affect training speed, not capacity`,
        `Parameters are unrelated to model performance`,
      ],
      1
    ),
    mcq(
      `What is "prompt engineering" fundamentally about?`,
      [`Writing code to train new models`, `Structuring input text to reliably steer a model's output`, `Repairing broken GPUs`, `Designing chatbot logos`],
      1
    ),
  ],
  scenarios: [
    t(
      `Scenario: A startup wants to fine-tune an open-source LLM for legal document summarization.\n\n- What data would be required?\n- What risks exist in fine-tuning on sensitive legal data?\n- How would you evaluate the fine-tuned model's quality?`
    ),
    t(
      `Scenario: An AI image generator is producing biased or stereotypical outputs for certain prompts.\n\n- What could be causing this?\n- How would you diagnose the source of the bias?\n- What mitigation strategies would you propose?`
    ),
    t(
      `Scenario: A team wants to reduce their LLM's response latency without retraining it.\n\n- Which techniques could help?\n- What tradeoffs would they face?\n- How would you measure success?`
    ),
    t(
      `Scenario: A customer support chatbot occasionally hallucinates policy details that don't exist.\n\n- What architectural changes could reduce hallucination?\n- How would retrieval-augmented generation (RAG) help here?\n- How would you test whether the fix worked?`
    ),
  ],
  practical: t(
    `Practical Task: Pick a generative AI model type (text, image, or code). Prepare a report covering: how it processes input, the core architecture concept behind it (in plain language), a real example of it in use, its known limitations, and one way its output could be verified for correctness.`
  ),
  subjectives: [
    t(`Explain how transformer architecture changed the trajectory of AI development compared to earlier neural network approaches, with reference to attention mechanisms.`),
    t(`Discuss why "black box" AI models raise interpretability concerns, and describe two approaches organizations use to make AI decisions more explainable.`),
  ],
  challenge: t(
    `Challenge: You are advising a company on whether to build a custom AI model or fine-tune an existing one for their internal knowledge base search. Prepare a recommendation covering: technical tradeoffs, cost and time implications, data requirements, risks, and how you'd measure success over 6 months.`
  ),
};

// ---------------------------------------------------------------------------
// Module 3: AI Productivity
// ---------------------------------------------------------------------------
const module3: RawModuleDef = {
  moduleId: "m3-ai-productivity",
  mcqs: [
    mcq(
      `An employee uses an AI assistant to draft a first version of a report, then edits it for accuracy. This workflow best demonstrates:`,
      [`Full automation replacing human judgment`, `AI as a productivity accelerator with human review`, `AI hallucination`, `Prompt injection`],
      1
    ),
    mcq(
      `Which prompting technique is most likely to improve the quality of an AI-generated analysis?`,
      [`A single vague one-word prompt`, `Providing context, a clear goal, and the desired output format`, `Asking the AI to guess the user's intent`, `Avoiding any examples`],
      1
    ),
    mcq(
      `A manager wants AI to summarize a 2-hour meeting transcript. Which AI capability is being used?`,
      [`Computer vision`, `Natural language summarization`, `Robotics`, `Predictive maintenance`],
      1
    ),
    mcq(
      `What is the biggest productivity risk of blindly trusting AI-generated content without review?`,
      [`It runs too slowly`, `Factual errors or hallucinations being published as if verified`, `It uses too much electricity`, `It cannot generate long text`],
      1
    ),
    mcq(
      `"Iterative prompting" refers to:`,
      [`Asking the same question to multiple people`, `Refining a prompt across multiple exchanges based on the AI's previous output`, `Running a model only once`, `Deleting a chat history`],
      1
    ),
    mcq(
      `Which task is AI currently LEAST reliable at performing autonomously without human oversight?`,
      [`Drafting an email`, `Making final high-stakes business decisions with legal consequences`, `Summarizing a document`, `Generating meeting notes`],
      1
    ),
    mcq(
      `An employee saves 3 hours a week using AI to draft routine emails. This is an example of:`,
      [`AI replacing the job entirely`, `AI augmenting human productivity on repetitive tasks`, `AI ethics violation`, `Model overfitting`],
      1
    ),
    mcq(
      `Which of the following is a best practice when using AI tools with company data?`,
      [`Paste all confidential data into any public AI tool`, `Check the tool's data-handling policy before sharing sensitive information`, `Ignore data privacy policies`, `Share client passwords for convenience`],
      1
    ),
    mcq(
      `What does "context stuffing" mean in prompt engineering?`,
      [`Deleting unnecessary information from a prompt`, `Providing excessive, poorly organized information that confuses the model`, `Compressing a model's weights`, `Training a new model`],
      1
    ),
    mcq(
      `Which AI productivity use case carries the HIGHEST risk if left unchecked?`,
      [`Generating a blog post outline`, `Auto-summarizing an internal wiki page`, `AI auto-sending client-facing emails without human review`, `Brainstorming presentation titles`],
      2
    ),
    mcq(
      `A researcher uses AI to quickly find and synthesize information from multiple papers. What is the main productivity benefit here?`,
      [`It eliminates the need to understand the topic`, `It accelerates information gathering and synthesis, saving research time`, `It guarantees 100% factual accuracy`, `It replaces the need for peer review`],
      1
    ),
    mcq(
      `Why is it important to verify AI-generated statistics before including them in a report?`,
      [`AI never makes numerical errors`, `AI can generate plausible-sounding but incorrect numbers (hallucination)`, `Statistics are irrelevant in reports`, `AI cannot process numbers`],
      1
    ),
    mcq(
      `Which combination best describes an effective AI productivity workflow?`,
      [`AI drafts, human reviews and refines`, `AI drafts, no review, publish immediately`, `Human drafts everything, AI never used`, `AI decides final publication without oversight`],
      0
    ),
    mcq(
      `A sales team uses AI to auto-generate personalized outreach emails at scale. What ethical consideration is most relevant?`,
      [`Font size consistency`, `Ensuring personalization doesn't feel manipulative or use improperly sourced data`, `Email server uptime`, `Character count limits`],
      1
    ),
    mcq(
      `What is the primary benefit of using AI-powered scheduling assistants?`,
      [`They eliminate the need for calendars`, `They reduce time spent coordinating meeting times across people`, `They replace human meetings entirely`, `They guarantee meeting attendance`],
      1
    ),
    mcq(
      `When using an AI coding assistant, what remains the developer's responsibility?`,
      [`Nothing, the AI is fully responsible`, `Reviewing, testing, and understanding the generated code before deploying it`, `Only formatting the code`, `Naming the AI model`],
      1
    ),
    mcq(
      `Which factor most determines whether an AI productivity tool is worth adopting in a team?`,
      [`How futuristic it looks`, `Whether it measurably saves time or improves output quality for real tasks`, `The number of features it has`, `Its logo design`],
      1
    ),
    mcq(
      `An AI tool consistently produces generic, low-quality outputs for a specific team's tasks. What is the most likely first troubleshooting step?`,
      [`Abandon AI entirely`, `Improve prompt specificity and provide better examples/context`, `Switch to a completely unrelated tool with no evaluation`, `Ignore the issue`],
      1
    ),
    mcq(
      `What risk does over-reliance on AI for critical thinking tasks pose over time?`,
      [`Faster computer performance`, `Potential erosion of independent analytical skills if not balanced with human judgment`, `Increased creativity with no downside`, `No risk at all`],
      1
    ),
    mcq(
      `Which metric best measures whether an AI productivity initiative succeeded?`,
      [`Number of AI tools purchased`, `Measurable time saved and quality maintained/improved on real work outputs`, `How advanced the AI sounds`, `Number of employees who heard about it`],
      1
    ),
  ],
  scenarios: [
    t(
      `Scenario: A marketing team wants to use AI to speed up content creation without sacrificing brand voice.\n\n- How would you set up the AI workflow?\n- What guardrails would you put in place?\n- How would you measure whether it's working?`
    ),
    t(
      `Scenario: An employee discovers that an AI writing tool occasionally fabricates statistics in drafts.\n\n- What immediate action should be taken?\n- How would you build a review process to catch this?\n- What long-term policy would you recommend?`
    ),
    t(
      `Scenario: A customer service team wants AI to draft responses to support tickets for agents to review and send.\n\n- What would the workflow look like?\n- What productivity gains and risks should be tracked?\n- How would you train agents to use it effectively?`
    ),
    t(
      `Scenario: A finance team wants to use AI to speed up first-pass analysis of quarterly reports.\n\n- What tasks would you delegate to AI vs. keep human-led?\n- What accuracy checks would you require before results are used?\n- How would you measure ROI of this AI adoption?`
    ),
  ],
  practical: t(
    `Practical Task: Choose a repetitive task from your own work or studies. Document: the current manual process, how you'd redesign it using an AI tool, the prompt(s) you'd use, expected time savings, and how you'd verify output quality before relying on it.`
  ),
  subjectives: [
    t(`Explain the difference between AI as a "replacement" versus AI as an "augmentation" tool in the workplace, with examples of tasks suited to each.`),
    t(`Discuss the risks of prompt-dependent productivity gains (productivity that disappears if the AI tool changes or is unavailable) and how organizations can build resilience against this.`),
  ],
  challenge: t(
    `Challenge: You are the Head of Operations at a mid-sized company. Prepare a proposal for rolling out AI productivity tools across three departments, covering: tool selection criteria, training plan, guardrails against misuse, expected productivity gains, and how you'll measure success after 90 days.`
  ),
};

// ---------------------------------------------------------------------------
// Module 4: AI Security and Ethics
// ---------------------------------------------------------------------------
const module4: RawModuleDef = {
  moduleId: "m4-ai-security-ethics",
  mcqs: [
    mcq(
      `A video circulates showing a public figure saying things they never said, generated using AI. This is an example of:`,
      [`A deepfake`, `A firewall breach`, `A phishing email`, `A denial-of-service attack`],
      0
    ),
    mcq(
      `Which of the following is a common AI-driven cybersecurity threat?`,
      [`AI-generated phishing emails that mimic writing style convincingly`, `Slower internet speeds`, `Increased server storage costs`, `Reduced need for passwords`],
      0
    ),
    mcq(
      `What is "adversarial input" in the context of AI security?`,
      [`Data intentionally crafted to fool an AI model into making errors`, `A backup copy of training data`, `A model's confidence score`, `A type of encryption key`],
      0
    ),
    mcq(
      `Why is bias in AI training data a serious ethical concern?`,
      [`It makes models run slower`, `It can cause the model to make unfair or discriminatory decisions`, `It increases storage costs`, `It has no real-world impact`],
      1
    ),
    mcq(
      `Which regulation-related concept is most relevant to AI governance?`,
      [`Requiring transparency and accountability in automated decision-making`, `Banning all AI research`, `Removing all human oversight`, `Making AI models open-source by law`],
      0
    ),
    mcq(
      `A company deploys a facial recognition system that performs significantly worse on certain demographic groups. This is primarily a:`,
      [`Hardware failure`, `Data/algorithmic bias issue`, `Networking issue`, `Encryption issue`],
      1
    ),
    mcq(
      `What is the main privacy risk of feeding confidential company data into a public AI chatbot?`,
      [`The chatbot might become too slow`, `The data may be stored, logged, or used to further train the model`, `The chatbot will always refuse to respond`, `There is no privacy risk`],
      1
    ),
    mcq(
      `Which of these is an example of "AI model misuse"?`,
      [`Using AI to detect fraud in real time`, `Using generative AI to create fake reviews at scale`, `Using AI to summarize meeting notes`, `Using AI to translate documents`],
      1
    ),
    mcq(
      `What does "explainability" mean in responsible AI?`,
      [`The ability of a system to justify or clarify how it reached a decision`, `The speed at which a model runs`, `How many parameters a model has`, `The cost of running a model`],
      0
    ),
    mcq(
      `An AI hiring tool consistently ranks resumes with certain names lower, despite equal qualifications. What should an organization do first?`,
      [`Ignore it since AI is objective`, `Audit the training data and model outputs for bias, then remediate`, `Deploy it to more countries immediately`, `Increase the model's speed`],
      1
    ),
    mcq(
      `Which of the following best describes "prompt injection" as a security risk?`,
      [`Physically damaging a server`, `Crafting malicious input to manipulate an AI system into ignoring its intended instructions`, `Increasing a model's training data size`, `A type of firewall`],
      1
    ),
    mcq(
      `Why do many governments require human oversight for high-stakes automated decisions (e.g., loan denials)?`,
      [`To slow down business processes`, `To ensure accountability and the ability to contest unfair automated outcomes`, `Because AI models are illegal`, `To reduce electricity usage`],
      1
    ),
    mcq(
      `What ethical issue arises when AI-generated content is published without disclosure that it was AI-generated?`,
      [`None, disclosure is unnecessary`, `Potential deception of the audience regarding the content's origin and reliability`, `It automatically becomes illegal everywhere`, `It improves SEO rankings`],
      1
    ),
    mcq(
      `Which practice best reduces the risk of sensitive data leakage when using third-party AI tools?`,
      [`Sharing all data freely`, `Using enterprise agreements with clear data-retention and non-training clauses`, `Avoiding all documentation`, `Disabling all security reviews`],
      1
    ),
    mcq(
      `What is a "model card" used for in responsible AI practices?`,
      [`A payment method for AI services`, `Documentation describing a model's intended use, limitations, and performance characteristics`, `A physical ID card for AI researchers`, `A marketing brochure`],
      1
    ),
    mcq(
      `Which of the following is a realistic AI-enabled cyberattack vector?`,
      [`AI writing more convincing, personalized phishing messages at scale`, `AI physically breaking into a data center`, `AI eliminating the need for any cybersecurity`, `AI making all networks automatically secure`],
      0
    ),
    mcq(
      `Why is "informed consent" important when collecting data to train AI systems?`,
      [`It is legally and ethically required for individuals to know how their data will be used`, `It slows down model training unnecessarily`, `It is only relevant for medical data`, `It has no practical purpose`],
      0
    ),
    mcq(
      `An AI content moderation system fails to catch harmful content in a less-represented language. This illustrates:`,
      [`A training-data coverage gap leading to unequal performance`, `A hardware malfunction`, `A successful adversarial attack`, `Overfitting to that language`],
      0
    ),
    mcq(
      `What is the purpose of a "red team" exercise for an AI system?`,
      [`To promote the product`, `To proactively probe the system for vulnerabilities, biases, and failure modes before deployment`, `To slow down development`, `To rebrand the company`],
      1
    ),
    mcq(
      `Which principle is central to the concept of "AI accountability"?`,
      [`No one is responsible for AI decisions`, `Organizations deploying AI remain responsible for its outcomes and impacts`, `Only the AI vendor is ever responsible`, `Accountability applies only to physical products`],
      1
    ),
  ],
  scenarios: [
    t(
      `Scenario: A political deepfake video goes viral just before an election.\n\n- What technical methods could help detect the deepfake?\n- What platform/policy responses would be appropriate?\n- What broader societal risks does this scenario illustrate?`
    ),
    t(
      `Scenario: Your company's HR department wants to use an AI tool to screen job applicants.\n\n- What bias risks should be evaluated before deployment?\n- What governance/oversight process would you put in place?\n- How would you communicate this to candidates?`
    ),
    t(
      `Scenario: An attacker uses an AI chatbot to generate a highly convincing phishing email targeting your finance team.\n\n- What technical defenses could reduce this risk?\n- What employee training would help?\n- How would you respond if an employee had already clicked the link?`
    ),
    t(
      `Scenario: Your company wants to publish AI-generated marketing content without labeling it as AI-generated.\n\n- What ethical concerns does this raise?\n- What regulations might apply depending on region?\n- What policy would you recommend internally?`
    ),
  ],
  practical: t(
    `Practical Task: Choose a real or hypothetical AI system your organization might deploy (e.g., hiring tool, chatbot, fraud detector). Prepare a responsible-AI checklist covering: data sources and consent, bias testing plan, security review steps, transparency/disclosure requirements, and an incident-response plan if the system misbehaves.`
  ),
  subjectives: [
    t(`Explain the difference between AI security (protecting AI systems from attack) and AI ethics (ensuring AI systems behave fairly and responsibly), with an example of each.`),
    t(`Discuss why regulation of AI is difficult to design, considering the pace of technological change versus the pace of lawmaking.`),
  ],
  challenge: t(
    `Challenge: You are the Chief Information Security & Ethics Officer of a company adopting AI across departments. Prepare a governance framework covering: acceptable use policy, data protection measures, bias/fairness auditing cadence, incident response for AI misuse, and how compliance will be measured and reported to the board annually.`
  ),
};

// ---------------------------------------------------------------------------
// Module 5: AI in Business
// ---------------------------------------------------------------------------
const module5: RawModuleDef = {
  moduleId: "m5-ai-in-business",
  mcqs: [
    mcq(
      `A company wants to identify which department should adopt AI first. What should be the PRIMARY criterion?`,
      [`Which department has the most employees`, `Where AI can create the highest measurable business impact with feasible data availability`, `Which department's manager likes AI the most`, `Alphabetical order of department names`],
      1
    ),
    mcq(
      `Which of the following best describes "build vs. buy" in an AI strategy decision?`,
      [`Choosing between constructing a new office or renting one`, `Deciding whether to develop a custom AI solution in-house or purchase an existing AI product`, `Choosing a marketing slogan`, `Deciding which programming language to teach employees`],
      1
    ),
    mcq(
      `A retail company sees a 15% increase in conversion after deploying an AI recommendation engine. This is best measured by which KPI?`,
      [`Employee headcount`, `Conversion rate / revenue per visitor`, `Office square footage`, `Number of AI models purchased`],
      1
    ),
    mcq(
      `What is the most common reason AI business initiatives fail?`,
      [`Too much executive support`, `Poor data quality and lack of clear business alignment`, `Too many successful pilots`, `Excessive budget`],
      1
    ),
    mcq(
      `Which department typically benefits most from AI-powered demand forecasting?`,
      [`Supply chain / operations`, `Facilities management`, `Legal`, `Reception`],
      0
    ),
    mcq(
      `What does "AI strategy alignment with business goals" primarily ensure?`,
      [`AI projects are chosen based on hype rather than value`, `AI investments target problems that materially move business metrics`, `Every department gets an equal AI budget regardless of need`, `AI replaces the need for a business strategy`],
      1
    ),
    mcq(
      `A company pilots an AI chatbot in customer service before a full rollout. This approach is an example of:`,
      [`Reckless deployment`, `Phased/iterative AI adoption to manage risk`, `A failed project`, `Data breach mitigation`],
      1
    ),
    mcq(
      `Which metric would best evaluate an AI-powered fraud detection system in finance?`,
      [`Number of office chairs purchased`, `False positive/negative rates and dollar amount of fraud prevented`, `Employee satisfaction survey scores`, `Website page load time`],
      1
    ),
    mcq(
      `What is a key change-management challenge when introducing AI into a business function?`,
      [`Employees having too much trust in AI immediately`, `Employee resistance due to fear of job displacement or unfamiliarity`, `AI models being too cheap`, `Too much executive buy-in`],
      1
    ),
    mcq(
      `Why might a company choose to "buy" an AI solution rather than build one in-house?`,
      [`Buying is always more secure`, `Faster time-to-value when internal AI expertise or data infrastructure is limited`, `Building is always illegal`, `Buying eliminates the need for any integration work`],
      1
    ),
    mcq(
      `Which of the following is a leading indicator that an AI project is likely to succeed?`,
      [`A vague goal like "use more AI"`, `A clearly defined business problem, success metric, and available quality data`, `No stakeholder involvement`, `No budget allocated`],
      1
    ),
    mcq(
      `An HR department uses AI to screen resumes faster. What business risk must be actively managed?`,
      [`Faster processing speed`, `Algorithmic bias against certain candidate groups`, `Too much paperwork`, `Reduced applicant volume`],
      1
    ),
    mcq(
      `What role does executive sponsorship typically play in enterprise AI adoption?`,
      [`It's irrelevant to project success`, `It helps secure resources, remove organizational blockers, and drive adoption`, `It only matters for marketing projects`, `It replaces the need for technical staff`],
      1
    ),
    mcq(
      `Which is the most accurate description of "AI ROI" (return on investment)?`,
      [`The total amount spent on AI tools`, `The measurable business value generated relative to the cost of implementing AI`, `The number of employees trained on AI`, `The number of AI vendors evaluated`],
      1
    ),
    mcq(
      `A company's AI-powered chatbot reduces average customer response time from 24 hours to 2 minutes. Which business function benefits most directly?`,
      [`Customer support / service`, `Manufacturing`, `Legal compliance`, `Facilities`],
      0
    ),
    mcq(
      `What is a common pitfall when scaling an AI pilot to the full organization?`,
      [`Underestimating the need for data infrastructure and governance at scale`, `Having too much documentation`, `Too many successful test cases`, `Excessive stakeholder communication`],
      0
    ),
    mcq(
      `Which best describes "AI maturity" in an organization?`,
      [`The age of the company`, `How systematically an organization uses data and AI to drive decisions, from ad hoc to fully integrated`, `The number of AI-related job titles`, `The size of the IT department`],
      1
    ),
    mcq(
      `A CFO wants to justify AI investment to the board. What should the business case primarily emphasize?`,
      [`How advanced the technology sounds`, `Expected cost savings/revenue growth versus implementation and risk costs`, `Competitor's marketing materials`, `The number of features the tool has`],
      1
    ),
    mcq(
      `Which of these is a realistic AI use case in supply chain management?`,
      [`Predicting demand and optimizing inventory levels`, `Replacing all physical warehouses instantly`, `Eliminating the need for suppliers`, `Automatically setting all employee salaries`],
      0
    ),
    mcq(
      `What is the primary purpose of an AI center of excellence (CoE) within a company?`,
      [`To centralize expertise, governance, and best practices for AI adoption across departments`, `To replace all department heads`, `To handle only IT helpdesk tickets`, `To manage the company cafeteria`],
      0
    ),
  ],
  scenarios: [
    t(
      `Scenario: A mid-sized manufacturing company wants to reduce equipment downtime using AI.\n\n- Which AI approach would you recommend (e.g., predictive maintenance)?\n- What data would be needed?\n- What KPIs would prove business value?`
    ),
    t(
      `Scenario: A retail chain wants to personalize marketing at scale using AI.\n\n- What AI capabilities would you use?\n- How would you structure a phased rollout?\n- What risks (cost, privacy, brand) should be managed?`
    ),
    t(
      `Scenario: A company's leadership is skeptical about investing in AI due to a past failed pilot.\n\n- What likely caused the failure?\n- How would you rebuild the business case?\n- What governance would you put in place to avoid repeating mistakes?`
    ),
    t(
      `Scenario: A logistics company wants to decide between building a custom AI routing system or buying an off-the-shelf solution.\n\n- What factors should drive this decision?\n- What are the risks of each path?\n- How would you structure a pilot to test the chosen approach?`
    ),
  ],
  practical: t(
    `Practical Task: Choose a business function (sales, marketing, HR, finance, or operations). Prepare a one-page AI adoption plan covering: the problem being solved, the AI approach, required data, expected ROI, implementation timeline, and key risks.`
  ),
  subjectives: [
    t(`Discuss how AI adoption changes the skills organizations need from their workforce, and how companies can manage this transition responsibly.`),
    t(`Explain how a company should prioritize which AI use case to pursue first when it has limited budget and multiple competing opportunities.`),
  ],
  challenge: t(
    `Challenge: You are a management consultant hired to create a 12-month AI adoption roadmap for a traditional company with no prior AI experience. Prepare a roadmap covering: quick wins, mid-term initiatives, required infrastructure/talent investments, governance structure, and how success will be measured at each stage.`
  ),
};

// ---------------------------------------------------------------------------
// Module 6: Large Language Models
// ---------------------------------------------------------------------------
const module6: RawModuleDef = {
  moduleId: "m6-large-language-models",
  mcqs: [
    mcq(
      `What is the purpose of Reinforcement Learning from Human Feedback (RLHF) in LLM training?`,
      [`To speed up tokenization`, `To align model outputs more closely with human preferences and values`, `To reduce the number of parameters`, `To compress the model for mobile devices`],
      1
    ),
    mcq(
      `Which best describes "pretraining" in the LLM development pipeline?`,
      [`Training a model on a narrow, labeled dataset for one specific task`, `Training a model on a massive, general corpus of text to learn broad language patterns`, `Manually writing all model responses in advance`, `Testing a model before release`],
      1
    ),
    mcq(
      `What does Retrieval-Augmented Generation (RAG) primarily help an LLM do?`,
      [`Generate images instead of text`, `Ground its responses in external, up-to-date, or proprietary information retrieved at query time`, `Reduce the number of GPUs needed`, `Automatically translate languages`],
      1
    ),
    mcq(
      `Why might a company choose an open-weight LLM over a closed, API-only model?`,
      [`Open-weight models are always more accurate`, `Greater control, customization, and the ability to self-host for data privacy`, `Closed models cannot be used commercially`, `Open-weight models require no infrastructure`],
      1
    ),
    mcq(
      `What is a "vector embedding" used for in LLM-powered search systems?`,
      [`Encrypting user passwords`, `Representing text as numerical vectors so semantically similar content can be found via similarity search`, `Compressing video files`, `Rendering 3D graphics`],
      1
    ),
    mcq(
      `Which factor most directly increases the cost of running an LLM in production?`,
      [`The color scheme of the UI`, `The number of tokens processed per request and the model's size`, `The number of user accounts`, `The company's marketing budget`],
      1
    ),
    mcq(
      `What is "few-shot prompting"?`,
      [`Giving the model zero examples and no instructions`, `Including a small number of examples in the prompt to demonstrate the desired output format`, `Training a model on a few data points only`, `Limiting the model to a few responses per day`],
      1
    ),
    mcq(
      `Why do LLMs sometimes "hallucinate" plausible-sounding but false information?`,
      [`They intentionally lie`, `They generate statistically likely text, which isn't always factually grounded`, `They copy directly from a fixed database`, `They run out of memory`],
      1
    ),
    mcq(
      `What is the main tradeoff of increasing an LLM's context window size?`,
      [`No tradeoff exists`, `Larger context allows more input but increases compute cost and latency`, `It always makes the model less accurate`, `It eliminates the need for prompting`],
      1
    ),
    mcq(
      `Which technique helps reduce hallucination when an LLM needs to answer questions about a company's internal documents?`,
      [`Increasing the model's temperature`, `Using RAG to retrieve relevant document chunks before generating an answer`, `Removing all instructions from the prompt`, `Reducing the context window to zero`],
      1
    ),
    mcq(
      `What does "temperature" control when generating text from an LLM?`,
      [`The physical heat of the server`, `The randomness/creativity of the output — higher values produce more varied responses`, `The number of tokens billed`, `The model's training speed`],
      1
    ),
    mcq(
      `Which evaluation approach is most appropriate for assessing an LLM's factual accuracy on domain-specific questions?`,
      [`Asking the model if it's correct`, `Benchmarking its answers against a verified, domain-specific test set`, `Checking how fast it responds`, `Counting the number of words in its answer`],
      1
    ),
    mcq(
      `What is "chain-of-thought prompting" designed to improve?`,
      [`Model training speed`, `Reasoning quality, by prompting the model to work through steps before answering`, `Image resolution`, `API rate limits`],
      1
    ),
    mcq(
      `Why is data leakage (test data appearing in training data) a serious problem when evaluating LLMs?`,
      [`It has no effect on evaluation`, `It inflates benchmark scores, making the model appear more capable than it truly is`, `It only affects image models`, `It reduces training cost`],
      1
    ),
    mcq(
      `What is the primary function of a system prompt in an LLM application?`,
      [`To display the app's logo`, `To set persistent instructions/behavior/context for the model across a conversation`, `To store user passwords`, `To compress the model`],
      1
    ),
    mcq(
      `Which scenario best justifies fine-tuning an LLM rather than relying solely on prompting?`,
      [`A one-off question that's never asked again`, `A recurring, specialized task requiring consistent domain-specific style or knowledge not achievable via prompting alone`, `Formatting a single email`, `Testing the model for the first time`],
      1
    ),
    mcq(
      `What risk does "prompt leaking" pose to an LLM-powered application?`,
      [`It slows down the model`, `It can expose confidential system instructions or proprietary prompt engineering to end users`, `It has no security implications`, `It only affects image generation`],
      1
    ),
    mcq(
      `Why is latency an important consideration when deploying an LLM in a customer-facing chat product?`,
      [`Latency has no effect on user experience`, `High latency degrades user experience and can make real-time interactions feel unusable`, `Latency only matters for image models`, `Lower latency always means lower accuracy`],
      1
    ),
    mcq(
      `What does "grounding" mean in the context of LLM outputs?`,
      [`Physically connecting servers to the ground for safety`, `Anchoring the model's responses in verifiable, external facts or data sources`, `Reducing the model's vocabulary`, `Disabling the model's memory`],
      1
    ),
    mcq(
      `Which best describes the difference between a closed-source and open-source LLM from a business risk perspective?`,
      [
        `There is no difference`,
        `Closed-source offers less control/customization but often less operational burden; open-source offers more control but requires more infrastructure/expertise`,
        `Open-source models cannot be fine-tuned`,
        `Closed-source models are always free`,
      ],
      1
    ),
  ],
  scenarios: [
    t(
      `Scenario: A company wants to build an internal knowledge assistant that answers questions using their private documentation.\n\n- Would you use RAG, fine-tuning, or both? Why?\n- What data preparation would be required?\n- How would you evaluate answer quality and reduce hallucination?`
    ),
    t(
      `Scenario: An LLM-powered app's costs are growing rapidly as usage scales.\n\n- What technical strategies could reduce cost per request?\n- What tradeoffs would each strategy introduce?\n- How would you monitor cost vs. quality going forward?`
    ),
    t(
      `Scenario: Users report that a customer-facing chatbot sometimes reveals its internal system prompt when asked cleverly.\n\n- What is this vulnerability called and why does it matter?\n- What mitigations would you implement?\n- How would you test whether the fix is effective?`
    ),
    t(
      `Scenario: A legal team wants an LLM to draft contract clauses but is worried about factual/legal accuracy.\n\n- What safeguards would you put around the LLM's output?\n- Would you recommend fine-tuning, RAG, or strict human review? Justify your choice.\n- How would you measure whether the tool is safe to scale up?`
    ),
  ],
  practical: t(
    `Practical Task: Design a RAG-based Q&A system for a domain of your choice (e.g., HR policies, product documentation). Describe: the data sources, the retrieval pipeline, the prompt structure combining retrieved context with the user question, and how you would evaluate the system's answers for accuracy.`
  ),
  subjectives: [
    t(`Explain the difference between prompting, fine-tuning, and RAG as three ways to customize an LLM's behavior, and describe when each is most appropriate.`),
    t(`Discuss why evaluating LLMs is more difficult than evaluating traditional software, and describe an evaluation approach you would use for a production LLM application.`),
  ],
  challenge: t(
    `Challenge: You are the technical lead responsible for choosing and deploying an LLM strategy for a new AI product. Prepare a proposal covering: model selection (open vs. closed, size tradeoffs), architecture (prompting/RAG/fine-tuning), cost and latency targets, safety/hallucination mitigation, and how you'll measure quality post-launch.`
  ),
};

// ---------------------------------------------------------------------------
// Module 7: Automation
// ---------------------------------------------------------------------------
const module7: RawModuleDef = {
  moduleId: "m7-automation",
  mcqs: [
    mcq(
      `What distinguishes an "AI agent" from a simple automation script?`,
      [`An agent can only run on a fixed schedule`, `An agent can reason, make decisions, and take multi-step actions toward a goal with some autonomy`, `An agent cannot call external tools`, `There is no meaningful difference`],
      1
    ),
    mcq(
      `What is the primary purpose of Robotic Process Automation (RPA)?`,
      [`Building physical robots`, `Automating repetitive, rule-based digital tasks across software systems`, `Training large language models`, `Designing user interfaces`],
      1
    ),
    mcq(
      `In a workflow automation, what is a "trigger"?`,
      [`The final output of the workflow`, `An event that starts the automated workflow (e.g., a new form submission)`, `A type of database`, `A manual override button`],
      1
    ),
    mcq(
      `Why is "human-in-the-loop" design important for automating high-stakes decisions?`,
      [`It slows systems down for no reason`, `It allows a human to review/approve critical actions before they take effect, reducing risk`, `It is only relevant for low-stakes tasks`, `It eliminates the need for monitoring`],
      1
    ),
    mcq(
      `A company automates invoice processing but adds a step where invoices over $10,000 require manual approval. This is an example of:`,
      [`Full autonomous automation`, `Risk-based human-in-the-loop automation`, `A failed automation`, `Robotic process automation without any AI`],
      1
    ),
    mcq(
      `What is a common cause of automation failure in production?`,
      [`Too much testing before deployment`, `Unhandled edge cases and changes in upstream systems the automation depends on`, `Excessive documentation`, `Too many manual approval steps`],
      1
    ),
    mcq(
      `Which of the following best describes "orchestration" in an automated workflow?`,
      [`Writing music for an app`, `Coordinating multiple tasks, tools, or systems in the correct sequence to complete a process`, `Manually running each step one at a time`, `Deleting unused workflows`],
      1
    ),
    mcq(
      `Why should automated workflows include logging and monitoring?`,
      [`To make the system slower`, `To detect failures quickly and provide an audit trail of automated actions`, `Logging is unnecessary if the automation works once`, `To increase storage costs unnecessarily`],
      1
    ),
    mcq(
      `What risk does "automation without oversight" pose in a customer-facing process (e.g., automated refunds)?`,
      [`No risk, automation is always safe`, `Errors or abuse can scale quickly and go undetected without monitoring`, `It guarantees perfect accuracy`, `It eliminates the need for a policy`],
      1
    ),
    mcq(
      `Which metric best demonstrates the ROI of a workflow automation project?`,
      [`Number of software licenses purchased`, `Time/cost saved and error reduction compared to the manual process`, `Number of employees who attended a demo`, `The automation tool's marketing rating`],
      1
    ),
    mcq(
      `What does "idempotency" mean in the context of an automated workflow, and why does it matter?`,
      [`It means a workflow can never fail`, `Running the same action multiple times produces the same result without unintended side effects (e.g., avoiding duplicate charges)`, `It refers to how fast a workflow runs`, `It is unrelated to automation design`],
      1
    ),
    mcq(
      `An AI agent is given access to send emails and update a CRM autonomously. What is the most important safeguard to include?`,
      [`No safeguards are needed if the agent is well-trained`, `Clear permission boundaries and human review for high-impact or irreversible actions`, `Removing all logging to save storage`, `Giving the agent unlimited access to all systems`],
      1
    ),
    mcq(
      `What is a "webhook" commonly used for in automation pipelines?`,
      [`Physically connecting two computers`, `Sending real-time event data from one system to trigger an action in another`, `Encrypting a database`, `Rendering a web page`],
      1
    ),
    mcq(
      `Why is it important to design a "fallback" path for an automated workflow?`,
      [`Fallbacks are never necessary`, `So the process can gracefully handle failures (e.g., escalate to a human) instead of breaking silently`, `To make the workflow more complex for no reason`, `To bypass all approval steps`],
      1
    ),
    mcq(
      `Which task is a strong candidate for automation?`,
      [`A highly repetitive, rule-based task with clear inputs and outputs`, `A one-time creative decision requiring deep judgment`, `A task performed once a year with constantly changing rules`, `A task with no clear success criteria`],
      0
    ),
    mcq(
      `What does "exception handling" mean in an automated business process?`,
      [`Ignoring all errors silently`, `Defining how the workflow responds when it encounters unexpected inputs or failures`, `Deleting the workflow after an error`, `Automatically approving all exceptions`],
      1
    ),
    mcq(
      `Why might a company choose a low-code/no-code automation platform over custom-built automation?`,
      [`It's always more secure`, `It enables faster deployment and lets non-engineers build/maintain workflows`, `It eliminates the need for any testing`, `It guarantees unlimited scalability at no cost`],
      1
    ),
    mcq(
      `What is the main risk of chaining multiple automated steps together without validation checkpoints?`,
      [`No risk, more automation is always better`, `Errors early in the chain can silently propagate and compound through later steps`, `It always improves performance`, `It removes the need for monitoring`],
      1
    ),
    mcq(
      `An automation that scrapes and reformats supplier data breaks whenever the supplier changes their website layout. What is the most robust long-term fix?`,
      [`Manually fix it every time it breaks`, `Build in resilience (structured APIs where possible, alerts on failure, and fallback handling)`, `Stop using the supplier's data entirely`, `Ignore the failures`],
      1
    ),
    mcq(
      `What best distinguishes a "reactive" automation from a "proactive" one?`,
      [`There is no difference`, `Reactive automation responds to events as they happen; proactive automation anticipates needs and acts in advance`, `Reactive automations are always AI-powered`, `Proactive automations never involve triggers`],
      1
    ),
  ],
  scenarios: [
    t(
      `Scenario: A finance team wants to automate the process of matching invoices to purchase orders.\n\n- What would the automated workflow look like?\n- Where would you insert human review checkpoints?\n- What could go wrong, and how would you handle exceptions?`
    ),
    t(
      `Scenario: A company wants to deploy an AI agent that autonomously responds to customer support tickets and can issue refunds up to $50.\n\n- What permission boundaries would you set?\n- What monitoring/logging would you require?\n- How would you handle edge cases outside its authority?`
    ),
    t(
      `Scenario: An automated onboarding workflow for new employees keeps failing silently, and HR only notices weeks later.\n\n- What likely went wrong in the automation design?\n- How would you redesign it to fail loudly and safely?\n- What testing process would prevent this in the future?`
    ),
    t(
      `Scenario: Your marketing team wants to automate social media posting based on AI-generated content.\n\n- What automation and approval steps would you design?\n- What brand/reputation risks need safeguards?\n- How would you measure the automation's effectiveness?`
    ),
  ],
  practical: t(
    `Practical Task: Choose a repetitive business process. Design an automated workflow for it: list the trigger, each step/action, any AI decision points, human-in-the-loop checkpoints, and how failures would be detected and handled.`
  ),
  subjectives: [
    t(`Explain the difference between traditional rule-based automation (RPA) and AI-agent-based automation, and discuss when each is more appropriate.`),
    t(`Discuss the risks of over-automating a business process without adequate human oversight, using a realistic example.`),
  ],
  challenge: t(
    `Challenge: You are the Automation Lead for a company rolling out AI agents across customer service, finance, and HR. Prepare a proposal covering: which processes to automate first and why, governance/permission boundaries for agents, failure handling strategy, and how you will measure success and risk over the first year.`
  ),
};

// ---------------------------------------------------------------------------
// Module 8: Final Assessment (cumulative, across all topics)
// ---------------------------------------------------------------------------
const module8: RawModuleDef = {
  moduleId: "m8-final-section",
  mcqs: [
    mcq(
      `Which best distinguishes Artificial Narrow Intelligence (ANI) from Artificial General Intelligence (AGI)?`,
      [`ANI is task-specific; AGI would match human-level reasoning across domains`, `ANI is more powerful than AGI`, `AGI already exists in commercial products`, `There is no meaningful difference`],
      0
    ),
    mcq(
      `What mechanism allows transformer models to weigh the relevance of different words in a sequence?`,
      [`Self-attention`, `Recursion`, `Rule-based lookup`, `Manual tagging`],
      0
    ),
    mcq(
      `What is the most significant productivity risk of using AI-generated content without review?`,
      [`Slower typing speed`, `Publishing hallucinated or inaccurate information`, `Increased creativity`, `Reduced formatting options`],
      1
    ),
    mcq(
      `Which of the following best describes a deepfake?`,
      [`A firewall vulnerability`, `AI-generated synthetic media designed to convincingly mimic a real person`, `A type of encryption`, `A data compression algorithm`],
      1
    ),
    mcq(
      `When deciding which department should adopt AI first, what should be prioritized?`,
      [`Departments with the most office space`, `Highest measurable business impact with feasible data availability`, `Random selection`, `Whichever department asks last`],
      1
    ),
    mcq(
      `What does RAG (Retrieval-Augmented Generation) primarily help mitigate in LLMs?`,
      [`Slow typing`, `Hallucination, by grounding responses in retrieved external data`, `High-resolution image generation`, `Model licensing costs`],
      1
    ),
    mcq(
      `Which best defines an AI agent in the context of automation?`,
      [`A script that only runs once`, `A system that can reason and take multi-step autonomous actions toward a goal`, `A static spreadsheet`, `A manual checklist`],
      1
    ),
    mcq(
      `Why is human-in-the-loop design important in automated high-stakes decisions?`,
      [`It has no real benefit`, `It allows human review before critical/irreversible actions take effect`, `It always slows systems down with no value`, `It replaces the need for any policy`],
      1
    ),
    mcq(
      `What is the main reason large training datasets improve AI model performance?`,
      [`They reduce electricity usage`, `They improve the model's ability to recognize patterns and generalize`, `They simplify the algorithm`, `They eliminate the need for evaluation`],
      1
    ),
    mcq(
      `Which of the following is an example of algorithmic bias?`,
      [`A model running slowly on old hardware`, `A hiring AI consistently ranking certain demographic groups lower despite equal qualifications`, `A model using too much memory`, `A chatbot responding in multiple languages`],
      1
    ),
    mcq(
      `What is the primary purpose of fine-tuning a pretrained AI model?`,
      [`To delete unnecessary training data`, `To adapt the model to a specific task or domain using targeted additional training`, `To make the model open-source`, `To reduce its parameter count to zero`],
      1
    ),
    mcq(
      `Which statement about AI regulation and governance is most accurate?`,
      [`AI requires no oversight since it is always objective`, `Governance frameworks aim to ensure transparency, accountability, and fairness in AI-driven decisions`, `Regulation eliminates the need for AI ethics`, `AI governance only applies to hardware manufacturers`],
      1
    ),
    mcq(
      `What is the core tradeoff of increasing an LLM's context window?`,
      [`No tradeoff exists`, `More input capacity at the cost of higher compute and latency`, `It always reduces accuracy`, `It eliminates hallucination completely`],
      1
    ),
    mcq(
      `Which KPI would best evaluate the success of an AI-powered fraud detection system?`,
      [`Office attendance rate`, `False positive/negative rates and dollar value of fraud prevented`, `Number of software licenses`, `Employee satisfaction with the cafeteria`],
      1
    ),
    mcq(
      `Why is "explainability" important in responsible AI deployment?`,
      [`It makes models run faster`, `It allows stakeholders to understand and justify how an AI system reached a decision`, `It is only relevant to image models`, `It has no business value`],
      1
    ),
    mcq(
      `What best describes prompt engineering?`,
      [`Writing new model architectures`, `Structuring input text to reliably steer an AI model's output`, `Repairing GPU hardware`, `Designing chatbot avatars`],
      1
    ),
    mcq(
      `Which is the most robust long-term fix for an automation that breaks whenever an upstream system changes?`,
      [`Ignore the failures`, `Build in resilience: structured integrations, failure alerts, and fallback handling`, `Stop using automation entirely`, `Manually re-code it every time silently`],
      1
    ),
    mcq(
      `What is the primary ethical concern with publishing AI-generated content without disclosure?`,
      [`It improves search rankings`, `It may deceive audiences about the content's origin and reliability`, `It is always illegal everywhere`, `It has no ethical implications`],
      1
    ),
    mcq(
      `Which best explains why AI project success depends heavily on data quality?`,
      [`Data quality only affects storage costs`, `Poor-quality or biased data directly degrades model accuracy and fairness`, `AI models ignore their training data`, `Data quality is irrelevant to business alignment`],
      1
    ),
    mcq(
      `What is the most accurate way to think about AI's overall impact on jobs?`,
      [`AI eliminates all jobs across every industry`, `AI automates certain tasks while creating new roles and shifting required skills`, `AI only affects the technology industry`, `AI has no measurable effect on employment`],
      1
    ),
  ],
  scenarios: [
    t(
      `Scenario: A company wants to launch an AI-powered internal assistant that answers employee questions using company policy documents.\n\n- Which techniques (RAG, fine-tuning, prompting) would you combine, and why?\n- What security and privacy safeguards are needed?\n- How would you measure whether the assistant is trustworthy enough to scale?`
    ),
    t(
      `Scenario: Your organization is planning its first company-wide AI adoption roadmap covering multiple departments.\n\n- How would you prioritize which department/use case goes first?\n- What governance and ethical safeguards should be built in from day one?\n- What KPIs would define success after year one?`
    ),
    t(
      `Scenario: An AI hiring tool and an AI customer service agent are both being deployed at the same company.\n\n- What different risk profiles do these two systems have?\n- What human-in-the-loop checkpoints would you require for each?\n- How would you audit both systems on an ongoing basis?`
    ),
    t(
      `Scenario: A competitor's AI chatbot was recently found to leak confidential prompts and produce biased outputs, causing reputational damage.\n\n- What technical and governance failures likely caused this?\n- What preventative measures would you implement in your own AI systems?\n- How would you prepare a crisis-response plan in case something similar happens to you?`
    ),
  ],
  practical: t(
    `Practical Task: Select any real organization (or a hypothetical one). Prepare an end-to-end AI initiative report covering: the business problem, the AI approach (model type, data, and whether it involves automation/agents), the ethical/security safeguards, the expected ROI, and a rollout plan with success metrics.`
  ),
  subjectives: [
    t(`Reflecting on the entire course, explain how the different pillars of AI (foundations, technical mechanics, productivity, security/ethics, business strategy, LLMs, and automation) fit together into a coherent enterprise AI strategy.`),
    t(`Discuss what you believe is the single biggest risk organizations face when adopting AI at scale, and how it should be managed.`),
  ],
  challenge: t(
    `Challenge: You are the newly appointed Chief AI Officer of a Fortune 500 company. Prepare a comprehensive 3-year AI strategy covering: which capabilities to build first, organizational structure and governance, ethical and security guardrails, expected business impact, and how you will report progress to the board each year.`
  ),
};

const MODULES: RawModuleDef[] = [module1, module2, module3, module4, module5, module6, module7, module8];

function buildQuestions(def: RawModuleDef) {
  const now = new Date();
  const docs: Record<string, unknown>[] = [];
  let order = 1;

  for (const m of def.mcqs) {
    docs.push({
      moduleId: def.moduleId,
      questionType: "mcq",
      questionText: m.text,
      options: m.choices.map((text, i) => ({ id: OPTION_IDS[i], text })),
      correctAnswer: OPTION_IDS[m.correct],
      marks: 2,
      order: order++,
      createdAt: now,
    });
  }
  for (const s of def.scenarios) {
    docs.push({ moduleId: def.moduleId, questionType: "scenario", questionText: s.text, marks: 5, order: order++, createdAt: now });
  }
  docs.push({
    moduleId: def.moduleId,
    questionType: "practical",
    questionText: def.practical.text,
    marks: 10,
    order: order++,
    createdAt: now,
  });
  for (const s of def.subjectives) {
    docs.push({ moduleId: def.moduleId, questionType: "subjective", questionText: s.text, marks: 10, order: order++, createdAt: now });
  }
  docs.push({
    moduleId: def.moduleId,
    questionType: "ai_challenge",
    questionText: def.challenge.text,
    marks: 10,
    order: order++,
    createdAt: now,
  });

  return docs;
}

async function main() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || "AI_LMS_Prototype";
  if (!uri) throw new Error("Missing MONGODB_URI in .env.local");

  const client = new MongoClient(uri);
  await client.connect();
  console.log(`Connected. Seeding question bank into database: ${dbName}`);
  const db = client.db(dbName);
  const questions = db.collection("questions");
  await questions.createIndex({ moduleId: 1, order: 1 });

  let total = 0;
  for (const def of MODULES) {
    const docs = buildQuestions(def);
    const mcqCount = def.mcqs.length;
    const total28 = docs.length;
    if (total28 !== 28) {
      throw new Error(`Module ${def.moduleId} has ${total28} questions, expected 28 (mcqs=${mcqCount}).`);
    }
    await questions.deleteMany({ moduleId: def.moduleId });
    await questions.insertMany(docs as never[]);
    console.log(`  ${def.moduleId}: inserted ${docs.length} questions`);
    total += docs.length;
  }

  console.log(`Done. ${total} questions across ${MODULES.length} modules.`);
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
