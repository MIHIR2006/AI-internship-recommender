# PowerShell script to set up Hugging Face authentication
# Run this script to configure Git authentication for Hugging Face

Write-Host "Setting up Hugging Face Git Authentication..." -ForegroundColor Green

# Check if Git is installed
try {
    git --version | Out-Null
    Write-Host "✓ Git is installed" -ForegroundColor Green
} catch {
    Write-Host "✗ Git is not installed. Please install Git first." -ForegroundColor Red
    exit 1
}

# Get Hugging Face token from user
$hfToken = Read-Host "Enter your Hugging Face User Access Token"

if ([string]::IsNullOrEmpty($hfToken)) {
    Write-Host "✗ No token provided. Exiting." -ForegroundColor Red
    exit 1
}

# Configure Git credential helper
Write-Host "Configuring Git credential helper..." -ForegroundColor Yellow
git config --global credential.helper store

# Update remote URL with token
Write-Host "Updating remote URL with authentication..." -ForegroundColor Yellow
git remote set-url origin "https://VibeCoder007:$hfToken@huggingface.co/spaces/VibeCoder007/Al-internship-recommender"

# Test connection
Write-Host "Testing connection to Hugging Face..." -ForegroundColor Yellow
try {
    git ls-remote origin | Out-Null
    Write-Host "✓ Successfully connected to Hugging Face!" -ForegroundColor Green
} catch {
    Write-Host "✗ Connection failed. Please check your token and try again." -ForegroundColor Red
    exit 1
}

Write-Host "`nAuthentication setup complete!" -ForegroundColor Green
Write-Host "You can now push to Hugging Face Spaces with: git push -u origin master" -ForegroundColor Cyan
