#!/bin/bash

# Function to validate email
validate_email() {
    local regex="^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$"
    [[ $1 =~ $regex ]]
}

# Ask for user's email
read -p "Email to register with Cryptfire: " email

# Validate the email
if validate_email "$email"; then
    echo "Fetching API key..."
    # Fetch and print the API key
    curl -s "https://install.cryptfire.io/key/$email"
else
    echo "Invalid email address."
fi
