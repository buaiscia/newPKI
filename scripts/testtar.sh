#!/bin/bash

ssh appsupp@mob06-us32c9.us.infra 'cd /home/appsupp/test/ && sudo tar --totals -czf - *' > test.tar.gz
