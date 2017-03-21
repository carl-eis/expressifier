# Expressifier

API in a box!

### Preamble

I created expressifier as an easy-to-use, simple template for a REST API using express.js.

Use this as a framework to build your own API.

#### Notes: 
- This app has been designed to respond easiest to queries from Ember.js,
but can be configured to work with any front-end framework or system.

- All HTTP requests are in the `./components/REST/*` folder.

- You will have to  `require()` new requests you create into the`./components/REST/driver.js` as imports.

-----

# Getting Started

### 1. Clone and install dependencies

    $ git clone https://github.com/carl-eis/expressifier/
    $ cd expressifier
    $ npm install -g yarn
    $ yarn
    
### 2. Configure settings

Open up `settings.json` - you will find a few configurable options in there.

- `SERVER_PORT` - The IP port the server will bind to
- `CREATE_DIRECTORIES` - Boolean, if false, will not try to create a list of directories in the root folder.
- `DIRECTORIES` - An array of directories the server will create when run
    
### 3. Run!

    $ node index

