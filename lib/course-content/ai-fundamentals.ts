import type { Lesson } from "@/lib/mock-data";

export const aiFundamentalsLessons: Lesson[] = [
  {
    id: "ai-fundamentals-l01",
    title: "What Is AI, and Why Does It Matter?",
    estMinutes: 6,
    status: "in_progress",
    pdfUrl: "/course-materials/ai-fundamentals/Lesson_01_What_Is_AI.pdf",
    content: `What Is Artificial Intelligence?
Artificial Intelligence (AI) is software that performs tasks which normally require human-like cognitive abilities
— such as understanding language, recognising images, making decisions, or learning from experience. AI
is not magic, nor is it the robot overlord of science-fiction movies. It is a set of mathematical techniques
running on powerful computers.
Definition: AI = software that mimics human cognitive tasks using data and algorithms.
Stripping Away the Hollywood Myths
Common misconceptions vs. reality:
Myth — AI is conscious: AI has no awareness, emotions, or desires. It optimises a mathematical
objective.
Myth — AI will replace all jobs overnight: AI augments tasks; most roles involve creativity and
judgment AI cannot replicate.
Myth — AI understands language like humans: AI predicts statistically likely word sequences; it
does not 'understand' meaning.
Three Daily-Life Examples of AI
• Face ID on your smartphone — computer vision identifies you from thousands of facial landmarks.
• Google Translate — NLP models convert text between 100+ languages in milliseconds.
• Chess engines (e.g., Stockfish) — search algorithms evaluate billions of board positions to find the
best move.

Why Does AI Matter Now?
Three forces converged in the 2010s to make AI practical at scale:
FactorWhat Changed
Big DataInternet, smartphones & IoT generated trillions of labelled examples.
GPUs / CloudParallel hardware cut model-training time from years to hours.
AlgorithmsDeep Learning architectures outperformed older methods dramatically.
Real-World Impact Across Industries
• Healthcare: cancer detection, drug discovery, personalised treatment plans.
• Finance: fraud detection in milliseconds, algorithmic trading, credit scoring.
• Education: adaptive learning platforms that adjust to each student's pace.
• Transport: route optimisation, autonomous vehicle perception systems.

Key Takeaways
• AI is software performing human-like cognitive tasks — not a conscious entity.
• Everyday examples include Face ID, translation tools, and recommendation engines.
• AI's rise was enabled by three converging forces: data, compute, and algorithms.
• The impact spans healthcare, finance, education, transport, and beyond.
Quick-Revision Questions
• Define AI in one sentence using your own words.
• Name three AI applications you used in the past 24 hours.
• Why did AI become so powerful after 2010?
Remember: AI is a tool built by humans, for humans. Understanding it gives you power over it —
not the other way around.`,
  },
  {
    id: "ai-fundamentals-l02",
    title: "Human Brain vs. Artificial Intelligence",
    estMinutes: 6,
    status: "not_started",
    pdfUrl: "/course-materials/ai-fundamentals/Lesson_02_Human_Brain_vs_AI.pdf",
    content: `The 'Chair' Analogy — How Learning Differs
A child learns what a chair is by experiencing hundreds of different chairs — wooden, plastic, office, rocking.
After enough exposure the child abstracts the concept: 'something you sit on with a raised seat.' An AI
learns similarly — from millions of labelled images — but without any lived experience or meaning.
Key contrast: Humans generalise from a few examples through understanding; AI generalises
from millions of examples through statistics.
Four Dimensions of Comparison
DimensionHuman BrainArtificial Intelligence
Learning SourceExperience, culture, emotionLabelled datasets, reward signals
Processing StyleParallel, intuitive, holisticSequential or batched matrix ops
UnderstandingConceptual, contextual, creativePattern-matching, no true meaning
Energy Use~20 watts (very efficient)Kilowatts to megawatts (data centres)

Where AI Beats Humans
• Speed: processes millions of data points in seconds vs. hours for humans.
• Consistency: no fatigue, emotion, or bias on repeated tasks.
• Scale: one model can serve billions of users simultaneously.
• Memory: perfect recall of everything in its training data.
Where Humans Beat AI
• Common sense reasoning: understanding physical and social reality.
• Transfer learning: apply knowledge from one domain to a completely new one.
• Creativity & originality: generating truly novel ideas, not remixing patterns.
• Emotional intelligence: empathy, moral judgment, nuanced social reading.
• Energy efficiency: the human brain runs on roughly a 20-watt 'bulb'.
Important nuance: AI can match or exceed humans on narrow, well-defined tasks. It falls short on
open-ended, contextual, or creative challenges.

The Complementary Vision
The most productive framing is not 'AI vs. humans' but 'AI + humans'. AI handles data-intensive, repetitive,
and pattern-recognition tasks; humans provide judgment, creativity, and ethical oversight. This partnership is
the engine of modern AI-augmented work.
Key Takeaways
• Humans learn through meaning and experience; AI learns through statistics and data.
• AI excels at speed, scale, and consistency; humans excel at creativity and common sense.
• Energy efficiency heavily favours the biological brain.
• The future is human-AI collaboration, not competition.
Quick-Revision Questions
• Using the chair analogy, explain how human learning differs from AI learning.
• List two tasks where AI outperforms humans and two where humans outperform AI.
• Why does AI require so much more energy than the human brain?`,
  },
  {
    id: "ai-fundamentals-l03",
    title: "A Brief History of AI",
    estMinutes: 6,
    status: "not_started",
    pdfUrl: "/course-materials/ai-fundamentals/Lesson_03_Brief_History_of_AI.pdf",
    content: `The Dartmouth Conference — 1956
AI as a formal discipline was born at a summer workshop at Dartmouth College, USA. John McCarthy
coined the term 'Artificial Intelligence'. Researchers believed human-level AI was just a decade away — an
optimism that would be repeatedly humbled.
Milestone: Dartmouth 1956 — AI gets its name and its first research agenda.
The AI Winters
Twice in AI history, progress stalled dramatically and funding dried up:
First Winter (1974–1980): Early rule-based systems hit the 'combinatorial explosion' — too many
rules, too little compute.
Second Winter (1987–1993): Expert systems proved too expensive to maintain; hardware failed to
keep pace.
Both winters were recovery periods that forced researchers to rethink fundamentals.

Deep Blue vs. Kasparov — 1997
IBM's Deep Blue defeated world chess champion Garry Kasparov in a six-game match — the first time a
computer beat a reigning world champion under tournament conditions. The event captured global attention
and signalled that machines could master complex, rule-bound domains.
Milestone: Deep Blue (1997) — AI demonstrates superhuman performance in a defined
intellectual domain.
The Deep Learning Explosion — Post-2010
Three catalysts ignited the modern era:
• Big Data: the internet produced vast labelled datasets (ImageNet: 14 million images).
• GPUs: graphics cards repurposed for parallel neural network training.
• AlexNet (2012): deep CNN halved image-classification error — the 'Big Bang' of modern AI.
Since 2012, AI has achieved superhuman performance in image recognition, Go (AlphaGo, 2016), protein
folding (AlphaFold, 2020), and natural language (GPT series, 2018–present).

AI History Timeline at a Glance
YearEvent
1956Dartmouth Conference — AI coined
1974–80First AI Winter
1987–93Second AI Winter
1997Deep Blue defeats Kasparov
2006Hinton reintroduces deep neural nets
2012AlexNet wins ImageNet — deep learning era begins
2016AlphaGo defeats Lee Sedol at Go
2017Transformer architecture ('Attention Is All You Need')
2020AlphaFold solves protein folding
2022–Generative AI era (ChatGPT, Gemini, Claude)
Quick-Revision Questions
• What happened at Dartmouth in 1956?
• Name the two AI Winters and their causes.
• What three factors triggered the post-2010 Deep Learning explosion?`,
  },
  {
    id: "ai-fundamentals-l04",
    title: "The Three Levels of AI: ANI, AGI, ASI",
    estMinutes: 6,
    status: "not_started",
    pdfUrl: "/course-materials/ai-fundamentals/Lesson_04_ANI_AGI_ASI.pdf",
    content: `Artificial Narrow Intelligence (ANI)
ANI — also called 'Weak AI' — is every AI system that exists today. It is highly capable within a specific,
well-defined domain, but completely helpless outside it.
• Face recognition on your phone = ANI.
• GPT-4 writing an essay = ANI (very sophisticated language ANI).
• AlphaGo beating world Go champions = ANI confined to the game of Go.
Every AI product you use today — ChatGPT, Google Maps, Spotify recommendations — is ANI.
Artificial General Intelligence (AGI)
AGI is theoretical AI that matches human cognitive flexibility across all domains: learning a new language,
writing poetry, diagnosing a disease, and fixing a leaky tap — all using the same underlying reasoning
system. No AGI exists today.
• AGI would transfer knowledge between domains as naturally as humans do.
• Estimated timelines range wildly: 10 years to never, depending on the researcher.

Artificial Super Intelligence (ASI)
ASI is a hypothetical AI that surpasses the best human performance in every cognitive domain — science,
creativity, social intelligence, and strategic planning. ASI remains purely theoretical and raises profound
philosophical and safety questions.
ASI is the concept behind the 'singularity' — a point after which technological growth becomes
uncontrollable and irreversible.
ANI vs. AGI vs. ASI — Comparison
ANIAGIASI
StatusExists todayTheoreticalTheoretical
ScopeOne narrow taskAll human tasksBeyond all humans
ExampleSiri, AlphaGoNone yetNone yet
Risk levelManageableHigh concernExistential

Why These Distinctions Matter
Conflating ANI with AGI/ASI leads to two dangerous extremes — irrational fear of current AI (it's just ANI!)
and complacent dismissal of future risk (AGI may arrive sooner than policymakers expect). Clear-eyed
understanding helps you engage meaningfully with AI policy and technology decisions.
Key Takeaways
• ANI: all existing AI — narrow, powerful within one domain, zero general reasoning.
• AGI: theoretical human-level general reasoning — does not yet exist.
• ASI: theoretical beyond-human intelligence — purely speculative.
• Understanding the levels prevents both hype and unfounded fear.
Quick-Revision Questions
• Which level of AI exists today? Give two examples.
• What makes AGI fundamentally different from ANI?
• Why is clear understanding of these levels important for society?`,
  },
  {
    id: "ai-fundamentals-l05",
    title: "Machine Learning: The Engine of Modern AI",
    estMinutes: 6,
    status: "not_started",
    pdfUrl: "/course-materials/ai-fundamentals/Lesson_05_Machine_Learning.pdf",
    content: `Rule-Based vs. Machine Learning
Traditional programming is explicit: a human writes every rule. Machine Learning (ML) flips the model —
instead of writing rules, you provide labelled examples and let the algorithm discover its own statistical rules.
Traditional ProgrammingMachine Learning
Human writes rulesAlgorithm learns rules from data
Input + Rules = OutputInput + Output = Rules (learned)
Brittle — breaks on new casesGeneralises to unseen cases
Example: spam keyword filterExample: spam classifier trained on emails
Core insight: ML inverts the programming paradigm — data + desired outputs train the rules, not
the other way around.

The Three Types of Machine Learning
Supervised Learning: Labelled data (inputs + correct answers). Algorithm learns to map inputs to
outputs. Examples: spam detection, image classification, price prediction.
Unsupervised Learning: Unlabelled data. Algorithm finds hidden patterns or clusters. Examples:
customer segmentation, anomaly detection, recommendation systems.
Reinforcement Learning: Agent takes actions in an environment to maximise a cumulative reward.
Examples: game-playing (AlphaGo), robotics, self-driving car steering.
The Training Pipeline
A typical supervised ML workflow:
• 1. Collect and label data (the most expensive step).
• 2. Split into training set and test/validation set.
• 3. Choose a model architecture (decision tree, neural net, etc.).
• 4. Train: feed data, calculate error (loss), adjust parameters.
• 5. Evaluate on unseen test data. Iterate until performance is satisfactory.
• 6. Deploy the model to production.

Overfitting vs. Underfitting
Overfitting: Model memorises the training data but fails on new data (too complex).
Underfitting: Model is too simple to capture patterns even in training data.
Goldilocks zone: Good generalisation — performs well on both training and test data.
Analogy: A student who memorises past exam papers but can't answer new questions is
'overfitting'. One who hasn't studied enough is 'underfitting'.
Key Takeaways
• ML learns statistical rules from labelled data instead of being explicitly programmed.
• Three paradigms: Supervised, Unsupervised, and Reinforcement Learning.
• The training pipeline: collect data → train → evaluate → deploy.
• Overfitting and underfitting are the two key failure modes to watch for.
Quick-Revision Questions
• Contrast rule-based programming with ML using a concrete example.
• Which type of ML would you use to group customers by purchase behaviour? Why?
• What is overfitting and how can you detect it?`,
  },
  {
    id: "ai-fundamentals-l06",
    title: "Deep Learning & Neural Networks",
    estMinutes: 6,
    status: "not_started",
    pdfUrl: "/course-materials/ai-fundamentals/Lesson_06_Deep_Learning_Neural_Networks.pdf",
    content: `What Is a Neural Network?
A neural network is a layered mathematical function loosely inspired by neurons in the brain. It consists of
nodes (neurons) organised in layers, connected by weighted edges. The network learns by adjusting those
weights.
Three-Layer Architecture
Input Layer: Receives raw data — pixel values, word tokens, sensor readings.
Hidden Layers: Transform inputs through weighted sums and non-linear activation functions. 'Deep' =
many hidden layers.
Output Layer: Produces the prediction — a class label, a number, a probability distribution.
'Deep Learning' simply means a neural network with many hidden layers — 'deep' refers to this
depth, not mystery.

How Learning Happens — Backpropagation
Backpropagation is the error-correction mechanism that trains neural networks:
• 1. Forward pass: data flows through the network, producing a prediction.
• 2. Loss calculation: compare prediction to the true label using a loss function (e.g., cross-entropy).
• 3. Backward pass: compute the gradient of the loss with respect to each weight (chain rule calculus).
• 4. Gradient descent: nudge each weight slightly in the direction that reduces loss.
• 5. Repeat millions of times across the dataset until loss is minimised.
Analogy: Backprop is like getting a test back with marks — you see where you went wrong and
adjust your study (weights) accordingly.
Activation Functions
ReLU (Rectified Linear Unit): Outputs 0 for negative inputs, passes positive values unchanged. Most
common in hidden layers.
Sigmoid: Squashes output to 0–1. Used in binary classification output layers.
Softmax: Converts a vector of numbers to a probability distribution. Used for multi-class output.

Types of Neural Networks
CNN (Convolutional Neural Network): Specialised for grid data — images and video. Uses
convolutional filters to detect edges, textures, objects.
RNN (Recurrent Neural Network): Designed for sequences — text, speech, time series. Has
'memory' of previous steps.
Transformer: State-of-the-art for language and multi-modal tasks. Uses self-attention instead of
recurrence. Powers GPT, BERT, Claude.
Key Takeaways
• Neural networks are layered mathematical functions: Input → Hidden → Output.
• Learning occurs via backpropagation: forward pass → loss → backward pass → weight update.
• Activation functions introduce non-linearity, enabling the network to learn complex patterns.
• CNNs excel at images; RNNs at sequences; Transformers at language and beyond.
Quick-Revision Questions
• Describe the three layers of a neural network and each layer's role.
• Explain backpropagation in four steps.
• Why are Transformers now preferred over RNNs for language tasks?`,
  },
  {
    id: "ai-fundamentals-l07",
    title: "Core Branches: NLP, Computer Vision & Predictive ML",
    estMinutes: 6,
    status: "not_started",
    pdfUrl: "/course-materials/ai-fundamentals/Lesson_07_Core_Branches_NLP_CV_PredML.pdf",
    content: `Natural Language Processing (NLP)
NLP enables machines to read, understand, and generate human language. It is the branch behind
chatbots, search engines, translation, sentiment analysis, and large language models.
• Core tasks: tokenisation, named entity recognition, machine translation, summarisation, question
answering.
• Breakthrough: the Transformer architecture (2017) enabled context-aware language understanding at
scale.
• Real-world examples: Google Search, ChatGPT, email autocomplete, spam filters.
NLP bridges the gap between human communication and machine processing.

Computer Vision (CV)
Computer Vision enables machines to interpret and understand visual information from the world — images,
video, and real-time camera feeds.
• Core tasks: image classification, object detection, image segmentation, facial recognition, optical
character recognition (OCR).
• Key architecture: Convolutional Neural Networks (CNNs) — AlexNet (2012) was the watershed
moment.
• Real-world examples: Face ID, self-driving car perception, medical image diagnosis (radiology),
quality control in manufacturing.
Computer Vision gives machines 'eyes' — turning pixels into actionable understanding.
Predictive Machine Learning (Predictive ML)
Predictive ML uses historical data to forecast future outcomes. It is the workhorse of business intelligence,
finance, and healthcare analytics.
• Core tasks: regression (predict a number), classification (predict a category), time-series forecasting.
• Key algorithms: Linear Regression, Random Forests, Gradient Boosting (XGBoost), LSTM networks.
• Real-world examples: credit scoring, demand forecasting, disease risk prediction, churn prediction.

Comparison of the Three Branches
BranchInput TypeOutput TypeKey Example
NLPText / SpeechText / LabelsChatGPT, Google Translate
Computer VisionImages / VideoLabels / BoxesFace ID, Radiology AI
Predictive MLTabular / Time-seriesNumbers / LabelsCredit scores, forecasts
Key Takeaways
• NLP: language in, language or labels out — powers chatbots and search engines.
• Computer Vision: images/video in, understanding out — powers Face ID and autonomous vehicles.
• Predictive ML: historical data in, forecasts out — powers credit and demand systems.
Quick-Revision Questions
• Name two real-world applications of each of the three AI branches.
• What architecture powers modern NLP? What architecture powers Computer Vision?
• How does Predictive ML differ from the other two branches in terms of input data?`,
  },
];
