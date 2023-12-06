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
        {
            "displayNamePrefix": `${displayName}`
        }
    );
    return response;
}

export async function GetProfileFromBungieMembershipID(membershipID) {

}