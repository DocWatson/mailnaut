MailNaut
========

MailNaut is a NodeJS app that will allow you to parse emails and prepare them for dissemination. **This project is under heavy development and is missing a lot of core functionality.**

Installation
========
MailNaut requires that you have NodeJS, NPM, and Bower installed. You can easily install NodeJS and NPM using the official installers [here](http://nodejs.org/download/). After that, you can install bower using npm via:

`npm install bower -g`

That done, clone the MailNaut repo and install its dependencies using:

```
npm install
bower install
```

### Configuration

In `/app/config.js` you will be able to configure a directory for file outputs. By default, MailNaut will create an `/app/output` directory to use for HTML/Plaintext/Zip file generation. 

### Launching

Start MailNaut using the command:

`node server.js`

And access the app in your browser by visiting [http://localhost:8080](http://localhost:8080)

### Dependencies
MailNaut has several dependencies.

#### Node Modules
* **Cheerio:** jQuery-style DOM traversal API
* **Connect-Multiparty:** Express helper to allow multipart enctypes
* **Express:** Routing framework
* **HTML-to-text:** Easy HTML to text conversion
* **Jade:** Templating engine
* **mime:** Get mime types (useful for properly setting headers for zip downloads)
* **mkdirp** Allow directory creation
* **Zip-stream:** Zipping up files after they've been processed (not to be confused with the defunct zipstream module)

#### Frontend Packages
* **jQuery (2.1.0)**  

Current Features
==========

## Plaintext Generation
Upload an HTML file and MailNaut will convert it to a plaintext version for you

## UTM Variables Insertion
When sending email campaigns, adding UTM variables to your links allows Google Analytics to track the campaigns performance. MailNaut has a tool that will parse your email files and insert proper UTM variables for each of your links.

## Email Review
MailNaut will parse your emails and give you some information about them. It will show you if you have broken hyperlinks and which text they relate to. **Coming soon:** MailNaut will review your template to make sure it meets some email best practices.
