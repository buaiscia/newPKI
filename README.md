# NewPKI deployment tool

 Created in 2018, this application is setup on the needs from my job to do an automatic deployment. Its functionalities:

    Upload the application package to install from a third party;
    Deploy it on the first server of the cluster:
        Create backup
        Call a bash script with selected parameters from FE to deploy the package
        Restart the service/s on the Apache server
    Display the deployment log on the main page with INFO/WARNING/ERROR tags
    Call another bash script to make a mockup sync on the second server of the cluster
    Call a bash script with given FE parameters to sync all the cluster and restart the needed services


The application relies on EJS for frontend and NodeJS / Express for backend. It is deployed on some automation server and talk to the application server through ssh. 

## Structure

The App.js sets up modules and create the server and the routing.

The Frontend is in the View directory:
    <ul>
        <li>partials: include header and footer</li>
        <li>landing: the main frontend page</li>
        <li>deploy and upload.js : testing pages for checking if routing was working correctly</li>
    </ul>

The Backend is in the Routes directory:
    <ul>
        <li>index.js : backend for GETting the landing page; clears cache and collect logs to be shown</li>
        <li>upload.js : use formidable and fs to upload the package from local to the server</li>
        <li>loaded.js : check and show the files for the deployment parsed by extension, so that no other types of files can be selected by mistake</li>
        <li>deploy.js : use the parameters from the FE page to call the scripts and do the backup/deploy the package + return the logs</li>
        <li>sync.js : use the parameters from the FE page to call the scripts and do the mock and real sync on the cluster + return the logs</li>
        <li>catchlog.js + synclog.js : parse the logs to be shown</li>
    </ul>