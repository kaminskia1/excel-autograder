# Process

set up dev environment
- docker containers
- distinguishing between dev and prod
  - differentiating between dev and prod in docker container build
  - startup script

scrapped node

set up dev environment with django
- setup = smooth af

structure
- app
  - django
  - git
  - docker
  - postgres

setup trello board for tracking. Created initial cards for our perceived tasks.
https://trello.com/b/oacnv6Wr/excel-autograder

brainstorming
- more advanced 'questions'
  - require function instead of hardcoded param
    - recursive graph traversal
  - how to handle cell overflow?
  - validating that work is present?
    - wrap ml model to 'evaluate' correctness
- show / evaluate file metadata
  - catch cheating

moved django to a sub-folder and set up an angular container

https://www.django-rest-framework.org/
https://mattermost.com/blog/user-authentication-with-the-django-rest-framework-and-angular/

built out user authentication and assignment models in django
  - set up api endpoints for them to use


set up angular app, default views
- login, table, and wizard view

build out angular layer for interacting with api

fixed cors issues so that frontend could communicate with backend

built out authentication

built out assignment dashboard
- fetched assignments from backend


began work on assignment wizard
- got exceljs working
  - added in node types
- read in assignment + attached file from backend

rendered sheets on wizard 
- added ability to add rows/columns

added support for multi-legged questions via question service
- added cell-picking functionality