# newPKI

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



## Future improvements

    Archiving the already deployed files
    Managing the archived files
    Buttons for downloading locally logs
    Rollback procedure