export const PHASE_3_CONTENT = `
# Phase 3: Memory — Making Your Bot Remember

Right now, every time you restart your chatbot, it forgets **everything**. It's like talking to someone with amnesia. In this phase, we'll fix that by giving your bot **persistent memory**.

> **Before starting:** Make sure your virtual environment is activated! You should see \`(venv)\` in your terminal prompt. If not, run the activation command from Phase 1 Step 7.

---

## The Problem

Try this experiment:
1. Open your chatbot and tell it "My favorite color is blue"
2. Close the terminal (or press Ctrl+C to stop the script)
3. Run the chatbot again
4. Ask "What's my favorite color?"

It has **no idea**. Every time the script starts, the conversation history is an empty list. All the context from the previous session is gone.

For a hackathon project, this isn't great. Imagine if ChatGPT forgot who you were every time you refreshed the page!

---

## Step 1: Conversation History (In-Session)

You already learned about multi-turn conversations in Phase 2. The messages list keeps track of the conversation **while the script is running**. Let's review the concept:

\`\`\`python
# This is in-memory — it resets when the script stops
messages = [
    {"role": "system", "content": "You are a helpful assistant."}
]

# Every time the user sends a message, we add it
messages.append({"role": "user", "content": "Hello!"})

# Every time the bot responds, we add that too  
messages.append({"role": "assistant", "content": "Hi there!"})

# The AI sees the ENTIRE history with each API call
\`\`\`

This works great during a session, but it all disappears when the script stops. Let's fix that.

---

## Step 2: Saving Memory to a File

The simplest way to persist memory is to **save the conversation to a file** and **load it when the bot starts**.

Create a new file called **\`memory_bot.py\`**:

\`\`\`python
import json
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
        print("Memory saved! Goodbye! ")
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

    print(f"\\nBot: {bot_reply}")
\`\`\`



### Test It

1. Run the bot: \`python memory_bot.py\`
2. Tell it: "My name is Alex and I love pizza"
3. Type \`quit\` to exit
4. Run the bot again: \`python memory_bot.py\`
5. Ask: "What's my name and what food do I like?"

**It remembers!** Check your folder — you'll see a \`memory.json\` file with the entire conversation saved.

---

## Step 3: Smart Memory — Summarizing Old Conversations

There's a catch with saving everything: the conversation file gets **really long** over time. The AI has a limited **context window** (how much text it can process at once). Send too much history, and you'll either:
- Hit token limits
- Slow down responses
- Burn through API credits faster

The solution? Use the AI to **summarize** old conversations into a compact memory.

Create **\`smart_memory_bot.py\`**:

\`\`\`python
import json
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
        print("Memory saved! Goodbye! ")
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

    print(f"\\nBot: {bot_reply}")
\`\`\`



This bot does something clever:
- It keeps the last 20 messages in full detail
- When the history gets too long, it asks the AI to **summarize** the older messages
- The summary is compact but captures all the important facts
- New conversations can access old knowledge without sending thousands of tokens

---

## Phase 3 Complete!

You now know how to:
- Persist conversations to a file
- Load memory on startup
- Summarize old conversations to save tokens
- Build a bot that truly remembers

**Next up in Phase 4:** It's hackathon time. Head over to the Hackathon section to brainstorm your project.
`;
