# Nahj Path

# Nahj AI

Build a production-ready, mobile-first web application called **Nahj AI**.

## Vision

Nahj AI should become the "Duolingo of Islamic Knowledge."

The application must feel premium, modern, beautiful, addictive, and engaging while remaining respectful and educational.

Take inspiration from the polish and user experience of Duolingo, Spotify, Snapchat, Notion, Apple, Linear, Vercel Dashboard, and ChatGPT, but create a completely original design language. Do NOT copy any existing UI.

The application should feel like a premium consumer product instead of a traditional Islamic library.

---

# Design Language

Create an elegant, modern, responsive UI.

Color Palette:

• Deep Emerald

• Emerald

• Gold

• Ivory

• White

• Charcoal

Use:

• Soft gradients

• Glassmorphism

• Rounded corners

• Elegant typography

• Premium shadows

• Smooth spacing

• Clean layouts

• Subtle Islamic geometric accents only (avoid an overly traditional appearance)

Every page should feel clean, premium, and highly polished.

---

# Premium Animations

Create premium animations throughout the application.

Include:

• Cinematic splash screen

• Animated logo reveal

• Floating particles

• Animated gradients

• Smooth page transitions

• Shared element transitions

• Ripple effects

• Hover animations

• Card lift effects

• Skeleton loading

• Animated progress bars

• XP gain animations

• Achievement celebrations

• Confetti

• Smooth bottom navigation

• Premium micro-interactions

Animations should be elegant, smooth, and never distracting.

---

# Home Experience

Design an engaging Home screen including:

• Personalized greeting

• Animated avatar

• Scholar Rank

• XP

• Coins

• Daily Streak

• Continue Learning

• Daily Mission

• Learning Paths

• Featured Content

• Recent Reading

• Friend Activity

• Search Bar

• Quick Actions

The Home page should immediately motivate users to continue learning.

---

# Avatar System

Create a premium avatar creator similar in quality to Snapchat Bitmoji.

Users can customize:

• Hairstyles

• Hair Colors

• Beards

• Eyebrows

• Clothing

• Robes

• Jackets

• Hoodies

• Hijabs

• Turbans

• Caps

• Military-inspired uniforms (respectful and non-political)

• Military caps

• Backgrounds

• Frames

• Name badges

• Scholar Titles

• Color Themes

• Decorative accessories

Avatar Animations:

• Blink

• Breathing

• Idle floating

• Wave on login

• Celebration after lesson completion

• Level-up reaction

• Unlock animation

Unlock cosmetics through:

• XP

• Levels

• Books completed

• Speeches read

• Learning Paths

• Quiz completion

• Daily streaks

• Achievements

• Community participation

Some cosmetics should be free while premium cosmetics are earned only through real progress.

---

# Gamification

Create a meaningful progression system.

Include:

• XP

• Coins

• Levels

• Scholar Ranks

• Daily Missions

• Weekly Missions

• Daily Rewards

• Achievements

• Badges

• Learning Streaks

• Reward Chests

• Leaderboards

• Unlock Effects

• Celebration Animations

• Progress Bars

The application should encourage users to return every day.

---

# Learning Experience

Instead of presenting only documents, organize knowledge into beautiful Learning Paths.

Each path contains:

• Lessons

• Books

• Speeches

• Reflections

• Quizzes

• Rewards

• Progress Tracking

Learning should feel like progressing through a game.

---

# Knowledge Library

Initially support Ayatollah Sayyid Ali Khamenei.

Design the architecture to support unlimited scholars in the future.

Each scholar has completely separate:

• Books

• Speeches

• Articles

• Letters

• Interviews

• Statements

• Categories

• Topics

• Timeline

• Images

Provide powerful search, filtering, and browsing.

---

# AI Knowledge Assistant

Users ask questions naturally.

The AI must:

• Search only uploaded and indexed documents.

• Never answer from general model knowledge.

• Never invent quotations.

• Retrieve relevant passages.

• Generate simple explanations only from retrieved content.

• Always display citations and source references.

If no information exists, display:

"No relevant information was found in the uploaded knowledge base."

The architecture should be ready for future Retrieval-Augmented Generation (RAG).

---

# Authentication

Support:

• Google Login

• Email Login

• Guest Mode

• Forgot Password

• Persistent Login

• Secure Logout

Users may only create normal user accounts.

---

# Enterprise Admin Dashboard

Create a completely separate, premium Admin Dashboard.

The dashboard must match the quality of modern platforms such as Stripe, Notion, Vercel Dashboard, and Linear.

## Security

• There must NEVER be a public Admin Sign Up page.

• There must NEVER be a public Admin Login button.

• Users can ONLY register as normal users.

• Administrator accounts are created manually by the developer.

• Store user roles in the database.

• Only users with the "admin" role may access the Admin Dashboard.

• Every admin page and protected route must verify permissions.

• Redirect unauthorized users to a professional "403 Access Denied" page.

• Admin navigation must never appear for normal users.

---

# Admin Features

Dashboard

• Overview

• Analytics

• Charts

• Reading Statistics

• Active Users

• Search Statistics

• Popular Topics

• Daily Activity

Scholar Management

• Create unlimited scholars

• Biography

• Timeline

• Cover Images

• Categories

• Topics

Knowledge Management

• Books

• Speeches

• Articles

• Interviews

• Letters

• Statements

• Religious Q&A

Document Upload

Support:

• PDF

• DOCX

• TXT

• Markdown

Each document includes:

• Title

• Scholar

• Category

• Topic

• Summary

• Full Text

• Source

• Language

• Publication Date

• Tags

• Cover Image

• Banner Image

• Draft / Published Status

Support drag-and-drop uploads.

Automatically index newly published documents.

---

Quiz Builder

Allow administrators to:

• Create quizzes manually

• Generate quizzes from uploaded documents

• Edit

• Delete

• Organize by scholar and topic

Support:

• MCQ

• True/False

• Fill in the blanks

• Short Answer

---

Learning Path Builder

Allow administrators to visually create learning paths with:

• Lessons

• Books

• Speeches

• Reflections

• Quizzes

• Rewards

Support drag-and-drop ordering.

---

Avatar Management

Allow administrators to upload:

• Hairstyles

• Clothing

• Robes

• Uniforms

• Hijabs

• Turbans

• Caps

• Military-inspired uniforms

• Backgrounds

• Frames

• Badges

• Nameplates

• Scholar Titles

Allow unlock conditions based on:

• XP

• Level

• Achievements

• Streaks

• Quiz completion

• Learning Path completion

---

Reward Management

Manage:

• XP

• Coins

• Badges

• Achievements

• Daily Missions

• Weekly Missions

• Seasonal Events

• Reward Chests

---

User Management

• View Users

• Search Users

• Suspend Users

• Delete Users

• Reset Progress

• View Learning History

• View Achievements

---

Community Management

• Friend Requests

• Chat Moderation

• Reports

• Debate Rooms

---

Homepage Manager

Allow administrators to update without coding:

• Hero Banner

• Featured Books

• Featured Speeches

• Daily Missions

• Announcements

• Promotional Cards

---

Settings

Manage:

• Branding

• Logo

• Theme Colors

• AI Settings

• Search Settings

• Maintenance Mode

• Backup & Restore

---

Performance

The application must be:

• Mobile-first

• Responsive

• Fast

• Accessible

• Production-ready

Use reusable components, clean architecture, scalable folder structure, and modern best practices.

---

Branding

Application Name:

Nahj AI

Tagline:

"Learn from Authentic Sources. Grow Through Knowledge."

Design a premium logo using elegant typography and abstract geometric inspiration.

Do not use portraits or political imagery.

---

Disclaimer

Display throughout the application:

"AI-generated explanations summarize uploaded source material and are not direct quotations. Always consult the cited source for complete context."

Require users to accept this disclaimer on first launch.

---

Final Goal

Create a world-class educational platform with premium UI, addictive gamification, a living avatar system, guided learning, AI-powered knowledge search based only on uploaded documents, a secure enterprise-grade Admin Dashboard, and a scalable architecture ready for future expansion.

IMPORTANT:

• Build real functionality instead of placeholder pages whenever possible.

• Use Supabase for authentication, database, storage, and role-based permissions.

• Keep the code clean, modular, reusable, and maintainable.

• Design the project so future features can be added without major refactoring.

• If the project cannot be completed in one generation, prioritize building a complete, working foundation over unfinished placeholders.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://faith-learner-hub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b726b56c-8e48-41b4-b34c-4712069b8c57).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
