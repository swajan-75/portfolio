#!/bin/bash

# Create the directory if it doesn't exist
mkdir -p public/projects

# Array of URLs and their new local names
# Format: "URL|filename.jpg"
images=(
  "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=1470&auto=format&fit=crop|arkplay.jpg"
  "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=1470&auto=format&fit=crop|bkash.jpg"
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1470&auto=format&fit=crop|student_assistant.jpg"
  "https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1374&auto=format&fit=crop|codeforces.jpg"
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1470&auto=format&fit=crop|aiub_api.jpg"
  "https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=1470&auto=format&fit=crop|rangeer.jpg"
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1470&auto=format&fit=crop|scheduler.jpg"
  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1365&auto=format&fit=crop|captcha.jpg"
)

echo "🚀 Starting image download..."

for item in "${images[@]}"; do
  url="${item%%|*}"
  filename="${item##*|}"
  
  echo "Downloading $filename..."
  curl -L "$url" -o "public/projects/$filename"
done

echo "✅ All images downloaded to public/projects/"