export const PHASE_2_CONTENT = `
# Phase 2: Leveling Up — Modifiers

Now that you have a working chatbot, it's time to learn how to **control** it. Right now your bot is like an actor with no script — it'll respond, but it has no personality, no focus, and no constraints. Let's fix that.

> 🔑 **Before starting:** Make sure your virtual environment is activated! You should see \`(venv)\` in your terminal prompt. If not, run the activation command from Phase 1 Step 7.

---

## System Prompts — Give Your Bot a Personality

A **system prompt** is a hidden instruction you give to the AI before the conversation starts. The user never sees it, but it shapes every response the bot gives.

Think of it like this: *the system prompt is the AI's job description*.

### Example: The Pirate Translator

Let's make a bot that translates everything into pirate speak. Create a new file called **\`pirate_bot.py\`**:

\`\`\`python
from groq import Groq

client = Groq(api_key="YOUR_GROQ_API_KEY")

SYSTEM_PROMPT = """You are a pirate translator. 
Whatever the user says, respond with the same meaning 
but written entirely in pirate speak. 
Use 'arr', 'matey', 'ye', 'plunder', etc. 
Stay in character no matter what."""

print("🏴‍☠️ Pirate Translator Bot")
print("Type 'quit' to exit")
print("-" * 40)

while True:
    user_input = input("\\nYou: ")

    if user_input.lower() == "quit":
        print("Arr, farewell matey! 🏴‍☠️")
        break

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_input}
        ]
    )

    print(f"\\n🏴‍☠️ Pirate: {response.choices[0].message.content}")
\`\`\`

[download:pirate_bot.py]

Try it! Type "I need to go to the store to buy groceries" and watch it transform.

### More System Prompt Ideas

Here are some personas you can try — just swap out the \`SYSTEM_PROMPT\`:

- **Code Reviewer:** *"You are a senior software engineer. Review any code the user shares and provide constructive feedback on bugs, style, and best practices."*
- **Cooking Assistant:** *"You are a friendly chef. Help the user cook meals with whatever ingredients they have. Always suggest simple recipes first."*
- **Study Buddy:** *"You are a patient tutor. Help the user understand difficult concepts by breaking them down into simple explanations with examples."*
- **Motivational Coach:** *"You are an energetic motivational speaker. Respond to everything with encouragement, positivity, and actionable advice."*

> **Key takeaway:** The system prompt is one of the most powerful tools you have. A well-written system prompt can completely change what your bot does — without changing any code.

---

## Temperature — Control Creativity

**Temperature** controls how "creative" or "random" the AI's responses are.

| Temperature | Behavior | Best For |
|---|---|---|
| \`0.0\` | Very precise, deterministic, same answer every time | Facts, math, code |
| \`0.5\` | Balanced between creative and accurate | General conversation |
| \`1.0\` | Creative, varied responses | Brainstorming, stories |
| \`1.5 - 2.0\` | Very creative, sometimes unpredictable | Wild ideas, poetry |

### Try It Yourself

Create **\`temperature_test.py\`**:

\`\`\`python
from groq import Groq

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

    print(f"\\n🌡️ Temperature {temp}:")
    print(f"   {response.choices[0].message.content[:200]}")
    print("-" * 50)
\`\`\`

[download:temperature_test.py]

Run it and notice how the ideas get wilder as temperature increases!

### Other Useful Parameters

\`\`\`python
response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[{"role": "user", "content": "Hello!"}],
    temperature=0.7,      # Creativity level (0-2)
    max_tokens=500,        # Max length of response
    top_p=0.9,             # Nucleus sampling (alternative to temperature)
)
\`\`\`

- **\`max_tokens\`**: Limits how long the response can be. Useful to keep answers short.
- **\`top_p\`**: Another way to control randomness. Usually you adjust either temperature OR top_p, not both.

---

## Multi-Turn Conversations

Right now, each message is independent — the bot has no memory of what was said before. Let's fix that by keeping a **conversation history**.

Create **\`smart_chat.py\`**:

\`\`\`python
from groq import Groq

client = Groq(api_key="YOUR_GROQ_API_KEY")

SYSTEM_PROMPT = "You are a helpful and friendly assistant."

# This list stores the entire conversation
messages = [
    {"role": "system", "content": SYSTEM_PROMPT}
]

print("💬 Smart Chatbot (with context!)")
print("Type 'quit' to exit")
print("-" * 40)

while True:
    user_input = input("\\nYou: ")

    if user_input.lower() == "quit":
        print("👋 Goodbye!")
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

    print(f"\\n🤖 Bot: {bot_reply}")
\`\`\`

[download:smart_chat.py]

Now try this:
1. Tell the bot "My name is Alex"
2. Ask "What's my name?"

It remembers! Because we're sending the **entire conversation** with each request.

---

## Introduction to Streamlit — From Terminal to Web

Your chatbot works, but it's stuck in the terminal. Let's give it a **web interface** using **Streamlit** — a Python library that turns scripts into web apps with just a few lines of code.

### Install Streamlit

In your VS Code terminal:

\`\`\`bash
pip install streamlit
\`\`\`

> **Don't forget:** Run \`pip freeze > requirements.txt\` after installing to keep your dependencies file updated.

### Create Your Web Chatbot

Create a new file called **\`app.py\`**:

\`\`\`python
import streamlit as st
from groq import Groq

# Page config
st.set_page_config(page_title="My AI Chatbot", page_icon="🤖")
st.title("🤖 My AI Chatbot")

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
\`\`\`

[download:app.py]

### Run Your Web App

\`\`\`bash
streamlit run app.py
\`\`\`

Your browser should open automatically with a beautiful chat interface! 🎉

<!-- IMAGE: Streamlit chatbot UI -->

> **That's it.** Streamlit handles all the HTML, CSS, and JavaScript for you. You just write Python.

---

## Phase 2 Complete! 🎉

You now know how to:
- ✅ Use system prompts to control AI behavior
- ✅ Adjust temperature and other parameters
- ✅ Maintain multi-turn conversations
- ✅ Build web apps with Streamlit

**Next up in Phase 3:** We'll make your bot **remember** things even after it's restarted.
`;
