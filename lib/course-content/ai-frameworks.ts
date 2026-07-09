import type { Lesson } from "@/lib/mock-data";

export const aiFrameworksLessons: Lesson[] = [
  {
    id: "ai-frameworks-l01",
    title: "The Generative AI Revolution",
    estMinutes: 6,
    status: "in_progress",
    pdfUrl: "/course-materials/ai-frameworks/Lesson_01_Generative_AI_Revolution.pdf",
    content: `From Discriminative to Generative AI
Traditional (discriminative) AI models classify or predict from existing data: 'Is this email spam?', 'What digit
is in this image?'. They map inputs to labels.
Generative AI goes further — it creates new content: images, text, audio, code, and video that did not
previously exist. It learns the underlying distribution of data and can sample from it.
Discriminative AIGenerative AI
Classifies / predictsCreates / generates
Maps input → labelSamples new data from learned distribution
Example: spam filterExample: ChatGPT, DALL-E, Suno
Output: a category or numberOutput: text, image, audio, video

The Three Core Shifts of the Generative AI Revolution
Shift 1 — Scale: Models grew from millions to hundreds of billions of parameters. GPT-3 (175B),
GPT-4 (est. 1T+). Scale alone unlocked emergent capabilities.
Shift 2 — Multimodality: Models moved beyond text to handle images, audio, video, and code within
a single architecture (e.g., GPT-4o, Gemini).
Shift 3 — Accessibility: API-first deployment democratised AI — any developer can now integrate
world-class AI with a few lines of code, no ML expertise required.
The generative AI revolution is not just a technical upgrade — it is a platform shift comparable to
the internet or the smartphone.

Real-World Generative AI Applications
• Text: ChatGPT, Claude, Gemini — drafting, summarising, coding, Q&A.;
• Images: DALL-E, Midjourney, Stable Diffusion — design, marketing, concept art.
• Audio: Suno, ElevenLabs — music generation, voice cloning, dubbing.
• Video: Sora, Runway — short-form video from text prompts.
• Code: GitHub Copilot, Cursor — autocomplete, refactoring, test generation.
Key Takeaways
• Discriminative AI classifies; Generative AI creates.
• Three shifts drove the revolution: scale, multimodality, and accessibility.
• Gen AI now spans text, images, audio, video, and code.
Quick-Revision Questions
• What is the fundamental difference between discriminative and generative AI?
• Name the three core shifts of the Generative AI revolution.
• Give one real-world example for each modality (text, image, audio, code).`,
  },
  {
    id: "ai-frameworks-l02",
    title: "Large Language Models: How They Work",
    estMinutes: 6,
    status: "not_started",
    pdfUrl: "/course-materials/ai-frameworks/Lesson_02_LLMs_How_They_Work.pdf",
    content: `What Is a Large Language Model?
An LLM is a massively scaled-up version of smartphone predictive text. Your phone's keyboard predicts the
next word based on a few recent words. An LLM predicts the next token based on billions of parameters
trained on trillions of pages of text — books, Wikipedia, code, web pages.
Core mechanism: LLMs are next-token predictors. Everything else — reasoning, summarising,
coding — emerges from predicting text extremely well at scale.

Training an LLM — The Three Phases
Phase 1: Pre-training: Feed the model trillions of text tokens. Objective: predict the next token.
Duration: weeks to months on thousands of GPUs.
Phase 2: Supervised Fine-Tuning (SFT): Train on high-quality human-written demonstrations of
desired behaviour (helpful answers, safe refusals).
Phase 3: RLHF: Reinforcement Learning from Human Feedback. Human raters rank model outputs; a
reward model learns their preferences; the LLM is fine-tuned to maximise reward.
RLHF is what transforms a raw text predictor into a helpful, harmless, honest assistant.
Emergent Capabilities
As LLMs scale, unexpected abilities emerge that were not explicitly trained:
• In-context learning (learning from a few examples in the prompt).
• Chain-of-thought reasoning (solving multi-step problems step by step).
• Code generation across dozens of programming languages.

LLM Limitations to Know
Hallucination: Confident generation of false facts. The model predicts plausible text, not verified truth.
Knowledge cutoff: Training data has a fixed end date. The model is 'frozen in time'.
Context window: Limited working memory — older context gets 'forgotten' in very long conversations.
No persistent memory: By default, each conversation starts fresh with no memory of past
interactions.
Key Takeaways
• LLMs are next-token predictors scaled to billions of parameters on trillions of tokens.
• Training: pre-training → SFT → RLHF.
• Emergent capabilities arise from scale: in-context learning, reasoning, code generation.
• Key limits: hallucination, knowledge cutoff, finite context window.
Quick-Revision Questions
• Explain LLMs using the smartphone keyboard analogy.
• What is RLHF and why is it needed?
• Name three limitations of current LLMs.`,
  },
  {
    id: "ai-frameworks-l03",
    title: "Tokenization: The Fuel of Language Models",
    estMinutes: 6,
    status: "not_started",
    pdfUrl: "/course-materials/ai-frameworks/Lesson_03_Tokenization.pdf",
    content: `What Is Tokenization?
Computers cannot process raw text — they only understand numbers. Tokenization is the process of
breaking text into small units (tokens) and converting each token to a numerical ID.
Example: 'unforgettable' → ['un', 'forget', 'table'] → [1205, 8507, 2420]
Why Not Just Split by Words?
Splitting by words creates problems:
• Vocabulary explosion: millions of unique words, including misspellings and rare words.
• No sub-word structure: 'running', 'runner', 'runs' share a root but look unrelated.
• Out-of-vocabulary (OOV) problem: new words break the system.
Sub-word tokenization (Byte-Pair Encoding — BPE) solves these issues by splitting rare words into known
sub-word pieces.

The Tokenization Pipeline
• 1. Text input: 'The cat sat on the mat.'
• 2. Tokenize: ['The', ' cat', ' sat', ' on', ' the', ' mat', '.']
• 3. Convert to IDs: [464, 4758, 9178, 319, 262, 2603, 13]
• 4. Embed: each ID → a high-dimensional vector (e.g., 768 dimensions).
• 5. Feed vectors into the model.
Note: spaces are often part of the token (' cat' not 'cat'). GPT-4 uses ~100,000 token vocabulary.
Why Tokenization Matters for Prompt Engineering
• Pricing is per token, not per character — efficiency saves cost.
• Context window limits are in tokens, not words (approx. 0.75 words per token).
• Unusual punctuation, code, and non-English text tokenize less efficiently (more tokens per word).
Rule of thumb: 1 token ≈ 4 characters ≈ 0.75 English words.

From Tokens to Embeddings
After tokenization, each token ID is mapped to an embedding vector — a list of hundreds of floating-point
numbers that encodes the token's meaning. Similar tokens have similar vectors.
• 'king' - 'man' + 'woman' ≈ 'queen' (famous word2vec result).
• Embeddings capture semantic relationships in high-dimensional space.
• The model learns embeddings during pre-training.
Key Takeaways
• Tokenization converts text → sub-word tokens → numerical IDs → embedding vectors.
• Sub-word BPE tokenization handles rare words and new vocabulary gracefully.
• Context window and API costs are measured in tokens, not words.
• Embeddings encode semantic meaning in numerical vector space.
Quick-Revision Questions
• Tokenize the word 'unhappiness' into likely sub-word pieces.
• Why is sub-word tokenization preferred over word-level tokenization?
• What is an embedding vector and what does it represent?`,
  },
  {
    id: "ai-frameworks-l04",
    title: "Parameters, Weights, and Biases",
    estMinutes: 6,
    status: "not_started",
    pdfUrl: "/course-materials/ai-frameworks/Lesson_04_Parameters_Weights_Biases.pdf",
    content: `What Are Parameters?
Parameters are the learnable numbers inside a neural network. During training, the model adjusts these
numbers millions of times until they encode patterns from the training data. When people say 'GPT-3 has
175 billion parameters', they mean 175 billion individual numbers that store the model's 'knowledge'.
An LLM's 'knowledge' lives entirely in its parameters — not in a fact database you can directly
query.

Weights vs. Biases
Weights (W): Numbers that scale the strength of connections between neurons. They determine how
much influence one neuron has on another.
Biases (b): A constant added to the weighted sum before the activation function. They shift the output,
allowing the model to fit data that doesn't pass through the origin.
The computation in each neuron is: output = activation(W · input + b)
Analogy: weights are like the volume knobs on a mixing board; biases are like a baseline volume
applied before the knobs.
What Does 'Large' in LLM Mean?
'Large' refers to the number of parameters, not to intelligence or capability directly:
ModelParameters (approx.)
GPT-2 (2019)1.5 billion
GPT-3 (2020)175 billion
PaLM (2022)540 billion
GPT-4 (2023)~1 trillion (est.)

Parameters ≠ a Fact Database
A common misconception is that a model 'looks up' facts stored in a table. In reality, facts are distributed
across billions of parameter values — the model reconstructs them by computing through its layers. This is
why LLMs can 'hallucinate': they generate plausible parameter-based reconstructions that are not always
accurate.
Key Takeaways
• Parameters are all the learnable numbers that define a model's behaviour.
• Weights scale inter-neuron connections; biases shift outputs.
• 'Large' in LLM refers to parameter count (billions to trillions).
• Knowledge is distributed across parameters — not stored in a searchable database.
Quick-Revision Questions
• What is the difference between a weight and a bias?
• Why does a large parameter count not guarantee factual accuracy?
• Write the computation for a single neuron's output.`,
  },
  {
    id: "ai-frameworks-l05",
    title: "The Transformer Architecture & Self-Attention",
    estMinutes: 6,
    status: "not_started",
    pdfUrl: "/course-materials/ai-frameworks/Lesson_05_Transformer_Self_Attention.pdf",
    content: `The 2017 Breakthrough: 'Attention Is All You Need'
The Transformer architecture, introduced in the seminal 2017 Google Brain paper, replaced Recurrent
Neural Networks (RNNs) as the dominant NLP architecture. The key innovation: self-attention, which allows
every token to directly interact with every other token in a sequence.
RNN limitation: sequential processing means early context is 'forgotten' in long sequences.
Transformers solve this with self-attention.
Self-Attention: Query, Key, Value
Query (Q): The token asking 'what should I pay attention to?'
Key (K): Each other token broadcasts 'here's what I represent'.
Value (V): The actual information to be aggregated once attention weights are computed.
For each token, self-attention: (1) computes similarity between its Q and all Ks, (2) applies softmax to get
attention weights, (3) takes a weighted sum of Vs.

Multi-Head Attention
Running self-attention once would only capture one type of relationship. Multi-head attention runs several
attention operations in parallel, each potentially focusing on a different aspect (syntax, semantics,
coreference). The outputs are concatenated and projected.
Example: in the sentence 'The animal didn't cross the street because it was too tired',
self-attention links 'it' to 'animal' — resolving coreference.
Positional Encoding
Unlike RNNs, Transformers process all tokens in parallel — they have no built-in sense of word order.
Positional encodings (sinusoidal functions or learned vectors) are added to embeddings so the model knows
token position.
The Encoder-Decoder Structure
Encoder-only (BERT): Reads the full sequence — used for classification, question answering,
embeddings.
Decoder-only (GPT, Claude): Generates text auto-regressively — predicts the next token, then the
next, etc.
Encoder-Decoder (T5, BART): Encodes a source sequence, then decodes a target — used for
translation and summarisation.

Why Transformers Dominate
• Parallelisation: all tokens processed simultaneously — massively faster training.
• Long-range dependencies: self-attention connects any two tokens in one step regardless of distance.
• Scalability: performance scales predictably with data, parameters, and compute (scaling laws).
• Transfer learning: pre-train once, fine-tune for hundreds of downstream tasks.
Key Takeaways
• The Transformer (2017) replaced RNNs by using self-attention instead of recurrence.
• Self-attention uses Q/K/V to let every token attend to every other token.
• Multi-head attention captures multiple relationship types in parallel.
• Three variants: Encoder-only, Decoder-only, Encoder-Decoder.
Quick-Revision Questions
• Explain the Q, K, V mechanism in self-attention using an analogy.
• Why do Transformers need positional encodings?
• What variant of Transformer does GPT use, and why?`,
  },
  {
    id: "ai-frameworks-l06",
    title: "Retrieval-Augmented Generation (RAG)",
    estMinutes: 6,
    status: "not_started",
    pdfUrl: "/course-materials/ai-frameworks/Lesson_06_RAG.pdf",
    content: `The 'Frozen in Time' Problem
LLMs are trained on a fixed dataset with a knowledge cutoff date. After training, their parameters do not
update — the model is 'frozen in time'. Ask it about last week's news and it will either hallucinate or admit
ignorance.
RAG solves this: instead of memorising all facts in parameters, it retrieves live, verified facts at
inference time and bundles them with the prompt.

How RAG Works — Step by Step
• 1. User submits a query: 'What were Apple's Q3 2025 earnings?'
• 2. Query is embedded into a vector using an embedding model.
• 3. The vector is compared against a vector database of pre-indexed documents (earnings reports,
news).
• 4. Top-K most semantically similar chunks are retrieved.
• 5. Retrieved chunks + original query are bundled into a prompt: 'Given this context: [chunks], answer:
[query]'.
• 6. LLM generates a grounded, up-to-date answer.
Analogy: RAG is like an open-book exam. The LLM doesn't memorise the textbook — it looks up
the relevant pages at exam time.

RAG Components
Document Store: Raw documents (PDFs, web pages, databases) that are chunked and indexed.
Embedding Model: Converts text chunks into numerical vectors. Examples: OpenAI Ada,
sentence-transformers.
Vector Database: Stores and searches embeddings by similarity. Examples: Pinecone, Weaviate,
ChromaDB, pgvector.
LLM (Generator): Takes the retrieved context + query and generates the final response.
RAG Benefits and Limitations
BenefitsLimitations
Up-to-date informationRetrieval quality limits output quality
Source-grounded answersExtra latency from retrieval step
Reduces hallucinationChunking strategy is non-trivial
No retraining neededLong documents may exceed context window
Quick-Revision Questions
• What problem does RAG solve that fine-tuning cannot?
• List the five steps in a RAG pipeline.
• Name two vector databases used in RAG systems.`,
  },
  {
    id: "ai-frameworks-l07",
    title: "Fine-Tuning vs. RAG vs. Prompt Engineering + Hybrid Architectures",
    estMinutes: 6,
    status: "not_started",
    pdfUrl: "/course-materials/ai-frameworks/Lesson_07_FineTuning_RAG_PromptEngineering.pdf",
    content: `Three Strategies to Tailor an LLM
When you want an LLM to perform a specific task better, you have three main tools:
Prompt Engineering: Craft better instructions in the prompt — no training required.
RAG (Retrieval-Augmented Generation): Inject live, retrieved documents into the prompt at
inference time.
Fine-Tuning: Re-train the model on task-specific data to bake new behaviour into the weights.

Comparison: Mechanism, Best Use Case, Cost/Complexity
Prompt EngineeringRAGFine-Tuning
MechanismBetter instructions in contextRetrieve & inject docsUpdate model weights
Best ForGeneral tasks, formattingLive/private knowledgeStyle, domain specialisation
Data NeededNoneDocument corpusLabelled task examples
LatencyLowestMedium (retrieval step)Lowest (post-training)
CostNear zeroStorage + retrievalGPU compute + time
ComplexityLowMediumHigh

Hybrid Architectures in Production
Most production AI systems don't use just one strategy — they combine all three:
• Fine-tune the base model on company-specific tone and domain vocabulary.
• Add RAG to inject real-time product documentation and knowledge base articles.
• Use prompt engineering to format output, control persona, and handle edge cases.
Example: A customer service bot is fine-tuned on past support tickets (style), uses RAG for live
product docs (knowledge), and uses prompt engineering to enforce response format.
Decision Framework — Which to Use?
• Need current/private data? → RAG first.
• Need specific writing style or domain expertise baked in? → Fine-tuning.
• Need quick improvement with no infrastructure? → Prompt engineering.
• Need all three? → Hybrid architecture.
Quick-Revision Questions
• When would you choose RAG over fine-tuning?
• What is the approximate cost tradeoff between the three strategies?
• Describe a hybrid architecture for a legal research assistant.`,
  },
];
