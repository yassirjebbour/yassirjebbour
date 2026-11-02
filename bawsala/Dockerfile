# BAWSALA — production image (Next.js standalone server + in-process embeddings).
# Build: docker build -t bawsala .   Run: docker run --env-file .env -p 3000:3000 bawsala
FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS build
WORKDIR /app
COPY . .
# Model weights are downloaded and checksum-verified, never committed.
RUN npm run models:fetch
RUN npm run build

FROM node:22-bookworm-slim AS run
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0 EMBEDDINGS_MODEL_DIR=/app/models/multilingual-e5-small
RUN useradd --system --uid 1001 bawsala
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
COPY --from=build /app/models ./models
# Migrations, seed and knowledge-base ingestion run as a release step (see DEPLOYMENT.md).
COPY --from=build /app/db ./db
COPY --from=build /app/kb ./kb
COPY --from=build /app/scripts ./scripts
COPY --from=build /app/src ./src
COPY --from=deps /app/node_modules ./node_modules
USER bawsala
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server.js"]
