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

// Retrieve metrics definition from bungie.net
async function GetMetricsDefinition(manifest, language) {
    const metricURL = `https://www.bungie.net${manifest.Response.jsonWorldComponentContentPaths[language].DestinyMetricDefinition}`;
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
    return metricDefinition;
}

// Retrieve the manifest for metrics definitions and return a decoded name to hash object
async function GetMetricsNameToHashTable(metricDefinition) {
    var metricNameToHash = {};

    //decode hashes to meaningful stat names
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
            //console.warn(`duplicate names: ${propertyName}\n${hash} - ${metricDefinition[`${hash}`].displayProperties.description}\n\n${metricNameToHash[`${propertyName}`]} - ${metricDefinition[`${metricNameToHash[`${propertyName}`]}`].displayProperties.description}`);
            propertyName += `${metricDefinition[`${hash}`].index}`;
        }
        metricNameToHash[`${propertyName}`] = hash;
    }
    return metricNameToHash;
}

function CreateStatObject(metricDefinition, metrics, hash) {
    if (!metrics.hasOwnProperty(hash))
        return { "value": null };
    return {
        "value": metrics[hash].objectiveProgress.progress,
        "name": metricDefinition[hash].displayProperties.name,
        "description": metricDefinition[hash].displayProperties.description,
        "lowerIsBetter": metricDefinition[hash].lowerIsBetter,
        "icon": metricDefinition[hash].displayProperties.icon,
    }
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
        console.log(response.Response.searchResults[i]);
        // find destiny membership used for cross save, which is the player's primary account
        for (var dm = 0; dm < result.destinyMemberships.length; dm++) {
            if (result.destinyMemberships[dm].crossSaveOverride === 0 ||  result.destinyMemberships[dm].crossSaveOverride === result.destinyMemberships[dm].membershipType) {
                crossSaveMembershipType = result.destinyMemberships[dm].membershipType;
                crossSaveMambershipID = result.destinyMemberships[dm].membershipId;
                break;
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
    const response = await GETRequest(`https://www.bungie.net/Platform/Destiny2/${membershipType}/Profile/${membershipID}/?components=100,200,900,1100`);
    if (response.ErrorStatus !== "Success")
    {
        console.error(response);
        return null;
    }
    console.log(response);

    const manifest = await GETRequest("https://www.bungie.net/Platform/Destiny2/Manifest");
    const metricDefinition = await GetMetricsDefinition(manifest, "en");
    console.log(metricDefinition);
    const metricNameToHash = await GetMetricsNameToHashTable(metricDefinition);
    console.log(metricNameToHash);

    let playtime = [0, 0, 0];       // titan: 0,    hunter: 1   warlock: 2
    let recentlyPlayedClass = 0;
    let recentlyPlayedDate = undefined;
    for (var character in response.Response.characters.data) {
        playtime[response.Response.characters.data[character].classType] += Number(response.Response.characters.data[character].minutesPlayedTotal);

        let lastPlayedDate = Date(response.Response.characters.data[character].dateLastPlayed);
        if (recentlyPlayedDate === undefined || lastPlayedDate > recentlyPlayedDate) {
            recentlyPlayedDate = lastPlayedDate;
            recentlyPlayedClass = response.Response.characters.data[character].classType
        }
    }

    var simplified = {
        // playtime in minutes
        "lastClassPlayed": (recentlyPlayedClass === 0 ? "Titan" : (recentlyPlayedClass === 1 ? "Hunter" : "Warlock")),
        "playtime": {
            "total": playtime[0] + playtime[1] + playtime[2],
            "titan": playtime[0],
            "hunter": playtime[1],
            "warlock": playtime[2],
        },
        // kills
        "kills": {
            "totalKillsOverall": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Total Final Blows"]),
            "weapons": {
                "autoRifleKills": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Auto Rifle Final Blows"]),
                "bowKills": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Bow Final Blows"]),
                "fusionRifleKills": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Fusion Rifle Final Blows"]),
                "grenadeLauncherKills": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Grenade Launcher Final Blows"]),
                "handCannonKills": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Hand Cannon Final Blows"]),
                "heavyMachineGunKills": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Heavy Machine Gun Final Blows"]),
                "linearFusionRifleKills": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Linear Fusion Rifle Final Blows"]),
                "pulseRifleKills": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Pulse Rifle Final Blows"]),
                "rocketLauncherKills": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Rocket Launcher Final Blows"]),
                "scoutRifleKills": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Scout Rifle Final Blows"]),
                "shotgunKills": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Shotgun Final Blows"]),
                "sidearmKills": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Sidearm Final Blows"]),
                "sniperRifleKills": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Sniper Rifle Final Blows"]),
                "snowballKills": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Snowball Final Blows"]),
                "submachineGunKills": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Submachine Gun Final Blows"]),
                "swordKills": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Sword Final Blows"]),
                "traceRifleKills": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Trace Rifle Final Blows"]),
            },
            "crucibleKillsOverall": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Crucible Opponents Defeated"]),
            "gambitInvaderKillsOverall": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Gambit Invaders Defeated"]),
            "gambitBlockerKillsOverall": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Gambit Blockers Defeated"]),
            "pvpKillsOverall": {
                "value": response.Response.metrics.data.metrics[metricNameToHash["Crucible Opponents Defeated"]].objectiveProgress.progress +
                    response.Response.metrics.data.metrics[metricNameToHash["Crimson Days Opponents Defeated"]].objectiveProgress.progress +
                    response.Response.metrics.data.metrics[metricNameToHash["Iron Burden Opponents Defeated"]].objectiveProgress.progress +
                    response.Response.metrics.data.metrics[metricNameToHash["Trials Opponents defeated"]].objectiveProgress.progress +
                    response.Response.metrics.data.metrics[metricNameToHash["Gambit Invaders Defeated"]].objectiveProgress.progress,
                "name": "PvP Kills",
                "description": "Players defeated over account lifetime.",
                "lowerIsBetter": false,
                "icon": metricDefinition[metricNameToHash["Crucible Opponents Defeated"]].displayProperties.icon,
            },
            "crucibleKDASeason": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Crucible KDA (Season)"]),
            "averagePvpKillsPerMatchSeason": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Crucible Opponents Defeated Per Match (Season)"]),
            "championKills": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Champions Defeated"]),
        },
        "strikes": {
            "totalStrikes": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Completions"]),
            "flawlessStrikes": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Flawless Completions"]),
            "killsPerStrikeSeason": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Final Blows Per Strike (Season)"]),
            "nightfallChallenges": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Nightfall Challenge Completions"]),
            "nightfallScores": {
                "armsDealer": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Nightfall: \"The Arms Dealer\" Score"]),
                "birthplaceOfTheVile": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Nightfall: \"Birthplace of the Vile\" Score"]),
                "broodhold": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Nightfall: \"Broodhold\" Score"]),
                "corrupted": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Nightfall: \"The Corrupted\" Score"]),
                "devilsLair": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Nightfall: \"The Devils' Lair\" Score"]),
                "disgraced": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Nightfall: \"The Disgraced\" Score"]),
                "exodusCrash": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Nightfall: \"Exodus Crash\" Score"]),
                "fallenSaber": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Nightfall: \"Fallen S.A.B.E.R.\" Score"]),
                "festeringCore": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Nightfall: \"The Festering Core\" Score"]),
                "gardenWorld": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Nightfall: \"A Garden World\" Score"]),
                "glassway": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Nightfall: \"The Glassway\" Score"]),
                "hollowedLair": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Nightfall: \"The Hollowed Lair\" Score"]),
                "insightTerminus": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Nightfall: \"Insight Terminus\" Score"]),
                "invertedSpire": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Nightfall: \"The Inverted Spire\" Score"]),
                "lakeOfShadows": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Nightfall: \"Lake of Shadows\" Score"]),
                "lightblade": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Nightfall: \"The Lightblade\" Score"]),
                "provingGrounds": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Nightfall: \"Proving Grounds\" Score"]),
                "pyramidion": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Nightfall: \"The Pyramidion\" Score"]),
                "savathunsSong": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Nightfall: \"Savathûn's Song\" Score"]),
                "scarletKeep": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Nightfall: \"The Scarlet Keep\" Score"]),
                "strangeTerrain": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Nightfall: \"Strange Terrain\" Score"]),
                "treeOfProbabilities": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Nightfall: \"Tree of Probabilities\" Score"]),
                "wardenOfNothing": CreateStatObject(metricDefinition, response.Response.metrics.data.metrics, metricNameToHash["Nightfall: \"Warden of Nothing\" Score"]),
            }
        },
    };
    
    return simplified;
}