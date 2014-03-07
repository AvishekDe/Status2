status2
=======
The new statusboard for sdslabs that monitors our apps. This will be hosted on
an external server so that it doesn't go down along with any of our infrastructure.
Made with love using nodejs at @SDSLabs.

#Features
- Simple up/down statusboard (via both html and json)
- EMail+Chat ping when something goes down
- Simple configuration file to add/remove endpoints
- Support for non-http requests (like dc and live)

#Licence
Statusboard is completely independent application developed by [SDSLabs][sdslabs]
and is open-sourced under the liberal MIT Licence.

#Setup Instructions
- Copy config.sample.ini to config.ini (and edit accordingly)
- Run node cron.js every n minutes according to your needs
- You will need node.js v0.10.\* installed. (preferably via nvm on linux)
- Run node app.js to power up the web server.

[sdslabs]: https://sdslabs.co/
