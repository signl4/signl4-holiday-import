
# SIGNL4 Holiday Import from iCal Files

SIGNL4 offers powerful duty scheduling and time-based overrides for routing alerts to the right people at the right time.

With time-based overrides you can specify dedicated alerting profiles for business hours, weekends, holidays, etc. You can add and edit holidays manually or you can import them from iCal files. For the latter we provide a sample script here.

![signl4-holidays](signl4-holidays.png)

## Usage and Sample Code

Attention: This code is intended as a sample and only lightly tested with no guarantee. Please use with care.

Attention 2: Existing holidays will be overridden.

We provide a sample Node.js script for importing holidays from a .ics file. The sample file uses the SIGNL4 REST API as documented here:
[https://connect.signl4.com/api/docs/index.html](https://connect.signl4.com/api/docs/index.html)

You can find the import script as well as additional information on [GitHub](https://github.com/signl4/signl4-holiday-import).

As a prerequisite you first need to install Node.js as described [here](https://nodejs.org/en/download/).

The sample code is provided in the file 'holiday-import.js'. You can execute the wile with the node command. The file takes the path to the .ics file as an argument.

Command line sample:

```
    node holiday-import.js C:\holidays.ics
```

This will import the holidays from the specified file.

You can also clear all holidays from the current and from the following year by using the following call:

```
    node holiday-import.js CLEAR
```

Within the source file you need to adapt the SIGNL4 API key and the team name:

```
const strAPIKey = 'YOUR-SIGNL4-API-KEY';
const strTeamName = 'Super SIGNL4';
```

You can create the API key in your SIGNL4 web portal under Teams -> Developer.

The command line execution returns result information about success or failure from the API call.

## iCal File

The iCal (.ics) file contains the holidays to be imported. You can find those files containing your local holidays in the Internet.

You can adapt the script according to your needs.
