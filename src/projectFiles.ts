// ============================================================
// Tutorial file contents (match code blocks in docs — hardcoded key placeholders)
// ============================================================
export const TUTORIAL_FILES: Record<string, { content: string; label: string }> = {
  'chatbot.py': {
    label: 'chatbot.py',
    content: `from google import genai

# Replace with your actual API key
API_KEY = "PASTE_YOUR_API_KEY_HERE"

# Set up the client
client = genai.Client(api_key=API_KEY)

# Send a message to Gemini
response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents="Explain quantum physics to a 5-year old."
)

# Print the response
print(response.text)
`,
  },
  'chatbot_interactive.py': {
    label: 'chatbot.py',
    content: `from google import genai

API_KEY = "PASTE_YOUR_API_KEY_HERE"
client = genai.Client(api_key=API_KEY)

print("Gemini Chatbot")
print("Type 'quit' to exit")
print("-" * 40)

while True:
    # Get input from the user
    user_input = input("\\nYou: ")

    # Check if user wants to quit
    if user_input.lower() == "quit":
        print("Goodbye!")
        break

    # Send to Gemini and get response
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=user_input
    )

    print(f"\nBot: {response.text}")
`,
  },
  'chatbot_groq.py': {
    label: 'chatbot_groq.py',
    content: `from groq import Groq

API_KEY = "PASTE_YOUR_GROQ_API_KEY_HERE"
client = Groq(api_key=API_KEY)

print("Groq Chatbot")
print("Type 'quit' to exit")
print("-" * 40)

while True:
    user_input = input("\\nYou: ")

    if user_input.lower() == "quit":
        print("Goodbye!")
        break

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "user", "content": user_input}
        ]
    )

    print(f"\\nBot: {response.choices[0].message.content}")
`,
  },
  'pirate_bot.py': {
    label: 'pirate_bot.py',
    content: `from groq import Groq

client = Groq(api_key="YOUR_GROQ_API_KEY")

SYSTEM_PROMPT = """You are a pirate translator. 
Whatever the user says, respond with the same meaning 
but written entirely in pirate speak. 
Use 'arr', 'matey', 'ye', 'plunder', etc. 
Stay in character no matter what."""

print("Pirate Translator Bot")
print("Type 'quit' to exit")
print("-" * 40)

while True:
    user_input = input("\\nYou: ")

    if user_input.lower() == "quit":
        print("Arr, farewell matey!")
        break

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_input}
        ]
    )

    print(f"\\nPirate: {response.choices[0].message.content}")
`,
  },
  'temperature_test.py': {
    label: 'temperature_test.py',
    content: `from groq import Groq

client = Groq(api_key="YOUR_GROQ_API_KEY")

prompt = "Give me a startup idea for a mobile app."

# Try different temperatures
for temp in [0.0, 0.5, 1.0, 1.5]:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=temp,
        max_tokens=100
    )

    print(f"\nTemperature {temp}:")
    print(f"   {response.choices[0].message.content[:200]}")
    print("-" * 50)
`,
  },
  'smart_chat.py': {
    label: 'smart_chat.py',
    content: `from groq import Groq

client = Groq(api_key="YOUR_GROQ_API_KEY")

SYSTEM_PROMPT = "You are a helpful and friendly assistant."

# This list stores the entire conversation
messages = [
    {"role": "system", "content": SYSTEM_PROMPT}
]

print("Smart Chatbot (with context!)")
print("Type 'quit' to exit")
print("-" * 40)

while True:
    user_input = input("\\nYou: ")

    if user_input.lower() == "quit":
        print("Goodbye!")
        break

    # Add user message to history
    messages.append({"role": "user", "content": user_input})

    # Send ENTIRE history to the API
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=0.7
    )

    bot_reply = response.choices[0].message.content

    # Add bot response to history
    messages.append({"role": "assistant", "content": bot_reply})

    print(f"\nBot: {bot_reply}")
`,
  },
  'app.py': {
    label: 'app.py',
    content: `import streamlit as st
from groq import Groq

# Page config
st.set_page_config(page_title="My AI Chatbot")
st.title("My AI Chatbot")

# Initialize Groq client
client = Groq(api_key="YOUR_GROQ_API_KEY")

# Initialize chat history in session state
if "messages" not in st.session_state:
    st.session_state.messages = []

# Display chat history
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Chat input
if prompt := st.chat_input("Say something..."):
    # Add user message to history
    st.session_state.messages.append({"role": "user", "content": prompt})
    
    # Display user message
    with st.chat_message("user"):
        st.markdown(prompt)
    
    # Get AI response
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            *st.session_state.messages
        ],
        temperature=0.7
    )
    
    bot_reply = response.choices[0].message.content
    
    # Display and store bot response
    with st.chat_message("assistant"):
        st.markdown(bot_reply)
    
    st.session_state.messages.append({"role": "assistant", "content": bot_reply})
`,
  },
  'memory_bot.py': {
    label: 'memory_bot.py',
    content: `import json
import os
from groq import Groq

client = Groq(api_key="YOUR_GROQ_API_KEY")

MEMORY_FILE = "memory.json"
SYSTEM_PROMPT = "You are a helpful assistant with a great memory. You remember everything the user tells you across conversations."

def load_memory():
    """Load conversation history from file"""
    if os.path.exists(MEMORY_FILE):
        with open(MEMORY_FILE, "r") as f:
            return json.load(f)
    return []

def save_memory(messages):
    """Save conversation history to file"""
    with open(MEMORY_FILE, "w") as f:
        json.dump(messages, f, indent=2)

# Load previous conversations
messages = load_memory()

# Add system prompt if starting fresh
if not messages or messages[0].get("role") != "system":
    messages.insert(0, {"role": "system", "content": SYSTEM_PROMPT})

print("Memory Bot")
print("Type 'quit' to exit | Type 'forget' to clear memory")
print(f"Loaded {len(messages) - 1} previous messages")
print("-" * 40)

while True:
    user_input = input("\\nYou: ")

    if user_input.lower() == "quit":
        save_memory(messages)
        print("Memory saved! Goodbye!")
        break

    if user_input.lower() == "forget":
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        save_memory(messages)
        print("Memory cleared!")
        continue

    messages.append({"role": "user", "content": user_input})

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=0.7
    )

    bot_reply = response.choices[0].message.content
    messages.append({"role": "assistant", "content": bot_reply})

    # Save after every exchange
    save_memory(messages)

    print(f"\nBot: {bot_reply}")
`,
  },
  'smart_memory_bot.py': {
    label: 'smart_memory_bot.py',
    content: `import json
import os
from groq import Groq

client = Groq(api_key="YOUR_GROQ_API_KEY")

MEMORY_FILE = "smart_memory.json"
MAX_MESSAGES = 20  # Keep last 20 messages in full

SYSTEM_PROMPT = """You are a helpful assistant with excellent memory. 
You'll receive a summary of past conversations and the recent conversation history. 
Use both to provide personalized, context-aware responses."""

def load_memory():
    if os.path.exists(MEMORY_FILE):
        with open(MEMORY_FILE, "r") as f:
            return json.load(f)
    return {"summary": "", "messages": []}

def save_memory(memory):
    with open(MEMORY_FILE, "w") as f:
        json.dump(memory, f, indent=2)

def summarize_old_messages(old_messages, existing_summary):
    """Ask the AI to create a summary of old conversations"""
    summary_prompt = f"""Here is a summary of previous conversations:
{existing_summary}

Here are new messages to incorporate into the summary:
{json.dumps(old_messages, indent=2)}

Create an updated, concise summary of everything important about the user 
and the conversations. Include: their name, preferences, interests, 
key facts they've shared, and any ongoing topics. 
Keep it under 300 words."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": summary_prompt}],
        temperature=0.3
    )

    return response.choices[0].message.content

# Load memory
memory = load_memory()

print("Smart Memory Bot")
print("Type 'quit' to exit | Type 'forget' to clear memory")
if memory["summary"]:
    print("Loaded previous memory summary")
print(f"{len(memory['messages'])} recent messages loaded")
print("-" * 40)

while True:
    user_input = input("\\nYou: ")

    if user_input.lower() == "quit":
        save_memory(memory)
        print("Memory saved! Goodbye!")
        break

    if user_input.lower() == "forget":
        memory = {"summary": "", "messages": []}
        save_memory(memory)
        print("All memory cleared!")
        continue

    memory["messages"].append({"role": "user", "content": user_input})

    # Build the messages to send
    api_messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    # Add summary if we have one
    if memory["summary"]:
        api_messages.append({
            "role": "system", 
            "content": f"Summary of past conversations: {memory['summary']}"
        })

    # Add recent messages
    api_messages.extend(memory["messages"])

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=api_messages,
        temperature=0.7
    )

    bot_reply = response.choices[0].message.content
    memory["messages"].append({"role": "assistant", "content": bot_reply})

    # If we have too many messages, summarize the old ones
    if len(memory["messages"]) > MAX_MESSAGES:
        old_messages = memory["messages"][:MAX_MESSAGES // 2]
        memory["summary"] = summarize_old_messages(
            old_messages, memory["summary"]
        )
        memory["messages"] = memory["messages"][MAX_MESSAGES // 2:]
        print("   (Old messages summarized to save space)")

    save_memory(memory)

    print(f"\nBot: {bot_reply}")
`,
  },
};

// ============================================================
// Complete project files (uses python-dotenv + .env)
// ============================================================

const dotenvHeader = `import os
from dotenv import load_dotenv
load_dotenv()
`;

function makeProjectScript(original: string, keyVar: string, envVar: string): string {
  // Replace hardcoded key patterns with os.getenv()
  let result = original;

  // Add dotenv import at the top
  const lines = result.split('\n');
  const importIdx = lines.findIndex(l => l.startsWith('import ') || l.startsWith('from '));
  if (importIdx >= 0) {
    lines.splice(importIdx, 0, ...dotenvHeader.trim().split('\n'));
  }
  result = lines.join('\n');

  // Replace various key assignment patterns
  result = result.replace(
    /(?:API_KEY\s*=\s*"[^"]*"|api_key\s*=\s*"[^"]*")/g,
    (match) => {
      if (match.startsWith('API_KEY')) {
        return `API_KEY = os.getenv("${envVar}")`;
      }
      return `api_key=os.getenv("${envVar}")`;
    }
  );

  return result;
}

function makeBatFile(scriptName: string, isStreamlit = false): string {
  const runCmd = isStreamlit
    ? `streamlit run ${scriptName}`
    : `python ${scriptName}`;
  return `@echo off
call venv\\Scripts\\activate.bat
${runCmd}
pause
`;
}

export function getProjectFiles(): Record<string, string> {
  const files: Record<string, string> = {};

  // .env
  files['.env'] = `# Paste your API keys below (replace the placeholder text)
# Get Gemini key: https://aistudio.google.com/app/apikey
# Get Groq key:   https://console.groq.com → API Keys

GEMINI_API_KEY=PASTE_YOUR_GEMINI_API_KEY_HERE
GROQ_API_KEY=PASTE_YOUR_GROQ_API_KEY_HERE
`;

  // requirements.txt
  files['requirements.txt'] = `google-genai
groq
streamlit
python-dotenv
`;

  // README.txt
  files['README.txt'] = `========================================
  BOT-A-THON — Complete Project
========================================

SETUP (One Time Only):
  1. Double-click  setup.bat
  2. Wait for it to finish installing
  3. Open  .env  in Notepad
  4. Paste your API keys (replace the placeholder text)
  5. Save and close .env

RUNNING BOTS:
  Double-click any  run_*.bat  file!
  Type 'quit' to exit a chatbot.

FILES:
  chatbot.py           Phase 1 — Gemini chatbot
  chatbot_groq.py      Phase 1 — Groq chatbot (faster!)
  pirate_bot.py        Phase 2 — Pirate translator
  temperature_test.py  Phase 2 — Temperature demo
  smart_chat.py        Phase 2 — Multi-turn chat
  app.py               Phase 2 — Web app (Streamlit)
  memory_bot.py        Phase 3 — Bot with memory
  smart_memory_bot.py  Phase 3 — Smart memory bot

NEED HELP?
  Check the full guide at the Bot-A-Thon documentation site.
`;

  // setup.bat
  files['setup.bat'] = `@echo off
echo ========================================
echo   Bot-A-Thon Project Setup
echo ========================================
echo.
echo Creating virtual environment...
python -m venv venv
echo.
echo Activating virtual environment...
call venv\\Scripts\\activate.bat
echo.
echo Installing packages (this may take a minute)...
pip install -r requirements.txt
echo.
echo ========================================
echo   Setup complete!
echo ========================================
echo.
echo NEXT STEP: Open the .env file in Notepad
echo and paste your API keys!
echo.
pause
`;

  // Project Python files (with dotenv)
  files['chatbot.py'] = makeProjectScript(
    TUTORIAL_FILES['chatbot.py'].content,
    'API_KEY', 'GEMINI_API_KEY'
  );
  files['chatbot_groq.py'] = makeProjectScript(
    TUTORIAL_FILES['chatbot_groq.py'].content,
    'API_KEY', 'GROQ_API_KEY'
  );
  files['pirate_bot.py'] = makeProjectScript(
    TUTORIAL_FILES['pirate_bot.py'].content,
    'api_key', 'GROQ_API_KEY'
  );
  files['temperature_test.py'] = makeProjectScript(
    TUTORIAL_FILES['temperature_test.py'].content,
    'api_key', 'GROQ_API_KEY'
  );
  files['smart_chat.py'] = makeProjectScript(
    TUTORIAL_FILES['smart_chat.py'].content,
    'api_key', 'GROQ_API_KEY'
  );
  files['app.py'] = makeProjectScript(
    TUTORIAL_FILES['app.py'].content,
    'api_key', 'GROQ_API_KEY'
  );
  files['memory_bot.py'] = makeProjectScript(
    TUTORIAL_FILES['memory_bot.py'].content,
    'api_key', 'GROQ_API_KEY'
  );
  files['smart_memory_bot.py'] = makeProjectScript(
    TUTORIAL_FILES['smart_memory_bot.py'].content,
    'api_key', 'GROQ_API_KEY'
  );

  // Bat files for each script
  files['run_chatbot.bat'] = makeBatFile('chatbot.py');
  files['run_chatbot_groq.bat'] = makeBatFile('chatbot_groq.py');
  files['run_pirate_bot.bat'] = makeBatFile('pirate_bot.py');
  files['run_temperature_test.bat'] = makeBatFile('temperature_test.py');
  files['run_smart_chat.bat'] = makeBatFile('smart_chat.py');
  files['run_streamlit_app.bat'] = makeBatFile('app.py', true);
  files['run_memory_bot.bat'] = makeBatFile('memory_bot.py');
  files['run_smart_memory_bot.bat'] = makeBatFile('smart_memory_bot.py');

  return files;
}
