#!/bin/bash

# ============================================================
# MopLX Environment Setup Helper Script
# ============================================================
# This script helps you set up your .env.local file
# Run with: bash scripts/setup-env.sh
# ============================================================

set -e  # Exit on error

echo "🚀 MopLX Environment Setup"
echo "=========================="
echo ""

# Check if .env.local already exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
fi

# Copy from example
if [ -f ".env.example" ]; then
    cp .env.example .env.local
    echo "✅ Created .env.local from template"
else
    echo "❌ .env.example not found!"
    exit 1
fi

echo ""
echo "📝 Let's configure your environment variables..."
echo ""

# Function to update env variable
update_env() {
    local key=$1
    local prompt=$2
    local current_value=$3
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Setting: $key"
    echo "$prompt"
    if [ -n "$current_value" ]; then
        echo "Current: $current_value"
    fi
    read -p "Enter value (or press Enter to skip): " value
    
    if [ -n "$value" ]; then
        # Escape special characters for sed
        escaped_value=$(echo "$value" | sed 's/[&/\]/\\&/g')
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s|^${key}=.*|${key}=${escaped_value}|" .env.local
        else
            # Linux
            sed -i "s|^${key}=.*|${key}=${escaped_value}|" .env.local
        fi
        echo "✅ Updated $key"
    else
        echo "⏭️  Skipped $key (you can update it manually later)"
    fi
    echo ""
}

# Supabase Configuration
echo "🗄️  SUPABASE CONFIGURATION"
echo "Get these from: Supabase Dashboard → Project Settings → API"
echo ""

update_env "NEXT_PUBLIC_SUPABASE_URL" \
    "Your Supabase project URL (e.g., https://xxxxx.supabase.co)" \
    "https://your-project.supabase.co"

update_env "NEXT_PUBLIC_SUPABASE_ANON_KEY" \
    "Your Supabase anon/public key (long string)" \
    "your-anon-key-here"

update_env "SUPABASE_SERVICE_ROLE_KEY" \
    "Your Supabase service_role key (click 'Reveal' in dashboard)" \
    "your-service-role-key-here"

# Admin Configuration
echo "👤 ADMIN CONFIGURATION"
echo ""

update_env "NEXT_PUBLIC_ADMIN_EMAIL" \
    "Email address that will have admin access" \
    "your-email@example.com"

update_env "ADMIN_EMAIL" \
    "Same admin email (required for server-side checks)" \
    "your-email@example.com"

# App URL
echo "🌐 APP URL"
echo ""

update_env "NEXT_PUBLIC_APP_URL" \
    "For local dev, use: http://localhost:3000" \
    "http://localhost:3000"

# Optional: Email Service
echo "📧 EMAIL SERVICE (Optional)"
echo "Sign up at https://resend.com if you want email functionality"
echo ""

read -p "Do you want to configure email service now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    update_env "RESEND_API_KEY" \
        "Your Resend API key (starts with 're_')" \
        ""
    
    update_env "EMAIL_FROM" \
        "Sender email address (e.g., MopLX <noreply@yourdomain.com>)" \
        ""
fi

# Optional: API Security
echo "🔐 API SECURITY (Optional but recommended for production)"
echo ""

read -p "Do you want to generate an API secret key? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v openssl &> /dev/null; then
        api_key=$(openssl rand -base64 32)
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s|^# API_SECRET_KEY=.*|API_SECRET_KEY=${api_key}|" .env.local
        else
            sed -i "s|^# API_SECRET_KEY=.*|API_SECRET_KEY=${api_key}|" .env.local
        fi
        echo "✅ Generated and set API_SECRET_KEY"
    else
        echo "⚠️  openssl not found. Generate manually with: openssl rand -base64 32"
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📁 Configuration saved to: .env.local"
echo ""
echo "Next steps:"
echo "1. Review .env.local and update any missing values"
echo "2. Make sure Supabase database schema is applied (see QUICKSTART.md)"
echo "3. Create storage buckets in Supabase (images & videos)"
echo "4. Run: npm install"
echo "5. Run: npm run dev"
echo "6. Access admin at: http://localhost:3000/admin"
echo ""
echo "📚 For detailed setup instructions, see:"
echo "   - QUICKSTART.md (fastest path)"
echo "   - SETUP_GUIDE.md (detailed guide)"
echo "   - DEPLOYMENT.md (production deployment)"
echo ""
echo "🚀 Happy coding!"
