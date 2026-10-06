export type Area = 'genai' | 'ml' | 'methods'
export type Audience = 'corporate' | 'academic' | 'student'
export type ChapterId = 'welcome' | 'teaching' | 'research' | 'build' | 'about' | 'contact'

export const EMAIL = 'abhishek.jha@spjimr.org'

export const LINKS = {
  scholar: 'https://scholar.google.com/citations?user=WDf43eYAAAAJ&hl=en',
  faculty: 'https://www.spjimr.org/faculty/abhishek-kumar-jha/',
  linkedin: 'https://www.linkedin.com/in/abhishek-kumar-jha-1a0869122/',
}

export const AREAS: Record<Area, { name: string; short: string; color: string; blurb: string }> = {
  genai: { name: 'GenAI & Agentic AI for Managers', short: 'GenAI & Agents', color: '#f59e0b', blurb: 'How people and organisations work with language models and agents.' },
  ml: { name: 'Applied ML & Predictive Analytics', short: 'Applied ML', color: '#0ea5a4', blurb: 'Prediction, networks and text analytics for real business decisions.' },
  methods: { name: 'AI Research Methods', short: 'Research Methods', color: '#7c5cff', blurb: 'Using LLMs as instruments, stimuli and subjects of study.' },
}

export interface Paper {
  id: string
  year: number
  title: string
  venue: string
  with: string
  area: Area
  url?: string
}

export const PAPERS: Paper[] = [
  { id: 'sabotage', year: 2026, title: 'Stop sabotaging your influencers: How language formality undermines engagement in sponsored content', venue: 'Journal of Retailing and Consumer Services', with: 'R. Singhania and S. Bagchi', area: 'ml', url: 'https://doi.org/10.1016/j.jretconser.2025.104480' },
  { id: 'gemini', year: 2026, title: "Google's Gemini image generation: AI bias and the rewriting of history", venue: 'Communications of the Association for Information Systems', with: 'A. S. Dhaigude and others', area: 'genai', url: 'https://aisel.aisnet.org/cais/vol59/iss1/19/' },
  { id: 'relaxo', year: 2026, title: 'Relaxo Footwears: Inventory decisions in a high-SKU market', venue: 'Ivey Publishing, case and teaching note', with: 'M. I. Khan, T. K. Ahuja, R. K. Meet, A. S. Dhaigude, V. Wadhwani and S. Rai', area: 'ml' },
  { id: 'storytelling', year: 2026, title: 'The shifting sands of context: AI-supported storytelling and digital content creation', venue: 'AI-Powered Entrepreneurial Marketing and Communication, IGI Global (book chapter)', with: 'S. Jha', area: 'genai' },
  { id: 'blockchain', year: 2025, title: "Don't overdo it with blockchain: Understanding the impact of blockchain on users' security perception", venue: 'Marketing Intelligence & Planning', with: 'S. Kumar and A. Jain', area: 'methods', url: 'https://www.emerald.com/mip/article-abstract/43/4/777/1247491/Don-t-overdo-it-with-blockchain-understanding-the' },
  { id: 'micro', year: 2025, title: 'From movements to micro-mobilizers: How socially conscious influencers mobilize engagement beyond traditional social movements', venue: 'ACIS 2025 Proceedings', with: 'S. K. Sailakshmi', area: 'methods', url: 'https://aisel.aisnet.org/acis2025/288/' },
  { id: 'lastmile', year: 2025, title: 'From last mile to lasting gains: Enablers of social commerce for subsistence women entrepreneurs', venue: 'ACIS 2025 Proceedings', with: 'A. Desai', area: 'ml', url: 'https://aisel.aisnet.org/acis2025/179/' },
  { id: 'organizing', year: 2025, title: 'Organizing around AI: Task formalizability and the shifting nature of human–AI collaboration', venue: 'ACIS 2025 Proceedings', with: 'S. Ansari', area: 'genai' },
  { id: 'influencer', year: 2023, title: 'Influencer recommendation system: Choosing the right influencer using a network analysis approach', venue: 'Marketing Intelligence & Planning', with: 'S. Ray', area: 'ml', url: 'https://doi.org/10.1108/MIP-04-2023-0149' },
  { id: 'deception', year: 2023, title: "'Don't fool me, as it is your loss': Impact of deception on information privacy", venue: 'Journal of Organizational Computing and Electronic Commerce', with: 'S. Kumar', area: 'methods', url: 'https://www.tandfonline.com/doi/full/10.1080/10919392.2023.2253086' },
  { id: 'arrangements', year: 2023, title: 'Product arrangements: Are time and number in sync?', venue: 'Advances in Consumer Research', with: 'S. Tripathi', area: 'ml' },
]

export const IN_PROGRESS: { area: Area; text: string }[] = [
  { area: 'genai', text: 'Building an AI-enabled listening culture' },
  { area: 'genai', text: "Field study of AI's effect on sales" },
  { area: 'genai', text: 'Justice for AI service providers' },
  { area: 'ml', text: 'Humanizing Alexa: a large-scale LLM-based analysis' },
  { area: 'ml', text: "Last-mile delivery and women's earnings in subsistence markets" },
  { area: 'methods', text: "Voice AI for rural women's inclusion, an RCT" },
  { area: 'methods', text: 'Letting AI drive my car, an experiment' },
  { area: 'methods', text: 'Social presence of AI companions' },
]

export type Track = 'business' | 'build' | 'research'

export interface Programme {
  id: string
  track: Track
  title: string
  who: string
  blurb: string
  topics: string[]
  tag?: string
}

export const TRACKS: Record<Track, { name: string; color: string; sub: string }> = {
  business: { name: 'Business & strategy', color: '#f59e0b', sub: 'Case-led programmes for decision-makers' },
  build: { name: 'Hands-on build', color: '#0ea5a4', sub: 'Participants build prototypes and run analyses themselves' },
  research: { name: 'Research seminars', color: '#7c5cff', sub: 'For doctoral students and faculty' },
}

export const PROGRAMMES: Programme[] = [
  { id: 'genai-leaders', track: 'business', title: 'Generative AI for Business Leaders', who: 'Executives & leaders', blurb: 'What LLMs can and cannot do, where they create value in each function, and how to measure the return.', topics: ['How LLMs work, without the maths', 'From prompting to context engineering', 'RAG on company knowledge', 'Copilots by function'] },
  { id: 'aiml-managers', track: 'business', title: 'AI & Machine Learning for Managers', who: 'Executives & managers', blurb: "How predictive models work, when to trust them and how to use them in business decisions, built around participants' own use cases.", topics: ['Supervised and unsupervised learning', 'Predictive analytics', 'Text and image analytics', 'Reading model output critically'] },
  { id: 'ai-strategy', track: 'business', title: 'AI Strategy for the Digital Business', who: 'Senior managers · MBA', blurb: 'How the progression from data to ML to generative AI changes strategy, operations and competition, using recent cases.', topics: ['Platforms and data network effects', 'Data to ML to GenAI', 'AI in operations and ERP', 'Digital transformation cases'] },
  { id: 'cert', track: 'business', title: 'Generative AI for Business Certification', who: 'Working professionals', tag: 'Online', blurb: 'An online certification programme for professionals on applying generative AI at work, delivered with Great Learning.', topics: ['GenAI foundations', 'Business use cases', 'Prompting and copilots', 'Responsible adoption'] },
  { id: 'agentic', track: 'build', title: 'Agentic AI: Designing Autonomous Workflows', who: 'Leaders · MBA', blurb: 'How AI agents plan and use tools, which tasks to hand over to them, and where people need to stay in control.', topics: ['Agents vs. chatbots vs. automation', 'Tool use and MCP', 'Multi-agent orchestration', 'Human-in-the-loop design'] },
  { id: 'maker', track: 'build', title: 'Maker Lab: Build with AI', who: 'MBA · Intrapreneurs', blurb: 'Teams use AI coding tools to build working prototypes for real stakeholders and present them at a demo day.', topics: ['Vibe coding with AI assistants', 'Problem framing with stakeholders', 'Prompting for software', 'Prototype to pilot'] },
  { id: 'influencer', track: 'build', title: 'Influencer & Social Media Analytics with AI', who: 'Marketing & analytics teams', blurb: 'Hands-on analysis of creator and social media data using network analysis and language models.', topics: ['Network analysis for influencer selection', 'Text analytics on social posts', 'Engagement prediction', 'GenAI for brand-voice fit'] },
  { id: 'theory', track: 'research', title: 'Theory and Theorizing', who: 'Doctoral students · Faculty', blurb: 'How to build theory from a puzzling phenomenon, especially in fast-moving areas like AI where existing theory runs out.', topics: ['What counts as a theory', 'Phenomenon-driven theorizing', 'Mechanisms and boundary conditions', 'Theorizing about AI'] },
  { id: 'methods', track: 'research', title: 'AI Research Methods', who: 'Doctoral students · Faculty', blurb: 'Rigorous ways to use LLMs and AI in research, as instruments, as experimental stimuli and as subjects of study.', topics: ['LLMs as measurement instruments', 'Validity for AI-coded data', 'Computational text analysis', 'Experiments with AI agents'] },
]

export interface Milestone {
  id: string
  kind: 'study' | 'work' | 'honour'
  when: string
  title: string
  where: string
}

export const MILESTONES: Milestone[] = [
  { id: 'be', kind: 'study', when: 'Early years', title: 'BE, Information Science and Engineering', where: 'PES University, Bengaluru' },
  { id: 'phd', kind: 'study', when: 'Doctoral years', title: 'PhD (FPM), Management Information Systems', where: 'IIM Indore' },
  { id: 'gserm', kind: 'study', when: 'During the PhD', title: 'Summer School in Empirical Research Methods', where: 'GSERM, University of St. Gallen' },
  { id: 'deakin', kind: 'work', when: '2024–2025', title: 'Lecturer', where: 'Deakin University, GIFT City' },
  { id: 'spjimr', kind: 'work', when: '2025–present', title: 'Assistant Professor, Information Management & Analytics', where: 'SPJIMR, Mumbai' },
]

export const HONOURS: Milestone[] = [
  { id: 'h1', kind: 'honour', when: '2025', title: 'Best Doctoral Student Award', where: 'IIM Indore' },
  { id: 'h2', kind: 'honour', when: '2024', title: 'Bala and Vasantha Balachandran Research Grant', where: 'NASMEI' },
  { id: 'h3', kind: 'honour', when: '2023', title: 'Best Paper Award, BSIM Conference', where: 'IIM Ahmedabad' },
  { id: 'h4', kind: 'honour', when: '2023', title: 'Best Poster Award', where: 'Bombay Workshop on Statistics and Probability' },
]

export const SERVICE = ['Associate Editor, PACIS (2025, 2026)', 'Contributor, MIS Quarterly Insider', 'Reviewer: JRCS, MIP, JBR, JOCEC, Computers in Human Behavior', 'Reviewer: ICIS, PACIS, ECIS, AMCIS, ACIS, ACR']

export const POLICY = [
  "Contributor to a Bill & Melinda Gates Foundation–funded project on making India's Account Aggregator ecosystem more inclusive, with Prof. Ashish Desai",
  'Research input to the UK Home Office SME Action Plan on public procurement and small-business inclusion, via LSE Policy Hub (2023), with Prof. Ashish Desai',
]

export interface Chapter {
  id: ChapterId
  title: string
  label: string
  theme: { sky: string; ground: string; accent: string; sun: string }
}

export const CHAPTERS: Chapter[] = [
  { id: 'welcome', title: 'Welcome', label: 'The plaza', theme: { sky: '#fde7d3', ground: '#d8ecd3', accent: '#e8590c', sun: '#fff1dc' } },
  { id: 'teaching', title: 'Teaching', label: 'Teaching Studio', theme: { sky: '#ffe9b8', ground: '#e3ecc6', accent: '#d97706', sun: '#fff0c4' } },
  { id: 'research', title: 'Research', label: 'Research Observatory', theme: { sky: '#cfeef0', ground: '#cde8e3', accent: '#0e8f8e', sun: '#e5fbff' } },
  { id: 'build', title: 'Build', label: 'Maker Lab', theme: { sky: '#e4dcff', ground: '#dcdff1', accent: '#6d4cf0', sun: '#f1ecff' } },
  { id: 'about', title: 'Journey', label: 'The journey path', theme: { sky: '#dff1d6', ground: '#d4e8c4', accent: '#3f8a2f', sun: '#f5ffe8' } },
  { id: 'contact', title: 'Contact', label: 'The lighthouse', theme: { sky: '#ffd9cc', ground: '#e9e0d0', accent: '#d9480f', sun: '#ffe9dc' } },
]

// What the guide says. Variants by audience where it matters.
type Say = { all: string[]; corporate?: string[]; academic?: string[]; student?: string[] }
export const SAY: Record<ChapterId, Say> = {
  welcome: {
    all: [
      "Hi, I'm Abhishek. I'm an Assistant Professor at SPJIMR in Mumbai. I study how people and organisations work with AI.",
      'I teach managers, MBA students and doctoral scholars to do the same. Come, I will show you around.',
    ],
    corporate: ["Welcome. If you're planning an AI programme for your team, the Teaching Studio is the place to start. I'll show you case-led sessions and hands-on builds."],
    academic: ["Welcome. I'll take you to the Observatory first: papers on AI, influencers and platforms, plus seminars for doctoral scholars."],
    student: ['Welcome. Have a look at how I teach: cases, builds and demo days. The Maker Lab is a good place to start.'],
  },
  teaching: {
    all: ['This is where I teach. Business leaders get case-led programmes. Teams that want to build get hands-on labs. Researchers get seminars.', 'Pick a programme, on the rack or in the list, and I will tell you what it covers.'],
    corporate: ['Most companies begin with Generative AI for Business Leaders, then add a hands-on build so people leave with something working.'],
    academic: ['For doctoral scholars and faculty I run seminars on theorizing and on using LLMs as research instruments. They are on the right of the rack.'],
    student: ['In my classes you build things. Maker Lab teams ship a prototype for a real stakeholder and present it at a demo day.'],
  },
  research: {
    all: ['I work in three areas: GenAI and agentic AI for managers, applied machine learning, and AI research methods. Each paper orbits in the colour of its area.', 'Tap a paper to see where it appeared.'],
    academic: ['Filter by area if you want to see where the methods work sits. Several of these are with doctoral colleagues.'],
    corporate: ['The influencer and platform papers feed straight into the analytics programmes you saw in the studio.'],
  },
  build: {
    all: ["Agents are not chatbots. They plan, use tools and check their own work. The question I ask in class is where a person has to stay in the loop.", 'Press play, then switch the human review off and see what changes.'],
  },
  about: {
    all: ['A short version of my path: engineering in Bengaluru, a PhD at IIM Indore, a lectureship at Deakin in GIFT City, and now SPJIMR.', 'Tap a post to read more. The trophies are on the shelf behind.'],
  },
  contact: {
    all: ["If you're planning a programme, a keynote or a research collaboration, tell me the audience, the date and your goals. I'll propose a format.", 'Use the brief builder and it will write the email for you.'],
  },
}

export const AGENT_STEPS = [
  { id: 'goal', label: 'Goal', text: 'A person sets the goal and the limits: what the agent may and may not do.' },
  { id: 'plan', label: 'Plan', text: 'The agent breaks the goal into steps and decides which tools it needs.' },
  { id: 'tool', label: 'Use tools', text: 'It searches, queries data or calls software. This is where it stops being a chatbot.' },
  { id: 'check', label: 'Self-check', text: 'It reviews its own draft against the goal and tries again if it falls short.' },
  { id: 'human', label: 'Human review', text: 'A person approves, edits or stops the work before it affects anyone.' },
  { id: 'ship', label: 'Deliver', text: 'The result goes out. With review on, someone is accountable for it.' },
] as const
