// Verbatim (lightly whitespace-cleaned) excerpts from the source document:
// "ARTIFICIAL INTELLIGENCE BOOTCAMP.docx" - used as the source material for the
// 3-day bootcamp curriculum. Stored here so the platform can show students/admins
// the original chapter text behind each day's lessons.

export const CHAPTERS_1_2_TEXT = `
Chapter 1: Introduction to Artificial Intelligence

What is AI?
To truly grasp Artificial Intelligence (AI), we must first strip away the Hollywood imagery of sentient metallic robots plotting world domination. In the real world, Artificial Intelligence refers to computer systems, algorithms, or software programs that can execute tasks traditionally requiring human cognitive faculties. These human-like tasks include understanding written language, recognizing visual patterns, solving complex equations, making predictions based on past behaviors, and learning from mistakes.

When you open your smartphone using your face, an AI system is actively mapping the geometry of your facial features. When you open a translation application to convert a Spanish phrase into English, an AI system handles the context shifts. When you use an app to help you brainstorm essay topics or play a digital game of chess against a computer, you are interacting directly with AI.

To understand how a machine simulates "intelligence," it is helpful to look at how a computer differs from a human being. Humans process information through a mix of conscious logic, deep emotional empathy, physical senses, and lived experiences. A computer does not possess an internal emotional world; it does not "feel" the meaning of a word, nor does it truly "understand" what a photo of a dog represents. Instead, modern AI operates as a highly advanced statistical prediction engine. By analyzing massive volumes of historic data, the computer learns to identify deep patterns. When presented with a new problem, it calculates mathematical probabilities to determine what the most logical next step or answer should be.

Why AI Matters to You
AI is not a passing technological fad or an isolated academic discipline; it is a foundational shift in how humans interact with information. For students across all academic majors, learning to utilize AI is like unlocking a personal academic superpower.

Consider the traditional limitations of learning. If you are struggling with a complex calculus formula at two in the morning, you typically have to wait until professor office hours or a tutoring center opens. With AI, you have a private, infinitely patient tutor available 24/7. You can instruct an AI: "Explain the concept of derivatives to me as if I am a 10-year-old who loves skateboarding," and the system will adapt its vocabulary to fit your exact style.

Beyond direct tutoring, AI can scan your software code to identify a missing semicolon, critique your essay transitions, summarize massive research papers into digestible bullet points, or generate customized practice exams to test your knowledge before a major final.

Human Brain vs. Artificial Intelligence
To safely and effectively use AI, you must understand the core architectural differences between biological intelligence and artificial systems.

Attribute | Human Brain | Artificial Intelligence (AI)
Learning Source | Lived experiences, sensory inputs, empathy, emotional memory, and logical deduction. | Trillions of data points, text documents, image pixels, and historical logs.
Processing Style | Parallel, highly adaptive, emotionally contextual, and associative. | Massive statistical calculations, pattern recognition, and probability matrices.
Understanding | Deep conceptual grasp; understands why things occur. | Pattern matching; recognizes how things typically appear based on training data.
Energy Consumption | Highly efficient (roughly 20 watts). | Highly resource-intensive (data centers pulling megawatts).

When you learn what a "chair" is as a toddler, you only need to see two or three examples. An AI system cannot touch a chair. To recognize one, it must be fed thousands of digital photographs of chairs from every conceivable angle, lighting condition, and style.

A Brief History of AI: The Journey to Modern Tech

1) The Birth at Dartmouth (1956)
The official field of Artificial Intelligence was christened during a summer workshop held at Dartmouth College in 1956. A small group of brilliant mathematicians and scientists, including John McCarthy and Marvin Minsky, gathered with the bold belief that every aspect of human learning and intelligence could be described so precisely that a machine could be built to simulate it.

2) The AI Winters (1970s - 1980s)
As researchers began tackling complex problems like language translation and computer vision, they hit a wall. The computers of the 1970s simply lacked the processing memory and storage capacity required to manage real-world complexity. When these early systems failed to deliver on their massive promises, government and institutional funding dried up entirely.

3) The Narrow Successes (1990s - 2000s)
Instead of trying to build a generalized human mind, scientists narrowed their focus to specific, well-defined problems. In 1997, IBM's Deep Blue supercomputer made history by defeating world chess champion Garry Kasparov.

4) The Modern Deep Learning Explosion (2010 - Present)
Three massive tech shifts converged simultaneously: The Rise of Big Data, The GPU Revolution, and Cloud Infrastructure. This convergence allowed Deep Neural Networks to accurately process language, imagery, and code, moving AI directly into our smartphones, schools, and workplaces.

Chapter 2: Types of AI and Core Technologies

The Three Levels of AI

1) Artificial Narrow AI (ANI)
Artificial Narrow AI, often called "Weak AI," refers to systems engineered, trained, and optimized to execute one specific task flawlessly. 100% of the artificial intelligence currently operating in the world today is Narrow AI.

2) Artificial General AI (AGI)
Artificial General AI, or "Strong AI," describes a theoretical system that matches human cognitive flexibility. AGI does not exist yet.

3) Artificial Super AI (ASI)
Artificial Super AI is a theoretical concept where a system's cognitive power surpasses the collective intelligence of the brightest human minds on Earth across every single discipline.

Machine Learning: The Engine of Modern AI
In traditional computer programming, a human software engineer writes explicit, step-by-step instructions. Machine Learning completely flips this paradigm: you feed the computer a massive pile of data plus the corresponding answers, and the algorithm uncovers its own complex statistical rules.

Deep Learning and Neural Networks
Deep Learning relies on software structures called Artificial Neural Networks, organized into distinct layers: the Input Layer (raw data), the Hidden Layers (increasingly complex feature extraction), and the Output Layer (final probability). Through backpropagation, the network reviews its errors during training and tweaks the mathematical weights of each node connection until it gets the answer right next time.

Core Branches of AI Technology
Natural Language Processing (NLP): bridges human language and digital code - predictive text, voice assistants, chatbots, translation.
Computer Vision: gives machines the ability to see and parse visual data - facial recognition, medical imaging, autonomous vehicles.
Core Predictive Machine Learning: processes structured data to uncover trends and forecasts - stock analysis, weather forecasting, recommendation systems.
`.trim();

export const CHAPTER_3_TEXT = `
Chapter 3: Generative AI & Large Language Models

3.1 Explaining the Generative AI Revolution
Traditional AI systems were discriminative models, focused on finding mathematical boundaries between different classes of data. Generative AI represents a massive paradigm shift because these models don't just classify existing data - they generate completely original content from scratch.

The Core Shifts of the Revolution: From Analytical to Creative; From Rules-Based to Probabilistic; Unstructured Input Processing (natural human language instead of rigid database inputs).

3.2 Large Language Models (LLMs): How They Work
An LLM is trained on trillions of pages of public text from books, academic journals, news sites, and code repositories, building a massive internal map of how words relate to each other statistically - think of it as an exceptionally fast, highly complex version of smartphone predictive text.

Tokenization: The Fuel of Language Models
A prompt is broken down into small mathematical fragments called tokens (whole words or parts of words), each translated into a standardized numerical token ID. Example: "unforgettable" -> "un" + "forget" + "table".

Parameters, Weights, and Biases
An LLM's "knowledge" does not exist as a database of facts - it is stored in its parameters, the adjustable knobs and dials of the neural network. The "Large" in Large Language Models refers to the scale of these parameters, spanning from 7 billion to over a trillion values in frontier systems.

3.3 The Transformer Architecture and Self-Attention
The engine making advanced token prediction possible is the Transformer, introduced in the 2017 paper "Attention Is All You Need." Before Transformers, RNNs and LSTMs processed text sequentially and tended to "forget" earlier context in long text.

The Breakthrough of Self-Attention
Self-attention allows the model to look at every word in a paragraph simultaneously and calculate how each word influences the meaning of others, regardless of distance in the text. The Transformer translates every token into three vectors: Query (what a word is searching for), Key (what a word offers as context), and Value (the actual semantic content).

3.4 Retrieval-Augmented Generation (RAG)
LLMs are frozen in time once training finishes - they won't know about events after their training cutoff, and may hallucinate a plausible-sounding but fake answer. RAG solves this: the system takes a user's question, passes it through an internal search engine that scans a verified source database, and bundles the retrieved facts with the original prompt before handing it to the LLM - like an open-book exam.

3.5 Fine-Tuning vs. RAG vs. Prompt Engineering
Prompt Engineering: crafting context/instructions directly in the prompt window - extremely low cost, best for quick iteration and formatting.
RAG: pulling relevant documents from a live vector database as real-time context - moderate cost, best for updated data and eliminating hallucinations.
Fine-Tuning: training the underlying parameter weights on a specific dataset - high cost, best for specialized tone/vocabulary.

The Power of Hybrid Architectures
Modern enterprise systems rarely use these approaches in isolation. A production-ready AI agent frequently combines all three: fine-tuning for tone/style, RAG for real-time data, and prompt engineering for safe, well-formatted final output.
`.trim();

export const CHAPTERS_4_5_TEXT = `
Chapter 4: AI Applications & Ethics

AI Applications Across Industries
1) Healthcare & Medicine: Computer Vision scans MRIs/X-rays for microscopic anomalies; generative models predict protein folding; predictive analytics forecast ICU patient deterioration; wearables track vitals continuously.
2) Banking & Finance: real-time fraud detection on card transactions; algorithmic trading; risk scenario simulation; chatbots handling routine banking queries.
3) Creative Industries & Marketing: generative design iteration; hyper-personalized marketing and recommendation engines; personalized thumbnails and content suggestions.
4) Sports Analytics: computer vision tracks player positioning/velocity/biometrics; injury prevention and strategy design; fan engagement analytics; automated highlight generation.

Navigating the Pitfalls: Bias, Hallucinations, and Deepfakes

Algorithmic Bias
AI systems have no innate concept of fairness; they learn only from the data provided. Example: a hiring tool trained on biased historical resumes may downgrade female applicants; facial recognition has shown higher error rates for darker skin tones due to underrepresentation in training data. Mitigation: diverse/representative datasets, regular bias audits, transparent reporting of limitations.

Hallucinations
LLMs are probabilistic engines predicting language patterns, not factual databases. Hallucinations occur when AI generates answers that sound authoritative but are fabricated. The Fact-Checking Checklist: (1) Check the primary reference source directly. (2) Look for logical leaps in the model's steps. (3) Use RAG or web-connected tools to double-verify dates.

Deepfakes & Information Integrity
Generative AI can create synthetic audio/video that mimics real people, spreading misinformation, scams, or reputational damage. Preventive measures: watermarking AI-generated content, deepfake detection algorithms, public media literacy education.

Additional Ethical Considerations
Privacy & Surveillance: AI cameras/sensors raise constant-monitoring concerns.
Environmental Impact: training large models consumes massive energy; sustainable AI practices are becoming critical.
Accountability: when AI causes harm, responsibility (developer, company, or algorithm) remains a legal question still evolving.
Education & Workforce: AI automates repetitive tasks but displaces jobs; reskilling and ethical deployment are vital.

Chapter 5: The AI Landscape & Future Trends

Proprietary AI Models (e.g., OpenAI, Anthropic, Google): closed-source, accessed via web/API.
Pros: continuously updated, warehouse-scale infrastructure, seamless enterprise integration.
Cons: lack of transparency, subscription/usage fees, data privacy risk (prompts sent to third-party servers).

Open-Source AI Models (e.g., Meta's Llama, Mistral): free to download, inspect, alter, run locally.
Pros: total data privacy (can run offline), zero subscription fees, freedom to customize.
Cons: requires powerful local hardware, user is responsible for setup/optimization/security.

Future Career Paths: Jobs That Don't Require a Math PhD
AI Product Managers - strategic thinking, communication, basic technical literacy.
Data Annotation Managers - project management, attention to detail, QA.
Vector Database Coordinators - database management, information security, organizational skills.
AI Compliance & Ethics Advisors - legal knowledge, ethics, regulatory awareness.
Additional roles: Prompt Engineers, AI Trainers, AI UX Designers, AI Security Analysts.

Future Trends in AI
Edge AI: running models directly on devices/IoT sensors for real-time decisions without cloud dependency.
Multimodal AI: models processing text, images, audio, and video simultaneously.
AI Regulation: governments drafting laws for safety, fairness, and transparency.
Green AI: reducing the environmental impact of training large models.
Collaborative AI: systems designed to augment human creativity and decision-making rather than replace jobs.
`.trim();
