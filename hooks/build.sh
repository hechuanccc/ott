#!/usr/bin/env sh
set -e  # to stop script when error occurs

# THIS IS REQUIRED to put environment variables in DockerCloud as stated here https://forums.docker.com/t/docker-cloud-build-environment-variables-not-being-passed-to-the-auto-build/24010

echo "------ HOOK START - BUILD -------"

docker build --build-arg AZURE_STORAGE_ACCOUNT=$AZURE_STORAGE_ACCOUNT \
             --build-arg AZURE_STORAGE_ACCESS_KEY=$AZURE_STORAGE_ACCESS_KEY \
             --build-arg ENV_CONTAINER=$ENV_CONTAINER \
             --build-arg CDN_ENDPOINT=$CDN_ENDPOINT \
             --build-arg CDN_PROFILE=$CDN_PROFILE \
             --build-arg HOST=$HOST \
             --build-arg staticHOST=$staticHOST \
             --build-arg MAX_AGE=$MAX_AGE \
             -t $IMAGE_NAME .

echo "------ HOOK END - BUILD -------"