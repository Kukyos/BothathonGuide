export const PHASE_1_CONTENT = `
# Phase 1: Your First AI Chatbot

Welcome to Phase 1! By the end of this section, you'll have a working AI chatbot running right on your computer. We're going to take it **step by step** — no rushing, no assumptions. Let's go.

---

## What is a Terminal?

Before we write any code, let's talk about the **terminal** (also called the "command line" or "console"). 

Think of it like **texting your computer**. Instead of clicking buttons and icons, you type instructions and your computer does what you say. Every developer uses the terminal daily — and you're about to join that club.

> Don't worry if it looks intimidating at first. You'll only need a few simple commands.

---

## Opening Your Terminal

Here's how to open a terminal on your operating system:

### 🪟 Windows
1. Press \`Win + X\` to open the Power User Menu
2. Click on **"Terminal (Admin)"** or **"Windows PowerShell (Admin)"**
3. Click **"Yes"** on the User Account Control prompt
4. A dark window with a blinking cursor should appear — that's it!

<!-- IMAGE: Windows terminal opened -->

> **Alternative:** Press \`Win + R\`, type \`cmd\`, and press Enter. This opens the classic Command Prompt.

<!-- IMAGE: Windows Terminal opening -->

### 🍎 Mac
1. Press \`Cmd + Space\` to open **Spotlight Search**
2. Type **"Terminal"**
3. Press **Enter**

### 🐧 Linux
1. Press \`Ctrl + Alt + T\` — that's it!

> You should now have a window with a blinking cursor waiting for your input. This is your terminal. Leave it open — we'll come back to it.

---

## Step 1: Check if Python is Installed

Python is the programming language we'll use to build our chatbot. Let's check if it's already on your system.

In your terminal, type this and press **Enter**:

\`\`\`bash
python --version
\`\`\`

**What you might see:**

✅ **If you see something like** \`Python 3.11.5\` **or any** \`Python 3.x.x\` — **great! Skip to Step 3.**

❌ **If you see** \`'python' is not recognized\` **or** \`command not found\` — no worries! Try this instead:

\`\`\`bash
python3 --version
\`\`\`

Still nothing? That means Python isn't installed yet. Continue to Step 2.

---

## Step 2: Install Python

> **Only do this step if Python wasn't found in Step 1.**

1. Open your browser and go to **[python.org/downloads](https://www.python.org/downloads/)**
2. Click the big yellow **"Download Python 3.x.x"** button
3. Open the downloaded installer

<!-- IMAGE: Python download page -->

### ⚠️ CRITICAL — Read This Before Clicking Install

When the installer opens, you'll see a checkbox at the bottom that says:

**☐ Add Python to PATH**

**YOU MUST CHECK THIS BOX.** This is the single most common mistake beginners make. If you miss this, Python won't work from your terminal.

<!-- IMAGE: Python installer with "Add to PATH" highlighted -->

4. Click **"Install Now"** and wait for it to finish
5. **Close your terminal completely** and open a new one (this is important!)
6. Verify by typing:

\`\`\`bash
python --version
\`\`\`

You should now see \`Python 3.x.x\`. If you do — you're ready! 🎉

Also verify pip (Python's package installer) is working:

\`\`\`bash
pip --version
\`\`\`

You should see something like \`pip 23.x from ...\`. This is what we'll use to install libraries.

---

## Step 3: Install VS Code

VS Code (Visual Studio Code) is a **code editor** — think of it as a fancy notepad designed specifically for writing code. It's free, lightweight, and used by millions of developers.

1. Go to **[code.visualstudio.com](https://code.visualstudio.com/)**
2. Click the big **"Download"** button
3. Run the installer — accept all defaults and click through

<!-- IMAGE: VS Code download page -->

Once installed, open VS Code. You should see a welcome screen. 

> **Tip:** If VS Code asks you to install recommended extensions or choose a theme, you can skip those for now.

---

## Step 4: Create Your Project Folder

Instead of using terminal commands, we'll use VS Code's built-in tools to create our project.

1. In VS Code, go to **File → Open Folder** (or press \`Ctrl + K\` then \`Ctrl + O\`)
2. Navigate to your **Desktop** (or wherever you want your project)
3. Click **"New Folder"** in the file dialog
4. Name the folder **\`bot-a-thon\`**
5. Select that folder and click **"Select Folder"**

<!-- IMAGE: VS Code open folder dialog -->

VS Code will now open with your empty \`bot-a-thon\` folder. You should see the folder name in the left sidebar (the **Explorer** panel).

> **Can't see the sidebar?** Press \`Ctrl + B\` to toggle it.

---

## Step 5: Create Your First File

Now let's create the chatbot script:

1. In the VS Code sidebar (left panel), hover over your folder name
2. You'll see small icons appear — click the **"New File"** icon (the page with a \`+\`)
3. Type **\`chatbot.py\`** and press Enter

<!-- IMAGE: Creating new file in VS Code -->

A blank file should open in the editor. This is where we'll write our chatbot!

---

## Step 6: Open the VS Code Terminal

VS Code has a **built-in terminal** so you don't need to switch windows. Let's open it:

- Press **\`Ctrl + \`\`** (that's Ctrl plus the backtick key — it's above Tab on most keyboards)
- **OR** go to **Terminal → New Terminal** in the top menu

<!-- IMAGE: VS Code built-in terminal -->

A terminal panel should appear at the bottom of VS Code. It's already pointed at your project folder — perfect!

---

## Step 7: Install the Gemini SDK

In your VS Code terminal (the one at the bottom), type:

\`\`\`bash
pip install google-genai
\`\`\`

Wait for it to download and install. You should see \`Successfully installed...\` at the end.

> **Seeing an error?** Try \`pip3 install google-genai\` instead. On some systems, \`pip3\` is the correct command.

---

## Step 8: Get Your Gemini API Key

An **API key** is like a password that lets your code talk to Google's AI. Let's get one:

1. Go to **[aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)**
2. Sign in with your Google account
3. Click **"Create API key"**
4. Select **"Create API key in new project"**
5. **Copy the key** — it'll look something like \`AIzaSy...\`

<!-- IMAGE: Google AI Studio API key creation -->

> ⚠️ **Keep your API key secret!** Don't share it publicly or commit it to GitHub. Anyone with your key can use your quota.

---

## Step 9: Write Your Chatbot

Now for the fun part! Go back to your \`chatbot.py\` file in VS Code and paste this code:

\`\`\`python
from google import genai

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
\`\`\`

**Important:** Replace \`PASTE_YOUR_API_KEY_HERE\` with the API key you copied in Step 8. Keep the quotes around it!

---

## Step 10: Run Your Chatbot

In your VS Code terminal, type:

\`\`\`bash
python chatbot.py
\`\`\`

After a moment, you should see Gemini's response in your terminal — a kid-friendly explanation of quantum physics! 🎉

> **See an error about \`python\`?** Try \`python3 chatbot.py\` instead.

> **See an \`API key\` error?** Double-check that you pasted your key correctly, with quotes around it.

**Congratulations!** You just made your first AI API call. This is the foundation of everything you'll build during the Bot-A-Thon.

---

## Step 11: Make It Interactive

A chatbot that only says one thing isn't very useful. Let's upgrade it to have a **real conversation** where you can type messages back and forth.

Replace everything in \`chatbot.py\` with this:

\`\`\`python
from google import genai

API_KEY = "PASTE_YOUR_API_KEY_HERE"
client = genai.Client(api_key=API_KEY)

print("🤖 Gemini Chatbot")
print("Type 'quit' to exit")
print("-" * 40)

while True:
    # Get input from the user
    user_input = input("\\nYou: ")

    # Check if user wants to quit
    if user_input.lower() == "quit":
        print("👋 Goodbye!")
        break

    # Send to Gemini and get response
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=user_input
    )

    print(f"\\n🤖 Bot: {response.text}")
\`\`\`

Run it again with \`python chatbot.py\` and try having a conversation! Type anything and the bot will respond. Type \`quit\` when you're done.

---

## The Rate Limit Problem 🚨

You might have noticed something while testing: sometimes the bot **takes a long time to respond**, or you get an **error** that looks like this:

\`\`\`
429 Resource has been exhausted (e.g. check quota)
\`\`\`

This is the **rate limit**. Here's what's happening:

- Google's Gemini API has a **free tier** with limits on how many requests you can make
- The free tier allows roughly **15 requests per minute** and **1,500 per day**
- During a hackathon, when you're testing rapidly, you **will** hit these limits
- When you hit the limit, your bot breaks until the cooldown resets

This is totally normal, but it's annoying during a hackathon where every minute counts.

<!-- IMAGE: Rate limits comparison graph showing Groq as free tier winner -->

**This is why we're going to learn an alternative...**

---

## Enter Groq — The Fast Alternative

**Groq** is another AI API provider, but with some big advantages for hackathons:

- ⚡ **Extremely fast responses** (often under 1 second)
- 🆓 **Generous free tier** — much higher rate limits than Gemini
- 🧠 Supports powerful open-source models (like LLaMA)

### Get Your Groq API Key

1. Go to **[console.groq.com](https://console.groq.com)**
2. Sign up / log in
3. Navigate to **API Keys** in the sidebar
4. Click **"Create API Key"**, give it a name, and copy it

### Install the Groq SDK

In your VS Code terminal:

\`\`\`bash
pip install groq
\`\`\`

### Rewrite Your Chatbot for Groq

Create a new file called **\`chatbot_groq.py\`** and paste this:

\`\`\`python
from groq import Groq

API_KEY = "PASTE_YOUR_GROQ_API_KEY_HERE"
client = Groq(api_key=API_KEY)

print("⚡ Groq Chatbot")
print("Type 'quit' to exit")
print("-" * 40)

while True:
    user_input = input("\\nYou: ")

    if user_input.lower() == "quit":
        print("👋 Goodbye!")
        break

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "user", "content": user_input}
        ]
    )

    print(f"\\n⚡ Bot: {response.choices[0].message.content}")
\`\`\`

Run it with \`python chatbot_groq.py\` — notice how much faster the responses are!

### Gemini vs Groq — When to Use Which?

| Feature | Gemini (Free) | Groq (Free) |
|---|---|---|
| Speed | Moderate | ⚡ Very Fast |
| Rate Limits | ~15/min | ~30/min |
| Models | Gemini 2.0 Flash | LLaMA 3.3 70B |
| Best For | Google ecosystem, multimodal | Fast prototyping, hackathons |

> **Our recommendation for the hackathon:** Use **Groq** for rapid development and testing, and **Gemini** when you need Google-specific features.

---

## Phase 1 Complete! 🎉

You now have:
- ✅ Python installed and working
- ✅ VS Code set up as your editor 
- ✅ A working AI chatbot in your terminal
- ✅ Experience with both Gemini and Groq APIs
- ✅ An interactive chat loop

**Next up in Phase 2:** We'll learn how to control your bot's personality, creativity, and behavior using modifiers like system prompts and temperature.
`;
