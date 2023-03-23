#!/bin/bash

# Sometimes I accidentally compile my build into the /src directory and not my /build directory
# This litters the /src directory with JS files that I don't want to delete manually.

# Navigate to the src directory
cd ../src

# Find all the JavaScript files and delete them
find . -name "*.js" -type f -delete

# Confirm that all JavaScript files have been deleted
if [ ! "$(find . -name "*.js" -type f)" ]; then
  echo "All nested JavaScript files have been deleted."
else
  echo "There was an error deleting the JavaScript files."
fi
