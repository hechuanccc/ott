#!/bin/bash
set -e  # to stop script when error occurs

# NPM commands and Azure cli scripts to deploy our static VueJS in a CDN

export static_container=static

# Needed to avoid piling up of data in image and Azure file storage
rm -rf dist

npm install
npm run build

# Take note that the format URL for the storage account is {storage-url}/{blob-container} and $root is the only way to avoid the "blob container" format and the other static holders need to be declared as blobs to maintain the folder structure
/root/bin/az storage container create --public-access blob --name $ENV_CONTAINER

# Upload the changes
/root/bin/az storage blob delete-batch --source $ENV_CONTAINER
/root/bin/az storage blob upload-batch --content-cache-control "public, max-age=$MAX_AGE" --destination $ENV_CONTAINER --source dist

cat dist/index.html