# Release Checklist

- pnpm lint
- pnpm test
- pnpm build
- python -m unittest discover apps/ai-service/tests
- docker compose -f infra/docker/docker-compose.yml config
- Flutter analyze/test after Flutter SDK installation
- Browser visual/E2E pass for landing, explore filter, destination detail CTA, booking QR preview, admin, and AI knowledge
- Confirm payment remains mock-only
- Confirm README limitations mention local/sample travel data and no real-time visa/weather/flight data
