// Make a GET request to Bungie.net
async function GETRequest(url) {
    const response = await fetch(
        url, 
        {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "78c131c1852c4ead8fa807307bbae844"
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
        }).then((result) => {
            if (!result.ok) {
                throw new Error("HTTP Error " + result.status);
            }
            return result.json();
        }).catch(() => {
            console.log("failed a fetch");
            return null;
        });
    return response//.json();
}

// Make a POST request to Bungie.net
async function POSTRequest(url, body) {
    const response = await fetch(
        url, 
        {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "78c131c1852c4ead8fa807307bbae844"
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(body)
        });
    return response.json();
}

// Searches Bungie.net for users whose display name is 'displayName'.
// Returns all matches as a json object
export async function SearchForPlayerByBungieID(displayName) {
    const response = await POSTRequest(
        "https://www.bungie.net/Platform/User/Search/GlobalName/0/",
        { "displayNamePrefix": `${displayName}` }
    );

    if (response.ErrorStatus !== "Success") {
        console.error(response);
        return null;
    }

    var simplified = {
        "searchResults": []
    };

    for (var i = 0; i < response.Response.searchResults.length; i++) {
        const result = response.Response.searchResults[i];
        var crossSaveMembershipType;
        var crossSaveMambershipID;
        // find destiny membership used for cross save, which is the player's primary account
        for (var dm = 0; dm < result.destinyMemberships.length; dm++) {
            if (result.destinyMemberships[dm].crossSaveOverride === result.destinyMemberships[dm].membershipType) {
                crossSaveMembershipType = result.destinyMemberships[dm].membershipType;
                crossSaveMambershipID = result.destinyMemberships[dm].membershipId;
            }
        }

        simplified.searchResults[i] = {
            "BungieDisplayName": result.bungieGlobalDisplayName + "#" + result.bungieGlobalDisplayNameCode,
            "BungieNetMembershipID": result.bungieNetMembershipId,
            "PrimaryDestinyMembershipType": crossSaveMembershipType,
            "PrimaryDestinyMembershipID": crossSaveMambershipID
        };
    }

    return simplified;
}

// Gets profile information from a destiny membership ID (characters, reputation, etc.)
export async function GetProfileFromDestinyMembershipID(membershipType, membershipID) {
    const response = await GETRequest(`https://www.bungie.net/Platform/Destiny2/${membershipType}/Profile/${membershipID}/?components=100,200,1100`);

    const manifest = await GETRequest("https://www.bungie.net/Platform/Destiny2/Manifest");
    console.log(manifest);
    const metricURL =`https://www.bungie.net${manifest.Response.jsonWorldComponentContentPaths.en.DestinyMetricDefinition}`;
    console.log(metricURL);
    const metricDefinition = await fetch(metricURL)
        .then((result) => {
            if (!result.ok) {
                throw new Error("HTTP error " + result.status);
            }
            return result.json();
        })
        .catch(() => {
            console.log("Failed a fetch");
            return null;
        });
    console.log(metricDefinition);

    var metricNameToHash = {};

    for (let hash in metricDefinition)
    {
        var propertyName = metricDefinition[`${hash}`].displayProperties.name;
        if (metricDefinition[`${hash}`].displayProperties.description.includes("Gambit"))
            propertyName = "Gambit " + propertyName;
        if (metricDefinition[`${hash}`].displayProperties.description.includes("Crucible"))
            propertyName = "Crucible " + propertyName;
        if (metricDefinition[`${hash}`].displayProperties.description.includes("Trials"))
            propertyName = "Trials " + propertyName;
        if (metricDefinition[`${hash}`].displayProperties.description.includes("week"))
            propertyName += " (Weekly)";
        if (metricDefinition[`${hash}`].displayProperties.description.includes("this Season"))
            propertyName += " (Season)";
        
        if (metricNameToHash.hasOwnProperty(propertyName))
        {
            console.warn(`duplicate names: ${propertyName}\n${hash} - ${metricDefinition[`${hash}`].displayProperties.description}\n\n${metricNameToHash[`${propertyName}`]} - ${metricDefinition[`${metricNameToHash[`${propertyName}`]}`].displayProperties.description}`);
            propertyName += `${metricDefinition[`${hash}`].index}`;
        }
        metricNameToHash[`${propertyName}`] = hash;
    }
    console.log(metricNameToHash);
    if (response.ErrorStatus !== "Success")
    {
        console.error(response);
        return null;
    }

    var simplified = {
        "crucibleKillsOverall": {
            "value": response.Response.metrics.data.metrics[metricNameToHash["Crucible Opponents Defeated"]].objectiveProgress.progress,
            "name": metricDefinition[metricNameToHash["Crucible Opponents Defeated"]].displayProperties.name,
            "description": metricDefinition[metricNameToHash["Crucible Opponents Defeated"]].displayProperties.description
        }
    };
    console.log(response);
    return simplified;
}