#!/bin/bash
if [- n "$APP_ENVIRONMENT"]; then
    echo $APP_ENVIRONMENT
    if [ "$APP_ENVIRONMENT" = "dev"]; then
        yarn dev ; 
    else 
        yarn start ; 
    fi
fi