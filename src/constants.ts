export interface NavItem {
  title: string;
  id: string;
  level: number;
  phase?: number;
}

export const NAV_ITEMS: NavItem[] = [
  // Intro
  { title: "Introduction", id: "intro", level: 0 },

  // Phase 1
  { title: "Phase 1: Terminal Bot", id: "phase-1", level: 0, phase: 1 },
  { title: "What is a Terminal?", id: "what-is-a-terminal", level: 1, phase: 1 },
  { title: "Opening Your Terminal", id: "opening-your-terminal", level: 1, phase: 1 },
  { title: "Check Python", id: "step-1-check-if-python-is-installed", level: 1, phase: 1 },
  { title: "Install Python", id: "step-2-install-python", level: 1, phase: 1 },
  { title: "Install VS Code", id: "step-3-install-vs-code", level: 1, phase: 1 },
  { title: "Create Project Folder", id: "step-4-create-your-project-folder", level: 1, phase: 1 },
  { title: "Create Your File", id: "step-5-create-your-first-file", level: 1, phase: 1 },
  { title: "Open VS Code Terminal", id: "step-6-open-the-vs-code-terminal", level: 1, phase: 1 },
  { title: "Virtual Environment", id: "step-7-create-a-virtual-environment", level: 1, phase: 1 },
  { title: "Install Gemini SDK", id: "step-8-install-the-gemini-sdk", level: 1, phase: 1 },
  { title: "Get API Key", id: "step-9-get-your-gemini-api-key", level: 1, phase: 1 },
  { title: "Write the Chatbot", id: "step-10-write-your-chatbot", level: 1, phase: 1 },
  { title: "Run It", id: "step-11-run-your-chatbot", level: 1, phase: 1 },
  { title: "Make It Interactive", id: "step-12-make-it-interactive", level: 1, phase: 1 },
  { title: "Rate Limits", id: "the-rate-limit-problem-", level: 1, phase: 1 },
  { title: "Groq Alternative", id: "enter-groq--the-fast-alternative", level: 1, phase: 1 },

  // Phase 2
  { title: "Phase 2: Modifiers", id: "phase-2", level: 0, phase: 2 },
  { title: "System Prompts", id: "system-prompts--give-your-bot-a-personality", level: 1, phase: 2 },
  { title: "Temperature", id: "temperature--control-creativity", level: 1, phase: 2 },
  { title: "Multi-Turn Chat", id: "multi-turn-conversations", level: 1, phase: 2 },
  { title: "Streamlit Web UI", id: "introduction-to-streamlit--from-terminal-to-web", level: 1, phase: 2 },

  // Phase 3
  { title: "Phase 3: Memory", id: "phase-3", level: 0, phase: 3 },
  { title: "The Problem", id: "the-problem", level: 1, phase: 3 },
  { title: "Conversation History", id: "step-1-conversation-history-in-session", level: 1, phase: 3 },
  { title: "Save to File", id: "step-2-saving-memory-to-a-file", level: 1, phase: 3 },
  { title: "Smart Memory", id: "step-3-smart-memory--summarizing-old-conversations", level: 1, phase: 3 },

  // Phase 4
  { title: "Phase 4: Idea Generator", id: "phase-4", level: 0, phase: 4 },
];
