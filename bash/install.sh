#!/bin/bash

# Function to validate email
validate_email() {
    local regex="^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$"
    [[ $1 =~ $regex ]]
}

# Ask for user's email
read -p "Email to register with Cryptfire: " email

# Request API Key with Email
if validate_email "$email"; then
    echo "Transmitting Email..."
    # Fetch and print the API key
    curl -X POST \
       -H "Content-Type: application/json" \
      -d "{'email': '$email'}" \
      https://install.cryptfire.io/keygen
else
    echo "Invalid email address."
fi

# Validate the Email address
echo "Validating Email..."
read -p "Code: " code
# Fetch and print the API key
curl -X GET https://install.cryptfire.io/keygen/validate/$email/$code;
