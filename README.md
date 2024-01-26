# PhotoSafe

Cloud storage for images

Built with Next.js, Amazon Web Services (S3), Supabase

### Environment Variables

.env.local

```
# ----- Supabase -----
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SERVICE_ROLE=
NEXT_PUBLIC_GUEST_EMAIL=
GUEST_PASSWORD=

# ----- S3 -----
BUCKET_NAME=
BUCKET_REGION=

# ----- Auto-detected by AWS SDK -----
# Key belongs to IAM user. secret key is available once on access key generation
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

### Local Development

```
npm install
npm run dev
```
