# AI Summarizer

A microservice application for automatic PDF document summarization using artificial intelligence (OpenAI).

## 📋 Project Overview

AI Summarizer is a full-featured web application that allows users to upload PDF files and receive automatic summaries generated using the OpenAI API.

### Architecture

The project consists of three main components:

| Component                | Technologies                      | Port | Description                                                     |
| ------------------------ | --------------------------------- | ---- | --------------------------------------------------------------- |
| **ai-summarizer-api**    | NestJS, MongoDB, Redis, BullMQ    | 3000 | REST API for file uploads and summary retrieval                 |
| **ai-summarize-service** | NestJS, BullMQ, OpenAI            | -    | Worker services for async PDF processing and summary generation |
| **ai-summarizer-client** | Next.js 16, React 19, TailwindCSS | 3001 | Web interface for API interaction                               |

### System Architecture

```
┌─────────────────┐     ┌───────────────────┐     ┌─────────────────┐
│   Client        │────▶│   API Server      │────▶│   Redis Queue   │
│   (Next.js)     │◀────│   (NestJS)        │     │   (BullMQ)      │
└─────────────────┘     └───────────────────┘     └────────┬────────┘
                               │                           │
                               │                           ▼
                               │                  ┌─────────────────┐
                               │                  │  Worker Services │
                               ▼                  │  (1-5 instances) │
                        ┌─────────────┐           └────────┬────────┘
                        │   MongoDB   │◀───────────────────┘
                        └─────────────┘                    │
                                                           ▼
                                                  ┌─────────────────┐
                                                  │   OpenAI API    │
                                                  └─────────────────┘
```

### Scalability & Bottlenecks

The main bottleneck in this system is the **summary generation via OpenAI API**, which can be slow and rate-limited. To address this:

- **Dedicated Worker Service**: The summarization logic is extracted into a separate `ai-summarize-service` that can be scaled independently from the API server
- **Multiple Instances**: The Docker Compose configuration runs 5 worker instances by default, allowing parallel processing of multiple documents
- **Queue-Based Processing**: BullMQ ensures reliable job distribution across workers and prevents overloading the OpenAI API

### Potential Improvements

- **Retry Mechanism**: Implement automatic retry logic with exponential backoff for failed OpenAI API calls to handle transient errors and rate limits gracefully

### Getting Started

1. **Create a `.env` file in the root directory:**

2. **Edit `.env` and add your OpenAI API key:**

   ```env
   OPENAI_API_KEY=sk-your-openai-api-key-here
   ```

3. **Start all services:**

   ```bash
   docker compose up -d --build
   ```

4. **Open the application:**
   - Web interface: http://localhost:3001

### Stopping Services

```bash
docker compose down
```
