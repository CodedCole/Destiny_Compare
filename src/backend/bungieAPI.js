export async function SearchForPlayerByBungieID(displayName) {
    const response = await fetch(
        "https://www.bungie.net/Platform/User/Search/GlobalName/0/", 
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
        body: {
            "displayNamePrefix": displayName
        }
    });
    return response.json();
}