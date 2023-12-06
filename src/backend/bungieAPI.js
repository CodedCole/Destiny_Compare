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
        var crossSaveAccount;
        // find destiny membership used for cross save, which is the player's primary account
        for (var dm = 0; dm < result.destinyMemberships.length; dm++) {
            if (result.destinyMemberships[dm].crossSaveOverride === result.destinyMemberships[dm].membershipType) {
                crossSaveAccount = result.destinyMemberships[dm].membershipId;
            }
        }

        simplified.searchResults[i] = {
            "BungieDisplayName": result.bungieGlobalDisplayName + "#" + result.bungieGlobalDisplayNameCode,
            "BungieNetMembershipID": result.bungieNetMembershipId,
            "PrimaryDestinyMembershipID": crossSaveAccount
        };
    }

    return simplified;
}

export async function GetProfileFromDestinyMembershipID(membershipID) {
}