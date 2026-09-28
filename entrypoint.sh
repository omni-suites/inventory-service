#!/bin/sh
set -e
npx prisma migrate deploy
node prisma/seed.cjs
exec npm run start:prod
