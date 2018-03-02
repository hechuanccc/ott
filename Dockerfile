# Take note that the image itself is already logged-in in the cloud CLI
FROM unnotechlottery/otter:latest as otter

FROM node:6.13.0

WORKDIR /usr/src/app

# using multiple copies to continously keep the environment and avoid the maximum image layer error
COPY --from=otter /root /root
COPY --from=otter /usr/src/app/. .

# To include everything
COPY . .

ARG AZURE_STORAGE_ACCOUNT
ARG AZURE_STORAGE_ACCESS_KEY
ARG ENV_CONTAINER
ARG CDN_PROFILE
ARG CDN_ENDPOINT
ARG HOST
ARG MAX_AGE
ARG staticHOST

# Cannot be made into one line as it has a possibility that it will return a 'text file busy' making the shell script unexecutable
RUN chmod u+x cloud_deploy.sh
RUN ./cloud_deploy.sh

EXPOSE 8080
CMD npm run dev