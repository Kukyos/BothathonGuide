import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dice5, Loader2, Sparkles, Copy, Check } from 'lucide-react';

interface GroqChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GroqChatResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

const IDEA_CATEGORIES = [
  "Education",
  "Productivity",
  "Customer Service",
  "Entertainment",
  "Mental Health",
  "Finance",
  "Career",
  "Gaming",
];

const FALLBACK_IDEAS = [
  "🎓 An AI study buddy chatbot that quizzes you on history facts and explains topics in the style of famous historical figures",
  "📝 An AI meeting prep bot that interviews you about an upcoming meeting and generates an agenda and talking points",
  "🗣️ A language exchange chatbot that role-plays real-world scenarios (ordering food, job interviews) in your target language",
  "💰 A personal finance text companion that asks daily questions about your spending and gives gentle text-based budgeting advice",
  "🎮 An AI game master chatbot for text-based RPG adventures that adapts the story branching based on your text choices",
  "🧘 A mindfulness text-coach that checks in via chat and suggests personalized breathing or journaling exercises",
  "💼 A mock-interview chatbot that acts as a hiring manager, asks industry-specific questions, and critiques your answers",
  "🍳 A recipe-brainstorming chatbot that asks what ingredients you have and guides you through cooking via step-by-step chat messages",
  "🤝 A conflict-resolution chatbot that helps you draft difficult text messages or emails to friends or coworkers",
  "🌍 A hyper-local travel guide bot — tell it your zip code and interests, and it chats with you to plan a staycation itinerary",
];

export default function IdeaGenerator() {
  const [idea, setIdea] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const buildMessages = (themeContext: string): GroqChatMessage[] => [
    {
      role: 'system',
      content: `You are a creative hackathon idea generator for a chatbot hackathon. Generate ONE unique, creative, and feasible AI-powered chatbot project idea for a hackathon. 
      
The idea MUST:
- Be a text-based chatbot or conversational agent ONLY (no image generation, no voice generation, no image analysis, no vision)
- Be buildable in 1-2 hours using Groq or Gemini text APIs
- Be practical and impressive
- Include a catchy name

Format: Start with an emoji and the project name in bold, then a 2-3 sentence description of what the chatbot does and why it's cool. Keep it under 80 words total.`,
    },
    {
      role: 'user',
      content: `${themeContext} Give me a fresh, creative hackathon project idea.`,
    },
  ];

  const generateViaVercelApi = async (messages: GroqChatMessage[]) => {
    const response = await fetch('/api/groq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 1.3,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      throw new Error(`Vercel API error: ${response.status}`);
    }

    const data = (await response.json()) as GroqChatResponse;
    return data.choices?.[0]?.message?.content?.trim();
  };

  const generateDirectFromBrowser = async (messages: GroqChatMessage[]) => {
    const publicApiKey = import.meta.env.VITE_GROQ_API_KEY as string | undefined;
    if (!publicApiKey) {
      throw new Error('No VITE_GROQ_API_KEY configured for direct browser fallback.');
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${publicApiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 1.3,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      throw new Error(`Direct Groq API error: ${response.status}`);
    }

    const data = (await response.json()) as GroqChatResponse;
    return data.choices?.[0]?.message?.content?.trim();
  };

  const generateIdea = async () => {
    setIsLoading(true);
    setError('');

    try {
      const themeContext = theme.trim()
        ? `The user is interested in: "${theme}". Generate an idea related to this theme.`
        : `Pick a random category from: ${IDEA_CATEGORIES.join(', ')}.`;
      const messages = buildMessages(themeContext);

      let nextIdea = '';

      try {
        nextIdea = (await generateViaVercelApi(messages)) ?? '';
      } catch {
        // Fallback keeps local dev usable if /api isn't running.
        nextIdea = (await generateDirectFromBrowser(messages)) ?? '';
      }

      if (!nextIdea) {
        throw new Error('No idea returned from model response.');
      }

      setIdea(nextIdea);
    } catch (err) {
      setError('Failed to generate. Using offline ideas!');
      const randomIdea = FALLBACK_IDEAS[Math.floor(Math.random() * FALLBACK_IDEAS.length)];
      setIdea(randomIdea);
    }

    setIsLoading(false);
  };

  const copyIdea = () => {
    navigator.clipboard.writeText(idea);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="idea-generator">
      <div className="idea-generator-header">
        <div className="idea-generator-icon">
          <Sparkles className="w-8 h-8 text-black" />
        </div>
        <div>
          <h2 className="idea-generator-title">Hackathon Idea Generator</h2>
          <p className="idea-generator-subtitle">
            Stuck on what to build? Let AI spark your creativity. Enter a theme or just roll the dice!
          </p>
        </div>
      </div>

      <div className="idea-input-row">
        <input
          type="text"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="Enter a theme (optional) — e.g. 'education', 'health', 'gaming'..."
          className="idea-input"
          onKeyDown={(e) => e.key === 'Enter' && !isLoading && generateIdea()}
        />
        <button
          onClick={generateIdea}
          disabled={isLoading}
          className="idea-dice-button"
          title="Generate idea"
        >
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Dice5 className="w-6 h-6" />
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-yellow-400/70 text-xs mt-3"
          >
            {error}
          </motion.p>
        )}

        {idea && (
          <motion.div
            key={idea}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="idea-result"
          >
            <p className="idea-text">{idea}</p>
            <button
              onClick={copyIdea}
              className="idea-copy-button"
              title="Copy idea"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {!idea && !isLoading && (
        <div className="idea-empty-state">
          <Dice5 className="w-10 h-10 text-white/10" />
          <p>Click the dice to generate your first idea!</p>
        </div>
      )}
    </div>
  );
}
