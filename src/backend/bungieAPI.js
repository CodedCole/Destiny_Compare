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
        });
    return response.json();
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

    if (response.ErrorStatus !== "Success")
    {
        console.error(response);
        return null;
    }

    var simplified = {

    };

    return response;
}