/* 
**************************************************************************
Filename: server.js
By. James Halladay, Alex, Glenn
Project: Project 3
Login: jehalladay, ... , ...
Assignment No: 3
File Description:

This file runs a node static server that will be used to test out the 
    webpages being developed

to run go to this directory from a terminal that has node installed 
    and run: node server.js <IP address>
    
    The server will broadcast to whatever IP address is provided or it
        will default to 127.0.0.1.
    
    This allows you to broadcast the server accross a network as long as 
        you provide it with the IPv4 address provided by ipconfig.

To access the website from another computer just type in a browser 
    <ip address>:1414/ 
    
    any file name placed after the / will load that file in the browser

    
Date: 3/17/2020

**************************************************************************
Steps:

Step 1: Declare Constants and Require External Resources
Step 2: Create getContentType Function that Returns the Requested MimeType for the browser
Step 3: Create sendFile Function that Delivers Requested files to the Response stream
Step 4: Create serverController Function to initialize the server and run the request loop
Step 5: Create launch IIFE Function that Starts the server upon Instantiation


**************************************************************************

I declare that all material in this assessment task is my work
except where there is clear acknowledgement                   
or reference to the work of others. I further declare that I  
have complied and agreed to the CMU Academic Integrity Policy 
at the University website.                                    

Author's Name: James Halladay       UID(700#): 700425363   
Author's Name:                      UID(700#):    
Author's Name:                      UID(700#):    

Date: 3/17/2020                                              

Date Last Modified: 3/17/2020                                
**************************************************************************
*/


'use strict'


// Step 1: Declare Constants and Require External Resources

const port  = "1414", landing = 'index.html';
const path  = require('path');
const http  = require('http');
const fs    = require('fs');


// Step 2: Create getContentType Function that Returns the Requested MimeType for the browser

/**
 * getContentType :: str -> str
 * 
 * Function returns the content type that matches the resource being
 *  requested by the server controller 
 */
function getContentType(url){
    
    const mimeTypes = {
        '.html'	: 'text/html'				,	'.js'	: 'text/javascript'				 	,
        '.css'	: 'text/css'				,	'.json'	: 'application/json'			 	,
        '.png'	: 'image/png'				,	'.jpg'	: 'image/jpg'					 	,
        '.gif'	: 'image/gif'				,	'.svg'	: 'image/svg+xml'				 	,
        '.wav'	: 'audio/wav'				,	'.mp4'	: 'video/mp4'					 	,
        '.woff'	: 'application/font-woff'	,	'.ttf'	: 'application/font-ttf'		 	,
        '.otf'	: 'application/font-otf'	,	'.eot'	: 'application/vnd.ms-fontobject'	,
        '.wasm'	: 'application/wasm'		
    };
    
    // If requested url extension is a mime type, the dict object will return that url's value, 
    //      otherwise octet-stream will be returned instead
    return mimeTypes[path.extname(url).toLowerCase()] || 'application/octet-stream';
}


// Step 3: Create sendFile Function that Delivers Requested files to the Response stream

/**
 * sendFile :: (str, str, str, stream) -> void
 * 
 * function delivers any requested resources to the stream
 */
function sendFile(file, url, contentType, response){
    fs.readFile(file, (error, content) => {
        if(error) {
            response.writeHead(404)
                    .write(`404 Error: '${url}' Was Not Found!`);
			
            response.end();
            // include file path for easy debugging, tabs added to make distinct
			console.log(`\tResponse: 404 Error, '${file}' Was Not Found!`);
		} else {
            response.writeHead(200, {'Content-Type': contentType})
                    .write(content);
            
			response.end();
			console.log(`\tResponse: 200, ${url} Served`);
		};
	});
};


// Step 4: Create serverController Function to initialize the server and run the request loop

/**
 * serverController :: str -> void
 * 
 * Function creates a server and accesses sendFile and getContentType to serve 
 *  requested resources 
 */
function serverController(hostname) {
    const server = http.createServer((request, response) => {
        
        // Creates space around .html requests so that they stand out more in the console
        if (path.extname(request.url) == '.html' || request.url == '/') {
            console.log(`\nPage Requested: ${request.url}\n`);
        } else {
            console.log(`Request came: ${request.url}`);
        }
        
        // Sends the requested resources to the response stream
        if (request.url == '/') {
            var file = path.join(__dirname, landing);       // delivers index.html by default
            sendFile(file, landing, 'text/html', response);
        } else {
            var file = path.join(__dirname, request.url);   // delivers requested resource
            sendFile(file, request.url, getContentType(request.url), response);
        };
    });
    
    // Gives server a port to listen to and gives an IP address to find it
    server.listen(port, hostname, () => {
        console.log(`Server running at ${hostname}:${port}\n`);
    });
}


// Step 5: Create launch IIFE Function that Starts the server upon Instantiation

/**
 * launch :: void -> void
 * 
 * function self initialized upon start and launches the server
 *  while providing the second console argument as an IP address 
 *  for the server to use
 * 
 * If no IP address is provided in the console, 
 *  the server defaults to 127.0.0.1
 */
(function launch() {
    if (require.main == module) {
        if (process.argv.length > 2) {
            var hostname = process.argv[2];
		} else {
			var hostname = "127.0.0.1";
		};
		serverController(hostname);
    };
})();