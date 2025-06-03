#!/bin/bash
echo 'run after_install.sh: ' >> /home/ec2-user/URL-SHORT/deploy.log

echo 'cd /home/ec2-user/URL-SHORT' >> /home/ec2-user/URL-SHORT/deploy.log
cd /home/ec2-user/URL-SHORT >> /home/ec2-user/URL-SHORT/deploy.log

echo 'npm install' >> /home/ec2-user/URL-SHORT/deploy.log 
npm install >> /home/ec2-user/URL-SHORT/deploy.log
