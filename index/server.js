/* 
**************************************************************************
Filename: server.js
By. James Halladay, Alex, Glenn
Project: Project 3
Login: jehalladay, ... , ...
Assignment No: 3
File Description:

This file runs a node static server that will be used to test out the webpages being developed

to run go to this directory from a terminal that has node install and run: node server.js <IP address>
    The server will broadcast to whatever IP address is provided or it will default to 127.0.0.1.
    This allows you to broadcast the server accross a network as long as you provide it with the    
        IPv4 address provided by ipconfig.

Date: 3/17/2020

**************************************************************************


I declare that all material in this assessment task is my work
except where there is clear acknowledgement                   
or reference to the work of others. I further declare that I  
have complied and agreed to the CMU Academic Integrity Policy 
at the University website.                                    
                                                    
Author's Name: James Halladay       UID(700#): 700425363   
Author's Name:                      UID(700#):    
Author's Name:                      UID(700#):    

Date:                                               
                                                    
Date Last Modified:                                
**************************************************************************
*/


const port  = "1414", landing = 'index.html';
const path  = require('path');
const http  = require('http');
const fs    = require('fs');


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

    return mimeTypes[path.extname(url).toLowerCase()] || 'application/octet-stream';
}


function serverController(hostname) {
    const server = http.createServer(serverProcessor);

    server.listen(port, hostname, () => {
        console.log(`Server running at ${hostname}:${port}`);
        console.log('Node.JS static file server is listening');
    });
}


function serverProcessor(request, response){
	console.log(`Request came: ${request.url}`);
	if(request.url === '/') {
		sendFile(landing, 'text/html', response);
	} else {
		sendFile(request.url, getContentType(request.url), response);
	};
};

function sendFile(url, contentType, response){
	let file = path.join(__dirname, url);
	
	fs.readFile(file, (error, content) => {
		if(error) {
			response.writeHead(404)
					.write(`File '${file}' Not Found!`);
			
			response.end();
			console.log(`Response: 404 ${file}, err`);
		} else {
			response.writeHead(200, {'Content-Type': contentType})
					.write(content);
					
			response.end();
			console.log(`Response: 200 ${file}`);
		};
	});
};


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