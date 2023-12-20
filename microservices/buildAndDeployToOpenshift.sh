#!/bin/bash
# Copyright (c) 2018 IBM Corp.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
FRONTEND_DEPLOYMENT=deploy-ins-front-end.yaml
FRONTEND_ROUTE=ins-front-end-route.yaml
BACKEND_AUTH_DEPLOYMENT=deploy-ins-backend-auth.yaml
BACKEND_AUTH_ROUTE=ins-backend-auth-route.yaml
BACKEND_USER_DEPLOYMENT=deploy-ins-backend-user.yaml
BACKEND_USER_ROUTE=ins-backend-user-route.yaml
BACKEND_POST_DEPLOYMENT=deploy-ins-backend-post.yaml
BACKEND_POST_ROUTE=ins-backend-post-route.yaml
BACKEND_NOTIFICATION_DEPLOYMENT=deploy-ins-backend-notification.yaml
BACKEND_NOTIFICATION_ROUTE=ins-backend-notification-route.yaml
DATABASE_DEPLOYMENT=deploy-ins-db.yaml

DOCKERFILE=Dockerfile
BUILD_TOOL="docker"
EXTERNAL_REGISTRY=$(oc get route default-route -n openshift-image-registry --template='{{ .spec.host }}')
PROJECT_NAME=$(oc project -q)

echo "Trying ${BUILD_TOOL} login -u $(oc whoami) -p $(oc whoami -t) ${EXTERNAL_REGISTRY}"
${BUILD_TOOL} login -u $(oc whoami) -p $(oc whoami -t) ${EXTERNAL_REGISTRY}

if [[ $? -ne 0 ]]
then
  echo "Login Failed" 
  exit
fi

IMAGE_PREFIX_EXTERNAL=${EXTERNAL_REGISTRY}/${PROJECT_NAME}
IMAGE_PREFIX=image-registry.openshift-image-registry.svc:5000/${PROJECT_NAME}
ROUTE_HOST=instagram$(echo $EXTERNAL_REGISTRY | awk '{gsub("default-route-openshift-image-registry","");print $1}')

echo "Image Prefix External=${IMAGE_PREFIX_EXTERNAL}"
echo "Image Prefix Internal=${IMAGE_PREFIX}"
echo "Route Host=${ROUTE_HOST}"

cd instagram
${BUILD_TOOL} buildx build --platform linux/amd64 -t ${IMAGE_PREFIX_EXTERNAL}/ins-frontend:latest --no-cache -f ${DOCKERFILE} .

# cd ../authentication
# ${BUILD_TOOL} buildx build --platform linux/amd64 -t ${IMAGE_PREFIX_EXTERNAL}/backend-auth:latest --no-cache -f ${DOCKERFILE} .

cd ../user
${BUILD_TOOL} buildx build --platform linux/amd64 -t ${IMAGE_PREFIX_EXTERNAL}/backend-user:latest --no-cache -f ${DOCKERFILE} .

cd ../post
${BUILD_TOOL} buildx build --platform linux/amd64 -t ${IMAGE_PREFIX_EXTERNAL}/backend-post:latest --no-cache -f ${DOCKERFILE} .

# cd ../notification
# ${BUILD_TOOL} buildx build --platform linux/amd64 -t ${IMAGE_PREFIX_EXTERNAL}/backend-notification:latest --no-cache -f ${DOCKERFILE} .

# cd ../db
# ${BUILD_TOOL} buildx build --platform linux/amd64 -t ${IMAGE_PREFIX_EXTERNAL}/ins-mongo:latest --no-cache -f ${DOCKERFILE} .

${BUILD_TOOL} push ${IMAGE_PREFIX_EXTERNAL}/ins-frontend:latest
# ${BUILD_TOOL} push ${IMAGE_PREFIX_EXTERNAL}/backend-auth:latest
${BUILD_TOOL} push ${IMAGE_PREFIX_EXTERNAL}/backend-user:latest
${BUILD_TOOL} push ${IMAGE_PREFIX_EXTERNAL}/backend-post:latest
# ${BUILD_TOOL} push ${IMAGE_PREFIX_EXTERNAL}/backend-notification:latest
# ${BUILD_TOOL} push ${IMAGE_PREFIX_EXTERNAL}/ins-mongo:latest

cd ../
oc apply -f ${FRONTEND_DEPLOYMENT}
# oc apply -f ${BACKEND_AUTH_DEPLOYMENT}
oc apply -f ${BACKEND_USER_DEPLOYMENT}
oc apply -f ${BACKEND_POST_DEPLOYMENT}
# oc apply -f ${BACKEND_NOTIFICATION_DEPLOYMENT}
# oc apply -f ${DATABASE_DEPLOYMENT}

oc apply -f ${FRONTEND_ROUTE}
# oc apply -f ${BACKEND_AUTH_ROUTE}
oc apply -f ${BACKEND_USER_ROUTE}
oc apply -f ${BACKEND_POST_ROUTE}
# oc apply -f ${BACKEND_NOTIFICATION_ROUTE}
