﻿# adventure-buddy

# Project Setup Guide

## Prerequisites
1. Install [Node.js](https://nodejs.org/) (version 18 or higher)
2. Install [Git](https://git-scm.com/downloads) for Windows
3. A code editor like [Visual Studio Code](https://code.visualstudio.com/)

## Setup Steps

### 1. Clone the Repository
```sh
# Open Command Prompt or PowerShell and run:
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Database Connection
This project uses Supabase as the database. To connect to the database:

1. Click the green "Supabase" button in the top right corner of your adventure-buddy-generator-main
2. Follow the connection steps to create or connect to a Supabase project
3. Once connected, your database tables will be automatically created

### 4. Start Development Server
```sh
npm run dev
```
Your app will be running at `http://localhost:8080`

## Demo Mode Active

- Regular User: user@example.com / password

- Admin User: admin@example.com / password


## Project Structure
- `/src` - Source code
  - `/components` - React components
  - `/pages` - Page components
  - `/lib` - Utilities and configurations
  - `/hooks` - Custom React hooks

## Technologies Used
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Database & Authentication)

# Database

Uses PostgreSQL database through Supabase
Contains three main tables: a. adventures: Stores adventure details b. users: Stores user profile information c. user_adventures: Manages user-adventure relation
