# KeyFlash

KeyFlash is a Next.js-powered educational platform designed to improve memory retention and typing speed through active recall. By converting notes, flashcards, and code snippets into interactive typing sessions, it helps users absorb information faster and more effectively.

## 🚀 Features

* **Typing-Powered Recall**: Retype your own material to reinforce memory through active learning.
* **Flashcard Typing Mode**: Practice by typing answers to your custom flashcards—ideal for terms, concepts, or programming syntax.
* **Performance Tracking**: Monitor your Words Per Minute (WPM), accuracy, and overall progress over time.
* **Gamified Learning**: Advanced repetition logic where wrong answers appear more frequently to ensure mastery.
* **Custom Content**: Upload `.txt` files or paste text directly to generate interactive typing content.
* **Reviewer Generation**: Instantly turn notes into clean, readable summaries for quick review.

## 👥 Who is it For?

* **Students**: Reinforce class notes and textbook material.
* **Developers**: Master documentation, new language syntax, and technical concepts.
* **Teachers**: Convert handouts into interactive practice sessions for students.
* **Lifelong Learners**: Improve recall for any subject while simultaneously building typing speed.

## 🛠️ Tech Stack

* **Framework**: [Next.js 15](https://nextjs.org/)
* **Frontend**: React 19, Tailwind CSS 4, Framer Motion
* **Backend/Auth**: Supabase (Auth & Database)
* **UI Components**: Radix UI, Lucide React, Sonner
* **Payments**: PayPal SDK
* **Analytics**: Vercel Analytics & Speed Insights

## 🏁 Getting Started

### Prerequisites

* Node.js (v20 or higher)
* npm, yarn, pnpm, or bun

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/keyflash.git](https://github.com/your-username/keyflash.git)
    cd keyflash
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root directory and add your Supabase and PayPal credentials.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open the app:**
    Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 💎 Pricing & Pro Features

KeyFlash offers a **Free** tier for casual learners and a **Pro** upgrade for power users.

| Feature | Free | Pro (One-time) |
| :--- | :--- | :--- |
| **Price** | $0 | $4.99 (Lifetime) |
| **Flashcards** | Up to 5 | Unlimited |
| **Custom Texts** | Up to 5 | Unlimited |
| **Code Snippets** | Up to 5 | Unlimited |
| **Ads** | Supported | Ad-Free |
| **New Features** | Standard | Early Access |

## 📄 License

This project is private. See the `package.json` for further details.
