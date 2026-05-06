pnpm lint
pnpm test
pnpm build
python -m unittest discover apps/ai-service/tests
docker compose -f infra/docker/docker-compose.yml config --quiet
