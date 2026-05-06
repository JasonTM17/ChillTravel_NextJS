# VIETWANDER AI Agent Rules

- Use the Design DNA in docs/stitch-prompts.md and .stitch/DESIGN.md for all UI work.
- Never implement real payment processing. All payment code must be local, mock, or sandbox only.
- The chatbot runtime must not require an OpenAI API key. Use the local AI service provider interfaces.
- Prefer shared types from packages/shared.
- Run scoped lint, test, and build before commits.
- Do not commit secrets, generated build output, node_modules, or real card data.
