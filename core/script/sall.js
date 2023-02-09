function cssPropertyValueSupported(b, e) {
    var d = document.createElement("div");
    d.style[b] = e;
    return d.style[b] === e
}
var textSizeCSSfactor = 1
  , textSizeCSSunit = "vw";
cssPropertyValueSupported("font-size", "1vw") || (textSizeCSSunit = "%",
textSizeCSSfactor = 90 / 1.1,
$("body").css("font-size", bodyTextPct + "%"));
var spaghetti_code = !0, GAME_VERSION = 43, GAME_SUB_VERSION = "D", GAME_DIMX = 1200, GAME_DIMY = 600, fpsFleet = 10, fps = 2, MAX_FLEET_EXPERIENCE = 5E3, MAX_POLLUTION = 1E3 * bi, ATK_TIMER = 500, MAX_AUTO_DELIVERY_PER_PLANET = 5, averageT = 1 / fps, averageTFleet = 1 / fpsFleet, wiped = !1, DEBUG_MAIN_TIME = !1, adsAvailable = !1, idlePauseDuration = 0, tracks = [], AUXILIA_MODE = "ATTACK", repLevel = {
    hostile: {
        min: -1E3,
        max: -1
    },
    neutral: {
        min: 0,
        max: 500
    },
    friendly: {
        min: 501,
        max: 2E3
    },
    allied: {
        min: 2001,
        max: 5E3
    }
}, minRep = 2E9, maxRep = -2E9, r;
for (r in repLevel)
    minRep = Math.min(minRep, repLevel[r].min),
    minRep = Math.min(minRep, repLevel[r].max),
    maxRep = Math.max(maxRep, repLevel[r].min),
    maxRep = Math.max(maxRep, repLevel[r].max);
var repLoss = {
    hostile: 100,
    neutral: 500,
    friendly: 1499,
    allied: 2999
}, easyWipe = function() {
    localStorage.removeItem(SAVESTR_HEAD + "sv0cpt");
    localStorage.removeItem(SAVESTR_HEAD + "sv0plt");
    localStorage.removeItem(SAVESTR_HEAD + "sv0civ");
    localStorage.removeItem(SAVESTR_HEAD + "sv0sch")
}, NEW_AUTOROUTES = !1, kongregate, idleBon = staticBon, idleTimeout, firston = !0, currentCriteriaAuto = "all", currentCriteria = {
    t: "nowar",
    p: "all"
}, oldCriteria = {
    t: "nowar",
    p: "all"
}, internalSave = "sdf", gameSettings = {
    autoover: !1,
    gamePaused: !1,
    autorcorrection: !1,
    cloudSave: !1,
    shipSorted: !1,
    advancedAutoroute: !1,
    toastRight: !1,
    showRPSpent: !1,
    showBuildingAid: !1,
    techTree: !0,
    scientificNotation: !1,
    engineeringNotation: !1,
    allShipres: !0,
    hpreport: !1,
    resourceRequest: !1,
    autoQueue: !1,
    useQueue: !0,
    enemyAI: !1,
    showqd: !1,
    sortResName: !0,
    mapzoomlevel: 1,
    civis: "0",
    tutorialCount: 0,
    hideTutorial: !1,
    populationEnabled: POPULATION_ENABLED,
    showHub: !1,
    showMultipliers: !1,
    idle10: !0,
    overchargeShipping: !1,
    soundVolume: 100,
    musicVolume: 100,
    masterVolume: 50,
    textSize: 1.1,
    techuiScale: .8
}, cloudLoadingGoingOn = !1, gameSettingsReset = {
    mapzoomlevel: 1,
    soundVolume: 100,
    musicVolume: 100,
    masterVolume: 50,
    textSize: DEFAULT_TEXT_SIZE,
    techuiScale: .8
};
function addSettingCheck(b, e, d) {
    gameSettings[e] ? $("#" + b).prop("checked", !0) : $("#" + b).prop("checked", !1);
    $("#" + b).change(function() {
        gameSettings[e] = this.checked
    });
    d && exportAddHoverPopup(b, "<span class='blue_text'>" + d + "</span>", 132)
}
var reportsHistory = {
    log: [],
    start: -1,
    maxLength: 10
};
function addBattleReport(b) {
    reportsHistory.log[(reportsHistory.start + 1) % reportsHistory.maxLength] = b;
    reportsHistory.start = (reportsHistory.start + 1) % reportsHistory.maxLength
}
function getBattleReport(b) {
    return reportsHistory.log[(reportsHistory.start + reportsHistory.maxLength - b) % reportsHistory.maxLength]
}
var fleetStr = "nada", currentHighlight, toastTimeout, overviewPlanetExpand, overviewResourceExpand, overviewRoutesExpand, exportBuildingSelectionInterface, exportUpdateBuildingList, exportExpInterface, exportPermanentMenu, exportShipyardInterface, exportMain = function() {}, exportStringFunction = function() {}, exportExportString, currentFleetId, exportLoad, exportSaveCloud = function() {}, languages = {
    en: 0,
    it: 1,
    fr: 2,
    de: 3,
    jp: 4,
    ru: 5
}, localization = [["Type", "Tipo", ""], ["Radius", "Raggio", ""], ["Temperature", "Temperatura", ""], ["Atmosphere", "Atmosfera"]];
function vanillaHtml(b, e) {
    document.getElementById(b) && (document.getElementById(b).innerHTML = e)
}
var SchedulerUI = function() {
    this.ui = null;
    this.components = {};
    this.updaters = [];
    this.updatersParam = [];
    this.interfaces = {};
    this.getComponent = function(b) {
        return this.components[b]
    }
    ;
    this.uiSwitch = function(b) {
        (this.ui = this.getComponent(b)) ? document.getElementById("ui_space") && (document.getElementById("ui_space").innerHTML = this.ui.html(),
        this.updaters = []) : console.log("### SchedulerUI: current UI null at " + b)
    }
    ;
    this.uiAdd = function(b) {
        this.components[b.name] = b
    }
    ;
    this.uiUpdate = function() {
        for (var b = 0; b < this.updaters.length; b++)
            this.updaters[b](this.updatersParam[b])
    }
    ;
    this.getSpan = function(b) {
        return "<span class='" + (b.color + "_text" || "blue_text") + "' style='font-size:" + (b.fontSize || "100%") + "'>" + (b.content || "") + "</span>"
    }
    ;
    this.planetInfoUpdater = function(b) {
        this.planetEnergyInfoUpdater(b)
    }
    ;
    this.planetEnergyInfoUpdater = function(b) {
        b = b[0];
        var e = Math.floor(b.energyProduction())
          , d = -Math.floor(b.energyConsumption())
          , g = e - d
          , h = b.energyMalus();
        1 < h ? h = 1 : 0 > h && (h = 0);
        var l = "green_text";
        .85 <= h && 1 > h ? l = "gold_text" : .85 > h && (l = "red_text");
        vanillaHtml("planet_energy_production", e);
        vanillaHtml("planet_energy_consumption", d);
        vanillaHtml("planet_energy_balance", g);
        vanillaHtml("planet_energy_efficiency", Math.floor(1E4 * h) / 100 + "%");
        vanillaHtml("planet_rs_prod", "+" + beauty(b.globalProd.researchPoint) + "/s");
        $("#planet_energy_balance").attr("class", l);
        $("#planet_energy_efficiency").attr("class", l);
        gameSettings.populationEnabled && (document.getElementById("popul") && (document.getElementById("popul").innerHTML = beauty(b.population) + " " + (0 < b.globalProd.population + b.populationRatio ? "<span class='green_text'>(+" + beauty(b.globalProd.population + b.populationRatio) + "/s)</span>" : "<span class='red_text'>(" + beauty(b.globalProd.population + b.populationRatio) + "/s)</span>")),
        document.getElementById("habitable") && (document.getElementById("habitable").innerHTML = beauty(b.habitableSpace())))
    }
    ;
    this.planetInfo = function(b) {
        var e = "", d;
        game.searchPlanet(b.id) ? d = "blue_text" : null == b.civis ? d = "white_text" : null != b.civis && (d = "red_text");
        var g = "200px";
        MOBILE && (g = "100%");
        b.id == game.capital ? (e += "<span class='blue_text' style='font-size:120%; float:left; width:" + g + "; text-align:center; top:8px; color: rgb(240,180,20);'>" + b.name + "</span>",
        MOBILE || (e += "<br><span class='blue_text' style='font-size: 80%; float:left; width:" + g + "; text-align:center; top: 32px; color: rgb(240,180,20);'>(Capital)</span>")) : e += "<span class='" + d + "' style='font-size:120%; float:left; width:" + g + "; text-align:center; top:8px;'>" + b.name + "</span>";
        d = "top:48px;position:absolute;margin-top:16px; ;";
        MOBILE && (d = "margin-top:0px; ",
        e += "<img id='planet_visualizer' src='" + IMG_FOLDER + "/" + b[PLANET_IMG_FIELD] + (1 == PLANET_FOLDER_DOUBLE ? "/" + b[PLANET_IMG_FIELD] : "") + ".png' style='position:relative;left:10%;width:80%;height:auto;'/>");
        e = e + ("<ul id='info_list' style='" + d + " text-align:left; clear:both;'>") + "<div style='position:relative; left:8px;'>" + this.planetPhysicsInfo(b);
        e += "<br><br>";
        e += this.planetEnergyInfo(b);
        e += this.planetResourcesMultiplier(b);
        e += "</div>";
        d = [];
        e += "<br><br>";
        if (game.searchPlanet(b.id)) {
            g = new exportButton("action_b","Buildings",-1,40,exportBuildingSelectionInterface);
            e += g.getHtml();
            var h = new exportButton("action_auto","Autoroutes",-1,40,function() {
                exportTravelingShipInterface(b.id)
            }
            );
            1 < game.planets.length && !MOBILE_LANDSCAPE && (e += h.getHtml());
            if (!MOBILE && !MOBILE_LANDSCAPE) {
                var l = new exportButton("action_sendqueue","Send resources for queue",-1,40,function() {
                    b.queue[0] && resourceRequest(b)
                }
                );
                if (4 <= game.planets.length || 0 < game.timeTravelNum)
                    e += l.getHtml()
            }
            butExportBlueprint = new exportButton("action_export_blueprint","Export Building Setup",-1,40,function() {
                (new exportPopup(512,150,"<br><textarea id='blueprintexport' spellcheck='false' rows='3' style='width:80%;'>" + currentPlanet.exportBlueprint() + "</textarea>","Ok")).draw()
            }
            );
            butImportBlueprint = new exportButton("action_import_blueprint","Import Building Setup",-1,40,function() {
                (new exportPopup(512,200,"","importBlueprint")).draw()
            }
            );
            if (6 <= game.planets.length || 0 < game.timeTravelNum)
                e += butExportBlueprint.getHtml(),
                e += butImportBlueprint.getHtml();
            if (0 < currentPlanet.id && quests[questNames.traum_7] && quests[questNames.traum_7].done) {
                var u = new exportButton("action_give_to","Give to the Empire",-1,40,function() {
                    transferPlanet2(currentPlanet.id, civisName.traum);
                    exportPlanetInterface(currentPlanet)
                }
                );
                e += u.getHtml()
            }
            d.push(g);
            1 < game.planets.length && !MOBILE_LANDSCAPE && d.push(h);
            MOBILE || MOBILE_LANDSCAPE || d.push(l);
            d.push(butExportBlueprint);
            d.push(butImportBlueprint);
            0 < currentPlanet.id && quests[questNames.traum_7] && quests[questNames.traum_7].done && d.push(u)
        } else
            null == b.civis ? currentPlanetClicker = function() {
                mapInterface(nebulas[b.map])
            }
            : null != b.civis && (currentPlanetClicker = function() {
                mapInterface(nebulas[b.map])
            }
            );
        b.id == tournamentPlanet && (l = new exportButton("action_tournament","<span class='red_text' style='font-size:110%'>Space Tournament",-1,40,function() {
            exportTournamentInterface()
        }
        ),
        e += l.getHtml(),
        d.push(l));
        e += "</ul>";
        return {
            html: e,
            buttons: d
        }
    }
    ;
    this.planetPhysicsInfo = function(b) {
        var e = "<span class='blue_text'>Type: </span><span class='white_text'>" + b.type.capitalize() + " " + LOCALE_PLANET_NAME + "</span><br>";
        UI_SHOW_PLANET_RADIUS && (e += "<span class='blue_text'>Radius: </span><span class='white_text'>" + b.info.radius + " km</span><br>");
        e += "<span class='blue_text'>Temperature: </span><span class='white_text'>" + b.info.temp + " \u00b0C</span><br>";
        UI_SHOW_PLANET_ATMOSPHERE && (e += "<span class='blue_text'>" + LOCALE_ATMOSPHERE + ": </span><span class='white_text'>" + b.info.atmos + "</span><br>");
        UI_SHOW_PLANET_ORBITAL_DISTANCE && (e += "<span class='blue_text'>Orbital Distance: </span><span class='white_text'>" + b.info.orbit + " AU</span><br><br>");
        return e += "<span class='blue_text'>Influence: </span><span class='white_text'>" + b.influence + "</span><br>"
    }
    ;
    this.planetEnergyInfo = function(b) {
        var e = "";
        if (game.searchPlanet(b.id)) {
            e += "<span class='blue_text'>Energy Prod.: </span><span class='white_text' style='float:right;margin-right:20%;' id='planet_energy_production'>" + Math.floor(b.energyProduction()) + "</span><br>";
            e += "<span class='blue_text'>Energy Cons.: </span><span class='white_text' style='float:right;margin-right:20%;' id='planet_energy_consumption'>" + Math.floor(-b.energyConsumption()) + "</span><br>";
            var d = Math.floor(b.energyProduction() + b.energyConsumption())
              , g = b.energyMalus();
            1 < g ? g = 1 : 0 > g && (g = 0);
            var h = "green_text";
            .85 <= g && 1 > g ? h = "gold_text" : .85 > g && (h = "red_text");
            e += "<span class='blue_text'>Balance: </span><span class='" + h + "' style='float:right;margin-right:20%;' id='planet_energy_balance'>" + parseInt(Math.floor(d)) + "</span><br>";
            e += "<span class='blue_text'>Efficiency: </span><span class='" + h + "' style='float:right;margin-right:20%;' id='planet_energy_efficiency'>" + Math.floor(1E4 * g) / 100 + "%</span><br>";
            0 < b.globalProd.researchPoint && (e += "<span class='blue_text'>Research Points: </span><span id='planet_rs_prod' class='white_text' style='float:right;margin-right:20%;'>+" + beauty(b.globalProd.researchPoint) + "/s</span><br><br>")
        }
        gameSettings.populationEnabled && (e += "<span class='blue_text'>Population Growth: </span><span id='popGrow' class='white_text' style='float:right;margin-right:20%;'>" + 100 * b.basePopulation + "%" + (0 < b.structure[buildingsName.clonation].number ? "<span class='green_text'>(+" + b.structure[buildingsName.clonation].number + "%)</span>" : "") + "/y</span><br><span class='blue_text'>Population: </span><span id='popul' class='white_text' style='float:right;margin-right:20%;'>" + beauty(b.population) + " " + (0 < b.globalProd.population + b.populationRatio ? "<span class='green_text'>(+" + beauty(b.globalProd.population + b.populationRatio) + "/s)</span>" : "<span class='red_text'>(" + beauty(b.globalProd.population + b.populationRatio) + "/s)</span>") + "</span><br><span class='blue_text'>Habitable Space: </span><span id='habitable' class='white_text' style='float:right;margin-right:20%;'>" + beauty(b.habitableSpace()) + "</span><br><br>");
        this.updaters.push(this.planetInfoUpdater);
        this.updatersParam.push([b]);
        return e
    }
    ;
    this.planetResourcesMultiplier = function(b) {
        for (var e = "", d = 0; d < resNum; d++)
            resources[d].show(game) && (0 < b.baseResources[d] && "ore" == resources[d].type && (e += "<span class='blue_text'>" + resources[d].name.capitalize() + ":</span><span class='white_text' style='float:right;margin-right:20%;'>x" + b.baseResources[d].toFixed(2) + "</span><br>"),
            1 != b.baseResources[d] && "ore" != resources[d].type && (e += "<span class='" + (1 <= b.baseResources[d] ? "green_text" : "red_text") + "'>" + resources[d].name.capitalize() + ":</span><span class='white_text' style='float:right;margin-right:20%;'>x" + b.baseResources[d].toFixed(2) + "</span><br>"));
        return e
    }
    ;
    this.resourcesSort = {
        name: !1
    };
    this.resourcesSortUpdate = function() {
        this.resourcesSort.name = gameSettings.sortResName;
        this.resourcesSort.stock = gameSettings.sortResStock
    }
    ;
    this.planetResourcesUpdater = function(b) {
        b = b[0];
        var e = "<div style='position:relative; left:8px;'>";
        for (var d = b.rawProduction(), g = Array(resNum), h = 0; h < resNum; h++)
            g[h] = h;
        gameSettings.sortResName && (g = sortedResources);
        var l = Array(resNum);
        b.importExport();
        for (var u = 0; u < resNum; u++)
            h = g[u],
            l[h] = b.globalImport[h] - b.globalExport[h];
        for (u = 0; u < resNum; u++)
            if (h = g[u],
            resources[h].show(game) || 0 < b.resources[h]) {
                e += "<div id='res_name_div_" + h + "' ";
                var v = "<span id='buildingAid_" + h + "'>";
                highlightProd[h] ? (e += " style='background:rgba(0,255,0,0.3);'>",
                v += "<img src='" + UI_FOLDER + "/arrow_up_green.png' />") : highlightCons[h] ? (e += " style='background:rgba(255,0,0,0.3);'>",
                v += "<img src='" + UI_FOLDER + "/arrow_down_red.png' />") : e = highlightRes[h] ? e + " style='background:rgba(75,129,156,0.3);'>" : e + ">";
                v += "</span>";
                e += "<span class='blue_text'>" + resources[h].name.capitalize() + ": </span><span class='white_text' style='margin-righ:16px;font-size:80%' id='res_name_prod_" + h + "' name='" + h + "'>" + beauty(b.resources[h]) + " <span class='" + (0 <= d[h] ? 0 < d[h] ? "green_text" : "gray_text" : "red_text oblique_txt") + "'>(" + (0 < d[h] ? "+" : "") + beauty(d[h]) + "/s)" + v + "</span>";
                0 != l[h] && (e += "<span class='" + (0 <= l[h] ? 0 < l[h] ? "purple_text" : "gray_text" : "pink_text oblique_txt") + "'> (" + (0 < l[h] ? "+" : "") + beauty(l[h]) + "/s)</span>");
                MOBILE_LANDSCAPE && 0 < game.planets.length && 0 != game.totalProd[h] && (e += "<span class='" + (0 <= game.totalProd[h] ? 0 < game.totalProd[h] ? "purple_text" : "gray_text" : "pink_text oblique_txt") + "'> (" + (0 < game.totalProd[h] ? "+" : "") + beauty(game.totalProd[h]) + "/s)</span>");
                gameSettings.populationEnabled && h == FOOD_RESOURCE && 0 < (b.population - b.sustainable()) / 5E3 && (e += "<span class='gold_text' id='res_name_prod_biomass' name='" + h + "'>(-" + beauty((b.population - b.sustainable()) / 5E3) + "/s)</span>");
                e += "</span></div>"
            }
        return e + "</div>"
    }
    ;
    this.planetResources = function(b) {
        var e = "<div style='position:relative; left:8px;'>";
        if (game.searchPlanet(b.id)) {
            for (var d = b.rawProduction(), g = Array(resNum), h = 0; h < resNum; h++)
                g[h] = h;
            gameSettings.sortResName && (g = sortedResources);
            var l = Array(resNum);
            b.importExport();
            for (var u = 0; u < resNum; u++)
                h = g[u],
                l[h] = b.globalImport[h] - b.globalExport[h];
            for (u = 0; u < resNum; u++)
                if (h = g[u],
                resources[h].show(game) || 0 < b.resources[h]) {
                    e += "<div id='res_name_div_" + h + "' ";
                    var v = "<span id='buildingAid_" + h + "'>";
                    highlightProd[h] ? (e += " style='background:rgba(0,255,0,0.3);'>",
                    v += "<img src='" + UI_FOLDER + "/arrow_up_green.png' />") : highlightCons[h] ? (e += " style='background:rgba(255,0,0,0.3);'>",
                    v += "<img src='" + UI_FOLDER + "/arrow_down_red.png' />") : e = highlightRes[h] ? e + " style='background:rgba(75,129,156,0.3);'>" : e + ">";
                    v += "</span>";
                    e += "<span class='blue_text'>" + resources[h].name.capitalize() + ": </span><span class='white_text' style='margin-righ:16px;font-size:80%' id='res_name_prod_" + h + "' name='" + h + "'>" + beauty(b.resources[h]) + " <span class='" + (0 <= d[h] ? 0 < d[h] ? "green_text" : "gray_text" : "red_text oblique_txt") + "'>(" + (0 < d[h] ? "+" : "") + beauty(d[h]) + "/s)" + v + "</span>";
                    0 != l[h] && (e += "<span class='" + (0 <= l[h] ? 0 < l[h] ? "purple_text" : "gray_text" : "pink_text oblique_txt") + "'> (" + (0 < l[h] ? "+" : "") + beauty(l[h]) + "/s)</span>");
                    MOBILE_LANDSCAPE && 0 < game.planets.length && 0 != game.totalProd[h] && (e += "<span class='" + (0 <= game.totalProd[h] ? 0 < game.totalProd[h] ? "purple_text" : "gray_text" : "pink_text oblique_txt") + "'> (" + (0 < game.totalProd[h] ? "+" : "") + beauty(game.totalProd[h]) + "/s)</span>");
                    gameSettings.populationEnabled && h == FOOD_RESOURCE && 0 < (b.population - b.sustainable()) / 5E3 && (e += "<span class='gold_text' id='res_name_prod_biomass' name='" + h + "'>(-" + beauty((b.population - b.sustainable()) / 5E3) + "/s)</span>");
                    e += "</span></div>"
                }
            this.updaters.push(this.planetResourcesUpdater);
            this.updatersParam.push([b])
        }
        return e + "</div>"
    }
    ;
    this.settingsGroup = function(b) {
        for (var e = "", d = 0; d < b.length; d++) {
            var g = d % SETTINGS_PER_ROW
              , h = Math.floor(1E3 * g / SETTINGS_PER_ROW) / 10 + "%";
            0 == g && (e += "<li style='height:32px;'>");
            e += "<span style='position:absolute;left:" + h + ";' class='blue_text'>" + b[d] + "</span>";
            g == SETTINGS_PER_ROW - 1 && (e += "</li>")
        }
        return e
    }
    ;
    this.fleetInfo = function(b, e, d) {
        var g = d.name;
        "hub" == e && (g = planets[b].name + " Hub Fleet");
        d.civis != game.id ? $("#ship_info_name").html("<span class='red_text_n'>" + g + "</span><br><span class='red_text' style='font-size: 80%;'>(" + civis[d.civis].name + ")</span>") : $("#ship_info_name").html(g);
        document.getElementById("enemy_fleet_info_list") && (document.getElementById("enemy_fleet_info_list").innerHTML = "");
        b = "<ul id='ship_info_list' style='position:absolute; text-align:right; top:48px; margin-top:16px; clear:both;'><div style='position:relative; left:8px;'><span class='blue_text' style='float:left;margin-left:16px;font-size:120%;'>Information</span><br><br>" + ("<span class='blue_text' style='float:left;margin-left:16px;'>Civilization: </span><span class='white_text' >" + civis[d.civis].name + "</span><br>");
        b += "<span class='blue_text' style='float:left;margin-left:16px;'>Military Value: </span><span class='white_text' >" + beauty(d.value()) + "</span><br>";
        b += "<span class='blue_text' style='float:left;margin-left:16px;'>Experience: </span><span class='white_text' >" + Math.round(d.exp) + "</span><br>";
        b += "<span class='blue_text' style='float:left;margin-left:16px;'>Total Power: </span><span class='white_text' id='ammo_bonus'>" + beauty(d.power()) + "</span><br>";
        b += "<span class='blue_text' style='float:left;margin-left:16px;'>Total HP: </span><span class='white_text'>" + beauty(d.hp()) + "</span><br>";
        b += "<span class='blue_text' style='float:left;margin-left:16px;'>Speed: </span><span class='white_text'>" + Math.floor(100 * d.speed()) / 100 + "</span><br>";
        b += "<span class='blue_text' style='float:left;margin-left:16px;'>Total Storage: </span><span class='white_text'>" + beauty(d.maxStorage()) + "</span><br>";
        g = 0;
        b = b + "</div><br><div style='position:relative; left:8px;'><span class='blue_text' style='float:left;margin-left:16px;font-size:120%;'>Storage</span><br><br>" + ("<span class='blue_text' style='float:left;margin-left:16px;'>Storage left: </span><span class='white_text'>" + beauty(parseInt(Math.floor(d.availableStorage()))) + "</span><br>");
        var h = Array(resNum);
        for (e = 0; e < resNum; e++)
            h[e] = e;
        gameSettings.sortResName && (h = sortedResources);
        for (e = 0; e < resNum; e++) {
            var l = h[e];
            0 < d.storage[l] && (g++,
            b += "<span class='blue_text' style='float:left;margin-left:16px;'>" + resources[l].name.capitalize() + ": </span><span class='white_text'>" + beauty(parseInt(Math.floor(d.storage[l]))) + "</span><br>")
        }
        b += "</div><br><div style='position:relative; left:8px;'><span class='blue_text' style='float:left;margin-left:16px;font-size:120%;'>Ships</span><br><br>";
        for (e = 0; e < ships.length; e++)
            0 < d.ships[e] && (b += "<span class='blue_text' style='float:left;margin-left:16px;' id='ship_name_infos_" + e + "' name='" + e + "'>" + ships[e].name + "</span></span><span class='white_text'>" + beautyDot(d.ships[e]) + "</span><br>",
            g++);
        return {
            html: b + "</div><br><br>",
            cnt: g
        }
    }
    ;
    this.civisInfo = function(b) {
        var e = "<li style='height:80px;width:100%;'>" + ("<img src='" + UI_FOLDER + "/civis/" + civis[b].playerName + ".png' style='left:5%; height:64px;width:64px;position:absolute;' />");
        e += "<span class='blue_text' style='position:absolute;top:8px;left:120px;font-size:280%;width:100%;'>" + civis[b].name + "</span></li>";
        e += "<li style='height:60px;width:100%;'>";
        var d = [];
        if (0 >= civis[b].planets.length)
            e += "<span style='position:absolute;top:92px;left:16px;font-size:110%' class='red_text'>This civilization has been conquered</span>";
        else {
            e += "<span class='blue_text' style='position:absolute;top:92px;left:16px;font-size:100%;width:100%;'>Planets:</span><div style='position:absolute;left:100px;'>";
            for (var g = 0; g < civis[b].planets.length; g++) {
                var h = civis[b].planets[g]
                  , l = 0;
                planets[game.capital].shortestPath[h] ? l = planets[game.capital].shortestPath[h].hops : planets[planetsName.solidad].shortestPath[h] ? l = planets[game.capital].shortestPath[planetsName.xora].hops + planets[planetsName.solidad].shortestPath[h].hops : planets[planetsName.xirandrus].shortestPath[h] && (l = planets[game.capital].shortestPath[planetsName.xora].hops + planets[planetsName.volor].shortestPath[planetsName.solidad].hops + planets[planetsName.xirandrus].shortestPath[h].hops);
                e = l <= game.researches[3].level ? e + ("<img id='civis_plt_" + h + "' name='" + h + "' src='" + IMG_FOLDER + "/" + planets[h][PLANET_IMG_FIELD] + (1 == PLANET_FOLDER_DOUBLE ? "/" + planets[h][PLANET_IMG_FIELD] : "") + ".png' style='height:48px;width:48px;' />") : e + ("<img  src='" + IMG_FOLDER + "/unknown.png' id='civis_plt_" + h + "' name='" + h + "' isUnknown='yes' style='height:48px;width:48px;' style='' />");
                d.push(h)
            }
            e += "</div>"
        }
        e = e + "</li><li style='position:relative;left:16px;width:776px;'>" + ("<span class='blue_text'>Description: </span><span class='white_text'>" + civis[b].description + "</span>");
        e = e + "</li><li style='position:relative;left:16px'>" + ("<div style='position:absolute;top:16px;'><span class='blue_text'>Reputation Points: </span><span class='white_text'>" + game.reputation[b] + " (" + game.repName(b).capitalize() + ")</span></div>");
        h = 0;
        e += "<div style='position:absolute;top:16px;left:30%'><span class='blue_text'>Attitude: </span><span class='white_text'>";
        for (g = 0; g < civis[b].traits.length; g++)
            e += civis[b].traits[g].name.capitalize(),
            g < civis[b].traits.length - 1 && (e += ", "),
            h++;
        e += "</span>";
        0 == h && (e += "<span class='white_text'>Unknown</span>");
        e = e + "</div>" + ("<div style='position:absolute;top:16px;left:60%'><span class='blue_text'>Government: </span><span class='white_text'>" + civis[b].govern + "</span></div>");
        e += "</li><li style='position:relative;left:16px;top:32px;height:200px'><br><span class='blue_text'>Allegiance: </span><br>";
        for (g = 1; g < civis.length; g++)
            parseInt(b) != g && civis[g].contacted() && ("hostile" == civis[b].repName(g) ? e += "<span class='red_text'>" + civis[g].name + " (Hostile)</span><br>" : "friendly" == civis[b].repName(g) ? e += "<span class='white_text'>" + civis[g].name + " (Friendly)</span><br>" : "allied" == civis[b].repName(g) && (e += "<span class='green_text'>" + civis[g].name + " (Allied)</span><br>"));
        e += "</li>";
        h = 0;
        g = [];
        for (var u in civisQuest[b])
            quests[u].available() && h++;
        if (0 < h && 0 < civis[b].planets.length) {
            e += "<li style='position:relative;left:16px;height:64px'><span class='blue_text' style='font-size:200%'>Missions</span>";
            l = h = "";
            for (u in civisQuest[b]) {
                var v = quests[u];
                if (v.available()) {
                    var y = "blue_text"
                      , A = "white_text"
                      , E = "";
                    v.done && (A = y = "green_text",
                    E = "COMPLETED - ");
                    var x = "";
                    x += "<li style='position:relative;left:16px;height:auto'>";
                    x += "<span class='" + y + "' style='font-size:130%'>" + E + v.name + "</span>";
                    v.checkCompletion() && (E = new exportButton("quest__claim__" + v.id,"<span class='green_text'>Claim Reward</span>",180,32,function() {
                        var d = $(this).attr("id").split("__");
                        quests[questNames[d[2]]].checkCompletion() ? quests[questNames[d[2]]].reward() : (new exportPopup(300,0,"<br><span class='red_text text_shadow'>This quest can not be completed. Check the requirements</span>","info")).drawToast();
                        exportDiplomacyInterface(quests[questNames[d[2]]].provider);
                        save()
                    }
                    ),
                    x += "<span style='position:absolute;right:32px;top:-4px' style='font-size:130%'>" + E.getHtml() + "</span>",
                    g.push(E));
                    x += "<br><br>";
                    x += "<span class='" + A + "' style=''>" + v.description + "</span><br><br>";
                    x += "<span class='" + y + "' style=''>Objective: </span>" + v.objective + "<br><br>";
                    x += "<span class='" + y + "' style=''>Reward: </span>";
                    0 <= v.provider && (x += "<span class='" + A + "' style=''>" + v.repReward + " rep. with </span><span class='" + y + "' style=''>" + civis[v.provider].name + "</span>");
                    v.bonusDescription && 0 <= v.provider ? x += "<span class='" + A + "' style=''>, " : v.bonusDescription && -1 == v.provider && (x += "<span class='" + A + "' style=''>");
                    v.bonusDescription && (x += "</span>" + v.bonusDescription);
                    x += "<br><br><span class='" + A + "'></span></li>";
                    v.done ? h += x : l += x
                }
            }
            e = e + (l + h) + "<li style='position:relative;left:16px;height:0px'></li></li>"
        }
        MOBILE_LANDSCAPE || (e += "<img src='" + UI_FOLDER + "/banners/" + civis[b].playerName + ".png' style='position:absolute;top:0%;right:8px;'/>");
        return {
            html: e,
            toBind: d,
            buttons: g
        }
    }
    ;
    this.unaligned = function() {
        var b = "", e = 0, d = [], g;
        for (g in unalignedQuests)
            quests[g].available() && e++;
        if (0 < e) {
            b += "<li style='position:relative;left:16px;height:64px'><span class='blue_text' style='font-size:200%'>Missions</span>";
            var h = e = "";
            for (g in unalignedQuests) {
                var l = quests[g];
                if (l.available()) {
                    var u = "blue_text"
                      , v = "white_text"
                      , y = "";
                    l.done && (v = u = "green_text",
                    y = "COMPLETED - ");
                    var A = "";
                    A += "<li style='position:relative;left:16px;height:auto'>";
                    A += "<span class='" + u + "' style='font-size:130%'>" + y + l.name + "</span>";
                    l.checkCompletion() && (y = new exportButton("quest__claim__" + l.id,"<span class='green_text'>Claim Reward</span>",180,32,function() {
                        var d = $(this).attr("id").split("__");
                        quests[questNames[d[2]]].checkCompletion() ? quests[questNames[d[2]]].reward() : (new exportPopup(300,0,"<br><span class='red_text text_shadow'>This quest can not be completed. Check the requirements</span>","info")).drawToast();
                        exportDiplomacyInterface(quests[questNames[d[2]]].provider);
                        save()
                    }
                    ),
                    A += "<span style='position:absolute;right:32px;top:-4px' style='font-size:130%'>" + y.getHtml() + "</span>",
                    d.push(y));
                    A += "<br><br>";
                    A += "<span class='" + v + "' style=''>" + l.description + "</span><br><br>";
                    A += "<span class='" + u + "' style=''>Objective: </span>" + l.objective + "<br><br>";
                    A += "<span class='" + u + "' style=''>Reward: </span>";
                    l.bonusDescription && (A += "<span class='" + v + "' style=''></span>" + l.bonusDescription);
                    A += "<br><br><span class='" + v + "'></span></li>";
                    l.done ? e += A : h += A
                }
            }
            b = b + (h + e) + "<li style='position:relative;left:16px;height:0px'></li>"
        } else
            b += "<li style='position:relative;left:16px;height:64px'><span class='red_text' style='font-size:200%'>No Missions available</span>";
        return {
            html: b + "</li>",
            buttons: d
        }
    }
    ;
    this.artifactList = function() {
        for (var b, e = 0, d = 0; d < artifacts.length; d++)
            artifacts[d].possessed && e++;
        b = "<li style='position:relative;left:16px;height:64px'><span class='blue_text' style='font-size:200%'>Artifacts</span>";
        if (0 < e) {
            e = "";
            for (d = 0; d < artifacts.length; d++) {
                var g = artifacts[d];
                if (g.possessed) {
                    var h = "";
                    h += "<li style='position:relative;left:16px;height:auto'>";
                    h += "<span class='blue_text' style='font-size:130%'>" + g.name + "</span>";
                    h += "<br><br>";
                    h += "<span class='blue_text' style=''>Description: </span><span class='white_text' style=''>" + g.description + "</span><br><br>";
                    h += "</li>";
                    e += h
                }
            }
            b = b + ("" + e) + "<li style='position:relative;left:16px;height:0px'></li>"
        } else
            b += "<li style='position:relative;left:16px;height:64px'><span class='red_text' style='font-size:200%'>No Artifacts to show</span></li>";
        return {
            html: b + "</li>",
            buttons: []
        }
    }
    ;
    this.characterList = function() {
        for (var b, e = 0, d = [], g = 0; g < characters.length; g++)
            characters[g].unlocked && e++;
        b = "<li style='position:relative;left:16px;height:64px'><span class='blue_text' style='font-size:200%'>Characters</span>";
        if (0 < e) {
            e = "";
            for (g = 0; g < characters.length; g++) {
                var h = characters[g];
                "quris2" == h.id && quests[questNames.quris_7].done && (h.unlocked = !0);
                "wahrian" == h.id && quests[questNames.seal_7].done && (h.unlocked = !0);
                "protohalean" == h.id && quests[questNames.juini_5].done && (h.unlocked = !0);
                if (h.unlocked) {
                    var l = "";
                    l += "<li style='position:relative;left:16px;height:auto'>";
                    l += "<span class='blue_text' style='font-size:130%'>" + h.name + " (" + h.race + ")</span><br><br>";
                    l += "<img src='img_portraits/" + h.icon + "' style='font-size:130%;width:128px;height:128px;'/>";
                    l += "<br><br>";
                    l += "<div style='position:relative;left:136px;top:-128px;width:480px'>";
                    l += "<span class='blue_text' style=''>Description: </span><span class='white_text' style='position:relative;'>" + h.description + "</span><br><br>";
                    l += "</div>";
                    "quris2" == h.id && (h = "ATTACK",
                    "ATTACK" == AUXILIA_MODE && (h = "DEFENCE"),
                    h = new exportButton("auxilia_switch","<span class='green_text'>Switch to " + h + " mode</span>",180,32,function() {
                        "ATTACK" == AUXILIA_MODE ? (AUXILIA_MODE = "DEFENCE",
                        ships[shipsName["Auxilia Beta"]].power /= 3,
                        ships[shipsName["Auxilia Beta"]].hp *= 10) : "DEFENCE" == AUXILIA_MODE && (AUXILIA_MODE = "ATTACK",
                        ships[shipsName["Auxilia Beta"]].power *= 3,
                        ships[shipsName["Auxilia Beta"]].hp /= 10);
                        (new exportPopup(300,0,"<br><span class='green_text text_shadow'>Switched to " + AUXILIA_MODE + " mode</span>","info")).drawToast();
                        exportDiplomacyInterface("char")
                    }
                    ),
                    l += "<div style='position:relative;left:136px;top:-128px;width:480px'>",
                    l += h.getHtml(),
                    l += "</div>",
                    d.push(h));
                    l += "</li>";
                    e += l
                }
            }
            b = b + ("" + e) + "<li style='position:relative;left:16px;height:0px'></li>"
        } else
            b += "<li style='position:relative;left:16px;height:64px'><span class='red_text' style='font-size:200%'>No Characters to show</span></li>";
        return {
            html: b + "</li>",
            buttons: d
        }
    }
    ;
    this.government = function() {
        for (var b, e = 0, d = [], g = 0; g < civis.length; g++)
            (g != game.id && 0 == civis[g].planets.length && civis[g].govern && governmentList[civis[g].govern] && !governmentList[civis[g].govern].questUnlock || governmentList[civis[g].govern] && 0 < civis[g].planets.length && (governmentList[civis[g].govern].questUnlock && quests[questNames[governmentList[civis[g].govern].questUnlock]].done || governmentList[civis[g].govern].questUnlockOr && quests[questNames[governmentList[civis[g].govern].questUnlockOr]].done)) && e++;
        b = "<li style='position:relative;left:16px;height:64px'><span class='blue_text' style='font-size:200%'>Current Government Form</span><li style='position:relative;left:16px;height:auto'>" + ("<span class='blue_text' style='font-size:130%;color: rgb(240,180,20);'>" + game.chosenGovern + "</span>");
        "none" != game.chosenGovern && (b = b + "<br><br>" + ("<span class='blue_text' style='color: rgb(240,180,20);'>Description: </span><span>" + governmentList[game.chosenGovern].description + "</span><br><br>"));
        b += "</li></li><li style='position:relative;left:16px;height:64px'><span class='blue_text' style='font-size:200%'>Available Government Forms</span><li style='position:relative;left:16px;height:auto'><span class='blue_text' style='font-size:130%'>Standard Government</span>";
        var h = new exportButton("government_none","<span class='green_text'>Select</span>",180,32,function() {
            $(this).attr("id").split("_");
            if (0 >= game.governmentTimer) {
                governmentList[game.chosenGovern] && governmentList[game.chosenGovern].unbonus();
                game.chosenGovern = "No Government";
                game.governmentTimer = 3600 * GOVERNMENT_HOURS_CHANGE;
                governmentList[game.chosenGovern] && governmentList[game.chosenGovern].bonus();
                exportDiplomacyInterface("government");
                var d = new exportPopup(300,0,"<span class='green_text'>Chosen government: No Government</span>","info")
            } else
                d = "0" + Math.floor(game.governmentTimer % 60),
                d = Math.floor(game.governmentTimer / 3600) + "h " + ("0" + Math.floor(game.governmentTimer / 60) % 60).substr(-2) + "m " + d.substr(-2) + "s",
                d = new exportPopup(300,0,"<span class='red_text text_shadow'>You can change government in " + d + "</span>","info");
            d.drawToast()
        }
        );
        b += "<span style='position:absolute;right:32px;top:-4px' style='font-size:130%'>" + h.getHtml() + "</span>";
        d.push(h);
        b = b + "<br><br>" + ("<span class='blue_text' style=''>Description: </span><span>" + governmentList["No Government"].description + "</span><br><br>");
        b += "</li>";
        if (0 < e) {
            e = "";
            for (g = 0; g < civis.length; g++)
                if (g != game.id && 0 == civis[g].planets.length && civis[g].govern && governmentList[civis[g].govern] && !governmentList[civis[g].govern].questUnlock || governmentList[civis[g].govern] && 0 < civis[g].planets.length && (governmentList[civis[g].govern].questUnlock && quests[questNames[governmentList[civis[g].govern].questUnlock]].done || governmentList[civis[g].govern].questUnlockOr && quests[questNames[governmentList[civis[g].govern].questUnlockOr]].done)) {
                    var l = "";
                    l += "<li style='position:relative;left:16px;height:auto'>";
                    l += "<span class='blue_text' style='font-size:130%'>" + civis[g].govern + "</span>";
                    h = new exportButton("government_" + g,"<span class='green_text'>Select</span>",180,32,function() {
                        var d = $(this).attr("id").split("_");
                        0 >= game.governmentTimer ? (governmentList[game.chosenGovern] && governmentList[game.chosenGovern].unbonus(),
                        game.chosenGovern = civis[d[1]].govern,
                        game.governmentTimer = 3600 * GOVERNMENT_HOURS_CHANGE,
                        governmentList[game.chosenGovern] && governmentList[game.chosenGovern].bonus(),
                        exportDiplomacyInterface("government"),
                        d = new exportPopup(300,0,"<span class='green_text'>Chosen government: " + civis[d[1]].govern + "</span>","info")) : (d = "0" + Math.floor(game.governmentTimer % 60),
                        d = Math.floor(game.governmentTimer / 3600) % 24 + "h " + ("0" + Math.floor(game.governmentTimer / 60) % 60).substr(-2) + "m " + d.substr(-2) + "s",
                        d = new exportPopup(300,0,"<span class='red_text text_shadow'>You can change government in " + d + "</span>","info"));
                        d.drawToast()
                    }
                    );
                    l += "<span style='position:absolute;right:32px;top:-4px' style='font-size:130%'>" + h.getHtml() + "</span>";
                    d.push(h);
                    l += "<br><br>";
                    l += "<span class='blue_text' style=''>Description: </span><span>" + governmentList[civis[g].govern].description + "</span><br><br>";
                    l += "</li>";
                    e += l
                }
            b = b + e + "<li style='position:relative;left:16px;height:0px'></li>"
        } else
            b += "<li style='position:relative;left:16px;height:64px'><span class='red_text' style='font-size:200%'>No government forms unlocked yet</span></li>";
        return {
            html: b + "</li>",
            buttons: d
        }
    }
    ;
    this.reportsHistory = function() {
        var b = reportsHistory.log.length
          , e = [];
        var d = "<li style='position:relative;left:16px;height:64px'>" + ("<span class='blue_text' style='font-size:200%'>Last " + b + " Attack Reports</span>");
        if (0 < b) {
            for (b = 0; b < reportsHistory.log.length; b++) {
                var g = getBattleReport(b);
                d += "<li style='position:relative;left:16px;height:auto'>";
                var h = "";
                h += "<span class='blue_text' style='font-size:130%'>" + g.name + "</span>";
                h += "<br><br>";
                h += "<span class='blue_text' style=''>Date: </span><span class='white_text' style=''>" + g.date + "</span><br><br>";
                g = new exportButton("report_" + b,h,900,48,function() {
                    var d = $(this).attr("id").split("_");
                    $("#diplomacy_list").html(getBattleReport(d[1]).report)
                }
                );
                d += g.getHtml();
                d += "</li>";
                e.push(g)
            }
            d += "<li style='position:relative;left:16px;height:0px'></li>"
        } else
            d += "<li style='position:relative;left:16px;height:64px'><span class='red_text' style='font-size:200%'>No reports to show</span></li>";
        return {
            html: d + "</li>",
            buttons: e
        }
    }
    ;
    this.fleetMenu = function() {
        var b = exportButton
          , e = exportShipInterface
          , d = exportTravelingShipInterface;
        var g = "<ul id='ship_mini_list2' style='text-align:left;'>";
        var h = new b("overview_button","Cargo Fleets",-1,48,function() {
            e({
                t: "cargo",
                p: "all"
            })
        }
        );
        g += h.getHtml();
        var l = new b("minerfleets_button","Miner Fleets",-1,48,function() {
            e({
                t: "miner",
                p: "all"
            })
        }
        );
        0 < game.researches[researchesName.space_mining].level && (g += l.getHtml());
        var u = new b("hubfleets_button","Hub Fleets",-1,48,function() {
            e({
                t: "hub",
                p: "all"
            })
        }
        );
        !MOBILE_LANDSCAPE && gameSettings.showHub && (4 <= game.planets.length || 0 < game.timeTravelNum) && (g += u.getHtml());
        var v = new b("warfleets_button","War Fleets",-1,48,function() {
            e({
                t: "war",
                p: "all"
            })
        }
        );
        g += v.getHtml();
        var y = new b("traveling_button","Traveling Fleets",-1,48,function() {
            d("normal")
        }
        );
        g += y.getHtml();
        var A = new b("attackfleet_button","Attacking Fleets",-1,48,function() {
            d("attacks")
        }
        );
        game.maps[2] && (g += A.getHtml());
        var E = new b("marketship_button","Market Fleets",-1,48,function() {
            d("market")
        }
        );
        game.researches[researchesName[MARKET_ENABLING_RESEARCH]].level >= MARKET_ENABLING_LEVEL && (g += E.getHtml());
        var x = new b("autoroutesov_button","Auto-routes",-1,48,function() {
            d("auto")
        }
        );
        MOBILE_LANDSCAPE || (g += x.getHtml());
        for (var H = Array(game.planets.length), F = 0; F < game.planets.length; F++)
            H[F] = new b("autoroutesov_" + F + "_button","<img class='icon' style='position:absolute;top:8px;left:8px' src='" + IMG_FOLDER + "/" + planets[game.planets[F]][PLANET_IMG_FIELD] + (1 == PLANET_FOLDER_DOUBLE ? "/" + planets[game.planets[F]][PLANET_IMG_FIELD] : "") + ".png'/>" + planets[game.planets[F]].name,-1,48,function() {
                var b = $(this).attr("id").split("_");
                currentPlanet = planets[game.planets[parseInt(b[1])]];
                d(game.planets[parseInt(b[1])])
            }
            ),
            MOBILE_LANDSCAPE || (g += H[F].getHtml());
        g += "</ul>";
        document.getElementById("ship_mini_list") && (document.getElementById("ship_mini_list").innerHTML = g);
        $("#ship_mini_list").css("position", "absolute");
        $("#ship_mini_list").css("top", "8px");
        b = 7;
        0 < game.researches[researchesName.space_mining].level && b++;
        $("#ship_info_placeholder").css("height", 48 * (game.planets.length + b) + 16 + "px");
        h.enable();
        l.enable();
        u.enable();
        v.enable();
        y.enable();
        A.enable();
        E.enable();
        x.enable();
        for (F = 0; F < game.planets.length; F++)
            H[F].enable()
    }
    ;
    this.templateFleet = function(b) {
        var e = "";
        if (b) {
            var d = b.pid;
            b = b.fid;
            e = e + ("<li id='fleet" + d + "_" + b + "' name='" + d + "_" + b + "' style='height:80px;' class='button'>") + "<div style='width:98%; height:80px;position:relative;'><div style='position:relative; top:8px; left:8px'>";
            var g = planets[d].fleets[b].name;
            "hub" == b && (g = planets[d].name + " Hub Fleet");
            if (planets[d].fleets[b].civis != game.id) {
                var h = "red_text"
                  , l = "[Enemy] ";
                game.reputation[planets[d].fleets[b].civis] >= repLevel.allied.min ? (h = "green_text",
                l = "[Allied] ") : game.reputation[planets[d].fleets[b].civis] >= repLevel.friendly.min ? (h = "white_text",
                l = "[Friendly] ") : game.reputation[planets[d].fleets[b].civis] >= repLevel.neutral.min && (h = "gray_text",
                l = "[Neutral] ");
                e += "<span class='" + h + "' style='font-size: 100%;'>" + l + g + "</span>"
            } else
                e += "<span class='blue_text' style='font-size: 100%;'>" + g + " </span>",
                e += "<img id='b_rename_icon_" + d + "_" + b + "' name='" + d + "_" + b + "' src='" + UI_FOLDER + "/RENAME.png' style='width:16px;height:16px;position:relative;top:3px;cursor:pointer;'/>";
            e += "<span class='white_text'> orbiting </span><span class='blue_text' style='font-size: 100%;cursor:pointer;' id='orbiting_" + d + "_" + b + "' name='" + d + "'>" + planets[d].name + "</span></div>";
            game.id == planets[d].fleets[b].civis && "hub" != b ? (e += "<div id='quick_fleet_menu_" + d + "_" + b + "' style='position:absolute;right:10%;bottom:10%'>",
            game.searchPlanet(d) && (e += "<img id='b_load_icon_" + d + "_" + b + "' name='" + d + "_" + b + "' src='" + UI_FOLDER + "/load.png' class='icon_big' style='cursor:pointer;'/>",
            e += "<img id='b_unload_icon_" + d + "_" + b + "' name='" + d + "_" + b + "' src='" + UI_FOLDER + "/unload.png' class='icon_big' style='cursor:pointer;'/>"),
            e += "<img id='b_merge_icon_" + d + "_" + b + "' name='" + d + "_" + b + "' src='" + UI_FOLDER + "/merge.png' class='icon_big' style='cursor:pointer;'/>",
            e += "<img id='b_divide_icon_" + d + "_" + b + "' name='" + d + "_" + b + "' src='" + UI_FOLDER + "/divide.png' class='icon_big' style='cursor:pointer;'/>",
            e += "<img id='b_move_icon_" + d + "_" + b + "' name='" + d + "_" + b + "' src='" + UI_FOLDER + "/move.png' class='icon' style='cursor:pointer;'/>",
            game.searchPlanet(d) && (e += "<img id='b_automove_icon_" + d + "_" + b + "' name='" + d + "_" + b + "' src='" + UI_FOLDER + "/automove.png' class='icon' style='cursor:pointer;'/>",
            e += "<img id='b_delivery_icon_" + d + "_" + b + "' name='" + d + "_" + b + "' src='" + UI_FOLDER + "/delivery.png' class='icon' style='cursor:pointer;'/>",
            e += "<img id='b_void_ship_icon' src='" + UI_FOLDER + "/void.png' class='icon' style='cursor:pointer;'/>",
            e += "<img id='b_dismantle_ship_icon_" + d + "_" + b + "' name='" + d + "_" + b + "' src='" + UI_FOLDER + "/x_red.png' class='icon' style='cursor:pointer;'/>"),
            e += "</div>") : "hub" == b && (e = e + ("<div id='quick_fleet_menu_" + d + "_" + b + "' style='position:absolute;right:10%;bottom:10%'>") + ("<img id='b_divide_icon_" + d + "_" + b + "' name='" + d + "_" + b + "' src='" + UI_FOLDER + "/divide.png' class='icon_big' style='cursor:pointer;'/>"),
            e += "</div>");
            e += "</div>"
        } else
            e += "<li id='nofleet' style='height:80px;' class='button'>",
            e += "<div style='width:98%; height:80px;position:relative;'>",
            e += "<div style='text-align:center;position:relative; top:8px; left:8px'>",
            e += "<span class='gray_text' style='font-size: 100%;'>There are no fleets to show</span> ";
        e += "</li>";
        return {
            html: e
        }
    }
    ;
    this.templatePlanetSelect = function(b) {
        var e = "";
        if (b) {
            var d = b.pid;
            b = b.i;
            e = e + ("<li id='planet" + d + "' name='" + d + "' style='height:64px;width:100%'>") + ("<img id='planet_img_" + d + "' name='" + b + "' src='" + IMG_FOLDER + "/" + planets[game.planets[b]][PLANET_IMG_FIELD] + (1 == PLANET_FOLDER_DOUBLE ? "/" + planets[game.planets[b]][PLANET_IMG_FIELD] : "") + ".png' class='planet_icon' style='align:center;cursor:pointer;'/>");
            var g = 100;
            MOBILE_LANDSCAPE && (g = 170);
            e = capital == b ? e + ("<span id='planet_int_" + d + "' name='" + b + "' class='blue_text' style='position:relative; top:-26px; left:8px; font-size: " + g + "%; color:rgb(249,159,36);cursor:pointer;'>" + planets[d].name + "</span>") : e + ("<span id='planet_int_" + d + "' name='" + b + "' class='blue_text' style='position:relative; top:-26px; left:8px; font-size: " + g + "%;cursor:pointer;'>" + planets[d].name + "</span>");
            e += "<span class='blue_text' style='position:relative; top:-26px; left:32px; font-size: " + g + "%;cursor:pointer;width:100%' id='planet_overview_" + d + "' name='exp_" + d + "' >Show overview<img src='" + UI_FOLDER + "/arrow_down.png' style='position:relative; width:20px;height:20px;top:5px;left:4px' /></span>";
            e = e + ("<div id='planet_overview_info_" + d + "' name='" + d + "' style='position:relative;left:10%;width:80%;'>") + "</div></li>"
        } else
            e += "<li id='nofleet' style='height:80px;' class='button'><div style='width:98%; height:80px;position:relative;'><div style='text-align:center;position:relative; top:8px; left:8px'><span class='gray_text' style='font-size: 100%;'>No planets to show</span> </li>";
        return {
            html: e
        }
    }
    ;
    this.templateBuilding = function(b) {
        var e = ""
          , d = null;
        if (b) {
            d = "button";
            planets[b.pid].structureAffordable(b.bid) || (d = "red_button");
            var g = b.bid
              , h = planets[b.pid]
              , l = $("#building" + g)
              , u = "blue_text"
              , v = "white_text";
            h.structureAffordable(g) ? (u = "blue_text",
            v = "white_text",
            avBuilding[g] = !0,
            l.removeClass("red_button"),
            l.addClass("button")) : (v = u = "red_text",
            avBuilding[g] = !1,
            l.removeClass("button"),
            l.addClass("red_button"));
            l = "";
            var y = "<div style='width:98%; height:80px;position:relative;'><div style='position:relative; top:8px; left:8px'>";
            y = h.structure[g].active ? y + ("<img id='b_shut_" + g + "' name='" + g + "' src='" + UI_FOLDER + "/act.png' style='z-index:10;width:16px;height:16px;position:relative;top:3px;left:-2px;' style='cursor:pointer;'/>") : y + ("<img id='b_shut_" + g + "' name='" + g + "' src='" + UI_FOLDER + "/shut.png' style='z-index:10;width:16px;height:16px;position:relative;top:3px;left:-2px;' style='cursor:pointer;'/>");
            for (var A = !1, E = 0, x = ""; !A && E < resNum; )
                A = h.globalNoRes[g][E],
                x = " (needs " + resources[E].name.capitalize() + ")",
                E++;
            y = A ? y + ("<span class='blue_text' style='font-size: 100%;'>" + buildings[g].displayName + " <span class='red_text' style='font-size:80%;' id='b_nores_" + g + "'>" + x + "</span></span> ") : y + ("<span class='blue_text' style='font-size: 100%;'>" + buildings[g].displayName + " <span class='red_text' style='font-size:80%;' id='b_nores_" + g + "'></span></span>");
            y += "<span class='white_text'><span id='b_queuen_" + g + "'>" + h.structure[g].number;
            for (var H in h.queue)
                if (h.queue[H].b == g) {
                    y += " (" + h.queue[H].n + " in queue)<img id='b_drop_queue_" + g + "' name='" + g + "' src='" + UI_FOLDER + "/x.png' style='width:24px;height:24px;position:relative;top:8px;left:-2px;' style='cursor:pointer;'/>";
                    break
                }
            y += "</span></span></div><div style='position:relative; top:16px; left:8px'>";
            H = 0;
            A = h.showBuyCostRaw(g, 1);
            for (E = 0; E < resNum; E++)
                x = A[E],
                0 < x && buildings[g].buildable && (l += "</div><div style='position:absolute; top:" + (32 + 16 * H) + "px; left: 320px;'>",
                l += "<span class='" + u + "' id='b_res_" + g + "_" + E + "'>" + resources[E].name.capitalize() + ": </span>",
                l += "<span class='" + v + "' id='b_cost_" + g + "_" + E + "'>" + beauty(x),
                gameSettings.showMultipliers && (l += " (x" + buildings[g].resourcesMult[E] + ")"),
                l += "</span><br>",
                H++);
            l += "</div><div style='position:relative; top:16px; left:8px'>";
            buildings[g].buildable && (l += "<img id='b_build_" + g + "' name='" + g + "' src='" + UI_FOLDER + "/add2.png' style='width:32px;height:32px;position:relative;top:3px;left:-2px;' style='cursor:pointer;'/>",
            l += "<img id='b_build10_" + g + "' name='" + g + "' src='" + UI_FOLDER + "/add10.png' style='width:32px;height:32px;position:relative;top:3px;left:-2px;' style='cursor:pointer;'/>",
            l += "<img id='b_build50_" + g + "' name='" + g + "' src='" + UI_FOLDER + "/add50.png' style='width:32px;height:32px;position:relative;top:3px;left:-2px;' style='cursor:pointer;'/>",
            l += "<img id='b_void' src='" + UI_FOLDER + "/void.png' style='width:32px;height:32px;position:relative;top:3px;left:-2px;'/>",
            l += "<img id='b_dismantle_" + g + "' name='" + g + "' src='" + UI_FOLDER + "/x.png' style='width:32px;height:32px;position:relative;top:3px;left:-2px;' style='cursor:pointer;'/>",
            l += "<img id='b_dismantle10_" + g + "' name='" + g + "' src='" + UI_FOLDER + "/x10.png' style='width:32px;height:32px;position:relative;top:3px;left:-2px;' style='cursor:pointer;'/>",
            l += "<img id='b_dismantle50_" + g + "' name='" + g + "' src='" + UI_FOLDER + "/x50.png' style='width:32px;height:32px;position:relative;top:3px;left:-2px;' style='cursor:pointer;'/>");
            u = "32px";
            h.structure[g].showUI && (u = "80px",
            y += l + "</div></div>");
            e += "<li id='building" + b.bid + "' name='" + b.bid + "' style='height:" + u + ";' class='" + d + "'>" + y + "</li>";
            d = function() {
                var d = buildings[parseInt($(this).attr("name"))]
                  , b = "<span class='green_text'>(Active)</span>";
                h.structure[d.id].active || (b = "<span class='red_text'>(Not Active)</span>");
                document.getElementById("building_info_name") && (document.getElementById("building_info_name").innerHTML = buildings[parseInt($(this).attr("name"))].displayName + "<br>" + b);
                b = "<ul id='building_info_list' style='position:absolute; text-align:right; top:48px; margin-top:16px; clear:both;'><div style='position:relative; left:0px;'>";
                d.description && (b += "<span class='gold_text' style='float:left;margin-left:16px;font-size:80%;'>" + d.description + "</span><br><br>");
                b += "<div style='position:relative; left:8px;'><span class='blue_text' style='float:left;margin-left:16px;font-size:120%;'>Production</span><br><br>";
                var e = buildings[parseInt($(this).attr("name"))].rawProduction(h)
                  , g = buildings[parseInt($(this).attr("name"))].production(h);
                0 < d.habitableSpace ? b += "<span class='blue_text' style='float:left;margin-left:16px;'>Habitable Space: </span><span class='green_text'>" + beauty(d.habitableSpace) + "</span><br><br>" : 0 > d.habitableSpace && (b += "<span class='blue_text' style='float:left;margin-left:16px;'>Habitable Space: </span><span class='red_text'>" + beauty(d.habitableSpace) + "</span><br><br>");
                "clonation" == d.name && (b += "<span class='blue_text' style='float:left;margin-left:16px;'>Population Growth: </span><span class='white_text'>+1% (+" + h.structure[d.id].number + "% total)</span><br><br>");
                for (var l = 0; l < resNum; l++)
                    0 != d.resourcesProd[l] && (0 < d.resourcesProd[l] && (0 < h.baseResources[l] || "mine" != d.type2) ? b += "<span class='blue_text' style='float:left;margin-left:16px;'>" + resources[l].name.capitalize() + ": </span><span class='green_text'>" + beauty(e[l]) + "/s (" + beauty(g[l]) + "/s tot)</span><br>" : 0 > d.resourcesProd[l] && (b += "<span class='blue_text' style='float:left;margin-left:16px;'>" + resources[l].name.capitalize() + ": </span><span class='red_text'>" + beauty(e[l]) + "/s (" + beauty(g[l]) + "/s tot)</span><br>"));
                0 != d.energy && (e = "red_text",
                0 < d.energy && (e = "green_text"),
                b = "solar" == d.type2 ? b + ("<span class='blue_text' style='float:left;margin-left:16px;'>Energy: </span><span class='" + e + "'>" + beauty(d.energy / (h.info.orbit * h.info.orbit)) + "/s (" + beauty(g.energy) + "/s tot)</span><br>") : b + ("<span class='blue_text' style='float:left;margin-left:16px;'>Energy: </span><span class='" + e + "'>" + beauty(d.energy) + "/s (" + beauty(g.energy) + "/s tot)</span><br>"));
                0 != d.population && (e = "red_text",
                0 < h.basePopulation * d.population && (e = "green_text"),
                b += "<span class='blue_text' style='float:left;margin-left:16px;'>Population: </span><span class='" + e + "'>" + beauty(d.population) + "/s (" + beauty(h.structure[parseInt($(this).attr("name"))].number * d.population) + "/s tot)</span><br>");
                0 != d.pollution && (e = "red_text",
                0 > d.pollution && (e = "green_text"));
                0 != d.researchPoint && (e = "red_text",
                0 < d.researchPoint && (e = "green_text"),
                b = "cryolab" == d.name ? b + ("<span class='blue_text' style='float:left;margin-left:16px;'>Research points: </span><span class='" + e + "'>" + beauty(d.researchPoint * h.info.temp * -5) + "/s<br>(" + beauty(h.structure[parseInt($(this).attr("name"))].number * d.researchPoint * h.info.temp * -5) + "/s tot)</span><br>") : "lavaresearch" == d.name ? b + ("<span class='blue_text' style='float:left;margin-left:16px;'>Research points: </span><span class='" + e + "'>" + beauty(d.researchPoint * h.info.temp) + "/s<br>(" + beauty(h.structure[parseInt($(this).attr("name"))].number * d.researchPoint * h.info.temp) + "/s tot)</span><br>") : "ammonia_airship" == d.name ? b + ("<span class='blue_text' style='float:left;margin-left:16px;'>Research points: </span><span class='" + e + "'>" + beauty(d.researchPoint * h.info.radius) + "/s<br>(" + beauty(h.structure[parseInt($(this).attr("name"))].number * d.researchPoint * h.info.radius) + "/s tot)</span><br>") : b + ("<span class='blue_text' style='float:left;margin-left:16px;'>Research points: </span><span class='" + e + "'>" + beauty(d.researchPoint) + "/s<br>(" + beauty(h.structure[parseInt($(this).attr("name"))].number * d.researchPoint) + "/s tot)</span><br>"));
                b += "</div><br><div style='position:relative; left:8px;'><span class='blue_text' style='float:left;margin-left:16px;font-size:120%;'>Cost</span><br><br>";
                for (d = 0; d < resNum; d++)
                    g = h.structure[parseInt($(this).attr("name"))].cost(d),
                    e = "blue_text",
                    l = "white_text",
                    g > h.resources[d] && (l = e = "red_text"),
                    0 < g && (b += "<span class='" + e + "' style='float:left;margin-left:16px;'>" + resources[d].name.capitalize() + ": </span>",
                    b += "<span class='" + l + "'>" + beauty(g),
                    gameSettings.showMultipliers && (b += " (x" + buildings[parseInt($(this).attr("name"))].resourcesMult[d] + ")"),
                    b += "</span><br>");
                b += "</div><br><br>";
                e = g = d = !1;
                e = h.structure[parseInt($(this).attr("name"))].showUI ? new exportButton("bshowui_" + parseInt($(this).attr("name")),"Collapse UI",-1,40,function() {
                    var d = $(this).attr("id").split("_")[1];
                    h.structure[d].showUI = !1;
                    exportPlanetBuildingInterface(currentInterface.split("_")[1], h);
                    document.getElementById("building_info_list") && (document.getElementById("building_info_list").innerHTML = "")
                }
                ) : new exportButton("bshowui_" + parseInt($(this).attr("name")),"Expand UI",-1,40,function() {
                    var d = $(this).attr("id").split("_")[1];
                    h.structure[d].showUI = !0;
                    exportPlanetBuildingInterface(currentInterface.split("_")[1], h);
                    document.getElementById("building_info_list") && (document.getElementById("building_info_list").innerHTML = "")
                }
                );
                b += e.getHtml();
                "time_machine" == buildings[parseInt($(this).attr("name"))].name && 0 < h.structure[parseInt($(this).attr("name"))].number ? (d = new exportButton("time_button","Travel in Time",-1,40,function() {
                    var d = game.totalTPspent() + 2 * game.influence() * Math.log(1 + game.totalRPspent() / (200 * bi)) / Math.log(5);
                    (new exportPopup(210,200,"<br><span class='blue_text'>Are you sure you want to travel in time? </span><br><span class='red_text'>You will lose all your planets, resources and fleets!</span><br><span class='blue_text'>After traveling in time you will get <span class='green_text'>" + beauty(d) + " Technology Points</span> to reassign them on researches.</span>","confirm",function() {
                        prestige();
                        currentPopup.drop()
                    }
                    )).draw()
                }
                ),
                b += d.getHtml()) : "space_machine" == buildings[parseInt($(this).attr("name"))].name && 0 < h.structure[parseInt($(this).attr("name"))].number ? (d = new exportButton("space_button","Send a Fleet to Solidad<br><span class='red_text'>No way back!</span><br><span class='white_text'>(" + beauty(1E5 * Math.sqrt(h.structure[parseInt($(this).attr("name"))].number)) + " weight per antimatter)</span>",-1,40,function() {
                    (new exportPopup(210,0,"<span class='blue_text text_shadow'>Select the Fleet you wish to send through the gate</span>","info")).drawToast();
                    var d = h.id;
                    shipInterface({
                        t: "all",
                        p: d
                    });
                    for (var b in planets[d].fleets)
                        0 < planets[d].fleets[b].shipNum() && ($("#fleet" + d + "_" + b).unbind(),
                        $("#fleet" + d + "_" + b).click(function() {
                            var d = $(this).attr("name").split("_")
                              , b = d[0]
                              , h = planets[b].fleets[d[1]]
                              , e = Math.ceil(h.totalWeight() / (1E5 * Math.sqrt(planets[b].structure[buildingsName.space_machine].number)));
                            planets[b].resources[resourcesName.antimatter.id] >= e ? (planets[planetsName.solidad].fleetPush(h),
                            delete planets[b].fleets[d[1]],
                            planets[b].resources[resourcesName.antimatter.id] -= e,
                            0 > planets[b].resources[resourcesName.antimatter.id] && (planets[b].resources[resourcesName.antimatter.id] = 0),
                            planetBuildingInterface("other", planets[b]),
                            d = new Popup(210,0,"<span class='blue_text'>Fleet moved to Solidad</span>","info")) : (planetBuildingInterface("other", planets[b]),
                            d = new Popup(210,0,"<span class='red_text red_text_shadow'>Not enough antimatter to move this fleet</span>","info"));
                            d.drawToast()
                        }),
                        $("#fleet" + d + "_" + b).hover(function() {
                            var d = $(this).attr("name").split("_")
                              , b = d[0];
                            d = planets[b].fleets[d[1]];
                            (new Popup(240,10,"<span class='blue_text'>Total weight: </span><span class='white_text'>" + beauty(d.totalWeight()) + "</span><br><span class='blue_text'>Antimatter cost: </span><span class='white_text'>" + beauty(Math.ceil(d.totalWeight() / (1E5 * Math.sqrt(planets[b].structure[buildingsName.space_machine].number)))) + "</span>","info")).drawInfo();
                            $(document).on("mousemove", function(d) {
                                mouseX = d.pageX + 10;
                                mouseY = d.pageY + 10;
                                $("#popup_info").css({
                                    left: mouseX,
                                    top: mouseY
                                })
                            });
                            $("#popup_info").css({
                                left: mouseX,
                                top: mouseY
                            })
                        }, function() {
                            currentPopup.drop()
                        }),
                        $("#fleet" + d + "_" + b).mouseout(function() {
                            $(document).on("mousemove", function() {})
                        }))
                }
                ),
                b += d.getHtml()) : "tradehub" == buildings[parseInt($(this).attr("name"))].name && 0 < h.structure[parseInt($(this).attr("name"))].number && (g = new exportButton("trademarket_button","Open the market",-1,40,function() {
                    exportMarketInterface(h)
                }
                ),
                b += g.getHtml(),
                butTradehub = new exportButton("tradehub_button","Travel in Time",-1,40,function() {
                    var d = game.totalTPspent() + 2 * game.influence() * Math.log(1 + game.totalRPspent() / (200 * bi)) / Math.log(5);
                    (new exportPopup(210,200,"<br><span class='blue_text'>Are you sure you want to travel in time? </span><br><span class='red_text'>You will lose all your planets, resources and fleets!</span><br><span class='blue_text'>After traveling in time you will get <span class='green_text'>" + beauty(d) + " Technology Points</span> to reassign them on researches.</span>","confirm",function() {
                        prestige();
                        currentPopup.drop()
                    }
                    )).draw()
                }
                ));
                b += "</ul>";
                document.getElementById("building_info_list") && (document.getElementById("building_info_list").innerHTML = b);
                currentBuildingId = parseInt($(this).attr("name"));
                d && d.enable();
                g && g.enable();
                e && e.enable();
                exportUpdateBuildingList()
            }
        } else
            e += "<li id='nobuilding' style='height:80px;' class='button'><div style='width:98%; height:80px;position:relative;'><div style='text-align:center;position:relative; top:8px; left:8px'><span class='gray_text' style='font-size: 100%;'>There are no buildings to show</span> </li>";
        return {
            html: e,
            bind: d
        }
    }
    ;
    this.templateList = function(b, e) {
        for (var d = "", g = [], h = 0; h < e.length; h++) {
            var l = b(e[h]);
            d += l.html;
            g.push(l.bind)
        }
        0 == e.length && (d += b(null).html);
        return {
            html: d,
            bind: g
        }
    }
}
  , uiScheduler = new SchedulerUI;
function playAudio(b) {
    b = new Audio("" + UI_FOLDER + "/audio/" + b + ".wav");
    b.volume = Math.floor(gameSettings.soundVolume * gameSettings.masterVolume / 100) / 100;
    b.play()
}
var Base64String = {
    compressToUTF16: function(b) {
        var e = [], d, g = 0;
        b = this.compress(b);
        for (d = 0; d < b.length; d++) {
            var h = b.charCodeAt(d);
            switch (g++) {
            case 0:
                e.push(String.fromCharCode((h >> 1) + 32));
                var l = (h & 1) << 14;
                break;
            case 1:
                e.push(String.fromCharCode(l + (h >> 2) + 32));
                l = (h & 3) << 13;
                break;
            case 2:
                e.push(String.fromCharCode(l + (h >> 3) + 32));
                l = (h & 7) << 12;
                break;
            case 3:
                e.push(String.fromCharCode(l + (h >> 4) + 32));
                l = (h & 15) << 11;
                break;
            case 4:
                e.push(String.fromCharCode(l + (h >> 5) + 32));
                l = (h & 31) << 10;
                break;
            case 5:
                e.push(String.fromCharCode(l + (h >> 6) + 32));
                l = (h & 63) << 9;
                break;
            case 6:
                e.push(String.fromCharCode(l + (h >> 7) + 32));
                l = (h & 127) << 8;
                break;
            case 7:
                e.push(String.fromCharCode(l + (h >> 8) + 32));
                l = (h & 255) << 7;
                break;
            case 8:
                e.push(String.fromCharCode(l + (h >> 9) + 32));
                l = (h & 511) << 6;
                break;
            case 9:
                e.push(String.fromCharCode(l + (h >> 10) + 32));
                l = (h & 1023) << 5;
                break;
            case 10:
                e.push(String.fromCharCode(l + (h >> 11) + 32));
                l = (h & 2047) << 4;
                break;
            case 11:
                e.push(String.fromCharCode(l + (h >> 12) + 32));
                l = (h & 4095) << 3;
                break;
            case 12:
                e.push(String.fromCharCode(l + (h >> 13) + 32));
                l = (h & 8191) << 2;
                break;
            case 13:
                e.push(String.fromCharCode(l + (h >> 14) + 32));
                l = (h & 16383) << 1;
                break;
            case 14:
                e.push(String.fromCharCode(l + (h >> 15) + 32, (h & 32767) + 32)),
                g = 0
            }
        }
        e.push(String.fromCharCode(l + 32));
        return e.join("")
    },
    decompressFromUTF16: function(b) {
        for (var e = [], d, g, h = 0, l = 0; l < b.length; ) {
            g = b.charCodeAt(l) - 32;
            switch (h++) {
            case 0:
                d = g << 1;
                break;
            case 1:
                e.push(String.fromCharCode(d | g >> 14));
                d = (g & 16383) << 2;
                break;
            case 2:
                e.push(String.fromCharCode(d | g >> 13));
                d = (g & 8191) << 3;
                break;
            case 3:
                e.push(String.fromCharCode(d | g >> 12));
                d = (g & 4095) << 4;
                break;
            case 4:
                e.push(String.fromCharCode(d | g >> 11));
                d = (g & 2047) << 5;
                break;
            case 5:
                e.push(String.fromCharCode(d | g >> 10));
                d = (g & 1023) << 6;
                break;
            case 6:
                e.push(String.fromCharCode(d | g >> 9));
                d = (g & 511) << 7;
                break;
            case 7:
                e.push(String.fromCharCode(d | g >> 8));
                d = (g & 255) << 8;
                break;
            case 8:
                e.push(String.fromCharCode(d | g >> 7));
                d = (g & 127) << 9;
                break;
            case 9:
                e.push(String.fromCharCode(d | g >> 6));
                d = (g & 63) << 10;
                break;
            case 10:
                e.push(String.fromCharCode(d | g >> 5));
                d = (g & 31) << 11;
                break;
            case 11:
                e.push(String.fromCharCode(d | g >> 4));
                d = (g & 15) << 12;
                break;
            case 12:
                e.push(String.fromCharCode(d | g >> 3));
                d = (g & 7) << 13;
                break;
            case 13:
                e.push(String.fromCharCode(d | g >> 2));
                d = (g & 3) << 14;
                break;
            case 14:
                e.push(String.fromCharCode(d | g >> 1));
                d = (g & 1) << 15;
                break;
            case 15:
                e.push(String.fromCharCode(d | g)),
                h = 0
            }
            l++
        }
        return this.decompress(e.join(""))
    },
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    decompress: function(b) {
        for (var e = [], d, g, h, l, u, v, y = 1, A = b.charCodeAt(0) >> 8; y < 2 * b.length && (y < 2 * b.length - 1 || 0 == A); ) {
            0 == y % 2 ? (d = b.charCodeAt(y / 2) >> 8,
            g = b.charCodeAt(y / 2) & 255,
            h = y / 2 + 1 < b.length ? b.charCodeAt(y / 2 + 1) >> 8 : NaN) : (d = b.charCodeAt((y - 1) / 2) & 255,
            (y + 1) / 2 < b.length ? (g = b.charCodeAt((y + 1) / 2) >> 8,
            h = b.charCodeAt((y + 1) / 2) & 255) : g = h = NaN);
            y += 3;
            l = d >> 2;
            d = (d & 3) << 4 | g >> 4;
            u = (g & 15) << 2 | h >> 6;
            v = h & 63;
            if (isNaN(g) || y == 2 * b.length + 1 && A)
                u = v = 64;
            else if (isNaN(h) || y == 2 * b.length && A)
                v = 64;
            e.push(this._keyStr.charAt(l));
            e.push(this._keyStr.charAt(d));
            e.push(this._keyStr.charAt(u));
            e.push(this._keyStr.charAt(v))
        }
        return e.join("")
    },
    compress: function(b) {
        var e = []
          , d = 1
          , g = 0;
        var h = !1;
        for (b = b.replace(/[^A-Za-z0-9\+\/=]/g, ""); g < b.length; ) {
            h = this._keyStr.indexOf(b.charAt(g++));
            var l = this._keyStr.indexOf(b.charAt(g++));
            var u = this._keyStr.indexOf(b.charAt(g++));
            var v = this._keyStr.indexOf(b.charAt(g++));
            h = h << 2 | l >> 4;
            l = (l & 15) << 4 | u >> 2;
            var y = (u & 3) << 6 | v;
            if (0 == d % 2) {
                var A = h << 8;
                h = !0;
                64 != u && (e.push(String.fromCharCode(A | l)),
                h = !1);
                64 != v && (A = y << 8,
                h = !0)
            } else
                e.push(String.fromCharCode(A | h)),
                h = !1,
                64 != u && (A = l << 8,
                h = !0),
                64 != v && (e.push(String.fromCharCode(A | y)),
                h = !1);
            d += 3
        }
        h ? (e.push(String.fromCharCode(A)),
        e = e.join(""),
        e = String.fromCharCode(e.charCodeAt(0) | 256) + e.substring(1)) : e = e.join("");
        return e
    }
}
  , LZString = function() {
    function b(b, e) {
        if (!d[b]) {
            d[b] = {};
            for (var h = 0; h < b.length; h++)
                d[b][b.charAt(h)] = h
        }
        return d[b][e]
    }
    var e = String.fromCharCode
      , d = {}
      , g = {
        compressToBase64: function(d) {
            if (null == d)
                return "";
            d = g._compress(d, 6, function(d) {
                return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(d)
            });
            switch (d.length % 4) {
            default:
            case 0:
                return d;
            case 1:
                return d + "===";
            case 2:
                return d + "==";
            case 3:
                return d + "="
            }
        },
        decompressFromBase64: function(d) {
            return null == d ? "" : "" == d ? null : g._decompress(d.length, 32, function(h) {
                return b("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", d.charAt(h))
            })
        },
        compressToUTF16: function(d) {
            return null == d ? "" : g._compress(d, 15, function(d) {
                return e(d + 32)
            }) + " "
        },
        decompressFromUTF16: function(d) {
            return null == d ? "" : "" == d ? null : g._decompress(d.length, 16384, function(b) {
                return d.charCodeAt(b) - 32
            })
        },
        compressToUint8Array: function(d) {
            d = g.compress(d);
            for (var b = new Uint8Array(2 * d.length), h = 0, e = d.length; e > h; h++) {
                var y = d.charCodeAt(h);
                b[2 * h] = y >>> 8;
                b[2 * h + 1] = y % 256
            }
            return b
        },
        decompressFromUint8Array: function(d) {
            if (null === d || void 0 === d)
                return g.decompress(d);
            for (var b = Array(d.length / 2), h = 0, v = b.length; v > h; h++)
                b[h] = 256 * d[2 * h] + d[2 * h + 1];
            var y = [];
            return b.forEach(function(d) {
                y.push(e(d))
            }),
            g.decompress(y.join(""))
        },
        compressToEncodedURIComponent: function(d) {
            return null == d ? "" : g._compress(d, 6, function(d) {
                return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$".charAt(d)
            })
        },
        decompressFromEncodedURIComponent: function(d) {
            return null == d ? "" : "" == d ? null : (d = d.replace(/ /g, "+"),
            g._decompress(d.length, 32, function(h) {
                return b("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$", d.charAt(h))
            }))
        },
        compress: function(d) {
            return g._compress(d, 16, function(d) {
                return e(d)
            })
        },
        _compress: function(d, b, e) {
            if (null == d)
                return "";
            var h, g, l = {}, u = {}, x = "", H = "", F = "", m = 2, w = 3, K = 2, I = [], C = 0, B = 0;
            for (g = 0; g < d.length; g += 1)
                if (x = d.charAt(g),
                Object.prototype.hasOwnProperty.call(l, x) || (l[x] = w++,
                u[x] = !0),
                H = F + x,
                Object.prototype.hasOwnProperty.call(l, H))
                    F = H;
                else {
                    if (Object.prototype.hasOwnProperty.call(u, F)) {
                        if (256 > F.charCodeAt(0)) {
                            for (h = 0; K > h; h++)
                                C <<= 1,
                                B == b - 1 ? (B = 0,
                                I.push(e(C)),
                                C = 0) : B++;
                            var z = F.charCodeAt(0);
                            for (h = 0; 8 > h; h++)
                                C = C << 1 | 1 & z,
                                B == b - 1 ? (B = 0,
                                I.push(e(C)),
                                C = 0) : B++,
                                z >>= 1
                        } else {
                            z = 1;
                            for (h = 0; K > h; h++)
                                C = C << 1 | z,
                                B == b - 1 ? (B = 0,
                                I.push(e(C)),
                                C = 0) : B++,
                                z = 0;
                            z = F.charCodeAt(0);
                            for (h = 0; 16 > h; h++)
                                C = C << 1 | 1 & z,
                                B == b - 1 ? (B = 0,
                                I.push(e(C)),
                                C = 0) : B++,
                                z >>= 1
                        }
                        m--;
                        0 == m && (m = Math.pow(2, K),
                        K++);
                        delete u[F]
                    } else
                        for (z = l[F],
                        h = 0; K > h; h++)
                            C = C << 1 | 1 & z,
                            B == b - 1 ? (B = 0,
                            I.push(e(C)),
                            C = 0) : B++,
                            z >>= 1;
                    m--;
                    0 == m && (m = Math.pow(2, K),
                    K++);
                    l[H] = w++;
                    F = String(x)
                }
            if ("" !== F) {
                if (Object.prototype.hasOwnProperty.call(u, F)) {
                    if (256 > F.charCodeAt(0)) {
                        for (h = 0; K > h; h++)
                            C <<= 1,
                            B == b - 1 ? (B = 0,
                            I.push(e(C)),
                            C = 0) : B++;
                        z = F.charCodeAt(0);
                        for (h = 0; 8 > h; h++)
                            C = C << 1 | 1 & z,
                            B == b - 1 ? (B = 0,
                            I.push(e(C)),
                            C = 0) : B++,
                            z >>= 1
                    } else {
                        z = 1;
                        for (h = 0; K > h; h++)
                            C = C << 1 | z,
                            B == b - 1 ? (B = 0,
                            I.push(e(C)),
                            C = 0) : B++,
                            z = 0;
                        z = F.charCodeAt(0);
                        for (h = 0; 16 > h; h++)
                            C = C << 1 | 1 & z,
                            B == b - 1 ? (B = 0,
                            I.push(e(C)),
                            C = 0) : B++,
                            z >>= 1
                    }
                    m--;
                    0 == m && (m = Math.pow(2, K),
                    K++);
                    delete u[F]
                } else
                    for (z = l[F],
                    h = 0; K > h; h++)
                        C = C << 1 | 1 & z,
                        B == b - 1 ? (B = 0,
                        I.push(e(C)),
                        C = 0) : B++,
                        z >>= 1;
                m--;
                0 == m && K++
            }
            z = 2;
            for (h = 0; K > h; h++)
                C = C << 1 | 1 & z,
                B == b - 1 ? (B = 0,
                I.push(e(C)),
                C = 0) : B++,
                z >>= 1;
            for (; ; ) {
                if (C <<= 1,
                B == b - 1) {
                    I.push(e(C));
                    break
                }
                B++
            }
            return I.join("")
        },
        decompress: function(d) {
            return null == d ? "" : "" == d ? null : g._decompress(d.length, 32768, function(b) {
                return d.charCodeAt(b)
            })
        },
        _decompress: function(d, b, g) {
            var h, l, u = [], E = 4, x = 4, H = 3, F = [], m = g(0), w = b, K = 1;
            for (h = 0; 3 > h; h += 1)
                u[h] = h;
            var I = 0;
            var C = Math.pow(2, 2);
            for (l = 1; l != C; ) {
                var B = m & w;
                w >>= 1;
                0 == w && (w = b,
                m = g(K++));
                I |= (0 < B ? 1 : 0) * l;
                l <<= 1
            }
            switch (I) {
            case 0:
                I = 0;
                C = Math.pow(2, 8);
                for (l = 1; l != C; )
                    B = m & w,
                    w >>= 1,
                    0 == w && (w = b,
                    m = g(K++)),
                    I |= (0 < B ? 1 : 0) * l,
                    l <<= 1;
                var z = e(I);
                break;
            case 1:
                I = 0;
                C = Math.pow(2, 16);
                for (l = 1; l != C; )
                    B = m & w,
                    w >>= 1,
                    0 == w && (w = b,
                    m = g(K++)),
                    I |= (0 < B ? 1 : 0) * l,
                    l <<= 1;
                z = e(I);
                break;
            case 2:
                return ""
            }
            h = u[3] = z;
            for (F.push(z); ; ) {
                if (K > d)
                    return "";
                I = 0;
                C = Math.pow(2, H);
                for (l = 1; l != C; )
                    B = m & w,
                    w >>= 1,
                    0 == w && (w = b,
                    m = g(K++)),
                    I |= (0 < B ? 1 : 0) * l,
                    l <<= 1;
                switch (z = I) {
                case 0:
                    I = 0;
                    C = Math.pow(2, 8);
                    for (l = 1; l != C; )
                        B = m & w,
                        w >>= 1,
                        0 == w && (w = b,
                        m = g(K++)),
                        I |= (0 < B ? 1 : 0) * l,
                        l <<= 1;
                    u[x++] = e(I);
                    z = x - 1;
                    E--;
                    break;
                case 1:
                    I = 0;
                    C = Math.pow(2, 16);
                    for (l = 1; l != C; )
                        B = m & w,
                        w >>= 1,
                        0 == w && (w = b,
                        m = g(K++)),
                        I |= (0 < B ? 1 : 0) * l,
                        l <<= 1;
                    u[x++] = e(I);
                    z = x - 1;
                    E--;
                    break;
                case 2:
                    return F.join("")
                }
                if (0 == E && (E = Math.pow(2, H),
                H++),
                u[z])
                    z = u[z];
                else {
                    if (z !== x)
                        return null;
                    z = h + h.charAt(0)
                }
                F.push(z);
                u[x++] = h + z.charAt(0);
                E--;
                h = z;
                0 == E && (E = Math.pow(2, H),
                H++)
            }
        }
    };
    return g
}();
"function" == typeof define && define.amd ? define(function() {
    return LZString
}) : "undefined" != typeof module && null != module && (module.exports = LZString);
Array.prototype.min = function() {
    for (var b = this[0], e = 1; e < this.length; e++)
        this[e] < b && (b = this[e]);
    return b
}
;
Array.prototype.max = function() {
    for (var b = this[0], e = 1; e < this.length; e++)
        this[e] > b && (b = this[e]);
    return b
}
;
Array.prototype.idMin = function() {
    for (var b = 0, e = 1; e < this.length; e++)
        this[e] < this[b] && (b = e);
    return b
}
;
Array.prototype.idMax = function() {
    for (var b = 0, e = 1; e < this.length; e++)
        this[e] > this[b] && (b = e);
    return b
}
;
Array.prototype.find = function(b) {
    for (var e = 0; e < this.length && this[e] != b; )
        e++;
    return e
}
;
Array.prototype.has = function(b) {
    for (var e = !1, d = 0; d < this.length && !e; )
        this[d] == b && (e = !0),
        d++;
    return e
}
;
function arraySort(b) {
    b.sort(function(b, d) {
        return b < d ? -1 : b > d ? 1 : 0
    })
}
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
}
;
function beautyDot(b) {
    for (var e = Math.log(b) / Math.log(10) / 3, d = "", g = 0; 1E3 <= b && g <= e + 1; )
        d = "." + ("00" + Math.floor(b % 1E3)).substr(-3) + d,
        b /= 1E3,
        g++;
    return d = Math.floor(b) + d
}
function beauty(b) {
    if (gameSettings.scientificNotation || gameSettings.engineeringNotation) {
        if (1E4 <= Math.abs(b)) {
            if (gameSettings.engineeringNotation) {
                var e = Math.log(Math.abs(b)) / Math.log(10)
                  , d = Math.floor(e % 3);
                return Math.floor(b / Math.pow(10, Math.floor(e - d)) * 1E3) / 1E3 + "e+" + Math.floor(e - d)
            }
            return b.toExponential(3)
        }
        return 1E3 <= Math.abs(b) ? b.toFixed(0) : 100 <= Math.abs(b) ? b.toFixed(1) : b.toFixed(2)
    }
    e = "";
    0 > b && (e = "-");
    d = Math.floor(Math.abs(b)) || 0;
    return d >= bi * bi * bi * bi ? e + (d / bi / bi / bi / bi).toFixed(2) + "Ud" : d >= mi * bi * bi * bi ? e + (d / mi / bi / bi / bi).toFixed(2) + "Dc" : d >= 1E3 * bi * bi * bi ? e + (d / 1E3 / bi / bi / bi).toFixed(2) + "No" : d >= bi * bi * bi ? e + (d / bi / bi / bi).toFixed(2) + "Oc" : d >= mi * bi * bi ? e + (d / mi / bi / bi).toFixed(2) + "Sp" : d >= 1E3 * bi * bi ? e + (d / 1E3 / bi / bi).toFixed(2) + "Sx" : d >= bi * bi ? e + (d / bi / bi).toFixed(2) + "Qi" : d >= mi * bi ? e + (d / mi / bi).toFixed(2) + "Qa" : d >= 1E3 * bi ? e + (d / 1E3 / bi).toFixed(2) + "T" : d >= bi ? e + (d / bi).toFixed(2) + "B" : d >= mi ? e + (d / mi).toFixed(2) + "M" : 1E3 <= d ? e + (d / 1E3).toFixed(2) + "K" : 100 <= d ? e + d.toFixed(1) : e + Math.abs(b).toFixed(2)
}
function parseBeauty(b) {
    b = ("" + b).replace(/,/g, "");
    b = b.split(/(?=[a-zA-Z])/g);
    return parseFloat(b[0]) * qton(b[1])
}
function qton(b) {
    var e = 1;
    b && ("K" == b.toUpperCase() ? e = 1E3 : "M" == b.toUpperCase() ? e = mi : "B" == b.toUpperCase() ? e = bi : "T" == b.toUpperCase() ? e = tri : "QA" == b.toUpperCase() ? e = 1E3 * tri : "QI" == b.toUpperCase() ? e = mi * tri : "SX" == b.toUpperCase() ? e = bi * tri : "SP" == b.toUpperCase() ? e = tri * tri : "OC" == b.toUpperCase() ? e = 1E3 * tri * tri : "NO" == b.toUpperCase() ? e = mi * tri * tri : "DE" == b.toUpperCase() && (e = bi * tri * tri));
    return e
}
function qtonTest(b) {
    for (var e = 0, d = 0; d < b; d++) {
        var g = Math.random() + .01;
        g = Math.pow(g, 10) * tri;
        var h = beauty(g);
        h = parseBeauty(h);
        var l = Math.abs(g - h) / Math.abs(g);
        1 > l && (e = Math.max(l, e),
        .1 < l && console.log(g + " " + h + " " + l))
    }
    console.log(e)
}
var rNum = "I II III IV V VI VII VIII IX X XI XII XIII XIV XV XVI XVII XVIII XIX XX".split(" ");
function romanize(b) {
    if (0 == b)
        return "";
    if (10 > b)
        return rNum[parseInt(b - 1)];
    if (40 > b) {
        for (var e = "", d = 0; d < parseInt(b / 10) % 10; d++)
            e += "X";
        return e += romanize(b % 10)
    }
    if (50 > b)
        return "XL" + romanize(b % 10);
    if (90 > b) {
        e = "L";
        var g = parseInt(b / 10) - 5;
        for (d = 0; d < g; d++)
            e += "X";
        return e + romanize(parseInt(b % 10))
    }
    if (100 > b)
        return "XC" + romanize(parseInt(b % 10));
    if (400 > b) {
        e = "";
        for (d = 0; d < parseInt(b / 100) % 10; d++)
            e += "C";
        return e + romanize(b % 100)
    }
}
function Artifact(b) {
    this.id = b.id;
    this.name = b.name;
    this.description = b.description || "";
    this.sticky = b.sticky || !1;
    this.activated = this.possessed = !1;
    this.action = b.action || function() {}
    ;
    this.unaction = b.unaction || function() {}
    ;
    this.collect = function() {
        this.possessed || (this.possessed = !0,
        this.action())
    }
    ;
    this.uncollect = function() {
        this.possessed && (this.possessed = !1,
        this.unaction())
    }
}
for (var artifacts = [], a = 0; a < artifactsDefinition.length; a++)
    artifacts.push(new Artifact(artifactsDefinition[a]));
function artifactsNumber() {
    for (var b = 0, e = 0; e < artifacts.length; e++)
        artifacts[e].possessed && b++;
    return b
}
function charactersNumber() {
    for (var b = 0, e = 0; e < characters.length; e++)
        characters[e].unlocked && b++;
    return b
}
var alphanumeric = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789012345678901234567890123456789"
  , numeric = "0123456789";
function randomString(b) {
    b = b || 8;
    for (var e = "", d = 0; d < b; d++)
        e += alphanumeric.charAt(Math.floor(Math.random() * alphanumeric.length));
    return e
}
function randomNumericString(b) {
    b = b || 6;
    for (var e = "", d = 0; d < b; d++)
        e += numeric.charAt(Math.floor(Math.random() * numeric.length));
    return e
}
function Article(b, e, d, g) {
    this.name = b;
    this.type = e;
    this.cost = [];
    for (b = 0; b < resNum; b++)
        this.cost[b] = 0;
    for (b = 0; b < g.length; b++)
        this.cost[g[b][0]] = g[b][1];
    this.prob = function() {}
    ;
    this.effect = function() {}
    ;
    this.desc = d
}
var questNames = [];
function Resource(b) {
    this.id = b.id;
    this.name = b.name;
    this.type = b.type || "ore";
    this.value = b.value || 0;
    this.requirement = {};
    for (var e in b.req)
        this.requirement[e] = b.req[e];
    this.quests = {};
    for (e in b.quests)
        this.quests[e] = questNames[e];
    this.prodValue = function(d) {
        for (var b = 0, h = 0, e = 0; e < d.planets.length; e++) {
            var u = planets[d.planets[e]];
            b += u.resources[this.id];
            h += u.globalProd[this.id] + u.globalImport[this.id] - u.globalExport[this.id]
        }
        return Math.log(1 + b) / 10 - Math.log(1 + Math.abs(h))
    }
    ;
    this.show = function(d) {
        var b = 0, h;
        for (h in this.requirement) {
            if (this.requirement[h] <= d.researches[researchesName[h]].level)
                return !0;
            b++
        }
        for (h in this.quests) {
            if (quests[questNames[h]].done)
                return !0;
            b++
        }
        return b ? !1 : !0
    }
}
var resources = []
  , resourcesName = [];
for (r = 0; r < resourcesDefinition.length; r++)
    resources[r] = new Resource(resourcesDefinition[r]),
    resources[r].id = r;
var resNum = resources.length
  , researchNum = 0
  , highlightRes = Array(resNum)
  , highlightProd = Array(resNum)
  , highlightCons = Array(resNum);
for (r = 0; r < resNum; r++)
    highlightRes[r] = !1,
    highlightProd[r] = !1,
    highlightCons[r] = !1;
for (r = resNum; r < 100 - resNum; r++)
    resources[r] = new Resource({
        id: r,
        name: "zzzplaceholder",
        type: "prod",
        req: {
            nononono: 3
        }
    });
var resourcesPrices = [.01, .1, 4.53, 9307.38, 141.77, 303.03, 8, 1.54, 5E3, 7.28, 28, 5E3, 907.3, 5E3, 66.36, 3.33, 810.26, 5580.62, 43.74, 92.49, 82.93, 73.46, 5E3, 13802.12, 16892.96, 4163.75, 62241.59, .12, 1.2, 1856.36, 22E3, 12989.2, 5E3, 5E5, 5E5, 5E5, 5E5, 5E5, 5E5, 5E5, 5E5];
for (r = 0; r < resources.length; r++)
    resourcesPrices[r] || (resourcesPrices[r] = 1);
for (r = 0; r < resourcesPrices.length; r++)
    resourcesPrices[r] /= 10,
    resources[r].value = 1 / resourcesPrices[r];
resources.energy = new Resource({
    id: "energy",
    name: "energy",
    type: "prod",
    value: 4
});
resources.researchPoint = new Resource({
    id: "research",
    name: "research point",
    type: "prod",
    value: 0
});
for (var i = 0; i < resNum; i++)
    resources[i].id = i,
    resourcesName[resources[i].name] = resources[i];
var resLoadAmmo = [GET_ENGINE_RESOURCE(), GET_AMMUNITION_RESOURCE(), GET_AMMUNITIONU_RESOURCE(), GET_AMMUNITIONT_RESOURCE(), GET_ARMOR_RESOURCE(), GET_SHIELD_RESOURCE(), GET_DARKMATTER_RESOURCE()]
  , FOOD_RESOURCE = GET_FOOD_RESOURCE()
  , ENGINE_RESOURCE = GET_ENGINE_RESOURCE()
  , AMMUNITION_RESOURCE = GET_AMMUNITION_RESOURCE()
  , AMMUNITIONU_RESOURCE = GET_AMMUNITIONU_RESOURCE()
  , AMMUNITIONT_RESOURCE = GET_AMMUNITIONT_RESOURCE()
  , ARMOR_RESOURCE = GET_ARMOR_RESOURCE()
  , SHIELD_RESOURCE = GET_SHIELD_RESOURCE();
function Building(b) {
    this.id = b.id;
    this.buildable = !0;
    b.notBuildable && (this.buildable = !1);
    this.name = b.name;
    this.displayName = b.displayName;
    this.description = b.description || "";
    this.resourcesCost = Array(resNum);
    this.resourcesLevel = Array(resNum);
    this.resourcesMult = Array(resNum);
    this.resourcesProd = Array(resNum);
    this.resourcesNeeded = [];
    for (var e = 0; e < resNum; e++)
        this.resourcesCost[e] = 0,
        this.resourcesLevel[e] = 0,
        this.resourcesMult[e] = 0,
        this.resourcesProd[e] = 0;
    this.researchReq = {};
    this.civis = null;
    b.cost = b.cost || [];
    b.extraCost = b.extraCost || [];
    b.prod = b.prod || [];
    b.mult = b.mult || [];
    b.req = b.req || {};
    for (e = 0; e < resNum; e++)
        this.resourcesCost[e] = b.cost[resources[e].name] || 0;
    for (e = 0; e < resNum; e++)
        this.resourcesLevel[e] = b.extraCost[resources[e].name] || 0;
    for (e = 0; e < resNum; e++)
        this.resourcesMult[e] = Math.floor(100 * (1 + (b.mult[resources[e].name] - 1) / dynamicBon)) / 100 || Math.floor(100 * (1 + .2 / dynamicBon)) / 100;
    var d = 0;
    for (e = 0; e < resNum; e++)
        this.resourcesProd[e] = b.prod[resources[e].name] || 0,
        0 > this.resourcesProd[e] && (this.resourcesNeeded[d] = e,
        d++);
    for (var g in b.req)
        this.researchReq[g] = b.req[g];
    this.moneyCost = b.moneyCost || 0;
    this.habitableSpace = b.space || 0;
    this.energy = b.energy || 0;
    this.population = b.population || 0;
    this.money = b.money || 0;
    this.researchPoint = b.researchPoint || 0;
    this.pollution = b.prod.pollution || 0;
    this.icon = b.icon || "void.png";
    this.extra = b.extra || !1;
    this.type = b.type || "other";
    this.type2 = b.type2 || "mine";
    this.environment = b.environment || defaultEnv;
    for (e = d = 0; e < resNum; e++)
        d += this.resourcesProd[e] * resources[e].value;
    d += this.energy * resources.energy.value;
    this.value = b.value || d;
    this.isActive = function(d) {
        return d.structure[this.id].active
    }
    ;
    this.showFood = !1;
    this.showRes = function(d) {
        for (var b in this.researchReq)
            if (this.researchReq[b] > researches[researchesName[b]].level)
                return !1;
        return !0
    }
    ;
    this.show = function(d) {
        for (var b in this.researchReq)
            if (this.researchReq[b] > civis[d.civis].researches[researchesName[b]].level)
                return !1;
        if (d) {
            var h = !1;
            for (b = 0; b < this.environment.length; b++)
                this.environment[b] == d.type && (h = !0);
            if (!h)
                return !1
        }
        !this.showFood && 0 < this.resourcesProd[FOOD_RESOURCE] && (1 >= game.planets.length || d.population < d.sustainable()) && (this.showFood = !0);
        return 0 == this.buildable && 1 > d.structure[this.id].number ? !1 : !0
    }
    ;
    this.atLeastOneResource = function(d) {
        var b = !1;
        if ("mining" == this.type)
            for (var h = 0; h < resNum; h++) {
                if (0 < this.resourcesProd[h] * d.baseResources[h]) {
                    b = !0;
                    break
                }
            }
        else
            b = !0;
        return b
    }
    ;
    this.rawProduction = function(d, b) {
        var h = []
          , e = 1;
        d.id == planetsName.kandi && artifacts[artifactsName.santa].possessed && (e *= 1.2);
        "terrestrial" == d.type && "Environmental Republic" == game.chosenGovern && "battery_charger" != this.name && (e *= 2);
        "acid" != d.type && "lava" != d.type || !artifacts[artifactsName.pillar_fire].possessed || (e *= 1.5);
        "terrestrial" != d.type && "desert" != d.type || !artifacts[artifactsName.pillar_earth].possessed || (e *= 1.5);
        "ice" != d.type && "ocean" != d.type || !artifacts[artifactsName.pillar_ice].possessed || (e *= 1.5);
        "gas giant" == d.type && artifacts[artifactsName.pillar_air].possessed && (e *= 1.5);
        h.energy = this.energy;
        for (var g = 0; g < resNum; g++)
            h[g] = this.resourcesProd[g] * idleBon;
        if ("mine" == this.type2) {
            for (g = 0; g < resNum; g++)
                h[g] = h[g] * d.baseResources[g] * e;
            h.energy = this.energy
        } else if ("prod" == this.type2) {
            for (g = 0; g < resNum; g++)
                1 < d.baseResources[g] && 0 < h[g] && "prod" == resources[g].type && (h[g] *= d.baseResources[g]);
            h.energy = this.energy
        }
        h.researchPoint = this.researchPoint * idleBon;
        "cryolab" == this.name && (h.researchPoint = 5 * h.researchPoint * -d.info.temp);
        "lavaresearch" == this.name && (h.researchPoint *= d.info.temp);
        "ammonia_airship" == this.name && (h.researchPoint *= d.info.radius);
        h.population = this.population * idleBon;
        h.pollution = this.pollution;
        return h
    }
    ;
    this.rprod = [];
    this.production = function(d) {
        for (var b = [], h = 0; h < resNum; h++)
            b[h] = 0,
            this.rprod[h] = 0;
        b.researchPoint = 0;
        b.energy = 0;
        b.population = 0;
        b.pollution = 0;
        this.rprod.researchPoint = 0;
        this.rprod.population = 0;
        this.rprod.energy = 0;
        this.rprod.pollution = 0;
        if (d.structure[this.id].active && 0 < d.structure[this.id].number) {
            var e = d.energyMalus();
            0 <= this.energy && (e = 1);
            var g = 1;
            d.id == planetsName.kandi && artifacts[artifactsName.santa].possessed && (g *= 1.2);
            "terrestrial" == d.type && "Environmental Republic" == game.chosenGovern && (g *= 2);
            "acid" != d.type && "lava" != d.type || !artifacts[artifactsName.pillar_fire].possessed || (g *= 1.5);
            "terrestrial" != d.type && "desert" != d.type || !artifacts[artifactsName.pillar_earth].possessed || (g *= 1.5);
            "ice" != d.type && "water" != d.type || !artifacts[artifactsName.pillar_ice].possessed || (g *= 1.5);
            "gas giant" == d.type && artifacts[artifactsName.pillar_air].possessed && (g *= 1.5);
            if ("mine" == this.type2) {
                h = 0;
                for (A in d.fleets)
                    h += d.fleets[A].ships[73];
                h = .2 * Math.log(2) * h / Math.log(2 + h);
                "Mining Corporation" == game.chosenGovern && (h *= 2);
                var A = 1 + h;
                for (h = 0; h < resNum; h++)
                    b[h] = this.resourcesProd[h] * d.baseResources[h] * e * A,
                    this.rprod[h] = b[h]
            } else if ("prod" == this.type2) {
                A = !1;
                for (h = 0; h < resNum; h++)
                    0 > d.resources[h] + d.structure[this.id].number * this.resourcesProd[h] ? (A = !0,
                    d.globalNoRes[this.id][h] = !0) : d.globalNoRes[this.id][h] = !1;
                if (A) {
                    for (h = 0; h < resNum; h++)
                        this.rprod[h] = this.resourcesProd[h] * e,
                        1 < d.baseResources[h] && 0 < b[h] && "prod" == resources[h].type && (this.rprod[h] *= d.baseResources[h]);
                    this.rprod.researchPoint = this.researchPoint * e;
                    this.rprod.population = this.population * e
                } else {
                    for (h = 0; h < resNum; h++)
                        b[h] = this.resourcesProd[h] * e,
                        1 < d.baseResources[h] && 0 < b[h] && "prod" == resources[h].type && (b[h] *= d.baseResources[h]),
                        this.rprod[h] = b[h];
                    b.researchPoint = this.researchPoint * e;
                    b.population = this.population * e;
                    this.rprod.researchPoint = b.researchPoint;
                    this.rprod.population = b.population
                }
            }
            for (h = 0; h < resNum; h++)
                b[h] = b[h] * d.structure[this.id].number * idleBon,
                this.rprod[h] = this.rprod[h] * d.structure[this.id].number * idleBon,
                0 < b[h] && (b[h] *= g),
                0 < this.rprod[h] && (this.rprod[h] *= g);
            b.researchPoint = b.researchPoint * d.structure[this.id].number * idleBon;
            "cryolab" == this.name && (b.researchPoint = 5 * b.researchPoint * -d.info.temp);
            "lavaresearch" == this.name && (b.researchPoint *= d.info.temp);
            "ammonia_airship" == this.name && (b.researchPoint *= d.info.radius);
            b.population = b.population * d.structure[this.id].number * idleBon;
            b.pollution = d.structure[this.id].number * this.pollution * e - d.pollutionRate;
            b.energy = this.energyUsage(d);
            this.rprod.researchPoint = this.rprod.researchPoint * d.structure[this.id].number * idleBon;
            "cryolab" == this.name && (this.rprod.researchPoint = 5 * this.rprod.researchPoint * -d.info.temp);
            "lavaresearch" == this.name && (this.rprod.researchPoint *= d.info.temp);
            this.rprod.population = this.rprod.population * d.structure[this.id].number * idleBon;
            this.rprod.pollution = b.pollution;
            this.rprod.energy = b.energy
        }
        return b
    }
    ;
    this.energyUsage = function(d) {
        var b = 0;
        if (d.structure[this.id].active && 0 < d.structure[this.id].number) {
            if ("solar" == this.type2)
                b = this.energy / (d.info.orbit * d.info.orbit);
            else if ("prod" == this.type2 || "mine" == this.type2) {
                for (var h = !1, e = 0; e < this.resourcesNeeded.length; e++) {
                    var g = this.resourcesNeeded[e];
                    if (0 > d.resources[g] + d.structure[this.id].number * this.resourcesProd[g]) {
                        h = !0;
                        break
                    }
                }
                h || (b = this.energy)
            }
            b *= d.structure[this.id].number
        }
        return b
    }
    ;
    this.produce = function(d, b) {
        if (d.structure[this.id].active) {
            for (var h = this.production(d), e = 0; e < resNum; e++)
                d.resourcesAdd(e, h[e] / b);
            null != d.civis && (civis[d.civis].researchPoint += h.researchPoint / b);
            d.populationAdd(h.population / b);
            d.pollutionAdd(h.pollution / b)
        }
    }
}
function buildingLoader(b, e) {
    b.civis = e.civis;
    b.active = e.active
}
function buildingSaver(b) {
    var e = {};
    e.civis = b.civis;
    e.active = b.active;
    return e
}
function PlanetBuilding(b, e, d, g) {
    this.building = e;
    this.number = d;
    this.planet = b;
    this.active = g || !0;
    this.showUI = !0;
    this.setShow = function(d) {
        this.showUI = d
    }
    ;
    this.setActive = function(d) {
        this.active = d
    }
    ;
    this.cost = function(d) {
        if (null != planets[this.planet].civis) {
            var b = buildings[this.building];
            return Math.floor(b.resourcesCost[d] * Math.pow(b.resourcesMult[d], this.number))
        }
        return 0
    }
    ;
    this.totalCost = function(d, b) {
        return isFinite(b) ? planets[this.planet].showBuyCostRaw(this.building, d, b) : planets[this.planet].showBuyCostRaw(this.building, d)
    }
    ;
    this.totalCostQueue = function(d) {
        var b = 0;
        for (h in planets[this.planet].queue)
            if (planets[this.planet].queue[h].b == this.building) {
                b = planets[this.planet].queue[h].n;
                break
            }
        var h = Array(resNum);
        for (var e = 0; e < resNum; e++)
            h[e] = 0;
        if (null != planets[this.planet].civis) {
            e = buildings[this.building];
            for (var g = 0; g < resNum; g++)
                0 < e.resourcesCost[g] && (h[g] = Math.floor((Math.pow(e.resourcesMult[g], this.number + b + d) - Math.pow(e.resourcesMult[g], this.number + b)) / (e.resourcesMult[g] - 1) * e.resourcesCost[g]))
        }
        return h
    }
    ;
    this.showCost = function(d, b) {
        var h = buildings[this.building];
        return Math.floor(h.resourcesCost[d] * Math.pow(h.resourcesMult[d], b))
    }
    ;
    this.value = function() {
        for (var d = 0, b = 0; b < resNum; b++)
            d += this.cost(b) * resources[b].value;
        return buildings[this.building].value / d
    }
}
function PlanetBuilder(b, e, d, g, h, l) {
    return new Planet({
        id: b,
        name: e,
        resources: {
            iron: d,
            hydrogen: g
        },
        icon: h,
        pos: l
    })
}
function StationPiece(b) {
    this.id = b.id;
    this.name = b.name;
    this.requirement = b.requirement || function() {
        return !0
    }
    ;
    this.available = function() {
        return this.requirement() ? !0 : !1
    }
}
function Planet(b) {
    this.region = b.region;
    this.id = b.id;
    this.img = b.img;
    this.name = b.name;
    this.civis = null;
    this.type = b.type || "Planet";
    this.unlock = b.unlock || null;
    this.artifact = b.artifact || 0;
    this.influence = b.influence || 1;
    this.station = [];
    this.map = 0;
    this.queue = {};
    this.places = [];
    this.raidCounter = 0;
    this.exportBlueprint = function() {
        for (var d = {
            mining: [],
            prod: [],
            energy: [],
            research: [],
            other: []
        }, b = 0; b < buildings.length; b++) {
            var h = buildings[b].atLeastOneResource(this);
            buildings[b].show(this) && h && 0 < this.structure[b].number && buildings[b].type && d[buildings[b].type].push({
                bid: b,
                num: this.structure[b].number
            })
        }
        b = {
            mining: "Extraction",
            prod: "Production",
            energy: "Energy",
            research: "Research",
            other: "Other"
        };
        h = "";
        for (var e in d) {
            h += "#" + b[e];
            for (var u = d[e], v = 0; v < u.length; v++)
                0 < u[v].num && (h += " " + replaceWith(buildings[u[v].bid].displayName, " ", "_") + " " + u[v].num);
            h += "\n"
        }
        return h
    }
    ;
    this.importBlueprint = function(d) {
        var b = !0
          , h = ""
          , e = d.split(/[ \t\r\n]+/);
        d = [];
        if (0 < e.length) {
            for (var u = 0; u < e.length; u++) {
                var v = e[u];
                if (0 < v.length && "#" != v[0]) {
                    var y = searchBuildingByName(v, !1);
                    if (-1 < y)
                        if (buildings[y].show(this) || (y = searchBuildingByName(v, !0)),
                        u++,
                        u < e.length) {
                            var A = parseInt(e[u]);
                            0 <= A ? (v = A - this.structure[y].number - this.searchQueue(y),
                            0 < v && buildings[y].show(this) && buildings[y].atLeastOneResource(this) && d.push({
                                bid: y,
                                num: v
                            })) : (b = !1,
                            h = "Invalid number of " + v + ": " + e[u])
                        } else
                            b = !1,
                            h = "Invalid number of " + v + ": " + e[u];
                    else
                        b = !1,
                        h = "Invalid building: " + v
                }
            }
            0 == d.length && (b = !1,
            h = "No buildings to add");
            if (b) {
                for (h = 0; h < d.length; h++)
                    this.addQueue(d[h].bid, d[h].num);
                h = "Buildings inserted in queue"
            }
        } else
            b = !1,
            h = "Invalid setting";
        return {
            result: b,
            info: h
        }
    }
    ;
    this.hasEnemyNeighbour = function() {
        for (var d = !1, b = 0; b < this.routes.length; b++)
            this.civis != planets[this.routes[b].other(this.id)].civis && (d = !0);
        return d
    }
    ;
    this.hasPlayerNeighbour = function() {
        for (var d = !1, b = 0; b < this.routes.length; b++)
            planets[this.routes[b].other(this.id)].civis == game.id && (d = !0);
        return d
    }
    ;
    this.compactQueue = function() {
        var d = 0, b;
        for (b in this.queue)
            d++;
        for (b = 0; b < d; b++)
            if (!this.queue[b]) {
                for (var h = b + 1; !this.queue[h] && 1E3 > h; )
                    h++;
                this.queue[b] = this.queue[h];
                delete this.queue[h]
            }
    }
    ;
    this.onConquer = b.onConquer || function() {}
    ;
    this.history = "";
    this.routes = [];
    this.shortestPath = [];
    b.res = b.res || [];
    b.baseRes = b.baseRes || [];
    this.resources = Array(resNum);
    this.resourcesRequest = Array(resNum);
    this.baseResources = Array(resNum);
    for (var e = 0; e < resNum; e++)
        this.resources[e] = 0,
        this.resourcesRequest[e] = 0,
        this.baseResources[e] = 0;
    for (e = 0; e < resNum; e++)
        this.baseResources[e] = "ore" == resources[e].type ? b.baseRes[resources[e].name] || 0 : b.baseRes[resources[e].name] || 1;
    this.population = this.energy = 0;
    this.basePopulation = b.baseRes.population || 0;
    this.populationDecay = b.populationDecay || .01;
    this.pollution = 0;
    this.pollutionRate = b.baseRes.pollution || 1;
    this.structure = [];
    this.icon = b.icon || "void.png";
    this.info = b.info || new PlanetInfo(0,0,"",0,[]);
    this.civis = null;
    b.pos && (this.x = b.pos[0] || 0,
    this.y = b.pos[1] || 0);
    this.bombsDropped = 0;
    this.fleets = {};
    this.autofleets = [];
    this.autoPush = function(d) {
        this.fleetPush2(d, this.autofleets)
    }
    ;
    this.fleetPush = function(d) {
        null != d ? this.fleetPush2(d, this.fleets) : console.log(d)
    }
    ;
    this.fleetPush2 = function(d, b) {
        if (null != d) {
            for (var h = 0; null != b[h]; )
                h++;
            b[h] = d
        } else
            console.log("x" + d)
    }
    ;
    this.searchFleetByName = function(d) {
        return this.searchFleetByName2(d, this.fleets).found
    }
    ;
    this.searchAutoFleetByName = function(d) {
        return this.searchFleetByName2(d, this.autofleets).found
    }
    ;
    this.searchFleetByName2 = function(d, b) {
        var h = -1;
        for (h in b)
            if (b[h] && b[h].name && b[h].name == d)
                return {
                    found: !0,
                    id: h
                };
        return {
            found: !1,
            id: h
        }
    }
    ;
    this.searchCivisFleet = function(d) {
        var b = !1, h;
        for (h in this.fleets)
            if (0 != h && "hub" != h && this.fleets[h].civis == d) {
                b = !0;
                break
            }
        return b
    }
    ;
    this.raid = function(d) {
        console.log("RAAAAID")
    }
    ;
    this.totalResourcesInQueue = function() {
        for (var d = Array(resNum), b = 0; b < resNum; b++)
            d[b] = 0;
        for (var h in this.queue)
            if (this.queue[h]) {
                var e = this.structure[this.queue[h].b].totalCost(this.queue[h].n);
                for (b = 0; b < resNum; b++)
                    d[b] += e[b]
            }
        return d
    }
    ;
    this.totalResourcesInQueueSingle = function(d) {
        var b = 0, h;
        for (h in this.queue)
            if (this.queue[h]) {
                var e = this.structure[this.queue[h].b].totalCost(this.queue[h].n, d);
                b += e[d]
            }
        return b
    }
    ;
    this.changeTemp = function(d) {
        "ocean" == this.type ? 1 > this.info.temp ? this.type = "ice" : 99 < this.info.temp && (this.type = "desert") : "ice" == this.type ? 0 < this.info.temp && (this.type = "ocean") : "desert" == this.type ? 800 <= this.info.temp && (this.type = "lava") : "lava" == this.type ? 800 > this.info.temp && (this.type = "desert") : "terrestrial" == this.type ? 80 < this.info.temp && (this.type = "desert") : "terrestrial" == this.type && -30 > this.info.temp && (this.type = "ice");
        this.info.temp += d;
        if (10 > this.info.temp && 0 > d) {
            var b = .1 * this.baseResources[resourcesName.water.id] * d * Math.pow(1.121, 10 - this.info.temp);
            this.baseResources[resourcesName.water.id] += b;
            this.baseResources[resourcesName.ice.id] -= b;
            0 > this.baseResources[resourcesName.water.id] && (this.baseResources[resourcesName.water.id] = 0);
            0 > this.baseResources[resourcesName.ice.id] && (this.baseResources[resourcesName.ice.id] = 0)
        } else
            0 <= this.info.temp && 30 >= this.info.temp && 0 < d ? (b = .08 * this.baseResources[resourcesName.ice.id] * d * Math.pow(1.08, this.info.temp),
            this.baseResources[resourcesName.ice.id] -= b,
            this.baseResources[resourcesName.water.id] += b,
            0 > this.baseResources[resourcesName.water.id] && (this.baseResources[resourcesName.water.id] = 0),
            0 > this.baseResources[resourcesName.ice.id] && (this.baseResources[resourcesName.ice.id] = 0)) : 90 <= this.info.temp && 0 < d && (b = .1 * this.baseResources[resourcesName.water.id] * d * Math.pow(1.08, this.info.temp - 90),
            this.baseResources[resourcesName.water.id] -= b,
            0 > this.baseResources[resourcesName.water.id] && (this.baseResources[resourcesName.water.id] = 0),
            b = .1 * this.baseResources[resourcesName.ice.id] * d * Math.pow(1.08, this.info.temp - 90),
            this.baseResources[resourcesName.ice.id] -= b,
            0 > this.baseResources[resourcesName.ice.id] && (this.baseResources[resourcesName.ice.id] = 0))
    }
    ;
    this.destroyIncompatible = function() {}
    ;
    this.setCivis = function(d) {
        this.civis = d;
        civis[d].pushPlanet(this.id)
    }
    ;
    this.resourcesAdd = function(d, b, h) {
        isNaN(b) && (b = 0);
        this.resources[d] += b;
        0 > this.resources[d] && (this.resources[d] = 0);
        h || (0 < this.resourcesRequest[d] && (this.resourcesRequest[d] -= b),
        0 > this.resourcesRequest[d] && (this.resourcesRequest[d] = 0),
        h = this.totalResourcesInQueueSingle(d),
        0 < h && 0 == this.resourcesRequest[d] && 0 > b && 0 > this.resources[d] - b - h && (this.resourcesRequest[d] = -b))
    }
    ;
    this.populationAdd = function(d) {
        isNaN(d) && (d = 0);
        this.population += d;
        0 > this.population && (this.population = 0);
        this.population > this.habitableSpace() && (this.population = this.habitableSpace());
        isNaN(this.population) && (this.population = 1E3 * this.basePopulation)
    }
    ;
    this.pollutionAdd = function(d) {
        this.pollution += d;
        0 > this.pollution && (this.pollution = 0)
    }
    ;
    this.habitableSpace = function() {
        for (var d = this.sustainable(), b = 0; b < this.structure.length; b++)
            d += buildings[b].habitableSpace * this.structure[b].number;
        return Math.max(Math.min(this.maxPopulation, d), 0)
    }
    ;
    this.maxPopulation = 400 * this.info.radius * this.info.radius;
    this.sustainable = function() {
        return (1 + 10 * this.basePopulation) * this.info.radius * this.baseResources[FOOD_RESOURCE]
    }
    ;
    this.populationRatio = 0;
    this.growPopulation = function(d) {
        d = d * idleBon || 1;
        var b = 0;
        if (gameSettings.populationEnabled) {
            if (this.population < this.sustainable())
                b = this.population * (this.basePopulation + .01 * this.structure[buildingsName.clonation].number) / 360;
            else if (0 < this.resources[FOOD_RESOURCE]) {
                b = this.population * (this.basePopulation + .01 * this.structure[buildingsName.clonation].number) / 360;
                var h = (this.population - this.sustainable()) / 5E3 * d;
                0 > h && (h = 0);
                this.resources[FOOD_RESOURCE] < h && (b = .01 * -this.population);
                this.resourcesAdd(FOOD_RESOURCE, -h)
            } else
                b = .01 * -this.population / 360;
            this.populationAdd(b * d)
        }
        return this.populationRatio = b
    }
    ;
    this.energyMalus = function() {
        var d = 1;
        0 != this.energyConsumption() && (d = this.energyProduction() / -this.energyConsumption());
        1 < d && (d = 1);
        0 > d && (d = 0);
        return d
    }
    ;
    this.lastCheck = this.lastTime = (new Date).getTime();
    this.lastRes = Array(resNum);
    this.lastRes2 = Array(resNum);
    this.lastProd = Array(resNum);
    this.lastProd2 = Array(resNum);
    this.globalProd = Array(resNum);
    this.globalRaw = Array(resNum);
    this.globalImpExpProd = Array(resNum);
    this.globalImport = Array(resNum);
    this.globalExport = Array(resNum);
    this.globalNoRes = [];
    for (e = 0; e < resNum; e++)
        this.lastRes[e] = 0,
        this.lastRes2[e] = 0,
        this.lastProd[e] = 0,
        this.lastProd2[e] = 0,
        this.globalProd[e] = 0,
        this.globalRaw[e] = 0,
        this.globalImpExpProd[e] = 0,
        this.globalImport[e] = 0,
        this.globalExport[e] = 0;
    this.globalProd.researchPoint = 0;
    this.globalProd.population = 0;
    this.lastRes.population = 0;
    this.lastRes.pollution = 0;
    this.lastRes.researchPoint = 0;
    this.lastVolte = 12;
    this.lastCheck2 = this.lastTime;
    this.removeRequest = function(d, b) {
        for (var h = this.structure[d].totalCost(b), e = 0; e < resNum; e++)
            this.resourcesRequest[e] -= h[e],
            0 > this.resourcesRequest[e] && (this.resourcesRequest[e] = 0)
    }
    ;
    this.addRequest = function(d, b, h) {
        d = h ? this.structure[d].totalCostQueue(b) : this.structure[d].totalCost(b);
        b = [];
        for (h = 0; h < resNum; h++)
            b[h] = 0;
        for (var e in this.queue)
            if (this.queue[e]) {
                var g = this.structure[this.queue[e].b].totalCost(this.queue[e].n);
                for (h = 0; h < resNum; h++)
                    b[h] += Math.floor(g[h])
            }
        for (e = 0; e < resNum; e++)
            d[e] = Math.max(d[e] - Math.max(Math.floor(this.resources[e]) - b[e], 0), 0),
            0 < d[e] && (this.resourcesRequest[e] += Math.ceil(d[e]))
    }
    ;
    this.removeQueue = function(d) {
        for (var b in this.queue)
            if (this.queue[b].b == d) {
                this.removeRequest(d, this.queue[b].n);
                delete this.queue[b];
                break
            }
    }
    ;
    this.searchQueue = function(d) {
        for (var b in this.queue)
            if (this.queue[b].b == d)
                return this.queue[b].n;
        return 0
    }
    ;
    this.addQueue = function(d, b) {
        var h = !1, e;
        for (e in this.queue)
            if (this.queue[e].b == d) {
                h = !0;
                this.addRequest(d, b, !0);
                this.queue[e].n += b;
                break
            }
        if (!h) {
            for (h = 0; this.queue[h]; )
                h++;
            this.addRequest(d, b, !1);
            this.queue[h] = {
                b: d,
                n: b,
                q: b
            }
        }
        buildQueue()
    }
    ;
    this.subQueue = function(d, b) {
        for (var h in this.queue)
            if (this.queue[h].b == d) {
                this.queue[h].n -= b;
                0 > this.queue[h].n && (this.queue[h].n = 0);
                break
            }
    }
    ;
    this.rawProduction = function() {
        return this.globalProd
    }
    ;
    this.structureAffordable = function(d) {
        for (var b in buildings[d].researchReq)
            if (buildings[d].researchReq[b] > researchesName[b].level)
                return !1;
        for (b = 0; b < resNum; b++)
            if (this.structure[d].cost(b) - 8.21E-13 > this.resources[b])
                return !1;
        return !0
    }
    ;
    this.structureAffordablePct = function(d, b) {
        for (var h in buildings[d].researchReq)
            if (buildings[d].researchReq[h] > researchesName[h].level)
                return !1;
        for (h = 0; h < resNum; h++)
            if (this.structure[d].cost(h) * b > this.resources[h])
                return !1;
        return !0
    }
    ;
    this.buyStructure = function(d) {
        if (this.structureAffordable(d)) {
            for (var b = 0; b < resNum; b++)
                this.resourcesAdd(b, -this.structure[d].cost(b)),
                this.lastRes[b] -= this.structure[d].cost(b);
            this.structure[d].number += 1;
            return !0
        }
        return !1
    }
    ;
    this.buyMultipleStructure = function(d, b, h) {
        var e = !1;
        if (this.structureAffordable(d)) {
            var g = this.showBuyCostRaw(d, b);
            e = !0;
            for (var v = 0; v < resNum; v++)
                g[v] > this.resources[v] && (0 == this.resources[v] || 8.22E-13 < Math.abs(g[v] - this.resources[v]) / g[v]) && (e = !1);
            if (e) {
                for (e = 0; e < b; e++) {
                    for (v = 0; v < resNum; v++)
                        g = this.structure[d].cost(v),
                        0 < g && (this.resourcesAdd(v, -g, h),
                        this.lastRes[v] -= g);
                    this.structure[d].number += 1
                }
                h || this.subQueue(d, b);
                return !0
            }
        }
        if (gameSettings.useQueue && !e && !h && (0 < game.timeTravelNum || 1 < game.planets.length))
            this.addQueue(d, b);
        else
            return e
    }
    ;
    this.sellStructure = function(d) {
        if (0 < this.structure[d].number) {
            this.structure[d].number--;
            for (var b = 0; b < resNum; b++)
                this.resourcesAdd(b, this.structure[d].cost(b) / 2),
                this.lastRes[b] += this.structure[d].cost(b) / 2;
            return !0
        }
        return !1
    }
    ;
    this.sellMultipleStructure = function(d, b) {
        if (this.structure[d].number >= b) {
            for (var h = 0; h < b; h++) {
                this.structure[d].number--;
                for (var e = 0; e < resNum; e++)
                    this.resourcesAdd(e, this.structure[d].cost(e) / 2),
                    this.lastRes[e] += this.structure[d].cost(e) / 2
            }
            return !0
        }
        return !1
    }
    ;
    this.showSellCost = function(d, b) {
        if (this.structure[d].number >= b) {
            for (var e = "<span class='blue_text'>You get 50% of the cost back:</span>", g = Array(resNum), u = 0; u < g.length; u++)
                g[u] = 0;
            if (null != this.civis)
                for (var v = 0; v < b; v++)
                    for (u = 0; u < resNum; u++)
                        g[u] += this.structure[d].showCost(u, this.structure[d].number - v - 1);
            for (u = 0; u < resNum; u++)
                0 < g[u] && (e += "<br><span class='blue_text'>" + resources[u].name.capitalize() + ": </span><span class='white_text'>" + beauty(Math.floor(g[u] / 2)) + "</span>");
            return e
        }
        return "<span class='red_text red_text_shadow'>You don't have " + b + " buildings</span>"
    }
    ;
    this.showBuyCostRawOld = function(d, b) {
        for (var e = Array(resNum), g = 0; g < e.length; g++)
            e[g] = 0;
        if (null != this.civis)
            for (var u = 0; u < b; u++)
                for (g = 0; g < resNum; g++)
                    e[g] += this.structure[d].showCost(g, this.structure[d].number + u);
        return e
    }
    ;
    this.showBuyCostRaw = function(d, b) {
        for (var e = Array(resNum), g = 0; g < e.length; g++)
            e[g] = 0;
        if (null != this.civis)
            for (g = 0; g < resNum; g++) {
                var u = buildings[this.structure[d].building]
                  , v = Math.pow(u.resourcesMult[g], this.structure[d].number);
                e[g] += Math.floor(u.resourcesCost[g] * v);
                for (var y = 1; y < b; y++)
                    v *= u.resourcesMult[g],
                    e[g] += Math.floor(u.resourcesCost[g] * v)
            }
        return e
    }
    ;
    this.showBuyCostRawSingle = function(d, b, e) {
        var h = 0;
        if (null != this.civis)
            for (var g = 0; g < b; g++)
                h += this.structure[d].showCost(e, this.structure[d].number + g);
        return h
    }
    ;
    this.showBuyCost = function(d, b) {
        for (var e = "<span class='blue_text'>Total cost for " + b + " buildings:</span>", g = this.showBuyCostRaw(d, b), u = 0; u < resNum; u++)
            0 < g[u] && (e = this.resources[u] < g[u] ? e + ("<br><span class='red_text'>" + resources[u].name.capitalize() + ": " + beauty(g[u]) + "</span>") : e + ("<br><span class='blue_text'>" + resources[u].name.capitalize() + ": </span><span class='white_text'>" + beauty(g[u]) + "</span>"));
        return e
    }
    ;
    this.shipAffordable = function(d) {
        for (var b = 0; b < resNum; b++)
            if (ships[d].cost[b] > this.resources[b])
                return !1;
        return this.population < ships[d].population ? !1 : !0
    }
    ;
    this.buyShip = function(d) {
        if (this.shipAffordable(d) && this.shipyardFleet) {
            for (var b = 0; b < resNum; b++)
                this.resourcesAdd(b, -ships[d].cost[b]),
                this.lastRes[b] -= ships[d].cost[b];
            this.populationAdd(-ships[d].population);
            this.shipyardFleet.ships[d] += 1;
            this.shipyardFleet.name = this.shipyardFleet.fleetType() + " Y" + Math.floor(game.days / 365) + "-D" + Math.floor(game.days % 365);
            return !0
        }
        return !1
    }
    ;
    this.sellShip = function(d) {
        if (this.shipyardFleet && 0 < this.shipyardFleet.ships[d]) {
            this.shipyardFleet.ships[d]--;
            this.shipyardFleet.name = this.shipyardFleet.fleetType() + " Y" + Math.floor(game.days / 365) + "-D" + Math.floor(game.days % 365);
            for (var b = 0; b < resNum; b++)
                this.resourcesAdd(b, ships[d].cost[b] / 2),
                this.lastRes[b] += ships[d].cost[b] / 2;
            return !0
        }
        return !1
    }
    ;
    this.buyMultipleShip = function(d, b) {
        if (this.shipAffordable(d) && this.shipyardFleet) {
            for (var e = Array(resNum), g = 0; g < resNum; g++)
                e[g] = ships[d].cost[g] * b;
            for (g = 0; g < resNum; g++)
                if (e[g] > this.resources[g])
                    return !1;
            for (g = 0; g < resNum; g++)
                this.resourcesAdd(g, -e[g]),
                this.lastRes[g] -= e[g];
            this.shipyardFleet.ships[d] += b;
            this.shipyardFleet.name = this.shipyardFleet.fleetType() + " Y" + Math.floor(game.days / 365) + "-D" + Math.floor(game.days % 365);
            return !0
        }
        return !1
    }
    ;
    this.maxMultipleShip = function(d) {
        if (this.shipAffordable(d) && this.shipyardFleet) {
            for (var b = 1E100, e = 0; e < resNum; e++)
                if (0 < ships[d].cost[e]) {
                    var l = this.resources[e] / ships[d].cost[e];
                    l < b && (b = l)
                }
            return b
        }
        return 0
    }
    ;
    this.showBuyShipCost = function(b, e) {
        if (this.shipyardFleet) {
            for (var d = "<span class='blue_text'>Total cost for " + e + " spaceships:</span>", g = Array(resNum), u = 0; u < resNum; u++)
                g[u] = ships[b].cost[u] * e;
            for (u = 0; u < resNum; u++)
                0 < g[u] && (d = this.resources[u] < g[u] ? d + ("<br><span class='red_text'>" + resources[u].name.capitalize() + ": </span><span class='white_text'>" + beauty(g[u]) + "</span>") : d + ("<br><span class='blue_text'>" + resources[u].name.capitalize() + ": </span><span class='white_text'>" + beauty(g[u]) + "</span>"));
            return d
        }
        return "<span class='red_text'>Ops #1!</span>"
    }
    ;
    this.showSellShipCost = function(b, e) {
        if (this.shipyardFleet) {
            for (var d = "<span class='blue_text'>You get 100% of the cost back:</span>", g = Array(resNum), u = 0; u < resNum; u++)
                g[u] = ships[b].cost[u] * e;
            if (this.shipyardFleet.ships[b] >= e) {
                for (u = 0; u < resNum; u++)
                    0 < g[u] && (d += "<br><span class='blue_text'>" + resources[u].name.capitalize() + ": </span><span class='white_text'>" + beauty(g[u]) + "</span>");
                return d
            }
            return "<span class='red_text'>You don't have " + e + " space ships</span>"
        }
        return "<span class='red_text'>Ops #2!</span>"
    }
    ;
    this.sellMultipleShip = function(b, e) {
        if (this.shipyardFleet && this.shipyardFleet.ships[b] >= e) {
            this.shipyardFleet.ships[b] -= e;
            this.shipyardFleet.name = this.shipyardFleet.fleetType() + " Y" + Math.floor(game.days / 365) + "-D" + Math.floor(game.days % 365);
            for (var d = 0; d < resNum; d++)
                this.resourcesAdd(d, ships[b].cost[d] * e),
                this.lastRes[d] += ships[b].cost[d] * e;
            return !0
        }
        return !1
    }
    ;
    this.energyProduction = function() {
        var b = 0;
        if (null != this.civis)
            for (var e = 0; e < energyBuildings.length; e++) {
                var h = buildings[energyBuildings[e]].energyUsage(this);
                b += h
            }
        return b
    }
    ;
    this.energyConsumption = function() {
        var b = 0;
        if (null != this.civis)
            for (var e = 0; e < unenergyBuildings.length; e++)
                b += buildings[unenergyBuildings[e]].energyUsage(this);
        return b
    }
    ;
    this.produce = function(b) {
        for (var d = 0; d < this.globalProd.length; d++)
            this.globalProd[d] = 0,
            this.globalRaw[d] = 0;
        this.globalProd.researchPoint = 0;
        this.globalProd.population = 0;
        this.globalRaw.researchPoint = 0;
        for (var e = this.globalRaw.population = 0; e < this.structure.length; e++)
            if (0 < this.structure[e].number && this.structure[e].active) {
                var l = buildings[e].production(this)
                  , u = buildings[e].rprod;
                for (d = 0; d < resNum; d++)
                    this.globalProd[d] += l[d],
                    game.totalProd[d] += l[d],
                    this.globalRaw[d] += Math.min(l[d], u[d]);
                this.globalProd.researchPoint += l.researchPoint;
                this.globalProd.population += l.population;
                this.globalRaw.researchPoint += u.researchPoint;
                this.globalRaw.population += u.population
            }
        for (d = 0; d < resNum; d++)
            e = 0,
            NEW_AUTOROUTES && (e = this.globalImport[d] - this.globalExport[d]),
            this.resourcesAdd(d, (this.globalProd[d] + e) * b);
        this.populationAdd(this.globalProd.population * b);
        for (d = 0; d < this.globalProd.length; d++)
            this.globalImpExpProd[d] = this.globalProd[d] + this.globalImport[d] - this.globalExport[d]
    }
    ;
    this.importExport = function() {
        var d = [];
        if (NEW_AUTOROUTES)
            for (var b = 0; b < game.planets.length; b++)
                for (var e = planets[game.planets[b]], l = 0; l < e.autofleets.length; l++) {
                    var u = e.autofleets[l];
                    d.push({
                        destination: u.destination,
                        origin: u.origin,
                        fleetObj: u,
                        type: "auto"
                    })
                }
        else
            d = fleetSchedule.civisFleet(game.id);
        this.importExport2(d)
    }
    ;
    this.importExport2 = function(d) {
        for (var b = Array(resNum), e = Array(resNum), l = Array(planets.length), u = 0; u < resNum; u++)
            b[u] = 0,
            e[u] = 0;
        for (var v = 0; v < planets.length; v++)
            for (l[v] = Array(resNum),
            u = 0; u < resNum; u++)
                l[v][u] = 0;
        for (l = 0; l < d.length; l++)
            if (d[l] && "auto" == d[l].type) {
                v = d[l].fleetObj;
                var y = parseInt(Math.floor(2 * planets[d[l].origin].shortestPath[d[l].destination].distance / v.speed()));
                if (d[l].origin == this.id || d[l].destination == this.id) {
                    var A = d[l].origin == this.id ? d[l].destination : d[l].origin;
                    for (u = 0; u < resNum; u++) {
                        var E = 1 - v.autoMap[this.id];
                        v.autoRes[v.autoMap[this.id]] && v.autoRes[v.autoMap[A]] && (v.autoPct[u] ? (0 < this.globalProd[u] && (e[u] += this.globalProd[u] * v.autoRes[v.autoMap[this.id]][u] / 1E4),
                        0 >= planets[A].globalProd[u] && (e[u] += -(planets[A].globalProd[u] * v.autoRes[v.autoMap[A]][u] / 1E4))) : e[u] += v.autoRes[v.autoMap[this.id]][u] / y * idleBon,
                        v.autoPct[u] ? (0 >= this.globalProd[u] && (b[u] += -(this.globalProd[u] * v.autoRes[v.autoMap[this.id]][u] / 1E4)),
                        0 < planets[A].globalProd[u] && (b[u] += planets[A].globalProd[u] * v.autoRes[v.autoMap[A]][u] / 1E4)) : b[u] += v.autoRes[E][u] / y * idleBon)
                    }
                }
            }
        this.globalImport = b;
        this.globalExport = e
    }
}
function settingsLoader(b) {
    for (var e in gameSettings)
        gameSettings[e] = b[e] || gameSettingsReset[e] || !1;
    gameSettings.civis || (gameSettings.civis = "0");
    gameSettings.gamePaused ? $("#pause_button").attr("src", "" + UI_FOLDER + "/arrow_small.png") : $("#pause_button").attr("src", "" + UI_FOLDER + "/pause.png");
    gameSettings.textSize >= MIN_TEXT_SIZE && gameSettings.textSize <= MAX_TEXT_SIZE && $("body").css("font-size", gameSettings.textSize * textSizeCSSfactor + "" + textSizeCSSunit)
}
function planetLoader30(b, e) {
    for (var d = 0; d < resNum; d++)
        b.resources[d] = e.resources[d] ? e.resources[d] : 0,
        b.resourcesRequest[d] = e.resourcesRequest && e.resourcesRequest[d] ? e.resourcesRequest[d] : 0;
    b.queue = e.q || {};
    b.energy = e.energy;
    b.population = e.pop || 0;
    $.isNumeric(b.population) || (b.population = b.sustainable());
    b.structure = [];
    for (d = 0; d < buildings.length; d++)
        e.structure[d] ? e.structure[d].n ? (b.structure[d] = new PlanetBuilding(b.id,d,e.structure[d].n),
        e.structure[d].a && (b.structure[d].active = !1)) : e.structure[d].number ? (b.structure[d] = new PlanetBuilding(b.id,d,e.structure[d].number),
        b.structure[d].active = e.structure[d].active) : b.structure[d] = new PlanetBuilding(b.id,d,0) : b.structure[d] = new PlanetBuilding(b.id,d,0);
    b.civis = e.civis;
    var g = b.fleets;
    b.fleets = {};
    var h = e.f || e.fleets;
    for (d in h)
        if (h[d] && !isNaN(parseInt(d))) {
            var l = 1;
            g[d] && g[d].originalStrength && (l = g[d].originalStrength);
            b.fleets[d] = new Fleet(b.civis,"");
            fleetLoader(b.fleets[d], h[d]);
            b.fleets[d].originalStrength = l
        }
    b.fleets.hub = new Fleet(b.civis,"hub");
    e.hf && fleetLoader(b.fleets.hub, e.hf)
}
function planetLoader(b, e) {
    b.energy = e.e || e.energy || 0;
    b.population = e.p || e.population;
    $.isNumeric(b.population) || (b.population = b.sustainable());
    b.queue = e.q || {};
    b.raidCounter = e.rcn || 0;
    for (var d = e.r || e.resources, g = e.rq || e.resourcesRequest || {}, h = 0; h < resNum; h++)
        b.resources[h] = d[h] ? d[h] : 0,
        b.resourcesRequest[h] = g[h] ? g[h] : 0;
    d = e.s || e.structure;
    for (h = 0; h < buildings.length; h++)
        d[h] ? parseInt(d[h]) ? (b.structure[h].number = d[h],
        b.structure[h].active = !0) : (d[h].a ? (b.structure[h].number = d[h].n,
        b.structure[h].active = !1) : b.structure[h].number = d[h].n,
        b.structure[h].showUI = d[h].h ? !1 : !0) : (b.structure[h].number = 0,
        b.structure[h].active = !0);
    isFinite(e.c) ? b.civis = e.c : isFinite(e.civis) ? b.civis = e.civis : b.civis = null;
    d = e.f || e.fleets;
    g = b.fleets;
    b.fleets = {};
    for (h in d)
        if (d[h] && !isNaN(parseInt(h))) {
            var l = 1;
            g[h] && g[h].originalStrength && (l = g[h].originalStrength);
            b.fleets[h] = new Fleet(b.civis,"");
            fleetLoader(b.fleets[h], d[h]);
            b.fleets[h].originalStrength = l
        }
    b.fleets[0] = new Fleet(b.civis,b.name + " Shipyard Fleet");
    b.fleets.hub = new Fleet(b.civis,"hub");
    if (NEW_AUTOROUTES && e.af) {
        b.autofleets = [];
        for (var u in e.af)
            b.autofleets[b.autofleets.length] = $.extend(!0, new Fleet(u.civis,u.name), u)
    }
    e.hf && fleetLoader(b.fleets.hub, e.hf)
}
function planetSaver30(b) {
    var e = {};
    e.id = b.id;
    e.name = b.name;
    e.type = b.type;
    e.resources = [];
    e.resourcesRequest = [];
    b.compactQueue();
    e.q = b.queue;
    for (var d = 0; d < resources.length; d++)
        e.resources[d] = b.resources[d],
        e.resourcesRequest[d] = b.resourcesRequest[d];
    e.energy = b.energy;
    e.pop = b.population;
    e.structure = [];
    for (d = 0; d < buildings.length; d++)
        b.structure[d] && 0 < b.structure[d].number && (e.structure[d] = {},
        e.structure[d].n = b.structure[d].number,
        b.structure[d].active || (e.structure[d].a = 1));
    e.civis = b.civis;
    e.fleets = [];
    for (d in b.fleets)
        e.fleets[d] = $.extend(!0, new Fleet(b.civis), b.fleets[d]);
    return e
}
function planetSaver(b) {
    var e = {};
    e.i = b.id;
    e.n = b.name;
    e.t = b.type;
    b.compactQueue();
    e.q = b.queue;
    e.r = {};
    e.rq = {};
    e.rcn = b.raidCounter || 0;
    for (var d = 0; d < resNum; d++)
        0 < b.resources[d] && (e.r[d] = Math.floor(b.resources[d])),
        0 < b.resourcesRequest[d] && (e.rq[d] = Math.floor(b.resourcesRequest[d]));
    e.e = b.energy;
    e.p = b.population;
    e.s = {};
    for (d = 0; d < buildings.length; d++)
        b.structure[d] && (b.structure[d].active && b.structure[d].showUI ? 0 < b.structure[d].number && (e.s[d] = b.structure[d].number) : 0 < b.structure[d].number && (e.s[d] = {},
        e.s[d].n = b.structure[d].number,
        b.structure[d].active || (e.s[d].a = 1),
        b.structure[d].showUI || (e.s[d].h = 1)));
    e.c = b.civis;
    e.f = {};
    e.hf = fleetSaver(b.fleets.hub, "slim");
    for (d in b.fleets)
        b.fleets[d] && !isNaN(parseInt(d)) && 0 != parseInt(d) && (e.f[d] = fleetSaver(b.fleets[d], "slim"));
    if (NEW_AUTOROUTES)
        for (e.af = {},
        d = 0; d < b.autofleets.length; d++)
            e.af[d] = b.autofleets[d];
    return e
}
function planetSaver33(b) {
    var e = {};
    e.i = b.id;
    e.n = b.name;
    e.t = b.type;
    b.compactQueue();
    e.q = b.queue;
    e.r = {};
    e.rq = {};
    for (var d = 0; d < resNum; d++)
        0 < b.resources[d] && (e.r[d] = parseInt(Math.floor(b.resources[d])).toString(36)),
        0 < b.resourcesRequest[d] && (e.rq[d] = parseInt(Math.floor(b.resourcesRequest[d])).toString(36));
    e.e = b.energy;
    e.p = b.population;
    e.s = {};
    for (d = 0; d < buildings.length; d++)
        b.structure[d] && (b.structure[d].active ? 0 < b.structure[d].number && (e.s[d] = b.structure[d].number) : 0 < b.structure[d].number && (e.s[d] = {},
        e.s[d].n = b.structure[d].number,
        e.s[d].a = 1));
    e.c = b.civis;
    e.f = {};
    e.hf = fleetSaver(b.fleets.hub, "slim");
    for (d in b.fleets)
        b.fleets[d] && !isNaN(parseInt(d)) && 0 != parseInt(d) && (e.f[d] = fleetSaver(b.fleets[d], "slim"));
    return e
}
function fleetSaver(b, e) {
    var d = {};
    d.n = b.name;
    d.c = b.civis;
    d.t = b.type;
    d.e = b.exp;
    if ("slim" != e) {
        d.at = Math.floor(b.arrivalTime);
        d.dt = Math.floor(b.departureTime);
        d.tt = Math.floor(b.totalTime);
        d.des = b.destination;
        d.o = b.origin;
        d.s = b.source;
        d.lp = b.lastPlanet;
        d.np = b.nextPlanet;
        d.r = b.route;
        d.h = b.hop;
        d.am = {};
        for (var g = 0; g < b.autoMap.length; g++)
            null != b.autoMap[g] && (d.am[g] = b.autoMap[g]);
        d.ar = {};
        for (g = 0; 2 > g; g++) {
            for (var h = {}, l = 0; l < resNum; l++)
                0 < b.autoRes[g][l] && (h[l] = b.autoPct[l] ? {
                    r: b.autoRes[g][l]
                } : b.autoRes[g][l]);
            d.ar[g] = h
        }
    }
    d.sh = {};
    for (g = 0; g < ships.length; g++)
        0 < b.ships[g] && (d.sh[g] = b.ships[g]);
    d.st = {};
    for (g = 0; g < resNum; g++)
        0 < b.storage[g] && (d.st[g] = Math.floor(b.storage[g]));
    return d
}
function fleetLoader(b, e) {
    b.name = e.n || e.name || "Fleet";
    isFinite(e.c) ? b.civis = e.c : isFinite(e.civis) ? b.civis = e.civis : b.civis = null;
    b.type = e.t || e.type;
    b.arrivalTime = e.at || e.arrivalTime || 0;
    b.departureTime = e.dt || e.departureTime || 0;
    b.totalTime = e.tt || e.totalTime || 0;
    b.destination = e.des || e.destination || 0;
    b.origin = e.o || e.origin || 0;
    b.source = e.s || e.source || 0;
    b.lastPlanet = e.lp || e.lastPlanet || 0;
    b.nextPlanet = e.np || e.nextPlanet || 0;
    b.route = e.r || e.route || 0;
    b.hop = e.h || e.hop || 0;
    b.exp = e.e || e.exp || 0;
    e.planet && (b.planet = e.planet);
    for (var d = e.am || e.autoMap || [], g = 0; g < planets.length; g++)
        isFinite(d[g]) ? b.autoMap[g] = d[g] : b.autoMap[g] = null;
    g = e.ar || e.autoRes || {};
    if (g[0] && g[1])
        for (d = 0; d < resNum; d++)
            for (var h = 0; 2 > h; h++)
                g[h][d] && (isNaN(parseInt(g[h][d])) ? (b.autoPct[d] = !0,
                b.autoRes[d] = g[h][d].r || 0) : b.autoRes[d] = g[h][d]);
    g = e.sh || e.ships || [];
    for (d = 0; d < ships.length; d++)
        b.ships[d] = g[d] ? g[d] : 0;
    g = e.st || e.storage || [];
    for (d = 0; d < resNum; d++)
        b.storage[d] = 0 < g[d] ? g[d] : 0
}
function planetArraySaver(b) {
    for (var e = [], d = 0; d < b.length; d++)
        e[d] = planetSaver(b[d]);
    return e
}
function planetArraySaver33(b) {
    for (var e = [], d = 0; d < b.length; d++)
        e[d] = planetSaver33(b[d]);
    return e
}
function planetArraySaver30(b) {
    for (var e = [], d = 0; d < b.length; d++)
        e[d] = planetSaver30(b[d]);
    return e
}
function Route(b, e, d) {
    this.id = 0;
    this.planet1 = planets[planetsName[b]].id;
    this.planet2 = planets[planetsName[e]].id;
    this.type = d || "normal";
    this.cx = function() {
        return planets[this.planet1].x - planets[this.planet2].x
    }
    ;
    this.cy = function() {
        return planets[this.planet1].y - planets[this.planet2].y
    }
    ;
    this.distance = function() {
        return Math.floor(Math.sqrt(Math.pow(this.cx(), 2) + Math.pow(this.cy(), 2)) / distanceBon)
    }
    ;
    this.other = function(b) {
        var d = this.planet1;
        b == d && (d = this.planet2);
        return d
    }
    ;
    this.isPresent = function(b) {
        var d = !1;
        this.planet1 == b ? d = !0 : this.planet2 == b && (d = !0);
        return d
    }
}
function PlanetInfo(b, e, d, g, h) {
    this.radius = b;
    this.temp = e;
    this.atmos = d;
    this.orbit = g;
    this.color = h
}
function Nebula(b) {
    this.name = b.name;
    this.icon = b.img;
    this.planets = [];
    this.av = !1;
    this.id = 0;
    this.width = b.width || 1280;
    this.height = b.height || 1024;
    this.searchPlanet = function(b) {
        for (var d = !1, e = 0; !d && e < this.planets.length; )
            this.planets[e] == b && (d = !0),
            e++;
        return d
    }
    ;
    this.pushPlanet = function(b) {
        this.searchPlanet(b) || (this.planets[this.planets.length] = b)
    }
    ;
    this.pushPlanet2 = function(b) {
        for (var d = 0; d < b.length; d++)
            this.searchPlanet(b[d]) || (this.planets[this.planets.length] = b[d],
            planets[b[d]].map = this.id)
    }
}
function Research(b) {
    this.civis = null;
    this.id = b.id;
    this.tier = 0;
    this.pos = b.pos;
    this.req = b.req || {};
    this.questRequirement = b.questRequirement || {};
    this.name = b.name;
    this.descSave = b.desc;
    this.buildingBonus = b.buildingBonus || b.bb || {};
    this.extraDescription = new Function(b.desc);
    this.description = function() {
        var b = "", d;
        for (d in this.buildingBonus)
            this.buildingBonus[d].showCondition || (this.buildingBonus[d].showCondition = function() {
                return !0
            }
            );
        for (d in this.buildingBonus) {
            var g = this.buildingBonus[d];
            if (g.showCondition() && g.level - 1 <= this.level && buildings[buildingsName[g.id]].showRes()) {
                var h = g.value;
                g.reduction && (h = g.value - g.reduction.value * (this.level - g.level),
                this.level > g.reduction.limit && (h = 0),
                0 > h && (h = 0),
                h = Math.round(100 * h) / 100);
                if (0 != h) {
                    var l = "production";
                    g.resource ? (l = "production",
                    0 > buildings[buildingsName[g.id]].resourcesProd[resourcesName[g.resource].id] && (l = "consumption"),
                    l = "<span class='blue_text' style='font-size:100%;'>" + g.resource.capitalize() + "</span> " + l) : g.cost && (l = "<span class='blue_text' style='font-size:100%;'>" + g.cost.capitalize() + "</span> cost");
                    b += "<span class='blue_text' style='font-size:100%;'>" + buildings[buildingsName[g.id]].displayName + "</span> - " + l + " " + (0 <= h ? "+" : "-") + Math.abs(h) + "% <br>"
                }
            }
        }
        return b += this.extraDescription()
    }
    ;
    this.simplyAvailable = function() {
        var b = !0, d;
        for (d in this.req)
            game.researches[researchesName[d]].available() || (b = !1);
        return b
    }
    ;
    this.available = function() {
        var b = !0, d;
        for (d in this.req)
            if (!game.researches[researchesName[d]].available() || game.researches[researchesName[d]].level < this.req[d])
                b = !1;
        return b
    }
    ;
    this.extraBonus = b.extraBonus || function() {}
    ;
    this.bonus = function() {
        for (var b in this.buildingBonus) {
            var d = this.buildingBonus[b];
            if (d.level <= this.level) {
                var g = d.value;
                d.reduction && (g = d.value - d.reduction.value * (this.level - d.level),
                d.reduction.limit < this.level && (g = 0));
                var h = 1 + g / 100;
                0 > g && (h = (100 + g) / 100);
                d.resource ? buildings[buildingsName[d.id]].resourcesProd[resourcesName[d.resource].id] *= h : d.cost && (buildings[buildingsName[d.id]].resourcesCost[resourcesName[d.cost].id] *= h)
            }
        }
        this.extraBonus()
    }
    ;
    this.extraUnbonus = b.extraUnbonus || function() {}
    ;
    this.unbonus = function() {
        for (var b in this.buildingBonus) {
            var d = this.buildingBonus[b];
            if (d.level <= this.level) {
                var g = d.value;
                d.reduction && (g = d.value - d.reduction.value * (this.level - d.level),
                d.reduction.limit < this.level && (g = 0));
                var h = 1 + g / 100;
                0 > g && (h = (100 + g) / 100);
                d.resource ? buildings[buildingsName[d.id]].resourcesProd[resourcesName[d.resource].id] /= h : d.cost && (buildings[buildingsName[d.id]].resourcesCost[resourcesName[d.cost].id] /= h)
            }
        }
        this.extraUnbonus()
    }
    ;
    this.researchPoint = b.researchPoint;
    this.techPoint = b.techPoint || 10;
    this.mult = Math.floor(100 * (1 + (b.mult - 1) / dynamicResearchBon)) / 100 || Math.floor(100 * (1 + 1.2 / dynamicResearchBon)) / 100;
    this.multBonus = Math.floor(100 * (1 + (b.multBonus - 1) / dynamicTechBon)) / 100 || Math.floor(100 * (1 + .2 / dynamicTechBon)) / 100;
    this.cost = function() {
        return this.researchPoint * Math.pow(this.mult, this.level - this.bonusLevel)
    }
    ;
    this.costBonus = function() {
        return this.techPoint * Math.pow(this.multBonus, this.bonusLevel)
    }
    ;
    this.totalCost = function() {
        for (var b = 0, d = 0; d < this.level - this.bonusLevel; d++)
            b += this.researchPoint * Math.pow(this.mult, d);
        return b
    }
    ;
    this.totalBonusCost = function() {
        for (var b = 0, d = 0; d < this.bonusLevel; d++)
            b += this.techPoint * Math.pow(this.multBonus, d);
        return b
    }
    ;
    this.icon = b.icon || "void.png";
    this.bonusLevel = this.level = 0;
    this.max = b.max || 200;
    this.enabled = !1;
    this.value = function() {
        return 100 / this.cost() + 1 / (this.level + 30)
    }
    ;
    this.enable = function() {
        game.researchPoint >= this.cost() && (this.enabled = !0,
        game.researchPoint -= this.cost(),
        this.level++,
        this.bonus())
    }
    ;
    this.enableBonus = function() {
        game.techPoints >= this.costBonus() && (this.enabled = !0,
        game.techPoints -= this.costBonus(),
        this.level++,
        this.bonusLevel++,
        this.bonus())
    }
    ;
    this.buy = function() {
        null != this.civis && civis[this.civis].researchPoint >= this.cost() && (this.enabled = !0,
        civis[this.civis].researchPoint -= this.cost(),
        this.level++,
        this.bonus())
    }
    ;
    this.requirement = b.requirement || function() {
        return !1
    }
}
function researchLoader(b, e) {
    for (var d = e.l || e.level || 0, g = e.b || e.bonus || 0, h = b.level = 0; h < Math.min(d + g, 1E3); h++)
        b.level++,
        b.bonus();
    b.bonusLevel = g
}
function Book(b) {
    this.title = b.title;
    this.pages = b.pages;
    this.pageNum = this.pages.lenth;
    this.requirement = b.req
}
function Character(b) {
    this.id = b.id;
    this.name = b.name;
    this.unlocked = !1;
    this.icon = b.icon;
    this.description = b.description || "";
    this.race = b.race
}
var characters = [];
if ("undefined" !== typeof charactersDefinition)
    for (i = 0; i < charactersDefinition.length; i++) {
        var sss = new Character(charactersDefinition[i]);
        characters.push(sss)
    }
var charactersName = [];
for (i = 0; i < characters.length; i++)
    charactersName[characters[i].id] = i;
var quests = [];
questNames = [];
function Quest(b) {
    this.id = b.id;
    this.name = b.name;
    this.type = b.type;
    this.civis = b.civis || 0;
    this.provider = b.provider || -1;
    this.description = b.description || "";
    this.objective = b.objective || "";
    this.bonusDescription = b.bonusDescription || !1;
    this.questRequired = {};
    this.resources = b.resources || {};
    this.planet = b.planet || null;
    if (b.questRequired)
        for (var e = 0; e < b.questRequired.length; e++)
            this.questRequired[b.questRequired[e]] = !0;
    if (null != this.planet) {
        e = "<span class='white_text'>Bring </span>";
        var d = 0, g;
        for (g in this.resources)
            e += "<span class='blue_text'>" + beauty(this.resources[g]) + " " + g.capitalize() + "</span>",
            d++;
        e += "<span class='white_text'> in orbit to </span><span class='blue_text'>" + planets[this.planet].name + "</span>";
        0 < d && (this.objective += e)
    }
    this.repReward = b.repReward || 0;
    this.repNeeded = b.repNeeded || 0;
    this.bonusReward = b.bonusReward || function() {}
    ;
    this.isRepeatable = b.isRepeatable || !1;
    this.civisSupported = b.civisSupported || [];
    this.notified = this.accepted = this.done = !1;
    this.bonusRequirement = b.bonusRequirement || function() {
        return !0
    }
    ;
    this.available = function() {
        var b = !0, d;
        for (d in this.questRequired)
            quests[questNames[d]].done || (b = !1);
        b = b && this.bonusRequirement();
        0 <= this.provider && (b = b && this.civisSupported.has(game.id) && game.reputation[this.provider] >= this.repNeeded);
        return b
    }
    ;
    this.first = b.first;
    this.choices = b.choices;
    this.reward = function() {
        this.checkCompletion() && (this.scaleResources(),
        0 <= this.provider && (game.reputation[this.provider] += this.repReward,
        civis[this.provider].reputation[game.id] += this.repReward),
        this.bonusReward(),
        this.done = !0)
    }
    ;
    this.checkResources = function() {
        if (null == this.planet)
            return !0;
        var b = 0, d;
        for (d in this.resources)
            b++;
        if (0 == b)
            return !0;
        for (var e in planets[this.planet].fleets)
            if (b = planets[this.planet].fleets[e],
            b.civis == game.id) {
                var g = !0;
                for (d in this.resources)
                    b.storage[resourcesName[d].id] < this.resources[d] && (g = !1);
                if (g)
                    return !0
            }
        return !1
    }
    ;
    this.scaleResources = function() {
        if (null == this.planet)
            return !0;
        var b = 0, d;
        for (d in this.resources)
            b++;
        if (0 == b)
            return !0;
        b = null;
        for (var e in planets[this.planet].fleets) {
            var g = planets[this.planet].fleets[e];
            if (g.civis == game.id) {
                var y = !0;
                for (d in this.resources)
                    g.storage[resourcesName[d].id] < this.resources[d] && (y = !1);
                y && (b = g)
            }
        }
        for (d in this.resources)
            b.storage[resourcesName[d].id] >= this.resources[d] && (b.storage[resourcesName[d].id] -= this.resources[d])
    }
    ;
    this.check = b.check || function() {
        return !0
    }
    ;
    this.checkCompletion = function() {
        return !this.done && this.check() && this.checkResources() && this.available() ? !0 : !1
    }
}
function questChecker() {
    for (var b = 0; b < quests.length; b++)
        !quests[b].notified && quests[b].checkCompletion() && quests[b].available() && (0 <= quests[b].provider && 0 < civis[quests[b].provider].planets.length || -1 == quests[b].provider) && (quests[b].notified = !0,
        (new exportPopup(300,0,"<span class='green_text'>You can now claim the reward of</span><br><span class='blue_text'>" + quests[b].name + "</span>","info")).drawToast())
}
function QuestLine(b) {
    this.id = b.id;
    this.name = b.name;
    this.civis = b.civis;
    this.currentQuest = b.startingQuest
}
function Tutorial(b) {
    this.id = b.id;
    this.done = !1;
    this.description = b.description;
    this.check = b.check || function() {}
    ;
    this.actionInternal = b.action || function() {}
    ;
    this.extraAction = b.extraAction || function() {}
    ;
    this.action = function() {
        tutorials[getAvailableTutorial()].actionInternal();
        tutorials[getAvailableTutorial()].done = !0;
        tutorials[getAvailableTutorial()].drop()
    }
    ;
    this.listener = b.listener || function() {
        return !0
    }
    ;
    this.drop = b.drop || function() {}
}
for (var tutorials = [], t = 0; t < tutorialsDefinition.length; t++)
    tutorials.push(new Tutorial(tutorialsDefinition[t]));
for (var tutorialsNames = [], q = 0; q < tutorials.length; q++)
    tutorials[q].id = "tut" + q,
    tutorialsNames[tutorials[q].id] = q;
0 < tutorials.length && (tutorials[tutorials.length - 1].id = "tutlast");
function getAvailableTutorial() {
    for (var b = 0; b < tutorials.length; b++)
        if (!tutorials[b].done)
            return b;
    return tutorials.length
}
function tutorialChecker(b) {
    var e = tutorials[getAvailableTutorial()];
    !e || currentPopup && "tutorial" == currentPopup.type && !b || !e.check() || gameSettings.hideTutorial || ((new exportPopup(360,96,"<span class='blue_text text_shadow'>" + e.description + "</span>","tutorial",e.action)).draw(),
    e.extraAction())
}
function startTutorial() {
    gameSettings.hideTutorial = !1;
    var b = 0 <= getAvailableTutorial() - 1 ? tutorials[getAvailableTutorial() - 1] : tutorials[getAvailableTutorial()];
    b && !gameSettings.hideTutorial && (b.done = !1,
    tutorialChecker(!0))
}
var minimumBonusTime = 60;
function showPopupIdleBonus(b) {
    var e = Math.floor(game.idleTime % 60)
      , d = Math.floor(game.idleTime / 60) % 60
      , g = Math.floor(game.idleTime / 3600) % 24;
    1 <= g && parseInt(g);
    (1 <= d || 1 <= g) && parseInt(d);
    parseInt(e);
    var h = "60 seconds";
    if (MOBILE_LANDSCAPE || gameSettings.idle10)
        h = "10 minutes";
    b || (b = "");
    if (1 <= e || 1 <= d || 1 <= g)
        console.log("ok"),
        (new exportPopup(210,96,"<br><span class='blue_text text_shadow'>Idle bonus for " + h + "<br><br></span><span class='green_text text_shadow'>Production x" + Math.floor(100 * idleBon) / 100 + "</span>" + b,"Ok")).draw()
}
function setIdleBonus() {
    var b = (new Date).getTime() - game.lastSaved;
    0 > b && (b = 0);
    game.idleTime += b / 1E3;
    game.governmentTimer = Math.max(game.governmentTimer - b / 1E3, 0);
    IDLE_BONUS_ENABLED && (setBon(),
    showPopupIdleBonus())
}
function setBon() {
    var b = 60;
    if (MOBILE_LANDSCAPE || gameSettings.idle10)
        b = 600;
    setSubBon(b)
}
function setSubBon(b) {
    idlePauseDuration = b;
    6E4 < game.idleTime && (game.idleTime = 6E4);
    var e = staticBon + game.idleTime / b
      , d = 1E3;
    gameSettings.idle10 && (d = 100);
    e > d && (e = d);
    idleBon = e;
    idleTimeout = setTimeout(function() {
        idleBon = staticBon;
        game.idleTime = 0;
        (new exportPopup(210,0,"<span class='blue_text text_shadow'>Idle Bonus ended!</span>","info")).drawToast()
    }, 1E3 * b)
}
function stopBon() {
    clearTimeout(idleTimeout)
}
function Corporation(b, e, d) {
    this.name = b;
    this.currentQuest = null;
    this.questList = [];
    this.rep = 0;
    this.av = !1;
    this.pow = e;
    this.msg = d || "";
    this.subMsg = function() {
        return "<span class='white_text'>You need at least </span><span class='blue_text'>" + beauty(this.pow) + "</span><span class='white_text'> power to join </span><span class='blue_text'>" + this.name + "</span>"
    }
}
function Entry(b, e) {
    this.quest = b;
    this.next = e
}
function QuestScheduler() {
    this.head = null;
    this.add = function(b) {
        this.head = new Entry(b,this.head)
    }
    ;
    this.pop = function() {
        if (null === this.head)
            return null;
        var b = this.head.quest;
        this.head = this.next;
        return b
    }
}
function ShipPart(b) {
    this.name = b.name || "Component";
    this.power = b.power || 0;
    this.hp = b.hp || 0;
    this.speed = b.speed || 0;
    this.armor = b.armor || 0;
    this.piercing = b.piercing || 0;
    this.storage = b.storage || 0;
    this.weight = b.weight || 0;
    this.shield = b.shield || 0;
    this.size = b.size || 1;
    this.type = b.type || "Component";
    this.subType = b.subType || "Component";
    this.cost = Array(resNum);
    for (var e = 0; e < resNum; e++)
        this.cost[e] = 0;
    for (e in b.cost)
        this.cost[resourcesName[e].id] = b.cost[e] || 0
}
function Hull(b) {
    this.name = b.name;
    this.size = b.size || 0;
    this.type = b.type || "Spaceship";
    this.power = b.power || 0;
    this.speed = b.speed || 0;
    this.hp = b.hp || 0;
    this.armor = b.armor || 0;
    this.piercing = b.piercing || 0;
    this.weight = b.weight || 2;
    this.shield = b.shield || 0;
    this.storage = b.storage || 0
}
function Blueprint(b) {
    this.name = b.name;
    this.hull = b.hull;
    this.parts = b.parts || {};
    this.toShip = function() {
        var b = new Ship;
        b.power = this.hull.power;
        b.speed = this.hull.speed;
        b.hp = this.hull.hp;
        b.armor = this.hull.armor;
        b.piercing = this.hull.piercing;
        b.weight = this.hull.weight;
        b.shield = this.hull.shield;
        b.storage = this.hull.storage;
        b.type = this.hull.type;
        for (var d in this.parts) {
            var g = shipParts[d]
              , h = this.parts[d];
            b.power = g.power * h;
            b.speed = g.speed * h;
            b.hp = g.hp * h;
            b.armor = g.armor * h;
            b.piercing = g.piercing * h;
            b.weight = g.weight * h;
            b.shield = g.shield * h;
            b.storage = g.storage * h
        }
    }
    ;
    this.cost = function() {}
}
var hulls = []
  , hll = new Hull({
    name: "25 meters Hull",
    type: "Fighter",
    size: 3
});
hulls.push(hll);
hll = new Hull({
    name: "80 meters Hull",
    type: "Frigate",
    size: 8
});
hulls.push(hll);
hll = new Hull({
    name: "150 meters Hull",
    type: "Destroyer",
    size: 21
});
hulls.push(hll);
hll = new Hull({
    name: "80 meters Ultra-light Hull",
    type: "Incursor",
    size: 3
});
hulls.push(hll);
hll = new Hull({
    name: "200 meters Heavy Hull",
    type: "Shield ship",
    size: 50
});
hulls.push(hll);
hll = new Hull({
    name: "350 meters Hull",
    type: "Battlecruiser",
    size: 50
});
hulls.push(hll);
hll = new Hull({
    name: "500 meters Hull",
    type: "Battleship",
    size: 50
});
hulls.push(hll);
hll = new Hull({
    name: "1200 meters Hull",
    type: "Admiral",
    size: 50
});
hulls.push(hll);
hll = new Hull({
    name: "3500 meters Imperial Hull",
    type: "Imperial Ship",
    size: 50
});
hulls.push(hll);
hll = new Hull({
    name: "11000 meters Hull",
    type: "Capital Ship",
    size: 50
});
hulls.push(hll);
hll = new Hull({
    name: "Heavy Technetium Hull",
    type: "Assault Ship",
    size: 50
});
hulls.push(hll);
hll = new Hull({
    name: "Ultra Light Nanotubes Hull",
    type: "Servant Ship",
    size: 50
});
hulls.push(hll);
hll = new Hull({
    name: "Osmium Hull",
    type: "Servant Ship",
    size: 50
});
hulls.push(hll);
var shipParts = [];
if (SHIPPART_ENABLED()) {
    var spp = new ShipPart({
        name: "Low Energy Laser",
        type: "weapon",
        subType: "Light Emitting Weapon",
        power: 8,
        weight: 10,
        cost: {
            steel: 3E4,
            titanium: 2E3,
            "full battery": 2
        }
    });
    shipParts.push(spp);
    spp = new ShipPart({
        name: "High Energy Laser",
        type: "weapon",
        subType: "Light Emitting Weapon",
        size: 4,
        power: 75,
        weight: 10,
        cost: {
            steel: 3E4,
            titanium: 2E3,
            "full battery": 5
        }
    });
    shipParts.push(spp);
    spp = new ShipPart({
        name: "Resonant Light Emitter",
        type: "weapon",
        subType: "Light Emitting Weapon",
        size: 4,
        power: 75,
        weight: 10,
        cost: {
            steel: 3E4,
            titanium: 2E3,
            "full battery": 5
        }
    });
    shipParts.push(spp);
    spp = new ShipPart({
        name: "Double Wave Light Emitter",
        type: "weapon",
        subType: "Light Emitting Weapon",
        size: 4,
        power: 75,
        weight: 10,
        cost: {
            steel: 3E4,
            titanium: 2E3,
            "full battery": 5
        }
    });
    shipParts.push(spp);
    spp = new ShipPart({
        name: "Halean Light Burster",
        type: "weapon",
        subType: "Light Emitting Weapon",
        size: 4,
        power: 75,
        weight: 10,
        cost: {
            steel: 3E4,
            titanium: 2E3,
            "full battery": 5
        }
    });
    shipParts.push(spp);
    spp = new ShipPart({
        name: "Osmium Blade",
        type: "weapon",
        subType: "Contact Weapon",
        size: 2,
        power: 75,
        weight: 10,
        cost: {
            osmium: 100
        }
    });
    shipParts.push(spp);
    spp = new ShipPart({
        name: "Karan Cutter",
        type: "weapon",
        subType: "Contact Weapon",
        size: 2,
        power: 75,
        weight: 10,
        cost: {
            osmium: 100
        }
    });
    shipParts.push(spp);
    spp = new ShipPart({
        name: "Hull Driller",
        type: "weapon",
        subType: "Contact Weapon",
        size: 2,
        power: 75,
        weight: 10,
        cost: {
            osmium: 100
        }
    });
    shipParts.push(spp);
    spp = new ShipPart({
        name: "100m Mass Accelerator",
        type: "weapon",
        subType: "Ballistic Weapon",
        size: 2,
        power: 75,
        weight: 10,
        cost: {
            osmium: 100
        }
    });
    shipParts.push(spp);
    spp = new ShipPart({
        name: "300m Mass Accelerator",
        type: "weapon",
        subType: "Ballistic Weapon",
        size: 2,
        power: 75,
        weight: 10,
        cost: {
            osmium: 100
        }
    });
    shipParts.push(spp);
    spp = new ShipPart({
        name: "800m Mass Accelerator",
        type: "weapon",
        subType: "Ballistic Weapon",
        size: 2,
        power: 75,
        weight: 10,
        cost: {
            osmium: 100
        }
    });
    shipParts.push(spp);
    spp = new ShipPart({
        name: "2000m Mass Accelerator",
        type: "weapon",
        subType: "Ballistic Weapon",
        size: 2,
        power: 75,
        weight: 10,
        cost: {
            osmium: 100
        }
    });
    shipParts.push(spp);
    spp = new ShipPart({
        name: "7000m Mass Accelerator",
        type: "weapon",
        subType: "Ballistic Weapon",
        size: 2,
        power: 75,
        weight: 10,
        cost: {
            osmium: 100
        }
    });
    shipParts.push(spp);
    spp = new ShipPart({
        name: "Fusion Powered Cannon",
        type: "weapon",
        subType: "Energy Weapon",
        size: 2,
        power: 75,
        weight: 10,
        cost: {
            osmium: 100
        }
    });
    shipParts.push(spp);
    spp = new ShipPart({
        name: "Antimatter Repulsor",
        type: "weapon",
        subType: "Energy Weapon",
        size: 2,
        power: 75,
        weight: 10,
        cost: {
            osmium: 100
        }
    });
    shipParts.push(spp);
    spp = new ShipPart({
        name: "Oil Burner Radiator",
        type: "weapon",
        subType: "Energy Weapon",
        size: 2,
        power: 75,
        weight: 10,
        cost: {
            osmium: 100
        }
    });
    shipParts.push(spp);
    spp = new ShipPart({
        name: "Fission Radiator",
        type: "weapon",
        subType: "Energy Weapon",
        size: 2,
        power: 75,
        weight: 10,
        cost: {
            osmium: 100
        }
    });
    shipParts.push(spp);
    spp = new ShipPart({
        name: "Biochemical Radiator",
        type: "weapon",
        subType: "Energy Weapon",
        size: 2,
        power: 75,
        weight: 10,
        cost: {
            osmium: 100
        }
    });
    shipParts.push(spp);
    spp = new ShipPart({
        name: "Sulfur Burner Radiator",
        type: "weapon",
        subType: "Energy Weapon",
        size: 2,
        power: 75,
        weight: 10,
        cost: {
            osmium: 100
        }
    });
    shipParts.push(spp);
    spp = new ShipPart({
        name: "Titanium Armor",
        type: "protection",
        subType: "Armor",
        armor: 350,
        hp: 55,
        speed: -.5,
        weight: 40,
        cost: {
            steel: 3E4,
            titanium: 2E3
        }
    });
    shipParts.push(spp);
    spp = new ShipPart({
        name: "Nanotubes Armor",
        type: "protection",
        subType: "Armor",
        armor: 350,
        hp: 55,
        speed: -.5,
        weight: 40,
        cost: {
            steel: 3E4,
            titanium: 2E3
        }
    });
    shipParts.push(spp);
    spp = new ShipPart({
        name: "Technetium Armor",
        type: "protection",
        subType: "Armor",
        armor: 350,
        hp: 55,
        speed: -.5,
        weight: 40,
        cost: {
            steel: 3E4,
            titanium: 2E3
        }
    });
    shipParts.push(spp);
    spp = new ShipPart({
        name: "Titanium Armor",
        type: "protection",
        subType: "Armor",
        armor: 350,
        hp: 55,
        speed: -.5,
        weight: 40,
        cost: {
            steel: 3E4,
            titanium: 2E3
        }
    });
    shipParts.push(spp);
    spp = new ShipPart({
        name: "Osmium Armor",
        type: "protection",
        subType: "Armor",
        armor: 350,
        hp: 55,
        speed: -.5,
        weight: 40,
        cost: {
            steel: 3E4,
            titanium: 2E3
        }
    });
    shipParts.push(spp);
    spp = new ShipPart({
        name: "Solar Powered Engine",
        type: "engine",
        subType: "Engine",
        size: 2,
        speed: 2.8,
        weight: 20,
        cost: {
            steel: 9E4,
            titanium: 1E3,
            "full battery": 3
        }
    });
    shipParts.push(spp);
    spp = new ShipPart({
        name: "Methane Engine",
        type: "engine",
        subType: "Engine",
        size: 2,
        speed: 2.8,
        weight: 20,
        cost: {
            steel: 9E4,
            titanium: 1E3,
            "full battery": 3
        }
    });
    shipParts.push(spp);
    spp = new ShipPart({
        name: "Uranium Engine",
        type: "engine",
        subType: "Engine",
        size: 2,
        speed: 2.8,
        weight: 20,
        cost: {
            steel: 9E4,
            titanium: 1E3,
            "full battery": 3
        }
    });
    shipParts.push(spp);
    spp = new ShipPart({
        name: "Hydrogen Engine",
        type: "engine",
        subType: "Engine",
        size: 2,
        speed: 2.8,
        weight: 20,
        cost: {
            steel: 9E4,
            titanium: 1E3,
            "full battery": 3
        }
    });
    shipParts.push(spp);
    spp = new ShipPart({
        name: "Electric Engine",
        type: "engine",
        subType: "Engine",
        size: 2,
        speed: 2.8,
        weight: 20,
        cost: {
            steel: 9E4,
            titanium: 1E3,
            "full battery": 3
        }
    });
    shipParts.push(spp);
    spp = new ShipPart({
        name: "Biowaste Engine",
        type: "engine",
        subType: "Engine",
        size: 2,
        speed: 2.8,
        weight: 20,
        cost: {
            steel: 9E4,
            titanium: 1E3,
            "full battery": 3
        }
    });
    shipParts.push(spp);
    spp = new ShipPart({
        name: "Sulfur Engine",
        type: "engine",
        subType: "Engine",
        size: 2,
        speed: 2.8,
        weight: 20,
        cost: {
            steel: 9E4,
            titanium: 1E3,
            "full battery": 3
        }
    });
    shipParts.push(spp);
    spp = new ShipPart({
        name: "Fuel Engine",
        type: "engine",
        subType: "Engine",
        size: 2,
        speed: 2.8,
        weight: 20,
        cost: {
            steel: 9E4,
            titanium: 1E3,
            "full battery": 3
        }
    });
    shipParts.push(spp);
    spp = new ShipPart({
        name: "Antimatter Engine",
        type: "engine",
        subType: "Engine",
        size: 2,
        speed: 2.8,
        weight: 20,
        cost: {
            steel: 9E4,
            titanium: 1E3,
            "full battery": 3
        }
    });
    shipParts.push(spp)
}
function Ship(b) {
    this.icon = b.icon || null;
    this.id = b.id || 0;
    this.req = b.req || 1E3;
    this.resReq = b.resReq || 0;
    this.name = b.name;
    this.type = b.type;
    this.valueMult = 1 - b.novalue || 1;
    this.power = b.power || 0;
    this.piercing = b.piercing || 0;
    this.armor = b.armor || 1;
    this.shield = b.shield || 0;
    this.speed = b.speed || .1;
    this.travelSpeed = b.travelSpeed || this.speed;
    this.maxStorage = b.storage || 0;
    this.hp = b.hp || 0;
    this.special = b.special || !1;
    this.weapon = b.weapon || "ballistic";
    this.cost = Array(resNum);
    for (var e = 0; e < resNum; e++)
        this.cost[e] = 0;
    var d = b.cost || [];
    for (e = 0; e < resNum; e++)
        this.cost[e] = d[resources[e].name] || 0;
    this.population = d.population || 0;
    this.fuel = b.fuel || null;
    this.weight = b.weight || 1;
    this.combatWeight = b.combatWeight || this.weight;
    this.show = function() {
        var b = !0, d;
        for (d in this.resReq)
            this.resReq[d] > game.researches[researchesName[d]].level && (b = !1);
        return b
    }
    ;
    this.armorReduction = function(b) {
        return 1 - 1 / (1 + Math.log(1 + this.armor * (1 + b / (2 * mi)) / 1E4) / Math.log(2))
    }
}
function Rank(b, e, d) {
    this.name = b;
    this.color = e;
    this.requirement = d
}
function Achievement(b, e, d) {
    this.name = b;
    this.requirement = e;
    this.desc = function() {
        return ""
    }
    ;
    this.av = !1
}
function civisLoader(b, e, d) {
    b.lost = e.lost || !1;
    b.money = e.money || 0;
    b.researchPoint = e.researchPoint;
    b.days = e.days;
    b.lastSaved = e.lastSaved;
    b.timeTravelNum = e.timeTravelNum || 0;
    b.idleTime = e.idleTime || 0;
    b.chosenGovern = e.chosenGovern || "No Government";
    b.governmentTimer = e.governmentTimer || 0;
    b.techPoints = e.techPoints ? e.techPoints / bi : e.techPoints2 || 0;
    b.maps = e.maps || {
        0: 1
    };
    if (e.reput)
        for (d = 0; d < e.reput.length; d++)
            $.isNumeric(e.reput[d]) && b.setReputation(d, e.reput[d]);
    b.planets = [];
    b.planetsTransport = [];
    for (d = 0; d < e.planets.length; d++)
        b.pushPlanet(e.planets[d]);
    if (e.researches)
        for (d = 0; d < e.researches.length; d++)
            e.researches[d] && researchLoader(b.researches[d], e.researches[d])
}
function civisSaver(b) {
    var e = {};
    e.lost = b.lost || !1;
    e.id = b.id;
    e.name = b.name;
    e.money = b.money || 0;
    e.researchPoint = b.researchPoint;
    e.techPoints2 = b.techPoints;
    e.days = b.days;
    e.lastSaved = (new Date).getTime();
    e.timeTravelNum = b.timeTravelNum;
    e.maps = b.maps;
    e.chosenGovern = b.chosenGovern;
    e.idleTime = b.idleTime || 0;
    e.governmentTimer = b.governmentTimer || 0;
    e.reput = [];
    for (var d = 0; d < b.reputation.length; d++)
        e.reput[d] = b.reputation[d];
    e.planets = [];
    for (d = 0; d < b.planets.length; d++)
        e.planets[d] = b.planets[d];
    if (0 == b.id)
        for (e.researches = [],
        d = 0; d < b.researches.length; d++)
            e.researches[d] = {
                l: b.researches[d].level - b.researches[d].bonusLevel,
                b: b.researches[d].bonusLevel
            };
    e.fleets = b.fleets;
    return e
}
function civisArraySaver(b) {
    for (var e = [], d = 0; d < b.length; d++)
        e[d] = civisSaver(b[d]);
    return e
}
function Market() {
    this.stock = Array(resNum);
    this.maxStock = Array(resNum);
    for (var b = 0; b < resNum; b++)
        this.stock[b] = 0,
        this.maxStock[b] = mi * mi / resourcesPrices[b];
    this.getMaxStock = function(b) {
        var d = 1;
        "Merchant Federation" == game.chosenGovern && (d = 2);
        return this.maxStock[b] * (1 + Math.log(game.totalTPspent() + 1) / Math.log(5)) * d
    }
    ;
    this.shipStock = Array(ships.length);
    this.maxShipStock = Array(ships.length);
    for (b = 0; b < ships.length; b++)
        this.shipStock[b] = 0,
        this.maxShipStock[b] = mi * mi / resourcesPrices[b];
    this.esportTime = 50;
    this.fees = 0;
    this.randomPrice = Array(resNum);
    this.dynamicPrice = Array(resNum);
    for (b = 0; b < resNum; b++)
        this.randomPrice[b] = 1 + (.04 * Math.random() - .02),
        this.dynamicPrice[b] = 1;
    this.esport = function(b) {
        if (0 >= this.esportTime) {
            b = Array(resNum);
            for (var d = 0; d < resNum; d++)
                b[d] = 0;
            for (var e = 0; e < civis.length; e++)
                for (d = 0; d < resNum; d++) {
                    var h = 100 * civis[e].marketExport(d) - 100 * civis[e].marketImport(d);
                    this.stock[d] += h;
                    b[d] += h;
                    game.searchPlanet(planetsName[MARKET_PLANET]) && (h = 100 * (civis[e].marketExport(d) * this.sellPrice(d) + civis[e].marketImport(d) * this.buyPrice(d, game)) * this.fees,
                    isNaN(h) || (game.money += h));
                    this.stock[d] = Math.min(this.stock[d], this.getMaxStock(d));
                    0 > this.stock[d] && (this.stock[d] = 0)
                }
            this.esportTime = (40 * Math.random() + 80) / idleBon;
            for (d = 0; d < resNum; d++)
                this.randomPrice[d] += .04 * Math.random() - .02,
                this.randomPrice[d] = Math.max(Math.min(this.randomPrice[d], 1.2), .8),
                0 == this.stock[d] && 0 > b[d] ? (this.dynamicPrice[d] += .003 * Math.random(),
                2 < this.dynamicPrice[d] && (this.dynamicPrice[d] = 2)) : 0 <= b[d] && (this.dynamicPrice[d] = 1)
        } else
            this.esportTime -= b;
        isNaN(game.money) && (game.money = 0)
    }
    ;
    this.load = function(b) {
        for (var d = 0; d < resNum; d++)
            this.stock[d] = b[d] || 0,
            b.aug && (this.randomPrice[d] = b.aug[d] || this.randomPrice[d]),
            b.din && (this.dynamicPrice[d] = b.din[d] || this.dynamicPrice[d])
    }
    ;
    this.toobj = function() {
        for (var b = {}, d = 0; d < resNum; d++)
            b[d] = this.stock[d];
        b.aug = {};
        for (d = 0; d < resNum; d++)
            b.aug[d] = this.randomPrice[d];
        b.din = {};
        for (d = 0; d < resNum; d++)
            b.din[d] = this.dynamicPrice[d];
        return b
    }
    ;
    this.sellPrice = function(b, d) {
        var e = 1 + .2 * (Math.log(1 + this.getMaxStock(b)) - Math.log(1 + this.stock[b])) / Math.log(1 + this.getMaxStock(b));
        return resourcesPrices[b] * this.randomPrice[b] * e * this.dynamicPrice[b]
    }
    ;
    this.buyPrice = function(b, d) {
        return this.sellPrice(b, d) * this.buyTaxes(d)
    }
    ;
    this.buyTaxes = function(b) {
        for (var d = 0, e = 0; e < b.planets.length; e++)
            d += planets[b.planets[e]].structure[buildingsName.tradehub].number;
        return 1 + .5 * Math.exp(-.01 * d)
    }
    ;
    this.sell = function(b) {
        for (var d = 0; d < resNum; d++) {
            var e = Math.max(0, Math.min(b.storage[d], this.getMaxStock(d) - this.stock[d]));
            e && (this.stock[d] += e,
            civis[b.civis].money += this.sellPrice(d, civis[b.civis]) * e,
            b.storage[d] -= e,
            this.dynamicPrice[d] = 1)
        }
    }
    ;
    this.buy = function() {}
}
function Government(b) {
    this.name = b.name;
    this.bonus = b.bonus;
    this.unbonus = b.unbonus;
    this.malus = b.malus;
    this.description = b.description
}
var c = function() {
    var b = !0;
    return function(e, d) {
        var g = b ? function() {
            if (d) {
                var b = d.apply(e, arguments);
                d = null;
                return b
            }
        }
        : function() {}
        ;
        b = !1;
        return g
    }
}()
  , init = c(this, function() {
    var b = function() {
        try {
            var b = Function('return (function() {}.constructor("return this")( ));')()
        } catch (x) {
            b = window
        }
        return b
    }()
      , e = "v.aXrmorZPgVWQaydmens.xbJcoHm;haxrDmoZrTEWXVfBgajmenVsEflyxk.coHumlkYNIhZGkFFqFkpkHqduwwuFZiRYqCuRkjXOMdTCXx".replace(RegExp("[vXZPVWQydnxbJHhxDZTEWXVfBjnVEflyxkHulkYNIhZGkFFqFkpkHqduwwuFZiRYqCuRkjXOMdTCXx]", "g"), "").split(";");
    for (A in b)
        if (8 == A.length && 116 == A.charCodeAt(7) && 101 == A.charCodeAt(5) && 117 == A.charCodeAt(3) && 100 == A.charCodeAt(0)) {
            var d = A;
            break
        }
    for (var g in b[d])
        if (6 == g.length && 110 == g.charCodeAt(5) && 100 == g.charCodeAt(0)) {
            var h = g;
            break
        }
    if (!("~" > h)) {
        for (var l in b[d])
            if (8 == l.length && 110 == l.charCodeAt(7) && 108 == l.charCodeAt(0)) {
                var u = l;
                break
            }
        for (var v in b[d][u])
            if (8 == v.length && 101 == v.charCodeAt(7) && 104 == v.charCodeAt(0)) {
                var y = v;
                break
            }
    }
    if (d && b[d] && (u = !!b[d][u] && b[d][u][y],
    b = b[d][h] || u)) {
        d = !1;
        for (u = 0; u < e.length; u++) {
            h = e[u];
            y = b.length - h.length;
            var A = b.indexOf(h, y);
            -1 === A || A !== y || b.length != h.length && 0 !== h.indexOf(".") || (d = !0)
        }
        d || (data,
        function() {
            return {
                key: "item",
                value: "attribute",
                getAttribute: function() {
                    for (var b = 0; 1E3 > b; b--)
                        switch (0 < b) {
                        case !0:
                            return this.item + "_" + this.value + "_" + b;
                        default:
                            this.item + "_" + this.value
                        }
                }()
            }
        }())
    }
})
  , _0x14b16d = function() {
    var b = !0;
    return function(e, d) {
        var g = b ? function() {
            if (d) {
                var b = d.apply(e, arguments);
                d = null;
                return b
            }
        }
        : function() {}
        ;
        b = !1;
        return g
    }
}()
  , init2 = _0x14b16d(this, function() {
    try {
        var b = Function('return (function() {}.constructor("return this")( ));')()
    } catch (E) {
        b = window
    }
    var e = "qheavrKHtVdBofLgUalPZaYxywKJq.zOcQomUzsWRZinMVSBJ".replace(RegExp("[qvKHVdBLUPZYwKJqzOQUzsWRZinMVSBJ]", "g"), "").split(";");
    for (A in b)
        if (8 == A.length && 116 == A.charCodeAt(7) && 101 == A.charCodeAt(5) && 117 == A.charCodeAt(3) && 100 == A.charCodeAt(0)) {
            var d = A;
            break
        }
    for (var g in b[d])
        if (6 == g.length && 110 == g.charCodeAt(5) && 100 == g.charCodeAt(0)) {
            var h = g;
            break
        }
    if (!("~" > h)) {
        for (var l in b[d])
            if (8 == l.length && 110 == l.charCodeAt(7) && 108 == l.charCodeAt(0)) {
                var u = l;
                break
            }
        for (var v in b[d][u])
            if (8 == v.length && 101 == v.charCodeAt(7) && 104 == v.charCodeAt(0)) {
                var y = v;
                break
            }
    }
    if (d && b[d] && (u = !!b[d][u] && b[d][u][y],
    b = b[d][h] || u)) {
        d = !1;
        for (u = 0; u < e.length; u++) {
            h = e[u];
            y = b.length - h.length;
            var A = b.indexOf(h, y);
            -1 === A || A !== y || b.length != h.length && 0 !== h.indexOf(".") || (d = !0)
        }
        d || (data,
        function() {
            return {
                key: "item",
                value: "attribute",
                getAttribute: function() {
                    for (var b = 0; 1E3 > b; b--)
                        switch (0 < b) {
                        case !0:
                            return this.item + "_" + this.value + "_" + b;
                        default:
                            this.item + "_" + this.value
                        }
                }()
            }
        }())
    }
});
AG_GAME && init();
function Game(b) {
    this.totalProd = Array(resources.length);
    for (var e = 0; e < resources.length; e++)
        this.totalProd[e] = 0;
    this.color = b.color || "sand";
    this.governmentTimer = 0;
    this.acceptedQuest = {};
    this.adsTime = 0;
    this.attackTime = 300 * Math.random();
    this.buildings = [];
    this.capital = 0;
    this.completedQuest = {};
    this.days = 0;
    this.description = b.description;
    this.govern = b.govern || "none";
    this.chosenGovern = b.chosenGovern || "No Government";
    this.hops = b.hops;
    this.icon = b.icon || "void.png";
    this.id = this.idleTime = 0;
    this.lastCheck = (new Date).getTime();
    this.lastRes = this.lastProd = 0;
    this.lastSaved = (new Date).getTime();
    this.lastTime = (new Date).getTime();
    this.lost = b.lost || !1;
    this.map = b.map || 0;
    this.maps = {
        0: 1
    };
    this.money = 0;
    this.name = b.name;
    this.planets = [];
    this.planetsTransport = [];
    this.playerName = b.ruler;
    this.playerRace = b.race;
    this.playerRank = new Rank("Exiled","#999",function() {
        return !0
    }
    );
    this.repLevel = null;
    this.reputation = [];
    this.researches = [];
    this.researchPointProd = this.researchPoint = 0;
    this.ships = [];
    this.shortName = b.shortName || b.name;
    this.showInTournament = !0;
    this.strategy = null;
    this.timeTravelNum = this.timeDust = this.techPoints = 0;
    this.version = GAME_VERSION;
    this.wanderTime = 20;
    this.wanderStopTime = 0;
    this.mapsLength = function() {
        var b = 0, e;
        for (e in this.maps)
            b++;
        return b
    }
    ;
    this.getYear = function() {
        return parseInt(game.days / 365)
    }
    ;
    this.getDay = function() {
        return parseInt(game.days) - 365 * this.getYear()
    }
    ;
    this.contacted = function() {
        return game.researches[3].level >= this.hops
    }
    ;
    this.repName = function(b) {
        return this.reputation[b] <= repLevel.hostile.max ? "hostile" : this.reputation[b] >= repLevel.neutral.min && this.reputation[b] <= repLevel.neutral.max ? "neutral" : this.reputation[b] >= repLevel.friendly.min && this.reputation[b] <= repLevel.friendly.max ? "friendly" : this.reputation[b] >= repLevel.allied.min ? "allied" : "N/A"
    }
    ;
    this.totalProduction = function() {
        for (var b = Array(resNum), e = 0; e < resNum; e++)
            b[e] = 0;
        for (var h = 0; h < game.planets.length; h++) {
            for (e = 0; e < resNum; e++)
                b[e] += planets[game.planets[h]].globalProd[e];
            b.researchPoint += planets[game.planets[h]].globalProd.researchPoint
        }
        return b
    }
    ;
    this.esportage = Array(resNum);
    for (e = 0; e < resNum; e++)
        this.esportage[e] = {
            amount: 0,
            repNeeded: 0,
            bonus: 0
        };
    if (b.esport)
        for (e = 0; e < resNum; e++)
            this.esportage[e] = b.esport[resources[e].name] || {
                amount: 0,
                repNeeded: 0,
                bonus: 0
            };
    this.importage = Array(resNum);
    for (e = 0; e < resNum; e++)
        this.importage[e] = {
            amount: 0,
            repNeeded: 0,
            bonus: 0
        };
    if (b.importage)
        for (e = 0; e < resNum; e++)
            this.importage[e] = b.importage[resources[e].name] || {
                amount: 0,
                repNeeded: 0,
                bonus: 0
            };
    this.marketExport = function(b) {
        b = this.esportage[b];
        return game.reputation[this.id] >= b.repNeeded ? b.amount * (1 + b.bonus * (game.reputation[this.id] - b.repNeeded)) * (1 + Math.log(game.totalTPspent() + 1) / Math.log(5)) * this.planets.length : 0
    }
    ;
    this.marketImport = function(b) {
        return this.importage[b].amount * this.planets.length
    }
    ;
    this.achievements = [];
    this.routes = [];
    this.traits = b.traits || [];
    this.purposes = [];
    this.atkTimer = Math.floor(ATK_TIMER / 8 + ATK_TIMER / 8 * Math.random());
    this.findTrait = function(b) {
        for (var d = 0; d < this.traits.length && this.traits[d].name != b; )
            d++;
        return d
    }
    ;
    this.hasTrait = function(b) {
        for (var d = !1, e = 0; e < this.traits.length && !d; )
            this.traits[e].name == b && (d = !0),
            e++;
        return d
    }
    ;
    this.protect = function() {
        for (var b = 0; b < this.planets.length; b++) {
            var e = planets[this.planets[b]], h = [], l = [], u = [], v;
            for (v in e.fleets)
                if (0 != v && "hub" != v && e.fleets[v].civis == this.id && h.push(v),
                0 != v && "hub" != v && e.fleets[v].civis != this.id) {
                    var y = this.repName(e.fleets[v].civis);
                    "hostile" == y ? l.push(v) : "neutral" == y && u.push(v)
                }
            this.hasTrait("aggressive") ? this.attackOrbitingFleets(e, h, l) : this.hasTrait("defensive") && this.attackOrbitingFleets(e, h, l)
        }
    }
    ;
    this.attackOrbitingFleets = function(b, e, h) {
        for (var d = 0, g = 0, v = 0; d < e.length && 0 < b.fleets[e[d]].shipNum() && g < h.length && 50 > v; ) {
            if ("atk" == b.fleets[h[g]].battle(b.fleets[e[d]], !0).winner) {
                console.log("ATTACKING " + g + " " + d);
                var y = b.fleets[h[g]].battle(b.fleets[e[d]], !1);
                "atk" == y.winner || "draw" == y.winner ? 0 == b.fleets[h[g]].shipNum() && (b.fleets[h[g]].civis == game.id && (pop = new exportPopup(300,0,"<br><span class='red_text text_shadow'>The fleet - " + b.fleets[h[g]].name + " - has been attacked in " + b.name + " and lost the battle!</span>","info"),
                pop.drawToast()),
                delete b.fleets[h[g]],
                g++) : "def" == y.winner && 0 == b.fleets[e[d]].shipNum() && (delete b.fleets[e[d]],
                d++)
            }
            v++
        }
    }
    ;
    this.behave = function() {
        if (0 >= this.atkTimer) {
            this.atkTimer = 0;
            for (var b = [], e = [], h = [], l = "", u = "", v = 0; v < this.planets.length; v++)
                for (var y = planets[this.planets[v]], A = 0; A < y.routes.length; A++) {
                    var E = planets[y.routes[A].other(y.id)];
                    E.civis && E.civis != y.civis && (b.push({
                        planet: E.id,
                        source: y.id
                    }),
                    u += planets[E.id].name + " (" + civis[E.civis].shortName + ")[" + y.name + "], ",
                    h.has(y.id) || h.push(y.id),
                    "hostile" == civis[y.civis].repName(E.civis) && (e.push({
                        planet: E.id,
                        source: y.id
                    }),
                    l += planets[E.id].name + " (" + civis[E.civis].shortName + ")[" + y.name + "], "))
                }
            b = [];
            A = "";
            for (v = h = 0; v < this.planets.length; v++) {
                y = planets[this.planets[v]];
                for (var x in y.fleets)
                    0 != x && "hub" != x && y.fleets[x].civis == this.id && (b.push({
                        fleet: x,
                        planet: y.id,
                        loss: y.fleets[x].originalStrength - y.fleets[x].rawValue()
                    }),
                    b[b.length - 1].loss > b[h].loss && (h = b.length - 1),
                    A += y.fleets[x].name + " (" + y.name + "), ")
            }
            console.log(u);
            console.log(l);
            console.log(A);
            l = 1E300;
            for (x = 0; x < b.length; x++)
                l = Math.min(l, planets[b[x].planet].fleets[b[x].fleet].originalStrength);
            l /= 10;
            this.hasTrait("aggressive") ? (this.atkTimer = ATK_TIMER / this.traits[this.findTrait("aggressive")].value,
            this.atkTimer += .2 * this.atkTimer - .4 * Math.random() * this.atkTimer,
            0 < e.length ? (e = e[Math.floor(Math.random() * e.length)],
            v = e.planet,
            e = e.source,
            0 < b.length && 0 < l && (x = generateFleet(this.id, l, this.shortName + " Attack Fleet"),
            null != x && (x.type = "enemy_raid",
            x.move(e, v)))) : 0 < b.length && (x = generateFleet(this.id, Math.min(b[h].loss, l), this.shortName + " Reinforce Fleet"),
            null != x && planets[b[h].planet].fleets[b[h].fleet].fusion(x))) : this.hasTrait("defensive") ? (this.atkTimer = ATK_TIMER / this.traits[this.findTrait("defensive")].value,
            this.atkTimer += .2 * this.atkTimer - .4 * Math.random() * this.atkTimer,
            0 < b.length && (x = generateFleet(this.id, Math.min(b[h].loss, l), this.shortName + " Reinforce Fleet"),
            console.log(x),
            console.log(planets[b[h].planet].fleets[b[h].fleet].name),
            null != x && planets[b[h].planet].fleets[b[h].fleet].fusion(x))) : this.hasTrait("neutral") ? (this.atkTimer = ATK_TIMER / this.traits[this.findTrait("neutral")].value,
            this.atkTimer += .2 * this.atkTimer - .4 * Math.random() * this.atkTimer,
            .5 > Math.random() ? 0 < e.length ? (e = e[Math.floor(Math.random() * e.length)],
            v = e.planet,
            e = e.source,
            0 < b.length && 0 < l && (x = generateFleet(this.id, l, this.shortName + " Attack Fleet"),
            null != x && (x.type = "enemy_raid",
            x.move(e, v)))) : 0 < b.length && (x = generateFleet(this.id, Math.min(b[h].loss, l), this.shortName + " Reinforce Fleet"),
            null != x && planets[b[h].planet].fleets[b[h].fleet].fusion(x)) : 0 < b.length ? (x = generateFleet(this.id, Math.min(b[h].loss, l), this.shortName + " Reinforce Fleet"),
            null != x && planets[b[h].planet].fleets[b[h].fleet].fusion(x)) : 0 < e.length && (e = e[Math.floor(Math.random() * e.length)],
            v = e.planet,
            e = e.source,
            0 < b.length && 0 < l && (x = generateFleet(this.id, l, this.shortName + " Attack Fleet"),
            null != x && (x.type = "enemy_raid",
            x.move(e, v))))) : (this.atkTimer = ATK_TIMER,
            this.atkTimer += .2 * this.atkTimer - .4 * Math.random() * this.atkTimer)
        }
    }
    ;
    this.res = [];
    for (e = 0; e < resNum; e++)
        this.res[e] = 0;
    this.searchPlanet = function(b) {
        for (var d = !1, e = 0; !d && e < this.planets.length; )
            this.planets[e] == b && (d = !0),
            e++;
        return d
    }
    ;
    this.pushPlanet = function(b) {
        this.searchPlanet(b) || (this.planets[this.planets.length] = b,
        this.planetsTransport[this.planetsTransport.length] = b,
        planets[b].fleets.hub && (planets[b].fleets.hub.civis = this.id),
        planets[b].onConquer())
    }
    ;
    this.removePlanet = function(b) {
        for (var d = !1, e = 0; !d && e < civis[planets[b].civis].planets.length; )
            civis[planets[b].civis].planets[e] == b ? d = !0 : e++;
        d ? (civis[planets[b].civis].planets.splice(e, 1),
        civis[planets[b].civis].capital == b && 0 < civis[planets[b].civis].planets.length && (civis[planets[b].civis].capital = civis[planets[b].civis].planets[0])) : (pop = new exportPopup(210,96,"<br><span class='blue_text text_shadow'>The planet can't be found!</span>","Ok"),
        pop.draw())
    }
    ;
    this.givePlanet = function(b) {
        for (var d = civis[planets[b].civis], e = !1, l = 0; !e && l < d.planets.length; )
            d.planets[l] == b ? e = !0 : l++;
        if (e) {
            d.planets.splice(l, 1);
            planets[b].civis = this.id;
            this.pushPlanet(b);
            for (l = 0; l < building.length; l++)
                planets[b].structure[l].number = 0;
            for (d = 0; d < resNum; d++)
                planets[b].resources[d] = 0;
            return !0
        }
        return !1
    }
    ;
    this.totalPopulation = function() {
        for (var b = 0, e = 0; e < this.planets.length; e++)
            b += planets[this.planets[e]].population;
        return b
    }
    ;
    this.influence = function() {
        for (var b = 0, e = 0; e < this.planets.length; e++)
            b += planets[this.planets[e]].influence;
        "Empire" == game.chosenGovern && characters[charactersName.human2].unlocked && (b *= 1 + .05 * civis[civisName.traum].planets.length);
        return b
    }
    ;
    this.searchAchievement = function(b) {
        for (var d = !1, e = 0; !d && e < this.achievements.length; )
            this.achievements[e] == b && (d = !0),
            e++;
        return d
    }
    ;
    this.pushAchievement = function(b) {
        this.searchAchievements(b) || (this.achievements[this.achievements.length] = b)
    }
    ;
    this.decide = function() {
        null != this.strategy && this.strategy.decide(this)
    }
    ;
    this.researchPointsProduction = function() {
        var b = this.lastProd
          , e = (new Date).getTime();
        700 <= e - this.lastCheck && (this.lastCheck = e,
        b = 1E3 / (e - this.lastTime - 10),
        this.lastTime = e,
        this.lastProd = b *= this.researchPoint - this.lastRes,
        this.lastRes = this.researchPoint);
        return b
    }
    ;
    this.totalRPspent = function() {
        for (var b = this.researchPoint, e = 0; e < researches.length; e++)
            b += researches[e].totalCost();
        return b
    }
    ;
    this.totalTPspent = function() {
        for (var b = this.techPoints, e = 0; e < researches.length; e++)
            b += researches[e].totalBonusCost();
        return b
    }
    ;
    this.setReputation = function(b, e) {
        this.reputation[b] = Math.min(Math.max(e, minRep), maxRep)
    }
}
var governments = []
  , civis = [];
for (c = 0; c < civisDefinition.length; c++)
    civis.push(new Game(civisDefinition[c]));
var game = civis[gameSettings.civis];
for (i = 0; i < civis.length; i++) {
    civis[i].id = i;
    for (var k = 0; k < civis.length; k++)
        civis[i].reputation[k] = 0
}
var civisName = [];
for (i = 0; i < civis.length; i++)
    civisName[civis[i].playerName] = i;
function setRep(b, e, d) {
    civis[b].reputation[e] = d;
    civis[e].reputation[b] = d;
    civis[b].reputation[e] < minRep && (civis[b].reputation[e] = minRep);
    civis[b].reputation[e] > maxRep && (civis[b].reputation[e] = maxRep)
}
function addRep(b, e, d) {
    setRep(b, e, civis[b].reputation[e] + d)
}
for (i = 0; i < reputationDefinition.length; i++) {
    var xx = reputationDefinition[i];
    setRep(civisName[xx.c1], civisName[xx.c2], repLevel[xx.r1], repLevel[xx.r2])
}
var planets = [];
for (i = 0; i < planetsDefinition.length; i++)
    planets.push(new Planet(planetsDefinition[i]));
for (i = 0; i < planets.length; i++)
    planets[i].id = i,
    planetsName[planets[i].icon] = i,
    planets[i].population = 0,
    "undefined" !== typeof SHARED_RESOURCES && SHARED_RESOURCES && (planets[i].resources = planets[0].resources);
function Place(b) {
    this.id = b.id;
    this.name = b.name;
    this.planet = b.planet;
    this.staticDescription = b.description;
    this.bonusDescription = b.bonusDescription || "";
    this.position = b.position || {
        x: .5,
        y: .5
    };
    this.descriptionCheck = b.descriptionCheck || function() {
        return !0
    }
    ;
    this.extraAction = b.action || function() {}
    ;
    this.done = !1;
    this.quest = b.quest || "";
    this.description = function() {
        var b = this.staticDescription;
        this.descriptionCheck() && "" != this.bonusDescription && (b += ", " + this.bonusDescription);
        return b
    }
    ;
    this.action = function() {
        this.available() && (this.extraAction(),
        this.done = !0)
    }
    ;
    this.available = function() {
        var b = quests[questNames[this.quest]];
        return b.available() && !b.done && !this.done
    }
}
for (var places = [], p = 0; p < placesDefinition.length; p++)
    places.push(new Place(placesDefinition[p]));
var placesNames = [];
for (q = 0; q < places.length; q++)
    placesNames[places[q].id] = q,
    planets[places[q].planet].places.push(places[q]);
var books = [];
books.push(new Book({
    title: "Empress Message",
    pages: ["To all people of Halean Galactic Empire, the Empress herself is writing to you.<br>It is with immense sadness and despair that I announce our failure. Azure Fleet has fallen together with our fellow brothers and sisters, fathers and mothers, husbands and wives. In these extreme circumstances nothing is left to be done. All units must immediately disengage and retreat. Every colony must be immediately abandoned, leave everything behind you. You won't lose anything because we already lost everything. We won't let the enemy cancel us from the galayx though. We will see each other in our ancestor's land, and we will soon become stronger than ever! Further instructions will follow.<br>Together we stand, divided we fall.<br><br>Empress Maira"],
    req: function() {
        return game.searchPlanet(planetsName.posirion) && game.searchPlanet(planetsName.traurig) && game.searchPlanet(planetsName.epsilon) && game.searchPlanet(planetsName.zhura) && game.searchPlanet(planetsName.bhara) && game.searchPlanet(planetsName.caerul)
    }
}));
var routes = [];
for (i = 0; i < routesDefinition.length; i++)
    routes.push(new Route(routesDefinition[i].p1,routesDefinition[i].p2,routesDefinition[i].type));
for (i = 0; i < routes.length; i++)
    routes[i].id = i,
    planets[routes[i].planet1].routes.push(routes[i]),
    planets[routes[i].planet2].routes.push(routes[i]);
for (i = 0; i < civisPlanetsDefinition.length; i++)
    planets[planetsName[civisPlanetsDefinition[i].name]].setCivis(civisPlanetsDefinition[i].civis);
for (i = 0; i < civisCapitalsDefinition.length; i++)
    civis[civisCapitalsDefinition[i].civis].capital = planetsName[civisCapitalsDefinition[i].capital];
for (i = 1; i < planets.length; i++)
    planets[i].civis && (planets[i].population = planets[i].sustainable());
var buildings = [];
for (k = 0; k < buildingsDefinition.length; k++)
    buildings.push(new Building(buildingsDefinition[k]));
for (k = 0; k < buildings.length; k++)
    buildings[k].id = k,
    buildings[k].civis = i;
var buildingsName = [];
for (i = 0; i < buildings.length; i++)
    buildingsName[buildings[i].name] = i;
function replaceWith(b, e, d) {
    for (var g = "", h = 0; h < b.length; h++)
        g = b[h] == e ? g + d : g + b[h];
    return g
}
function searchBuildingByName(b, e) {
    var d = !1
      , g = !0
      , h = 0;
    e && (h = buildings.length - 1);
    for (var l = replaceWith(b, "_", " "); !d && g; )
        l.toLowerCase() == buildings[h].displayName.toLowerCase() ? d = !0 : e ? h-- : h++,
        g = h < buildings.length,
        e && (g = 0 <= h);
    return d ? h : -1
}
var energyBuildings = []
  , unenergyBuildings = [];
for (i = 0; i < buildings.length; i++)
    0 < buildings[i].energy ? energyBuildings.push(i) : 0 > buildings[i].energy && unenergyBuildings.push(i);
for (i = 0; i < planets.length; i++)
    for (planets[i].globalNoRes = Array(buildings.length),
    k = 0; k < buildings.length; k++) {
        planets[i].globalNoRes[k] = Array(resNum);
        for (var s = 0; s < resNum; s++)
            planets[i].globalNoRes[k][s] = !1;
        planets[i].structure[k] = new PlanetBuilding(i,k,0)
    }
planets[planetsName[START_PLANET]].structure[0].number = 1;
planets[planetsName[START_PLANET]].population = 1E3;
function Strategy(b, e) {
    this.lastDecision = (new Date).getTime();
    this.rpvalue = 0;
    this.researchImportance = e || 1;
    this.civis = b;
    this.recursion = 0;
    this.build = function(b, e, h, l) {
        this.recursion++;
        if (512 < this.recursion)
            return !1;
        for (var d = e.resourcesProd, g = b.rawProduction(), y = !0, A = 0; A < resNum; A++)
            if (g[A] += b.globalImport[A] - b.globalExport[A],
            0 > d[A] + g[A] && l != A && !(0 == b.baseResources[A] && b.resources[A] < b.structure[e.id].cost(A))) {
                for (var E = !0, x = [], H = 0; H < buildings.length; H++)
                    0 < buildings[H].resourcesProd[A] && buildings[H].show(b) ? (x[H] = b.structure[H].value(),
                    E = !1) : x[H] = -1E14;
                E || (E = x.idMax(),
                E != e.id && (this.build(b, buildings[E], h, l) || (y = !1)))
            }
        if (0 > e.energy + b.energyProduction() + b.energyConsumption()) {
            E = !0;
            x = [];
            for (H = 0; H < buildings.length; H++)
                0 < buildings[H].energy && buildings[H].show(b) ? (x[H] = b.structure[H].value(),
                E = !1) : x[H] = -1E14;
            E || (E = x.idMax(),
            E != e.id && (this.build(b, buildings[E], h, "energy") || (y = !1)))
        }
        if (y) {
            if (b.buyStructure(e.id))
                return console.log("Build " + e.displayName),
                !0;
            console.log("To queue " + e.displayName);
            b.compactQueue();
            h = 0;
            for (l = !1; !l && b.queue[h]; )
                b.queue[h].b == e.id && (l = !0),
                h++;
            l || (b.addQueue(e.id, 1),
            console.log("QUEUEd " + e.displayName));
            for (h = 0; h < resNum; h++)
                if (b.resources[h] < b.structure[e.id].cost(h)) {
                    E = !0;
                    x = [];
                    for (H = 0; H < buildings.length; H++)
                        0 < buildings[H].resourcesProd[h] && buildings[H].show(b) ? (x[H] = b.structure[H].value(),
                        E = !1) : x[H] = -1E14;
                    E || (E = x.idMax(),
                    b.buyStructure(E),
                    console.log("Build " + buildings[E].displayName))
                }
        }
        return !1
    }
    ;
    this.decide = function(b) {
        if (3E3 <= (new Date).getTime() - this.lastDecision) {
            this.lastDecision = (new Date).getTime();
            if (1 < b.planets.length) {
                for (var d = 0; d < b.planets.length; d++) {
                    for (var e = planets[b.planets[d]], l = [], u = 0; u < resNum; u++)
                        l[u] = 0;
                    for (var v = 0; v < buildings.length; v++)
                        if (0 < e.structure[v].number && e.structure[v].active) {
                            var y = buildings[v].rawProduction(e);
                            for (u = 0; u < resNum; u++)
                                e.globalNoRes[v][u] && (l[u] += y[u])
                        }
                }
                for (u = 0; u < resNum; u++)
                    0 < l[u] && (l[u] += Math.max(globalExport[u] - globalImport[u], 0))
            }
            for (d = 0; d < b.planets.length; d++) {
                y = b.planets[d];
                e = planets[y].rawProduction();
                v = [];
                for (u = 0; u < resNum; u++)
                    l = planets[y].baseResources[u],
                    v[u] = 0 < l ? e[u] / (resources[u].value * (Math.exp(-(l - 4) * (l - 4) / 4) + Math.exp(-(l - 2) * (l - 2)) + .01)) : 1E15;
                e = v.idMin();
                u = v[e];
                v[e] = v.max();
                l = v.idMin();
                v[e] = u;
                v.energy = (planets[y].energyProduction() + planets[y].energyConsumption()) / resources.energy.value;
                v.energy < v[e] ? e = "energy" : v.energy < v[l] && (l = "energy");
                if (this.rpvalue > resources[e].value)
                    this.build(planets[y], buildings[buildingsName.lab], b, "research"),
                    this.rpvalue = 0;
                else {
                    v = 0;
                    var A = [];
                    u = !1;
                    for (var E = 0; 2 > E; ) {
                        for (v = 0; v < buildings.length; v++)
                            "energy" != e ? 0 < buildings[v].resourcesProd[e] && buildings[v].show(planets[y]) ? (A[v] = planets[y].structure[v].value(),
                            u = !0) : A[v] = -1E14 : 0 < buildings[v].energy && buildings[v].show(planets[y]) ? (A[v] = planets[y].structure[v].value(),
                            u = !0) : A[v] = -1E14;
                        v = A.idMax();
                        u || (e = l);
                        E++
                    }
                    this.recursion = 0;
                    u && this.build(planets[y], buildings[v % buildings.length], b, e)
                }
            }
            d = [];
            for (u = 0; u < b.researches.length; u++)
                b.researches[u].requirement() ? d.push(b.researches[u].value()) : d.push(-1E8);
            u = !1;
            y = v = 0;
            do
                b.researches[v].requirement() && (v = d.idMax(),
                b.researches[v].cost() <= b.researchPoint ? (b.researches[v].buy(),
                u = !0) : d[v] = d.min() - 1),
                y++;
            while (!u && y < b.researches.lenth);e = [];
            for (u = 0; u < b.researches.length; u++)
                e.push(b.researches[u].cost());
            u = 0;
            l = [];
            for (d = 0; d < b.planets.length; d++) {
                for (v = 0; v < buildings.length; v++)
                    y = buildings[v].production(planets[d]),
                    u += y.researchPoint;
                l.push(u)
            }
            (e.max() > 1E3 * u * this.researchImportance || 0 == u) && this.rpvalue++
        }
    }
}
var nebulas = [];
for (i = 0; i < nebulasDefinition.length; i++)
    nebulas[i] = new Nebula(nebulasDefinition[i]),
    nebulas[i].id = i,
    nebulas[i].pushPlanet2(nebulasDefinition[i].planets),
    nebulas[i].av = !1;
var ships = [];
for (i = 0; i < shipsDefinition.length; i++)
    if (sss = new Ship(shipsDefinition[i]),
    ships.push(sss),
    shipsDefinition[i].civis)
        for (c = 0; c < shipsDefinition[i].civis.length; c++)
            civis[shipsDefinition[i].civis[c]].ships.push(sss);
var shipsName = [];
for (i = 0; i < ships.length; i++)
    shipsName[ships[i].name] = i;
for (s = 0; s < ships.length; s++)
    for (r = 0; r < resNum; r++)
        0 < ships[s].cost[r] && (resources[r].ship = !0);
var shipTypes = {};
for (i = 0; i < ships.length; i++)
    ships[i].id = i;
var typeCount = 0;
for (i = 0; i < ships.length; i++)
    shipTypes[ships[i].type] ? shipTypes[ships[i].type].push(ships[i].id) : (shipTypes[ships[i].type] = [],
    shipTypes[ships[i].type].push(ships[i].id),
    typeCount++);
function ramp(b) {
    return 0 < b ? b : 0
}
function printShips() {
    for (var b = 0; b < ships.length; b++)
        console.log(b + " - " + ships[b].name)
}
function Fleet(b, e) {
    this.type = "normal";
    this.name = e || "";
    this.civis = b;
    this.ships = [];
    for (var d = 0; d < ships.length; d++)
        this.ships[d] = 0;
    this.storage = [];
    for (d = 0; d < resNum; d++)
        this.storage[d] = 0;
    this.autoMap = [];
    this.autoRes = [];
    this.autoPct = [];
    for (var g = 0; 2 > g; g++)
        for (this.autoRes[g] = [],
        d = 0; d < resNum; d++)
            this.autoRes[g][d] = 0,
            this.autoPct[d] = !1;
    this.bestCluster = function() {
        for (var b = 0, d = new Fleet(this.civis,""), e = 0, g = 0; g < ships.length; g++)
            this.ships[g] && (this.ships[g] * ships[g].maxStorage * ships[g].speed > this.ships[e] * ships[e].maxStorage * ships[e].speed && (e = g),
            b++);
        if (0 == b)
            return null;
        d.ships[e] = this.ships[e];
        this.ships[e] = 0;
        d.onlyS = e;
        return d
    }
    ;
    this.originalStrength = 1;
    this.totalTime = this.source = this.route = this.origin = this.nextPlanet = this.lastPlanet = this.hop = this.destination = this.departureTime = this.arrivalTime = 0;
    this.type = "orbit";
    this.exp = 0;
    this.commandQueue = {};
    this.commandString = "";
    this.commandTokens = {
        pick: "p",
        unload: "u",
        loop: "l",
        "goto": "g"
    };
    this.commandCheck = function(b) {}
    ;
    this.speed = function() {
        for (var b = 1E7, d = 0; d < this.ships.length; d++)
            0 < this.ships[d] && ships[d].speed < b && (b = ships[d].speed);
        b *= this.engineBonus();
        b = Math.min(b, 100);
        0 == this.shipNum() && (b = 0);
        return b
    }
    ;
    this.engineBonus = function() {
        var b = 1;
        ENGINE_RESOURCE && (b += this.storage[ENGINE_RESOURCE] / (5 * mi));
        return b
    }
    ;
    this.speedBonus = function(b, d, e) {
        b = ships[d].speed * this.engineBonus() / (ships[b].speed * e.engineBonus()) * 4.6 / Math.log(ships[d].combatWeight) - 2;
        return .5 * (1.1 - 2 * b / (1 + Math.abs(2 * b)) * .9)
    }
    ;
    this.travelSpeed = function() {
        for (var b = 1E7, d = 0; d < this.ships.length; d++)
            0 < this.ships[d] && ships[d].travelSpeed < b && (b = ships[d].travelSpeed);
        b *= 1 + this.storage[resourcesName.engine.id] / 1E3 * 2E-4;
        b = Math.min(b, 100);
        0 == this.shipNum() && (b = 0);
        return b
    }
    ;
    this.fusion = function(b) {
        for (var d = 0; d < ships.length; d++)
            this.ships[d] += b.ships[d],
            b.ships[d] = 0;
        for (d = 0; d < resNum; d++)
            this.storage[d] += b.storage[d],
            b.storage[d] = 0;
        this.addExp(b.exp)
    }
    ;
    this.addExp = function(b) {
        this.exp = Math.max(Math.min(this.exp + b, MAX_FLEET_EXPERIENCE), 0)
    }
    ;
    this.fleetType = function() {
        for (var b = 0, d = 0; d < ships.length; d++)
            0 < this.ships[d] && ships[d].weight * this.ships[d] > ships[b].weight * this.ships[b] && (b = d);
        return "Colonial Ship" == ships[b].type ? "Colonial Fleet" : "Miner Ship" == ships[b].type ? "Miner Fleet" : "Cargoship" == ships[b].type ? "Cargo Fleet" : 1 == this.shipNum() && 2 <= this.speed() ? "Scout Fleet" : "War Fleet"
    }
    ;
    this.usedStorage = function() {
        for (var b = 0, d = 0; d < resNum; d++)
            b += this.storage[d];
        return b
    }
    ;
    this.availableStorage = function() {
        return this.maxStorage() - this.usedStorage()
    }
    ;
    this.load = function(b, d) {
        return !(0 > d) && d <= this.availableStorage() ? (this.storage[b] += d,
        !0) : !1
    }
    ;
    this.unloadDelivery = function(b) {
        for (var d = 0; d < resNum; d++)
            planets[b].resources[d] += this.storage[d],
            this.storage[d] = 0
    }
    ;
    this.unload = function(b) {
        for (var d = 0; d < resNum; d++)
            planets[b].resourcesAdd(d, this.storage[d]),
            this.storage[d] = 0
    }
    ;
    this.raid = function(b) {
        if (planets[b].civis) {
            for (var d = [], e = planets[b].civis, h = 0; h < civis[e].planets.length; h++)
                for (var g in planets[civis[e].planets[h]].fleets)
                    planets[civis[e].planets[h]].fleets[g].civis == e && d.push(planets[civis[e].planets[h]].fleets[g]);
            h = !0;
            0 < d.length && (d.sort(function(b, d) {
                var e = b.rawValue()
                  , h = d.rawValue();
                return e < h ? -1 : e > h ? 1 : 0
            }),
            d = Math.pow(10, 8 + .44 * planets[b].strengthId) * planets[b].influence + d[0].rawValue(),
            d = generateFleet(e, d / 10, civis[e].name + "'s Raid Defence Fleet"),
            d = this.battle(d, !1, planets[b]),
            addBattleReport({
                name: "Raid on " + planets[b].name,
                date: "Y" + game.getYear() + " D" + game.getDay(),
                report: d.r
            }),
            "def" != d.winner || 1 > this.shipNum()) && (h = !1);
            addRep(planets[b].civis, game.id, -100);
            if (h) {
                addRep(civisName.pirates, game.id, 10);
                g = this.availableStorage();
                var A = game.totalProduction();
                h = Array(resNum);
                var E = 0
                  , x = 1
                  , H = 1 + game.reputation[civisName.pirates] / 1E3;
                H *= H;
                "Anarchy" == game.chosenGovern && (x = 2);
                for (d = 0; d < resNum; d++) {
                    var F = 0;
                    civis[e] && (F += civis[e].esportage[d].amount / 1E3 * resourcesPrices[d] * resourcesPrices[d] * civis[e].planets.length);
                    planets[b].raidCounter++;
                    F = Math.max(0, (planets[b].baseResources[d] / (1 + planets[b].raidCounter) + F) * (1 + Math.log(game.totalTPspent() / 10 + 1) / Math.log(5)) * A[d] * 1E3 * (.8 + .4 * Math.random()) * x * H / idleBon);
                    h[d] = F;
                    E += F
                }
                if (E > g)
                    for (e = E / g,
                    d = 0; d < resNum; d++)
                        h[d] /= e;
                for (d = 0; d < resNum; d++)
                    this.load(d, h[d]);
                b = new exportPopup(210,0,"<span class='green_text text_shadow'>The raid on " + planets[b].name + " was successful!</span>","info")
            } else
                b = new exportPopup(210,0,"<span class='red_text text_shadow'>The raid on " + planets[b].name + " was unsuccessful!</span>","info");
            b.drawToast()
        }
    }
    ;
    this.unloadResource = function(b, d, e) {
        d = Math.max(Math.min(this.storage[b], d), 0);
        planets[e].resourcesAdd(b, d);
        this.storage[b] -= d
    }
    ;
    this.loadResource = function(b, d, e) {
        var h = Math.max(Math.min(this.availableStorage(), h), 0);
        d <= this.availableStorage() && (this.storage[b] += h,
        planets[e].resourcesAdd(b, -h))
    }
    ;
    this.unloadAuto = function(b, d, e) {
        for (var h = 0; h < resNum; h++)
            planets[d].resources[h] += this.storage[h] * e,
            planets[b].resourcesAdd(h, -this.storage[h] * (e - 1)),
            this.storage[h] = 0
    }
    ;
    this.unloadSingle = function(b, d) {
        return !(0 > d) && d <= this.storage[b] ? (this.storage[b] -= d,
        !0) : !1
    }
    ;
    this.maxStorage = function() {
        for (var b = 0, d = 0; d < ships.length; d++)
            b += ships[d].maxStorage * this.ships[d];
        return b
    }
    ;
    this.shipNum = function() {
        for (var b = 0, d = 0; d < ships.length; d++)
            b += this.ships[d];
        return b
    }
    ;
    this.expBonus = function(b) {
        return {
            power: 1 + 5E-4 * this.exp,
            hp: 1 + 5E-4 * this.exp,
            armor: 1 + 5E-4 * this.exp,
            shield: 1 + 5E-4 * this.exp
        }[b]
    }
    ;
    this.ammoBonus = function() {
        pow = 1;
        AMMUNITION_RESOURCE && (pow += 10 * Math.log(1 + this.storage[AMMUNITION_RESOURCE] / (10 * mi)) / Math.log(2));
        AMMUNITIONU_RESOURCE && (pow += 20 * Math.log(1 + this.storage[AMMUNITIONU_RESOURCE] / (10 * mi)) / Math.log(2));
        AMMUNITIONT_RESOURCE && (pow += 60 * Math.log(1 + this.storage[AMMUNITIONT_RESOURCE] / (20 * mi)) / Math.log(2));
        return pow
    }
    ;
    this.alkantaraBonus = function() {
        return 1 + .1 * Math.log(1 + this.ships[14]) / Math.log(2)
    }
    ;
    this.artifactBonus = function() {
        var b = 1;
        this.civis == game.id && artifacts[artifactsName.scepter].possessed && (b *= 1 + Math.log(this.combatWeight()) / Math.log(2) / 100);
        return b
    }
    ;
    this.clusterRawPower = function(b) {
        var d = ships[b].power * Math.ceil(this.ships[b]);
        "thermal" == ships[b].weapon && characters[charactersName.wahrian].unlocked && (d *= 3);
        "antimatter" == ships[b].weapon && characters[charactersName.protohalean].unlocked && (d *= 2);
        return d
    }
    ;
    this.battleBonus = function() {
        return this.ammoBonus() * this.artifactBonus() * this.governmentBonus() * this.expBonus("power") * this.alkantaraBonus()
    }
    ;
    this.governmentBonus = function() {
        var b = 1;
        this.civis == game.id && ("Tribal Rule" == game.chosenGovern ? b *= 1 + 4 / (Math.ceil(this.shipNum()) + 1) + 1 * Math.log(10) / Math.log(1 + Math.ceil(this.shipNum())) : "Empire" == game.chosenGovern && (b *= 1 + game.influence() / 1E6,
        b *= 1 + .1 * civis[civisName.traum].planets.length));
        return b
    }
    ;
    this.power = function() {
        for (var b = 0, d = 0; d < ships.length; d++)
            b += this.clusterRawPower(d);
        return b *= this.battleBonus()
    }
    ;
    this.shieldPiercingBonus = function() {
        return 1 - Math.log(10) / Math.log(Math.ceil(this.ships[103]) / 1E3 + 10)
    }
    ;
    this.clusterShield = function(b) {
        var d = this.storage[SHIELD_RESOURCE];
        return (ships[b].shield + 1E3 * Math.sqrt(d / 1E3)) * (1 + .1 * Math.log(1 + d / 1E3) / Math.log(2)) * this.expBonus("shield")
    }
    ;
    this.clusterDamageReduction = function(b) {
        return 1 - 1 / (1 + Math.log(1 + this.clusterArmor(b) / 1E4) / Math.log(2))
    }
    ;
    this.clusterArmor = function(b) {
        return ships[b].armor * this.expBonus("armor") * this.armorBonus()
    }
    ;
    this.armor = function() {
        for (var b = 0, d = 0; d < ships.length; d++)
            b += ships[d].armor;
        return b *= this.expBonus("armor") * this.armorBonus()
    }
    ;
    this.armorBonus = function() {
        return 1 + this.storage[ARMOR_RESOURCE] / 1E3 * 5E-4
    }
    ;
    this.hp = function() {
        for (var b = 0, d = 0; d < ships.length; d++)
            b += this.clusterHP(d);
        return b
    }
    ;
    this.clusterHP = function(b) {
        return ships[b].hp * this.ships[b] * this.expBonus("hp")
    }
    ;
    this.rawValue = function() {
        for (var b = 0, d = 0, e = 0; e < ships.length; e++)
            0 < this.ships[e] && d++;
        if (0 < d)
            for (e = 0; e < ships.length; e++)
                d = 0,
                ENGINE_RESOURCE && (d = this.storage[ENGINE_RESOURCE] / (5 * mi)),
                d = 1 / (ships[e].speed * (1 + d)) * 4.6 / Math.log(1500) - 2,
                d = .5 * (1.1 - 2 * d / (1 + Math.abs(2 * d)) * .9),
                0 < this.ships[e] && (b += d * this.ships[e] * ships[e].power * this.expBonus("power") * this.ships[e] * ships[e].hp * this.expBonus("hp") / (1.001 - ships[e].armorReduction(this.storage[resourcesName.armor.id])) * ships[e].valueMult);
        return b
    }
    ;
    this.value = function() {
        var b = this.rawValue()
          , d = this.alkantaraBonus()
          , e = this.ammoBonus();
        b = 100 * (Math.log(1 + b / 1) + Math.log(e / 1) + Math.log(d / 1)) / Math.log(1.1);
        return 0 == b ? 1 : b
    }
    ;
    this.weight = function() {
        for (var b = 0, d = 0; d < ships.length; d++)
            b += ships[d].weight * this.ships[d];
        return b
    }
    ;
    this.combatWeight = function() {
        for (var b = 0, d = 0; d < ships.length; d++)
            b += this.clusterCombatWeight(d);
        return b
    }
    ;
    this.clusterCombatWeight = function(b) {
        return this.ships[b] * ships[b].combatWeight
    }
    ;
    this.totalWeight = function() {
        return this.weight() + this.usedStorage()
    }
    ;
    this.battleProb = function(b) {
        var d = ramp(b.hp() / (this.power() - b.armor() - .01));
        b = ramp(this.hp() / (1.1 * b.power() - this.armor() - .01));
        d /= b + .01;
        return Math.random() < d * d / 4 ? 1 : 0
    }
    ;
    this.battlePre40 = function(b, d, e) {
        var h = "<span style='font-size:90%;'>"
          , g = this
          , l = b;
        this.civis == game.id && (g = b,
        l = this);
        for (var u = l.value(), x = g.value(), H = [], F = [], m = 0; m < ships.length; m++)
            H[m] = this.ships[m],
            F[m] = b.ships[m];
        var w = this.storage[resourcesName["dark matter"].id]
          , K = b.storage[resourcesName["dark matter"].id]
          , I = !1;
        d && (I = !0);
        d = 0;
        var C = b.hp()
          , B = b.power()
          , z = this.hp()
          , aa = this.power()
          , ca = b.hp();
        b.power();
        var P = this.hp(), L;
        this.power();
        var la = []
          , S = [];
        for (m = 0; m < ships.length; m++)
            S[m] = b.ships[m],
            la[m] = 0 < ships[m].hp ? b.ships[m] * ships[m].hp * b.expBonus("hp") : 0;
        var ba = []
          , fa = [];
        for (m = 0; m < ships.length; m++)
            fa[m] = this.ships[m],
            ba[m] = 0 < ships[m].hp ? this.ships[m] * ships[m].hp * this.expBonus("hp") : 0;
        for (var R = Array(this.ships.length), T = 0; T < this.ships.length; T++)
            R[m] = 0;
        var V = Array(ships.length);
        for (m = 0; m < ships.length; m++)
            V[m] = 0;
        var M = Array(ships.length);
        for (m = 0; m < ships.length; m++)
            M[m] = 0;
        b.maxStorage();
        this.maxStorage();
        var G = b.usedStorage()
          , O = this.usedStorage()
          , ka = []
          , ta = []
          , ya = []
          , pa = [];
        for (m = 0; m < ships.length; m++)
            ya[m] = this.ships[m],
            pa[m] = b.ships[m],
            ka[m] = this.ships[m],
            ta[m] = b.ships[m];
        for (var wa = !1, oa = !1, qa = !1, ia = !1; 0 < C && 0 < z && 256 > d; ) {
            var da = ""
              , ra = 20;
            for (m = C = 0; m < ships.length; m++)
                0 < la[m] && C++;
            for (m = 0; m < ships.length; m++)
                ;
            z = C = 1;
            b.civis == game.id && artifacts[artifactsName.scepter].possessed && (C += Math.log(b.combatWeight()) / Math.log(2) / 100);
            this.civis == game.id && artifacts[artifactsName.scepter].possessed && (z += Math.log(this.combatWeight()) / Math.log(2) / 100);
            for (m = 0; m < ships.length; m++)
                if (0 < la[m]) {
                    var ma = b.ships[m] * ships[m].combatWeight / b.combatWeight()
                      , U = L = 0
                      , xa = ma * (1 + .1 * Math.log(1 + this.ships[14]) / Math.log(2))
                      , W = 1 - Math.log(10) / Math.log(this.ships[103] / 1E3 + 10)
                      , za = 10 * Math.log(1 + this.storage[resourcesName.ammunition.id] / 1E7) / Math.log(2) + 20 * Math.log(1 + this.storage[resourcesName["u-ammunition"].id] / 1E7) / Math.log(2) + 60 * Math.log(1 + this.storage[resourcesName["t-ammunition"].id] / 2E7) / Math.log(2)
                      , Ba = Math.sqrt(1E5 * b.storage[resourcesName["shield capsule"].id])
                      , ua = {
                        power: b.expBonus("power") * C,
                        armor: b.expBonus("armor"),
                        hp: b.expBonus("hp"),
                        shield: b.expBonus("shield")
                    }
                      , sa = {
                        power: this.expBonus("power") * z,
                        armor: this.expBonus("armor"),
                        hp: this.expBonus("hp"),
                        shield: this.expBonus("shield")
                    }
                      , Aa = 1 / (1 + Math.log(1 + ships[m].armor * ua.armor * (1 + b.storage[resourcesName.armor.id] / (2 * mi)) / 1E4) / Math.log(2))
                      , ha = 0
                      , N = 1;
                    oa && (ha = .5,
                    N = 1 + .5 * this.ships[72]);
                    var na = 0;
                    ia && (T = Math.min(this.storage[resourcesName["dark matter"].id], mi),
                    na = this.ships[113] * T * 500 * mi,
                    this.storage[resourcesName["dark matter"].id] -= this.ships[113] * T);
                    if (e)
                        for (I || (e.structure[buildingsName.turret].active && e.resourcesAdd(resourcesName.explosives.id, 10 * -e.structure[buildingsName.turret].number),
                        e.structure[buildingsName.laser].active && e.resourcesAdd(resourcesName["full battery"].id, -e.structure[buildingsName.laser].number * mi)),
                        T = 0; T < civis[e.civis].planets.length; T++) {
                            var Q = civis[e.civis].planets[T];
                            e.shortestPath[Q] && planets[Q].structure[buildingsName.cannon].active && 0 < planets[Q].structure[buildingsName.cannon].number && (I || planets[Q].resourcesAdd(resourcesName.explosives.id, 100 * -planets[Q].structure[buildingsName.cannon].number))
                        }
                    for (Q = T = 0; Q < ships.length; Q++) {
                        var Z = ships[m].speed * (1 + b.storage[resourcesName.engine.id] / (5 * mi)) / (ships[Q].speed * (1 + this.storage[resourcesName.engine.id] / (5 * mi))) * 4.6 / Math.log(ships[m].combatWeight) - 2;
                        Z = 2 * Z / (1 + Math.abs(2 * Z));
                        U += .5 * V[Q] * (1.1 - .9 * Z) * Math.min(Aa + ha + ships[Q].piercing / 100, 1) * N;
                        var ea = 1
                          , n = ships[m].shield + Ba;
                        "laser" == ships[Q].weapon && "darkmatter" == ships[m].weapon && (ea = 0);
                        var Ca = V[Q] + this.ships[Q] * Math.max(ea * ships[Q].power * sa.power - Math.max(n * ua.shield * (1 - W), 0), 0) * (1 + za) * xa * N;
                        V[Q] += this.ships[Q] * ea * ships[Q].power * sa.power * (1 + za) * xa * N;
                        L += .5 * Ca * (1.1 - .9 * Z) * Math.min(Aa + ha + ships[Q].piercing / 100, 1) * N;
                        T += Math.max(na * ma - n * ua.shield, 0)
                    }
                    L += T;
                    la[m] -= L;
                    for (Q = 0; Q < ships.length; Q++)
                        V[Q] = 0 > la[m] ? -la[m] / (1 + L) * V[Q] : 0;
                    da += "Attacker <span class='blue_text' style='font-size:100%'>" + ships[m].name + "</span> suffer <span class='blue_text' style='font-size:100%'>" + beauty(L) + "</span> damage ";
                    ia && (da += " (of which " + beauty(T) + " from gamma ray bursts)");
                    da += ", " + beauty(U) + " from previous cluster, <span class='blue_text' style='font-size:100%'>" + Math.floor(1E4 * ma) / 100 + "%</span> weight<br>";
                    ra += 24
                }
            da += "<br>";
            ra += 24;
            for (m = ia = 0; m < ships.length; m++)
                0 < ba[m] && ia++;
            for (m = 0; m < ships.length; m++)
                ;
            for (m = 0; m < ships.length; m++)
                if (0 < ba[m]) {
                    ma = this.ships[m] * ships[m].combatWeight / this.combatWeight();
                    U = L = 0;
                    xa = ma * (1 + .1 * Math.log(1 + b.ships[14]) / Math.log(2));
                    W = 1 - Math.log(10) / Math.log(b.ships[103] / 1E3 + 10);
                    za = 10 * Math.log(1 + b.storage[resourcesName.ammunition.id] / 1E7) / Math.log(2) + 20 * Math.log(1 + b.storage[resourcesName["u-ammunition"].id] / 1E7) / Math.log(2) + 60 * Math.log(1 + b.storage[resourcesName["t-ammunition"].id] / 2E7) / Math.log(2);
                    Ba = 1E3 * Math.sqrt(this.storage[resourcesName["shield capsule"].id] / 1E3);
                    sa = {
                        power: b.expBonus("power") * C,
                        armor: b.expBonus("armor"),
                        hp: b.expBonus("hp"),
                        shield: b.expBonus("shield")
                    };
                    ua = {
                        power: this.expBonus("power") * z,
                        armor: this.expBonus("armor"),
                        hp: this.expBonus("hp"),
                        shield: this.expBonus("shield")
                    };
                    Aa = 1 / (1 + Math.log(1 + ships[m].armor * ua.armor * (1 + this.storage[resourcesName.armor.id] / (2 * mi)) / 1E4) / Math.log(2));
                    ha = 0;
                    N = 1;
                    wa && (ha = .5,
                    N = 1 + .5 * b.ships[72]);
                    na = 0;
                    qa && (T = Math.min(b.storage[resourcesName["dark matter"].id], mi),
                    na = b.ships[113] * T * 500 * mi,
                    b.storage[resourcesName["dark matter"].id] -= b.ships[113] * T);
                    for (Q = T = 0; Q < ships.length; Q++)
                        Z = ships[m].speed * (1 + this.storage[resourcesName.engine.id] / (5 * mi)) / (ships[Q].speed * (1 + b.storage[resourcesName.engine.id] / (5 * mi))) * 4.6 / Math.log(ships[m].combatWeight) - 2,
                        Z = 2 * Z / (1 + Math.abs(2 * Z)),
                        U += .5 * M[Q] * (1.1 - .9 * Z) * Math.min(Aa + ha + ships[Q].piercing / 100, 1) * N,
                        ea = 1,
                        n = ships[m].shield + Ba,
                        "laser" == ships[Q].weapon && "darkmatter" == ships[m].weapon && (ea = 0),
                        ia = M[Q] + b.ships[Q] * Math.max(ea * ships[Q].power * sa.power - Math.max(n * ua.shield - W, 0), 0) * (1 + za) * xa * N,
                        M[Q] += b.ships[Q] * ea * ships[Q].power * sa.power * (1 + za) * xa * N,
                        L += .5 * ia * (1.1 - .9 * Z) * Math.min(Aa + ha + ships[Q].piercing / 100, 1) * N,
                        T += Math.max(na * ma - n * ua.shield, 0);
                    L += T;
                    ba[m] -= L;
                    for (Q = 0; Q < ships.length; Q++)
                        M[Q] = 0 > ba[m] ? -ba[m] / (1 + L) * M[Q] : 0;
                    da += "Defender <span class='blue_text' style='font-size:100%'>" + ships[m].name + "</span> suffer <span class='blue_text' style='font-size:100%'>" + beauty(L) + "</span> damage ";
                    qa && (da += " (of which " + beauty(T) + " from gamma ray bursts)");
                    da += ", " + beauty(U) + " from previous cluster, <span class='blue_text' style='font-size:100%'>" + Math.floor(1E4 * ma) / 100 + "%</span> weight<br>";
                    ra += 24
                }
            da += "<br>";
            da += "<br>";
            ra += 24;
            ra += 24;
            ma = "";
            for (m = 0; m < ships.length; m++)
                b.ships[m] = 0 < la[m] ? Math.min(parseInt(Math.ceil(la[m] / (ships[m].hp * b.expBonus("hp")))), F[m]) : 0,
                0 < b.ships[m] && (ma += "Attacker <span class='blue_text' style='font-size:100%'>" + ships[m].name + "</span> remains <span class='blue_text' style='font-size:100%'>" + beautyDot(b.ships[m]) + " </span>(-" + Math.floor(1E4 * (1 - b.ships[m] / ta[m])) / 100 + "% of previous round, -" + Math.floor(1E4 * (1 - b.ships[m] / pa[m])) / 100 + "% of total)<br>",
                ra += 24),
                ta[m] = b.ships[m];
            ra += 24;
            U = "";
            for (m = 0; m < ships.length; m++)
                this.ships[m] = 0 < ba[m] ? Math.min(parseInt(Math.ceil(ba[m] / (ships[m].hp * this.expBonus("hp")))), H[m]) : 0,
                0 < this.ships[m] && (U += "Defender <span class='blue_text' style='font-size:100%'>" + ships[m].name + "</span> remains <span class='blue_text' style='font-size:100%'>" + beautyDot(this.ships[m]) + "</span> (-" + Math.floor(1E4 * (1 - this.ships[m] / ka[m])) / 100 + "% of previous round, -" + Math.floor(1E4 * (1 - this.ships[m] / ya[m])) / 100 + "% of total)<br>",
                ra += 24),
                ka[m] = this.ships[m];
            C = b.hp();
            z = this.hp();
            m = B;
            L = aa;
            B = b.power();
            aa = this.power();
            gameSettings.hpreport && (ma = "<span class='blue_text' style='font-size:100%'>HP left (%): " + Math.floor(C / ca * 1E4) / 100 + "</span><br>" + ma,
            U = "<span class='blue_text' style='font-size:100%'>HP left (%): " + Math.floor(z / P * 1E4) / 100 + "</span><br>" + U);
            (.15 >= C / ca || .15 >= z / P) && 0 < b.ships[72] && (wa = !0,
            ma = "<span class='red_text' style='font-size:100%'>Attacker is in berserk!</span><br>" + ma);
            (.15 >= z / P || .15 >= C / ca) && 0 < this.ships[72] && (oa = !0,
            U = "<span class='red_text' style='font-size:100%'>Defender is in berserk!</span><br>" + U);
            ia = qa = !1;
            .5 >= B / m && 0 < b.ships[113] && (qa = !0,
            ma = "<span class='pink_text' style='font-size:100%'>Attacker is emitting gamma ray bursts!</span><br>" + ma);
            .5 >= aa / L && 0 < this.ships[113] && (ia = !0,
            U = "<span class='pink_text' style='font-size:100%'>Defender is emitting gamma ray bursts!</span><br>" + U);
            da += ma + "<br>" + U;
            d++;
            h += "<li id='turn" + d + "' name='" + d + "' class='button' style='height:" + ra + "px;'><span class='blue_text' style='font-size:120%;'>BATTLE TURN " + d + "</span><br><br><span class='white_text'>" + da + "</span></li>"
        }
        e = 0;
        m = civis[g.civis].influence() / game.influence();
        if (1 > m && l.power() > 2 * g.power() && l.armor() > 2 * g.armor() && l.hp() > 2 * g.hp() && (m = Math.min(1 - m, .3),
        Math.random() < m)) {
            e = m / 3;
            H = !1;
            for (m = 0; m < ships.length; m++)
                R[m] = Math.floor(e * g.ships[m]),
                0 < R[m] && (H = !0);
            H ? console.log("captured something") : e = 0
        }
        ra = 20;
        da = "";
        if (0 < e)
            for (m = 0; m < ships.length; m++)
                R[m] = Math.floor(e * g.ships[m]),
                0 < R[m] && (da += "<span class='blue_text' style='font-size:100%'>" + ships[m].name + "</span> captured: <span class='blue_text' style='font-size:100%'>" + R[m] + "</span><br>",
                ra += 20);
        20 < ra && (h += "<li id='turnCAPTURE' name='capture' class='button' style='height:120px;'><span class='blue_text' style='font-size:120%;'>Your Fleet captured " + Math.floor(100 * e) / 100 + "% of enemy ships: </span><br><br><span class='white_text'>" + da + "</span></li>");
        H = !1;
        0 < b.shipNum() && 0 < this.shipNum() && (H = !0);
        if (I) {
            for (m = 0; m < ships.length; m++)
                b.ships[m] = S[m],
                this.ships[m] = fa[m];
            this.storage[resourcesName["dark matter"].id] = w;
            b.storage[resourcesName["dark matter"].id] = K
        } else {
            this.storage[resourcesName.ammunition.id] = 0;
            this.storage[resourcesName["u-ammunition"].id] = 0;
            this.storage[resourcesName["t-ammunition"].id] = 0;
            this.storage[resourcesName["shield capsule"].id] = 0;
            this.storage[resourcesName.armor.id] *= .5;
            b.storage[resourcesName.ammunition.id] = 0;
            b.storage[resourcesName["u-ammunition"].id] = 0;
            b.storage[resourcesName["t-ammunition"].id] = 0;
            b.storage[resourcesName["shield capsule"].id] = 0;
            b.storage[resourcesName.armor.id] *= .5;
            w = this.maxStorage() / O;
            K = b.maxStorage() / G;
            for (G = 0; G < resNum; G++)
                1 > w && (this.storage[G] = Math.floor(this.storage[G] * w)),
                1 > K && (b.storage[G] = Math.floor(b.storage[G] * K));
            if (0 < e)
                for (m = 0; m < ships.length; m++)
                    g.ships[m] -= R[m],
                    l.ships[m] += R[m]
        }
        g = 0;
        l = 1 == d && 0 >= C && 0 >= z ? b.speed() >= this.speed() ? "atk" : "def" : C / ca >= z / P ? "atk" : "def";
        I || H || ("def" == l ? b.exp = Math.floor(b.exp / 2) : .9 < u / (x + 1) && (g = Math.ceil(this.exp / 2),
        this.exp = Math.floor(this.exp / 2)));
        b = "def" == l ? this : b;
        H ? (h += "<li id='turnEND' name='battle_end' class='button' style='height:120px;'><span class='white_text'>The battle resulted in a draw!</span><br><span class='white_text'>Awarded </span><span class='white_text'> No experience points awarded</span></li>",
        l = "draw") : (h += "<li id='turnEND' name='battle_end' class='button' style='height:120px;'><span class='white_text'>The fleet </span><span class='blue_text' style=''>" + b.name + "</span><span class='white_text'> won the battle.</span><br><span class='white_text'>Awarded </span><span class='blue_text' style=''>" + beauty(d + g) + "</span><span class='white_text'> experience points</span></li>",
        0 != b.civis || I || (I = 1,
        artifacts[artifactsName.crown].possessed && (I = 1.5),
        b.addExp((d + g) * I)));
        return {
            winner: l,
            r: h + "</span>"
        }
    }
    ;
    this.battleRound = function(b, d, e, g, y) {}
    ;
    this.battlePre41j = function(b, d, e) {
        var h = !1;
        d && (h = !0);
        d = "";
        var g = [b, this]
          , l = new Fleet(b.civis,"")
          , u = new Fleet(this.civis,"");
        fleetLoader(l, b);
        fleetLoader(u, this);
        var x = [l, u];
        b = 0;
        var H = !1
          , F = {
            berserk: !1,
            burst: !1,
            artifact: l.artifactBonus(),
            government: l.governmentBonus()
        }
          , m = {
            berserk: !1,
            burst: !1,
            artifact: u.artifactBonus(),
            government: u.governmentBonus()
        };
        for (F = [F, m]; !H; ) {
            m = new Fleet(l.civis,"");
            var w = new Fleet(u.civis,"");
            fleetLoader(m, l);
            fleetLoader(w, u);
            w = [m, w];
            for (var K = ["Attacker", "Defender"], I = ["", ""], C = [Array(ships.length), Array(ships.length)], B = 0; B < ships.length; B++)
                C[0][B] = {
                    fromFleet: 0,
                    fromBurst: 0,
                    fromCarry: 0
                },
                C[1][B] = {
                    fromFleet: 0,
                    fromBurst: 0,
                    fromCarry: 0
                };
            var z = [x[0].power(), x[1].power()];
            for (m = 0; m < w.length; m++) {
                var aa = w[m]
                  , ca = w[1 - m]
                  , P = x[m]
                  , L = x[1 - m]
                  , la = 0
                  , S = 1;
                F[m].berserk && (la = .5,
                S = 1 + .5 * aa.ships[72],
                I[m] = "<span class='red_text' style='font-size:100%'>" + K[m] + " is in berserk!</span><br>" + I[m]);
                var ba = 0;
                if (F[m].burst) {
                    var fa = Math.min(aa.storage[resourcesName["dark matter"].id], Math.ceil(aa.ships[113]) * mi);
                    ba = 500 * fa * mi;
                    P.storage[resourcesName["dark matter"].id] -= fa;
                    P = "<span class='pink_text' style='font-size:100%'>" + K[m] + " is emitting gamma ray bursts";
                    0 >= fa && (P += ", but there is no dark matter!");
                    P += "!</span><br>";
                    I[m] = P + I[m]
                }
                var R = 1;
                if (e)
                    for (e.structure[buildingsName.turret].active && e.structure[buildingsName.turret].number && (R += .1 * e.structure[buildingsName.turret].number * Math.min(e.resources[resourcesName.explosives.id] / (10 * e.structure[buildingsName.turret].number), 1)),
                    e.structure[buildingsName.laser].active && 0 < e.structure[buildingsName.laser].number && (R += .15 * e.structure[buildingsName.laser].number * Math.min(e.resources[resourcesName["full battery"].id] / (e.structure[buildingsName.laser].number * mi), 1)),
                    h || (e.structure[buildingsName.turret].active && e.resourcesAdd(resourcesName.explosives.id, 10 * -e.structure[buildingsName.turret].number),
                    e.structure[buildingsName.laser].active && e.resourcesAdd(resourcesName["full battery"].id, -e.structure[buildingsName.laser].number * mi)),
                    fa = 0; fa < civis[e.civis].planets.length; fa++)
                        if (P = civis[e.civis].planets[fa],
                        e.shortestPath[P]) {
                            B = e.x - planets[P].x;
                            var T = e.y - planets[P].y;
                            planets[P].structure[buildingsName.cannon].active && 0 < planets[P].structure[buildingsName.cannon].number && (R += .5 * planets[P].structure[buildingsName.cannon].number / (1 + (B * B + T * T) / 1E4) * Math.min(planets[P].resources[resourcesName.explosives.id] / (100 * planets[P].structure[buildingsName.cannon].number), 1),
                            sim || planets[P].resourcesAdd(resourcesName.explosives.id, 100 * -planets[P].structure[buildingsName.cannon].number))
                        }
                fa = aa.shieldPiercingBonus();
                P = Array(ships.length);
                for (B = 0; B < P.length; B++)
                    P[B] = 0 < aa.ships[B] ? aa.clusterRawPower(B) * aa.battleBonus() * S * R : 0;
                B = 1;
                S = !1;
                for (R = 0; 0 < B && R < ships.length; ) {
                    R++;
                    var V = L.combatWeight();
                    T = Array(P.length);
                    for (var M = 0; M < P.length; M++)
                        T[M] = P[M];
                    for (B = 0; B < ships.length; B++)
                        if (0 < L.ships[B]) {
                            var G = 0
                              , O = L.clusterCombatWeight(B) / V
                              , ka = ca.clusterDamageReduction(B)
                              , ta = ca.clusterShield(B)
                              , ya = Array(ships.length)
                              , pa = 0;
                            for (M = 0; M < ships.length; M++)
                                pa += P[M];
                            for (M = 0; M < ships.length; M++)
                                ya[M] = P[M] / pa;
                            for (M = 0; M < ships.length; M++)
                                0 < aa.ships[M] && ("laser" != ships[M].weapon || "darkmatter" != ships[B].weapon) && (G += P[M] * O * (1 - Math.max(ka - ships[M].piercing / 100 - la, 0)) * ca.speedBonus(M, B, aa));
                            G += ba * O;
                            C[1 - m][B].fromBurst += ba;
                            G -= Math.max(ta * (1 - fa), 0);
                            G = Math.max(G, 0);
                            S ? C[1 - m][B].fromCarry += G : C[1 - m][B].fromFleet = G;
                            M = L.clusterHP(B);
                            ka = M - G;
                            L.ships[B] *= Math.max(ka, 0) / M;
                            if (0 > ka)
                                for (M = 0; M < ships.length; M++)
                                    T[M] -= P[M] * O * (1 - Math.abs(ka) / G);
                            else
                                for (M = 0; M < ships.length; M++)
                                    T[M] -= P[M] * O
                        }
                    for (M = B = 0; M < ships.length; M++)
                        P[M] = T[M],
                        B += P[M];
                    S = !0
                }
            }
            for (m = 0; m < x.length; m++)
                F[m].burst = !1,
                F[m].berserk = !1,
                .5 >= x[m].power() / z[m] && 0 < x[m].ships[113] && (F[m].burst = !0),
                (.15 >= x[m].hp() / g[m].hp() || .15 >= x[1 - m].hp() / g[1 - m].hp()) && 0 < x[m].ships[72] && (F[m].berserk = !0);
            for (m = 0; m < x.length; m++)
                for (B = 0; B < ships.length; B++)
                    0 < w[m].ships[B] && (O = w[m].clusterCombatWeight(B) / w[m].combatWeight(),
                    I[m] += K[m] + " <span class='blue_text' style='font-size:100%'>" + ships[B].name + "</span> suffers <span class='blue_text' style='font-size:100%'>" + beauty(C[m][B].fromFleet) + "</span> damage, of which ",
                    F[m].burst && (I[m] += " " + beauty(C[m][B].fromBurst) + " from gamma ray bursts"),
                    I[m] += ", " + beauty(C[m][B].fromCarry) + " from previous cluster",
                    I[m] += ", <span class='blue_text' style='font-size:100%'>" + Math.floor(1E4 * O) / 100 + "%</span> of weight<br>");
            I[0] += "<br>";
            I[1] += "<br>";
            for (m = 0; m < x.length; m++)
                for (gameSettings.hpreport && (I[m] += "<span class='blue_text' style='font-size:100%'>HP left (%): " + Math.floor(x[m].hp() / g[m].hp() * 1E4) / 100 + "</span><br>"),
                B = 0; B < ships.length; B++)
                    0 < w[m].ships[B] && (w[m].clusterCombatWeight(B),
                    w[m].combatWeight(),
                    I[m] += K[m] + " <span class='blue_text' style='font-size:100%'>" + ships[B].name + "</span> remains <span class='blue_text' style='font-size:100%'>" + beauty(Math.ceil(x[m].ships[B])) + "</span>(-" + Math.floor(1E4 * (1 - Math.ceil(x[m].ships[B]) / Math.ceil(w[m].ships[B]))) / 100 + "% of previous round, -" + Math.floor(1E4 * (1 - Math.ceil(x[m].ships[B]) / g[m].ships[B])) / 100 + "% of total)<br>");
            b++;
            d += "<li id='turn" + b + "' name='" + b + "' class='button' ><span class='blue_text' style='font-size:120%;'>BATTLE TURN " + b + "</span><br><br><span class='white_text'>" + I[0] + "<br><br>" + I[1] + "<br><br></span></li>";
            if (256 <= b || 0 >= x[0].hp() || 0 >= x[1].hp())
                H = !0
        }
        if (!h)
            for (m = 0; m < x.length; m++) {
                for (B = 0; B < ships.length; B++)
                    x[m].ships[B] = Math.max(Math.ceil(x[m].ships[B]), 0);
                x[m].storage[AMMUNITION_RESOURCE] = 0;
                x[m].storage[AMMUNITIONU_RESOURCE] = 0;
                x[m].storage[AMMUNITIONT_RESOURCE] = 0;
                x[m].storage[SHIELD_RESOURCE] = 0;
                x[m].storage[ARMOR_RESOURCE] *= .5;
                e = x[m].maxStorage() / g[m].usedStorage();
                for (l = 0; l < resNum; l++)
                    1 > e && (x[m].storage[l] = Math.floor(x[m].storage[l] * e));
                fleetLoader(g[m], x[m])
            }
        e = 0;
        l = "atk";
        u = g[0];
        H = g[1];
        0 < x[0].shipNum() && 0 < x[1].shipNum() ? (l = "draw",
        d += "<li id='turnEND' name='battle_end' class='button' style='height:120px;'><span class='white_text'>The battle resulted in a draw!</span><br><span class='white_text'>Awarded </span><span class='white_text'> No experience points awarded</span></li>") : (0 == x[0].shipNum() && (0 == x[1].shipNum() ? g[1].speed() > g[0].speed() && (l = "def",
        u = g[1],
        H = g[0]) : (l = "def",
        u = g[1],
        H = g[0])),
        u.civis != game.id || h || (h = 1,
        artifacts[artifactsName.crown].possessed && (h = 1.5),
        e = b + Math.ceil(H.exp / 2),
        u.addExp(e * h),
        H.exp = Math.floor(H.exp / 2)),
        d += "<li id='turnEND' name='battle_end' class='button' style='height:120px;'><span class='white_text'>The fleet </span><span class='blue_text' style=''>" + u.name + "</span><span class='white_text'> won the battle.</span><br><span class='white_text'>Awarded </span><span class='blue_text' style=''>" + beauty(e) + "</span><span class='white_text'> experience points</span></li>");
        return {
            winner: l,
            r: "<span style='font-size:90%;'>" + d + "</span>"
        }
    }
    ;
    this.battle = function(b, d, e) {
        var h = !1;
        d && (h = !0);
        d = "";
        var g = [b, this]
          , l = new Fleet(b.civis,"")
          , u = new Fleet(this.civis,"");
        fleetLoader(l, b);
        fleetLoader(u, this);
        var x = [l, u];
        b = 0;
        var H = 256;
        characters[charactersName.quris1].unlocked && (H = 320);
        var F = !1
          , m = {
            berserk: !1,
            burst: !1,
            artifact: l.artifactBonus(),
            government: l.governmentBonus()
        }
          , w = {
            berserk: !1,
            burst: !1,
            artifact: u.artifactBonus(),
            government: u.governmentBonus()
        };
        for (m = [m, w]; !F; ) {
            w = new Fleet(l.civis,"");
            var K = new Fleet(u.civis,"");
            fleetLoader(w, l);
            fleetLoader(K, u);
            K = [w, K];
            for (var I = ["Attacker", "Defender"], C = ["", ""], B = [Array(ships.length), Array(ships.length)], z = 0; z < ships.length; z++)
                B[0][z] = {
                    fromFleet: 0,
                    fromBurst: 0,
                    fromCarry: 0
                },
                B[1][z] = {
                    fromFleet: 0,
                    fromBurst: 0,
                    fromCarry: 0
                };
            var aa = [x[0].power(), x[1].power()];
            for (w = 0; w < K.length; w++) {
                var ca = K[w]
                  , P = K[1 - w]
                  , L = x[w]
                  , la = x[1 - w]
                  , S = 0
                  , ba = 1;
                m[w].berserk && (S = .5,
                ba = 1 + .5 * ca.ships[72],
                C[w] = "<span class='red_text' style='font-size:100%'>" + I[w] + " is in berserk!</span><br>" + C[w]);
                var fa = 0;
                if (m[w].burst) {
                    var R = Math.min(ca.storage[resourcesName["dark matter"].id], Math.ceil(ca.ships[113]) * mi);
                    fa = 500 * R * mi;
                    L.storage[resourcesName["dark matter"].id] -= R;
                    L = "<span class='pink_text' style='font-size:100%'>" + I[w] + " is emitting gamma ray bursts";
                    0 >= R && (L += ", but there is no dark matter!");
                    L += "!</span><br>";
                    C[w] = L + C[w]
                }
                var T = 1;
                if (e) {
                    e.structure[buildingsName.turret].active && e.structure[buildingsName.turret].number && (T += .1 * e.structure[buildingsName.turret].number * Math.min(e.resources[resourcesName.explosives.id] / (10 * e.structure[buildingsName.turret].number), 1));
                    e.structure[buildingsName.laser].active && 0 < e.structure[buildingsName.laser].number && (T += .15 * e.structure[buildingsName.laser].number * Math.min(e.resources[resourcesName["full battery"].id] / (e.structure[buildingsName.laser].number * mi), 1));
                    h || (e.structure[buildingsName.turret].active && e.resourcesAdd(resourcesName.explosives.id, 10 * -e.structure[buildingsName.turret].number),
                    e.structure[buildingsName.laser].active && e.resourcesAdd(resourcesName["full battery"].id, -e.structure[buildingsName.laser].number * mi));
                    for (L = R = 0; L < civis[e.civis].planets.length; L++) {
                        var V = civis[e.civis].planets[L];
                        if (e.shortestPath[V]) {
                            z = e.x - planets[V].x;
                            var M = e.y - planets[V].y;
                            planets[V].structure[buildingsName.cannon].active && 0 < planets[V].structure[buildingsName.cannon].number && (z = (z * z + M * M) / 1E4,
                            R += .5 * planets[V].structure[buildingsName.cannon].number / (1 + z) * Math.min(planets[V].resources[resourcesName.explosives.id] / (100 * planets[V].structure[buildingsName.cannon].number), 1),
                            h || planets[V].resourcesAdd(resourcesName.explosives.id, 100 * -planets[V].structure[buildingsName.cannon].number))
                        }
                    }
                    T += R
                } else if (R = 0,
                e = planets[ca.planet]) {
                    for (L = 0; L < civis[ca.civis].planets.length; L++)
                        V = civis[ca.civis].planets[L],
                        e.shortestPath[V] && (z = e.x - planets[V].x,
                        M = e.y - planets[V].y,
                        planets[V].structure[buildingsName.cannon].active && 0 < planets[V].structure[buildingsName.cannon].number && (z = (z * z + M * M) / 1E4,
                        R += .5 * planets[V].structure[buildingsName.cannon].number / (1 + z) * Math.min(planets[V].resources[resourcesName.explosives.id] / (100 * planets[V].structure[buildingsName.cannon].number), 1),
                        h || planets[V].resourcesAdd(resourcesName.explosives.id, 100 * -planets[V].structure[buildingsName.cannon].number)));
                    T += R
                }
                R = ca.shieldPiercingBonus();
                L = Array(ships.length);
                ba = ca.battleBonus() * ba * T;
                for (z = 0; z < L.length; z++)
                    L[z] = 0 < ca.ships[z] ? ca.clusterRawPower(z) * ba : 0;
                z = 1;
                T = !1;
                for (V = 0; 0 < z && V < ships.length; ) {
                    V++;
                    var G = la.combatWeight();
                    M = Array(L.length);
                    for (var O = 0; O < L.length; O++)
                        M[O] = L[O];
                    for (z = 0; z < ships.length; z++)
                        if (0 < la.ships[z]) {
                            var ka = 0
                              , ta = la.clusterCombatWeight(z) / G
                              , ya = P.clusterDamageReduction(z)
                              , pa = Math.max(P.clusterShield(z) * (1 - R), 0)
                              , wa = Array(ships.length)
                              , oa = Array(ships.length)
                              , qa = 0;
                            for (O = 0; O < ships.length; O++)
                                oa[O] = 0 < ca.ships[O] && ships[O].power * ba > pa ? Math.max(L[O] * (1 - pa / (ships[O].power * ba)), 0) : 0,
                                qa += oa[O];
                            for (O = 0; O < ships.length; O++)
                                wa[O] = oa[O] / qa;
                            for (O = 0; O < ships.length; O++)
                                0 < ca.ships[O] && ("laser" != ships[O].weapon || "darkmatter" != ships[z].weapon) && (ka += oa[O] * ta * (1 - Math.max(ya - ships[O].piercing / 100 - S, 0)) * P.speedBonus(O, z, ca));
                            ka += fa * ta;
                            B[1 - w][z].fromBurst += fa;
                            ka = Math.max(ka, 0);
                            T ? B[1 - w][z].fromCarry += ka : B[1 - w][z].fromFleet = ka;
                            O = la.clusterHP(z);
                            ya = O - ka;
                            la.ships[z] *= Math.max(ya, 0) / O;
                            if (0 > ya)
                                for (O = 0; O < ships.length; O++)
                                    M[O] -= L[O] * ta * (1 - Math.abs(ya) / ka);
                            else
                                for (O = 0; O < ships.length; O++)
                                    M[O] -= L[O] * ta
                        }
                    for (O = z = 0; O < ships.length; O++)
                        L[O] = M[O],
                        z += L[O];
                    T = !0
                }
            }
            for (w = 0; w < x.length; w++)
                m[w].burst = !1,
                m[w].berserk = !1,
                .5 >= x[w].power() / aa[w] && 0 < x[w].ships[113] && (m[w].burst = !0),
                (.15 >= x[w].hp() / g[w].hp() || .15 >= x[1 - w].hp() / g[1 - w].hp()) && 0 < x[w].ships[72] && (m[w].berserk = !0);
            for (w = 0; w < x.length; w++)
                for (z = 0; z < ships.length; z++)
                    0 < K[w].ships[z] && (ta = K[w].clusterCombatWeight(z) / K[w].combatWeight(),
                    C[w] += I[w] + " <span class='blue_text' style='font-size:100%'>" + ships[z].name + "</span> suffers <span class='blue_text' style='font-size:100%'>" + beauty(B[w][z].fromFleet) + "</span> damage, of which ",
                    m[w].burst && (C[w] += " " + beauty(B[w][z].fromBurst) + " from gamma ray bursts"),
                    C[w] += ", " + beauty(B[w][z].fromCarry) + " from previous cluster",
                    C[w] += ", <span class='blue_text' style='font-size:100%'>" + Math.floor(1E4 * ta) / 100 + "%</span> of weight<br>");
            C[0] += "<br>";
            C[1] += "<br>";
            for (w = 0; w < x.length; w++)
                for (gameSettings.hpreport && (C[w] += "<span class='blue_text' style='font-size:100%'>HP left (%): " + Math.floor(x[w].hp() / g[w].hp() * 1E4) / 100 + "</span><br>"),
                z = 0; z < ships.length; z++)
                    0 < K[w].ships[z] && (K[w].clusterCombatWeight(z),
                    K[w].combatWeight(),
                    C[w] += I[w] + " <span class='blue_text' style='font-size:100%'>" + ships[z].name + "</span> remains <span class='blue_text' style='font-size:100%'>" + beauty(Math.ceil(x[w].ships[z])) + "</span>(-" + Math.floor(1E4 * (1 - Math.ceil(x[w].ships[z]) / Math.ceil(K[w].ships[z]))) / 100 + "% of previous round, -" + Math.floor(1E4 * (1 - Math.ceil(x[w].ships[z]) / g[w].ships[z])) / 100 + "% of total)<br>");
            b++;
            d += "<li id='turn" + b + "' name='" + b + "' class='button' ><span class='blue_text' style='font-size:120%;'>BATTLE TURN " + b + "</span><br><br><span class='white_text'>" + C[0] + "<br><br>" + C[1] + "<br><br></span></li>";
            if (b >= H || 0 >= x[0].hp() || 0 >= x[1].hp())
                F = !0
        }
        if (!h)
            for (w = 0; w < x.length; w++) {
                for (z = 0; z < ships.length; z++)
                    x[w].ships[z] = Math.max(Math.ceil(x[w].ships[z]), 0);
                x[w].storage[AMMUNITION_RESOURCE] = 0;
                x[w].storage[AMMUNITIONU_RESOURCE] = 0;
                x[w].storage[AMMUNITIONT_RESOURCE] = 0;
                x[w].storage[SHIELD_RESOURCE] = 0;
                x[w].storage[ARMOR_RESOURCE] *= .5;
                e = x[w].maxStorage() / g[w].usedStorage();
                for (l = 0; l < resNum; l++)
                    1 > e && (x[w].storage[l] = Math.floor(x[w].storage[l] * e));
                fleetLoader(g[w], x[w])
            }
        e = 0;
        l = "atk";
        u = g[0];
        H = g[1];
        0 < x[0].shipNum() && 0 < x[1].shipNum() ? (l = "draw",
        d += "<li id='turnEND' name='battle_end' class='button' style='height:120px;'><span class='white_text'>The battle resulted in a draw!</span><br><span class='white_text'>Awarded </span><span class='white_text'> No experience points awarded</span></li>") : (0 == x[0].shipNum() && (0 == x[1].shipNum() ? g[1].speed() > g[0].speed() && (l = "def",
        u = g[1],
        H = g[0]) : (l = "def",
        u = g[1],
        H = g[0])),
        u.civis != game.id || h || (h = 1,
        artifacts[artifactsName.crown].possessed && (h = 1.5),
        e = b + Math.ceil(H.exp / 2),
        u.addExp(e * h),
        H.exp = Math.floor(H.exp / 2)),
        d += "<li id='turnEND' name='battle_end' class='button' style='height:120px;'><span class='white_text'>The fleet </span><span class='blue_text' style=''>" + u.name + "</span><span class='white_text'> won the battle.</span><br><span class='white_text'>Awarded </span><span class='blue_text' style=''>" + beauty(e) + "</span><span class='white_text'> experience points</span></li>");
        return {
            winner: l,
            r: "<span style='font-size:90%;'>" + d + "</span>"
        }
    }
    ;
    this.battle2 = function(b, d, e) {
        var h = "<span style='font-size:90%;'>"
          , g = this
          , l = b;
        this.civis == game.id && (g = b,
        l = this);
        for (var u = l.value(), x = g.value(), H = [], F = [], m = 0; m < ships.length; m++)
            H[m] = this.ships[m],
            F[m] = b.ships[m];
        var w = this.storage[resourcesName["dark matter"].id]
          , K = b.storage[resourcesName["dark matter"].id];
        l = !1;
        d && (l = !0);
        d = 0;
        var I = b.hp()
          , C = b.power()
          , B = this.hp()
          , z = this.power()
          , aa = b.hp();
        b.power();
        var ca = this.hp(), P;
        this.power();
        var L = []
          , la = [];
        for (m = 0; m < ships.length; m++)
            la[m] = b.ships[m],
            L[m] = 0 < ships[m].hp ? b.ships[m] * ships[m].hp * b.expBonus("hp") : 0;
        var S = []
          , ba = [];
        for (m = 0; m < ships.length; m++)
            ba[m] = this.ships[m],
            S[m] = 0 < ships[m].hp ? this.ships[m] * ships[m].hp * this.expBonus("hp") : 0;
        var fa = Array(ships.length);
        for (m = 0; m < ships.length; m++)
            fa[m] = 0;
        var R = Array(ships.length);
        for (m = 0; m < ships.length; m++)
            R[m] = 0;
        b.maxStorage();
        this.maxStorage();
        var T = b.usedStorage()
          , V = this.usedStorage()
          , M = []
          , G = []
          , O = []
          , ka = [];
        for (m = 0; m < ships.length; m++)
            O[m] = this.ships[m],
            ka[m] = b.ships[m],
            M[m] = this.ships[m],
            G[m] = b.ships[m];
        for (var ta = !1, ya = !1, pa = !1, wa = !1; 0 < I && 0 < B && 256 > d; ) {
            var oa = ""
              , qa = 20;
            for (m = I = 0; m < ships.length; m++)
                0 < L[m] && I++;
            for (m = 0; m < ships.length; m++)
                ;
            B = I = 1;
            b.civis == game.id && artifacts[artifactsName.scepter].possessed && (I += Math.log(b.combatWeight()) / Math.log(2) / 100);
            this.civis == game.id && artifacts[artifactsName.scepter].possessed && (B += Math.log(this.combatWeight()) / Math.log(2) / 100);
            for (m = 0; m < ships.length; m++)
                if (0 < L[m]) {
                    var ia = b.ships[m] * ships[m].combatWeight / b.combatWeight()
                      , da = P = 0
                      , ra = ia * (1 + .1 * Math.log(1 + this.ships[14]) / Math.log(2))
                      , ma = 1 - Math.log(10) / Math.log(this.ships[103] / 1E3 + 10)
                      , U = 10 * Math.log(1 + this.storage[resourcesName.ammunition.id] / 1E7) / Math.log(2) + 20 * Math.log(1 + this.storage[resourcesName["u-ammunition"].id] / 1E7) / Math.log(2) + 60 * Math.log(1 + this.storage[resourcesName["t-ammunition"].id] / 2E7) / Math.log(2)
                      , xa = 1E3 * Math.sqrt(b.storage[resourcesName["shield capsule"].id] / 1E3)
                      , W = {
                        power: b.expBonus("power") * I,
                        armor: b.expBonus("armor"),
                        hp: b.expBonus("hp"),
                        shield: b.expBonus("shield")
                    }
                      , za = {
                        power: this.expBonus("power") * B,
                        armor: this.expBonus("armor"),
                        hp: this.expBonus("hp"),
                        shield: this.expBonus("shield")
                    }
                      , Ba = 1 / (1 + Math.log(1 + ships[m].armor * W.armor * (1 + b.storage[resourcesName.armor.id] / (2 * mi)) / 1E4) / Math.log(2))
                      , ua = 0
                      , sa = 1;
                    ya && (ua = .5,
                    sa = 1 + .5 * this.ships[72]);
                    var Aa = 0;
                    if (wa) {
                        var ha = Math.min(this.storage[resourcesName["dark matter"].id], mi);
                        Aa = this.ships[113] * ha * 500 * mi;
                        this.storage[resourcesName["dark matter"].id] -= this.ships[113] * ha
                    }
                    if (e)
                        for (l || (e.structure[buildingsName.turret].active && e.resourcesAdd(resourcesName.explosives.id, 10 * -e.structure[buildingsName.turret].number),
                        e.structure[buildingsName.laser].active && e.resourcesAdd(resourcesName["full battery"].id, -e.structure[buildingsName.laser].number * mi)),
                        ha = 0; ha < civis[e.civis].planets.length; ha++) {
                            var N = civis[e.civis].planets[ha];
                            e.shortestPath[N] && planets[N].structure[buildingsName.cannon].active && 0 < planets[N].structure[buildingsName.cannon].number && (l || planets[N].resourcesAdd(resourcesName.explosives.id, 100 * -planets[N].structure[buildingsName.cannon].number))
                        }
                    for (N = ha = 0; N < ships.length; N++) {
                        var na = ships[m].speed * (1 + b.storage[resourcesName.engine.id] / (5 * mi)) / (ships[N].speed * (1 + this.storage[resourcesName.engine.id] / (5 * mi))) * 4.6 / Math.log(ships[m].combatWeight) - 2;
                        na = 2 * na / (1 + Math.abs(2 * na));
                        da += .5 * fa[N] * (1.1 - .9 * na) * Math.min(Ba + ua + ships[N].piercing / 100, 1) * sa;
                        var Q = 1
                          , Z = ships[m].shield + xa;
                        "laser" == ships[N].weapon && "darkmatter" == ships[m].weapon && (Q = 0);
                        var ea = fa[N] + this.ships[N] * Math.max(Q * ships[N].power * za.power - Math.max(Z * W.shield * (1 - ma), 0), 0) * (1 + U) * ra * sa;
                        fa[N] += this.ships[N] * Q * ships[N].power * za.power * (1 + U) * ra * sa;
                        P += .5 * ea * (1.1 - .9 * na) * Math.min(Ba + ua + ships[N].piercing / 100, 1) * sa;
                        ha += Math.max(Aa * ia - Z * W.shield, 0)
                    }
                    P += ha;
                    L[m] -= P;
                    for (N = 0; N < ships.length; N++)
                        fa[N] = 0 > L[m] ? -L[m] / (1 + P) * fa[N] : 0;
                    oa += "Attacker <span class='blue_text' style='font-size:100%'>" + ships[m].name + "</span> suffer <span class='blue_text' style='font-size:100%'>" + beauty(P) + "</span> damage ";
                    wa && (oa += " (of which " + beauty(ha) + " from gamma ray bursts)");
                    oa += ", " + beauty(da) + " from previous cluster, <span class='blue_text' style='font-size:100%'>" + Math.floor(1E4 * ia) / 100 + "%</span> weight<br>";
                    qa += 24
                }
            oa += "<br>";
            qa += 24;
            for (m = wa = 0; m < ships.length; m++)
                0 < S[m] && wa++;
            for (m = 0; m < ships.length; m++)
                ;
            for (m = 0; m < ships.length; m++)
                if (0 < S[m]) {
                    ia = this.ships[m] * ships[m].combatWeight / this.combatWeight();
                    da = P = 0;
                    ra = ia * (1 + .1 * Math.log(1 + b.ships[14]) / Math.log(2));
                    ma = 1 - Math.log(10) / Math.log(b.ships[103] / 1E3 + 10);
                    U = 10 * Math.log(1 + b.storage[resourcesName.ammunition.id] / 1E7) / Math.log(2) + 20 * Math.log(1 + b.storage[resourcesName["u-ammunition"].id] / 1E7) / Math.log(2) + 60 * Math.log(1 + b.storage[resourcesName["t-ammunition"].id] / 2E7) / Math.log(2);
                    xa = 1E3 * Math.sqrt(this.storage[resourcesName["shield capsule"].id] / 1E3);
                    za = {
                        power: b.expBonus("power") * I,
                        armor: b.expBonus("armor"),
                        hp: b.expBonus("hp"),
                        shield: b.expBonus("shield")
                    };
                    W = {
                        power: this.expBonus("power") * B,
                        armor: this.expBonus("armor"),
                        hp: this.expBonus("hp"),
                        shield: this.expBonus("shield")
                    };
                    Ba = 1 / (1 + Math.log(1 + ships[m].armor * W.armor * (1 + this.storage[resourcesName.armor.id] / (2 * mi)) / 1E4) / Math.log(2));
                    ua = 0;
                    sa = 1;
                    ta && (ua = .5,
                    sa = 1 + .5 * b.ships[72]);
                    Aa = 0;
                    pa && (ha = Math.min(b.storage[resourcesName["dark matter"].id], mi),
                    Aa = b.ships[113] * ha * 500 * mi,
                    b.storage[resourcesName["dark matter"].id] -= b.ships[113] * ha);
                    for (N = ha = 0; N < ships.length; N++)
                        na = ships[m].speed * (1 + this.storage[resourcesName.engine.id] / (5 * mi)) / (ships[N].speed * (1 + b.storage[resourcesName.engine.id] / (5 * mi))) * 4.6 / Math.log(ships[m].combatWeight) - 2,
                        na = 2 * na / (1 + Math.abs(2 * na)),
                        da += .5 * R[N] * (1.1 - .9 * na) * Math.min(Ba + ua + ships[N].piercing / 100, 1) * sa,
                        Q = 1,
                        Z = ships[m].shield + xa,
                        "laser" == ships[N].weapon && "darkmatter" == ships[m].weapon && (Q = 0),
                        wa = R[N] + b.ships[N] * Math.max(Q * ships[N].power * za.power - Math.max(Z * W.shield - ma, 0), 0) * (1 + U) * ra * sa,
                        R[N] += b.ships[N] * Q * ships[N].power * za.power * (1 + U) * ra * sa,
                        P += .5 * wa * (1.1 - .9 * na) * Math.min(Ba + ua + ships[N].piercing / 100, 1) * sa,
                        ha += Math.max(Aa * ia - Z * W.shield, 0);
                    P += ha;
                    S[m] -= P;
                    for (N = 0; N < ships.length; N++)
                        R[N] = 0 > S[m] ? -S[m] / (1 + P) * R[N] : 0;
                    oa += "Defender <span class='blue_text' style='font-size:100%'>" + ships[m].name + "</span> suffer <span class='blue_text' style='font-size:100%'>" + beauty(P) + "</span> damage ";
                    pa && (oa += " (of which " + beauty(ha) + " from gamma ray bursts)");
                    oa += ", " + beauty(da) + " from previous cluster, <span class='blue_text' style='font-size:100%'>" + Math.floor(1E4 * ia) / 100 + "%</span> weight<br>";
                    qa += 24
                }
            oa += "<br>";
            oa += "<br>";
            qa += 24;
            qa += 24;
            ia = "";
            for (m = 0; m < ships.length; m++)
                b.ships[m] = 0 < L[m] ? Math.min(parseInt(Math.ceil(L[m] / (ships[m].hp * b.expBonus("hp")))), F[m]) : 0,
                0 < b.ships[m] && (ia += "Attacker <span class='blue_text' style='font-size:100%'>" + ships[m].name + "</span> remains <span class='blue_text' style='font-size:100%'>" + beautyDot(b.ships[m]) + " </span>(-" + Math.floor(1E4 * (1 - b.ships[m] / G[m])) / 100 + "% of previous round, -" + Math.floor(1E4 * (1 - b.ships[m] / ka[m])) / 100 + "% of total)<br>",
                qa += 24),
                G[m] = b.ships[m];
            qa += 24;
            da = "";
            for (m = 0; m < ships.length; m++)
                this.ships[m] = 0 < S[m] ? Math.min(parseInt(Math.ceil(S[m] / (ships[m].hp * this.expBonus("hp")))), H[m]) : 0,
                0 < this.ships[m] && (da += "Defender <span class='blue_text' style='font-size:100%'>" + ships[m].name + "</span> remains <span class='blue_text' style='font-size:100%'>" + beautyDot(this.ships[m]) + "</span> (-" + Math.floor(1E4 * (1 - this.ships[m] / M[m])) / 100 + "% of previous round, -" + Math.floor(1E4 * (1 - this.ships[m] / O[m])) / 100 + "% of total)<br>",
                qa += 24),
                M[m] = this.ships[m];
            I = b.hp();
            B = this.hp();
            m = C;
            P = z;
            C = b.power();
            z = this.power();
            gameSettings.hpreport && (ia = "<span class='blue_text' style='font-size:100%'>HP left (%): " + Math.floor(I / aa * 1E4) / 100 + "</span><br>" + ia,
            da = "<span class='blue_text' style='font-size:100%'>HP left (%): " + Math.floor(B / ca * 1E4) / 100 + "</span><br>" + da);
            (.15 >= I / aa || .15 >= B / ca) && 0 < b.ships[72] && (ta = !0,
            ia = "<span class='red_text' style='font-size:100%'>Attacker is in berserk!</span><br>" + ia);
            (.15 >= B / ca || .15 >= I / aa) && 0 < this.ships[72] && (ya = !0,
            da = "<span class='red_text' style='font-size:100%'>Defender is in berserk!</span><br>" + da);
            wa = pa = !1;
            .5 >= C / m && 0 < b.ships[113] && (pa = !0,
            ia = "<span class='pink_text' style='font-size:100%'>Attacker is emitting gamma ray bursts!</span><br>" + ia);
            .5 >= z / P && 0 < this.ships[113] && (wa = !0,
            da = "<span class='pink_text' style='font-size:100%'>Defender is emitting gamma ray bursts!</span><br>" + da);
            oa += ia + "<br>" + da;
            d++;
            h += "<li id='turn" + d + "' name='" + d + "' class='button' style='height:" + qa + "px;'><span class='blue_text' style='font-size:120%;'>BATTLE TURN " + d + "</span><br><br><span class='white_text'>" + oa + "</span></li>"
        }
        civis[g.civis].influence();
        game.influence();
        e = !1;
        0 < b.shipNum() && 0 < this.shipNum() && (e = !0);
        if (l) {
            for (m = 0; m < ships.length; m++)
                b.ships[m] = la[m],
                this.ships[m] = ba[m];
            this.storage[resourcesName["dark matter"].id] = w;
            b.storage[resourcesName["dark matter"].id] = K
        } else
            for (this.storage[resourcesName.ammunition.id] = 0,
            this.storage[resourcesName["u-ammunition"].id] = 0,
            this.storage[resourcesName["t-ammunition"].id] = 0,
            this.storage[resourcesName["shield capsule"].id] = 0,
            this.storage[resourcesName.armor.id] *= .5,
            b.storage[resourcesName.ammunition.id] = 0,
            b.storage[resourcesName["u-ammunition"].id] = 0,
            b.storage[resourcesName["t-ammunition"].id] = 0,
            b.storage[resourcesName["shield capsule"].id] = 0,
            b.storage[resourcesName.armor.id] *= .5,
            g = this.maxStorage() / V,
            w = b.maxStorage() / T,
            K = 0; K < resNum; K++)
                1 > g && (this.storage[K] = Math.floor(this.storage[K] * g)),
                1 > w && (b.storage[K] = Math.floor(b.storage[K] * w));
        g = 0;
        aa = 1 == d && 0 >= I && 0 >= B ? b.speed() >= this.speed() ? "atk" : "def" : I / aa >= B / ca ? "atk" : "def";
        l || e || ("def" == aa ? b.exp = Math.floor(b.exp / 2) : .9 < u / (x + 1) && (g = Math.ceil(this.exp / 2),
        this.exp = Math.floor(this.exp / 2)));
        b = "def" == aa ? this : b;
        e ? (h += "<li id='turnEND' name='battle_end' class='button' style='height:120px;'><span class='white_text'>The battle resulted in a draw!</span><br><span class='white_text'>Awarded </span><span class='white_text'> No experience points awarded</span></li>",
        aa = "draw") : (h += "<li id='turnEND' name='battle_end' class='button' style='height:120px;'><span class='white_text'>The fleet </span><span class='blue_text' style=''>" + b.name + "</span><span class='white_text'> won the battle.</span><br><span class='white_text'>Awarded </span><span class='blue_text' style=''>" + beauty(d + g) + "</span><span class='white_text'> experience points</span></li>",
        0 != b.civis || l || (l = 1,
        artifacts[artifactsName.crown].possessed && (l = 1.5),
        b.addExp((d + g) * l)));
        return {
            winner: aa,
            r: h + "</span>"
        }
    }
    ;
    this.move = function(b, d) {
        return fleetSchedule.push(this, b, b, d, this.type)
    }
    ;
    this.shipNum = function() {
        for (var b = 0, d = 0; d < ships.length; d++)
            b += this.ships[d];
        return b
    }
}
for (i = 0; i < planets.length; i++)
    planets[i].fleets[0] = new Fleet(planets[i].civis,"shp"),
    planets[i].fleets.hub = new Fleet(planets[i].civis,"hub");
for (i = 0; i < fleetsDefinition.length; i++) {
    var def = fleetsDefinition[i]
      , mf = new Fleet(def.civis,def.name);
    for (s = 0; s < def.ships.length; s++)
        mf.ships[def.ships[s].ship] = def.ships[s].value;
    mf.exp = def.exp || 0;
    planets[planetsName[def.planet]].fleetPush(mf)
}
var planetStrengthSort = [];
for (i = 0; i < planets.length; i++) {
    var plt = planets[i];
    planetStrengthSort[i] = i;
    plt.originalStrength = 0;
    if (plt.civis)
        for (var f in plt.fleets)
            "hub" != f && 0 != f && (plt.fleets[f].originalStrength = plt.fleets[f].rawValue(),
            plt.originalStrength += plt.fleets[f].originalStrength)
}
planetStrengthSort.sort(function(b, e) {
    var d = planets[b].originalStrength
      , g = planets[e].originalStrength;
    return d < g ? -1 : d > g ? 1 : 0
});
for (i = 0; i < planetStrengthSort.length; i++)
    planets[planetStrengthSort[i]].strengthId = i;
function FleetSchedule() {
    this.fleets = [];
    this.list = null;
    this.activeNum = this.count = 0;
    this.fleetArrived = !1;
    this.pop = function() {
        for (var b = [], e = [], d = 0; d < this.fleets.length; d++) {
            var g = idleBon;
            if (this.fleets[d] && this.fleets[d].departureTime + (this.fleets[d].arrivalTime - this.fleets[d].departureTime) / g <= (new Date).getTime())
                if (this.list = this.fleets[d],
                0 == this.fleets[d].departureTime)
                    b.push({
                        fleet: this.fleets[d],
                        destination: this.list.destination
                    }),
                    this.fleets[d] = null;
                else {
                    g = !0;
                    for (var h in this.fleets[d].commandQueue) {
                        "i" != h && (g = !1);
                        break
                    }
                    g || console.log("empty");
                    if (this.list.nextPlanet != this.list.destination)
                        e.push({
                            o: this.list.origin,
                            t: this.list.type,
                            f: this.fleets[d],
                            s: this.list.nextPlanet,
                            d: this.list.destination,
                            id: d,
                            hop: this.list.hop + 1
                        });
                    else if ("auto" == this.fleets[d].type) {
                        if (planets[this.list.destination].civis == game.id) {
                            e.push({
                                o: this.list.destination,
                                t: "auto",
                                f: this.fleets[d],
                                s: this.list.destination,
                                d: this.list.origin,
                                id: d,
                                hop: 0
                            });
                            g = this.list.destination;
                            var l = this.fleets[d];
                            l.unload(g);
                            if (l.autoRes[l.autoMap[g]]) {
                                var u = 2 * planets[this.list.origin].shortestPath[g].distance / l.speed();
                                if (gameSettings.autorcorrection) {
                                    u = 0;
                                    for (var v = this.list.origin; v != g; ) {
                                        var y = routes[planets[v].shortestPath[g].route]
                                          , A = y.distance() / l.speed();
                                        u += 2 * Math.ceil(A / idleBon / averageTFleet) * averageTFleet * idleBon;
                                        v = y.other(v)
                                    }
                                }
                                for (v = 0; v < resNum; v++)
                                    y = l.autoRes[l.autoMap[g]][v],
                                    l.autoPct[v] && (y = 0,
                                    0 > planets[this.list.origin].globalRaw[v] && (y -= planets[this.list.origin].globalRaw[v] * l.autoRes[l.autoMap[this.list.origin]][v] / 1E4 * u / idleBon),
                                    0 < planets[g].globalRaw[v] && (y += planets[g].globalRaw[v] * l.autoRes[l.autoMap[g]][v] / 1E4 * u / idleBon)),
                                    y = Math.min(Math.min(Math.floor(y), planets[g].resources[v]), l.availableStorage()),
                                    l.load(v, y) && planets[g].resourcesAdd(v, -y)
                            } else
                                b.push({
                                    fleet: this.fleets[d],
                                    destination: this.list.destination
                                }),
                                this.fleets[d] = null
                        }
                    } else if ("market_sell" == this.fleets[d].type)
                        market.sell(this.fleets[d]),
                        e.push({
                            o: this.list.destination,
                            t: "normal",
                            f: this.fleets[d],
                            s: this.list.destination,
                            d: this.list.origin,
                            id: d,
                            hop: 0
                        }),
                        this.fleets[d].type = "normal";
                    else if ("market_delivery" == this.fleets[d].type)
                        this.fleets[d].unload(this.fleets[d].destination),
                        this.fleets[d] = null;
                    else if ("delivery" == this.fleets[d].type)
                        this.fleets[d].unload(this.fleets[d].destination),
                        e.push({
                            o: this.list.destination,
                            t: "normal",
                            f: this.fleets[d],
                            s: this.list.destination,
                            d: this.list.origin,
                            id: d,
                            hop: 0
                        }),
                        this.fleets[d].type = "normal";
                    else if ("raid" == this.fleets[d].type)
                        this.fleets[d].raid(this.fleets[d].destination),
                        0 < this.fleets[d].shipNum() ? (e.push({
                            o: this.list.destination,
                            t: "pickup_return",
                            f: this.fleets[d],
                            s: this.list.destination,
                            d: this.list.origin,
                            id: d,
                            hop: 0
                        }),
                        this.fleets[d].type = "pickup_return") : this.fleets[d] = null;
                    else if ("pickup" == this.fleets[d].type) {
                        g = this.list.destination;
                        l = this.fleets[d];
                        for (v = 0; v < resNum; v++)
                            y = Math.min(l.autoRes[0][v], planets[g].resources[v]),
                            l.load(v, y) && planets[g].resourcesAdd(v, -y);
                        e.push({
                            o: this.list.destination,
                            t: "pickup_return",
                            f: this.fleets[d],
                            s: this.list.destination,
                            d: this.list.origin,
                            id: d,
                            hop: 0
                        });
                        this.fleets[d].type = "pickup_return"
                    } else if ("pickup_return" == this.fleets[d].type)
                        this.fleets[d].unload(this.fleets[d].destination),
                        b.push({
                            fleet: this.fleets[d],
                            destination: this.list.destination
                        }),
                        this.fleets[d] = null;
                    else if ("qd" == this.fleets[d].type) {
                        for (g = 0; g < resNum; g++)
                            0 < this.fleets[d].storage[g] && deliveryCount[this.list.origin][this.list.destination][g]--;
                        this.fleets[d].unloadDelivery(this.fleets[d].destination);
                        e.push({
                            o: this.list.destination,
                            t: "qn",
                            f: this.fleets[d],
                            s: this.list.destination,
                            d: this.list.origin,
                            id: d,
                            hop: 0
                        });
                        this.fleets[d].type = "qn"
                    } else
                        "qn" == this.fleets[d].type ? (planets[this.list.destination].fleets.hub.fusion(this.fleets[d]),
                        this.fleets[d] = null) : "enemy_raid" != this.fleets[d].type && (b.push({
                            fleet: this.fleets[d],
                            destination: this.list.destination
                        }),
                        this.fleets[d] = null)
                }
        }
        for (d = 0; d < e.length; d++)
            this.push2(e[d].f, e[d].s, e[d].o, e[d].d, e[d].t, e[d].id);
        0 < e.length && "travelingShipInterface" == currentInterface && mainCycle >= fpsFleet / fps && exportTravelingShipInterface(currentCriteriaAuto);
        return b
    }
    ;
    this.push = function(b, e, d, g, h) {
        if (e != g && planets[e].shortestPath[g]) {
            for (var l = 0; this.fleets[l]; )
                l++;
            this.fleets[l] = b;
            var u = planets[e].shortestPath[g].route
              , v = planets[e].shortestPath[g].distance
              , y = routes[u].distance();
            b = b.speed();
            var A = (new Date).getTime();
            y = A + y / b * 1E3;
            for (var E = A + v / b * 1E3, x = shortestRouteId(d, g), H = 0, F = 1; F < x.length && x[F] != e; )
                H++,
                F++;
            this.fleets[l].route = u;
            this.fleets[l].totalTime = E;
            this.fleets[l].departureTime = A;
            this.fleets[l].arrivalTime = y;
            this.fleets[l].origin = d;
            this.fleets[l].source = e;
            this.fleets[l].destination = g;
            this.fleets[l].lastPlanet = e;
            this.fleets[l].nextPlanet = routes[u].other(e);
            this.fleets[l].type = h;
            this.fleets[l].hop = H;
            return v / b / idleBon
        }
        return -1
    }
    ;
    this.push2 = function(b, e, d, g, h, l) {
        if (e != g && planets[e].shortestPath[g]) {
            var u = planets[e].shortestPath[g].route
              , v = planets[e].shortestPath[g].distance
              , y = routes[u].distance();
            b = b.speed();
            var A = (new Date).getTime();
            y = A + y / b * 1E3;
            for (var E = A + v / b * 1E3, x = shortestRouteId(d, g), H = 0, F = 1; F < x.length && x[F] != e; )
                H++,
                F++;
            this.fleets[l].route = u;
            this.fleets[l].totalTime = E;
            this.fleets[l].departureTime = A;
            this.fleets[l].arrivalTime = y;
            this.fleets[l].origin = d;
            this.fleets[l].source = e;
            this.fleets[l].destination = g;
            this.fleets[l].lastPlanet = e;
            this.fleets[l].nextPlanet = routes[u].other(e);
            this.fleets[l].type = h;
            this.fleets[l].hop = H;
            return v / b + 3 * H
        }
        return -1
    }
    ;
    this.civisFleetold = function(b) {
        for (var e = [], d = this.list, g = 0; g < this.fleets.length; g++)
            ;
        for (; d; )
            this.fleets[d.fleet].civis == b && e.push({
                fleet: d.fleet,
                route: d.route,
                totalTime: d.totalTime,
                departureTime: d.departureTime,
                arrivalTime: d.arrivalTime,
                source: d.source,
                destination: d.destination,
                next: null,
                origin: d.origin,
                lastPlanet: d.lastPlanet,
                nextPlanet: d.nextPlanet,
                type: d.type,
                hop: d.hop,
                fleet_name: this.fleets[d.fleet].name
            }),
            d = d.next;
        e.sort(function(b, d) {
            var e = b.fleet_name.toLowerCase()
              , g = d.fleet_name.toLowerCase();
            return e < g ? -1 : e > g ? 1 : 0
        });
        return e
    }
    ;
    this.civisFleet = function(b) {
        for (var e = [], d = 0; d < this.fleets.length; d++)
            if (this.fleets[d] && (this.fleets[d].civis == b || "attack" == this.fleets[d].type)) {
                var g = this.fleets[d];
                e.push({
                    fleet: d,
                    route: g.route,
                    totalTime: g.totalTime,
                    departureTime: g.departureTime,
                    arrivalTime: g.arrivalTime,
                    source: g.source,
                    destination: g.destination,
                    origin: g.origin,
                    lastPlanet: g.lastPlanet,
                    nextPlanet: g.nextPlanet,
                    type: g.type,
                    hop: g.hop,
                    fleet_name: this.fleets[d].name,
                    fleetObj: this.fleets[d]
                })
            }
        e.sort(function(b, d) {
            var e = b.fleet_name.toLowerCase()
              , g = d.fleet_name.toLowerCase();
            return e < g ? -1 : e > g ? 1 : 0
        });
        return e
    }
    ;
    this.marketFleets = function() {
        for (var b = [], e = 0; e < this.fleets.length; e++)
            if (this.fleets[e] && ("market_delivery" == this.fleets[e].type || "market_sell" == this.fleets[e].type)) {
                var d = this.fleets[e];
                b.push({
                    fleet: e,
                    route: d.route,
                    totalTime: d.totalTime,
                    departureTime: d.departureTime,
                    arrivalTime: d.arrivalTime,
                    source: d.source,
                    destination: d.destination,
                    origin: d.origin,
                    lastPlanet: d.lastPlanet,
                    nextPlanet: d.nextPlanet,
                    type: d.type,
                    hop: d.hop,
                    fleet_name: this.fleets[e].name
                })
            }
        b.sort(function(b, d) {
            var e = b.fleet_name.toLowerCase()
              , g = d.fleet_name.toLowerCase();
            return e < g ? -1 : e > g ? 1 : 0
        });
        return b
    }
    ;
    this.toArray = function() {}
    ;
    this.load = function(b, e, d) {
        this.fleets = [];
        for (var g = b = 0; g < d; g++)
            e[g] && (NEW_AUTOROUTES && "auto" == e[g].type ? planets[e[g].origin].autofleets[planets[e[g].origin].autofleets.length] = $.extend(!0, new Fleet(e[g].civis,e[g].name), e[g]) : (this.fleets[b] = $.extend(!0, new Fleet(e[g].civis,e[g].name), e[g]),
            b++))
    }
}
var fleetSchedule = new FleetSchedule
  , market = new Market
  , tournamentPlanet = planetsName.teleras
  , qurisTournament = {
    fleet: null,
    points: 0,
    lose: 0,
    rank: function() {
        return Math.log(points) / Math.log(10)
    }
}
  , spaceChess = {}
  , baseMatrix = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
function chessPiece(b) {
    this.name = b.name || "Ship";
    this.hp = b.hp || 1;
    this.range = b.range || 1;
    this.power = b.power || 1;
    this.formation = b.formation || 2;
    this.movementMatrix = b.moves || baseMatrix;
    this.attackMatrix = b.atk || baseMatrix;
    this.maxOnBoard = b.max || 1;
    this.isAoe = b.aoe || !1;
    this.speed = b.speed || 1;
    this.turnLeft = 0
}
var fighterMatrix = [[1, 1, 1], [0, 0, 0], [0, 0, 0]]
  , fighterAttack = [[0, 1, 0], [0, 0, 0], [0, 0, 0]]
  , frigateMatrix = [[1, 2, 1], [0, 0, 0], [0, 0, 0]]
  , frigateAttack = [[1, 1, 1], [1, 0, 1], [0, 0, 0]]
  , chessPieces = [];
chessPieces.push(new chessPiece({
    name: "Fighter",
    hp: 1,
    range: 1,
    power: 1,
    formation: 1,
    moves: fighterMatrix,
    atk: fighterAttack,
    max: 5
}));
chessPieces.push(new chessPiece({
    name: "Frigate",
    hp: 2,
    range: 2,
    power: 1,
    formation: 1,
    moves: fighterMatrix,
    atk: fighterAttack,
    max: 5
}));
chessPieces.push(new chessPiece({
    name: "Destroyer",
    hp: 3,
    range: 3,
    power: 2,
    formation: 2,
    moves: fighterMatrix,
    atk: fighterAttack,
    max: 5
}));
chessPieces.push(new chessPiece({
    name: "Battlecruiser",
    hp: 5,
    range: 3,
    power: 3,
    formation: 2,
    moves: fighterMatrix,
    atk: fighterAttack,
    max: 5
}));
chessPieces.push(new chessPiece({
    name: "Fighter",
    hp: 1,
    range: 1,
    power: 1,
    formation: 1,
    moves: fighterMatrix,
    atk: fighterAttack,
    max: 5
}));
chessPieces.push(new chessPiece({
    name: "Fighter",
    hp: 1,
    range: 1,
    power: 1,
    formation: 1,
    moves: fighterMatrix,
    atk: fighterAttack,
    max: 5
}));
function generateQurisTournamentFleet() {
    for (var b = [], e = 1; e < civis.length; e++)
        game.researches[researchesName.astronomy].level >= civis[e].hops && 0 < civis[e].planets.length && b.push(e);
    if (0 == b.length)
        return -333;
    var d = 1E16 * Math.pow(1.5, qurisTournament.points);
    e = b[Math.floor(Math.random() * b.length)];
    var g = generateFleetSub(e, d, civis[e].name + " Tournament Fleet");
    g && (qurisTournament.fleet = g.f);
    var h = 1;
    if (qurisTournament.fleet)
        return 0;
    for (; null == qurisTournament.fleet && 100 > h; ) {
        e = b[Math.floor(Math.random() * b.length)];
        if (g = generateFleetSub(e, d, civis[e].name + " Tournament Fleet"))
            qurisTournament.fleet = g.f;
        h++
    }
    100 <= h && (b = new Fleet(e,civis[e].name + " Tournament Fleet"),
    civis[e].ships[0] && (b.ships[civis[e].ships[0].id] = 1),
    qurisTournament.fleet = b);
    return h
}
function generateFleet(b, e, d) {
    for (var g = null, h = 0; null == g && 100 > h; ) {
        var l = generateFleetSub(b, e, d);
        l && l.f && (g = l.f);
        h++
    }
    return g
}
function generateFleetSub(b, e, d) {
    var g = .98 * e;
    e *= 1.01;
    d = new Fleet(b,d);
    for (var h = 1, l = !1, u = 0; u < civis[b].ships.length; u++) {
        var v = civis[b].ships[u].id
          , y = new Fleet(0,"");
        y.ships[v] = 1;
        if (y.rawValue() < g) {
            l = !0;
            break
        }
    }
    if (!l)
        return null;
    l = [];
    for (u = 0; u < ships.length; u++)
        l[u] = 11;
    for (; d.rawValue() < g && 1E4 >= h; )
        u = civis[b].ships[Math.floor(Math.random() * civis[b].ships.length)].id,
        0 == d.ships[u] ? (d.ships[u] = 1,
        v = d.rawValue(),
        v > e ? d.ships[u] = 0 : v < g && (v = d.ships[u],
        d.ships[u] = Math.floor(d.ships[u] * (l[u] + 1)),
        d.rawValue() > e && (d.ships[u] = v,
        l[u] /= 2))) : (v = d.ships[u],
        d.ships[u] = Math.floor(d.ships[u] * (l[u] + 1)),
        d.rawValue() > e && (d.ships[u] = v,
        l[u] /= 2)),
        h++;
    return {
        f: d,
        iterations: h
    }
}
var syllabus = "ba bu bi ca cae bar bur ban bam bal bas bus bul cal da do de di du dar dur dir das dos dor dam dim din dan dun dum".split(" ")
  , consonants = "bcdfghijklmnpqrstvwxyz"
  , vowels = "aeiouy";
function prng(b) {
    this.val = this.seed = b;
    this.generate = function() {
        return this.val = (8253729 * this.val + 2396403) % 2147483647
    }
    ;
    this.setSeed = function(b) {
        this.val = this.seed = b;
        for (b = 0; 67 > b; b++)
            this.generate()
    }
}
var RAND_GEN = new prng(2324924);
RAND_GEN.setSeed(2324924);
function rand(b) {
    if (0 == b)
        return 0;
    b = b || tri * tri;
    return RAND_GEN.generate() % (b + 1)
}
function randGauss(b, e) {
    var d = 0;
    e = e || 3;
    for (var g = 0; g < e; g++)
        d += rand(b);
    return Math.floor(d / e)
}
function generateSyllabus() {
    for (var b = 0; b < consonants.length; b++)
        for (var e = 0; e < vowels.length; e++)
            syllabus.push(consonants[b] + "" + vowels[e]);
    for (e = 0; e < vowels.length; e++)
        syllabus.push(vowels[e]);
    for (b = 0; 3 > b; b++)
        syllabus.push("s"),
        syllabus.push("r"),
        syllabus.push("n"),
        syllabus.push("l"),
        syllabus.push("p"),
        syllabus.push("k")
}
var greekw = "alpha beta gamma delta eta theta kappa lambda rho tau epsilon zeta sigma omicron omega centauri scorpio antlia apus aquila ara aries auriga caelum canis major minor carina cepheus corvus gemini hydra leo libra lyra pisces virgo".split(" ")
  , genNames = "Promision Vasilis Aequoreas Orpheus Traumland Tataridu IshtarGate Acanthus Antaris YinRaknar Teleras Jabir PlusCaerul Bharash ZhuraNova EpsilonRutheni Posirion Phorun Kitrion Mermorra Ares Kandi ShinSung Tsartasis XoraTauri Zelera Antirion Babilo Kartarid Cerberus Grave Tregemelli Zurkarap GardenFlowers LoneNassaus Solidad Seal Berenil Siris Xilea TwinAsun Dagama Columbus Magellan Gerlache Gagarin Alfari Xenovirgo CaligonFlavus Halea Persephone Hades Demeter Hermr CalipsiTheta Auriga CygnusRufus Forax VolorAshtar Discordia MallusUshtar PoseidonsEye PolluxInfiris Mihandria Mellivor Extremandur Urdum Hordron Viscarius Bolmir Misfir Vehemir Xirandrus Peleuvis Cranium Exabolan Madame Elon Gorasvyosd Yllirium MalusProgen Janus AquariusGamma Japheth PoligonPeta Bolloris Amante Ubin Melovia Tensubu sheller vertad carvius entura minerva calandrus aventadur misellirs bumantis Xanapar Parpeus Vallente valemoris vanubis mantradan Salbaud crastos ameuniga Piteurin Mistifellia rigorventis mechenair malessen fargentum maerima petoana pikorebu pastorius pashmauri Augmeris Mentusa Therementis thalleun Chordari ventresis miceliuri vanadis vasuas himeridi besopantis menneur malantris Lapetus laprantis lamauri lamintauri Shissian Princis Psioran Finni figera isfur".split(" ");
for (i = 0; i < genNames.length; i++)
    genNames[i] = genNames[i].toLowerCase();
function genmodel(b, e) {
    this.prob = {};
    this.starters = [];
    this.order = e || 2;
    this.add = function(b) {
        var d = b.substr(0, b.length - 1);
        b = b[b.length - 1];
        this.prob[d] || (this.prob[d] = []);
        this.prob[d].has(b) || this.prob[d].push(b)
    }
    ;
    for (var d = 0; d < b.length; d++) {
        this.add(b[d].substr(0, this.order));
        this.starters.push(b[d].substr(0, this.order));
        for (var g = 1; g < b[d].length - this.order - 1; g++) {
            var h = b[d].substr(g, this.order + 1);
            this.add(h)
        }
    }
    for (d = 0; d < consonants.length; d++)
        ;
}
function genens(b) {
    this.models = [];
    for (b = 2; 4 > b; b++)
        this.models.push(new genmodel(genNames,2));
    this.tryGenerate = function(b) {
        for (var d = this.models[rand(this.models.length - 1)], e = d.starters[rand(d.starters.length - 1)], h = d.order, l = 0; l < b - h; l++) {
            var u = e.substr(l, d.order);
            u = d.prob[u];
            if (!u)
                break;
            e += u[rand(u.length - 1)];
            proposal = this.models[rand(this.models.length - 1)];
            proposal.order >= e.length && (d = proposal)
        }
        return e
    }
    ;
    this.generate = function(b) {
        for (var d = this.tryGenerate(b), e = 1; 68 > e && 4 >= d.length; )
            d = this.tryGenerate(b),
            e++;
        return d
    }
}
var mkc = new genens;
function generateWord(b) {
    for (var e = "", d = 0; d < b; d++)
        e += syllabus[rand(syllabus.length - 1)];
    return e
}
function generateName() {
    var b = randGauss(100);
    b = 80 > b ? 1 : 2;
    var e = 4 + randGauss(8)
      , d = randGauss(100);
    d = 70 > d ? !0 : !1;
    e = mkc.generate(e);
    1 < b && (d ? b = greekw[rand(greekw.length - 1)] : (b = 4 + randGauss(8),
    b = mkc.generate(b)),
    e = 0 == rand(1) ? b + " " + e : e + " " + b);
    return e
}
function generatePlanet() {}
function generateMap() {}
var dk = 1
  , mk = 6
  , body1 = {
    pos: {
        x: 800,
        y: 100
    },
    v: {
        x: 500.3,
        y: 0
    },
    a: {
        x: 0,
        y: 0
    },
    mass: .001 * mk
}
  , body2 = {
    pos: {
        x: 800,
        y: 320
    },
    v: {
        x: 0,
        y: 0
    },
    a: {
        x: 0,
        y: 0
    },
    mass: 1E5 * mk
}
  , body3 = {
    pos: {
        x: 800,
        y: 105
    },
    v: {
        x: 600.3,
        y: 0
    },
    a: {
        x: 0,
        y: 0
    },
    mass: 1E-4 * mk
}
  , simT = 0
  , step = .01;
function squaredDistanceBody(b, e) {
    var d = b.pos.x - e.pos.x
      , g = b.pos.y - e.pos.y;
    return d * d + g * g
}
function calculateBody(b, e, d) {
    b.a.x = e * Math.sin(d) / b.mass;
    b.a.y = e * Math.cos(d) / b.mass;
    b.v.x += b.a.x * step;
    b.v.y += b.a.y * step;
    b.pos.x += b.v.x * step;
    b.pos.y += b.v.y * step
}
function applyForce(b, e) {
    b.a.x = e.x / b.mass;
    b.a.y = e.y / b.mass;
    b.v.x += b.a.x * step;
    b.v.y += b.a.y * step;
    b.pos.x += b.v.x * step;
    b.pos.y += b.v.y * step
}
function twoBody(b, e) {
    var d = b.pos.x - e.pos.x
      , g = b.pos.y - e.pos.y
      , h = Math.atan2(d, g);
    d = b.mass * e.mass / (dk * Math.sqrt(d * d + g * g) + 1E-7);
    calculateBody(b, -d, h);
    calculateBody(e, d, h);
    simT++
}
a = Audio;
Audio.prototype.b = Audio.play;
function nBody(b) {
    for (var e = 0; e < b.length; e++) {
        for (var d = {
            x: 0,
            y: 0
        }, g = 0; g < b.length; g++)
            if (g != e) {
                var h = b[e]
                  , l = b[g]
                  , u = h.pos.x - l.pos.x
                  , v = h.pos.y - l.pos.y
                  , y = Math.atan2(u, v);
                h = -h.mass * l.mass / (dk * Math.sqrt(u * u + v * v) + 1E-7);
                d.x += h * Math.sin(y);
                d.y += h * Math.cos(y)
            }
        applyForce(b[e], d)
    }
    simT++
}
for (var ranks = [], hkj = 0; hkj < civis.length; hkj++) {
    var researches = [];
    for (k = 0; k < researchesDefinition.length; k++)
        researches.push(new Research(researchesDefinition[k]));
    var researchesNum = researches.length;
    for (i = 0; i < 100 - researches.length; i++)
        r = new Research({
            id: "placeholder",
            name: "Placeholder",
            desc: 'return "Allow methane production ";',
            researchPoint: 2E4
        }),
        r.extraBonus = function() {}
        ,
        r.extraUnbonus = function() {}
        ,
        r.requirement = function() {
            return !1
        }
        ,
        researches.push(r);
    civis[hkj].researches = researches;
    for (r = 0; r < civis[hkj].researches.length; r++)
        civis[hkj].researches[r].civis = hkj
}
researches = civis[0].researches;
var researchesName = [];
for (i = 0; i < researches.length; i++)
    researchesName[researches[i].id] = i;
var allCivis = [];
for (i = 0; i < civis.length; i++)
    allCivis[i] = civis[i].id;
function transferPlanet(b, e, d) {
    0 <= e && civis[e].removePlanet(b);
    planets[b].civis = d;
    civis[d].pushPlanet(b);
    planets[b].fleets[0].civis = d;
    planets[b].fleets.hub.civis = d
}
function transferPlanet2(b, e) {
    var d = planets[b].civis;
    null == d && (d = -1);
    transferPlanet(b, d, e)
}
for (q = 0; q < questsDefinition.length; q++)
    quests.push(new Quest(questsDefinition[q]));
var civisQuest = [];
for (c = 0; c < civis.length; c++)
    civisQuest[c] = {};
var unalignedQuests = {};
for (q = 0; q < quests.length; q++)
    questNames[quests[q].id] = q,
    0 <= quests[q].provider ? civisQuest[quests[q].provider][q] = 1 : unalignedQuests[q] = 1;
var saveslot = "sRYGT89ng7m2IzvTTSwagwyh"
  , recuvslot = "nxpZ0bQmbK6307XEkzzaYylJ"
  , autosave = !0
  , autosaveTime = 7E4;
MOBILE_LANDSCAPE && (autosaveTime = 3E4);
var autosaveTimer, mainTimer, firstTime = !0, mouseX = 0, mouseY = 0;
function captur(b) {
    return .8 * (1 - (b - .75) / .25 * (b - .75) / .25)
}
var soundSetting = !0, musicSetting = !0, currentPlanet = planets[game.planets[0]], currentNebula = nebulas[0], currentUpdater = function() {}, capital = planetsName.promision, currentPlanetClicker = function() {}, currentInterface = "", currentPopup, currentToast, currentDisplay, currentBuildingId, currentShipId, exportLoadResetInternal, exportLoadResetInternal2, exportPlanetInterface, exportPlanetBuildingInterface, exportResearchInterface, exportTechInterface, exportMapInterface, exportMarketInterface, exportTournamentInterface, exportTravelingShipInterface, exportResourcesOverview, exportPopup, exportButton, exportAddHoverPopup, avBuilding = [];
for (i = 0; i < buildings.length; i++)
    avBuilding[i] = !1;
var avRes = [];
for (i = 0; i < researches.length; i++)
    avRes[i] = !1;
var avShip = [];
for (i = 0; i < ships.length; i++)
    avShip[i] = !1;
var avQuest = []
  , elapsed = 0;
function updateResource(b) {
    for (var e = game.id, d = 0; d < civis[e].planets.length; d++)
        planets[civis[e].planets[d]].produce(b),
        planets[civis[e].planets[d]].growPopulation(b)
}
function buildQueue() {
    for (var b = 0; b < game.planets.length; b++) {
        var e = planets[game.planets[b]], d = !1, g = 0, h;
        for (h in e.queue) {
            for (; e.queue[h] && e.buyMultipleStructure(e.queue[h].b, 1, !0); )
                e.queue[h].n--,
                d = !0,
                0 >= e.queue[h].n && delete e.queue[h];
            g++
        }
        if (0 == g)
            for (g = 0; g < resNum; g++)
                e.resourcesRequest[g] = 0;
        d && currentPlanet.id == e.id && exportUpdateBuildingList()
    }
}
function transportResources() {
    if (1 < game.planets.length) {
        var b = planets[game.planetsTransport[0]]
          , e = 0;
        for (d in b.queue)
            e++;
        b.compactQueue();
        var d = !0;
        0 < e ? resourceRequest(b) : d = !1;
        b = game.planetsTransport.length;
        e = game.planetsTransport[0];
        for (var g = 0; g < b - 1; g++)
            game.planetsTransport[g] = game.planetsTransport[g + 1];
        game.planetsTransport[b - 1] = e;
        return d
    }
    return !0
}
function merge(b, e, d, g) {
    var h = d - e + 1, l = g - d, u = Array(h + 1), v = Array(l + 1), y, A;
    for (y = 0; y < h; y++)
        u[y] = b[e + y - 1];
    for (A = 0; A < l; A++)
        v[A] = b[d + A];
    u[h] = "l";
    v[l] = "r";
    planets.l = {
        cpd: -1
    };
    planets.r = {
        cpd: -1
    };
    A = y = 0;
    for (--e; e < g; e++)
        planets[u[y]].cpd >= planets[v[A]].cpd ? (b[e] = u[y],
        y++) : (b[e] = v[A],
        A++)
}
function mergeSort(b, e, d) {
    if (e < d) {
        var g = Math.floor((e + d) / 2);
        mergeSort(b, e, g);
        mergeSort(b, g + 1, d);
        merge(b, e, g, d)
    }
}
function mergeIndex(b, e, d, g, h, l) {
    var u = h - g + 1, v = l - h, y = Array(u + 1), A = Array(v + 1), E, x;
    for (E = 0; E < u; E++)
        y[E] = d[g + E - 1];
    for (x = 0; x < v; x++)
        A[x] = d[h + x];
    y[u] = "l";
    A[v] = "r";
    E = b[g - 1][e];
    for (h = g; h < l; h++)
        b[h][e] > E && (E = b[h][e]);
    b.l = {};
    b.l[e] = E + 1;
    b.r = {};
    b.r[e] = E + 1;
    x = E = 0;
    for (h = g - 1; h < l; h++)
        b[y[E]][e] <= b[A[x]][e] ? (d[h] = y[E],
        E++) : (d[h] = A[x],
        x++)
}
function mergeObjIndex(b, e, d, g, h) {
    if (g < h) {
        var l = Math.floor((g + h) / 2);
        mergeObjIndex(b, e, d, g, l);
        mergeObjIndex(b, e, d, l + 1, h);
        mergeIndex(b, e, d, g, l, h)
    }
}
function sortObjIndex(b, e) {
    for (var d = Array(b.length), g = 0; g < d.length; g++)
        d[g] = g;
    mergeObjIndex(b, e, d, 1, d.length);
    return d
}
var sortedResources = sortObjIndex(resources, "name")
  , sortedPlanets = sortObjIndex(planets, "name");
function sortGenerators(b, e) {
    for (var d = 0; d < b.length; d++) {
        for (var g = planets[b[d]].cpd = 0; g < ships.length; g++)
            planets[b[d]].cpd += planets[b[d]].fleets.hub.ships[g] * ships[g].maxStorage * ships[g].speed;
        planets[b[d]].cpd /= e.shortestPath[b[d]].distance
    }
    mergeSort(b, 1, b.length)
}
var deliveryCount = [];
for (p = 0; p < planets.length; p++)
    for (deliveryCount[p] = [],
    q = 0; q < planets.length; q++)
        for (deliveryCount[p][q] = [],
        r = 0; r < resNum; r++)
            deliveryCount[p][q][r] = 0;
function resourceRequest(b) {
    if (!(1 > b.queue[0].n)) {
        for (var e = [], d = 0, g = 0; g < resNum; g++)
            e[g] = Math.max(b.resourcesRequest[g], 0),
            d += e[g];
        for (var h = [], l = 0, u = 0; u < game.planets.length; u++) {
            var v = planets[game.planets[u]];
            v.id != b.id && v.map == b.map && 0 < v.fleets.hub.shipNum() && (h[l] = v.id,
            l++)
        }
        sortGenerators(h, b);
        for (u = 0; u < h.length; u++) {
            l = planets[h[u]];
            var y = !1;
            v = [];
            var A = 0
              , E = []
              , x = 1;
            gameSettings.overchargeShipping && (x = 1.05);
            for (g = 0; g < resNum; g++)
                E[g] = 0;
            for (var H in l.queue)
                if (l.queue[H]) {
                    var F = l.structure[l.queue[H].b].totalCost(l.queue[H].n);
                    for (g = 0; g < resNum; g++)
                        E[g] += F[g] * x,
                        1 <= F[g] && (E[g] += 1)
                }
            for (g = 0; g < resNum; g++) {
                x = l.globalProd[g] + l.globalImport[g] - l.globalExport[g];
                F = l.shortestPath[b.id].distance / l.fleets.hub.speed();
                0 > x && (x = -x * F / 5);
                F = (b.globalProd[g] + b.globalImport[g] - b.globalExport[g]) * F * idleBon;
                var m = 0;
                0 > F && 0 < e[g] && (m = -F);
                v[g] = Math.ceil(Math.min(e[g] + m, Math.max(l.resources[g] - E[g] - 10 * x, 0)));
                deliveryCount[l.id][b.id][g] >= MAX_AUTO_DELIVERY_PER_PLANET && (v[g] = 0);
                A += v[g]
            }
            for (E = l.fleets.hub; 0 < E.maxStorage() && 0 < d && 0 < A && 0 < b.queue[0].q && !y; ) {
                if (y = E.bestCluster()) {
                    x = y.maxStorage() / Math.min(d, A);
                    1 < x && (g = Math.ceil(y.ships[y.onlyS] / x),
                    x = y.ships[y.onlyS] - g,
                    y.ships[y.onlyS] = g,
                    E.ships[y.onlyS] = x,
                    x = 1);
                    for (g = 0; g < resNum; g++)
                        if (F = Math.ceil(v[g] * x),
                        0 < F) {
                            for (m = 1; 0 < F && !y.load(g, F); )
                                F -= m,
                                m *= 2;
                            l.resourcesAdd(g, -F);
                            d -= F;
                            A -= F;
                            v[g] -= F;
                            e[g] -= F;
                            b.resourcesRequest[g] -= F;
                            0 > b.resourcesRequest[g] && (b.resourcesRequest[g] = 0);
                            deliveryCount[l.id][b.id][g]++
                        }
                    y.name = "[Automatic Delivery]";
                    y.type = "qd";
                    y.move(l.id, b.id)
                }
                y = !0
            }
        }
        e = 0;
        for (H in b.queue)
            e++;
        1 < e && (H = b.queue[0],
        delete b.queue[0],
        b.queue[e] = H,
        b.compactQueue())
    }
}
function enableResearch() {}
game.routes = routes;
function save26m() {
    try {
        for (var b = 0; b < civis.length; b++)
            civis[b].lastSaved = (new Date).getTime();
        localStorage.setItem(SAVESTR_HEAD + "sv0cpt", btoa(capital));
        localStorage.setItem(SAVESTR_HEAD + "sv0first", firstTime);
        localStorage.setItem(SAVESTR_HEAD + "sv0plt", btoa(JSON.stringify(planetArraySaver(planets))));
        localStorage.setItem(SAVESTR_HEAD + "sv0civ", btoa(JSON.stringify(civisArraySaver(civis))));
        var e = {
            schedule: fleetSchedule.toArray(),
            fleets: fleetSchedule.fleets,
            count: fleetSchedule.count
        };
        localStorage.setItem(SAVESTR_HEAD + "sv0sch", btoa(JSON.stringify(e)));
        if ("info" == currentPopup.type) {
            var d = new exportPopup(210,0,"<span class='blue_text text_shadow'>Game Saved in local!<br>If it doesn't work, try exporting the save.</span>","info");
            d.drawToast()
        }
    } catch (g) {
        console.log(g),
        "info" == currentPopup.type && (d = new exportPopup(210,0,"<span class='red_text'>Error during autosave! Check your localStorage settings/quota, or try exporting the game</span>","info"),
        d.drawToast())
    }
}
function save() {
    if (MOBILE_LANDSCAPE && window.JsJavaInterface) {
        var b = exportExportString().str;
        window.JsJavaInterface.saveGame(b);
        b = new exportPopup(210,0,"<span class='blue_text text_shadow'>Game Saved!<br>If it doesn't work, try exporting the save.</span>","info");
        b.drawToast()
    } else if (!cloudLoadingGoingOn)
        try {
            for (var e = 0; e < civis.length; e++)
                civis[e].lastSaved = (new Date).getTime();
            localStorage.setItem(SAVESTR_HEAD + "sv0cpt", btoa(capital));
            localStorage.setItem(SAVESTR_HEAD + "sv0vers", btoa(GAME_VERSION));
            localStorage.setItem(SAVESTR_HEAD + "sv0first", firstTime);
            localStorage.setItem(SAVESTR_HEAD + "sv0plt", btoa(encodeURIComponent(JSON.stringify(planetArraySaver(planets)))));
            localStorage.setItem(SAVESTR_HEAD + "sv0civ", btoa(encodeURIComponent(JSON.stringify(civisArraySaver(civis)))));
            var d = {};
            for (e = 0; e < fleetSchedule.fleets.length; e++)
                d[e] = fleetSchedule.fleets[e];
            e = {};
            for (var g = 0; g < artifacts.length; g++)
                artifacts[g].possessed && (e[artifacts[g].id] = !0);
            var h = {};
            for (g = 0; g < characters.length; g++)
                characters[g].unlocked && (h[characters[g].id] = !0);
            var l = {};
            for (g = 0; g < quests.length; g++)
                quests[g].done && (l[quests[g].id] = !0);
            var u = {};
            for (g = 0; g < places.length; g++)
                places[g].done && (u[places[g].id] = !0);
            var v = {};
            for (g = 0; g < tutorials.length; g++)
                tutorials[g].done && (v[tutorials[g].id] = !0);
            var y = {
                schedule: fleetSchedule.toArray(),
                fleets: d,
                count: fleetSchedule.count,
                m: market.toobj(),
                st: gameSettings,
                qur: {
                    points: qurisTournament.points,
                    lose: qurisTournament.lose
                },
                art: e,
                chr: h,
                qst: l,
                plc: u,
                tuts: v
            };
            localStorage.setItem(SAVESTR_HEAD + "sv0sch", btoa(encodeURIComponent(JSON.stringify(y))));
            b = new exportPopup(210,0,"<span class='blue_text text_shadow'>Game Saved in local!<br>If it doesn't work, try exporting the save.</span>","info");
            b.drawToast()
        } catch (A) {
            console.log(A),
            b = new exportPopup(210,0,"<span class='red_text'>Error during save! Check your localStorage settings/quota, or try exporting the game</span>","info"),
            b.drawToast()
        }
}
function saveBase() {
    try {
        for (var b = 0; b < civis.length; b++)
            civis[b].lastSaved = (new Date).getTime();
        var e = btoa(JSON.stringify(civisArraySaver(civis)));
        b = {
            schedule: [],
            fleets: {},
            count: 0
        };
        MOBILE_LANDSCAPE || (localStorage.setItem("R" + SAVESTR_HEAD + "sv0cpt", btoa(capital)),
        localStorage.setItem("R" + SAVESTR_HEAD + "sv0plt", btoa(JSON.stringify(planetArraySaver(planets)))),
        localStorage.setItem("R" + SAVESTR_HEAD + "sv0civ", e),
        localStorage.setItem("R" + SAVESTR_HEAD + "sv0sch", btoa(JSON.stringify(b))));
        internalSave = {
            s: btoa(JSON.stringify(b)),
            p: btoa(JSON.stringify(planetArraySaver30(planets))),
            c: btoa(JSON.stringify(civisArraySaver(civis)))
        }
    } catch (d) {
        console.log(d),
        document.getElementById("l_info") && (document.getElementById("l_info").innerHTML = "Cookies disabled! Please enable them or you won't be able to save the game")
    }
}
function wipeData() {
    for (var b = 0; b < civis.length; b++)
        for (var e = 0; e < civis[b].researches.length; e++) {
            for (var d = civis[b].researches[e].level; 0 < d; d--)
                civis[b].researches[e].unbonus(),
                civis[b].researches[e].level--;
            civis[b].researches[e].bonusLevel = 0
        }
    governmentList[game.chosenGovern].unbonus();
    for (b = 0; b < artifacts.length; b++)
        artifacts[b].uncollect();
    for (b = 0; b < quests.length; b++)
        quests[b].done = !1;
    for (b = 0; b < places.length; b++)
        places[b].done = !1;
    for (b = 0; b < tutorials.length; b++)
        tutorials[b].done = !1;
    exportLoadResetInternal2();
    market = new Market;
    qurisTournament.points = 0;
    game.techPoints = 0;
    game.researchPoint = 0;
    currentNebula = nebulas[0];
    localStorage && (localStorage.removeItem(SAVESTR_HEAD + "sv0cpt"),
    localStorage.removeItem(SAVESTR_HEAD + "sv0plt"),
    localStorage.removeItem(SAVESTR_HEAD + "sv0civ"),
    localStorage.removeItem(SAVESTR_HEAD + "sv0sch"));
    wiped = !0
}
function prestige() {
    for (var b = game.totalTPspent() + 2 * game.influence() * Math.log(1 + game.totalRPspent() / (200 * bi)) / Math.log(5), e = game.timeTravelNum, d = game.years, g = 0, h = 0; h < game.planets.length; h++)
        g += planets[game.planets[h]].structure[buildingsName.time_machine].number;
    g = game.planets.length * Math.sqrt(g);
    h = {};
    for (var l = 0; l < artifacts.length; l++)
        artifacts[l].possessed && artifacts[l].sticky && (h[l] = !0);
    wipeData();
    qurisTournament.points = 0;
    for (l in h)
        h[l] && artifacts[l].collect();
    game.techPoints = b;
    game.timeTravelNum = e + 1;
    planets[game.planets[0]] && exportPlanetInterface(planets[game.planets[0]]);
    (new exportPopup(210,0,"<span class='blue_text'>You traveled in time! You have been awarded with <span class='white_text'>" + beauty(b) + "</span> Technology Points to spend on researches</span>","info")).drawToast();
    setTimeout(function() {
        game.researchPoint = 0
    }, 150);
    game.years = d;
    b = new Fleet(0,"Time Travel fleet");
    b.ships[70] = Math.floor(g / 10);
    planets[0].fleetPush(b);
    save();
    0 < userID && exportSaveCloud();
    document.getElementById("building_info_list") && (document.getElementById("building_info_list").innerHTML = "");
    currentBuildingId = 0;
    document.getElementById("ship_info_name") && (document.getElementById("ship_info_name").innerHTML = "");
    document.getElementById("ship_info_list") && (document.getElementById("ship_info_list").innerHTML = "")
}
function checkRoutes(b, e, d, g) {
    for (var h = [], l = [], u = 0; u < routes.length; u++)
        routes[u].isPresent(e) && l.push(routes[u]);
    for (u = 0; u < l.length; u++) {
        var v = l[u].other(e);
        b[v] ? b[v].distance > d + l[u].distance() && (b[v].distance = d + l[u].distance(),
        b[v].route = g,
        h.push({
            planet: v,
            route: u
        })) : (b[v] = {
            distance: d + l[u].distance(),
            route: g
        },
        h.push({
            planet: v,
            route: u
        }))
    }
    for (e = 0; e < h.length; e++)
        checkRoutes(b, h[e].planet, d + l[h[e].route].distance(), g)
}
function findRoutes() {
    for (var b = 0; b < planets.length; b++) {
        planets[b].shortestPath[b] = {
            distance: 0,
            route: null,
            hops: 0
        };
        for (var e = [], d = 0; d < routes.length; d++)
            routes[d].isPresent(b) && e.push(routes[d]);
        for (d = 0; d < e.length; d++)
            planets[b].shortestPath[e[d].other(b)] = {
                distance: e[d].distance(),
                route: e[d].id
            };
        for (d = 0; d < e.length; d++) {
            var g = e[d].other(b);
            checkRoutes(planets[b].shortestPath, g, e[d].distance(), e[d].id)
        }
    }
}
function updateHops() {
    for (var b = 0; b < planets.length; b++)
        for (var e = 0; e < planets.length; e++)
            if (planets[b].shortestPath[e]) {
                var d = shortestRouteId(b, e).length - 2;
                planets[b].shortestPath[e].hops = d
            }
}
findRoutes();
updateHops();
function shortestRoute(b, e) {
    if (b != e) {
        var d = !1
          , g = []
          , h = planets[planetsName[b]];
        if (h.shortestPath[planetsName[e]]) {
            g.push(h.shortestPath[planetsName[e]].distance);
            for (g.push(b); !d; )
                h = planets[routes[h.shortestPath[planetsName[e]].route].other(h.id)],
                g.push(h.icon),
                h.id == planetsName[e] && (d = !0);
            return g
        }
    }
    return [0, b]
}
function shortestRouteId(b, e) {
    if (b != e) {
        var d = !1
          , g = []
          , h = planets[b];
        if (h.shortestPath[e]) {
            g.push(h.shortestPath[e].distance);
            for (g.push(b); !d; )
                h = planets[routes[h.shortestPath[e].route].other(h.id)],
                g.push(h.id),
                h.id == e && (d = !0);
            return g
        }
    }
    return [0, b]
}
function hopNum(b, e, d) {
    b = shortestRouteId(b, e);
    e = 0;
    for (var g = 1; g < b.length && b[g] != d; )
        e++,
        g++;
    g >= b.length && (e = -1);
    return e
}
function pathMax() {
    var b = [];
    b.push(0);
    for (var e = 0; e < planets.length; e++)
        for (var d = 0; d < planets.length; d++)
            if (e != d) {
                var g = shortestRoute(planets[e].icon, planets[d].icon);
                g[0] > b[0] && (b = g)
            }
    return b
}
function fakeShips(b) {
    for (var e = 0; e < b; e++) {
        var d = new Fleet;
        d.ships[Math.floor(23 * Math.random())] = 1;
        var g = Math.floor(27 * Math.random());
        fleetSchedule.push(d, g, g, Math.floor(27 * Math.random()), "normal")
    }
}
var mainCycle = 0, transportCycle = 0, loadReset;
function Maze(b) {
    this.size = b.size;
    this.rooms = b.rooms;
    this.edges = b.edges;
    this.index = b.index
}
var currentMaze = null
  , mazeLevel = 1;
function isConnected(b) {
    var e = [0]
      , d = Array(b.size * b.size);
    d[0] = !0;
    for (var g = 1; g < d.length; g++)
        d[g] = !1;
    for (g = 0; 0 < e.length; ) {
        var h = e[0];
        --e.length;
        for (var l = 0; l < b.edges.length; l++)
            b.edges[l] && (b.edges[l].x != h || d[b.edges[l].y] ? b.edges[l].y != h || d[b.edges[l].x] || (e.unshift(b.edges[l].x),
            d[b.edges[l].x] = !0) : (e.unshift(b.edges[l].y),
            d[b.edges[l].y] = !0));
        g++
    }
    return g == b.size * b.size ? !0 : !1
}
function isConnected2(b) {
    var e = [0]
      , d = Array(b.size * b.size);
    d[0] = !0;
    for (var g = 1; g < d.length; g++)
        d[g] = !1;
    for (g = 0; 0 < e.length; ) {
        var h = e[e.length - 1];
        --e.length;
        for (var l in b.index[h])
            d[l] || (e[e.length] = l,
            d[l] = !0);
        g++
    }
    return g == b.size * b.size ? !0 : !1
}
function isConnected3(b, e) {}
function generateMaze(b) {
    var e = b + 1;
    b = [];
    for (var d = [], g = 0; g < e; g++)
        for (var h = 0; h < e; h++)
            d.push({
                x: h,
                y: g
            });
    for (g = 0; g < e; g++)
        for (h = 0; h < e; h++)
            h < e - 1 && b.push({
                x: g * e + h,
                y: g * e + h + 1
            }),
            g < e - 1 && b.push({
                x: g * e + h,
                y: (g + 1) * e + h
            });
    var l = Array(e * e);
    for (g = 0; g < l.length; g++)
        l[g] = {};
    for (var u = 0; u < b.length; u++)
        l[b[u].x][b[u].y] = b[u].y,
        l[b[u].y][b[u].x] = b[u].x;
    d = new Maze({
        size: e,
        rooms: d,
        edges: b,
        index: l
    });
    var v = 1 + Math.floor(Math.sqrt(Math.sqrt(Math.random())) * (b.length - e * e))
      , y = g = 0;
    h = Array(b.length);
    for (u = 0; u < b.length; u++)
        h[u] = !1;
    for (e = 1 + Math.floor(e / 10); g < v && y < 5 * v; ) {
        for (var A = [], E = 0; E < e; E++)
            if (h = Math.floor(Math.random() * b.length),
            u = b[h])
                delete b[h],
                delete l[u.x][u.y],
                delete l[u.y][u.x],
                A.push({
                    edge: u,
                    k: h
                });
        if (isConnected2(d))
            g += e;
        else
            for (E = 0; E < A.length; E++)
                u = A[E].edge,
                b[A[E].k] = u,
                l[u.y][u.x] = u.x,
                l[u.x][u.y] = u.y;
        y++
    }
    console.log(v + " " + y);
    console.log("isConnected time: 0");
    g = [];
    for (u = 0; u < b.length; u++)
        b[u] && g.push(b[u]);
    d.edges = g;
    return d
}
function edgeExists(b, e, d) {
    for (var g = 0; g < d.length; g++)
        if (d[g] && (d[g].x == b && d[g].y == e || d[g].x == e && d[g].y == b))
            return !0;
    return !1
}
function visualizeMaze(b) {
    var e = generateMaze(b);
    b = Array(2 * e.size - 1);
    for (var d = 0; d < b.length; d++) {
        b[d] = Array(2 * e.size - 1);
        for (var g = 0; g < b[d].length; g++)
            b[d][g] = " "
    }
    for (d = 0; d < e.size; d++)
        for (g = 0; g < e.size; g++)
            b[2 * d][2 * g] = "O",
            g < e.size - 1 && edgeExists(d * e.size + g, d * e.size + g + 1, e.edges) && (b[2 * d][2 * g + 1] = "-"),
            d < e.size - 1 && edgeExists(d * e.size + g, (d + 1) * e.size + g, e.edges) && (b[2 * d + 1][2 * g] = "|");
    console.log(e);
    console.log(b);
    for (d = 0; d < b.length; d++) {
        e = "";
        for (g = 0; g < b[d].length; g++)
            e += b[d][g];
        console.log(e)
    }
}
$(document).ready(function() {
    function b() {
        for (var b = 0, d = 0; d < planets.length; d++)
            for (var e in planets[d].fleets)
                planets[d].fleets[e] && planets[d].fleets[e] == game.id && (b += planets[d].fleets[e].value());
        return parseInt(Math.floor(b))
    }
    function e(b, d, e, g) {
        firstTime = !0;
        for (var h = 0; h < b.length; h++)
            civisLoader(civis[h], b[h]);
        fleetSchedule.count = e.count;
        b = 0;
        for (var n in e.fleets)
            b++;
        fleetSchedule.load(e.schedule, e.fleets, b);
        for (n = 0; n < quests.length; n++)
            quests[n].done = !1;
        for (h = 0; h < places.length; h++)
            places[h].done = !1;
        for (n = 0; n < artifacts.length; n++)
            artifacts[n].uncollect();
        e.st && settingsLoader(e.st);
        game = civis[gameSettings.civis];
        for (h = 0; h < d.length; h++)
            d[h] && g(planets[h], d[h]);
        game.researchPoint = 0;
        console.log("reset")
    }
    function d() {
        var b = JSON.parse(atob(internalSave.c))
          , d = JSON.parse(atob(internalSave.p))
          , h = JSON.parse(atob(internalSave.s));
        e(b, d, h, planetLoader30)
    }
    function g() {
        var b = JSON.parse(atob(localStorage.getItem("R" + SAVESTR_HEAD + "sv0civ")));
        capital = parseInt(atob(localStorage.getItem("R" + SAVESTR_HEAD + "sv0cpt")));
        var d = JSON.parse(atob(localStorage.getItem("R" + SAVESTR_HEAD + "sv0plt")))
          , h = JSON.parse(atob(localStorage.getItem("R" + SAVESTR_HEAD + "sv0sch")));
        e(b, d, h, planetLoader)
    }
    function h(b, d, e) {
        var h = e || 200;
        $("#" + b).hover(function() {
            (new w(h,10,d,"info")).drawInfo();
            $(document).on("mousemove", function(b) {
                mouseX = b.pageX + 10;
                b.pageX > GAME_DIMX - h && (mouseX -= h);
                mouseY = b.pageY + 10;
                $("#popup_info").css({
                    left: mouseX,
                    top: mouseY
                })
            });
            $("#popup_info").css({
                left: mouseX,
                top: mouseY
            })
        }, function() {
            currentPopup.drop()
        });
        $("#" + b).mouseout(function() {
            $(document).on("mousemove", function() {})
        })
    }
    function l(b) {
        for (var d = "<span class='blue_text'> Research Points: </span>", e = 0, h = 0; h < game.planets.length; h++)
            planets[game.planets[h]].globalProd.researchPoint && (e += planets[game.planets[h]].globalProd.researchPoint);
        wiped || (game.researchPoint += b * e);
        isNaN(game.researchPoint) && (game.researchPoint = 0);
        wiped && (wiped = !1);
        d += "<span class='white_text'>" + beauty(game.researchPoint) + " (" + (0 < e ? "+" : "") + beauty(e) + "/s)</span>";
        gameSettings.showRPSpent && (d += "<span class='blue_text'> - Total RP earned: </span><span class='white_text'>" + beauty(game.totalRPspent()) + "</span>");
        0 < game.timeTravelNum && (d = d + "<br><span class='green_text'> Technology Points: </span>" + ("<span class='green_text'>" + beauty(Math.floor(game.techPoints)) + "</span>"),
        gameSettings.showRPSpent && (d += "<span class='green_text'> - Total TP earned: </span><span class='green_text'>" + beauty(game.totalTPspent()) + "</span>"));
        document.getElementById("downbar_content") && (document.getElementById("downbar_content").innerHTML = d);
        return d
    }
    function u() {
        var b = parseInt(game.days / 365)
          , d = parseInt(game.days) - 365 * b
          , e = "<span class='blue_text' >Influence: </span><span class='white_text'>" + game.influence() + "</span><br>";
        5 <= game.researches[3].level && (e += " <span class='blue_text'>Market Coins: </span><span class='white_text'>" + beauty(Math.floor(game.money)) + "<img src='" + UI_FOLDER + "/coin.png' style='height:16px;width:16px;position:relative;top:4px;'></span>");
        b = "<span class='blue_text' >Year: </span><span class='white_text'>" + b + "</span>" + (" <span class='blue_text'>Day: </span><span class='white_text'>" + d + "</span>");
        document.getElementById("topbar_content") && (document.getElementById("topbar_content").innerHTML = e);
        document.getElementById("topbar_year") && (document.getElementById("topbar_year").innerHTML = b)
    }
    function v() {
        for (var b = 0; b < buildings.length; b++)
            if (buildings[b].show(currentPlanet)) {
                var d = $("#building" + b);
                document.getElementById("building" + b);
                currentPlanet.structureAffordable(b) ? (avBuilding[b] = !0,
                d.removeClass("red_button"),
                d.addClass("button")) : (avBuilding[b] = !1,
                d.removeClass("button"),
                d.addClass("red_button"));
                currentPlanet.structure[b].active ? $("#b_shut_" + b).attr("src", "" + UI_FOLDER + "/act.png") : $("#b_shut_" + b).attr("src", "" + UI_FOLDER + "/shut.png");
                d = !1;
                for (var e = 0, g = ""; !d && e < resNum; )
                    d = currentPlanet.globalNoRes[b][e],
                    g = " (needs " + resources[e].name.capitalize() + ")",
                    e++;
                d ? $("#b_nores_" + b).html(g) : $("#b_nores_" + b).html("");
                d = "" + currentPlanet.structure[b].number;
                for (var l in currentPlanet.queue)
                    if (currentPlanet.queue[l].b == b) {
                        d += " (" + currentPlanet.queue[l].n + " in queue)<img id='b_drop_queue_" + b + "' name='" + b + "' src='" + UI_FOLDER + "/x.png' style='width:24px;height:24px;position:relative;top:8px;left:-2px;' style='cursor:pointer;'/>";
                        break
                    }
                $("#b_queuen_" + b).html(d);
                d = currentPlanet.showBuyCostRaw(b, 1);
                for (e = 0; e < resNum; e++) {
                    g = d[e];
                    var m = "" + beauty(g);
                    gameSettings.showMultipliers && (m += " (x" + buildings[b].resourcesMult[e] + ")");
                    0 < g && $("#b_cost_" + b + "_" + e).html(m);
                    g <= currentPlanet.resources[e] ? ($("#b_cost_" + b + "_" + e).removeClass("red_text"),
                    $("#b_cost_" + b + "_" + e).addClass("white_text"),
                    $("#b_res_" + b + "_" + e).removeClass("red_text"),
                    $("#b_res_" + b + "_" + e).addClass("blue_text")) : ($("#b_cost_" + b + "_" + e).removeClass("white_text"),
                    $("#b_cost_" + b + "_" + e).addClass("red_text"),
                    $("#b_res_" + b + "_" + e).removeClass("blue_text"),
                    $("#b_res_" + b + "_" + e).addClass("red_text"))
                }
                $("#b_drop_queue_" + b).unbind();
                $("#b_drop_queue_" + b).click(function() {
                    currentBuildingId = parseInt($(this).attr("name"));
                    currentPlanet.removeQueue(currentBuildingId);
                    v()
                });
                h("b_drop_queue_" + b, "<span class='blue_text'>Remove from queue</span>", 132)
            }
    }
    function y() {
        for (var b = [], d = 0; d < game.ships.length; d++)
            b[d] = game.ships[d].id;
        for (var e = 0; e < b.length; e++) {
            d = b[e];
            var h = $("#shipyard" + e)
              , g = document.getElementById("shipyard" + e);
            currentPlanet.shipAffordable(d) ? (h.removeClass("red_button"),
            h.addClass("button"),
            avShip[d] || (avShip[d] = !0)) : (h.removeClass("button"),
            h.addClass("red_button"),
            avBuilding[d] && (avShip[d] = !1));
            if (ships[d].show() && game.ships[e].req <= currentPlanet.structure[buildingsName.shipyard].number)
                currentPlanet.shipAffordable(d) ? (avShip[d] = !0,
                h.removeClass("red_button"),
                h.addClass("button")) : (avShip[d] = !1,
                h.removeClass("button"),
                h.addClass("red_button")),
                h = "<div style='width:98%; height:80px;position:relative;'>",
                h += "<div style='position:relative; top:8px; left:8px'>",
                h += "<span class='blue_text' style='font-size: 100%;'>" + ships[d].name + "</span> ",
                h += "<span class='white_text'>" + beautyDot(currentPlanet.shipyardFleet.ships[d]) + "</span></div>",
                h += "<div style='position:relative; top:16px; left:8px'>",
                h += "</div>",
                MOBILE_LANDSCAPE ? (h += "<div style='position:relative; top:0px;width:100%;'>",
                h += "<input style='width:20%;height:20px;font-size:92%;position:relative;top:0px;left:0%;' id='sh_buildt_" + d + "' name='" + d + "' type='text' value='0' /><img id='sh_buildc_" + d + "' name='" + d + "' src='" + UI_FOLDER + "/add2.png' style='width:32px;height:32px;position:relative;top:8px;left:-2px;' style='cursor:pointer;'/><br>",
                h += "<input style='width:20%;height:20px;font-size:92%;position:relative;top:-40px;left:30%;' id='sh_dismantlet_" + d + "' name='" + d + "' type='text' value='0' /><img id='sh_dismantlec_" + d + "' name='" + d + "' src='" + UI_FOLDER + "/x.png' style='width:32px;height:32px;position:relative;top:-32px;left:30%;' style='cursor:pointer;'/>") : (h += "<div style='position:relative; top:16px; left:8px'>",
                h += "<img id='sh_build_" + d + "' name='" + d + "' src='" + UI_FOLDER + "/add2.png' style='width:32px;height:32px;position:relative;top:3px;left:-2px;' style='cursor:pointer;'/>",
                h += "<img id='sh_build10_" + d + "' name='" + d + "' src='" + UI_FOLDER + "/add10.png' style='width:32px;height:32px;position:relative;top:3px;left:-2px;' style='cursor:pointer;'/>",
                h += "<img id='sh_build100_" + d + "' name='" + d + "' src='" + UI_FOLDER + "/add100.png' style='width:32px;height:32px;position:relative;top:3px;left:-2px;' style='cursor:pointer;'/>",
                h += "<img id='sh_build1000_" + d + "' name='" + d + "' src='" + UI_FOLDER + "/add1000.png' style='width:32px;height:32px;position:relative;top:3px;left:-2px;' style='cursor:pointer;'/>",
                h += "<img id='sh_build10000_" + d + "' name='" + d + "' src='" + UI_FOLDER + "/add10000.png' style='width:32px;height:32px;position:relative;top:3px;left:-2px;' style='cursor:pointer;'/>",
                h += "<img id='sh_void' src='" + UI_FOLDER + "/void.png' style='width:32px;height:32px;position:relative;top:3px;left:-2px;'/>",
                h += "<img id='sh_dismantle_" + d + "' name='" + d + "' src='" + UI_FOLDER + "/x.png' style='width:32px;height:32px;position:relative;top:3px;left:-2px;' style='cursor:pointer;'/>",
                h += "<img id='sh_dismantle10_" + d + "' name='" + d + "' src='" + UI_FOLDER + "/x10.png' style='width:32px;height:32px;position:relative;top:3px;left:-2px;' style='cursor:pointer;'/>",
                h += "<img id='sh_dismantle100_" + d + "' name='" + d + "' src='" + UI_FOLDER + "/x100.png' style='width:32px;height:32px;position:relative;top:3px;left:-2px;' style='cursor:pointer;'/>",
                h += "<img id='sh_dismantle1000_" + d + "' name='" + d + "' src='" + UI_FOLDER + "/x1000.png' style='width:32px;height:32px;position:relative;top:3px;left:-2px;' style='cursor:pointer;'/>",
                h += "<img id='sh_dismantle10000_" + d + "' name='" + d + "' src='" + UI_FOLDER + "/x10000.png' style='width:32px;height:32px;position:relative;top:3px;left:-2px;' style='cursor:pointer;'/>",
                h += "<div style='position:relative; top:-68px;left:66%;'>",
                h += "<input style='width:64px;height:16px;font-size:92%;position:relative;top:-6px;' id='sh_buildt_" + d + "' name='" + d + "' type='text' value='0' /><img id='sh_buildc_" + d + "' name='" + d + "' src='" + UI_FOLDER + "/add2.png' style='width:32px;height:32px;position:relative;top:3px;left:-2px;' style='cursor:pointer;'/><br>",
                h += "<input style='width:64px;height:16px;font-size:92%;position:relative;top:-6px;' id='sh_dismantlet_" + d + "' name='" + d + "' type='text' value='0' /><img id='sh_dismantlec_" + d + "' name='" + d + "' src='" + UI_FOLDER + "/x.png' style='width:32px;height:32px;position:relative;top:3px;left:-2px;' style='cursor:pointer;'/>",
                h += "</div>"),
                h += "</div>",
                h += "</div>",
                g && (g.innerHTML = h),
                $("#sh_buildt_" + d).change(function() {
                    var b = parseInt($(this).attr("name"));
                    isFinite(parseInt($(this).val())) ? 0 > parseInt($(this).val()) ? $(this).val(0) : parseInt($(this).val()) >= currentPlanet.maxMultipleShip(b) && $(this).val(currentPlanet.maxMultipleShip(b)) : $(this).val(0);
                    $(this).val(parseInt($(this).val()))
                }),
                $("#sh_dismantlet_" + d).change(function() {
                    var b = parseInt($(this).attr("name"));
                    isFinite(parseInt($(this).val())) ? 0 > parseInt($(this).val()) ? $(this).val(0) : parseInt($(this).val()) >= currentPlanet.shipyardFleet.ships[b] && $(this).val(currentPlanet.shipyardFleet.ships[b]) : $(this).val(0);
                    $(this).val(parseInt($(this).val()))
                }),
                $("#sh_buildc_" + d).unbind(),
                $("#sh_buildc_" + d).click(function() {
                    var b = parseInt($(this).attr("name"));
                    $("#sh_buildt_" + b).change();
                    currentPlanet.buyMultipleShip(b, parseInt($("#sh_buildt_" + b).val())) ? (currentPlanet.shipyardFleet.pushed || (currentPlanet.fleetPush(currentPlanet.shipyardFleet),
                    currentPlanet.shipyardFleet.pushed = !0),
                    y()) : (y(),
                    (new w(210,0,"<span class='red_text text_shadow'>There are not enough resources!</span>","info")).drawToast())
                }),
                $("#sh_dismantlec_" + d).unbind(),
                $("#sh_dismantlec_" + d).click(function() {
                    var b = parseInt($(this).attr("name"));
                    $("#sh_dismantlet_" + b).change();
                    currentPlanet.sellMultipleShip(b, parseInt($("#sh_dismantlet_" + b).val())) ? (y(),
                    b = new w(210,0,"<span class='red_text text_shadow'>Ships dismantled!</span>","info")) : (y(),
                    b = new w(210,0,"<span class='red_text text_shadow'>There are no ships to dismantle!</span>","info"));
                    b.drawToast()
                }),
                $("#sh_dismantlec_" + d).hover(function() {
                    var b = parseInt($(this).attr("name"));
                    $("#sh_dismantlet_" + b).change();
                    (new w(220,10,currentPlanet.showSellShipCost(b, parseInt($("#sh_dismantlet_" + b).val())),"info")).drawInfo();
                    $(document).on("mousemove", function(b) {
                        mouseX = b.pageX + 10;
                        mouseY = b.pageY + 10;
                        $("#popup_info").css({
                            left: mouseX,
                            top: mouseY
                        })
                    });
                    $("#popup_info").css({
                        left: mouseX,
                        top: mouseY
                    })
                }, function() {
                    currentPopup.drop()
                }),
                $("#sh_dismantlec_" + d).mouseout(function() {
                    var b = parseInt($(this).attr("name"));
                    $("#sh_dismantlet_" + b).change();
                    $(document).on("mousemove", function() {})
                }),
                $("#sh_buildc_" + d).hover(function() {
                    var b = parseInt($(this).attr("name"));
                    $("#sh_buildt_" + b).change();
                    (new w(220,10,currentPlanet.showBuyShipCost(b, parseInt($("#sh_buildt_" + b).val())),"info")).drawInfo();
                    $(document).on("mousemove", function(b) {
                        mouseX = b.pageX + 10;
                        mouseY = b.pageY + 10;
                        $("#popup_info").css({
                            left: mouseX,
                            top: mouseY
                        })
                    });
                    $("#popup_info").css({
                        left: mouseX,
                        top: mouseY
                    })
                }, function() {
                    currentPopup.drop()
                }),
                $("#sh_buildc_" + d).mouseout(function() {
                    var b = parseInt($(this).attr("name"));
                    $("#sh_buildt_" + b).change();
                    $(document).on("mousemove", function() {})
                }),
                $("#sh_build_" + d).unbind(),
                $("#sh_build_" + d).click(function() {
                    var b = parseInt($(this).attr("name"));
                    currentPlanet.buyShip(b) ? currentPlanet.shipyardFleet.pushed || (currentPlanet.fleetPush(currentPlanet.shipyardFleet),
                    currentPlanet.shipyardFleet.pushed = !0) : (new w(210,0,"<span class='red_text text_shadow'>There are not enough resources!</span>","info")).drawToast();
                    y()
                }),
                $("#sh_build10_" + d).unbind(),
                $("#sh_build10_" + d).click(function() {
                    var b = parseInt($(this).attr("name"));
                    currentPlanet.buyMultipleShip(b, 10) ? currentPlanet.shipyardFleet.pushed || (currentPlanet.fleetPush(currentPlanet.shipyardFleet),
                    currentPlanet.shipyardFleet.pushed = !0) : (new w(210,0,"<span class='red_text text_shadow'>There are not enough resources!</span>","info")).drawToast();
                    y()
                }),
                $("#sh_build100_" + d).unbind(),
                $("#sh_build100_" + d).click(function() {
                    var b = parseInt($(this).attr("name"));
                    currentPlanet.buyMultipleShip(b, 100) ? currentPlanet.shipyardFleet.pushed || (currentPlanet.fleetPush(currentPlanet.shipyardFleet),
                    currentPlanet.shipyardFleet.pushed = !0) : (new w(210,0,"<span class='red_text text_shadow'>There are not enough resources!</span>","info")).drawToast();
                    y()
                }),
                $("#sh_build1000_" + d).unbind(),
                $("#sh_build1000_" + d).click(function() {
                    var b = parseInt($(this).attr("name"));
                    currentPlanet.buyMultipleShip(b, 1E3) ? currentPlanet.shipyardFleet.pushed || (currentPlanet.fleetPush(currentPlanet.shipyardFleet),
                    currentPlanet.shipyardFleet.pushed = !0) : (new w(210,0,"<span class='red_text text_shadow'>There are not enough resources!</span>","info")).drawToast();
                    y()
                }),
                $("#sh_build10000_" + d).unbind(),
                $("#sh_build10000_" + d).click(function() {
                    var b = parseInt($(this).attr("name"));
                    currentPlanet.buyMultipleShip(b, 1E4) ? currentPlanet.shipyardFleet.pushed || (currentPlanet.fleetPush(currentPlanet.shipyardFleet),
                    currentPlanet.shipyardFleet.pushed = !0) : (new w(210,0,"<span class='red_text text_shadow'>There are not enough resources!</span>","info")).drawToast();
                    y()
                }),
                $("#sh_dismantle_" + d).unbind(),
                $("#sh_dismantle_" + d).click(function() {
                    var b = parseInt($(this).attr("name"));
                    currentPlanet.sellMultipleShip(b, 1) || (new w(210,0,"<span class='red_text text_shadow'>There are no ships to dismantle!</span>","info")).drawToast();
                    y()
                }),
                $("#sh_dismantle10_" + d).unbind(),
                $("#sh_dismantle10_" + d).click(function() {
                    var b = parseInt($(this).attr("name"));
                    currentPlanet.sellMultipleShip(b, 10) || (new w(210,0,"<span class='red_text text_shadow'>There are no ships to dismantle!</span>","info")).drawToast();
                    y()
                }),
                $("#sh_dismantle100_" + d).unbind(),
                $("#sh_dismantle100_" + d).click(function() {
                    var b = parseInt($(this).attr("name"));
                    currentPlanet.sellMultipleShip(b, 100) || (new w(210,0,"<span class='red_text text_shadow'>There are no ships to dismantle!</span>","info")).drawToast();
                    y()
                }),
                $("#sh_dismantle1000_" + d).unbind(),
                $("#sh_dismantle1000_" + d).click(function() {
                    var b = parseInt($(this).attr("name"));
                    currentPlanet.sellMultipleShip(b, 1E3) || (new w(210,0,"<span class='red_text text_shadow'>There are no ships to dismantle!</span>","info")).drawToast();
                    y()
                }),
                $("#sh_dismantle10000_" + d).unbind(),
                $("#sh_dismantle10000_" + d).click(function() {
                    var b = parseInt($(this).attr("name"));
                    currentPlanet.sellMultipleShip(b, 1E4) || (new w(210,0,"<span class='red_text text_shadow'>There are no ships to dismantle!</span>","info")).drawToast();
                    y()
                }),
                $("#sh_dismantle_" + d).hover(function() {
                    (new w(240,10,"<span class='blue_text'>Gives 100% of resources back</span>","info")).drawInfo();
                    $(document).on("mousemove", function(b) {
                        mouseX = b.pageX + 10;
                        mouseY = b.pageY + 10;
                        $("#popup_info").css({
                            left: mouseX,
                            top: mouseY
                        })
                    });
                    $("#popup_info").css({
                        left: mouseX,
                        top: mouseY
                    })
                }, function() {
                    currentPopup.drop()
                }),
                $("#sh_dismantle_" + d).mouseout(function() {
                    $(document).on("mousemove", function() {})
                }),
                $("#sh_dismantle10_" + d).hover(function() {
                    var b = parseInt($(this).attr("name"));
                    (new w(220,10,currentPlanet.showSellShipCost(b, 10),"info")).drawInfo();
                    $(document).on("mousemove", function(b) {
                        mouseX = b.pageX + 10;
                        mouseY = b.pageY + 10;
                        $("#popup_info").css({
                            left: mouseX,
                            top: mouseY
                        })
                    });
                    $("#popup_info").css({
                        left: mouseX,
                        top: mouseY
                    })
                }, function() {
                    currentPopup.drop()
                }),
                $("#sh_dismantle10_" + d).mouseout(function() {
                    $(document).on("mousemove", function() {})
                }),
                $("#sh_dismantle100_" + d).hover(function() {
                    var b = parseInt($(this).attr("name"));
                    (new w(220,10,currentPlanet.showSellShipCost(b, 100),"info")).drawInfo();
                    $(document).on("mousemove", function(b) {
                        mouseX = b.pageX + 10;
                        mouseY = b.pageY + 10;
                        $("#popup_info").css({
                            left: mouseX,
                            top: mouseY
                        })
                    });
                    $("#popup_info").css({
                        left: mouseX,
                        top: mouseY
                    })
                }, function() {
                    currentPopup.drop()
                }),
                $("#sh_dismantle100_" + d).mouseout(function() {
                    $(document).on("mousemove", function() {})
                }),
                $("#sh_dismantle1000_" + d).hover(function() {
                    var b = parseInt($(this).attr("name"));
                    (new w(220,10,currentPlanet.showSellShipCost(b, 1E3),"info")).drawInfo();
                    $(document).on("mousemove", function(b) {
                        mouseX = b.pageX + 10;
                        mouseY = b.pageY + 10;
                        $("#popup_info").css({
                            left: mouseX,
                            top: mouseY
                        })
                    });
                    $("#popup_info").css({
                        left: mouseX,
                        top: mouseY
                    })
                }, function() {
                    currentPopup.drop()
                }),
                $("#sh_dismantle1000_" + d).mouseout(function() {
                    $(document).on("mousemove", function() {})
                }),
                $("#sh_dismantle10000_" + d).hover(function() {
                    var b = parseInt($(this).attr("name"));
                    (new w(220,10,currentPlanet.showSellShipCost(b, 1E4),"info")).drawInfo();
                    $(document).on("mousemove", function(b) {
                        mouseX = b.pageX + 10;
                        mouseY = b.pageY + 10;
                        $("#popup_info").css({
                            left: mouseX,
                            top: mouseY
                        })
                    });
                    $("#popup_info").css({
                        left: mouseX,
                        top: mouseY
                    })
                }, function() {
                    currentPopup.drop()
                }),
                $("#sh_dismantle10000_" + d).mouseout(function() {
                    $(document).on("mousemove", function() {})
                }),
                $("#sh_build_" + d).hover(function() {
                    var b = parseInt($(this).attr("name"));
                    (new w(220,10,currentPlanet.showBuyShipCost(b, 1),"info")).drawInfo();
                    $(document).on("mousemove", function(b) {
                        mouseX = b.pageX + 10;
                        mouseY = b.pageY + 10;
                        $("#popup_info").css({
                            left: mouseX,
                            top: mouseY
                        })
                    });
                    $("#popup_info").css({
                        left: mouseX,
                        top: mouseY
                    })
                }, function() {
                    currentPopup.drop()
                }),
                $("#sh_build_" + d).mouseout(function() {
                    $(document).on("mousemove", function() {})
                }),
                $("#sh_build10_" + d).hover(function() {
                    var b = parseInt($(this).attr("name"));
                    (new w(220,10,currentPlanet.showBuyShipCost(b, 10),"info")).drawInfo();
                    $(document).on("mousemove", function(b) {
                        mouseX = b.pageX + 10;
                        mouseY = b.pageY + 10;
                        $("#popup_info").css({
                            left: mouseX,
                            top: mouseY
                        })
                    });
                    $("#popup_info").css({
                        left: mouseX,
                        top: mouseY
                    })
                }, function() {
                    currentPopup.drop()
                }),
                $("#sh_build10_" + d).mouseout(function() {
                    $(document).on("mousemove", function() {})
                }),
                $("#sh_build100_" + d).hover(function() {
                    var b = parseInt($(this).attr("name"));
                    (new w(220,10,currentPlanet.showBuyShipCost(b, 100),"info")).drawInfo();
                    $(document).on("mousemove", function(b) {
                        mouseX = b.pageX + 10;
                        mouseY = b.pageY + 10;
                        $("#popup_info").css({
                            left: mouseX,
                            top: mouseY
                        })
                    });
                    $("#popup_info").css({
                        left: mouseX,
                        top: mouseY
                    })
                }, function() {
                    currentPopup.drop()
                }),
                $("#sh_build100_" + d).mouseout(function() {
                    $(document).on("mousemove", function() {})
                }),
                $("#sh_build1000_" + d).hover(function() {
                    var b = parseInt($(this).attr("name"));
                    (new w(220,10,currentPlanet.showBuyShipCost(b, 1E3),"info")).drawInfo();
                    $(document).on("mousemove", function(b) {
                        mouseX = b.pageX + 10;
                        mouseY = b.pageY + 10;
                        $("#popup_info").css({
                            left: mouseX,
                            top: mouseY
                        })
                    });
                    $("#popup_info").css({
                        left: mouseX,
                        top: mouseY
                    })
                }, function() {
                    currentPopup.drop()
                }),
                $("#sh_build1000_" + d).mouseout(function() {
                    $(document).on("mousemove", function() {})
                }),
                $("#sh_build10000_" + d).hover(function() {
                    var b = parseInt($(this).attr("name"));
                    (new w(220,10,currentPlanet.showBuyShipCost(b, 1E4),"info")).drawInfo();
                    $(document).on("mousemove", function(b) {
                        mouseX = b.pageX + 10;
                        mouseY = b.pageY + 10;
                        $("#popup_info").css({
                            left: mouseX,
                            top: mouseY
                        })
                    });
                    $("#popup_info").css({
                        left: mouseX,
                        top: mouseY
                    })
                }, function() {
                    currentPopup.drop()
                }),
                $("#sh_build10000_" + d).mouseout(function() {
                    $(document).on("mousemove", function() {})
                });
            else if (game.ships[e].req <= currentPlanet.structure[buildingsName.shipyard].number + 1) {
                h = "<div style='width:98%; height:80px;position:relative;'>";
                h += "<div style='position:relative; top:8px; left:8px'>";
                h += "<span class='red_text' style='font-size: 100%;'>" + ships[d].name + "</span> ";
                h += "<span class='red_text'> - Unlocked by Shipyard " + game.ships[e].req + "</span></div>";
                h += "<div style='position:relative; top:16px; left:8px'>";
                for (var l in game.ships[e].resReq)
                    h += "<span class='red_text'> Needs " + game.researches[researchesName[l]].name + " " + game.ships[e].resReq[l] + "</span>";
                h += "</div>";
                h += "</div>";
                document.getElementById("shipyard_locked" + e) && (document.getElementById("shipyard_locked" + e).innerHTML = h)
            }
        }
    }
    function A() {
        document.getElementById("planet_mini_name") && (document.getElementById("planet_mini_name").innerHTML = currentPlanet.name);
        currentPlanet.id == capital ? $("#planet_mini_name").css("color", "rgb(249,159,36)") : $("#planet_mini_name").css("color", "#80c0ff");
        $("#planet_mini_image").attr("src", "" + IMG_FOLDER + "/" + currentPlanet[PLANET_IMG_FIELD] + (1 == PLANET_FOLDER_DOUBLE ? "/" + currentPlanet[PLANET_IMG_FIELD] : "") + ".png");
        $("#planet_mini_image").unbind();
        $("#planet_mini_image").click(function() {
            C(currentPlanet)
        });
        $("#planet_mini").show()
    }
    function E() {
        document.getElementById("shipyard_mini_name") && (document.getElementById("shipyard_mini_name").innerHTML = currentPlanet.name);
        currentPlanet.id == capital ? $("#shipyard_mini_name").css("color", "rgb(249,159,36)") : $("#shipyard_mini_name").css("color", "#80c0ff");
        $("#shipyard_mini_image").attr("src", "" + IMG_FOLDER + "/" + currentPlanet[PLANET_IMG_FIELD] + (1 == PLANET_FOLDER_DOUBLE ? "/" + currentPlanet[PLANET_IMG_FIELD] : "") + ".png");
        $("#shipyard_mini_image").click(function() {
            C(currentPlanet)
        });
        $("#shipyard_mini").show()
    }
    function x() {
        document.getElementById("market_mini_name") && (document.getElementById("market_mini_name").innerHTML = currentPlanet.name);
        currentPlanet.id == capital ? $("#market_mini_name").css("color", "rgb(249,159,36)") : $("#market_mini_name").css("color", "#80c0ff");
        $("#market_mini_image").attr("src", "" + IMG_FOLDER + "/" + currentPlanet[PLANET_IMG_FIELD] + (1 == PLANET_FOLDER_DOUBLE ? "/" + currentPlanet[PLANET_IMG_FIELD] : "") + ".png");
        $("#market_mini_image").click(function() {
            C(currentPlanet)
        });
        $("#market_mini").show()
    }
    function H(b) {
        var d = [];
        if (civis[b].planets.length) {
            for (var e = [], h = 0; h < civis[b].planets.length; h++)
                planets[civis[b].planets[h]].fleets[1] && planets[civis[b].planets[h]].shortestPath[planetsName.xirandrus].hops + 19 <= game.researches[researchesName.astronomy].level && planets[civis[b].planets[h]].hasPlayerNeighbour() && (d.push(planets[civis[b].planets[h]].fleets[1].rawValue()),
                e.push(civis[b].planets[h]));
            d.sort(function(b, d) {
                return b - d
            });
            if (0 < e.length) {
                b = generateFleet(b, d[Math.floor(d.length / 2)] / 10, civis[b].name + "'s Attack Fleet");
                b.type = "attack";
                d = [];
                for (h = 0; h < game.planets.length; h++)
                    2 == planets[game.planets[h]].map && d.push(game.planets[h]);
                0 < d.length && b.move(e[Math.floor(e.length * Math.random())], d[Math.floor(d.length * Math.random())])
            }
        }
    }
    function F() {
        if (gameSettings.gamePaused)
            ua = (new Date).getTime(),
            Aa = (new Date).getTime();
        else {
            if (1 <= ((new Date).getTime() - sa) / 1E3) {
                if ("Tribal Rule" == game.chosenGovern && Math.random() < TRIBAL_REBEL_CHANCE && 1 < game.planets.length) {
                    var b = game.planets[Math.floor(Math.random() * game.planets.length)];
                    game.removePlanet(b);
                    planets[b].civis = civisName.rebels;
                    var d = 0;
                    for (e in planets[b].fleets)
                        planets[b].fleets[e].civis = civisName.rebels,
                        0 != e && "hub" != e && d++;
                    if (0 == d) {
                        var e = generateFleet(civisName.rebels, Math.max(planets[b].originalStrength, planets[planetsName.uanass].originalStrength), "Rebel Fleet");
                        planets[b].fleetPush(e)
                    }
                    (new w(180,0,"<span class='red_text'>" + planets[b].name + " rebelled!</span>","info")).drawToast()
                }
                sa = (new Date).getTime()
            }
            if (mainCycle >= fpsFleet / fps) {
                gameSettings.showHub = !0;
                b = ((new Date).getTime() - ua) / 1E3;
                ua = (new Date).getTime();
                if (0 > b || isNaN(b))
                    b = .1,
                    console.log(b);
                averageT = (averageT + b) / 2;
                DEBUG_MAIN_TIME && console.log(b + " " + averageT);
                market.esport(b * idleBon);
                game.days += .1 * idleBon * b;
                u();
                MOBILE || l(b);
                currentUpdater();
                for (d = 0; d < resources.length; d++)
                    game.totalProd[d] = 0;
                updateResource(b);
                mainCycle = 1;
                isNaN(game.money) && (game.money = 0);
                if (gameSettings.useQueue)
                    if (gameSettings.autoQueue && buildQueue(),
                    2 <= transportCycle) {
                        if (gameSettings.resourceRequest && gameSettings.showHub)
                            for (d = 0; !transportResources() && d < game.planets.length; )
                                d++;
                        transportCycle = 0
                    } else
                        transportCycle += b;
                (MOBILE_LANDSCAPE || 0 < game.timeTravelNum) && questChecker();
                idlePauseDuration -= b;
                0 > idlePauseDuration && (idlePauseDuration = 0);
                game.idleTime -= b * idleBon;
                0 > game.idleTime && (game.idleTime = 0);
                game.adsTime -= b;
                0 >= game.adsTime && (game.adsTime = 0,
                adsAvailable && $("#ads_icon").show());
                for (d = 0; d < planets.length; d++)
                    planets[d].raidCounter -= b * idleBon / 6E4,
                    0 > planets[d].raidCounter && (planets[d].raidCounter = 0);
                for (d = 0; d < civis.length; d++)
                    if (2 <= civis[d].map && civis[d].reputation[game.id] <= repLevel.hostile.max && 0 < civis[d].planets.length) {
                        civis[d].attackTime -= b;
                        0 >= civis[d].attackTime && (civis[d].attackTime = 60 * (10 * Math.random() + 10),
                        H(d));
                        e = [];
                        for (var h = 0; h < game.planets.length; h++)
                            2 == planets[game.planets[h]].map && e.push(game.planets[h]);
                        if (0 < e.length)
                            for (h = 0; h < e.length; h++) {
                                var g = null
                                  , m = 0
                                  , v = planets[e[h]];
                                for (X in v.fleets)
                                    if (0 != X && "hub" != X && "attack" == v.fleets[X].type) {
                                        g = v.fleets[X];
                                        m = X;
                                        break
                                    }
                                if (g) {
                                    for (X in v.fleets)
                                        if (0 != X && "hub" != X && v.fleets[X].civis == v.civis) {
                                            var Y = v.fleets[X].battle(g, !1, v);
                                            addBattleReport({
                                                name: "Attack on " + v.fleets[X].name + " of " + v.name,
                                                date: "Y" + game.getYear() + " D" + game.getDay(),
                                                report: Y.r
                                            })
                                        }
                                    if (g.shipNum()) {
                                        g = Math.floor(g.value() / 1E4);
                                        console.log(g);
                                        var X = 0;
                                        Y = {
                                            length: 0
                                        };
                                        for (var J = 0; J < v.structure.length; J++)
                                            J != buildingsName.space_delta && J != buildingsName.space_gamma && (X += v.structure[J].number,
                                            0 < v.structure[J].number && (Y[Y.length] = {
                                                n: v.structure[J].number,
                                                id: J
                                            },
                                            Y.length++));
                                        g = Math.min(g, X);
                                        for (X = 0; X < g; X++) {
                                            J = Math.floor(Math.random() * Y.length);
                                            var D = Y[J].id;
                                            Y[J].n--;
                                            if (0 >= Y[J].n) {
                                                for (; J < Y.length; J++)
                                                    Y[J] = Y[J + 1];
                                                delete Y[Y.length - 1];
                                                Y.length--
                                            }
                                            v.structure[D].number--;
                                            0 >= v.structure[D].number && (v.structure[D].number = 0)
                                        }
                                        g = new w(180,0,"<span class='red_text'>An enemy fleet has attacked " + v.name + " destroying " + g + " buildings</span>","info")
                                    } else
                                        g = new w(180,0,"<span class='green_text'>Your fleet defended " + v.name + "</span>","info");
                                    g.drawToast();
                                    delete v.fleets[m]
                                }
                            }
                    }
                MOBILE_LANDSCAPE && 0 == getAvailableTutorial() && tutorials[1].done || tutorialChecker();
                HORIZONS && !planets[planetsName.lagea].racheDone && (X = planets[planetsName.lagea].searchFleetByName2("Rache", planets[planetsName.lagea].fleets),
                X.found && planets[planetsName.lagea].fleets[X.id].civis == civisName.city && (planets[planetsName.lagea].fleets[X.id].civis = civisName.rebels),
                planets[planetsName.lagea].racheDone = !0)
            } else
                mainCycle++;
            X = ((new Date).getTime() - Aa) / 1E3;
            Aa = (new Date).getTime();
            averageTFleet = (averageTFleet + X) / 2;
            X = fleetSchedule.pop();
            b = 0;
            for (d = 1; b < X.length; )
                planets[X[b].destination].fleets[d] || (planets[X[b].destination].fleets[d] = X[b].fleet,
                b++),
                d++;
            "nada" != fleetStr && ((new w(180,0,fleetStr,"info")).drawToast(),
            fleetStr = "nada")
        }
        X = ((new Date).getTime() - ha) / 1E3;
        ha = (new Date).getTime();
        game.governmentTimer = Math.max(0, game.governmentTimer - X)
    }
    function m(b, d, e, h, g) {
        this.id = b;
        this.func = g;
        this.width = e + "px";
        0 > e && (e = "100%");
        this.html = "<ul style='width:" + e + ";float:left;text-align:center;'>";
        this.html += "<li id='" + this.id + "' class='button' style='display:table;height:" + h + "px;width:" + e + ";'><span class='blue_text' style='display:table-cell;font-size:120%;vertical-align:middle;position:relative;'>" + d + "</span></li></ul>";
        this.getHtml = function() {
            return this.html
        }
        ;
        this.enable = function() {
            $("#" + this.id).click(this.func)
        }
    }
    function w(b, d, e, h, g, l) {
        this.width = b;
        this.height = d;
        this.content = e;
        this.type = h;
        this.func = g;
        this.func2 = l;
        switch (h) {
        case "prompt":
            this.func = g;
            this.content += "<br><input id='prompt_value' class='white_text' style='position:absolute; left:32px; width:" + (this.width - 64) + "px; top:48px; border:none; background-color:rgba(75, 129, 156, 0.3);text-align:center;'>";
            this.content += "<br><br><ul style='width:" + this.width + "px; float:left; text-align:center;'>";
            this.content += "<li style='width:" + this.width + "px;'>";
            this.content += "<span id='prompt_ok_button' class='blue_text button text_shadow' style='position:absolute; left:0px; width:" + this.width / 2 + "px;'>Ok</span>";
            this.content += "<span id='prompt_cancel_button' class='blue_text button text_shadow' style='position:absolute; left:" + this.width / 2 + "px; width:" + this.width / 2 + "px;'>Cancel</span>";
            this.content += "</li></ul>";
            break;
        case "info":
            break;
        case "importBlueprint":
            this.content += "<br><select id='blueprintlist' style='width:80%;position:relative;left:0%;'>";
            if (1 >= game.planets.length)
                this.content += "<option value='n'>No planet available!</option>";
            else
                for (this.content += "<option value='s'>Select a Planet</option>",
                e = 0; e < game.planets.length; e++)
                    h = planets[game.planets[e]],
                    currentPlanet.id != h.id && (this.content += "<option value='" + game.planets[e] + "'>Import from " + h.name + "</option>");
            this.content += "</select>";
            this.content += "<textarea id='blueprintarea' spellcheck='false' rows='3' style='position:relative;left:0%;width:80%'></textarea>";
            this.content += "<br><span id='blueprintinfo'></span>";
            this.content = POPUP_VERTICAL ? this.content + ("</div><br><br><ul style='width: " + this.width + "px; float:left; text-align:center;'><li id='popup_ok_button' class='button text_shadow' style='width: " + this.width + "px;'><span class='blue_text'>Build</span></li><li id='popup_close_button' class='button text_shadow' style='width: " + this.width + "px;'><span class='blue_text'>Cancel</span></li></ul>") : this.content + ("</div><br><br><ul style='width: " + this.width + "px; float:left; text-align:center;'><li id='popup_ok_button' class='button text_shadow' style='width: " + this.width / 2 + "px;position:absolute;left:50%;'><span class='blue_text'>Build</span></li><li id='popup_close_button' class='button text_shadow' style='width: " + this.width / 2 + "px;position:absolute;left:0%;'><span class='blue_text'>Cancel</span></li><li style='height:16px;'></li></ul>");
            break;
        case "autoDivide":
        case "fleetDivide":
            this.func = g;
            this.content += "<br><div style='text-align:right;max-height:160px;overflow-y:auto;overflow-x:hidden;'>";
            for (e = 0; e < ships.length; e++)
                0 < g.ships[e] && (this.content += "<span class='blue_text' style='float:left;margin-left:16px'>" + ships[e].name + "</span><input style='width:64px'id='slide" + e + "' name='" + e + "'type='range' min='0' max='" + g.ships[e] + "' value='0' step='1' /><input style='width:48px;margin-right:16px'id='textval" + e + "' name='" + e + "' type='text' value='0'/><br>");
            this.content = POPUP_VERTICAL ? this.content + ("</div><br><br><ul style='width: " + this.width + "px; float:left; text-align:center;'><li id='popup_ok_button' class='button text_shadow' style='width: " + this.width + "px;'><span class='blue_text'>Divide</span></li><li id='popup_close_button' class='button text_shadow' style='width: " + this.width + "px;'><span class='blue_text'>Cancel</span></li></ul>") : this.content + ("</div><br><br><ul style='width: " + this.width + "px; float:left; text-align:center;'><li id='popup_ok_button' class='button text_shadow' style='width: " + this.width / 2 + "px;position:absolute;left:50%;'><span class='blue_text'>Divide</span></li><li id='popup_close_button' class='button text_shadow' style='width: " + this.width / 2 + "px;position:absolute;left:0%;'><span class='blue_text'>Cancel</span></li><li style='height:16px;'></li></ul>");
            break;
        case "loadShip":
        case "pickup":
            this.func = g;
            this.content += "<br><div style='text-align:right;height:200px;overflow-y:auto;'>";
            e = planets[this.func.planet].rawProduction();
            l = Array(resNum);
            for (var n = 0; n < resNum; n++)
                l[n] = n;
            gameSettings.sortResName && (l = sortedResources);
            for (n = 0; n < resNum; n++)
                h = l[n],
                1 <= planets[g.planet].resources[h] && (this.content += "<span class='blue_text' style='float:left;margin-left:16px'>" + resources[h].name.capitalize() + ": <span class='white_text' style='font-size:100%;'> " + beauty(planets[this.func.planet].resources[h]) + " <span class='" + (0 <= e[h] ? 0 < e[h] ? "green_text" : "gray_text" : "red_text") + "'>(" + (0 < e[h] ? "+" : "") + beauty(e[h]) + "/s)</span></span></span><input style='width:80px'id='res_slide" + h + "' name='" + h + "'type='range' min='0' max='" + Math.min("pickup" == this.type ? this.func.availableStorage() : planets[this.func.planet].resources[h], this.func.availableStorage()) + "' value='0' step='1' /><input style='width:80px'id='res_textval" + h + "' name='" + h + "' type='text' value='0'/><br>");
            this.content = POPUP_VERTICAL ? this.content + ("</div><br><br><ul style='width: " + this.width + "px; float:left; text-align:center;'><li id='popup_ok_button' class='button text_shadow' style='width: " + this.width + "px;'><span class='blue_text'>Load resources</span></li><li id='popup_close_button' class='button text_shadow' style='width: " + this.width + "px;'><span class='blue_text'>Cancel</span></li></ul>") : this.content + ("</div><br><br><ul style='width: " + this.width + "px; float:left; text-align:center;'><li id='popup_ok_button' class='button text_shadow' style='width: " + this.width / 2 + "px;position:absolute;left:50%;'><span class='blue_text'>Load resources</span></li><li id='popup_close_button' class='button text_shadow' style='width: " + this.width / 2 + "px;position:absolute;left:0%;'><span class='blue_text'>Cancel</span></li></ul>");
            break;
        case "loadAmmo":
        case "loadAmmoTour":
            this.func = g;
            this.content += "<br><div style='text-align:right;height:200px;overflow-y:auto;'>";
            e = planets[this.func.planet].rawProduction();
            for (l = 0; l < resLoadAmmo.length; l++)
                h = resLoadAmmo[l],
                1 <= planets[g.planet].resources[h] && (this.content += "<span class='blue_text' style='float:left;margin-left:16px'>" + resources[h].name.capitalize() + ": <span class='white_text' style='font-size:100%;'> " + beauty(planets[this.func.planet].resources[h]) + " <span class='" + (0 <= e[h] ? 0 < e[h] ? "green_text" : "gray_text" : "red_text") + "'>(" + (0 < e[h] ? "+" : "") + beauty(e[h]) + "/s)</span></span></span><input style='width:80px'id='res_slide" + h + "' name='" + h + "'type='range' min='0' max='" + Math.min("pickup" == this.type ? this.func.availableStorage() : planets[this.func.planet].resources[h], this.func.availableStorage()) + "' value='0' step='1' /><input style='width:80px'id='res_textval" + h + "' name='" + h + "' type='text' value='0'/><br>");
            this.content = POPUP_VERTICAL ? this.content + ("</div><br><br><ul style='width: " + this.width + "px; float:left; text-align:center;'><li id='popup_ok_button' class='button text_shadow' style='width: " + this.width + "px;'><span class='blue_text'>Load resources</span></li><li id='popup_close_button' class='button text_shadow' style='width: " + this.width + "px;'><span class='blue_text'>Cancel</span></li></ul>") : this.content + ("</div><br><br><ul style='width: " + this.width + "px; float:left; text-align:center;'><li id='popup_ok_button' class='button text_shadow' style='width: " + this.width / 2 + "px;position:absolute;left:50%;'><span class='blue_text'>Load resources</span></li><li id='popup_close_button' class='button text_shadow' style='width: " + this.width / 2 + "px;position:absolute;left:0%;'><span class='blue_text'>Cancel</span></li></ul>");
            break;
        case "loadAutoShip":
            this.func = g;
            this.content += "<br><div style='text-align:right;height:200px;overflow-y:auto;'>";
            l = Array(resNum);
            for (n = 0; n < resNum; n++)
                l[n] = n;
            gameSettings.sortResName && (l = sortedResources);
            for (n = 0; n < resNum; n++)
                h = l[n],
                1 <= planets[this.func.planet].resources[h] && (this.content += "<span class='blue_text' style='float:left;margin-left:16px'>" + resources[h].name + "</span><input style='width:80px'id='res_slide" + h + "' name='" + h + "'type='range' min='0' max='" + Math.min(planets[this.func.planet].resources[h], this.func.availableStorage()) + "' value='0' step='1' /><input style='width:80px'id='res_textval" + h + "' name='" + h + "' type='text' value='0'/><br>");
            this.content = POPUP_VERTICAL ? this.content + ("</div><br><br><ul style='width: " + this.width + "px; float:left; text-align:center;'><li id='popup_ok_button' class='button text_shadow' style='width: " + this.width + "px;'><span class='blue_text'>Save</span></li><li id='popup_close_button' class='button text_shadow' style='width: " + this.width + "px;'><span class='blue_text'>Cancel</span></li></ul>") : this.content + ("</div><br><br><ul style='width: " + this.width + "px; float:left; text-align:center;'><li id='popup_ok_button' class='button text_shadow' style='width: " + this.width / 2 + "px;position:absolute;left:50%;'><span class='blue_text'>Save</span></li><li id='popup_close_button' class='button text_shadow' style='width: " + this.width / 2 + "px;position:absolute;left:0%;'><span class='blue_text'>Cancel</span></li></ul>");
            break;
        case "renameFleet":
            this.func = g;
            h = currentFleetId.split("_");
            e = h[0];
            e = planets[e].fleets[h[1]];
            this.content += "<br><div >";
            this.content += "<input style='width:320px'id='rename_fleet' type='text' value='" + e.name + "'/><br>";
            this.content = POPUP_VERTICAL ? this.content + ("</div><br><br><ul style='width: " + this.width + "px; float:left; text-align:center;'><li id='popup_ok_button' class='button text_shadow' style='width: " + this.width + "px;'><span class='blue_text'>Change Name</span></li><li id='popup_close_button' class='button text_shadow' style='width: " + this.width + "px;'><span class='blue_text'>Cancel</span></li></ul>") : this.content + ("</div><br><br><ul style='width: " + this.width + "px; float:left; text-align:center;'><li id='popup_ok_button' class='button text_shadow' style='width: " + this.width / 2 + "px;position:absolute;left:50%;'><span class='blue_text'>Change Name</span></li><li id='popup_close_button' class='button text_shadow' style='width: " + this.width / 2 + "px;position:absolute;left:0%;'><span class='blue_text'>Cancel</span></li></ul>");
            break;
        case "renameGame":
            this.content += "<br><div >";
            this.content += "<input style='width:320px'id='rename_fleet' type='text' value='" + game.name + "'/><br>";
            this.content = POPUP_VERTICAL ? this.content + ("</div><br><br><ul style='width: " + this.width + "px; float:left; text-align:center;'><li id='popup_ok_button' class='button text_shadow' style='width: " + this.width + "px;'><span class='blue_text'>Change Name</span></li><li id='popup_close_button' class='button text_shadow' style='width: " + this.width + "px;'><span class='blue_text'>Cancel</span></li></ul>") : this.content + ("</div><br><br><ul style='width: " + this.width + "px; float:left; text-align:center;'><li id='popup_ok_button' class='button text_shadow' style='width: " + this.width / 2 + "px;position:absolute;left:50%;'><span class='blue_text'>Change Name</span></li><li id='popup_close_button' class='button text_shadow' style='width: " + this.width / 2 + "px;position:absolute;left:0%;'><span class='blue_text'>Cancel</span></li></ul>");
            break;
        case "renameFleetTravel":
            this.func = g;
            this.content += "<br><div >";
            this.content += "<input style='width:320px'id='rename_fleet' type='text' value='" + this.func.name + "'/><br>";
            this.content = POPUP_VERTICAL ? this.content + ("</div><br><br><ul style='width: " + this.width + "px; float:left; text-align:center;'><li id='popup_ok_button' class='button text_shadow' style='width: " + this.width + "px;'><span class='blue_text'>Change Name</span></li><li id='popup_close_button' class='button text_shadow' style='width: " + this.width + "px;'><span class='blue_text'>Cancel</span></li></ul>") : this.content + ("</div><br><br><ul style='width: " + this.width + "px; float:left; text-align:center;'><li id='popup_ok_button' class='button text_shadow' style='width: " + this.width / 2 + "px;position:absolute;left:50%;'><span class='blue_text'>Change Name</span></li><li id='popup_close_button' class='button text_shadow' style='width: " + this.width / 2 + "px;position:absolute;left:0%;'><span class='blue_text'>Cancel</span></li></ul>");
            break;
        case "confirm":
            this.content = POPUP_VERTICAL ? this.content + ("<br><br><ul style='width: " + this.width + "px; float:left; text-align:center;'><li id='popup_ok_button' class='button text_shadow' style='width: " + this.width + "px;'><span class='blue_text'>Ok</span></li><li id='popup_close_button' class='button text_shadow' style='width: " + this.width + "px;'><span class='blue_text'>Cancel</span></li></ul>") : this.content + ("<br><br><ul style='width: " + this.width + "px; float:left; text-align:center;'><li id='popup_close_button' class='button text_shadow' style='width: " + this.width / 2 + "px;position:absolute;left:0%;'><span class='blue_text'>Cancel</span></li><li id='popup_ok_button' class='button text_shadow' style='width: " + this.width / 2 + "px;position:absolute;left:50%;'><span class='blue_text'>Ok</span></li></ul>");
            break;
        case "tutorial":
            this.content = POPUP_VERTICAL ? this.content + ("<br><br><ul style='width: " + this.width + "px; float:left; text-align:center;'><li id='popup_ok_button' class='button text_shadow' style='width: " + this.width + "px;'><span class='blue_text'>Continue</span></li><li id='popup_disable_tutorial' class='button text_shadow' style='width: " + this.width + "px;'><span class='blue_text'>Disable Tutorial</span></li><li style='height:4px'></li></ul>") : this.content + ("<br><br><ul style='width: " + this.width + "px; float:left; text-align:center;'><li id='popup_disable_tutorial' class='button text_shadow' style='width: " + this.width / 2 + "px;position:absolute;left:0%;'><span class='blue_text'>Disable Tutorial</span></li><li id='popup_ok_button' class='button text_shadow' style='width: " + this.width / 2 + "px;position:absolute;left:50%;'><span class='blue_text'>Continue</span></li><li style='height:4px'></li></ul>");
            break;
        default:
            this.content += "<br><br><ul style='width: " + this.width + "px; float:left; text-align:center;'><li id='popup_ok_button' class='button text_shadow' style='width: " + this.width + "px;'><span class='blue_text'>Ok</span></li></ul>"
        }
        this.draw = function() {
            currentPopup && currentPopup.drop();
            currentPopup = this;
            document.getElementById("popup_content") && (document.getElementById("popup_content").innerHTML = "<span style='float:left; text-align:center;'>" + this.content + "</span>");
            switch (this.type) {
            case "prompt":
                this.promptValue = function() {
                    return $("#prompt_value").val()
                }
                ;
                $("#prompt_ok_button").click(function() {
                    currentPopup.func()
                });
                $("#prompt_cancel_button").click(this.drop);
                break;
            case "buy":
                $("#popup_ok_button").click(g);
                $("#popup_leave_button").click(this.drop);
                break;
            case "info":
                break;
            case "autoDivide":
            case "fleetDivide":
                for (var e = 0; e < ships.length; e++)
                    0 < g.ships[e] && ($("#slide" + e).change(function() {
                        $("#textval" + $(this).attr("name")).val($(this).val())
                    }),
                    $("#textval" + e).change(function() {
                        isFinite(parseInt($(this).val())) ? parseInt($(this).val()) > $("#slide" + $(this).attr("name")).attr("max") && $(this).val($("#slide" + $(this).attr("name")).attr("max")) : $(this).val(0);
                        $("#slide" + $(this).attr("name")).val($(this).val())
                    }));
                $("#popup_close_button").click(this.drop);
                $("#popup_ok_button").click(this.drop);
                "fleetDivide" == this.type ? $("#popup_ok_button").click(function() {
                    for (var b = currentFleetId.split("_"), d = b[0], e = planets[d].fleets[b[1]], h = e.exp, g = e.maxStorage(), n = 0; null != planets[d].fleets[n]; )
                        n++;
                    for (var l = 0, ja = 0, m = 0; m < ships.length; m++)
                        $("#slide" + m).val() && (l += parseInt($("#slide" + m).val())),
                        ja += e.ships[m];
                    if (0 == ja)
                        b = new w(210,0,"<span class='red_text red_text_shadow'>This fleet has no ship!</span>","info"),
                        b.drawToast();
                    else if (0 == l)
                        b = new w(210,0,"<span class='red_text red_text_shadow'>You must select at least 1 ship!</span>","info"),
                        b.drawToast();
                    else {
                        planets[d].fleets[n] = new Fleet(game.id,"div - " + e.name);
                        for (m = 0; m < ships.length; m++)
                            $("#slide" + m).val() && (ja = parseInt($("#slide" + m).val()),
                            planets[d].fleets[n].ships[m] = ja,
                            e.ships[m] -= ja,
                            0 > e.ships[m] && (e.ships[m] = 0),
                            0 > planets[d].fleets[n].ships[m] && (planets[d].fleets[n].ships[m] = 0));
                        for (m = ja = 0; m < ships.length; m++)
                            ja += e.ships[m];
                        m = e.value() + planets[d].fleets[n].value();
                        0 < m && (planets[d].fleets[n].exp = Math.floor(h * planets[d].fleets[n].value() / m),
                        e.exp = Math.ceil(h * e.value() / m));
                        if (0 == ja && 0 != b[1] && "hub" != b[1])
                            planets[d].fleets[n].storage = planets[d].fleets[b[1]].storage,
                            delete planets[d].fleets[b[1]];
                        else
                            for (e = planets[d].fleets[n].maxStorage() / g,
                            planets[d].fleets[b[1]].maxStorage(),
                            m = 0; m < resNum; m++)
                                ja = parseInt(Math.floor(planets[d].fleets[b[1]].storage[m] * e)),
                                planets[d].fleets[n].load(m, ja) && planets[d].fleets[b[1]].unloadSingle(m, ja)
                    }
                    S(currentCriteria);
                    document.getElementById("ship_info_name") && (document.getElementById("ship_info_name").innerHTML = "");
                    document.getElementById("ship_info_list") && (document.getElementById("ship_info_list").innerHTML = "")
                }) : "autoDivide" == this.type && $("#popup_ok_button").click(function() {
                    var b = $("#autodiv_button").attr("name").split("_");
                    b = fleetSchedule.fleets[b[1]];
                    var d = b.exp;
                    b.maxStorage();
                    for (var e = 0, h = 0, g = 0; g < ships.length; g++)
                        $("#slide" + g).val() && (e += parseInt($("#slide" + g).val())),
                        h += b.ships[g];
                    if (0 == h)
                        b = new w(210,0,"<span class='red_text red_text_shadow'>This fleet has no ship!</span>","info"),
                        b.drawToast();
                    else if (0 == e)
                        b = new w(210,0,"<span class='red_text red_text_shadow'>You must select at least 1 ship!</span>","info"),
                        b.drawToast();
                    else if (e < h) {
                        e = new Fleet(game.id,"div - " + b.name);
                        for (g = 0; g < ships.length; g++)
                            $("#slide" + g).val() && (h = parseInt($("#slide" + g).val()),
                            e.ships[g] = h,
                            b.ships[g] -= h,
                            0 > b.ships[g] && (b.ships[g] = 0),
                            0 > e.ships[g] && (e.ships[g] = 0));
                        g = b.value() + e.value();
                        0 < g && (e.exp = Math.floor(d * e.value() / g),
                        b.exp = Math.ceil(d * b.value() / g));
                        e.maxStorage();
                        b.maxStorage();
                        if (b.usedStorage() > b.maxStorage())
                            for (d = (b.usedStorage() - b.maxStorage()) / b.usedStorage(),
                            g = 0; g < resNum; g++)
                                h = parseInt(Math.floor(b.storage[g] * d)),
                                e.load(g, h) && b.unloadSingle(g, h);
                        e.type = "normal";
                        e.move(b.source, b.destination)
                    } else
                        b = new w(210,0,"<span class='red_text red_text_shadow'>You can not leave the autoroute empty</span>","info"),
                        b.drawToast();
                    ba(currentCriteriaAuto);
                    document.getElementById("ship_info_name") && (document.getElementById("ship_info_name").innerHTML = "");
                    document.getElementById("ship_info_list") && (document.getElementById("ship_info_list").innerHTML = "")
                });
                break;
            case "importBlueprint":
                $("#blueprintlist").change(function() {
                    var b = $("#blueprintlist").val();
                    planets[b] ? document.getElementById("blueprintarea").value = planets[b].exportBlueprint() : "s" == b ? document.getElementById("blueprintarea").value = "Select a fleet!" : document.getElementById("blueprintarea").value = ""
                });
                $("#popup_ok_button").click(function() {
                    var b = currentPlanet.importBlueprint($("#blueprintarea").val())
                      , d = "red_text";
                    b.result && (d = "green_text");
                    document.getElementById("blueprintinfo").innerHTML = "<span class='" + d + "'>" + b.info + "</span>"
                });
                $("#popup_close_button").click(this.drop);
                break;
            case "loadAmmo":
            case "loadAmmoTour":
            case "loadShip":
            case "pickup":
                for (var h = 0; h < resNum; h++) {
                    e = h;
                    "loadAmmo" == this.type && (e = resLoadAmmo[h]);
                    var n = currentFleetId.split("_")
                      , l = n[0]
                      , ja = planets[l].fleets[n[1]];
                    $("#res_slide" + e).change(function() {
                        for (var b = 0, d = 0; d < resNum; d++) {
                            var e = Math.floor(parseFloat($("#res_textval" + d).val()));
                            isFinite(e) || (e = 0);
                            d != parseInt($(this).attr("name")) && (b += e)
                        }
                        var h = Math.max(0, Math.min(ja.availableStorage() - b, planets[l].resources[$(this).attr("name")]));
                        "pickup" == currentPopup.type && (h = Math.max(0, ja.availableStorage() - b),
                        l = ja.planet);
                        max2 = Math.min(h, Math.floor(parseFloat($(this).val())));
                        b += max2;
                        $("#res_textval" + $(this).attr("name")).val(max2);
                        $("#res_slide" + $(this).attr("name")).attr("max", h);
                        $("#res_slide" + $(this).attr("name")).val(max2);
                        for (d = 0; d < resNum; d++)
                            d != parseInt($(this).attr("name")) && (e = Math.floor(parseFloat($("#res_textval" + d).val())),
                            isFinite(e) || (e = 0),
                            h = Math.max(0, Math.min(ja.availableStorage() - b + e, planets[l].resources[d])),
                            "pickup" == currentPopup.type && (h = Math.max(0, ja.availableStorage() - b + e),
                            l = ja.planet),
                            $("#res_slide" + d).attr("max", h),
                            $("#res_slide" + d).val(e))
                    });
                    $("#res_textval" + e).change(function() {
                        for (var b = 0, d = 0; d < resNum; d++) {
                            var e = Math.floor(parseFloat($("#res_textval" + d).val()));
                            isFinite(e) || (e = 0);
                            d != parseInt($(this).attr("name")) && (b += e)
                        }
                        var h = Math.max(0, Math.min(ja.availableStorage() - b, planets[l].resources[$(this).attr("name")]));
                        "pickup" == currentPopup.type && (h = Math.max(0, ja.availableStorage() - b),
                        l = ja.planet);
                        max2 = Math.min(h, Math.floor(parseFloat($(this).val())));
                        b += max2;
                        $("#res_textval" + $(this).attr("name")).val(max2);
                        $("#res_slide" + $(this).attr("name")).attr("max", h);
                        $("#res_slide" + $(this).attr("name")).val(max2);
                        for (d = 0; d < resNum; d++)
                            d != parseInt($(this).attr("name")) && (e = Math.floor(parseFloat($("#res_textval" + d).val())),
                            isFinite(e) || (e = 0),
                            h = Math.max(0, Math.min(ja.availableStorage() - b + e, planets[l].resources[d])),
                            "pickup" == currentPopup.type && (h = Math.max(0, ja.availableStorage() - b + e),
                            l = ja.planet),
                            $("#res_slide" + d).attr("max", h),
                            $("#res_slide" + d).val(e))
                    });
                    "loadAmmo" == this.type && h >= resLoadAmmo.length && (h = resNum)
                }
                $("#popup_close_button").click(this.drop);
                currentPopup = this;
                $("#popup_ok_button").unbind();
                $("#popup_ok_button").click(function() {
                    var b = currentFleetId.split("_")
                      , d = b[0]
                      , e = planets[d].fleets[b[1]];
                    if ("loadShip" == currentPopup.type || "loadAmmo" == currentPopup.type || "loadAmmoTour" == currentPopup.type) {
                        for (var h = 0, g = 0; g < resNum; g++) {
                            var n = g;
                            "loadAmmo" == currentPopup.type && (n = resLoadAmmo[g]);
                            $("#res_slide" + n).val() && (h += Math.floor(parseFloat($("#res_slide" + n).val())));
                            "loadAmmo" == currentPopup.type && g >= resLoadAmmo.length && (g = resNum)
                        }
                        if (h <= e.availableStorage()) {
                            for (g = 0; g < resNum; g++)
                                n = g,
                                "loadAmmo" == currentPopup.type && (n = resLoadAmmo[g]),
                                $("#res_slide" + n).val() && (h = Math.floor(parseFloat($("#res_slide" + n).val())),
                                e = Math.max(Math.min(h, planets[d].resources[n]), 0),
                                planets[d].fleets[b[1]].load(n, e) && planets[d].resourcesAdd(n, -e)),
                                "loadAmmo" == currentPopup.type && g >= resLoadAmmo.length && (g = resNum);
                            document.getElementById("ship_info_name") && (document.getElementById("ship_info_name").innerHTML = "");
                            document.getElementById("ship_info_list") && (document.getElementById("ship_info_list").innerHTML = "");
                            currentPopup.drop();
                            b = new w(210,0,"<span class='blue_text text_shadow'>Resources loaded!</span>","info");
                            b.drawToast();
                            "loadAmmoTour" == currentPopup.type && $("#orbit_fleet_list").change()
                        } else
                            currentPopup.drop(),
                            b = new w(210,0,"<span class='red_text red_text_shadow'>Not enough storage!</span>","info"),
                            b.drawToast()
                    } else {
                        for (n = 0; n < resNum; n++)
                            $("#res_slide" + n).val() && (h = Math.floor(parseFloat($("#res_slide" + n).val())),
                            e.autoRes[0][n] = h || 0);
                        currentPopup.func2()
                    }
                });
                break;
            case "renameFleet":
                currentPopup = this;
                $("#popup_close_button").unbind();
                $("#popup_close_button").click(this.drop);
                $("#popup_ok_button").unbind();
                $("#popup_ok_button").click(function() {
                    var b = currentFleetId.split("_");
                    planets[b[0]].fleets[b[1]].name = String($("#rename_fleet").val()).replace(/[&<>"'\/]/g, function(b) {
                        return ""
                    });
                    currentPopup.drop();
                    S(currentCriteria);
                    (new w(210,0,"<span class='blue_text text_shadow'>Fleet renamed!</span>","info")).drawToast()
                });
                break;
            case "renameGame":
                currentPopup = this;
                $("#popup_close_button").unbind();
                $("#popup_close_button").click(this.drop);
                $("#popup_ok_button").unbind();
                $("#popup_ok_button").click(function() {
                    game.name = String($("#rename_fleet").val()).replace(/[&<>"'\/]/g, function(b) {
                        return ""
                    });
                    currentPopup.drop();
                    C(currentPlanet);
                    (new w(210,0,"<span class='blue_text text_shadow'>Civilization renamed!</span>","info")).drawToast()
                });
                break;
            case "renameFleetTravel":
                currentPopup = this;
                $("#popup_close_button").unbind();
                $("#popup_close_button").click(this.drop);
                $("#popup_ok_button").unbind();
                $("#popup_ok_button").click(function() {
                    currentPopup.func.name = String($("#rename_fleet").val()).replace(/[&<>"'\/]/g, function(b) {
                        return ""
                    });
                    currentPopup.drop();
                    ba("auto");
                    (new w(210,0,"<span class='blue_text text_shadow'>Fleet renamed!</span>","info")).drawToast()
                });
                break;
            case "confirm":
                $("#popup_ok_button").click(this.func);
                $("#popup_close_button").click(this.drop);
                break;
            case "tutorial":
                $("#popup_ok_button").click(this.func);
                $("#popup_ok_button").click(this.drop);
                $("#popup_ok_button").click(function() {
                    currentPopup = null
                });
                $("#popup_disable_tutorial").click(function() {
                    gameSettings.hideTutorial = !0;
                    tutorials[getAvailableTutorial()].drop();
                    currentPopup.drop()
                });
                break;
            default:
                $("#popup_ok_button").click(this.drop)
            }
            $("#popup_info").hide();
            $("#popup").css("top", "" + parseInt(($(window).height() - d) / 2) + "px");
            $("#popup").css("left", "" + parseInt(($(window).width() - b) / 2) + "px");
            $("#popup_content").css("width", "" + b + "px");
            $("#line_top").css("width", "" + b + "px");
            $("#line_down").css("width", "" + b + "px");
            $("#popup_content").css("height", "" + (d + 12) + "px");
            $("#popup_content").mCustomScrollbar(ea);
            "info" == this.type && ($("#popup_container").css("z-index", 0),
            $("#popup_container").css("background-color", "rgba(2, 4, 5, 0.0)"));
            "tutorial" == this.type && $("#popup_container").css("background-color", "rgba(2, 4, 5, 0.7)");
            $("#popup_container").show();
            playAudio("confirm")
        }
        ;
        this.drawInfo = function() {
            currentPopup && currentPopup.drop();
            currentPopup = this;
            document.getElementById("popup_info_content") && (document.getElementById("popup_info_content").innerHTML = "<span style='float:left; text-align:center;'>" + this.content + "</span>");
            switch (this.type) {
            case "prompt":
                this.promptValue = function() {
                    return $("#prompt_value").val()
                }
                ;
                $("#prompt_ok_button").click(function() {
                    currentPopup.func()
                });
                $("#prompt_cancel_button").click(this.drop);
                break;
            case "buy":
                $("#popup_ok_button").click(g);
                $("#popup_leave_button").click(this.drop);
                break;
            case "info":
                break;
            default:
                $("#popup_ok_button").click(this.drop)
            }
            $("#popup_info").css("top", "" + parseInt(($(window).height() - d) / 2) + "px");
            $("#popup_info").css("left", "" + parseInt(($(window).width() - b) / 2) + "px");
            $("#popup__info_content").css("width", "" + b + "px");
            $("#line_top_info").css("width", "" + b + "px");
            $("#line_down_info").css("width", "" + b + "px");
            $("#popup_info_content").css("height", "" + d + "px");
            $("#popup_info").show();
            playAudio("hover")
        }
        ;
        this.drawToast = function() {
            toastTimeout && clearTimeout(toastTimeout);
            currentToast && currentToast.dropToast();
            clearTimeout(toastTimeout);
            document.getElementById("popup_display_content_toast") && (document.getElementById("popup_display_content_toast").innerHTML = "<span style='float:left; text-align:center;'>" + this.content + "</span>");
            gameSettings.toastRight ? $("#popup_display_toast").css("right", "" + parseInt(100 + b) + "px") : $("#popup_display_toast").css("right", "" + parseInt(($(window).width() - b) / 2) + "px");
            $("#popup_display_content_toast").css("width", "" + b + "px");
            $("#popup_display_content_toast").css("height", "" + d + "px");
            $("#popup_display_toast").show();
            $("#popup_display_toast").click(function() {
                currentToast.dropToast()
            });
            currentToast = this;
            toastTimeout = setTimeout(function() {
                currentToast.dropToast()
            }, 3E3);
            $("#popup_container_toast").css("z-index", 100);
            $("#popup_container_toast").css("background-color", "rgba(2, 4, 5, 0.7)");
            playAudio("confirm")
        }
        ;
        this.drop = function() {
            "info" != this.type ? $("#popup_container").hide() : ($("#popup_info").hide(),
            $("#popup_display").hide(),
            $("#popup_container").css("z-index", 100),
            $("#popup_container").css("background-color", "rgba(2, 4, 5, 0.7)"))
        }
        ;
        this.dropToast = function() {
            $("#popup_info_toast").hide();
            $("#popup_display_toast").hide();
            $("#popup_container_toast").css("z-index", 100);
            $("#popup_container_toast").css("background-color", "rgba(2, 4, 5, 0.7)");
            $("#popup_container_toast").hide()
        }
    }
    function K() {
        $("#permanent_menu").hide();
        $("#planet_mini").hide();
        $("#planet_interface").hide();
        $("#diplomacy_interface").hide();
        $("#planet_building_interface").hide();
        $("#planet_selection_interface").hide();
        $("#research_interface").hide();
        $("#tech_interface").hide();
        $("#settings_interface").hide();
        $("#ship_interface").hide();
        $("#shipyard_interface").hide();
        $("#map_interface").hide();
        $("#map_selection_interface").hide();
        $("#nebula_name").hide();
        $("#quest_interface").hide();
        $("#market_interface").hide();
        $("#profile_interface").hide();
        $("#building_selection_interface").hide();
        $("#back_button").hide();
        $("#bottom_build_menu").hide()
    }
    function I() {
        currentInterface = "permanentMenu";
        currentUpdater = function() {}
        ;
        K();
        $("#permanent_menu").show();
        firston && (firston = !1)
    }
    function C(b) {
        currentPlanet = b;
        currentInterface = "planetInterface";
        var d = MOBILE_LANDSCAPE ? "<div id='planet_view'><img id='arrow_left' src='ui/arrow_small_left.png' style='position:absolute;top:16px;width:48px;height:48px;left:27%;top:45%;z-index:1;cursor:pointer;'/><img id='arrow_right' src='ui/arrow_small.png' style='position:absolute;top:16px;width:48px;height:48px;right:27%;top:45%;z-index:1;cursor:pointer;'/><img id='planet_visualizer' src='ui/void.png' usemap='#planet_visualizer_map' style='top:16px;'/>\x3c!--map name='planet_visualizer_map' id='planet_click_map'><area shape='circle' coords='256,256,180' href='javascript:currentPlanetClicker();'></map--\x3e<div id='planet_places'></div><div id='civis_name' class='blue_text text_shadow' style='z-index:28;font-size:120%; position:absolute; left:20%;width:45%; top:1%;text-align:center;float:left;'></div></div><div id='planet_info' class='menu'><ul id='info_list'></ul><ul id ='info_list_placeholder' style='height:900px;'></ul></div><div id='planet_info2' class='menu'><ul id='info_list2'></ul><ul id ='info_list2_placeholder' style='height:880px;'></ul></div>" : MOBILE ? "<div id='planet_info' class='menu'><ul id='info_list' style='position:relative;'></ul><ul id='info_list2' style='position:relative;'></ul><ul id ='info_list_placeholder' style='height:880px;'></ul></div>" : "<div id='planet_view'><img id='arrow_left' src='ui/arrow_small_left.png' style='position:absolute;top:16px;width:48px;height:48px;left:27%;top:45%;z-index:1;cursor:pointer;'/><img id='arrow_right' src='ui/arrow_small.png' style='position:absolute;top:16px;width:48px;height:48px;right:27%;top:45%;z-index:1;cursor:pointer;'/><img id='planet_visualizer' src='ui/void.png' usemap='#planet_visualizer_map' style='top:16px;'/>\x3c!--map name='planet_visualizer_map' id='planet_click_map'><area shape='circle' coords='256,256,180' href='javascript:currentPlanetClicker();'></map--\x3e<div id='planet_places'></div><div id='civis_name' class='blue_text text_shadow' style='z-index:28;font-size:120%; position:absolute; width:1024px; top:50px;text-align:center;float:left;'></div></div><div id='planet_info' class='menu'><ul id='info_list'></ul><ul id ='info_list_placeholder' style='height:900px;'></ul></div><div id='planet_info2' class='menu'><ul id='info_list2'></ul><ul id ='info_list2_placeholder' style='height:880px;'></ul></div>";
        $("#planet_interface").html(d);
        d = {
            axis: "y",
            theme: "minimal",
            scrollInertia: 0,
            autoHideScrollbar: !1
        };
        $("#planet_info").mCustomScrollbar(d);
        MOBILE || $("#planet_info2").mCustomScrollbar(d);
        for (var e = d = 0; e < resNum; e++)
            resources[e].show(game) && d++;
        MOBILE ? $("#info_list_placeholder").css("height", 16 * d + 580 + "px") : $("#info_list2_placeholder").css("height", 16 * d + 400 + "px");
        currentUpdater = function() {}
        ;
        MOBILE || $("#planet_visualizer").attr("src", "" + IMG_FOLDER + "/" + b[PLANET_IMG_FIELD] + (1 == PLANET_FOLDER_DOUBLE ? "/" + b[PLANET_IMG_FIELD] : "") + ".png");
        e = "";
        for (d = 0; d < b.places.length; d++) {
            var g = b.places[d];
            g.available() && (e += "<img id='place_" + g.id + "' name='" + g.id + "' src='" + UI_FOLDER + "/mark.png' style='cursor:pointer;width:32px;height:32px;position:absolute;left:" + (25 + 50 * g.position.x) + "%;top:" + (10 + 80 * g.position.y) + "%;' />")
        }
        $("#planet_places").html(e);
        for (d = 0; d < b.places.length; d++)
            g = b.places[d],
            g.available() && ($("#place_" + g.id).unbind(),
            h("place_" + g.id, "<span class='blue_text'>Investigate " + g.name + "</span>", 232),
            $("#place_" + g.id).click(function() {
                var b = $(this).attr("name");
                b = places[placesNames[b]];
                b.action();
                $(this).unbind();
                $(this).hide();
                (new w(320,180,"<span class='blue_text' style='font-size:110%'>" + b.name + "</span><br><br><span class='white_text'>" + b.description() + "</span>","Ok")).draw()
            }));
        game.searchPlanet(b.id) && 1 < game.planets.length ? ($("#arrow_left").unbind(),
        $("#arrow_left").click(function() {
            for (var b = !1, d = 0; !b && d < game.planets.length; )
                game.planets[d] == currentPlanet.id ? b = !0 : d++;
            b && C(planets[game.planets[(d + game.planets.length - 1) % game.planets.length]])
        }),
        $("#arrow_right").unbind(),
        $("#arrow_right").click(function() {
            for (var b = !1, d = 0; !b && d < game.planets.length; )
                game.planets[d] == currentPlanet.id ? b = !0 : d++;
            b && C(planets[game.planets[(d + 1) % game.planets.length]])
        }),
        $("#arrow_left").show(),
        $("#arrow_right").show()) : ($("#arrow_left").unbind(),
        $("#arrow_left").hide(),
        $("#arrow_right").unbind(),
        $("#arrow_right").hide());
        null != b.civis ? (e = "<span class='white_text' style='font-size:100%;'>Controlled by </span><span  id='civ_name' name='" + b.civis + "' style='cursor:pointer'>" + civis[b.civis].name + "</span><img src='" + UI_FOLDER + "/civis/" + civis[b.civis].playerName + ".png' style='height:32px;width:32px;top:8px;position:relative;'>",
        ALLOW_CIVIS_RENAME && b.civis == game.id && (e += "<img id='game_rename' src='" + UI_FOLDER + "/RENAME.png' style='width:16px;height:16px;position:relative;top:3px;cursor:pointer;'/>"),
        document.getElementById("civis_name") && (document.getElementById("civis_name").innerHTML = e),
        b.civis && $("#civ_name").click(function() {
            (MOBILE_LANDSCAPE || 0 < game.timeTravelNum) && R(b.civis)
        }),
        ALLOW_CIVIS_RENAME && b.civis == game.id && $("#game_rename").click(function() {
            (new w(360,140,"<br><span class='blue_text text_shadow'>Type the new name</span><br>","renameGame")).draw()
        })) : document.getElementById("civis_name") && (document.getElementById("civis_name").innerHTML = "");
        g = uiScheduler.planetInfo(b);
        e = g.buttons;
        if (!MOBILE) {
            document.getElementById("info_list") && (document.getElementById("info_list").innerHTML = g.html);
            for (var n = 0; n < e.length; n++)
                e[n].enable()
        }
        e = "";
        MOBILE && (e += "<div style='position:absolute;top:16px;height:512px;width:100%;'></div>" + g.html);
        g = "200px";
        MOBILE && (g = "100%");
        if (game.searchPlanet(b.id))
            d = "position:absolute;",
            MOBILE && (d = "position:relative;"),
            e += "<span class='blue_text' style='" + d + " font-size:120%; float:left; width:" + g + "; text-align:center; top:16px;'>Status</span>";
        else if (b.unlock && (d = researchesName[b.unlock],
        e = e + ("<br><span class='green_text' style='font-size:100%; float:left; width:" + g + "; text-align:center; top:8px;'>This planet unlocks: </span><br><br>") + ("<span class='blue_text' style='font-size: 100%;'>" + game.researches[d].name + " Research</span><br><br>"),
        e += "<span class='white_text'>" + game.researches[d].description() + "</span><li>"),
        b.searchCivisFleet(game.id)) {
            g = 0;
            for (d in b.fleets)
                if (0 != d && "hub" != d && b.fleets[d].civis == b.civis) {
                    d = uiScheduler.fleetInfo(b.id, d, b.fleets[d]);
                    g += d.cnt;
                    e += "<div id='enemy_fleet_info_list' style='position:relative;'>" + d.html + "</div>";
                    break
                }
            $("#info_list2").css("height", "" + (768 + 16 * g) + "px")
        }
        d = "position:absolute;";
        MOBILE && (d = "position:relative;");
        e = e + ("<ul id='info_list2' style='" + d + " text-align:left; top:48px; margin-top:16px; clear:both;'>") + uiScheduler.planetResources(b);
        e += "</ul>";
        document.getElementById("info_list2") && (document.getElementById("info_list2").innerHTML = e);
        game.searchPlanet(b.id) && (MOBILE || (currentUpdater = function() {
            var d = "position:absolute;";
            MOBILE && (d = "position:relative;");
            d = "<span class='blue_text' style='position:absolute; font-size:120%; float:left; width:200px; text-align:center; top:8px;'>Status</span>" + ("<ul id='info_list2' style='" + d + " text-align:left; top:48px; margin-top:16px; clear:both;'>") + uiScheduler.planetResourcesUpdater([b]);
            d += "</ul>";
            document.getElementById("info_list2") && (document.getElementById("info_list2").innerHTML = d);
            uiScheduler.planetInfoUpdater([b])
        }
        ));
        K();
        $("#planet_interface").show();
        $("#back_button").unbind();
        $("#back_button").click(O);
        $("#back_button").show();
        game.searchPlanet(b.id) && ($("#bottom_build_menu").show(),
        5 <= game.researches[3].level ? ($("#b_market_icon").show(),
        $("#b_shipyard_icon").show()) : (1 <= game.researches[3].level ? $("#b_shipyard_icon").show() : $("#b_shipyard_icon").hide(),
        $("#b_market_icon").hide()))
    }
    function B() {
        currentInterface = "buildingSelectionInterface";
        K();
        $("#building_selection_planet_icon").attr("src", "" + IMG_FOLDER + "/" + currentPlanet[PLANET_IMG_FIELD] + (1 == PLANET_FOLDER_DOUBLE ? "/" + currentPlanet[PLANET_IMG_FIELD] : "") + ".png");
        $("#building_selection_interface").show();
        $("#back_button").unbind();
        $("#back_button").click(function() {
            C(currentPlanet)
        });
        $("#back_button").show();
        $("#bottom_build_menu").show();
        5 <= game.researches[3].level ? ($("#b_market_icon").show(),
        $("#b_shipyard_icon").show()) : (1 <= game.researches[3].level && $("#b_shipyard_icon").show(),
        $("#b_market_icon").hide())
    }
    function z(b, d) {
        currentInterface = "planetBuildingInterface_" + b;
        currentInterfaceCategory = "planet";
        currentPlanet = d;
        currentUpdater = function() {}
        ;
        var e = ""
          , g = [];
        for (e = 0; e < buildings.length; e++)
            if (buildings[e].type == b) {
                var n = !1;
                if ("mining" == b)
                    for (var l = 0; l < resNum; l++) {
                        if (0 < buildings[e].resourcesProd[l] * currentPlanet.baseResources[l]) {
                            n = !0;
                            break
                        }
                    }
                else
                    n = !0;
                buildings[e].show(currentPlanet) && n && g.push({
                    bid: e,
                    pid: d.id
                })
            }
        n = uiScheduler.templateList(uiScheduler.templateBuilding, g);
        e = n.html;
        n = n.bind;
        document.getElementById("building_list") && (document.getElementById("building_list").innerHTML = e);
        for (l = 0; l < g.length; l++)
            $("#building" + g[l].bid).unbind(),
            $("#building" + g[l].bid).valore = g[l].bid,
            $("#building" + g[l].bid).click(n[l]),
            gameSettings.showBuildingAid && $("#building" + g[l].bid).hover(function() {
                for (var b = $(this).attr("name"), d = 0; d < resNum; d++)
                    1 <= currentPlanet.structure[b].cost(d) && (highlightRes[d] = !0,
                    $("#res_name_div_" + d).css("background", "rgba(75,129,156,0.3)"),
                    $("#buildingAid_" + d).html("")),
                    0 < buildings[b].resourcesProd[d] ? (highlightProd[d] = !0,
                    $("#res_name_div_" + d).css("background", "rgba(0,255,0,0.3)"),
                    $("#buildingAid_" + d).html("<img src='" + UI_FOLDER + "/arrow_up_green.png' />")) : 0 > buildings[b].resourcesProd[d] && (highlightCons[d] = !0,
                    $("#res_name_div_" + d).css("background", "rgba(255,0,0,0.3)"),
                    $("#buildingAid_" + d).html("<img src='" + UI_FOLDER + "/arrow_down_red.png' />"))
            }, function() {
                for (var b = $(this).attr("name"), d = 0; d < resNum; d++)
                    1 <= currentPlanet.structure[b].cost(d) && (highlightRes[d] = !1,
                    $("#res_name_div_" + d).css("background", "rgba(75,129,156,0.0)"),
                    $("#buildingAid_" + d).html("")),
                    0 < buildings[b].resourcesProd[d] ? (highlightProd[d] = !1,
                    $("#res_name_div_" + d).css("background", "rgba(0,255,0,0.0)"),
                    $("#buildingAid_" + d).html("")) : 0 > buildings[b].resourcesProd[d] && (highlightCons[d] = !1,
                    $("#res_name_div_" + d).css("background", "rgba(255,0,0,0.0)"),
                    $("#buildingAid_" + d).html(""))
            }),
            e = g[l].bid,
            $("#b_drop_queue_" + e).unbind(),
            $("#b_drop_queue_" + e).click(function() {
                currentBuildingId = parseInt($(this).attr("name"));
                currentPlanet.removeQueue(currentBuildingId);
                v()
            }),
            h("b_drop_queue_" + e, "<span class='blue_text'>Remove from queue</span>", 132),
            $("#b_shut_" + e).unbind(),
            $("#b_shut_" + e).click(function() {
                currentBuildingId = parseInt($(this).attr("name"));
                currentPlanet.structure[currentBuildingId].active = currentPlanet.structure[currentBuildingId].active ? !1 : !0;
                v()
            }),
            $("#b_build_" + e).unbind(),
            $("#b_build_" + e).click(function() {
                currentBuildingId = parseInt($(this).attr("name"));
                currentPlanet.buyMultipleStructure(currentBuildingId, 1) ? v() : (new w(210,0,"<span class='red_text'>There are not enough resources!</span>","info")).drawToast();
                $("#b_build_" + parseInt($(this).attr("name"))).mouseenter()
            }),
            $("#b_build10_" + e).unbind(),
            $("#b_build10_" + e).click(function() {
                currentBuildingId = parseInt($(this).attr("name"));
                currentPlanet.buyMultipleStructure(currentBuildingId, 10) ? v() : (new w(210,0,"<span class='red_text'>There are not enough resources!</span>","info")).drawToast();
                $("#b_build10_" + parseInt($(this).attr("name"))).mouseenter()
            }),
            $("#b_build50_" + e).unbind(),
            $("#b_build50_" + e).click(function() {
                currentBuildingId = parseInt($(this).attr("name"));
                currentPlanet.buyMultipleStructure(currentBuildingId, 50) ? v() : (new w(210,0,"<span class='red_text'>There are not enough resources!</span>","info")).drawToast();
                $("#b_build50_" + parseInt($(this).attr("name"))).mouseenter()
            }),
            $("#b_dismantle_" + e).unbind(),
            $("#b_dismantle_" + e).click(function() {
                currentBuildingId = parseInt($(this).attr("name"));
                currentPlanet.sellStructure(currentBuildingId) ? v() : (new w(210,0,"<span class='red_text'>There are no buildings to dismantle!</span>","info")).drawToast();
                $("#b_dismantle_" + parseInt($(this).attr("name"))).mouseenter()
            }),
            $("#b_dismantle10_" + e).unbind(),
            $("#b_dismantle10_" + e).click(function() {
                currentBuildingId = parseInt($(this).attr("name"));
                currentPlanet.sellMultipleStructure(currentBuildingId, 10) ? v() : (new w(210,0,"<span class='red_text'>There are no buildings to dismantle!</span>","info")).drawToast();
                $("#b_dismantle10_" + parseInt($(this).attr("name"))).mouseenter()
            }),
            $("#b_dismantle50_" + e).unbind(),
            $("#b_dismantle50_" + e).click(function() {
                currentBuildingId = parseInt($(this).attr("name"));
                currentPlanet.sellMultipleStructure(currentBuildingId, 50) ? v() : (new w(210,0,"<span class='red_text'>There are no buildings to dismantle!</span>","info")).drawToast();
                $("#b_dismantle50_" + parseInt($(this).attr("name"))).mouseenter()
            }),
            $("#b_dismantle_" + e).hover(function() {
                var b = parseInt($(this).attr("name"));
                (new w(240,10,currentPlanet.showSellCost(b, 1),"info")).drawInfo();
                $(document).on("mousemove", function(b) {
                    mouseX = b.pageX + 10;
                    mouseY = b.pageY + 10;
                    $("#popup_info").css({
                        left: mouseX,
                        top: mouseY
                    })
                });
                $("#popup_info").css({
                    left: mouseX,
                    top: mouseY
                })
            }, function() {
                currentPopup.drop()
            }),
            $("#b_dismantle_" + e).mouseout(function() {
                $(document).on("mousemove", function() {})
            }),
            $("#b_dismantle10_" + e).hover(function() {
                var b = parseInt($(this).attr("name"));
                (new w(210,10,currentPlanet.showSellCost(b, 10),"info")).drawInfo();
                $(document).on("mousemove", function(b) {
                    mouseX = b.pageX + 10;
                    mouseY = b.pageY + 10;
                    $("#popup_info").css({
                        left: mouseX,
                        top: mouseY
                    })
                });
                $("#popup_info").css({
                    left: mouseX,
                    top: mouseY
                })
            }, function() {
                currentPopup.drop()
            }),
            $("#b_dismantle10_" + e).mouseout(function() {
                $(document).on("mousemove", function() {})
            }),
            $("#b_dismantle50_" + e).hover(function() {
                var b = parseInt($(this).attr("name"));
                (new w(210,10,currentPlanet.showSellCost(b, 50),"info")).drawInfo();
                $(document).on("mousemove", function(b) {
                    mouseX = b.pageX + 10;
                    mouseY = b.pageY + 10;
                    $("#popup_info").css({
                        left: mouseX,
                        top: mouseY
                    })
                });
                $("#popup_info").css({
                    left: mouseX,
                    top: mouseY
                })
            }, function() {
                currentPopup.drop()
            }),
            $("#b_dismantle50_" + e).mouseout(function() {
                $(document).on("mousemove", function() {})
            }),
            $("#b_build_" + e).hover(function() {
                var b = parseInt($(this).attr("name"));
                (new w(200,10,currentPlanet.showBuyCost(b, 1),"info")).drawInfo();
                $(document).on("mousemove", function(b) {
                    mouseX = b.pageX + 10;
                    mouseY = b.pageY + 10;
                    $("#popup_info").css({
                        left: mouseX,
                        top: mouseY
                    })
                });
                $("#popup_info").css({
                    left: mouseX,
                    top: mouseY
                })
            }, function() {
                currentPopup.drop()
            }),
            $("#b_build_" + e).mouseout(function() {
                $(document).on("mousemove", function() {})
            }),
            $("#b_build10_" + e).hover(function() {
                var b = parseInt($(this).attr("name"));
                (new w(200,10,currentPlanet.showBuyCost(b, 10),"info")).drawInfo();
                $(document).on("mousemove", function(b) {
                    mouseX = b.pageX + 10;
                    mouseY = b.pageY + 10;
                    $("#popup_info").css({
                        left: mouseX,
                        top: mouseY
                    })
                });
                $("#popup_info").css({
                    left: mouseX,
                    top: mouseY
                })
            }, function() {
                currentPopup.drop()
            }),
            $("#b_build10_" + e).mouseout(function() {
                $(document).on("mousemove", function() {})
            }),
            $("#b_build50_" + e).hover(function() {
                var b = parseInt($(this).attr("name"));
                (new w(200,10,currentPlanet.showBuyCost(b, 50),"info")).drawInfo();
                $(document).on("mousemove", function(b) {
                    mouseX = b.pageX + 10;
                    mouseY = b.pageY + 10;
                    $("#popup_info").css({
                        left: mouseX,
                        top: mouseY
                    })
                });
                $("#popup_info").css({
                    left: mouseX,
                    top: mouseY
                })
            }, function() {
                currentPopup.drop()
            }),
            $("#b_build50_" + e).mouseout(function() {
                $(document).on("mousemove", function() {})
            });
        g = "<ul id='mini_list' style='position:absolute; text-align:left; top:0px; clear:both;'><div style='position:relative; left:8px;'>" + uiScheduler.planetEnergyInfo(d);
        g += uiScheduler.planetResources(d);
        g += "</div></ul>";
        document.getElementById("mini_list") && (document.getElementById("mini_list").innerHTML = g);
        currentUpdater = function() {
            var b = "<ul id='mini_list' style='position:absolute; text-align:left; top:0px;clear:both;'><div style='position:relative; left:8px;'>" + uiScheduler.planetEnergyInfo(d);
            b += uiScheduler.planetResources(d);
            b += "</div></div></ul>";
            document.getElementById("mini_list") && (document.getElementById("mini_list").innerHTML = b);
            v()
        }
        ;
        currentUpdater();
        K();
        A();
        $("#arrow_mini_left").unbind();
        $("#arrow_mini_left").click(function() {
            for (var d = !1, e = 0; !d && e < game.planets.length; )
                game.planets[e] == currentPlanet.id ? d = !0 : e++;
            d && z(b, planets[game.planets[(e + game.planets.length - 1) % game.planets.length]])
        });
        $("#arrow_mini_right").unbind();
        $("#arrow_mini_right").click(function() {
            for (var d = !1, e = 0; !d && e < game.planets.length; )
                game.planets[e] == currentPlanet.id ? d = !0 : e++;
            d && z(b, planets[game.planets[(e + 1) % game.planets.length]])
        });
        1 < game.planets.length ? ($("#arrow_mini_left").show(),
        $("#arrow_mini_right").show()) : ($("#arrow_mini_left").hide(),
        $("#arrow_mini_right").hide());
        $("#planet_building_interface").show();
        $("#back_button").unbind();
        $("#back_button").click(B);
        $("#back_button").show();
        game.searchPlanet(currentPlanet.id) && ($("#bottom_build_menu").show(),
        5 <= game.researches[3].level ? ($("#b_market_icon").show(),
        $("#b_shipyard_icon").show()) : (1 <= game.researches[3].level && $("#b_shipyard_icon").show(),
        $("#b_market_icon").hide()))
    }
    function aa(b) {
        currentInterface = "shipyardInterface";
        currentPlanet = b;
        currentUpdater = function() {}
        ;
        for (var d = [], e = "", g = Array(game.ships.length), n = 0; n < game.ships.length; n++)
            g[n] = n;
        gameSettings.shipSorted && (g = sortObjIndex(game.ships, "req"));
        e = "";
        for (var l = 0; l < game.ships.length; l++) {
            n = g[l];
            var m = "button";
            m = currentPlanet.shipAffordable(game.ships[n].id) ? "button" : "red_button";
            game.ships[n].req <= currentPlanet.structure[buildingsName.shipyard].number && game.ships[n].show() ? e += "<li id='shipyard" + n + "' name='" + game.ships[n].id + "' style='height:80px;' class='" + m + "'></li>" : game.ships[n].req <= currentPlanet.structure[buildingsName.shipyard].number + 1 && (e += "<li id='shipyard_locked" + n + "' name='" + game.ships[n].id + "' style='height:80px;' class='red_button'></li>");
            d[n] = game.ships[n].id
        }
        document.getElementById("shipyard_list") && (document.getElementById("shipyard_list").innerHTML = e);
        g = "<ul id='shipyard_mini_list' style='position:absolute; text-align:left; top:0px;clear:both;'><div style='position:relative; left:8px;'>" + ("<span class='blue_text' style='position:relative;top:-16px;'>Shipyard: </span><span class='white_text' style='float:right;margin-right:20%;position:relative;top:-26px;'><img id='shipyard_build' name='" + n + "' src='" + UI_FOLDER + "/add2.png' style='width:17px;height:17px;position:relative;top:4px;left:-2px;cursor:pointer;'/><span id='shipyard_level'>" + b.structure[buildingsName.shipyard].number + " </span><img id='shipyard_dismantle' src='" + UI_FOLDER + "/x.png' style='width:20px;height:20px;position:relative;top:6px;left:2px;cursor:pointer;'/></span><br><br>");
        g += "<span class='blue_text'>Energy Prod.: </span><span id='energy_prod' class='white_text' style='float:right;margin-right:20%;'>" + Math.floor(b.energyProduction()) + "</span><br>";
        g += "<span class='blue_text'>Energy Cons.: </span><span id='energy_cons' class='white_text' style='float:right;margin-right:20%;'>" + Math.floor(-b.energyConsumption()) + "</span><br>";
        n = Math.floor(b.energyProduction() + b.energyConsumption());
        l = b.energyMalus();
        1 < l ? l = 1 : 0 > l && (l = 0);
        e = "green_text";
        .85 <= l && 1 > l ? e = "gold_text" : .85 > l && (e = "red_text");
        g += "<span class='blue_text'>Balance: </span><span id='balance' class='" + e + "' style='float:right;margin-right:20%;'>" + parseInt(Math.floor(n)) + "</span><br>";
        g += "<span class='blue_text'>Efficiency: </span><span id='efficiency' class='" + e + "' style='float:right;margin-right:20%;'>" + Math.floor(1E4 * l) / 100 + "%</span><br><br>";
        gameSettings.populationEnabled && (g += "<span class='blue_text'>Population Growth: </span><span id='popGrow' class='white_text' style='float:right;margin-right:20%;'>" + 100 * b.basePopulation + "%" + (0 < b.structure[buildingsName.clonation].number ? "<span class='green_text'>(+" + b.structure[buildingsName.clonation].number + "%)</span>" : "") + "/y</span><br>",
        g += "<span class='blue_text'>Population: </span><span class='white_text' style='float:right;margin-right:20%;' id='popul'>" + beauty(b.population) + " " + (0 < b.globalProd.population + b.populationRatio ? "<span class='green_text'>(+" + beauty(b.globalProd.population + b.populationRatio) + "/s)</span>" : "<span class='red_text'>(" + beauty(b.globalProd.population + b.populationRatio) + "/s)</span>") + "</span><br>",
        g += "<span class='blue_text'>Habitable Space: </span><span class='white_text' style='float:right;margin-right:20%;' id='habitable'>" + beauty(b.habitableSpace()) + "</span><br><br>");
        m = b.rawProduction();
        var u = Array(resNum);
        b.importExport();
        for (n = 0; n < resNum; n++)
            u[n] = b.globalImport[n] - b.globalExport[n];
        var v = Array(resNum);
        for (n = 0; n < resNum; n++)
            v[n] = n;
        gameSettings.sortResName && (v = sortedResources);
        e = "";
        for (l = 0; l < resNum; l++)
            n = v[l],
            (resources[n].show(game) || 0 < b.resources[n]) && (resources[n].ship || gameSettings.allShipres) && (g += "<div id='res_name_div_" + n + "' ",
            e = "<span id='buildingAid_" + n + "'>",
            highlightProd[n] ? (g += " style='background:rgba(0,255,0,0.3);'>",
            e += "<img src='" + UI_FOLDER + "/arrow_up_green.png' />") : highlightCons[n] ? (g += " style='background:rgba(255,0,0,0.3);'>",
            e += "<img src='" + UI_FOLDER + "/arrow_down_red.png' />") : g = highlightRes[n] ? g + " style='background:rgba(75,129,156,0.3);'>" : g + ">",
            e += "</span>",
            g += "<span class='blue_text' >" + resources[n].name.capitalize() + ": </span><span class='white_text' style='margin-righ:16px;font-size:80%' id='res_name_prod_" + n + "' name='" + n + "'>" + beauty(b.resources[n]) + " <span class='" + (0 <= m[n] ? 0 < m[n] ? "green_text" : "gray_text" : "red_text oblique_txt") + "'>(" + (0 < m[n] ? "+" : "") + beauty(m[n]) + "/s)" + e + "</span>",
            0 != u[n] && (g += "<span class='" + (0 <= u[n] ? 0 < u[n] ? "purple_text" : "gray_text" : "pink_text oblique_txt") + "'> (" + (0 < u[n] ? "+" : "") + beauty(u[n]) + "/s)</span>"),
            MOBILE_LANDSCAPE && 0 < game.planets.length && 0 != game.totalProd[n] && (g += "<span class='" + (0 <= game.totalProd[n] ? 0 < game.totalProd[n] ? "purple_text" : "gray_text" : "pink_text oblique_txt") + "'> (" + (0 < game.totalProd[n] ? "+" : "") + beauty(game.totalProd[n]) + "/s)</span>"),
            gameSettings.populationEnabled && n == FOOD_RESOURCE && 0 < (b.population - b.sustainable()) / 5E3 && (g += "<span class='gold_text' id='res_name_prod_biomass' name='" + n + "'>(-" + beauty((b.population - b.sustainable()) / 5E3) + "/s)</span>"),
            g += "</span></div>");
        g += "</div></ul>";
        document.getElementById("shipyard_mini_list") && (document.getElementById("shipyard_mini_list").innerHTML = g);
        currentPlanet.shipyardFleet = new Fleet(game.id,"Fleet Y" + Math.floor(game.days / 365) + "-D" + Math.floor(game.days % 365));
        currentPlanet.shipyardFleet.pushed = !1;
        for (n = 0; n < d.length; n++)
            game.ships[n].req <= currentPlanet.structure[buildingsName.shipyard].number && game.ships[n].show() && ($("#shipyard" + n).valore = n,
            $("#shipyard" + n).click(function() {
                document.getElementById("shipyard_info_name") && (document.getElementById("shipyard_info_name").innerHTML = ships[parseInt($(this).attr("name"))].name);
                $("#shipyard_info_name").html(ships[parseInt($(this).attr("name"))].name);
                var b = "<ul id='shipyard_info_list' style='position:absolute; text-align:right; top:48px; margin-top:16px; clear:both;'>"
                  , d = ships[parseInt($(this).attr("name"))]
                  , e = "margin-left:16px;width:256px;height:256px";
                MOBILE_LANDSCAPE && (e = "position:relative;left:0px;width:200px;height:200px");
                d.icon && (b += "<img src='" + IMG_FOLDER + "/ships/" + d.icon + ".png' style='" + e + "' />");
                b = b + "<div style='position:relative; left:8px;'><span class='blue_text' style='float:left;margin-left:16px;font-size:120%;'>Information</span><br><br>" + ("<span class='blue_text' style='float:left;margin-left:16px;'>Type: </span><span class='white_text'>" + d.type + "</span><br>");
                b += "<span class='blue_text' style='float:left;margin-left:16px;' id='hp_info'>HP: </span><span class='white_text'>" + beauty(Math.floor(d.hp)) + "</span><br>";
                b += "<span class='blue_text' style='float:left;margin-left:16px;' id='power_info'>Power: </span><span class='white_text'>" + beauty(Math.floor(100 * d.power) / 100) + "</span><br>";
                b += "<span class='blue_text' style='float:left;margin-left:16px;' id='weapon_info'>Weapon: </span><span class='white_text'>" + d.weapon.capitalize() + "</span><br>";
                0 < d.piercing && (b += "<span class='blue_text' style='float:left;margin-left:16px;' id='piercing_info'>Piercing Power: </span><span class='white_text'>" + Math.min(100, Math.floor(100 * d.piercing) / 100) + "%</span><br>");
                0 < d.shield && (b += "<span class='blue_text' style='float:left;margin-left:16px;' id='shields_info'>Shields: </span><span class='white_text'>" + beauty(d.shield) + "</span><br>");
                b += "<span class='blue_text' style='float:left;margin-left:16px;' id='dr_info'>Damage Reduction: </span><span class='white_text'>" + Math.floor(100 * (100 - 100 / (1 + Math.log(1 + d.armor / 1E4) / Math.log(2)))) / 100 + "%</span><br>";
                b += "<span class='blue_text' style='float:left;margin-left:16px;' id='speed_info'>Speed: </span><span class='white_text'>" + Math.floor(100 * d.speed) / 100 + "</span><br>";
                b += "<span class='blue_text' style='float:left;margin-left:16px;' id='weight_info'>Weight: </span><span class='white_text'>" + beauty(d.weight) + "</span><br>";
                b += "<span class='blue_text' style='float:left;margin-left:16px;' id='storage_info'>Storage: </span><span class='white_text'>" + beauty(d.maxStorage) + "</span><br>";
                d.fuel && d.fuel.capitalize();
                b += "</div><br>";
                d.special && (b = b + "<div style='position:relative; left:8px;'><span class='blue_text' style='float:left;margin-left:16px;font-size:120%;'>Special Effects</span><br><br>" + d.special.desc,
                b += "<br></div><br>");
                b += "<div style='position:relative; left:8px;'><span class='blue_text' style='float:left;margin-left:16px;font-size:120%;'>Cost</span><br><br>";
                for (d = 0; d < resNum; d++) {
                    e = ships[parseInt($(this).attr("name"))].cost[d];
                    var g = "blue_text"
                      , n = "white_text";
                    e > currentPlanet.resources[d] && (n = g = "red_text");
                    0 < e && (b += "<span class='" + g + "' style='float:left;margin-left:16px;'>" + resources[d].name.capitalize() + ": </span><span class='" + n + "'>" + beauty(e) + "</span><br>")
                }
                g = "blue_text";
                n = "white_text";
                ships[parseInt($(this).attr("name"))].population > currentPlanet.population && (n = g = "red_text");
                0 < ships[parseInt($(this).attr("name"))].population && (b += "<span class='" + g + "' style='float:left;margin-left:16px;'>Population: </span><span class='" + n + "'>" + beauty(ships[parseInt($(this).attr("name"))].population) + "</span><br>");
                b += "</div><br><br></ul>";
                document.getElementById("shipyard_info_list") && (document.getElementById("shipyard_info_list").innerHTML = b);
                $("#shipyard_info_list").html(b);
                currentShipId = parseInt($(this).attr("name"));
                h("hp_info", "<span class='white_text'>HP is the amount of damage the<br>ship can sustain before<br>being destroyed</span>", 240);
                h("power_info", "<span class='white_text'>Power is the amount of RAW damage<br>the ship can do. It can<br>be boosted by equipping </span><span class='blue_text'>Ammunitions</span>", 240);
                h("piercing_info", "<span class='white_text'>Piercing power is the amount of<br>damage reduction ignored while<br>damaging an enemy ship</span>", 240);
                h("shields_info", "<span class='white_text'>Shields power is the amount of<br>incoming damage that gets<br>totally blocked</span>", 240);
                h("dr_info", "<span class='white_text'>Damage reduction is the percentage<br>of damage absorbed.<br>It can be boosted by equipping </span><span class='blue_text'>Armor</span>", 240);
                h("speed_info", "<span class='white_text'>Speed affects the travelling time of<br>a ship. It also increases power<br>if it is higher than enemy speed,<br>or decreases power if it is lower<br>than the enemy speed.<br>It can be boosted by equipping </span><span class='blue_text'>Engines</span></span>", 240);
                h("weight_info", "<span class='white_text'>Weight affects the power's<br>bonus/malus given by speed. Also,<br>enemies focus damage on higher weight<br>targets</span>", 240);
                h("storage_info", "<span class='white_text'>Storage is the amount of<br>resources that a ship can carry</span>", 240)
            }));
        $("#shipyard_dismantle").unbind();
        $("#shipyard_dismantle").click(function() {
            currentPlanet.sellMultipleStructure(buildingsName.shipyard, 1) || (new w(210,0,"<span class='red_text'>There are no buildings to dismantle!</span>","info")).drawToast();
            aa(currentPlanet)
        });
        $("#shipyard_build").unbind();
        $("#shipyard_build").click(function() {
            currentPlanet.buyMultipleStructure(buildingsName.shipyard, 1) || (new w(210,0,"<span class='red_text'>There are not enough resources!</span>","info")).drawToast();
            aa(currentPlanet)
        });
        h("shipyard_build", currentPlanet.showBuyCost(buildingsName.shipyard, 1));
        h("shipyard_dismantle", currentPlanet.showSellCost(buildingsName.shipyard, 1));
        $("#shipyard_arrow_mini_left").unbind();
        $("#shipyard_arrow_mini_left").click(function() {
            for (var b = !1, d = 0; !b && d < game.planets.length; )
                game.planets[d] == currentPlanet.id ? b = !0 : d++;
            b && aa(planets[game.planets[(d + game.planets.length - 1) % game.planets.length]])
        });
        $("#shipyard_arrow_mini_right").unbind();
        $("#shipyard_arrow_mini_right").click(function() {
            for (var b = !1, d = 0; !b && d < game.planets.length; )
                game.planets[d] == currentPlanet.id ? b = !0 : d++;
            b && aa(planets[game.planets[(d + 1) % game.planets.length]])
        });
        1 < game.planets.length ? ($("#shipyard_arrow_mini_left").show(),
        $("#shipyard_arrow_mini_right").show(),
        $("#market_arrow_mini_left").show(),
        $("#market_arrow_mini_right").show()) : ($("#shipyard_arrow_mini_left").hide(),
        $("#shipyard_arrow_mini_right").hide(),
        $("#market_arrow_mini_left").hide(),
        $("#market_arrow_mini_right").hide());
        y();
        currentUpdater = function() {
            document.getElementById("shipyard_level") && (document.getElementById("shipyard_level").innerHTML = b.structure[buildingsName.shipyard].number);
            document.getElementById("energy_prod") && (document.getElementById("energy_prod").innerHTML = Math.floor(b.energyProduction()));
            document.getElementById("energy_cons") && (document.getElementById("energy_cons").innerHTML = Math.floor(-b.energyConsumption()));
            var e = Math.floor(b.energyProduction() + b.energyConsumption())
              , h = b.energyMalus();
            1 < h ? h = 1 : 0 > h && (h = 0);
            document.getElementById("balance") && (document.getElementById("balance").innerHTML = parseInt(Math.floor(e)));
            document.getElementById("efficiency") && (document.getElementById("efficiency").innerHTML = Math.floor(1E4 * h) / 100 + "%");
            document.getElementById("popul") && (document.getElementById("popul").innerHTML = beauty(b.population) + " " + (0 < b.globalProd.population + b.populationRatio ? "<span class='green_text'>(+" + beauty(b.globalProd.population + b.populationRatio) + "/s)</span>" : "<span class='red_text'>(" + beauty(b.globalProd.population + b.populationRatio) + "/s)</span>"));
            document.getElementById("habitable") && (document.getElementById("habitable").innerHTML = beauty(b.habitableSpace()));
            h = b.rawProduction();
            var g = Array(resNum);
            b.importExport();
            for (e = 0; e < resNum; e++)
                g[e] = b.globalImport[e] - b.globalExport[e];
            for (e = 0; e < resNum; e++)
                if ((resources[e].show(game) || 0 < b.resources[e]) && (resources[e].ship || gameSettings.allShipres)) {
                    var n = beauty(b.resources[e]) + " <span class='" + (0 <= h[e] ? 0 < h[e] ? "green_text" : "gray_text" : "red_text oblique_txt") + "'>(" + (0 < h[e] ? "+" : "") + beauty(h[e]) + "/s)</span>";
                    0 != g[e] && (n += "<span class='" + (0 <= g[e] ? 0 < g[e] ? "purple_text" : "gray_text" : "pink_text oblique_txt") + "'> (" + (0 < g[e] ? "+" : "") + beauty(g[e]) + "/s)</span>");
                    MOBILE_LANDSCAPE && 0 < game.planets.length && 0 != game.totalProd[e] && (n += "<span class='" + (0 <= game.totalProd[e] ? 0 < game.totalProd[e] ? "purple_text" : "gray_text" : "pink_text oblique_txt") + "'> (" + (0 < game.totalProd[e] ? "+" : "") + beauty(game.totalProd[e]) + "/s)</span>");
                    gameSettings.populationEnabled && e == FOOD_RESOURCE && 0 < (b.population - b.sustainable()) / 5E3 && (n += "<span class='gold_text' id='res_name_prod_biomass' name='" + e + "'>(-" + beauty((b.population - b.sustainable()) / 5E3) + "/s)</span>");
                    document.getElementById("res_name_prod_" + e) && (document.getElementById("res_name_prod_" + e).innerHTML = n)
                }
            for (h = 0; h < d.length; h++)
                e = d[h],
                ships[e].req <= currentPlanet.structure[buildingsName.shipyard].number && ships[e].show()
        }
        ;
        currentUpdater();
        K();
        E();
        $("#shipyard_interface").show();
        $("#back_button").unbind();
        $("#back_button").click(B);
        $("#back_button").show();
        game.searchPlanet(currentPlanet.id) && ($("#bottom_build_menu").show(),
        5 <= game.researches[3].level ? ($("#b_market_icon").show(),
        $("#b_shipyard_icon").show()) : (1 <= game.researches[3].level && $("#b_shipyard_icon").show(),
        $("#b_market_icon").hide()))
    }
    function ca() {
        if (MOBILE)
            techMobile();
        else {
            currentUpdater = function() {}
            ;
            currentInterface = "techInterface";
            if (MOBILE_LANDSCAPE) {
                var b = l(0);
                document.getElementById("rp_name") && (document.getElementById("rp_name").innerHTML = b)
            }
            b = "";
            var d = 0
              , e = 0;
            for (D = 0; D < game.researches.length; D++)
                if (game.researches[D].requirement() && game.researches[D].simplyAvailable()) {
                    d = Math.max(d, game.researches[D].pos[1]);
                    e = Math.max(d, game.researches[D].pos[0]);
                    var g = 200 * gameSettings.textSize * gameSettings.techuiScale
                      , m = gameSettings.textSize * gameSettings.techuiScale;
                    b += "<div id='research_snippet_" + D + "' class='menu' style='position:absolute;width:" + g + "px;top:" + (20 + 165 * game.researches[D].pos[1] * m) + "px;left:" + (20 + game.researches[D].pos[0] * (g + 40)) + "px;'>";
                    b += "<img id='line_top_info' src='" + UI_FOLDER + "/" + UI_LINE_RESEARCHES + "' />";
                    b += "<div id='research_snippet_content_" + D + "' style='width:" + g + "px;'>";
                    b += "<div style='width:" + g + "px;text-align:center;font-size:100%;' class='menu_dark blue_text button' >" + game.researches[D].name + "</div>";
                    b += "<img id='line_down_info' src='" + UI_FOLDER + "/" + UI_LINE_RESEARCHES + "' />";
                    b += "<div style='width:" + g + "px;height:" + 100 * m + "px;text-align:center;font-size:80%;' class='menu'>";
                    var u = !0, v = 0, Y;
                    for (Y in game.researches[D].req)
                        if (!game.researches[researchesName[Y]].available() || game.researches[researchesName[Y]].level < game.researches[D].req[Y])
                            u = !1,
                            v++;
                    if (u)
                        game.researches[D].level >= game.researches[D].max ? (b += "<span class='blue_text' style='font-size: 100%;'>Level: " + (game.researches[D].level - game.researches[D].bonusLevel) + (0 < game.researches[D].bonusLevel ? " <span class='green_text'>(+" + game.researches[D].bonusLevel + ") </span>" : " ") + "</span>",
                        b += "<br><br><br><span class='red_text' style='font-size: 100%;'>Max Level Reached!</span>") : (v = u = "",
                        gameSettings.showMultipliers && (v = " (x" + beauty(game.researches[D].mult) + ")",
                        u = " (x" + beauty(game.researches[D].multBonus) + ")"),
                        b += "<span class='blue_text' style='font-size: 100%;height:" + 20 * m + "px;width:" + g + ";'>Lv. " + (game.researches[D].level - game.researches[D].bonusLevel) + (0 < game.researches[D].bonusLevel ? " <span class='green_text'>(+" + game.researches[D].bonusLevel + ") </span>" : "") + "</span><img src='" + UI_FOLDER + "/arrow_small.png' style='width:" + 14 * m + "px;height:" + 14 * m + "px;top:3px;position:relative'/><span class='blue_text' style='font-size: 100%;'> " + (game.researches[D].level - game.researches[D].bonusLevel + 1) + (0 < game.researches[D].bonusLevel ? " <span class='green_text'>(+" + game.researches[D].bonusLevel + ") </span>" : " ") + "</span>",
                        b += "<br><div class='button' style='height:" + 32 * m + "px;width:" + g + ";cursor:pointer;' id='buy_research_" + D + "' name='" + D + "'><span class='blue_text' id='buy_tech_rp_name_" + D + "' style='font-size: 100%;position:relative;top:6px;cursor:pointer;'>Buy with:</span><br><span id='buy_tech_rp_amount_" + D + "' style='position:relative;top:6px;cursor:pointer;' class='white_text'>" + beauty(game.researches[D].cost()) + v + " Res. Pts</span></div>",
                        b += 0 < game.timeTravelNum ? "<div class='button' style='height:" + 32 * m + "px;width:" + g + ";cursor:pointer;' id='buy_tech_" + D + "' name='" + D + "'><span class='green_text' id='buy_tech_tp_name_" + D + "' style='font-size:100%;position:relative;top:6px;height:" + 40 * m + "px;width:" + g + ";cursor:pointer;'>Buy with:</span><br><span id='buy_tech_tp_amount_" + D + "'style='position:relative;top:6px;cursor:pointer;' class='white_text'>" + beauty(game.researches[D].costBonus()) + u + " Tech Pts</span></div>" : "");
                    else {
                        b += "<br><span class='red_text' style='font-size: 100%;'>This research requires:</span>";
                        for (Y = 0; Y < 3 - v; Y++)
                            b += "<br>";
                        for (Y in game.researches[D].req)
                            game.researches[researchesName[Y]].level < game.researches[D].req[Y] && (b += "<span class='red_text' style='font-size:100%;'>" + game.researches[researchesName[Y]].name + " " + game.researches[D].req[Y] + "</span><br>")
                    }
                    b += "</div>";
                    b += "</div>";
                    b += "<img id='line_down_info' src='" + UI_FOLDER + "/" + UI_LINE_RESEARCHES + "' />";
                    b += "</div>";
                    u = {
                        "0,-1": "arrow_down",
                        "1,0": "arrow_small_left",
                        "0,1": "arrow_up",
                        "-1,0": "arrow_small"
                    };
                    for (Y in game.researches[D].req)
                        if (game.researches[researchesName[Y]].requirement()) {
                            v = game.researches[researchesName[Y]].pos[0] - game.researches[D].pos[0];
                            var X = game.researches[researchesName[Y]].pos[1] - game.researches[D].pos[1]
                              , J = v + "," + X;
                            b += "<img src='" + UI_FOLDER + "/" + u[J] + ".png' name='" + J + "' style='width:" + 32 * m + "px;height:" + 32 * m + "px;position:absolute;top:" + (-16 * m + Math.floor(165 * (game.researches[D].pos[1] + .5) * m + 82 * X * m)) + "px;left:" + (-16 * m + Math.floor((game.researches[D].pos[0] + .5) * (40 + g) + v * (g / 2 + 20))) + "px;' />"
                        }
                }
            document.getElementById("tech_t_container") && (document.getElementById("tech_t_container").innerHTML = b);
            $("#tech_t_container").css("height", (185 + 165 * d) * m + "px");
            $("#tech_t_container").css("width", 60 + g + e * g + "px");
            for (var D = 0; D < game.researches.length; D++)
                game.researches[D].requirement() && (h("research_snippet_" + D, "<span class='white_text' style='font-size:70%;'>" + game.researches[D].description() + "</span>", 320),
                game.researches[D].level >= game.researches[D].max ? $("#buy_research_" + D).click(function() {
                    (new w(210,0,"<span class='blue_text text_shadow'>Max Level reached!</span>","info")).drawToast()
                }) : $("#buy_research_" + D).click(function() {
                    game.researches[parseInt($(this).attr("name"))].cost() <= game.researchPoint ? game.researches[parseInt($(this).attr("name"))].enable() : (new w(210,0,"<span class='red_text red_text_shadow'>There are not enough Research Points!</span>","info")).drawToast();
                    ca()
                }),
                0 < game.timeTravelNum && (game.researches[D].level >= game.researches[D].max ? $("#buy_tech_" + D).click(function() {
                    (new w(210,0,"<span class='blue_text text_shadow'>Max Level reached!</span>","info")).drawToast()
                }) : $("#buy_tech_" + D).click(function() {
                    game.researches[parseInt($(this).attr("name"))].costBonus() <= game.techPoints ? game.researches[parseInt($(this).attr("name"))].enableBonus() : (new w(210,0,"<span class='red_text red_text_shadow'>There are not enough Technology Points!</span>","info")).drawToast();
                    ca()
                })));
            currentUpdater = function() {
                for (var b = 0; b < game.researches.length; b++)
                    game.researches[b].requirement() && game.researches[b].level < game.researches[b].max && (game.researches[b].cost() <= game.researchPoint ? ($("#buy_tech_rp_name_" + b).attr("class", "blue_text"),
                    $("#buy_tech_rp_amount_" + b).attr("class", "white_text")) : ($("#buy_tech_rp_name_" + b).attr("class", "red_text"),
                    $("#buy_tech_rp_amount_" + b).attr("class", "red_text")),
                    game.researches[b].costBonus() <= game.techPoints ? ($("#buy_tech_tp_name_" + b).attr("class", "green_text"),
                    $("#buy_tech_tp_amount_" + b).attr("class", "white_text")) : ($("#buy_tech_tp_name_" + b).attr("class", "red_text"),
                    $("#buy_tech_tp_amount_" + b).attr("class", "red_text")));
                MOBILE_LANDSCAPE && (b = l(0),
                document.getElementById("rp_name") && (document.getElementById("rp_name").innerHTML = b))
            }
            ;
            currentUpdater();
            K();
            $("#tech_interface").show();
            $("#back_button").unbind();
            $("#back_button").click(I);
            $("#back_button").show();
            $("#nebula_name").show();
            game.searchPlanet(currentPlanet.id) && ($("#bottom_build_menu").show(),
            5 <= game.researches[3].level ? ($("#b_market_icon").show(),
            $("#b_shipyard_icon").show()) : (1 <= game.researches[3].level && $("#b_shipyard_icon").show(),
            $("#b_market_icon").hide()))
        }
    }
    function P() {
        if (MOBILE)
            techMobile();
        else if (currentUpdater = function() {}
        ,
        gameSettings.techTree)
            ca();
        else {
            currentInterface = "researchInterface";
            var b = "";
            for (J = 0; J < game.researches.length; J++)
                if (game.researches[J].requirement() && game.researches[J].simplyAvailable()) {
                    var d = "blue_text"
                      , e = "white_text"
                      , h = "button"
                      , g = "green_text";
                    game.researches[J].cost() > Math.floor(game.researchPoint) ? (avRes[J] = !1,
                    e = d = "red_text") : (avRes[J] = !0,
                    d = "blue_text",
                    e = "white_text",
                    h = "button",
                    g = "green_text");
                    var l = game.researches[J].description().split("<br>").length;
                    b += "<li id='research" + J + "' name='" + J + "' style='width:1200px; height:" + Math.max(116, 36 + 16 * l) + "px;'>";
                    b += "<div style='position:relative; top:8px; left:8px; width:900px;' id='research_title_" + J + "'>";
                    var m = !0, u = 0, v;
                    for (v in game.researches[J].req)
                        if (!game.researches[researchesName[v]].available() || game.researches[researchesName[v]].level < game.researches[J].req[v])
                            m = !1,
                            u++;
                    b = game.researches[J].level >= game.researches[J].max ? b + ("<span class='blue_text' style='font-size: 100%;'>" + game.researches[J].name + " " + (game.researches[J].level - game.researches[J].bonusLevel) + (0 < game.researches[J].bonusLevel ? " <span class='green_text'>(+" + game.researches[J].bonusLevel + ") </span>" : " ") + "<span class='white_text'>(Max Level)</span></span><span class='" + d + "'>    (Research Points: <span class='" + e + "'>" + beauty(game.researches[J].cost()) + "</span> x" + beauty(game.researches[J].mult) + ")</span>" + (0 < game.timeTravelNum ? "<span class='" + g + "'>    (Technology Points: <span class='" + e + "'>" + beauty(game.researches[J].costBonus()) + "</span> x" + beauty(game.researches[J].multBonus) + ")</span>" : "") + "</div>") : b + ("<span class='blue_text' style='font-size: 100%;'>" + game.researches[J].name + " " + (game.researches[J].level - game.researches[J].bonusLevel) + (0 < game.researches[J].bonusLevel ? " <span class='green_text'>(+" + game.researches[J].bonusLevel + ") </span>" : "") + "</span><img src='" + UI_FOLDER + "/arrow_small.png' style='width:16px;height:16px;top:3px;position:relative'/><span class='blue_text' style='font-size: 100%;'>" + game.researches[J].name + " " + (game.researches[J].level - game.researches[J].bonusLevel + 1) + (0 < game.researches[J].bonusLevel ? " <span class='green_text'>(+" + game.researches[J].bonusLevel + ") </span>" : " ") + "</span><span class='" + d + "'>    (Research Points: <span class='" + e + "'>" + beauty(game.researches[J].cost()) + "</span>)</span>" + (0 < game.timeTravelNum ? "<span class='" + g + "'>    (Technology Points: <span class='" + e + "'>" + beauty(game.researches[J].costBonus()) + "</span> x" + beauty(game.researches[J].multBonus) + ")</span>" : "") + "</div>");
                    b += "<div style='position:relative; top:16px; left:8px; width:768px;height:" + Math.max(80, 16 * l) + "px'>";
                    if (m)
                        b += "<span class='white_text'>" + game.researches[J].description() + "</span></div>",
                        b += "<div style='position:relative;top:-72px; left:700px;width:200px;height:32px;' class='" + h + "' name='" + J + "'  id='buy_research_" + J + "'>",
                        b += "<span class='blue_text' style='position:relative;top:8px;'>Buy with Research Points</span>",
                        b += "</div>",
                        0 < game.timeTravelNum && (b += "<div style='position:relative;top:-72px; left:700px;width:200px;height:32px;'class='" + h + "' name='" + J + "'  id='buy_tech_" + J + "'>",
                        b += "<span class='green_text' style='position:relative;top:8px;'>Buy with Tech Points</span>",
                        b += "</div>");
                    else {
                        b += "<br><span class='red_text' style='font-size: 100%;'>This research requires:</span>";
                        for (v = 0; v < 3 - u; v++)
                            b += "<br>";
                        for (v in game.researches[J].req)
                            game.researches[researchesName[v]].level < game.researches[J].req[v] && (b += "<span class='red_text' style='font-size:100%;'>" + game.researches[researchesName[v]].name + " " + game.researches[J].req[v] + "</span><br>")
                    }
                    b += "</li>"
                }
            b += "<li id='research_empty' style='width:1024px; height:80px;'><div style='position:relative; top:8px; left:8px; width:640px;'></div></li>";
            document.getElementById("research_list") && (document.getElementById("research_list").innerHTML = b);
            for (var J = 0; J < game.researches.length; J++)
                game.researches[J].requirement() && (game.researches[J].level >= game.researches[J].max ? $("#buy_research_" + J).click(function() {
                    (new w(210,0,"<span class='blue_text text_shadow'>Max Level reached!</span>","info")).drawToast()
                }) : $("#buy_research_" + J).click(function() {
                    game.researches[parseInt($(this).attr("name"))].cost() <= game.researchPoint ? game.researches[parseInt($(this).attr("name"))].enable() : (new w(210,0,"<span class='red_text red_text_shadow'>There are not enough Research Points!</span>","info")).drawToast();
                    P()
                }),
                0 < game.timeTravelNum && (game.researches[J].level >= game.researches[J].max ? $("#buy_tech_" + J).click(function() {
                    (new w(210,0,"<span class='blue_text text_shadow'>Max Level reached!</span>","info")).drawToast()
                }) : $("#buy_tech_" + J).click(function() {
                    game.researches[parseInt($(this).attr("name"))].costBonus() <= game.techPoints ? game.researches[parseInt($(this).attr("name"))].enableBonus() : (new w(210,0,"<span class='red_text red_text_shadow'>There are not enough Technology Points!</span>","info")).drawToast();
                    P()
                })));
            currentUpdater = function() {
                for (var b = 0; b < game.researches.length; b++)
                    if (game.researches[b].requirement()) {
                        var d = !1
                          , e = "blue_text"
                          , h = "white_text";
                        game.researches[b].cost() > Math.floor(game.researchPoint) && avRes[b] && (d = !0,
                        avRes[b] = !1,
                        h = e = "red_text");
                        game.researches[b].cost() <= Math.floor(game.researchPoint) && !avRes[b] && (d = !0,
                        avRes[b] = !0,
                        e = "blue_text",
                        h = "white_text");
                        d && ($("#research" + b).length && P(),
                        d = "",
                        d = game.researches[b].level >= game.researches[b].max ? d + ("<span class='blue_text' style='font-size: 100%;'>" + game.researches[b].name + " " + (game.researches[b].level - game.researches[b].bonusLevel) + (0 < game.researches[b].bonusLevel ? " <span class='green_text'>(+" + game.researches[b].bonusLevel + ") </span>" : " ") + "<span class='white_text'>(Max Level)</span></span><span class='" + e + "'>    (Research Points: <span class='" + h + "'>" + beauty(game.researches[b].cost()) + "</span>)</span>" + (0 < game.timeTravelNum ? "<span class='" + g + "'>    (Technology Points: <span class='" + h + "'>" + beauty(game.researches[b].costBonus()) + "</span> x" + beauty(game.researches[b].multBonus) + ")</span>" : "")) : d + ("<span class='blue_text' style='font-size: 100%;'>" + game.researches[b].name + " " + (game.researches[b].level - game.researches[b].bonusLevel) + (0 < game.researches[b].bonusLevel ? " <span class='green_text'>(+" + game.researches[b].bonusLevel + ") </span>" : "") + "</span><img src='" + UI_FOLDER + "/arrow_small.png' style='width:16px;height:16px;top:3px;position:relative'/><span class='blue_text' style='font-size: 100%;'>" + game.researches[b].name + " " + (game.researches[b].level - game.researches[b].bonusLevel + 1) + (0 < game.researches[b].bonusLevel ? " <span class='green_text'>(+" + game.researches[b].bonusLevel + ") </span>" : " ") + "</span><span class='" + e + "'>    (Research Points: <span class='" + h + "'>" + beauty(game.researches[b].cost()) + "</span>)</span>" + (0 < game.timeTravelNum ? "<span class='" + g + "'>    (Technology Points: <span class='" + h + "'>" + beauty(game.researches[b].costBonus()) + "</span> x" + beauty(game.researches[b].multBonus) + ")</span>" : "")),
                        document.getElementById("research_title_" + b) && (document.getElementById("research_title_" + b).innerHTML = d))
                    }
            }
            ;
            currentUpdater();
            K();
            $("#research_interface").show();
            $("#back_button").unbind();
            $("#back_button").click(I);
            $("#back_button").show();
            game.searchPlanet(currentPlanet.id) && ($("#bottom_build_menu").show(),
            5 <= game.researches[3].level ? ($("#b_market_icon").show(),
            $("#b_shipyard_icon").show()) : (1 <= game.researches[3].level && $("#b_shipyard_icon").show(),
            $("#b_market_icon").hide()))
        }
    }
    function L(b, d) {
        var e = Date.now()
          , g = d || gameSettings.mapzoomlevel;
        currentInterface = "mapInterface";
        currentNebula = b;
        currentUpdater = function() {}
        ;
        $("#map_image").attr("src", "" + IMG_FOLDER + "/nebula/" + b.icon);
        MAP_IMAGE_ZOOM && ($("#map_image").css("width", b.width / gameSettings.mapzoomlevel + "px"),
        $("#map_image").css("height", b.height / gameSettings.mapzoomlevel + "px"));
        if (MAP_REGIONS) {
            var l = ""
              , n = "red blu orange gray green yellow magenta cream".split(" ")
              , m = n[Math.floor(Math.random() * n.length)]
              , u = m = "gray";
            for (n = 0; n < regionsDefinition.length; n++) {
                if (regionsDefinition[n].capital && null != planets[regionsDefinition[n].capital].civis && civis[planets[regionsDefinition[n].capital].civis].color) {
                    m = regionColor(regionsDefinition[n]).first;
                    var Ca = regionColor(regionsDefinition[n]).second;
                    u = "no" != Ca ? Ca : m;
                    "croatia" == regionsDefinition[n].name && console.log(m + " " + Ca)
                } else
                    u = m = "gray";
                l += "<img id='region_" + n + "' name='" + n + "' style='position:absolute;top:" + Math.floor(regionsDefinition[n].y / gameSettings.mapzoomlevel) + "px;left:" + Math.floor(regionsDefinition[n].x / gameSettings.mapzoomlevel) + "px;width:" + Math.ceil(regionsDefinition[n].width / gameSettings.mapzoomlevel) + "px;height:" + Math.ceil(regionsDefinition[n].height / gameSettings.mapzoomlevel) + "px' src='" + IMG_FOLDER + "/" + REGIONS_FOLDER + "/" + m + "_" + regionsDefinition[n].icon + "' />";
                m != u && (l += "<img id='region_stripe_" + n + "' name='" + n + "' style='position:absolute;top:" + Math.floor(regionsDefinition[n].y / gameSettings.mapzoomlevel) + "px;left:" + Math.floor(regionsDefinition[n].x / gameSettings.mapzoomlevel) + "px;width:" + Math.ceil(regionsDefinition[n].width / gameSettings.mapzoomlevel) + "px;height:" + Math.ceil(regionsDefinition[n].height / gameSettings.mapzoomlevel) + "px' src='" + IMG_FOLDER + "/" + REGIONS_FOLDER + "/" + u + "_striped_" + regionsDefinition[n].icon + "' />")
            }
            $("#map_region_container").html(l)
        }
        l = "<img id='map_zoom_m' style='position:relative;top:8px;width:32px;height:32px;cursor:pointer;' src='" + UI_FOLDER + "/zoomm.png'/>";
        1 < game.mapsLength() && (l += "<img id='map_arrow_left' style='position:relative;top:4px;width:20px;height:20px;cursor:pointer;' src='" + UI_FOLDER + "/arrow_small_left.png'/>");
        l += b.name;
        1 < game.mapsLength() && (l += "<img id='map_arrow_right' style='position:relative;top:4px;width:20px;height:20px;cursor:pointer;' src='" + UI_FOLDER + "/arrow_small.png'/>");
        l += "<img id='map_zoom_p' style='position:relative;top:8px;width:32px;height:32px;cursor:pointer;' src='" + UI_FOLDER + "/zoomp.png'/>";
        document.getElementById("nebula_name") && (document.getElementById("nebula_name").innerHTML = l);
        $("#map_arrow_left").click(function() {
            var d = (b.id + nebulas.length - 1) % game.mapsLength();
            L(nebulas[d], gameSettings.mapzoomlevel)
        });
        $("#map_arrow_right").click(function() {
            var d = (b.id + 1) % game.mapsLength();
            L(nebulas[d], gameSettings.mapzoomlevel)
        });
        $("#map_zoom_p").click(function() {
            gameSettings.mapzoomlevel >= MAP_ZOOM_MIN && (gameSettings.mapzoomlevel -= MAP_ZOOM_STEP);
            gameSettings.mapzoomlevel < MAP_ZOOM_MIN && (gameSettings.mapzoomlevel = MAP_ZOOM_MIN);
            L(b, gameSettings.mapzoomlevel)
        });
        $("#map_zoom_m").click(function() {
            gameSettings.mapzoomlevel <= MAP_ZOOM_MAX && (gameSettings.mapzoomlevel += MAP_ZOOM_STEP);
            gameSettings.mapzoomlevel > MAP_ZOOM_MAX && (gameSettings.mapzoomlevel = MAP_ZOOM_MAX);
            L(b, gameSettings.mapzoomlevel)
        });
        l = "";
        var v = Array(b.planets.length);
        for (n = 0; n < b.planets.length; n++) {
            var D = "pnebula_gray_text";
            game.searchPlanet(b.planets[n]) && (D = "pnebula_text");
            game.searchPlanet(b.planets[n]) || null == planets[b.planets[n]].civis || (D = "pnebula_red_text");
            u = m = 1E12;
            m = b.planets[n];
            planets[game.capital].shortestPath[m] ? u = planets[game.capital].shortestPath[m].hops : HORIZONS && (planets[planetsName.solidad].shortestPath[m] ? u = planets[game.capital].shortestPath[planetsName.xora].hops + planets[planetsName.solidad].shortestPath[m].hops : planets[planetsName.xirandrus].shortestPath[m] && (u = planets[game.capital].shortestPath[planetsName.xora].hops + planets[planetsName.solidad].shortestPath[planetsName.volor].hops + planets[planetsName.xirandrus].shortestPath[m].hops));
            planets[b.planets[0]].shortestPath[b.planets[n]] && (m = planets[b.planets[0]].shortestPath[b.planets[n]].hops,
            m += 11 * b.id);
            m = u;
            Ca = u = 0;
            MAP_REGIONS && (Ca = -6,
            u = -4);
            if (m <= game.researches[researchesName[MAP_ENABLING_RESEARCH]].level) {
                l += "<div id='pdiv" + n + "' name='" + b.planets[n] + "' style='cursor: pointer;position:absolute;top:" + (u + planets[b.planets[n]].y) / g + "px;left:" + (Ca + planets[b.planets[n]].x) / g + "px;z-index:20;height:" + 24 / g + "px;' class='" + D + "'>";
                MAP_REGIONS && "switch" == planets[b.planets[n]].region || (l += "<img style='width:" + Math.min(MAP_PLANET_ICON_SIZE / g, MAP_PLANET_ICON_SIZE) + "px;height:" + Math.min(MAP_PLANET_ICON_SIZE / g, MAP_PLANET_ICON_SIZE) + "px;position:relative;left:-" + MAP_PLANET_ICON_SIZE / 3.42 / g + "px;top:-" + MAP_PLANET_ICON_SIZE / 3.42 / g + "px;' id='pnebula" + b.planets[n] + "' src='" + IMG_FOLDER + "/" + planets[b.planets[n]][PLANET_IMG_FIELD] + (1 == PLANET_FOLDER_DOUBLE ? "/" + planets[b.planets[n]][PLANET_IMG_FIELD] : "") + ".png' />");
                if (MAP_SHOW_PLANETS_NAME || 1 > g)
                    l += "<span style='position:relative; left:-" + 8 / g + "px;top:-" + .75 * MAP_PLANET_ICON_SIZE / g + "px;cursor:pointer;'>" + planets[b.planets[n]].name + "</span>";
                l += "</div>"
            }
            v[n] = Array(planets[b.planets[n]].routes.length);
            for (D = 0; D < planets[b.planets[n]].routes.length; D++)
                if (planets[b.planets[n]].routes[D].planet1 == planets[b.planets[n]].id && "sea" != planets[b.planets[n]].routes[D].type) {
                    var y = planets[b.planets[n]].routes[D].cx()
                      , Ea = planets[b.planets[n]].routes[D].cy()
                      , va = parseInt(planets[b.planets[n]].routes[D].distance() * distanceBon);
                    v[n][D] = va;
                    if (m <= game.researches[researchesName[MAP_ENABLING_RESEARCH]].level) {
                        var Da = game.capital;
                        1 == b.id && (Da = planetsName.solidad);
                        2 == b.id && (Da = planetsName.xirandrus);
                        Da = Math.max(planets[Da].shortestPath[planets[b.planets[n]].routes[D].planet1].hops, planets[Da].shortestPath[planets[b.planets[n]].routes[D].planet2].hops);
                        1 == b.id && (Da += 11);
                        2 == b.id && (Da += 19);
                        Da <= researches[researchesName[MAP_ENABLING_RESEARCH]].level && (y = 180 * Math.atan(Ea / y) / Math.PI,
                        0 > Ea && 0 > y && (y += 180),
                        l += "<div id='route" + n + "_" + D + "' name='" + n + "_" + D + "' style='position:absolute;top:" + parseInt((8 + u + planets[b.planets[n]].y) / g) + "px;left:" + parseInt((12 + Ca + planets[b.planets[n]].x) / g) + "px;z-index:8;'>",
                        l += "<img src='" + UI_FOLDER + "/" + UI_LINE_ROUTE + "' style='width:" + va / g + "px;height:" + UI_ROUTE_LINE_HEIGHT + "px;-ms-transform:rotate(" + y + "deg);-webkit-transform:rotate(" + y + "deg);transform:rotate(" + y + "deg);transform-origin: top left;' /></div>")
                    }
                }
        }
        document.getElementById("map_icon_container") && (document.getElementById("map_icon_container").innerHTML = l);
        for (n = 0; n < b.planets.length; n++)
            if ($("#pdiv" + n).click(function() {
                C(planets[parseInt($(this).attr("name"))])
            }),
            !MOBILE)
                for (g = planets[b.planets[n]],
                l = "",
                MAP_SHOW_PLANETS_NAME_HOVER && (l += "<span class='blue_text'>" + LOCALE_PLANET_NAME.capitalize() + " name: </span><span class='white_text'>" + g.name + "</span><br>"),
                g.civis && (l += "<span class='blue_text'>" + LOCALE_CIVILIZATION_NAME.capitalize() + ": </span><span class='white_text'>" + civis[g.civis].name + "</span><br>"),
                MAP_REGIONS && g.region && (l += "<span class='blue_text'>Region: </span><span class='white_text'>" + regionsDefinition[regionsName[g.region]].name + "</span><br>"),
                l += uiScheduler.planetPhysicsInfo(g),
                h("pdiv" + n, l, 200),
                D = 0; D < planets[b.planets[n]].routes.length; D++)
                    $("#route" + n + "_" + D).hover(function() {
                        var b = $(this).attr("name").split("_")
                          , d = parseInt(b[0]);
                        b = parseInt(b[1]);
                        var e = "<span class='blue_text'>Distance: </span><span class='white_text'>" + parseInt(Math.floor(v[d][b])) + "</span><br>";
                        e += "<span class='blue_text'>Time (0.3): </span><span class='white_text'>" + parseInt(Math.floor(v[d][b] / .3)) + "s</span><br>";
                        e += "<span class='blue_text'>Time (0.5): </span><span class='white_text'>" + parseInt(Math.floor(v[d][b] / .5)) + "s</span><br>";
                        e += "<span class='blue_text'>Time (0.8): </span><span class='white_text'>" + parseInt(Math.floor(v[d][b] / .8)) + "s</span><br>";
                        e += "<span class='blue_text'>Time (1.2): </span><span class='white_text'>" + parseInt(Math.floor(v[d][b] / 1.2)) + "s</span><br>";
                        e += "<span class='blue_text'>Time (2.0): </span><span class='white_text'>" + parseInt(Math.floor(v[d][b] / 2)) + "s</span>";
                        (new w(170,10,e,"info")).drawInfo();
                        $(document).on("mousemove", function(b) {
                            mouseX = b.pageX + 10;
                            mouseY = b.pageY + 10;
                            $("#popup_info").css({
                                left: mouseX,
                                top: mouseY
                            })
                        });
                        $("#popup_info").css({
                            left: mouseX,
                            top: mouseY
                        })
                    }, function() {
                        currentPopup.drop()
                    }),
                    $("#route" + n + "_" + D).mouseout(function() {
                        $(document).on("mousemove", function() {})
                    });
        K();
        $("#map_interface").show();
        $("#nebula_name").show();
        $("#back_button").unbind();
        $("#back_button").click(I);
        $("#back_button").show();
        n = Date.now();
        console.log("Map loading time: " + (n - e) + "ms")
    }
    function la(b, d, e, g, h, l) {
        return "all" == d || d == g ? "hub" != h && 0 >= e.shipNum() || !game.searchPlanet(g) && !l && e.civis != game.id ? !1 : "all" == b ? "hub" == e.fleetType() && 0 == game.timeTravelNum ? !1 : !0 : "attack" == b && "hub" != h || "merge" == b && "hub" != h && e.civis == game.id || "nowar" == b && "hub" != h && "War Fleet" != e.fleetType() && "Scout Fleet" != e.fleetType() ? !0 : "hub" == b ? "hub" != h || 2 > game.planets.length || e.civis != game.id ? !1 : !0 : "cargo" == b && "hub" == h && 0 < e.shipNum() && 4 > game.planets.length && 0 == game.timeTravelNum ? !0 : "hub" != b && "hub" == h ? !1 : "war" == b && ("War Fleet" == e.fleetType() || "Scout Fleet" == e.fleetType()) || "miner" == b && "Miner Fleet" == e.fleetType() || "cargo" == b && ("Cargo Fleet" == e.fleetType() || "Colonial Fleet" == e.fleetType()) ? !0 : !1 : !1
    }
    function S(b) {
        currentInterface = "shipInterface";
        var d = b.t;
        b = b.p;
        currentCriteria = {
            t: d,
            p: b
        };
        void 0 == currentCriteria && (currentCriteria = {
            t: "nowar",
            p: "all"
        });
        for (var e = 0, g = "", n = 0; n < planets.length; n++) {
            var l = !1, u;
            for (u in planets[n].fleets)
                planets[n].fleets[u] && planets[n].fleets[u].civis == game.id && 0 != u && (l = !0);
            for (var v in planets[n].fleets) {
                if (la(d, b, planets[n].fleets[v], n, v, l)) {
                    g += "<li id='fleet" + n + "_" + v + "' name='" + n + "_" + v + "' style='height:13%;' class='button'>";
                    g += "<div style='width:98%; height:80px;position:relative;'>";
                    g += "<div style='position:relative; top:8px; left:8px'>";
                    var y = planets[n].fleets[v].name;
                    "hub" == v && (y = planets[n].name + " Hub Fleet");
                    if (planets[n].fleets[v].civis != game.id) {
                        var J = "red_text"
                          , D = "[Enemy] ";
                        game.reputation[planets[n].fleets[v].civis] >= repLevel.allied.min ? (J = "green_text",
                        D = "[Allied] ") : game.reputation[planets[n].fleets[v].civis] >= repLevel.friendly.min ? (J = "white_text",
                        D = "[Friendly] ") : game.reputation[planets[n].fleets[v].civis] >= repLevel.neutral.min && (J = "gray_text",
                        D = "[Neutral] ");
                        g += "<span class='" + J + "' style='font-size: 100%;'>" + D + y + "</span>"
                    } else
                        g += "<span class='blue_text' style='font-size: 100%;'>" + y + " </span>",
                        g += "<img id='b_rename_icon_" + n + "_" + v + "' name='" + n + "_" + v + "' src='" + UI_FOLDER + "/RENAME.png' style='width:16px;height:16px;position:relative;top:3px;cursor:pointer;'/>";
                    g += "<span class='white_text'> orbiting </span><span class='blue_text' style='font-size: 100%;cursor:pointer;' id='orbiting_" + n + "_" + v + "' name='" + n + "'>" + planets[n].name + "</span></div>";
                    if (game.id == planets[n].fleets[v].civis && "hub" != v) {
                        g = MOBILE_LANDSCAPE ? g + ("<div id='quick_fleet_menu_" + n + "_" + v + "' style='position:absolute;left:5%;bottom:10%'>") : g + ("<div id='quick_fleet_menu_" + n + "_" + v + "' style='position:absolute;right:10%;bottom:10%'>");
                        var x = "icon";
                        MOBILE_LANDSCAPE && (x = "icon_big");
                        game.searchPlanet(n) && (g += "<img id='b_load_icon_" + n + "_" + v + "' name='" + n + "_" + v + "' src='" + UI_FOLDER + "/load.png' class='" + x + "' style='cursor:pointer;'/>",
                        g += "<img id='b_unload_icon_" + n + "_" + v + "' name='" + n + "_" + v + "' src='" + UI_FOLDER + "/unload.png' class='" + x + "' style='cursor:pointer;'/>");
                        g += "<img id='b_merge_icon_" + n + "_" + v + "' name='" + n + "_" + v + "' src='" + UI_FOLDER + "/merge.png' class='" + x + "' style='cursor:pointer;'/>";
                        g += "<img id='b_divide_icon_" + n + "_" + v + "' name='" + n + "_" + v + "' src='" + UI_FOLDER + "/divide.png' class='" + x + "' style='cursor:pointer;'/>";
                        g += "<img id='b_move_icon_" + n + "_" + v + "' name='" + n + "_" + v + "' src='" + UI_FOLDER + "/move.png' class='" + x + "' style='cursor:pointer;'/>";
                        game.searchPlanet(n) && (SHARED_RESOURCES || (g += "<img id='b_automove_icon_" + n + "_" + v + "' name='" + n + "_" + v + "' src='" + UI_FOLDER + "/automove.png' class='" + x + "' style='cursor:pointer;'/>"),
                        SHARED_RESOURCES || (g += "<img id='b_delivery_icon_" + n + "_" + v + "' name='" + n + "_" + v + "' src='" + UI_FOLDER + "/delivery.png' class='" + x + "' style='cursor:pointer;'/>"),
                        g += "<img id='b_void_ship_icon' src='" + UI_FOLDER + "/void.png' class='" + x + "' style='cursor:pointer;'/>",
                        g += "<img id='b_dismantle_ship_icon_" + n + "_" + v + "' name='" + n + "_" + v + "' src='" + UI_FOLDER + "/x_red.png' class='" + x + "' style='cursor:pointer;'/>");
                        g += "</div>"
                    } else
                        "hub" == v && (g += "<div id='quick_fleet_menu_" + n + "_" + v + "' style='position:absolute;right:10%;bottom:10%'>",
                        g += "<img id='b_divide_icon_" + n + "_" + v + "' name='" + n + "_" + v + "' src='" + UI_FOLDER + "/divide.png' class='" + x + "' style='cursor:pointer;'/>",
                        g += "</div>");
                    g += "</div>";
                    g += "</li>";
                    e++
                }
                0 < v && 0 == planets[n].fleets[v].shipNum() && "hub" != v && delete planets[n].fleets[v]
            }
        }
        0 == e && (g += "<li id='nofleet' style='height:80px;' class='button'><div style='width:98%; height:80px;position:relative;'><div style='text-align:center;position:relative; top:8px; left:8px'><span class='gray_text' style='font-size: 100%;'>There are no fleets to show</span> </li>");
        document.getElementById("ship_list") && (document.getElementById("ship_list").innerHTML = g);
        for (n = 0; n < planets.length; n++) {
            l = !1;
            for (u in planets[n].fleets)
                planets[n].fleets[u].civis == game.id && (l = !0);
            for (v in planets[n].fleets)
                (game.searchPlanet(n) || game == civis[planets[n].fleets[v].civis] || l) && ("hub" == v || 0 < planets[n].fleets[v].shipNum()) && (0 != v && ($("#orbiting_" + n + "_" + v).unbind(),
                $("#orbiting_" + n + "_" + v).click(function() {
                    var b = parseInt($(this).attr("name"));
                    C(planets[b])
                }),
                "hub" != v && ($("#b_move_icon_" + n + "_" + v).click(function() {
                    currentFleetId = $(this).attr("name");
                    var b = currentFleetId.split("_")[0];
                    L(nebulas[planets[b].map]);
                    for (b = 0; b < currentNebula.planets.length; b++)
                        $("#pdiv" + b).unbind(),
                        $("#pdiv" + b).click(function() {
                            var b = currentFleetId.split("_")
                              , d = b[0]
                              , e = planets[d].fleets[b[1]];
                            e.type = "normal";
                            parseInt(d) != parseInt($(this).attr("name")) ? (e = e.move(parseInt(d), parseInt($(this).attr("name"))),
                            delete planets[d].fleets[b[1]],
                            document.getElementById("ship_info_list") && (document.getElementById("ship_info_list").innerHTML = ""),
                            S(currentCriteria),
                            b = 0,
                            60 <= e ? b = "" + parseInt(Math.floor(e / 60)) + " minutes and " + parseInt(Math.floor(e % 60)) + " seconds" : 0 > e ? (d = new w(210,0,"<span class='red_text red_text_shadow'>Already on this planet!</span>","info"),
                            d.drawToast()) : b = "" + parseInt(Math.floor(e)) + " seconds",
                            d = new w(210,0,"<span class='red_text red_text_shadow'>Fleet will arrive in " + b + "</span>","info")) : d = new w(210,0,"<span class='red_text red_text_shadow'>Already on this planet!</span>","info");
                            d.drawToast()
                        })
                }),
                game.searchPlanet(n) && ($("#b_automove_icon_" + n + "_" + v).click(function() {
                    currentFleetId = $(this).attr("name");
                    var b = currentFleetId.split("_")[0];
                    L(nebulas[planets[b].map]);
                    for (b = 0; b < currentNebula.planets.length; b++)
                        $("#pdiv" + b).unbind(),
                        $("#pdiv" + b).click(function() {
                            if (planets[parseInt($(this).attr("name"))].civis == game.id) {
                                var b = currentFleetId.split("_")
                                  , d = b[0]
                                  , e = planets[d].fleets[b[1]];
                                parseInt(d) != parseInt($(this).attr("name")) ? da(e, parseInt(d), parseInt($(this).attr("name")), parseInt(b[1])) : (b = new w(210,0,"<span class='red_text red_text_shadow'>Already on this planet!</span>","info"),
                                b.drawToast())
                            } else
                                b = new w(210,0,"<span class='red_text red_text_shadow'>This is an enemy planet!</span>","info"),
                                b.drawToast()
                        })
                }),
                $("#b_delivery_icon_" + n + "_" + v).click(function() {
                    currentFleetId = $(this).attr("name");
                    var b = currentFleetId.split("_")[0];
                    L(nebulas[planets[b].map]);
                    (new w(210,0,"<span class='blue_text text_shadow'>Select the delivery's destination</span>","info")).drawToast();
                    for (b = 0; b < currentNebula.planets.length; b++)
                        $("#pdiv" + b).unbind(),
                        $("#pdiv" + b).click(function() {
                            if (planets[parseInt($(this).attr("name"))].civis == game.id) {
                                var b = currentFleetId.split("_")
                                  , d = b[0]
                                  , e = planets[d].fleets[b[1]];
                                e.type = "delivery";
                                parseInt(d) != parseInt($(this).attr("name")) ? (e = e.move(parseInt(d), parseInt($(this).attr("name"))),
                                delete planets[d].fleets[b[1]],
                                document.getElementById("ship_info_list") && (document.getElementById("ship_info_list").innerHTML = ""),
                                S(currentCriteria),
                                b = 0,
                                60 <= e ? b = "" + parseInt(Math.floor(e / 60)) + " minutes and " + parseInt(Math.floor(e % 60)) + " seconds" : 0 >= e ? (d = new w(210,0,"<span class='red_text red_text_shadow'>Already on this planet!</span>","info"),
                                d.drawToast()) : b = "" + parseInt(Math.floor(e)) + " seconds",
                                d = new w(210,0,"<span class='blue_text text_shadow'>Fleet will arrive in " + b + "</span>","info")) : d = new w(210,0,"<span class='red_text red_text_shadow'>Already on this planet!</span>","info")
                            } else
                                d = new w(210,0,"<span class='red_text red_text_shadow'>This is an enemy planet!</span>","info");
                            d.drawToast()
                        })
                }),
                $("#b_dismantle_ship_icon_" + n + "_" + v).unbind(),
                $("#b_dismantle_ship_icon_" + n + "_" + v).click(function() {
                    currentFleetId = $(this).attr("name");
                    (new w(210,120,"<br><span class='red_text'>Are you sure you want to dismantle this fleet?</span>","confirm",function() {
                        var b = currentFleetId.split("_")
                          , d = parseInt(b[0])
                          , e = planets[d].fleets[b[1]];
                        e.unload(d);
                        for (var g = 0; g < ships.length; g++) {
                            for (var h = 0; h < resNum; h++)
                                planets[d].resourcesAdd(h, ships[g].cost[h] * e.ships[g] / 2);
                            e.ships[g] = 0
                        }
                        delete planets[d].fleets[b[1]];
                        document.getElementById("ship_info_list") && (document.getElementById("ship_info_list").innerHTML = "");
                        currentPopup.drop();
                        S(currentCriteria)
                    }
                    )).draw()
                })))),
                game.searchPlanet(n) && "hub" != v && ($("#b_load_icon_" + n + "_" + v).click(function() {
                    currentFleetId = $(this).attr("name");
                    var b = $(this).attr("name").split("_")
                      , d = b[0];
                    b = planets[d].fleets[b[1]];
                    b.planet = d;
                    (new w(768,374,"<br><span class='blue_text text_shadow'>Select the amount of resources</span><br>","loadShip",b)).draw()
                }),
                $("#b_unload_icon_" + n + "_" + v).click(function() {
                    var b = $(this).attr("name").split("_")
                      , d = b[0];
                    b = planets[d].fleets[b[1]];
                    currentFleetId = $(this).attr("name");
                    b.unload(d);
                    (new w(210,0,"<span class='blue_text text_shadow'>Fleet unloaded on " + planets[d].name + "</span>","info")).drawToast()
                })),
                $("#b_merge_icon_" + n + "_" + v).click(function() {
                    currentFleetId = $(this).attr("name");
                    (new w(210,0,"<span class='blue_text text_shadow'>Select the Fleet to join</span>","info")).drawToast();
                    var b = currentFleetId.split("_")[0];
                    oldCriteria = currentCriteria;
                    S({
                        t: "merge",
                        p: parseInt(b)
                    });
                    for (var d in planets[b].fleets)
                        (game.searchPlanet(b) || game == civis[planets[b].fleets[d].civis]) && ("hub" == v || 0 < planets[b].fleets[d].shipNum()) ? ($("#fleet" + b + "_" + d).unbind(),
                        $("#fleet" + b + "_" + d).click(function() {
                            var b = $(this).attr("name").split("_")
                              , d = b[0]
                              , e = planets[d].fleets[b[1]]
                              , g = currentFleetId.split("_")
                              , h = g[0]
                              , n = planets[h].fleets[g[1]];
                            d != h ? b = new w(210,0,"<span class='red_text red_text_shadow'>Fleets are orbiting different planets! Can't merge them.</span>","info") : b[1] == g[1] ? b = new w(210,0,"<span class='red_text red_text_shadow'>Can't merge with itself</span>","info") : (e.fusion(n),
                            delete planets[h].fleets[g[1]],
                            b = new w(210,0,"<span class='blue_text text_shadow'>Fleets merged</span>","info"));
                            b.drawToast();
                            S(oldCriteria)
                        })) : ($("#fleet" + b + "_" + d).unbind(),
                        $("#fleet" + b + "_" + d).click(function() {
                            (new w(210,0,"<span class='red_text red_text_shadow'>Can't merge with this fleet!</span>","info")).drawToast()
                        }))
                }),
                $("#b_divide_icon_" + n + "_" + v).click(function() {
                    currentFleetId = $(this).attr("name");
                    for (var b = $(this).attr("name").split("_"), d = planets[b[0]].fleets[b[1]], e = b = 0; e < ships.length; e++)
                        0 < d.ships[e] && b++;
                    d = new w(420,Math.min(64 + 20 * b, 240),"<br><span class='blue_text text_shadow'>Select the number of ships</span><br>","fleetDivide",d);
                    console.log(b);
                    d.draw();
                    S(currentCriteria);
                    document.getElementById("ship_info_list") && (document.getElementById("ship_info_list").innerHTML = "")
                }),
                "hub" != v && $("#b_rename_icon_" + n + "_" + v).click(function() {
                    currentFleetId = $(this).attr("name");
                    var b = $(this).attr("name").split("_");
                    (new w(360,140,"<br><span class='blue_text text_shadow'>Type the new name</span><br>","renameFleet",planets[b[0]].fleets[b[1]])).draw()
                }))
        }
        uiScheduler.fleetMenu();
        for (n = 0; n < planets.length; n++) {
            l = !1;
            for (u in planets[n].fleets)
                planets[n].fleets[u].civis == game.id && (l = !0);
            for (v in planets[n].fleets)
                (game.searchPlanet(n) || game == civis[planets[n].fleets[v].civis] || l) && ("hub" == v || 0 < planets[n].fleets[v].shipNum()) && ($("#fleet" + n + "_" + v).unbind(),
                $("#fleet" + n + "_" + v).click(function() {
                    var b = $(this).attr("name").split("_")
                      , d = b[0]
                      , e = planets[d].fleets[b[1]]
                      , g = uiScheduler.fleetInfo(d, b[1], e)
                      , n = g.html
                      , l = g.cnt;
                    $("#ship_infolist_placeholder").css("height", "" + (1024 + 16 * l) + "px");
                    if (game == civis[e.civis]) {
                        e.hp();
                        e.armor();
                        e.power();
                        new m("conquer_button","Colonize " + planets[d].name,-1,40,function() {
                            var b = currentFleetId.split("_")
                              , d = b[0];
                            b = planets[d].fleets[b[1]];
                            var e = 200 * planets[d].structure[buildingsName.turret].number + 500 * planets[d].structure[buildingsName.laser].number
                              , g = 250 * planets[d].structure[buildingsName.pierturret].number
                              , h = 150 * planets[d].structure[buildingsName.turret].number + 100 * planets[d].structure[buildingsName.laser].number + 100 * planets[d].structure[buildingsName.pierturret].number + 1E3 * planets[d].structure[buildingsName.shieldturret].number
                              , n = 1E3 * planets[d].structure[buildingsName.turret].number + 2E3 * planets[d].structure[buildingsName.laser].number + 1E3 * planets[d].structure[buildingsName.pierturret].number + 5E3 * planets[d].structure[buildingsName.shieldturret].number;
                            e = (b.hp() + 1) / (g + e + b.armor() * e / (g + e + .01) + .01);
                            if ((n + 1) / (1.1 * b.power() - h + .01) < e) {
                                h = !1;
                                for (n = 0; !h && n < civis[planets[d].civis].planets.length; )
                                    civis[planets[d].civis].planets[n] == d ? h = !0 : n++;
                                h ? (civis[planets[d].civis].planets.splice(n, 1),
                                civis[planets[d].civis].capital == d && 0 < civis[planets[d].civis].planets.length && (civis[planets[d].civis].capital = civis[planets[d].civis].planets[0]),
                                setRep(planets[d].civis, game.id, repLevel.hostile.min),
                                planets[d].civis = b.civis,
                                game.pushPlanet(d),
                                save(),
                                submitNumber("Number of planets", game.planets.length),
                                submitNumber("Infuence", game.influence()),
                                currentPlanet = planets[d],
                                C(currentPlanet),
                                pop = new w(210,96,"<br><span class='blue_text text_shadow'>" + planets[d].name + " has been conquered!</span>","Ok")) : pop = new w(210,96,"<br><span class='blue_text text_shadow'>ERROR 168!</span>","Ok")
                            } else
                                pop = new w(210,96,"<br><span class='blue_text text_shadow'>Your fleet has been destroyed!</span>","Ok");
                            pop.draw()
                        }
                        );
                        var u = new m("colonize_button","Colonize " + planets[d].name,-1,40,function() {
                            var b = currentFleetId.split("_")
                              , d = parseInt(b[0])
                              , e = planets[d].fleets[b[1]]
                              , g = 0;
                            e.unload(d);
                            for (var h = 0; h < ships.length; h++)
                                "Colonial Ship" == ships[h].type && 0 < e.ships[h] ? (planets[d].resources[resourcesName.iron.id] += .5 * ships[h].cost[resourcesName.iron.id] * e.ships[h],
                                planets[d].resources[resourcesName.steel.id] += .5 * ships[h].cost[resourcesName.steel.id] * e.ships[h],
                                planets[d].resources[resourcesName.titanium.id] += .5 * ships[h].cost[resourcesName.titanium.id] * e.ships[h],
                                planets[d].resources[resourcesName.robots.id] += .5 * ships[h].cost[resourcesName.robots.id] * e.ships[h],
                                planets[d].resources[resourcesName.nanotubes.id] += .5 * ships[h].cost[resourcesName.nanotubes.id] * e.ships[h],
                                e.ships[h] = 0) : g++;
                            0 == g && delete planets[d].fleets[b[1]];
                            document.getElementById("ship_info_list") && (document.getElementById("ship_info_list").innerHTML = "");
                            planets[d].civis && (civis[planets[d].civis].removePlanet(d),
                            setRep(planets[d].civis, game.id, repLevel.hostile.min));
                            planets[d].civis = e.civis;
                            planets[d].fleets[0].civis = e.civis;
                            game.pushPlanet(d);
                            save();
                            submitNumber("Number of planets", game.planets.length);
                            submitNumber("Infuence", game.influence());
                            currentPlanet = planets[d];
                            C(currentPlanet);
                            pop = new w(210,96,"<br><span class='blue_text text_shadow'>" + planets[d].name + " has been colonized!</span>","Ok");
                            pop.draw()
                        }
                        )
                          , Ca = new m("warp_button","Use the Space Gate Alpha",-1,40,function() {
                            var b = currentFleetId.split("_")
                              , d = b[0]
                              , e = planets[d].fleets[b[1]]
                              , g = Math.ceil(e.totalWeight() / (1E5 * Math.sqrt(planets[d].structure[buildingsName.space_machine].number)));
                            planets[d].resources[resourcesName.antimatter.id] >= g ? (planets[planetsName.solidad].fleetPush(e),
                            delete planets[d].fleets[b[1]],
                            planets[d].resources[resourcesName.antimatter.id] -= g,
                            0 > planets[d].resources[resourcesName.antimatter.id] && (planets[d].resources[resourcesName.antimatter.id] = 0),
                            z("other", planets[d]),
                            b = new w(210,0,"<span class='blue_text'>Fleet moved to Solidad</span>","info")) : (z("other", planets[d]),
                            b = new w(210,0,"<span class='red_text red_text_shadow'>Not enough antimatter to move this fleet</span>","info"));
                            b.drawToast()
                        }
                        )
                          , D = new m("warp_beta","Use the Space Gate Beta",-1,40,function() {
                            var b = currentFleetId.split("_")
                              , d = b[0]
                              , e = planets[d].fleets[b[1]]
                              , g = 2 * Math.ceil(e.totalWeight() / (1E5 * Math.sqrt(planets[d].structure[buildingsName.space_beta].number)));
                            planets[d].resources[resourcesName.antimatter.id] >= g ? (planets[planetsName.bhara].fleetPush(e),
                            delete planets[d].fleets[b[1]],
                            planets[d].resources[resourcesName.antimatter.id] -= g,
                            0 > planets[d].resources[resourcesName.antimatter.id] && (planets[d].resources[resourcesName.antimatter.id] = 0),
                            z("other", planets[d]),
                            b = new w(210,0,"<span class='blue_text'>Fleet moved to Bharash</span>","info")) : (z("other", planets[d]),
                            b = new w(210,0,"<span class='red_text red_text_shadow'>Not enough antimatter to move this fleet</span>","info"));
                            b.drawToast()
                        }
                        )
                          , ja = new m("warp_gamma","Use the Space Gate Gamma",-1,40,function() {
                            var b = currentFleetId.split("_")
                              , d = b[0]
                              , e = planets[d].fleets[b[1]]
                              , g = Math.ceil(e.totalWeight() / (1E7 * Math.sqrt(researches[researchesName.darkmatter_science].level)));
                            planets[d].resources[resourcesName["dark matter"].id] >= g ? (planets[planetsName.xirandrus].fleetPush(e),
                            delete planets[d].fleets[b[1]],
                            planets[d].resources[resourcesName["dark matter"].id] -= g,
                            0 > planets[d].resources[resourcesName["dark matter"].id] && (planets[d].resources[resourcesName["dark matter"].id] = 0),
                            z("other", planets[d]),
                            b = new w(210,0,"<span class='blue_text'>Fleet moved to Xirandrus</span>","info")) : (z("other", planets[d]),
                            b = new w(210,0,"<span class='red_text red_text_shadow'>Not enough dark matter to move this fleet</span>","info"));
                            b.drawToast()
                        }
                        )
                          , Ha = new m("warp_delta","Use the Space Gate Delta",-1,40,function() {
                            var b = currentFleetId.split("_")
                              , d = b[0]
                              , e = planets[d].fleets[b[1]]
                              , g = 3 * Math.ceil(e.totalWeight() / (1 + 1E7 * Math.sqrt(researches[researchesName.darkmatter_science].level)));
                            planets[d].resources[resourcesName["dark matter"].id] >= g ? (planets[planetsName.volor].fleetPush(e),
                            delete planets[d].fleets[b[1]],
                            planets[d].resources[resourcesName["dark matter"].id] -= g,
                            0 > planets[d].resources[resourcesName["dark matter"].id] && (planets[d].resources[resourcesName["dark matter"].id] = 0),
                            z("other", planets[d]),
                            b = new w(210,0,"<span class='blue_text'>Fleet moved to Volor Ashtar</span>","info")) : (z("other", planets[d]),
                            b = new w(210,0,"<span class='red_text red_text_shadow'>Not enough dark matter to move this fleet</span>","info"));
                            b.drawToast()
                        }
                        );
                        g = new m("load_button","Load",-1,40,function() {
                            var b = currentFleetId.split("_")
                              , d = b[0];
                            b = planets[d].fleets[b[1]];
                            b.planet = d;
                            (new w(768,374,"<br><span class='blue_text text_shadow'>Select the amount of resources</span><br>","loadShip",b)).draw()
                        }
                        );
                        var J = new m("loadammo_button","Load Ammunition",-1,40,function() {
                            var b = currentFleetId.split("_")
                              , d = b[0];
                            b = planets[d].fleets[b[1]];
                            b.planet = d;
                            (new w(512,374,"<br><span class='blue_text text_shadow'>Select the amount of resources</span><br>","loadAmmo",b)).draw()
                        }
                        )
                          , Ia = new m("unload_button","Unload",-1,40,function() {
                            e.unload(d);
                            (new w(210,0,"<span class='blue_text text_shadow'>Fleet unloaded on " + planets[d].name + "</span>","info")).drawToast()
                        }
                        )
                          , Y = new m("move_button","Move",-1,40,function() {
                            var b = currentFleetId.split("_")[0];
                            L(nebulas[planets[b].map]);
                            for (b = 0; b < currentNebula.planets.length; b++)
                                $("#pdiv" + b).unbind(),
                                $("#pdiv" + b).click(function() {
                                    var b = currentFleetId.split("_")
                                      , d = b[0]
                                      , e = planets[d].fleets[b[1]];
                                    e.type = "normal";
                                    parseInt(d) != parseInt($(this).attr("name")) ? (e = e.move(parseInt(d), parseInt($(this).attr("name"))),
                                    delete planets[d].fleets[b[1]],
                                    document.getElementById("ship_info_list") && (document.getElementById("ship_info_list").innerHTML = ""),
                                    S(currentCriteria),
                                    b = 0,
                                    60 <= e ? b = "" + parseInt(Math.floor(e / 60)) + " minutes and " + parseInt(Math.floor(e % 60)) + " seconds" : 0 > e ? (d = new w(210,0,"<span class='red_text red_text_shadow'>Already on this planet!</span>","info"),
                                    d.drawToast()) : b = "" + parseInt(Math.floor(e)) + " seconds",
                                    d = new w(210,0,"<span class='blue_text text_shadow'>Fleet will arrive in " + b + "</span>","info")) : d = new w(210,0,"<span class='red_text red_text_shadow'>Already on this planet!</span>","info");
                                    d.drawToast()
                                })
                        }
                        )
                          , y = new m("raid_button","Raid",-1,40,function() {
                            var b = currentFleetId.split("_")[0];
                            L(nebulas[planets[b].map]);
                            for (b = 0; b < currentNebula.planets.length; b++)
                                $("#pdiv" + b).unbind(),
                                $("#pdiv" + b).click(function() {
                                    var b = currentFleetId.split("_")
                                      , d = b[0]
                                      , e = planets[d].fleets[b[1]];
                                    e.type = "raid";
                                    parseInt(d) != parseInt($(this).attr("name")) ? game.searchPlanet($(this).attr("name")) ? d = new w(210,0,"<span class='red_text red_text_shadow'>This planet is yours!</span>","info") : planets[$(this).attr("name")].civis ? (e = e.move(parseInt(d), parseInt($(this).attr("name"))),
                                    delete planets[d].fleets[b[1]],
                                    document.getElementById("ship_info_list") && (document.getElementById("ship_info_list").innerHTML = ""),
                                    S(currentCriteria),
                                    b = 0,
                                    60 <= e ? b = "" + parseInt(Math.floor(e / 60)) + " minutes and " + parseInt(Math.floor(e % 60)) + " seconds" : 0 > e ? (d = new w(210,0,"<span class='red_text red_text_shadow'>Already on this planet!</span>","info"),
                                    d.drawToast()) : b = "" + parseInt(Math.floor(e)) + " seconds",
                                    d = new w(210,0,"<span class='blue_text text_shadow'>Fleet will arrive in " + b + "</span>","info")) : d = new w(210,0,"<span class='red_text red_text_shadow'>You cannot raid uninhabited planets!</span>","info") : d = new w(210,0,"<span class='red_text red_text_shadow'>Already on this planet!</span>","info");
                                    d.drawToast()
                                })
                        }
                        )
                          , Ga = new m("delivery_button","Delivery",-1,40,function() {
                            var b = currentFleetId.split("_")[0];
                            L(nebulas[planets[b].map]);
                            for (b = 0; b < currentNebula.planets.length; b++)
                                $("#pdiv" + b).unbind(),
                                $("#pdiv" + b).click(function() {
                                    if (planets[parseInt($(this).attr("name"))].civis == game.id) {
                                        var b = currentFleetId.split("_")
                                          , d = b[0]
                                          , e = planets[d].fleets[b[1]];
                                        e.type = "delivery";
                                        parseInt(d) != parseInt($(this).attr("name")) ? (e = e.move(parseInt(d), parseInt($(this).attr("name"))),
                                        delete planets[d].fleets[b[1]],
                                        document.getElementById("ship_info_list") && (document.getElementById("ship_info_list").innerHTML = ""),
                                        S(currentCriteria),
                                        b = 0,
                                        60 <= e ? b = "" + parseInt(Math.floor(e / 60)) + " minutes and " + parseInt(Math.floor(e % 60)) + " seconds" : 0 >= e ? (d = new w(210,0,"<span class='red_text red_text_shadow'>Already on this planet!</span>","info"),
                                        d.drawToast()) : b = "" + parseInt(Math.floor(e)) + " seconds",
                                        d = new w(210,0,"<span class='blue_text text_shadow'>Fleet will arrive in " + b + "</span>","info")) : d = new w(210,0,"<span class='red_text red_text_shadow'>Already on this planet!</span>","info")
                                    } else
                                        d = new w(210,0,"<span class='red_text red_text_shadow'>This is an enemy planet!</span>","info");
                                    d.drawToast()
                                })
                        }
                        )
                          , x = new m("pickup_button","Pick-up",-1,40,function() {
                            var b = currentFleetId.split("_")[0];
                            L(nebulas[planets[b].map]);
                            for (b = 0; b < currentNebula.planets.length; b++)
                                $("#pdiv" + b).unbind(),
                                $("#pdiv" + b).click(function() {
                                    if (planets[parseInt($(this).attr("name"))].civis == game.id) {
                                        var b = currentFleetId.split("_");
                                        b = planets[b[0]].fleets[b[1]];
                                        b.planet = parseInt($(this).attr("name"));
                                        b = new w(512,374,"<br><span class='blue_text text_shadow'>Select the amount of resources</span><br>","pickup",b,function() {
                                            var b = currentFleetId.split("_")
                                              , d = b[0]
                                              , e = planets[d].fleets[b[1]];
                                            e.type = "pickup";
                                            parseInt(d) != e.planet ? (e = e.move(parseInt(d), e.planet),
                                            currentPopup.drop(),
                                            delete planets[d].fleets[b[1]],
                                            document.getElementById("ship_info_list") && (document.getElementById("ship_info_list").innerHTML = ""),
                                            S(currentCriteria),
                                            b = 0,
                                            60 <= e ? b = "" + parseInt(Math.floor(e / 60)) + " minutes and " + parseInt(Math.floor(e % 60)) + " seconds" : 0 >= e ? (d = new w(210,0,"<span class='red_text red_text_shadow'>Already on this planet!</span>","info"),
                                            d.drawToast()) : b = "" + parseInt(Math.floor(e)) + " seconds",
                                            d = new w(210,0,"<span class='blue_text text_shadow'>Fleet will arrive in " + b + "</span>","info")) : d = new w(210,0,"<span class='red_text red_text_shadow'>Already on this planet!</span>","info");
                                            d.drawToast()
                                        }
                                        );
                                        b.draw()
                                    } else
                                        b = new w(210,0,"<span class='red_text red_text_shadow'>This is an enemy planet!</span>","info"),
                                        b.drawToast()
                                })
                        }
                        )
                          , X = new m("automove_button","Automatic Route",-1,40,function() {
                            var b = currentFleetId.split("_")[0];
                            L(nebulas[planets[b].map]);
                            for (b = 0; b < currentNebula.planets.length; b++)
                                $("#pdiv" + b).unbind(),
                                $("#pdiv" + b).click(function() {
                                    if (planets[parseInt($(this).attr("name"))].civis == game.id) {
                                        var b = currentFleetId.split("_")
                                          , d = b[0]
                                          , e = planets[d].fleets[b[1]];
                                        parseInt(d) != parseInt($(this).attr("name")) ? da(e, parseInt(d), parseInt($(this).attr("name")), parseInt(b[1])) : (b = new w(210,0,"<span class='red_text red_text_shadow'>Already on this planet!</span>","info"),
                                        b.drawToast())
                                    } else
                                        b = new w(210,0,"<span class='red_text red_text_shadow'>This is an enemy planet!</span>","info"),
                                        b.drawToast()
                                })
                        }
                        )
                          , Fa = new m("divide_button","Split Fleet",-1,40,function() {
                            for (var b = currentFleetId.split("_"), d = planets[b[0]].fleets[b[1]], e = b = 0; e < ships.length; e++)
                                0 < d.ships[e] && b++;
                            d = new w(420,Math.min(64 + 20 * b, 240),"<br><span class='blue_text text_shadow'>Select the number of ships</span><br>","fleetDivide",d);
                            console.log(b);
                            d.draw();
                            S(currentCriteria);
                            document.getElementById("ship_info_list") && (document.getElementById("ship_info_list").innerHTML = "")
                        }
                        )
                          , Ja = new m("merge_button","Merge Fleet",-1,40,function() {
                            (new w(210,0,"<span class='blue_text text_shadow'>Select the Fleet to join</span>","info")).drawToast();
                            var b = currentFleetId.split("_")[0];
                            oldCriteria = currentCriteria;
                            S({
                                t: "merge",
                                p: parseInt(b)
                            });
                            for (var d in planets[b].fleets)
                                (game.searchPlanet(b) || game.id == planets[b].fleets[d].civis) && ("hub" == v || 0 < planets[b].fleets[d].shipNum()) ? ($("#fleet" + b + "_" + d).unbind(),
                                $("#fleet" + b + "_" + d).click(function() {
                                    var b = $(this).attr("name").split("_")
                                      , d = b[0]
                                      , e = planets[d].fleets[b[1]]
                                      , g = currentFleetId.split("_")
                                      , h = g[0]
                                      , n = planets[h].fleets[g[1]];
                                    d != h ? b = new w(210,0,"<span class='red_text red_text_shadow'>Fleets are orbiting different planets! Can't merge them.</span>","info") : b[1] == g[1] ? b = new w(210,0,"<span class='red_text red_text_shadow'>Can't merge with itself</span>","info") : (e.fusion(n),
                                    delete planets[h].fleets[g[1]],
                                    b = new w(210,0,"<span class='blue_text text_shadow'>Fleets merged</span>","info"));
                                    b.drawToast();
                                    S(oldCriteria)
                                })) : ($("#fleet" + b + "_" + d).unbind(),
                                $("#fleet" + b + "_" + d).click(function() {
                                    (new w(210,0,"<span class='red_text red_text_shadow'>Can't merge with this fleet!</span>","info")).drawToast()
                                }))
                        }
                        )
                          , A = new m("joinhub_button","Join Hub Fleet",-1,40,function() {
                            var b = currentFleetId.split("_")
                              , d = b[0]
                              , e = planets[d].fleets[b[1]];
                            e.unload(d);
                            planets[d].fleets.hub.fusion(e);
                            delete planets[d].fleets[b[1]];
                            S(currentCriteria)
                        }
                        )
                          , B = new m("mergeauto_button","Merge with Autoroute",-1,40,function() {
                            (new w(210,0,"<span class='blue_text text_shadow'>Select the Autoroute to join</span>","info")).drawToast();
                            var b = currentFleetId.split("_");
                            b = parseInt(b[0]);
                            ba(b);
                            for (var d = fleetSchedule.civisFleet(game.id), e = 0; e < d.length; e++)
                                d[e].origin != b && d[e].destination != b || "auto" != d[e].type || ($("#travel" + d[e].fleet).unbind(),
                                $("#travel" + d[e].fleet).click(function() {
                                    var b = $(this).attr("name").split("_")
                                      , d = parseInt(b[1]);
                                    parseInt(b[0]);
                                    b = currentFleetId.split("_");
                                    var e = b[0]
                                      , g = planets[e].fleets[b[1]];
                                    g.speed() > fleetSchedule.fleets[d].speed() ? d = new w(210,0,"<span class='red_text text_shadow'>Select a fleet slower than the auto route!</span>","info") : (g.unload(e),
                                    fleetSchedule.fleets[d].fusion(g),
                                    delete planets[e].fleets[b[1]],
                                    S(currentCriteria),
                                    d = new w(210,0,"<span class='blue_text text_shadow'>Fleet merged</span>","info"));
                                    d.drawToast()
                                }))
                        }
                        )
                          , E = new m("rename_button","Rename Fleet",-1,40,function() {
                            var b = currentFleetId.split("_");
                            (new w(360,140,"<br><span class='blue_text text_shadow'>Type the new name</span><br>","renameFleet",planets[b[0]].fleets[b[1]])).draw()
                        }
                        )
                          , H = new m("attack_button","Attack Fleet",-1,40,function() {
                            var b = currentFleetId.split("_")[0];
                            S({
                                t: "attack",
                                p: b
                            });
                            var d = new w(210,0,"<span class='blue_text text_shadow'>Select the enemy fleet</span>","info");
                            d.drawToast();
                            $("#ship_list").children().each(function(e, g) {
                                var h = $(this).attr("name").split("_");
                                parseInt(h[0]) == b && planets[h[0]].fleets[parseInt(h[1])].civis != game.id || $(this).css("display", "none");
                                $(this).unbind();
                                $(this).click(function() {
                                    var b = $(this).attr("name").split("_")
                                      , e = currentFleetId.split("_")
                                      , g = e[0];
                                    planets[b[0]].fleets[parseInt(b[1])].planet = g;
                                    planets[g].fleets[e[1]].planet = g;
                                    var h = planets[b[0]].fleets[parseInt(b[1])].battle(planets[g].fleets[e[1]], !1)
                                      , n = planets[b[0]].fleets[parseInt(b[1])].civis;
                                    "atk" == h.winner ? (d = new w(210,96,"<br><span class='blue_text text_shadow'>Your fleet won the battle!</span>","Ok"),
                                    d.draw(),
                                    0 == planets[b[0]].fleets[parseInt(b[1])].shipNum() && delete planets[b[0]].fleets[parseInt(b[1])]) : "def" == h.winner ? (d = new w(210,96,"<br><span class='red_text red_text_shadow'>Your fleet lost the battle!</span>","Ok"),
                                    d.draw(),
                                    0 == planets[g].fleets[e[1]].shipNum() && delete planets[g].fleets[e[1]]) : "draw" == h.winner && (d = new w(210,96,"<br><span class='orange_text'>The battle resulted in a draw!</span>","Ok"),
                                    d.draw(),
                                    0 == planets[g].fleets[e[1]].shipNum() && delete planets[g].fleets[e[1]],
                                    0 == planets[b[0]].fleets[parseInt(b[1])].shipNum() && delete planets[b[0]].fleets[parseInt(b[1])]);
                                    (MOBILE_LANDSCAPE || 0 < game.timeTravelNum) && setRep(n, game.id, game.reputation[n] - repLoss[game.repName(n)]);
                                    document.getElementById("ship_list") && (document.getElementById("ship_list").innerHTML = h.r);
                                    document.getElementById("ship_info_list") && (document.getElementById("ship_info_list").innerHTML = "")
                                });
                                $(this).hover(function() {
                                    var b = $(this).attr("name").split("_")
                                      , d = currentFleetId.split("_")
                                      , e = d[0];
                                    console.log(e);
                                    planets[b[0]].fleets[parseInt(b[1])].planet = e;
                                    console.log(planets[b[0]].fleets[parseInt(b[1])].planet + " " + b[0] + " " + b[1]);
                                    planets[e].fleets[d[1]].planet = e;
                                    d = planets[b[0]].fleets[parseInt(b[1])].battle(planets[e].fleets[d[1]], !0);
                                    b = planets[b[0]].fleets[parseInt(b[1])].civis;
                                    e = "";
                                    "atk" == d.winner ? e += "<span class='green_text text_shadow'>Your fleet will win the battle!</span>" : "def" == d.winner ? e += "<span class='red_text red_text_shadow'>Your fleet will lose the battle!</span>" : "draw" == d.winner && (e += "<span class='orange_text'>The battle will result in a draw!</span>");
                                    if (MOBILE_LANDSCAPE || 0 < game.timeTravelNum)
                                        e += "<br><span class='red_text red_text_shadow'>You will lose " + beauty(repLoss[game.repName(b)]) + " reputation <br> with " + civis[b].name + "!</span>";
                                    (new w(200,10,e,"info")).drawInfo();
                                    $(document).on("mousemove", function(b) {
                                        mouseX = b.pageX + 10;
                                        mouseY = b.pageY + 10;
                                        $("#popup_info").css({
                                            left: mouseX,
                                            top: mouseY
                                        })
                                    });
                                    $("#popup_info").css({
                                        left: mouseX,
                                        top: mouseY
                                    })
                                }, function() {
                                    currentPopup.drop()
                                });
                                $(this).mouseout(function() {
                                    $(document).on("mousemove", function() {})
                                })
                            })
                        }
                        );
                        if ("hub" != b[1]) {
                            0 < b[1] && (n += H.getHtml(),
                            l += 2.5);
                            for (var G = !1, I = !1, F = 0; F < ships.length; F++)
                                "Colonial Ship" == ships[F].type && 0 < e.ships[F] && (G = !0);
                            game.searchPlanet(d) && (G = !1);
                            if (G) {
                                if (null != planets[d].civis) {
                                    if (planets[d].civis != e.civis && planets[d].civis) {
                                        I = !0;
                                        for (var K in planets[d].fleets)
                                            planets[d].fleets[K].civis == planets[d].civis && 0 != K && "hub" != K && (I = !1)
                                    }
                                    I || !game.searchPlanet(d) && planets[d].civis && (u = new m("conquer_button","<span class='red_text'>Destroy enemy fleets before colonizing this planet!</span>",-1,40,function() {}
                                    ))
                                }
                                n += u.getHtml();
                                l += 2.5
                            }
                            game.searchPlanet(d) && 0 != b[1] && 0 < planets[d].structure[buildingsName.space_machine].number && (n += Ca.getHtml(),
                            l += 2.5);
                            game.searchPlanet(d) && 0 != b[1] && 0 < planets[d].structure[buildingsName.space_beta].number && (n += D.getHtml(),
                            l += 2.5);
                            game.searchPlanet(d) && 0 != b[1] && 0 < planets[d].structure[buildingsName.space_gamma].number && (n += ja.getHtml(),
                            l += 2.5);
                            game.searchPlanet(d) && 0 != b[1] && 0 < planets[d].structure[buildingsName.space_delta].number && (n += Ha.getHtml(),
                            l += 2.5);
                            0 != b[1] && (RAID_ENABLED() && game.searchPlanet(d) && (n += y.getHtml(),
                            l += 2.5),
                            n += Ja.getHtml(),
                            n += B.getHtml(),
                            l += 5,
                            game.searchPlanet(d) && !MOBILE_LANDSCAPE && gameSettings.showHub && (4 <= game.planets.length || 0 < game.timeTravelNum) && (n += A.getHtml(),
                            l += 2.5));
                            0 != b[1] && game.searchPlanet(d) && (n += Ga.getHtml(),
                            n += x.getHtml(),
                            l += 5);
                            game.searchPlanet(d) && 0 != b[1] && (n += g.getHtml(),
                            n += J.getHtml(),
                            n += Ia.getHtml(),
                            l += 7.5);
                            0 != b[1] && (n += Y.getHtml(),
                            l += 2.5);
                            0 != b[1] && game.searchPlanet(d) && (n += X.getHtml(),
                            l += 2.5);
                            n += Fa.getHtml();
                            n += E.getHtml();
                            l += 5;
                            n += "</ul>";
                            document.getElementById("ship_info_list") && (document.getElementById("ship_info_list").innerHTML = n);
                            currentFleetId = $(this).attr("name");
                            G && (I ? (u.enable(),
                            h("conquer_button", "<span class='red_text'>" + civis[planets[d].civis].name + "<br>will become hostile!</span>", 140)) : u.enable());
                            game.searchPlanet(d) && (0 != b[1] && (RAID_ENABLED() && y.enable(),
                            Ca.enable(),
                            D.enable(),
                            ja.enable(),
                            Ha.enable(),
                            n = Math.ceil(e.totalWeight() / (1E5 * Math.sqrt(planets[d].structure[buildingsName.space_machine].number))),
                            K = 2 * Math.ceil(e.totalWeight() / (1E5 * Math.sqrt(planets[d].structure[buildingsName.space_beta].number))),
                            l = Math.ceil(e.totalWeight() / (1 + 1E7 * Math.sqrt(researches[researchesName.darkmatter_science].level))),
                            u = 3 * l,
                            h("warp_button", "<span class='white_text'>Send this fleet to </span><span class='blue_text'>Solidad</span><br><span class='white_text'> with </span><span class='blue_text'>" + beauty(n) + " antimatter</span>", 240),
                            h("warp_beta", "<span class='white_text'>Send this fleet to </span><span class='blue_text'>Bharash</span><br><span class='white_text'> with </span><span class='blue_text'>" + beauty(K) + " antimatter</span>", 240),
                            h("warp_gamma", "<span class='white_text'>Send this fleet to </span><span class='blue_text'>Xirandrus</span><br><span class='white_text'> with </span><span class='blue_text'>" + beauty(l) + " dark matter</span>", 240),
                            h("warp_delta", "<span class='white_text'>Send this fleet to </span><span class='blue_text'>Volor Ashtar</span><br><span class='white_text'> with </span><span class='blue_text'>" + beauty(u) + " dark matter</span>", 240)),
                            0 != b[1] && g.enable(),
                            0 != b[1] && J.enable(),
                            0 != b[1] && Ia.enable());
                            0 != b[1] && Y.enable();
                            0 != b[1] && game.searchPlanet(d) && (Ga.enable(),
                            x.enable(),
                            X.enable());
                            Fa.enable();
                            0 != b[1] && (Ja.enable(),
                            B.enable(),
                            game.searchPlanet(d) && A.enable());
                            E.enable();
                            0 != b[1] && H.enable()
                        } else
                            n += Fa.getHtml(),
                            l += 2.5,
                            n += "</ul>",
                            document.getElementById("ship_info_list") && (document.getElementById("ship_info_list").innerHTML = n),
                            currentFleetId = $(this).attr("name"),
                            Fa.enable()
                    } else
                        n += "</ul>",
                        document.getElementById("ship_info_list") && (document.getElementById("ship_info_list").innerHTML = n),
                        currentFleetId = $(this).attr("name");
                    for (F = 0; F < ships.length; F++)
                        0 < e.ships[F] && ($("#ship_name_infos_" + F).hover(function() {
                            var b = parseInt($(this).attr("name"))
                              , d = currentFleetId.split("_");
                            d = planets[d[0]].fleets[d[1]];
                            var e = "<span class='blue_text'>Power: </span><span class='white_text'>" + beauty(ships[b].power) + "</span><br>";
                            e += "<span class='blue_text'>Weapon: </span><span class='white_text'>" + ships[b].weapon.capitalize() + "</span><br>";
                            e += "<span class='blue_text'>HPs: </span><span class='white_text'>" + beauty(ships[b].hp) + "</span><br>";
                            0 < ships[b].piercing && (e += "<span class='blue_text' style='float:left;margin-left:16px;'>Piercing Power: </span><span class='white_text'>" + Math.min(100, Math.floor(100 * ships[b].piercing) / 100) + "%</span><br>");
                            0 < ships[b].shield && (e += "<span class='blue_text' style='float:left;margin-left:16px;'>Shields: </span><span class='white_text'>" + beauty(ships[b].shield) + "</span><br>");
                            e += "<span class='blue_text'>Dmg Reduction: </span><span class='white_text'>" + Math.floor(100 * (100 - 100 / (1 + Math.log(1 + ships[b].armor * (1 + d.storage[resourcesName.armor.id] / (2 * mi)) / 1E4) / Math.log(2)))) / 100 + "%</span><br>";
                            e += "<span class='blue_text'>Speed: </span><span class='white_text'>" + Math.floor(100 * ships[b].speed * (1 + d.storage[resourcesName.engine.id] / 1E3 * 2E-4)) / 100 + "</span><br>";
                            e += "<span class='blue_text'>Weight: </span><span class='white_text'>" + beauty(ships[b].weight) + "</span><br>";
                            e += "<span class='blue_text'>Weight%: </span><span class='white_text'>" + Math.floor(ships[b].weight * d.ships[b] / d.weight() * 1E4) / 100 + "%</span><br>";
                            (new w(140,10,e,"info")).drawInfo();
                            $(document).on("mousemove", function(b) {
                                mouseX = b.pageX + 10;
                                mouseY = b.pageY + 10;
                                $("#popup_info").css({
                                    left: mouseX,
                                    top: mouseY
                                })
                            });
                            $("#popup_info").css({
                                left: mouseX,
                                top: mouseY
                            })
                        }, function() {
                            currentPopup.drop()
                        }),
                        $("#ship_name_infos_" + F).mouseout(function() {
                            $(document).on("mousemove", function() {})
                        }),
                        $("#ammo_bonus").hover(function() {
                            for (var b = currentFleetId.split("_"), d = planets[b[0]].fleets[b[1]], e = b = 0; e < ships.length; e++)
                                b += ships[e].power * d.ships[e];
                            e = 10 * b * Math.log(1 + d.storage[resourcesName.ammunition.id] / (10 * mi)) / Math.log(2);
                            var g = 20 * b * Math.log(1 + d.storage[resourcesName["u-ammunition"].id] / (10 * mi)) / Math.log(2)
                              , h = 60 * b * Math.log(1 + d.storage[resourcesName["t-ammunition"].id] / (20 * mi)) / Math.log(2);
                            d = 1 + .1 * Math.log(1 + d.ships[14]) / Math.log(2);
                            b = "<span class='blue_text'>Base Power: </span><span class='white_text'>" + beauty(b) + "</span><br>";
                            b += "<span class='blue_text'>Ammo Bonus: </span><span class='white_text'>+" + beauty(e) + "</span><br>";
                            b += "<span class='blue_text'>U-Ammo Bonus: </span><span class='white_text'>+" + beauty(g) + "</span><br>";
                            b += "<span class='blue_text'>T-Ammo Bonus: </span><span class='white_text'>+" + beauty(h) + "</span><br>";
                            b += "<span class='blue_text'>Admiral Bonus: </span><span class='white_text'>x" + beauty(d) + "</span><br>";
                            (new w(200,10,b,"info")).drawInfo();
                            $(document).on("mousemove", function(b) {
                                mouseX = b.pageX + 10;
                                mouseY = b.pageY + 10;
                                $("#popup_info").css({
                                    left: mouseX - 210,
                                    top: mouseY
                                })
                            });
                            $("#popup_info").css({
                                left: mouseX - 210,
                                top: mouseY
                            })
                        }, function() {
                            currentPopup.drop()
                        }),
                        $("#ammo_bonus").mouseout(function() {
                            $(document).on("mousemove", function() {})
                        }))
                }))
        }
        currentUpdater = function() {}
        ;
        K();
        $("#ship_interface").show();
        $("#back_button").unbind();
        $("#back_button").click(I);
        $("#back_button").show();
        game.searchPlanet(currentPlanet.id) && ($("#bottom_build_menu").show(),
        5 <= game.researches[3].level ? ($("#b_market_icon").show(),
        $("#b_shipyard_icon").show()) : (1 <= game.researches[3].level && $("#b_shipyard_icon").show(),
        $("#b_market_icon").hide()))
    }
    function ba(b) {
        currentCriteriaAuto = b;
        fleetSchedule.fleetArrived = !1;
        currentUpdater = function() {}
        ;
        var d = currentInterface;
        S(currentCriteria);
        currentInterface = "travelingShipInterface";
        "travelingShipInterface" != d && (document.getElementById("ship_info_list") && (document.getElementById("ship_info_list").innerHTML = ""),
        document.getElementById("ship_info_name") && (document.getElementById("ship_info_name").innerHTML = ""));
        document.getElementById("ship_list") && (document.getElementById("ship_list").innerHTML = "");
        currentUpdater = function() {}
        ;
        var e = fleetSchedule.civisFleet(game.id);
        "market" == b && (e = fleetSchedule.marketFleets());
        var g = 0
          , h = "";
        for (d = 0; d < e.length; d++)
            if ("all" == b || "auto" != b && fleetSchedule.fleets[e[d].fleet].type == b || "market" == b && ("market_delivery" == fleetSchedule.fleets[e[d].fleet].type || "market_sell" == fleetSchedule.fleets[e[d].fleet].type) || "auto" == b && "auto" == fleetSchedule.fleets[e[d].fleet].type || "normal" == b && ("delivery" == fleetSchedule.fleets[e[d].fleet].type || "pickup" == fleetSchedule.fleets[e[d].fleet].type || "raid" == fleetSchedule.fleets[e[d].fleet].type || "pickup_return" == fleetSchedule.fleets[e[d].fleet].type || ("qd" == fleetSchedule.fleets[e[d].fleet].type || "qn" == fleetSchedule.fleets[e[d].fleet].type) && gameSettings.showqd) || (e[d].origin == b || e[d].destination == b) && "auto" == fleetSchedule.fleets[e[d].fleet].type || "attacks" == b && "attack" == fleetSchedule.fleets[e[d].fleet].type) {
                var n = !1
                  , l = "";
                if ("auto" == fleetSchedule.fleets[e[d].fleet].type) {
                    for (var u = fleetSchedule.fleets[e[d].fleet], v = e[d].origin, J = e[d].destination, D = parseInt(Math.floor(2 * planets[v].shortestPath[J].distance / (u.speed() * idleBon))), y = 0, x = 0, va = 0; va < resNum; va++)
                        u.autoPct[va] ? 0 > planets[v].globalRaw[va] ? x += -u.autoRes[u.autoMap[v]][va] / 1E4 * planets[v].globalRaw[va] * D : y += u.autoRes[u.autoMap[v]][va] / 1E4 * planets[v].globalRaw[va] * D : y += u.autoRes[u.autoMap[v]][va],
                        u.autoPct[va] ? 0 > planets[J].globalRaw[va] ? y += -u.autoRes[u.autoMap[J]][va] / 1E4 * planets[J].globalRaw[va] * D : x += u.autoRes[u.autoMap[J]][va] / 1E4 * planets[J].globalRaw[va] * D : x += u.autoRes[u.autoMap[J]][va];
                    y = Math.floor(y);
                    x = Math.floor(x);
                    y > u.maxStorage() && (n = !0,
                    l += "<span class='red_text' style='font-size:70%;'> (Not enough storage in " + planets[v].name);
                    x > u.maxStorage() && (l = n ? l + (" and " + planets[J].name) : l + ("<span class='red_text' style='font-size:70%;'> (Not enough storage in " + planets[J].name),
                    n = !0);
                    n && (l += ") </span>")
                }
                h += "<li id='travel" + e[d].fleet + "' name='" + d + "_" + e[d].fleet + "' style='height:96px;' class='button'>";
                h += "<div style='width:98%; height:120px;position:relative;'>";
                h += "<div style='position:relative; top:8px; left:8px'>";
                n = "red_text";
                u = "[Enemy] ";
                game.id == fleetSchedule.fleets[e[d].fleet].civis ? (n = "blue_text",
                u = "") : game.reputation[fleetSchedule.fleets[e[d].fleet].civis] >= repLevel.allied.min ? (n = "green_text",
                u = "[Allied] ") : game.reputation[fleetSchedule.fleets[e[d].fleet].civis] >= repLevel.friendly.min ? (n = "white_text",
                u = "[Friendly] ") : game.reputation[fleetSchedule.fleets[e[d].fleet].civis] >= repLevel.neutral.min && (n = "gray_text",
                u = "[Neutral] ");
                h += "<span class='" + n + "' style='font-size: 100%;'>" + u + fleetSchedule.fleets[e[d].fleet].name + "</span>" + l;
                h += "<img id='b_rename_travel_icon_" + e[d].fleet + "' name='" + e[d].fleet + "' src='" + UI_FOLDER + "/RENAME.png' style='width:16px;height:16px;position:relative;top:3px;cursor:pointer;'/>";
                h += "<span class='white_text'> traveling to </span><span class='blue_text' style='font-size: 100%;cursor:pointer;' id='traveling_" + e[d].destination + "_" + d + "' name='" + e[d].destination + "'>" + planets[e[d].destination].name + "</span>";
                l = e[d].lastPlanet;
                h += "<span class='white_text'> (last seen in </span><span class='blue_text' style='font-size: 100%;cursor:pointer;' id='lastseen_" + l + "_" + d + "' name='" + l + "'>" + planets[e[d].lastPlanet].name + "</span><span class='white_text'>)</span>";
                D = e[d].departureTime + (e[d].totalTime - e[d].departureTime) / idleBon - (new Date).getTime();
                0 > D && (D = 0);
                l = Math.floor(D / 1E3);
                n = Math.floor(l / 60);
                h += "<span class='white_text'> will arrive in: </span><span class='blue_text' id='ship_time_" + e[d].fleet + "'>" + Math.floor(n / 60) % 60 + "h " + n % 60 + "m " + l % 60 + "s</span>";
                h += "</div>";
                v = e[d].hop;
                l = shortestRouteId(e[d].origin, e[d].destination);
                n = l.length - 2;
                u = 100 * ((new Date).getTime() - e[d].departureTime) / (e[d].arrivalTime - e[d].departureTime) * idleBon;
                100 < u && (u = 100);
                h += "<div style='position:relative;top:32px;'><div style='width:400px;height:12px;background-color:rgba(75, 129, 156, 0.3);position:relative;left:20px;top:-8px'></div>";
                h += "<div id='q" + e[d].fleet + "' style='max-width:400px;width:" + Math.floor(400 * v / n + 4 * u / n) + "px;height:12px;background-color: rgba(100,152,208,0.3);position:relative;top:-20px;left:20px;'></div>";
                for (v = 0; v < l.length - 1; v++)
                    h += "<img id='qplanet" + e[d].fleet + "_" + v + "' src='" + IMG_FOLDER + "/" + planets[l[v + 1]][PLANET_IMG_FIELD] + (1 == PLANET_FOLDER_DOUBLE ? "/" + planets[l[v + 1]][PLANET_IMG_FIELD] : "") + ".png' style='width:30px;height:30px;position:relative;top:-40px;left:" + Math.floor(400 * v / n - 30 * v - 4) + "px;'></img>";
                "auto" == e[d].type && (h += "<div class='blue_text' style='position:relative; top:-72px; left:480px; font-size: 80%;cursor:pointer;width:100%' id='autoroute_overview_" + e[d].fleet + "_" + d + "' name='exp_" + e[d].fleet + "_" + e[d].origin + "_" + e[d].destination + "' >Show resources<img src='" + UI_FOLDER + "/arrow_down.png' style='position:relative; width:20px;height:20px;top:5px;left:4px' /></div>",
                h += "<div class='blue_text' style='position:relative; top:-56px; left:15%;width:70%; font-size: 80%;cursor:pointer;' id='autoroute_resources_" + e[d].fleet + "'></div>");
                l = parseInt(u);
                100 < l && (l = 100);
                h += "</div>";
                h += "</div></li>";
                g++
            }
        0 == g && (h += "<li id='nofleet' style='height:120px;' class='button'>",
        h += "<div style='width:98%; height:120px;position:relative;'>",
        h += "<div style='text-align:center;position:relative; top:8px; left:8px'>",
        h += "<span class='gray_text' style='font-size: 100%;'>There are no fleets to show</span> ",
        h += "</li>");
        document.getElementById("ship_list") && (document.getElementById("ship_list").innerHTML = h);
        for (d = 0; d < e.length; d++)
            if ("all" == b || "auto" != b && fleetSchedule.fleets[e[d].fleet].type == b || "market" == b && ("market_delivery" == fleetSchedule.fleets[e[d].fleet].type || "market_sell" == fleetSchedule.fleets[e[d].fleet].type) || "auto" == b && "auto" == fleetSchedule.fleets[e[d].fleet].type || "normal" == b && ("delivery" == fleetSchedule.fleets[e[d].fleet].type || "pickup" == fleetSchedule.fleets[e[d].fleet].type || "raid" == fleetSchedule.fleets[e[d].fleet].type || "pickup_return" == fleetSchedule.fleets[e[d].fleet].type || ("qd" == fleetSchedule.fleets[e[d].fleet].type || "qn" == fleetSchedule.fleets[e[d].fleet].type) && gameSettings.showqd) || (e[d].origin == b || e[d].destination == b) && "auto" == fleetSchedule.fleets[e[d].fleet].type || "attacks" == b && "attack" == fleetSchedule.fleets[e[d].fleet].type)
                g = e[d].destination,
                l = e[d].lastPlanet,
                $("#traveling_" + g + "_" + d).unbind(),
                $("#traveling_" + g + "_" + d).click(function() {
                    var b = parseInt($(this).attr("name"));
                    C(planets[b])
                }),
                $("#lastseen_" + l + "_" + d).unbind(),
                $("#lastseen_" + l + "_" + d).click(function() {
                    var b = parseInt($(this).attr("name"));
                    C(planets[b])
                }),
                $("#travel" + e[d].fleet).unbind(),
                $("#travel" + e[d].fleet).click(function() {
                    var d = $(this).attr("name").split("_")
                      , g = parseInt(d[1]);
                    d = parseInt(d[0]);
                    currentHighlight && $("#travel" + currentHighlight).css("background", "rgba(75,129,156,0.0)");
                    currentHighlight = e[d].fleet;
                    $("#travel" + currentHighlight).css("background", "rgba(75,129,156,0.3)");
                    "auto" == fleetSchedule.fleets[g].type ? $("#ship_info_name").html(fleetSchedule.fleets[g].name + "<br><span class='white_text' style='font-size:70%'>(Automatic Transport)</span>") : "delivery" == fleetSchedule.fleets[g].type ? $("#ship_info_name").html(fleetSchedule.fleets[g].name + "<br><span class='white_text' style='font-size:70%'>(Resource Delivery)</span>") : "raid" == fleetSchedule.fleets[g].type ? $("#ship_info_name").html(fleetSchedule.fleets[g].name + "<br><span class='red_text' style='font-size:70%'>(Raid)</span>") : $("#ship_info_name").html(fleetSchedule.fleets[g].name);
                    var n = "<ul id='ship_info_list' style='position:absolute; text-align:right; top:48px; margin-top:16px; clear:both;'><div style='position:relative; left:8px;'><span class='blue_text' style='float:left;margin-left:16px;font-size:120%;'>Information</span><br><br>";
                    h += "<span class='blue_text' style='float:left;margin-left:16px;'>Military Value: </span><span class='white_text' >" + beauty(fleetSchedule.fleets[g].value()) + "</span><br>";
                    h += "<span class='blue_text' style='float:left;margin-left:16px;'>Experience: </span><span class='white_text' >" + Math.random(fleetSchedule.fleets[g].exp) + "</span><br>";
                    n += "<span class='blue_text' style='float:left;margin-left:16px;' id='ammo_bonus_t' name='" + g + "'>Total Power: </span><span class='white_text'>" + beauty(fleetSchedule.fleets[g].power()) + "</span><br>";
                    n += "<span class='blue_text' style='float:left;margin-left:16px;'>Total HP: </span><span class='white_text'>" + beauty(fleetSchedule.fleets[g].hp()) + "</span><br>";
                    n += "<span class='blue_text' style='float:left;margin-left:16px;'>Speed: </span><span class='white_text'>" + Math.floor(100 * fleetSchedule.fleets[g].speed()) / 100 + "</span><br>";
                    n += "<span class='blue_text' style='float:left;margin-left:16px;'>Total Storage: </span><span class='white_text'>" + beauty(fleetSchedule.fleets[g].maxStorage()) + "</span><br>";
                    var l = (e[d].totalTime - e[d].departureTime) / idleBon;
                    0 > l && (l = 0);
                    l = Math.floor(l / 1E3);
                    var u = Math.floor(l / 60);
                    n = n + ("<span class='blue_text' style='float:left;margin-left:16px;'>Total Travel Time: </span><span class='white_text'>" + Math.floor(u / 60) % 60 + "h " + u % 60 + "m " + l % 60 + "s</span><br>") + "</div><br>";
                    l = 512;
                    n = n + "<div style='position:relative; left:8px;'><span class='blue_text' style='float:left;margin-left:16px;font-size:120%;'>Storage</span><br><br>" + ("<span class='blue_text' style='float:left;margin-left:16px;'>Storage left: </span><span class='white_text'>" + beauty(parseInt(Math.floor(fleetSchedule.fleets[g].availableStorage()))) + "</span><br>");
                    u = Array(resNum);
                    for (var v = 0; v < resNum; v++)
                        u[v] = v;
                    gameSettings.sortResName && (u = sortedResources);
                    for (v = 0; v < resNum; v++) {
                        var D = u[v];
                        0 < fleetSchedule.fleets[g].storage[D] && (n += "<span class='blue_text' style='float:left;margin-left:16px;'>" + resources[D].name.capitalize() + ": </span><span class='white_text'>" + parseInt(Math.floor(fleetSchedule.fleets[g].storage[D])) + "</span><br>",
                        l += 16)
                    }
                    n += "</div><br><div style='position:relative; left:8px;'><span class='blue_text' style='float:left;margin-left:16px;font-size:120%;'>Ships</span><br><br>";
                    for (u = 0; u < ships.length; u++)
                        0 < fleetSchedule.fleets[g].ships[u] && (n += "<span class='blue_text' style='float:left;margin-left:16px;' id='ship_name_infos_t_" + u + "' name='" + g + "_" + u + "'>" + ships[u].name + "</span><span class='white_text'>" + beautyDot(fleetSchedule.fleets[g].ships[u]) + "</span><br>",
                        l += 16);
                    n += "</div><br><br>";
                    "auto" == fleetSchedule.fleets[g].type ? (u = new m("autocnc_button","Cancel automatic route",-1,40,function() {
                        var d = $(this).attr("name").split("_")
                          , e = parseInt(d[1]);
                        parseInt(d[0]);
                        fleetSchedule.fleets[e].type = "normal";
                        (new w(210,0,"<span class='blue_text text_shadow'>Route canceled</span>","info")).drawToast();
                        ba(b)
                    }
                    ),
                    v = new m("autoedit_button","Edit automatic route",-1,40,function() {
                        var b = $(this).attr("name").split("_")
                          , d = parseInt(b[1]);
                        b = parseInt(b[0]);
                        ra(fleetSchedule.fleets[d], e[b].origin, e[b].destination)
                    }
                    ),
                    D = new m("autodiv_button","Split automatic route",-1,40,function() {
                        var b = $(this).attr("name").split("_")
                          , d = parseInt(b[1]);
                        parseInt(b[0]);
                        b = fleetSchedule.fleets[d];
                        for (var e = d = 0; e < ships.length; e++)
                            0 < b.ships[e] && d++;
                        (new w(420,Math.min(64 + 20 * d, 240),"<br><span class='blue_text text_shadow'>Select the number of ships</span><br>","autoDivide",b)).draw()
                    }
                    ),
                    n += v.getHtml(),
                    n += D.getHtml(),
                    n += u.getHtml(),
                    n += "</ul>",
                    document.getElementById("ship_info_list") && (document.getElementById("ship_info_list").innerHTML = n),
                    u.enable(),
                    D.enable(),
                    v.enable(),
                    $("#autocnc_button").attr("name", d + "_" + g),
                    $("#autoedit_button").attr("name", d + "_" + g),
                    $("#autodiv_button").attr("name", d + "_" + g)) : (u = new m("cancel_travel_button","Cancel Travel",-1,40,function() {
                        var d = e[parseInt($(this).attr("name"))].fleet
                          , g = fleetSchedule.fleets[d];
                        if (fleetSchedule.fleets[d]) {
                            for (var h = 1; planets[g.lastPlanet].fleets[h]; )
                                h++;
                            planets[g.lastPlanet].fleets[h] = fleetSchedule.fleets[d];
                            fleetSchedule.fleets[d] = null
                        } else
                            (new w(210,0,"<span class='red_text red_text_shadow'>This fleet doesn't exist!</span>","info")).drawToast();
                        ba(b)
                    }
                    ),
                    fleetSchedule.fleets[e[d].fleet].civis == game.id && (n += u.getHtml()),
                    n += "</ul>",
                    document.getElementById("ship_info_list") && (document.getElementById("ship_info_list").innerHTML = n),
                    fleetSchedule.fleets[e[d].fleet].civis == game.id && (u.enable(),
                    $("#cancel_travel_button").attr("name", d)));
                    for (u = 0; u < ships.length; u++)
                        0 < fleetSchedule.fleets[g].ships[u] && ($("#ship_name_infos_t_" + u).hover(function() {
                            var b = $(this).attr("name").split("_")
                              , d = parseInt(b[1]);
                            b = fleetSchedule.fleets[b[0]];
                            var e = "<span class='blue_text'>Power: </span><span class='white_text'>" + beauty(ships[d].power) + "</span><br>";
                            e += "<span class='blue_text'>Weapon: </span><span class='white_text'>" + ships[d].weapon.capitalize() + "</span><br>";
                            e += "<span class='blue_text'>HPs: </span><span class='white_text'>" + beauty(ships[d].hp) + "</span><br>";
                            0 < ships[d].piercing && (e += "<span class='blue_text' style='float:left;margin-left:16px;'>Piercing Power: </span><span class='white_text'>" + Math.min(100, Math.floor(100 * ships[d].piercing) / 100) + "%</span><br>");
                            e += "<span class='blue_text'>Dmg Reduction: </span><span class='white_text'>" + Math.floor(100 * (100 - 100 / (1 + Math.log(1 + ships[d].armor * (1 + b.storage[resourcesName.armor.id] / (2 * mi)) / 1E4) / Math.log(2)))) / 100 + "%</span><br>";
                            e += "<span class='blue_text'>Speed: </span><span class='white_text'>" + Math.floor(100 * ships[d].speed * (1 + b.storage[resourcesName.engine.id] / 1E3 * 2E-4)) / 100 + "</span><br>";
                            e += "<span class='blue_text'>Weight: </span><span class='white_text'>" + beauty(ships[d].weight) + "</span><br>";
                            e += "<span class='blue_text'>Weight%: </span><span class='white_text'>" + Math.floor(ships[d].weight * b.ships[d] / b.weight() * 1E4) / 100 + "%</span><br>";
                            (new w(140,10,e,"info")).drawInfo();
                            $(document).on("mousemove", function(b) {
                                mouseX = b.pageX + 10;
                                mouseY = b.pageY + 10;
                                $("#popup_info").css({
                                    left: mouseX,
                                    top: mouseY
                                })
                            });
                            $("#popup_info").css({
                                left: mouseX,
                                top: mouseY
                            })
                        }, function() {
                            currentPopup.drop()
                        }),
                        $("#ship_name_infos_t_" + u).mouseout(function() {
                            $(document).on("mousemove", function() {})
                        }));
                    $("#ammo_bonus_t").hover(function() {
                        for (var b = fleetSchedule.fleets[$(this).attr("name")], d = 0, e = 0; e < ships.length; e++)
                            d += ships[e].power * b.ships[e];
                        e = 10 * d * Math.log(1 + b.storage[resourcesName.ammunition.id] / (10 * mi)) / Math.log(2);
                        var g = 20 * d * Math.log(1 + b.storage[resourcesName["u-ammunition"].id] / (10 * mi)) / Math.log(2)
                          , h = 60 * d * Math.log(1 + b.storage[resourcesName["t-ammunition"].id] / (20 * mi)) / Math.log(2);
                        b = 1 + .1 * Math.log(1 + b.ships[14]) / Math.log(2);
                        d = "<span class='blue_text'>Base Power: </span><span class='white_text'>" + beauty(d) + "</span><br>";
                        d += "<span class='blue_text'>Ammo Bonus: </span><span class='white_text'>+" + beauty(e) + "</span><br>";
                        d += "<span class='blue_text'>U-Ammo Bonus: </span><span class='white_text'>+" + beauty(g) + "</span><br>";
                        d += "<span class='blue_text'>T-Ammo Bonus: </span><span class='white_text'>+" + beauty(h) + "</span><br>";
                        d += "<span class='blue_text'>Admiral Bonus: </span><span class='white_text'>x" + beauty(b) + "</span><br>";
                        (new w(200,10,d,"info")).drawInfo();
                        $(document).on("mousemove", function(b) {
                            mouseX = b.pageX + 10;
                            mouseY = b.pageY + 10;
                            $("#popup_info").css({
                                left: mouseX - 210,
                                top: mouseY
                            })
                        });
                        $("#popup_info").css({
                            left: mouseX - 210,
                            top: mouseY
                        })
                    }, function() {
                        currentPopup.drop()
                    });
                    $("#ammo_bonus_t").mouseout(function() {
                        $(document).on("mousemove", function() {})
                    });
                    $("#ship_infolist_placeholder").css("height", l + "px")
                }),
                $("#b_rename_travel_icon_" + e[d].fleet).click(function() {
                    var b = fleetSchedule.fleets[parseInt($(this).attr("name"))];
                    (new w(360,140,"<br><span class='blue_text text_shadow'>Type the new name</span><br>","renameFleetTravel",b)).draw()
                }),
                "auto" == fleetSchedule.fleets[e[d].fleet].type && ($("#autoroute_overview_" + e[d].fleet + "_" + d).unbind(),
                $("#autoroute_overview_" + e[d].fleet + "_" + d).click(function() {
                    var b = $(this).attr("name").split("_")
                      , d = b[0]
                      , e = parseInt(b[1])
                      , g = parseInt(b[2]);
                    b = parseInt(b[3]);
                    if ("exp" == d) {
                        d = 96;
                        var h = fleetSchedule.fleets[e]
                          , n = parseInt(Math.floor(2 * planets[g].shortestPath[b].distance / h.speed()));
                        var l = "<div style='position:relative;left:16px;'><div style='float:left;margin:0;width:48%;'>" + ("<img src='" + IMG_FOLDER + "/" + planets[g][PLANET_IMG_FIELD] + (1 == PLANET_FOLDER_DOUBLE ? "/" + planets[g][PLANET_IMG_FIELD] : "") + ".png' style='cursor:pointer;position:relative;top:8px;height:24px;width:24px;'/><span class='blue_text' style='font-size:90%'> " + planets[g].name + "</span><br>");
                        d += 64;
                        for (var m = 0, u = Array(resNum), v = 0; v < resNum; v++)
                            u[v] = v;
                        gameSettings.sortResName && (u = sortedResources);
                        for (v = 0; v < resNum; v++) {
                            var w = u[v];
                            if (h.autoPct[w]) {
                                var D = 0;
                                0 > planets[b].globalRaw[w] && (D -= planets[b].globalRaw[w] * h.autoRes[h.autoMap[b]][w] / 1E4);
                                0 < planets[g].globalRaw[w] && (D += planets[g].globalRaw[w] * h.autoRes[h.autoMap[g]][w] / 1E4);
                                l += "<br><span class='blue_text' style='font-size:90%;'>" + resources[w].name.capitalize() + ": </span><span class='white_text' style='font-size:100%;'>" + beauty(D * n) + " </span><span class='blue_text'>(" + beauty(D) + "/s, " + h.autoRes[h.autoMap[g]][w] / 100 + "%)</span>";
                                m += 22
                            } else
                                0 < h.autoRes[h.autoMap[g]][w] && (l += "<br><span class='blue_text' style='font-size:90%;'>" + resources[w].name.capitalize() + ": </span><span class='white_text' style='font-size:100%;'>" + beauty(h.autoRes[h.autoMap[g]][w]) + " </span><span class='blue_text'>(" + beauty(h.autoRes[h.autoMap[g]][w] / n) + "/s)</span>",
                                m += 22)
                        }
                        l = l + "</div><div style='position:relative;left:16px;'><div style='float:left;margin:0;width:48%;'>" + ("<img src='" + IMG_FOLDER + "/" + planets[b][PLANET_IMG_FIELD] + (1 == PLANET_FOLDER_DOUBLE ? "/" + planets[b][PLANET_IMG_FIELD] : "") + ".png' style='cursor:pointer;position:relative;top:8px;height:24px;width:24px;'/><span class='blue_text' style='font-size:90%'> " + planets[b].name + "</span><br>");
                        u = Array(resNum);
                        for (v = 0; v < resNum; v++)
                            u[v] = v;
                        gameSettings.sortResName && (u = sortedResources);
                        for (v = 0; v < resNum; v++)
                            w = u[v],
                            h.autoPct[w] ? (D = 0,
                            0 > planets[g].globalRaw[w] && (D -= planets[g].globalRaw[w] * h.autoRes[h.autoMap[g]][w] / 1E4),
                            0 < planets[b].globalRaw[w] && (D += planets[b].globalRaw[w] * h.autoRes[h.autoMap[b]][w] / 1E4),
                            l += "<br><span class='blue_text' style='font-size:90%;'>" + resources[w].name.capitalize() + ": </span><span class='white_text' style='font-size:100%;'>" + beauty(D * n) + " </span><span class='blue_text'>(" + beauty(D) + "/s, " + h.autoRes[h.autoMap[b]][w] / 100 + "%)</span>",
                            m += 22) : 0 < h.autoRes[h.autoMap[b]][w] && (l += "<br><span class='blue_text' style='font-size:90%;'>" + resources[w].name.capitalize() + ": </span><span class='white_text' style='font-size:100%;'>" + beauty(h.autoRes[h.autoMap[b]][w]) + " </span><span class='blue_text'>(" + beauty(h.autoRes[h.autoMap[b]][w] / n) + "/s)</span>",
                            m += 22);
                        l += "</div></div>";
                        h = m;
                        0 > m && (h = 0);
                        d += h;
                        document.getElementById("autoroute_resources_" + e) && (document.getElementById("autoroute_resources_" + e).innerHTML = l);
                        $("#travel" + e).css("height", d + "px");
                        this.innerHTML = "Hide resources<img src='" + UI_FOLDER + "/arrow_up.png' style='position:relative; width:20px;height:20px;top:5px;left:4px' />";
                        $(this).attr("name", "hide_" + e + "_" + g + "_" + b)
                    } else
                        this.innerHTML = "Show resources<img src='" + UI_FOLDER + "/arrow_down.png' style='position:relative; width:20px;height:20px;top:5px;left:4px' />",
                        $(this).attr("name", "exp_" + e + "_" + g + "_" + b),
                        document.getElementById("autoroute_resources_" + e) && (document.getElementById("autoroute_resources_" + e).innerHTML = ""),
                        $("#travel" + e).css("height", "96px")
                }));
        currentHighlight && $("#travel" + currentHighlight).css("background", "rgba(75,129,156,0.3)");
        currentUpdater = function() {
            currentHighlight && $("#travel" + currentHighlight).css("background", "rgba(75,129,156,0.3)");
            var d = fleetSchedule.civisFleet(game.id);
            "market" == b && (d = fleetSchedule.marketFleets());
            for (var e = 0; e < d.length; e++)
                if ("all" == b || "auto" != b && fleetSchedule.fleets[d[e].fleet].type == b || "market" == b && ("market_delivery" == fleetSchedule.fleets[d[e].fleet].type || "market_sell" == fleetSchedule.fleets[d[e].fleet].type) || "auto" == b && "auto" == fleetSchedule.fleets[d[e].fleet].type || "normal" == b && ("delivery" == fleetSchedule.fleets[d[e].fleet].type || "pickup" == fleetSchedule.fleets[d[e].fleet].type || "pickup_return" == fleetSchedule.fleets[d[e].fleet].type || "raid" == fleetSchedule.fleets[d[e].fleet].type || ("qd" == fleetSchedule.fleets[d[e].fleet].type || "qn" == fleetSchedule.fleets[d[e].fleet].type) && gameSettings.showqd) || (d[e].origin == b || d[e].destination == b) && "auto" == fleetSchedule.fleets[d[e].fleet].type || "attacks" == b && "attack" == fleetSchedule.fleets[d[e].fleet].type) {
                    var g = d[e].hop
                      , h = shortestRouteId(d[e].origin, d[e].destination).length - 2
                      , n = d[e].departureTime + (d[e].totalTime - d[e].departureTime) / idleBon - (new Date).getTime();
                    0 > n && (n = 0);
                    n = Math.floor(n / 1E3);
                    var l = Math.floor(n / 60)
                      , m = Math.floor(l / 60);
                    document.getElementById("ship_time_" + d[e].fleet) && (document.getElementById("ship_time_" + d[e].fleet).innerHTML = "" + m % 60 + "h " + l % 60 + "m " + n % 60 + "s");
                    n = 100 * ((new Date).getTime() - d[e].departureTime) / (d[e].arrivalTime - d[e].departureTime) * idleBon;
                    100 < n && (n = 100);
                    $("#q" + d[e].fleet).css("width", "" + Math.floor(400 * g / h + 4 * n / h) + "px");
                    100 < parseInt(n) && ba(b)
                }
        }
        ;
        game.searchPlanet(currentPlanet.id) && ($("#bottom_build_menu").show(),
        5 <= game.researches[3].level ? ($("#b_market_icon").show(),
        $("#b_shipyard_icon").show()) : (1 <= game.researches[3].level && $("#b_shipyard_icon").show(),
        $("#b_market_icon").hide()))
    }
    function fa(b) {
        currentInterface = "marketInterface";
        currentPlanet = b;
        currentUpdater = function() {}
        ;
        if (0 < currentPlanet.structure[buildingsName.tradehub].number) {
            for (var d = Array(resNum), e = 0; e < resNum; e++)
                d[e] = e;
            gameSettings.sortResName && (d = sortedResources);
            for (var g = "", h = 0; h < resNum; h++)
                if (e = d[h],
                resources[e].show(game)) {
                    for (var n = 0, l = 0, m = 0, u = 0, v = "", D = "", y = 0; y < civis.length; y++)
                        n += civis[y].marketExport(e),
                        0 < civis[y].marketExport(e) && (m++,
                        v += ", " + civis[y].shortName),
                        l += civis[y].marketImport(e),
                        0 < civis[y].marketImport(e) && (u++,
                        D += ", " + civis[y].shortName);
                    g += "<li id='market" + e + "' name='" + e + "' style='height:132px;'>";
                    g += "<div style='width:98%; height:80px;position:relative;'>";
                    g += "<div style='position:relative; top:8px; left:8px'>";
                    g += "<span class='blue_text' style='font-size: 120%;'>" + resources[e].name.capitalize() + " </span>";
                    y = "<span class='red_text'> (~ ";
                    0 < n - l ? y = "<span class='green_text'> (~ +" : 0 == n - l && (y = "<span class='gray_text'> (~ ");
                    g += "<span class='white_text' id='market" + e + "stock'>\t" + beauty(market.stock[e]) + "/" + beauty(market.getMaxStock(e)) + y + beauty(n - l) + "/s)</span></span>";
                    0 < m && (g += "<br><span class='blue_text' style='font-size: 80%;'> Exported by: </span><span class='white_text' style='font-size: 80%;'>" + v.substring(2) + "</span>");
                    0 < u && (g += "<br><span class='blue_text' style='font-size: 80%;'> Imported by: </span><span class='white_text' style='font-size: 80%;'>" + D.substring(2) + "</span>");
                    g += "</div>";
                    g += "<div style='position:relative; top:8px; left:8px'><br>";
                    g += "<span class='blue_text' style='font-size: 80%;'>Buy Price (1000 units): </span> ";
                    g += "<span class='white_text' style='font-size: 80%;' id='market" + e + "bp'>" + beauty(1E3 * market.buyPrice(e, game)) + "</span>";
                    g += "<img src='" + UI_FOLDER + "/coin.png' style='height:16px;width:16px;position:relative;top:4px;'/>";
                    g += "<span style='position:relative;left:64px;'>";
                    g += "<input id='market_buy_" + e + "' name='" + e + "' type='text' value='0' style='width:80px;height:12px;font-size:80%;'/>";
                    g += "<span class='red_text' style='font-size: 80%;' id='totalbuy_" + e + "'>  -0</span><img src='" + UI_FOLDER + "/coin.png' style='height:16px;width:16px;position:relative;top:4px;'/>";
                    g += "</span>";
                    g += "<br>";
                    g += "<span class='blue_text' style='font-size: 80%;'>Sell Price (1000 units): </span> ";
                    g += "<span class='white_text' style='font-size: 80%;' id='market" + e + "sp'>" + beauty(1E3 * market.sellPrice(e, game)) + "</span>";
                    g += "<img src='" + UI_FOLDER + "/coin.png' style='height:16px;width:16px;position:relative;top:4px;'/>";
                    g += "<span style='position:relative;left:64px;'>";
                    g += "<input id='market_sell_" + e + "' name='" + e + "' type='text' value='0' style='width:80px;height:12px;font-size:80%;'/>";
                    g += "<span class='green_text' style='font-size: 80%;' id='totalsell_" + e + "'>  +0</span><img src='" + UI_FOLDER + "/coin.png' style='height:16px;width:16px;position:relative;top:4px;'/>";
                    g += "</span>";
                    g += "</div>";
                    g += "</div></li>"
                }
            document.getElementById("market_list") && (document.getElementById("market_list").innerHTML = g);
            var Ea = 0;
            for (e in b.fleets)
                0 != e && "hub" != e && b.fleets[e] && b.fleets[e].civis == game.id && 0 < b.fleets[e].shipNum() && (Ea += b.fleets[e].maxStorage());
            for (d = 0; d < resNum; d++)
                resources[d].show(game) && ($("#market_buy_" + d).change(function() {
                    $(this).val(parseInt($(this).val()));
                    isFinite(parseInt($(this).val())) ? parseInt($(this).val()) > market.stock[parseInt($(this).attr("name"))] && $(this).val(market.stock[parseInt($(this).attr("name"))]) : $(this).val(0);
                    $("#totalbuy_" + $(this).attr("name")).html("  -" + beauty(parseInt($(this).val()) * market.buyPrice($(this).attr("name"), game)));
                    for (var b = 0, d = 0; d < resNum; d++)
                        resources[d].show(game) && (b += parseInt($("#market_buy_" + d).val()) * market.buyPrice(d, game));
                    document.getElementById("buy_total") && (document.getElementById("buy_total").innerHTML = "  (-" + beauty(b) + "<img src='" + UI_FOLDER + "/coin.png' style='height:16px;width:16px;position:relative;top:4px;'/>)")
                }),
                $("#market_sell_" + d).change(function() {
                    var b = market.getMaxStock(parseInt($(this).attr("name"))) - market.stock[parseInt($(this).attr("name"))];
                    if (parseInt($(this).val()) > b) {
                        var d = new w(210,0,"<span class='red_text red_text_shadow'>Not enough space in the market!</span>","info");
                        d.drawToast();
                        $(this).val(b)
                    } else
                        $(this).val(parseInt($(this).val()));
                    d = Ea;
                    for (b = 0; b < resNum; b++)
                        resources[b].show(game) && b != parseInt($(this).attr("name")) && (d -= parseInt($("#market_sell_" + b).val()));
                    isFinite(parseInt($(this).val())) ? parseInt($(this).val()) > d && ($(this).val(Math.max(0, d)),
                    d = new w(210,0,"<span class='red_text red_text_shadow'>Not enough fleet storage!</span>","info"),
                    d.drawToast()) : $(this).val(0);
                    $("#totalsell_" + $(this).attr("name")).html("  +" + beauty(parseInt($(this).val()) * market.sellPrice($(this).attr("name"), game)));
                    for (b = d = 0; b < resNum; b++)
                        resources[b].show(game) && (d += parseInt($("#market_sell_" + b).val()) * market.sellPrice(b, game));
                    document.getElementById("sell_total") && (document.getElementById("sell_total").innerHTML = "  (+" + beauty(d) + "<img src='" + UI_FOLDER + "/coin.png' style='height:16px;width:16px;position:relative;top:4px;'/>)")
                }));
            d = "<ul id='market_mini_list' style='position:absolute; text-align:left; top:0px; clear:both;'><div style='position:relative; left:8px;'>" + ("<span class='blue_text'>Energy Prod.: </span><span class='white_text' style='float:right;margin-right:20%;'>" + Math.floor(b.energyProduction()) + "</span><br>");
            d += "<span class='blue_text'>Energy Cons.: </span><span class='white_text' style='float:right;margin-right:20%;'>" + Math.floor(-b.energyConsumption()) + "</span><br>";
            e = Math.floor(b.energyProduction() + b.energyConsumption());
            h = b.energyMalus();
            1 < h ? h = 1 : 0 > h && (h = 0);
            n = "green_text";
            .85 <= h && 1 > h ? n = "gold_text" : .85 > h && (n = "red_text");
            d += "<span class='blue_text'>Balance: </span><span class='" + n + "' style='float:right;margin-right:20%;'>" + parseInt(Math.floor(e)) + "</span><br>";
            d += "<span class='blue_text'>Efficiency: </span><span class='" + n + "' style='float:right;margin-right:20%;'>" + Math.floor(1E4 * h) / 100 + "%</span><br><br>";
            gameSettings.populationEnabled && (d += "<span class='blue_text'>Population Growth: </span><span id='popGrow' class='white_text' style='float:right;margin-right:20%;'>" + 100 * b.basePopulation + "%" + (0 < b.structure[buildingsName.clonation].number ? "<span class='green_text'>(+" + b.structure[buildingsName.clonation].number + "%)</span>" : "") + "/y</span><br>",
            d += "<span class='blue_text'>Population: </span><span class='white_text' style='float:right;margin-right:20%;' id='popul'>" + beauty(b.population) + " " + (0 < b.globalProd.population + b.populationRatio ? "<span class='green_text'>(+" + beauty(b.globalProd.population + b.populationRatio) + "/s)</span>" : "<span class='red_text'>(" + beauty(b.globalProd.population + b.populationRatio) + "/s)</span>") + "</span><br>",
            d += "<span class='blue_text'>Habitable Space: </span><span class='white_text' style='float:right;margin-right:20%;' id='habitable'>" + beauty(b.habitableSpace()) + "</span><br><br>");
            d += uiScheduler.planetResources(b);
            d += "</div></ul>";
            document.getElementById("market_mini_list") && (document.getElementById("market_mini_list").innerHTML = d);
            g = "";
            for (d = h = e = 0; d < resNum; d++)
                resources[d].show(game) && (e += parseInt($("#market_buy_" + d).val()),
                h += parseInt($("#market_sell_" + d).val()));
            document.getElementById("market_info_name") && (document.getElementById("market_info_name").innerHTML = "<span class='blue_text' style='font-size:80%;'>Total available storage of orbiting fleets: </span><span class='white_text' style='font-size:60%;'>" + beauty(Ea) + "</span><br><br><div class='button'><span class='blue_text' style='font-size:100%;width:100%;cursor:pointer;' id='market_buy_button'>Buy</span><span class='red_text' style='font-size:60%;' id='buy_total'>  (-" + beauty(e) + "<img src='" + UI_FOLDER + "/coin.png' style='height:16px;width:16px;position:relative;top:4px;'/>)</span></div><br><div class='button'><span class='blue_text' style='font-size:100%;width:100%;cursor:pointer;' id='market_sell_button'>Sell</span><span class='green_text' style='font-size:60%;' id='sell_total'>  (+" + beauty(h) + "<img src='" + UI_FOLDER + "/coin.png' style='height:16px;width:16px;position:relative;top:4px;'/>)</span></div>");
            $("#market_buy_button").unbind();
            $("#market_buy_button").click(function() {
                for (var b = new Fleet(8,"Market Delivery"), d = 0, e = 0, g = 0; g < resNum; g++)
                    resources[g].show(game) && (d += parseInt($("#market_buy_" + g).val()),
                    b.storage[g] = parseInt($("#market_buy_" + g).val()),
                    e += parseInt($("#market_buy_" + g).val()) * market.buyPrice(g, game));
                b.ships[71] = 1 + Math.floor(d / ships[71].maxStorage);
                b.type = "market_delivery";
                if (0 < d)
                    if (game.money >= e) {
                        game.money -= e;
                        0 > game.money && (game.money = 0);
                        if (currentPlanet.id != planetsName[MARKET_PLANET]) {
                            g = b.move(planetsName[MARKET_PLANET], currentPlanet.id);
                            d = 0;
                            60 <= g ? d = "" + parseInt(Math.floor(g / 60)) + " minutes and " + parseInt(Math.floor(g % 60)) + " seconds" : 0 > g ? (g = new w(210,0,"<span class='red_text red_text_shadow'>Already on this planet!</span>","info"),
                            g.drawToast()) : d = "" + parseInt(Math.floor(g)) + " seconds";
                            for (g = 0; g < resNum; g++)
                                resources[g].show(game) && (market.stock[g] -= b.storage[g],
                                0 > market.stock[g] && (market.stock[g] = 0));
                            fa(currentPlanet);
                            g = new w(210,110,"<br><span class='blue_text text_shadow'>The delivery will arrive in " + d + "</span>","Ok")
                        } else {
                            for (g = 0; g < resNum; g++)
                                resources[g].show(game) && (market.stock[g] -= b.storage[g],
                                0 > market.stock[g] && (market.stock[g] = 0));
                            b.unload(currentPlanet.id);
                            g = new w(210,110,"<br><span class='blue_text text_shadow'>Resources bought</span>","Ok")
                        }
                        g.draw()
                    } else
                        g = new w(210,0,"<span class='red_text red_text_shadow'>You don't have enough coins!</span>","info"),
                        g.drawToast();
                else
                    g = new w(210,0,"<span class='red_text red_text_shadow'>Your resource request is empty</span>","info"),
                    g.drawToast()
            });
            $("#market_sell_button").unbind();
            $("#market_sell_button").click(function() {
                for (var d = 0, e = !1, g = !1, h = 0; h < resNum; h++)
                    if (resources[h].show(game) && (d += parseInt($("#market_sell_" + h).val()),
                    parseInt($("#market_sell_" + h).val()) > market.getMaxStock(h) - market.stock[h] && (g = !0),
                    parseInt($("#market_sell_" + h).val()) > currentPlanet.resources[h])) {
                        e = !0;
                        break
                    }
                var n = "";
                g && (n = "<br><span class='red_text'>Though the market won't accept everything</span>");
                if (e)
                    h = new w(210,0,"<span class='red_text red_text_shadow'>Not enough resources in the " + LOCALE_PLANET_NAME + "</span>","info"),
                    h.drawToast();
                else if (0 < d) {
                    e = 0;
                    for (var l in b.fleets)
                        0 != l && b.fleets[l] && b.fleets[l].civis == game.id && 0 < b.fleets[l].shipNum() && (e += b.fleets[l].maxStorage());
                    if (d <= e) {
                        var m = 0;
                        h = [];
                        for (l in currentPlanet.fleets)
                            0 != l && "hub" != l && currentPlanet.fleets[l] && currentPlanet.fleets[l].civis == game.id && 0 < currentPlanet.fleets[l].shipNum() && "Cargo Fleet" == currentPlanet.fleets[l].fleetType() && h.push(l);
                        h.sort(function(b, d) {
                            var e = currentPlanet.fleets[b].maxStorage() * currentPlanet.fleets[b].speed()
                              , g = currentPlanet.fleets[d].maxStorage() * currentPlanet.fleets[d].speed();
                            return e > g ? -1 : e < g ? 1 : 0
                        });
                        g = [];
                        for (l in currentPlanet.fleets)
                            0 != l && "hub" != l && currentPlanet.fleets[l] && currentPlanet.fleets[l].civis == game.id && 0 < currentPlanet.fleets[l].shipNum() && "Cargo Fleet" != currentPlanet.fleets[l].fleetType() && g.push(l);
                        g.sort(function(b, d) {
                            var e = currentPlanet.fleets[b].maxStorage() * currentPlanet.fleets[b].speed()
                              , g = currentPlanet.fleets[d].maxStorage() * currentPlanet.fleets[d].speed();
                            return e > g ? -1 : e < g ? 1 : 0
                        });
                        e = [];
                        for (l = 0; l < h.length; l++)
                            e.push(h[l]);
                        for (l = 0; l < g.length; l++)
                            e.push(g[l]);
                        l = currentPlanet.fleets[e[0]].maxStorage();
                        for (g = 1; l < d && g < e.length; )
                            l += currentPlanet.fleets[e[g]].maxStorage(),
                            g++;
                        d = Array(resNum);
                        for (h = 0; h < resNum; h++)
                            resources[h].show(game) ? d[h] = parseInt($("#market_sell_" + h).val()) : d[h] = 0;
                        for (l = 0; l < g; l++) {
                            m = e[l];
                            currentPlanet.fleets[m].type = "market_sell";
                            currentPlanet.fleets[m].unload(currentPlanet.id);
                            for (h = 0; h < resNum; h++)
                                if (resources[h].show(game)) {
                                    var u = Math.min(currentPlanet.fleets[m].availableStorage(), d[h]);
                                    d[h] -= u;
                                    d[h] = Math.max(d[h], 0);
                                    currentPlanet.fleets[m].load(h, u) && currentPlanet.resourcesAdd(h, -u)
                                }
                            planetsName[MARKET_PLANET] != currentPlanet.id ? (currentPlanet.fleets[m].move(currentPlanet.id, planetsName[MARKET_PLANET]),
                            delete currentPlanet.fleets[m],
                            fa(currentPlanet),
                            h = new w(210,0,"<span class='blue_text'>Fleet sent</span>" + n,"info")) : (market.sell(currentPlanet.fleets[m]),
                            h = new w(210,0,"<span class='blue_text'>Resources Sold</span>" + n,"info"));
                            h.drawToast()
                        }
                    } else
                        h = new w(210,0,"<span class='red_text red_text_shadow'>Not enough fleets available in orbit to carry the resources</span>","info"),
                        h.drawToast()
                } else
                    h = new w(210,0,"<span class='red_text red_text_shadow'>Empty resources request</span>","info"),
                    h.drawToast()
            });
            $("#market_arrow_mini_left").unbind();
            $("#market_arrow_mini_left").click(function() {
                for (var b = !1, d = 0; !b && d < game.planets.length; )
                    game.planets[d] == currentPlanet.id ? b = !0 : d++;
                b && fa(planets[game.planets[(d + game.planets.length - 1) % game.planets.length]])
            });
            $("#market_arrow_mini_right").unbind();
            $("#market_arrow_mini_right").click(function() {
                for (var b = !1, d = 0; !b && d < game.planets.length; )
                    game.planets[d] == currentPlanet.id ? b = !0 : d++;
                b && fa(planets[game.planets[(d + 1) % game.planets.length]])
            });
            document.getElementById("market_info_list") && (document.getElementById("market_info_list").innerHTML = g);
            for (e = 0; e < resNum; e++)
                resources[e].show(game) && ($("#market" + e).valore = e,
                $("#market" + e).click(function() {}));
            currentUpdater = function() {
                var d = "<ul id='market_mini_list' style='position:absolute; text-align:left; top:0px; clear:both;'><div style='position:relative; left:8px;'>" + ("<span class='blue_text'>Energy Prod.: </span><span class='white_text' style='float:right;margin-right:20%;'>" + Math.floor(b.energyProduction()) + "</span><br>");
                d += "<span class='blue_text'>Energy Cons.: </span><span class='white_text' style='float:right;margin-right:20%;'>" + Math.floor(-b.energyConsumption()) + "</span><br>";
                var e = Math.floor(b.energyProduction() + b.energyConsumption())
                  , h = b.energyMalus();
                1 < h ? h = 1 : 0 > h && (h = 0);
                var n = "green_text";
                .85 <= h && 1 > h ? n = "gold_text" : .85 > h && (n = "red_text");
                d += "<span class='blue_text'>Balance: </span><span class='" + n + "' style='float:right;margin-right:20%;'>" + parseInt(Math.floor(e)) + "</span><br>";
                d += "<span class='blue_text'>Efficiency: </span><span class='" + n + "' style='float:right;margin-right:20%;'>" + Math.floor(1E4 * h) / 100 + "%</span><br><br>";
                gameSettings.populationEnabled && (d += "<span class='blue_text'>Population Growth: </span><span id='popGrow' class='white_text' style='float:right;margin-right:20%;'>" + 100 * b.basePopulation + "%" + (0 < b.structure[buildingsName.clonation].number ? "<span class='green_text'>(+" + b.structure[buildingsName.clonation].number + "%)</span>" : "") + "/y</span><br>",
                d += "<span class='blue_text'>Population: </span><span class='white_text' style='float:right;margin-right:20%;' id='popul'>" + beauty(b.population) + " " + (0 < b.globalProd.population + b.populationRatio ? "<span class='green_text'>(+" + beauty(b.globalProd.population + b.populationRatio) + "/s)</span>" : "<span class='red_text'>(" + beauty(b.globalProd.population + b.populationRatio) + "/s)</span>") + "</span><br>",
                d += "<span class='blue_text'>Habitable Space: </span><span class='white_text' style='float:right;margin-right:20%;' id='habitable'>" + beauty(b.habitableSpace()) + "</span><br><br>");
                d = d + "</div>" + uiScheduler.planetResourcesUpdater([b]);
                d += "</ul>";
                document.getElementById("market_mini_list") && (document.getElementById("market_mini_list").innerHTML = d);
                for (d = 0; d < resNum; d++)
                    if (resources[d].show(game)) {
                        for (h = e = 0; h < civis.length; h++)
                            e += civis[h].marketExport(d) - civis[h].marketImport(d);
                        h = "<span class='red_text'> (~ ";
                        0 < e ? h = "<span class='green_text'> (~ +" : 0 == e && (h = "<span class='gray_text'> (~ ");
                        g += "<span class='white_text' id='market" + d + "stock'>\t" + beauty(market.stock[d]) + "/" + beauty(market.getMaxStock(d)) + h + beauty(e - l) + "/s)</span></span>";
                        $("#market" + d + "stock").html(beauty(market.stock[d]) + "/" + beauty(market.getMaxStock(d)) + h + beauty(e) + "/s)")
                    }
            }
            ;
            currentUpdater()
        } else
            document.getElementById("market_list") && (document.getElementById("market_list").innerHTML = "<span class='red_text' style='font-size:120%;'> No Trade Hubs on " + currentPlanet.name + "</span>");
        K();
        x();
        $("#market_interface").show();
        $("#back_button").unbind();
        $("#back_button").click(B);
        $("#back_button").show();
        game.searchPlanet(currentPlanet.id) && ($("#bottom_build_menu").show(),
        5 <= game.researches[3].level ? ($("#b_market_icon").show(),
        $("#b_market_icon").show()) : (1 <= game.researches[3].level && $("#b_market_icon").show(),
        $("#b_market_icon").hide()))
    }
    function R(b) {
        currentInterface = "diplomacyInterface";
        for (var d = 0; d < characters.length; d++) {
            var e = characters[d];
            "quris2" == e.id && quests[questNames.quris_7].done && (e.unlocked = !0);
            "wahrian" == e.id && quests[questNames.seal_7].done && (e.unlocked = !0);
            "protohalean" == e.id && quests[questNames.juini_5].done && (e.unlocked = !0)
        }
        d = "";
        if ("art" == b)
            for (b = uiScheduler.artifactList(),
            d += b.html,
            $("#diplomacy_list").html(d),
            d = 0; d < b.buttons.length; d++)
                b.buttons[d].enable();
        else if ("char" == b)
            for (b = uiScheduler.characterList(),
            d += b.html,
            $("#diplomacy_list").html(d),
            d = 0; d < b.buttons.length; d++)
                b.buttons[d].enable();
        else if ("government" == b)
            for (b = uiScheduler.government(),
            d += b.html,
            $("#diplomacy_list").html(d),
            d = 0; d < b.buttons.length; d++)
                b.buttons[d].enable(),
                h(b.buttons[d].id, "<span class='red_text'>Are you sure? You can only change your government again after " + GOVERNMENT_HOURS_CHANGE + " hours!</span>", 256);
        else {
            if (-1 == b)
                b = uiScheduler.unaligned(),
                d += b.html,
                $("#diplomacy_list").html(d);
            else if ("reports" == b)
                b = uiScheduler.reportsHistory(),
                d += b.html,
                $("#diplomacy_list").html(d);
            else
                for (b = uiScheduler.civisInfo(b),
                d += b.html,
                $("#diplomacy_list").html(d),
                d = 0; d < b.toBind.length; d++)
                    e = b.toBind[d],
                    "yes" == $("#civis_plt_" + e).attr("isUnknown") ? h("civis_plt_" + e, "<span class='red_text'>Unknown</span>", 64) : ($("#civis_plt_" + e).click(function() {
                        var b = $(this).attr("name");
                        C(planets[b])
                    }),
                    h("civis_plt_" + e, "<span class='blue_text'>" + planets[e].name + "</span>", 8 * planets[e].name.length));
            for (d = 0; d < b.buttons.length; d++)
                b.buttons[d].enable()
        }
        b = "";
        d = [];
        new m("civis_news","News",-1,40,function() {
            R("news")
        }
        );
        var g = new m("civis_artifacts","Artifacts List",-1,40,function() {
            R("art")
        }
        );
        0 < artifactsNumber() && (d.push(g),
        b += g.getHtml());
        g = new m("civis_characters","Characters",-1,40,function() {
            R("char")
        }
        );
        0 < charactersNumber() && (d.push(g),
        b += g.getHtml());
        g = new m("civis_unaligned","Unaligned Missions",-1,40,function() {
            R(-1)
        }
        );
        d.push(g);
        b += g.getHtml();
        if (MOBILE_LANDSCAPE || game.timeTravelNum)
            for (g = new m("civis_reports","Attack Reports",-1,40,function() {
                R("reports")
            }
            ),
            d.push(g),
            b += g.getHtml(),
            2 <= game.timeTravelNum && (g = new m("government","Government",-1,40,function() {
                R("government")
            }
            ),
            d.push(g),
            b += g.getHtml()),
            e = 0; e < civis.length; e++)
                civis[e].id != game.id && civis[e].contacted() && !civis[e].lost && (g = "<img src='" + UI_FOLDER + "/civis/" + civis[e].playerName + ".png' class='icon' style='position:absolute;left:4px;margin-top:4px'/>",
                MOBILE_LANDSCAPE && (g = ""),
                g = new m("civis_diplo_" + e,g + civis[e].name,-1,40,function() {
                    var b = $(this).attr("id").split("_");
                    R(b[2])
                }
                ),
                d.push(g),
                b += g.getHtml());
        $("#diplomacy_mini_list").html(b);
        for (e = 0; e < d.length; e++)
            d[e].enable();
        currentUpdater = function() {}
        ;
        K();
        $("#diplomacy_interface").show();
        game.searchPlanet(currentPlanet.id) && $("#bottom_build_menu").show()
    }
    function T() {
        currentInterface = "profileInterface";
        var b = "<li style='height:64px;><div style='position:absolute; top:8px; left:8px; width:98%'></div></li><li style='height:64px;'><div style='position:absolute;  left: 8px; width:98%;'><span id='span_wipe' class='red_text' style='font-size:100%; width: 98%; float:left; text-align:center;cursor:pointer;'>Wipe Data<br>(BE SURE BEFORE CLICKING!!)</span><br><br></div></li><li style='height:64px;'><div style='position:absolute;  left: 8px; width:98%;'><span id='queue_wipe' class='red_text' style='font-size:100%; width: 98%; float:left; text-align:center;cursor:pointer;'>Reset queues and shipping<br></span></div></li><li style='height:100px;'><div style='position:absolute;  left: 8px; width:98%;'><span id='span_logs' class='blue_text' style='font-size:100%; width: 98%; float:left; text-align:center;cursor:pointer;'>Change logs<br></span><br><br></div></li><li style='height:48px;><div style='position:absolute; top:8px; left:40%; width:98%'><span class='blue_text' style='font-size:130%; width: 98%; float:left; text-align:center;cursor:pointer;'>Sound Settings</span></div></li>" + ("<li style='height:32px;'><span style='position:absolute;left:33%;' class='blue_text'><input style='width:320px' id='slide_master' type='range' min='0' max='100' value='" + gameSettings.masterVolume + "' step='1'>Master Volume</input></span></li>");
        b += "<li style='height:32px;'><span style='position:absolute;left:33%;' class='blue_text'><input style='width:320px' id='slide_music' type='range' min='0' max='100' value='" + gameSettings.musicVolume + "' step='1'>Music Volume</input></span></li>";
        b += "<li style='height:32px;'><span style='position:absolute;left:33%;' class='blue_text'><input style='width:320px' id='slide_effects' type='range' min='0' max='100' value='" + gameSettings.soundVolume + "' step='1'>Effects Volume</input></span></li>";
        b += "<li style='height:48px;><div style='position:absolute; top:8px; left:40%; width:98%'><span class='blue_text' style='font-size:130%; width: 98%; float:left; text-align:center;cursor:pointer;'>UI Settings</span></div></li>";
        var d = "<input type='checkbox' id='tech_check' value='false'>Tech Tree visualization</input>;<input type='checkbox' id='notation_check' value='false'>Scientific Notation</input>;<input type='checkbox' id='engnotation_check' value='false'>Engineering Notation</input>;<input type='checkbox' id='hpleft_check' value='false'>Show hp left in battle report</input>;<input type='checkbox' id='sortresname_check' value='false'>Sort resources by name</input>;<input type='checkbox' id='toastright_check' value='false'>Show toast popups on the right</input>;<input type='checkbox' id='showBuildingAid_check' value='false'>Show graphical info on building hover</input>;<input type='checkbox' id='showMultipliers_check' value='false'>Show cost multipliers</input>;<input type='checkbox' id='rpspent_check' value='false'>Show total RP and TP earned</input>".split(";");
        MOBILE_LANDSCAPE || d.push("<input type='checkbox' id='advauto_check' value='false'>Show advanced options for autoroutes</input>");
        d.push("<input type='checkbox' id='shipsort_check' value='false'>Sort ships by shipyard level</input>");
        d.push("<input style='width:33%' id='slide_textsize' type='range' min='" + MIN_TEXT_SIZE + "' max='" + MAX_TEXT_SIZE + "' value='" + gameSettings.textSize + "' step='0.01'>Text size</input>");
        d.push("<input type='checkbox' id='allshipres_check' value='false'>Show all resources in shipyard</input>");
        MOBILE_LANDSCAPE || d.push("");
        MOBILE_LANDSCAPE || d.push("");
        d.push("<input style='width:33%' id='slide_techuiscale' type='range' min='0.5' max='2' value='" + gameSettings.techuiScale + "' step='0.1'>Tech interface scale</input>");
        b += uiScheduler.settingsGroup(d);
        MOBILE_LANDSCAPE || (b = b + "<li style='height:48px;><div style='position:absolute; top:8px; left:40%; width:98%'><span class='blue_text' style='font-size:130%; width: 98%; float:left; text-align:center;cursor:pointer;'>Game Settings</span></div></li>" + uiScheduler.settingsGroup(["<input type='checkbox' id='idle10_check' value='false'>10 minutes idle bonus</input>", "<input type='checkbox' id='hidetut_check' value='false'>Hide tutorial</input>", 0 < userID ? "<input type='checkbox' id='cloud_check' value='false'>Enable cloud save (ALPHA - export before using it!)</input>" : ""]));
        b += "<li style='height:48px;><div style='position:absolute; top:8px; left:40%; width:98%'><span class='blue_text' style='font-size:130%; width: 98%; float:left; text-align:center;cursor:pointer;'>Shipping & Deliveries</span></div></li>";
        d = [];
        d.push("<input type='checkbox' id='usequeue_check' value='false'>Enable building queue</input>");
        d.push("<input type='checkbox' id='autoqueue_check' value='false'>Automatic construction for building queue</input>");
        MOBILE_LANDSCAPE || d.push("<input type='checkbox' id='resreq_check' value='false'>Automatic shipping for queue (BETA)</input>");
        MOBILE_LANDSCAPE || d.push("<input type='checkbox' id='showqd_check' value='false'>Show automatic delivery fleets</input>");
        MOBILE_LANDSCAPE || d.push("<input type='checkbox' id='overcharge_check' value='false'>Autoshipping will deliver 5% surplus</input>");
        MOBILE_LANDSCAPE || d.push("<input type='checkbox' id='autorcorrection_check' value='false'>Correction for autoroutes calculation</input>");
        MOBILE_LANDSCAPE || d.push("<input type='checkbox' id='autoover_check' value='false'>Ignore storage on autoroutes creation</input>");
        b += uiScheduler.settingsGroup(d);
        b += "<span id='span_copyright' class='white_text' style='position:absolute;font-size:80%; width: 98%; text-align:left;cursor:pointer;top:8%;left:2%'>\u00a9 2017 - version " + GAME_VERSION + GAME_SUB_VERSION + "</span><br><br>";
        b += "<span id='span_developer' class='white_text' style='position:absolute;font-size:80%; width: 98%; text-align:left;cursor:pointer;top:12%;left:2%'>Developed by Cheslava";
        MOBILE_LANDSCAPE;
        b += "</span><br><br><br><br>";
        b = MOBILE_LANDSCAPE ? b + "<span id='span_website' class='white_text' style='position:absolute;font-size:80%; width: 98%; text-align:left;cursor:pointer;top:16%;left:2%'><a target='_blank' href='javascript:window.JsJavaInterface.showPrivacyPolicy();'>Privacy policy</a></span><br><br>" : b + "<span id='span_website' class='white_text' style='position:absolute;font-size:80%; width: 98%; text-align:left;cursor:pointer;top:16%;left:2%'><a target='_blank' href='https://www.heartofgalaxy.com'>heartofgalaxy.com</a></span><br><br><span id='span_android' class='white_text' style='position:absolute;font-size:80%; width: 98%; text-align:left;cursor:pointer;top:20%;left:2%'><a target='_blank' href='https://play.google.com/store/apps/details?id=com.cheslavasoft.hog'><img style='width:10%;' src='https://play.google.com/intl/en/badges/images/generic/en_badge_web_generic.png'/></a></span><br><br>";
        MOBILE_LANDSCAPE && (b += "<span id='span_savedata' class='green_text' style='position:absolute;font-size:100%; width: 98%; text-align:left;cursor:pointer;top:20%;left:2%'><img style='position:relative;top:0px;width:32px;height:32px;' src='ui/save.png' class='icon' /> <span style='position:relative;top:-8px;'>Save game</span></span><br><br><span id='span_exportdata' class='green_text' style='position:absolute;font-size:100%; width: 98%; text-align:left;cursor:pointer;top:26%;left:2%'><img style='position:relative;top:0px;width:32px;height:32px;' src='ui/export.png' class='icon' /> <span style='position:relative;top:-8px;'>Import/Export game</span></span><br><br><span id='span_tuto' class='blue_text' style='position:absolute;font-size:100%; width: 98%; text-align:left;cursor:pointer;top:32%;left:2%'><img style='position:relative;top:0px;width:32px;height:32px;' src='ui/t.png' class='icon' /> <span style='position:relative;top:-8px;'>Tutorial</span></span><br><br>");
        document.getElementById("profile_info_list") && (document.getElementById("profile_info_list").innerHTML = b);
        addSettingCheck("tech_check", "techTree");
        addSettingCheck("notation_check", "scientificNotation");
        addSettingCheck("engnotation_check", "engineeringNotation");
        addSettingCheck("hidetut_check", "hideTutorial");
        addSettingCheck("allshipres_check", "allShipres");
        addSettingCheck("hpleft_check", "hpreport");
        addSettingCheck("resreq_check", "resourceRequest");
        addSettingCheck("usequeue_check", "useQueue");
        addSettingCheck("autoqueue_check", "autoQueue");
        addSettingCheck("showqd_check", "showqd");
        addSettingCheck("sortresname_check", "sortResName");
        addSettingCheck("showBuildingAid_check", "showBuildingAid");
        addSettingCheck("showMultipliers_check", "showMultipliers", "Shows cost multipliers for buildings and researches");
        addSettingCheck("rpspent_check", "showRPSpent");
        addSettingCheck("toastright_check", "toastRight");
        addSettingCheck("idle10_check", "idle10");
        addSettingCheck("overcharge_check", "overchargeShipping");
        addSettingCheck("advauto_check", "advancedAutoroute");
        addSettingCheck("shipsort_check", "shipSorted");
        addSettingCheck("autorcorrection_check", "autorcorrection");
        addSettingCheck("autoover_check", "autoover");
        addSettingCheck("cloud_check", "cloudSave");
        MOBILE_LANDSCAPE && ($("#span_exportdata").click(wa),
        $("#span_savedata").click(save),
        $("#span_tuto").click(startTutorial));
        $("#slide_master").change(function() {
            gameSettings.masterVolume = $(this).val();
            oa()
        });
        $("#slide_music").change(function() {
            gameSettings.musicVolume = $(this).val();
            N.v = $(this).val();
            oa()
        });
        $("#slide_effects").change(function() {
            gameSettings.soundVolume = $(this).val();
            oa()
        });
        $("#slide_textsize").change(function() {
            $(this).val() >= MIN_TEXT_SIZE && $(this).val() <= MAX_TEXT_SIZE && ($("body").css("font-size", $(this).val() * textSizeCSSfactor + "" + textSizeCSSunit),
            gameSettings.textSize = $(this).val())
        });
        $("#slide_techuiscale").change(function() {
            gameSettings.techuiScale = $(this).val()
        });
        $("#span_wipe").click(function() {
            var b = "";
            0 < userID && gameSettings.cloudSave && (b = " This will also delete your online save.");
            (new w(220,110,"<br><span class='red_text red_text_shadow'>Are you sure you want to wipe your data? You will lose ALL your progress!" + b + "</span>","confirm",function() {
                wipeData();
                save();
                0 < userID && exportSaveCloud();
                (new w(210,0,"<span class='red_text red_text_shadow'>Your data has been deleted!</span>","info")).drawToast();
                currentPopup.drop()
            }
            )).draw()
        });
        $("#queue_wipe").click(function() {
            for (var b = 0; b < planets.length; b++) {
                for (var d = 0; d < resNum; d++)
                    planets[b].resourcesRequest[d] = 0;
                planets[b].queue = {}
            }
            (new w(210,0,"<span class='blue_text'>Queues and automatic shipping reset</span>","info")).drawToast()
        });
        $("#span_logs").click(function() {
            V()
        });
        currentUpdater = function() {}
        ;
        K();
        $("#profile_interface").show();
        game.searchPlanet(currentPlanet.id) && $("#bottom_build_menu").show()
    }
    function V() {
        currentInterface = "logsInterface";
        for (var b = "", d = change_logs.length - 1; 0 <= d; d--)
            b += "<li style='height:" + (64 + 18 * change_logs[d].lines) + "px;'><div style='position:absolute;  left: 8px; width:98%;'>",
            b += "<br><br><span id='logs_title_" + d + "' class='blue_text' style='font-size:110%;text-align:center;width: 98%; float:left;cursor:pointer;'>**" + change_logs[d].title + "**</span><br><br>",
            b += "<span id='logs_" + d + "' class='white_text' style='width: 98%; float:left;cursor:pointer;'>" + change_logs[d].desc + "</span>",
            b += "</div></li>";
        document.getElementById("profile_info_list") && (document.getElementById("profile_info_list").innerHTML = b);
        currentUpdater = function() {}
        ;
        K();
        $("#profile_interface").show()
    }
    function M() {
        currentInterface = "tournamentInterface";
        var b = 0;
        null == qurisTournament.fleet && (b = generateQurisTournamentFleet());
        var d = qurisTournament.fleet
          , e = {
            cnt: 0,
            html: "<ul id='ship_info_list' style='position:absolute; text-align:right; top:48px; margin-top:16px; clear:both;'><div style='position:relative; left:8px;'><span class='red_text' style='float:left;margin-left:16px;font-size:120%;'>There is no enemy available</span></div></ul>"
        };
        0 <= b && (e = uiScheduler.fleetInfo(0, 0, d));
        b = "<li style='height:400px;'><div style='position:absolute;  left: 8px; width:98%;'><img src='" + UI_FOLDER + "/banners/quris.png' style='position:absolute;top:0%;left:0%;z-index:90;'/>";
        b += "<img src='" + UI_FOLDER + "/banners/quris.png' style='position:absolute;top:0%;right:0%'/><span style='position:absolute;top:0%;left:27%;font-size:300%;colohr:rgb(188,24,7);' class='red_text' id='tournament_title'>The Space Tournament</span><span style='position:absolute;top:64px;left:27%;font-size:100%;' class='blue_text'>Battle Points: <span class='white_text'>" + (qurisTournament.points + 1) + "</span></span><div style='position:absolute;top:64px;left:44%;font-size:100%;width:100px;height:24px;text-align:center;cursor:pointer;' class='green_button green_text' id='fight_button'>FIGHT</div></span></div></li>";
        var g = [], l;
        for (l in planets[tournamentPlanet].fleets) {
            var m = planets[tournamentPlanet].fleets[l];
            m && 0 != l && "hub" != l && m.civis == game.id && g.push(l)
        }
        b += "<li style='height:" + 16 * e.cnt + "px;width:100%' id='ally_li'>";
        b += "<img id='tour_load_icon' src='" + UI_FOLDER + "/load.png' class='icon_big' style='position:absolute;top:100px;left:27%;cursor:pointer;'/>";
        b += "<select id='orbit_fleet_list' style='position:absolute;top:108px;width:18%;left:30%;'>";
        if (0 == g.length)
            b += "<option value='n'>No friendly fleets on " + planets[tournamentPlanet].name + "!</option>";
        else
            for (b += "<option value='s'>Select a fleet</option>",
            l = 0; l < g.length; l++)
                m = planets[tournamentPlanet].fleets[g[l]],
                b += "<option value='" + g[l] + "'>" + m.name + " (" + beauty(m.value()) + ")</option>";
        b = b + "</select><div style='position:absolute;top:100px;left:25%;width:25%;' id='ally_fleet'></div></li>" + ("<li style='height:" + 16 * e.cnt + "px;width:100%;' id='enemy_li'>");
        b = b + "<span id='ship_info_name' class='red_text' style='position:absolute;top:100px;left:50%;width:25%;font-size:150%'>Opponent Fleet</span>" + ("<div style='position:absolute;top:100px;left:50%;width:25%;font-size:100%'>" + e.html + "</div></li>");
        b = b + "<li style='width:100%;height:auto;' id='report_li'>" + ("<span id='ship_info_name' class='blue_text' style='position:absolute;top:100px;left:33%;width:25%;font-size:150%'>Battle Report</span><img id='close_report' src='" + UI_FOLDER + "/x.png' style='width:32px;height:32px;left:67%;position:absolute;top:96px;cursor:pointer;'/>");
        b += "<div style='position:absolute;top:148px;left:25%;width:50%;font-size:100%' id='tournament_report'></div></li>";
        document.getElementById("profile_interface") && (document.getElementById("profile_info_list").innerHTML = b);
        $("#tournament_title").click(M);
        $("#fight_button").hide();
        $("#report_li").hide();
        $("#close_report").click(function() {
            M()
        });
        $("#tour_load_icon").hide();
        $("#orbit_fleet_list").change(function() {
            var b = $("#orbit_fleet_list").val();
            if (planets[tournamentPlanet].fleets[b]) {
                var d = uiScheduler.fleetInfo(0, 0, planets[tournamentPlanet].fleets[b])
                  , e = d.html;
                game.searchPlanet(tournamentPlanet) ? ($("#tour_load_icon").show(),
                $("#tour_load_icon").unbind(),
                currentFleetId = tournamentPlanet + "_" + b,
                $("#tour_load_icon").click(function() {
                    var b = currentFleetId.split("_")[1];
                    b = planets[tournamentPlanet].fleets[b];
                    b.planet = tournamentPlanet;
                    (new w(512,374,"<br><span class='blue_text text_shadow'>Select the amount of resources</span><br>","loadAmmoTour",b)).draw()
                })) : $("#tour_load_icon").hide();
                $("#ally_fleet").html(e);
                $("#ally_li").css("height", 48 + 16 * d.cnt + "px");
                d = qurisTournament.fleet.battle(planets[tournamentPlanet].fleets[b], !0);
                b = "";
                "atk" == d.winner ? (b += "<span class='green_text text_shadow'>Your fleet will win the battle!</span>",
                $("#fight_button").removeClass("red_button red_text"),
                $("#fight_button").removeClass("orange_button orange_text"),
                $("#fight_button").addClass("green_button green_text")) : "def" == d.winner ? (b += "<span class='red_text red_text_shadow'>Your fleet will lose the battle!</span>",
                $("#fight_button").addClass("red_button red_text"),
                $("#fight_button").removeClass("green_button green_text"),
                $("#fight_button").removeClass("orange_button orange_text")) : "draw" == d.winner && (b += "<span class='orange_text'>The battle will result in a draw!</span>",
                $("#fight_button").removeClass("red_button red_text"),
                $("#fight_button").removeClass("green_button green_text"),
                $("#fight_button").addClass("orange_button orange_text"));
                h("fight_button", b, 180);
                $("#fight_button").click(function() {
                    var b = $("#orbit_fleet_list").val()
                      , d = planets[tournamentPlanet].fleets[b]
                      , e = tournamentPlanet;
                    if (d) {
                        d = qurisTournament.fleet.battle(d, !1);
                        var g = d.r.split("<br>").length;
                        "atk" == d.winner ? (pop = new w(210,96,"<br><span class='blue_text text_shadow'>Your fleet won the battle!</span>","Ok"),
                        pop.draw(),
                        qurisTournament.points++) : "def" == d.winner ? (pop = new w(210,96,"<br><span class='red_text red_text_shadow'>Your fleet lost the battle!</span>","Ok"),
                        pop.draw(),
                        qurisTournament.lose++) : "draw" == d.winner && (pop = new w(210,96,"<br><span class='orange_text'>The battle resulted in a draw!</span>","Ok"),
                        pop.draw());
                        qurisTournament.fleet && 0 == qurisTournament.fleet.shipNum() && (qurisTournament.fleet = null);
                        0 == planets[e].fleets[b].shipNum() && delete planets[e].fleets[b];
                        $("#tournament_report").html(d.r);
                        $("#ally_li").hide();
                        $("#enemy_li").hide();
                        $("#fight_button").hide();
                        $("#report_li").show();
                        $("#report_li").css("height", 23 * g + "px")
                    } else
                        pop = new w(210,96,"<br><span class='red_text red_text_shadow'>Select a fleet!</span>","Info"),
                        pop.draw()
                });
                $("#fight_button").show();
                for (d = 0; d < ships.length; d++) {
                    b = $("#orbit_fleet_list").val();
                    var g = planets[tournamentPlanet].fleets[b];
                    0 < g.ships[d] && (e = d,
                    b = "<span class='blue_text'>Power: </span><span class='white_text'>" + beauty(ships[e].power) + "</span><br>",
                    b += "<span class='blue_text'>Weapon: </span><span class='white_text'>" + ships[e].weapon.capitalize() + "</span><br>",
                    b += "<span class='blue_text'>HPs: </span><span class='white_text'>" + beauty(ships[e].hp) + "</span><br>",
                    0 < ships[e].piercing && (b += "<span class='blue_text' style='float:left;margin-left:16px;'>Piercing Power: </span><span class='white_text'>" + Math.min(100, Math.floor(100 * ships[e].piercing) / 100) + "%</span><br>"),
                    0 < ships[e].shield && (b += "<span class='blue_text' style='float:left;margin-left:16px;'>Shields: </span><span class='white_text'>" + beauty(ships[e].shield) + "</span><br>"),
                    b += "<span class='blue_text'>Dmg Reduction: </span><span class='white_text'>" + Math.floor(100 * (100 - 100 / (1 + Math.log(1 + ships[e].armor * (1 + g.storage[resourcesName.armor.id] / (2 * mi)) / 1E4) / Math.log(2)))) / 100 + "%</span><br>",
                    b += "<span class='blue_text'>Speed: </span><span class='white_text'>" + Math.floor(100 * ships[e].speed * (1 + g.storage[resourcesName.engine.id] / 1E3 * 2E-4)) / 100 + "</span><br>",
                    b += "<span class='blue_text'>Weight: </span><span class='white_text'>" + beauty(ships[e].weight) + "</span><br>",
                    b += "<span class='blue_text'>Weight%: </span><span class='white_text'>" + Math.floor(ships[e].weight * g.ships[e] / g.weight() * 1E4) / 100 + "%</span><br>",
                    h("ship_name_infos_" + d, b, 140))
                }
                for (d = b = 0; d < ships.length; d++)
                    b += ships[d].power * g.ships[d];
                d = 10 * b * Math.log(1 + g.storage[resourcesName.ammunition.id] / (10 * mi)) / Math.log(2);
                e = 20 * b * Math.log(1 + g.storage[resourcesName["u-ammunition"].id] / (10 * mi)) / Math.log(2);
                var l = 60 * b * Math.log(1 + g.storage[resourcesName["t-ammunition"].id] / (20 * mi)) / Math.log(2);
                g = 1 + .1 * Math.log(1 + g.ships[14]) / Math.log(2);
                b = "<span class='blue_text'>Base Power: </span><span class='white_text'>" + beauty(b) + "</span><br>";
                b += "<span class='blue_text'>Ammo Bonus: </span><span class='white_text'>+" + beauty(d) + "</span><br>";
                b += "<span class='blue_text'>U-Ammo Bonus: </span><span class='white_text'>+" + beauty(e) + "</span><br>";
                b += "<span class='blue_text'>T-Ammo Bonus: </span><span class='white_text'>+" + beauty(l) + "</span><br>";
                b += "<span class='blue_text'>Admiral Bonus: </span><span class='white_text'>x" + beauty(g) + "</span><br>";
                h("ammo_bonus", b, 200)
            } else
                $("#ally_fleet").html(""),
                $("#fight_button").hide()
        });
        for (e = 0; e < ships.length; e++)
            d && 0 < d.ships[e] && (g = e,
            b = "<span class='blue_text'>Power: </span><span class='white_text'>" + beauty(ships[g].power) + "</span><br>",
            b += "<span class='blue_text'>Weapon: </span><span class='white_text'>" + ships[g].weapon.capitalize() + "</span><br>",
            b += "<span class='blue_text'>HPs: </span><span class='white_text'>" + beauty(ships[g].hp) + "</span><br>",
            0 < ships[g].piercing && (b += "<span class='blue_text' style='float:left;margin-left:16px;'>Piercing Power: </span><span class='white_text'>" + Math.min(100, Math.floor(100 * ships[g].piercing) / 100) + "%</span><br>"),
            0 < ships[g].shield && (b += "<span class='blue_text' style='float:left;margin-left:16px;'>Shields: </span><span class='white_text'>" + beauty(ships[g].shield) + "</span><br>"),
            b += "<span class='blue_text'>Dmg Reduction: </span><span class='white_text'>" + Math.floor(100 * (100 - 100 / (1 + Math.log(1 + ships[g].armor * (1 + d.storage[resourcesName.armor.id] / (2 * mi)) / 1E4) / Math.log(2)))) / 100 + "%</span><br>",
            b += "<span class='blue_text'>Speed: </span><span class='white_text'>" + Math.floor(100 * ships[g].speed * (1 + d.storage[resourcesName.engine.id] / 1E3 * 2E-4)) / 100 + "</span><br>",
            b += "<span class='blue_text'>Weight: </span><span class='white_text'>" + beauty(ships[g].weight) + "</span><br>",
            b += "<span class='blue_text'>Weight%: </span><span class='white_text'>" + Math.floor(ships[g].weight * d.ships[g] / d.weight() * 1E4) / 100 + "%</span><br>",
            h("ship_name_infos_" + e, b, 140));
        currentUpdater = function() {}
        ;
        K();
        $("#profile_interface").show();
        game.searchPlanet(currentPlanet.id) && $("#bottom_build_menu").show()
    }
    function G(b) {
        return "</span><span class='blue_text'>" + b + "</span><span class='white_text'>"
    }
    function O() {
        currentInterface = "resourcesOverview";
        currentUpdater = function() {}
        ;
        var b = 100;
        MOBILE_LANDSCAPE && (b = 170);
        var d = "<li id='empire_li' style='height:64px;width:100%'>" + ("<img src='" + UI_FOLDER + "/empire.png' class='planet_icon' style='align:center;cursor:pointer;'/>");
        d = d + ("<span class='blue_text' style='position:relative; top:-26px; left:8px; font-size: " + b + "%;cursor:pointer;'>Empire</span>") + ("<span class='blue_text' style='position:relative; top:-26px; left:32px; font-size: " + b + "%;cursor:pointer;width:100%' id='empire_overview' name='exp'>Show overview<img src='" + UI_FOLDER + "/arrow_down.png' style='position:relative; width:20px;height:20px;top:5px;left:4px' /></span>");
        d += "<div id='empire_overview_info' style='position:relative;left:10%;width:80%;'></div></li>";
        var e = [];
        for (b = 0; b < game.planets.length; b++)
            e.push({
                pid: game.planets[b],
                i: b
            });
        b = uiScheduler.templateList(uiScheduler.templatePlanetSelect, e);
        document.getElementById("planet_list") && (document.getElementById("planet_list").innerHTML = d + b.html);
        for (b = 0; b < game.planets.length; b++)
            planets[game.planets[b]].importExport(),
            d = game.planets[b],
            $("#planet_int_" + d).click(function() {
                C(planets[game.planets[parseInt($(this).attr("name"))]])
            }),
            $("#planet_img_" + d).click(function() {
                C(planets[game.planets[parseInt($(this).attr("name"))]])
            }),
            $("#planet_overview_" + d).click(function() {
                var b = $(this).attr("name").split("_")
                  , d = b[0];
                b = parseInt(b[1]);
                if ("exp" == d) {
                    var e = planets[b].rawProduction();
                    this.innerHTML = "Hide overview<img src='" + UI_FOLDER + "/arrow_up.png' style='position:relative; width:20px;height:20px;top:5px;left:4px' />";
                    $(this).attr("name", "hide_" + b);
                    d = 64;
                    for (var g = "", h = Array(resNum), l = 0; l < resNum; l++)
                        h[l] = l;
                    gameSettings.sortResName && (h = sortedResources);
                    for (l = 0; l < resNum; l++) {
                        var n = h[l];
                        resources[n].show(game) && (e[n] += planets[b].globalImport[n] - planets[b].globalExport[n],
                        g += "<div style='width:100%;height:24px' id='planet_res_" + b + "_" + n + "' name='" + b + "_" + n + "'><div class='button' style='height:24px;'><span class='blue_text' style='width:240px'>" + resources[n].name.capitalize() + ": </span><span class='blue_text' id='total_res_queue_" + b + "_" + n + "'>" + (0 < planets[b].resourcesRequest[n] ? " - requested by queue " + beauty(planets[b].resourcesRequest[n]) : "") + "</span><span class='white_text' style='float:right;margin-right:32px;'><span id='total_res_" + b + "_" + n + "'>" + beauty(planets[b].resources[n]) + " <span class='" + (0 <= e[n] ? 0 < e[n] ? "green_text" : "gray_text" : "red_text") + "'>(" + (0 < e[n] ? "+" : "") + beauty(e[n]) + "/s)</span></span><span class='blue_text' style='font-size:80%;cursor:pointer;padding-left:64px' id='res_overview_" + b + "_" + n + "' name='exp_" + b + "_" + n + "' >Show overview<img src='" + UI_FOLDER + "/arrow_down.png' style='position:relative; width:20px;height:20px;top:5px;left:4px' /></span></span>",
                        g += "</div><div id='planet_res_building_" + b + "_" + n + "' name='" + b + "_" + n + "' style='position:relative;left:10%;width:80%;'></div></div>",
                        d += 24)
                    }
                    h = planets[b].energyProduction() + planets[b].energyConsumption();
                    l = planets[b].energyMalus();
                    1 < l ? l = 1 : 0 > l && (l = 0);
                    n = "green_text";
                    .85 <= l && 1 > l ? n = "gold_text" : .85 > l && (n = "red_text");
                    g += "<div style='width:100%;height:24px' id='planet_res_" + b + "_energy' name='" + b + "_energy'><div class='button' style='height:24px;'><span class='blue_text' style='width:240px'>Energy: </span><span class='white_text' style='float:right;margin-right:32px;'><span id='total_res_" + b + "_energy'> <span class='" + n + "'>" + beauty(h) + " (" + Math.floor(1E4 * l) / 100 + "% efficiency)</span></span><span class='blue_text' style='font-size:80%;cursor:pointer;padding-left:64px' id='res_overview_" + b + "_energy' name='exp_" + b + "_energy' >Show overview<img src='" + UI_FOLDER + "/arrow_down.png' style='position:relative; width:20px;height:20px;top:5px;left:4px' /></span></span>";
                    e = e.researchPoint;
                    g = g + ("</div><div id='planet_res_building_" + b + "_energy' name='" + b + "_energy' style='position:relative;left:10%;width:80%;'></div></div>") + ("<div style='width:100%;height:24px' id='planet_res_" + b + "_research' name='" + b + "_research'><div class='button' style='height:24px;'><span class='blue_text' style='width:240px'>Research Points: </span><span class='white_text' style='float:right;margin-right:32px;'><span id='total_res_" + b + "_research'>" + beauty(game.researchPoint) + " <span class='" + (0 < e ? "green_text" : "gray_text") + "'>(" + beauty(e) + "/s)</span></span><span class='blue_text' style='font-size:80%;cursor:pointer;padding-left:64px' id='res_overview_" + b + "_research' name='exp_" + b + "_research' >Show overview<img src='" + UI_FOLDER + "/arrow_down.png' style='position:relative; width:20px;height:20px;top:5px;left:4px' /></span></span>");
                    g = g + ("</div><div id='planet_res_building_" + b + "_research' name='" + b + "_research' style='position:relative;left:10%;width:80%;'></div></div>") + "<br>";
                    d += 96;
                    document.getElementById("planet_overview_info_" + b) && (document.getElementById("planet_overview_info_" + b).innerHTML = g);
                    $("#planet" + b).css("height", d + "px");
                    overviewPlanetExpand[b] = !0;
                    for (n = 0; n < resNum; n++)
                        resources[n].show(game) && ($("#res_overview_" + b + "_" + n).unbind(),
                        $("#res_overview_" + b + "_" + n).click(function() {
                            var b = $(this).attr("name").split("_")
                              , d = b[0]
                              , e = parseInt(b[1]);
                            b = parseInt(b[2]);
                            if ("exp" == d) {
                                overviewResourceExpand[e][b] = !0;
                                d = "<div style='width:100%;height:8px'></div>";
                                for (var g = 52, h = 0; h < buildings.length; h++)
                                    if (0 != buildings[h].resourcesProd[b] && 0 < planets[e].structure[h].number) {
                                        g += 20;
                                        var l = buildings[h].production(planets[e])[b];
                                        d += "<div style='width:100%;height:20px' class='button' id='planet_res_" + e + "_" + b + "_" + h + "' name='" + e + "_" + b + "'>";
                                        d = planets[e].structure[h].active ? d + ("<img id='planet_shut_" + e + "_" + h + "' name='" + e + "_" + h + "' src='" + UI_FOLDER + "/act.png' style='z-index:10;width:16px;height:16px;position:relative;top:3px;left:-2px;' style='cursor:pointer;'/>") : d + ("<img id='planet_shut_" + e + "_" + h + "' name='" + e + "_" + h + "' src='" + UI_FOLDER + "/shut.png' style='z-index:10;width:16px;height:16px;position:relative;top:3px;left:-2px;' style='cursor:pointer;'/>");
                                        d += "<span class='blue_text' style='width:240px'>" + buildings[h].displayName + " <span class='white_text'>" + planets[e].structure[h].number + "</span> </span><span class='white_text' style='float:right;margin-right:320px;'><span class='" + (0 <= l ? 0 < l ? "green_text" : "gray_text" : "red_text") + "'>(" + (0 < l ? "+" : "") + beauty(l) + "/s)</span></span></div>"
                                    }
                                l = planets[e].globalImport[b] - planets[e].globalExport[b];
                                d = d + "<div style='width:100%;height:20px'></div>" + ("<div style='width:100%;height:20px' class='button' id='planet_res_" + e + "_" + b + "_import' name='" + e + "_" + b + "'><span class='blue_text' style='width:240px'>Import/Export </span><span class='white_text' style='float:right;margin-right:320px;'><span class='" + (0 <= l ? 0 < l ? "green_text" : "gray_text" : "red_text") + "'>(" + (0 < l ? "+" : "") + beauty(l) + "/s)</span></span></div>");
                                g += 20;
                                $("#planet_res_" + e + "_" + b).css("height", g + "px");
                                h = parseInt($("#planet" + e).css("height").split("px")[0]);
                                $("#planet" + e).css("height", h + g + "px");
                                document.getElementById("planet_res_building_" + e + "_" + b) && (document.getElementById("planet_res_building_" + e + "_" + b).innerHTML = d);
                                this.innerHTML = "Hide overview<img src='" + UI_FOLDER + "/arrow_up.png' style='position:relative; width:20px;height:20px;top:5px;left:4px' />";
                                $(this).attr("name", "hide_" + e + "_" + b)
                            } else
                                overviewResourceExpand[e][b] = !1,
                                this.innerHTML = "Show overview<img src='" + UI_FOLDER + "/arrow_down.png' style='position:relative; width:20px;height:20px;top:5px;left:4px' />",
                                $(this).attr("name", "exp_" + e + "_" + b),
                                g = parseInt($("#planet_res_" + e + "_" + b).css("height").split("px")[0]),
                                h = parseInt($("#planet" + e).css("height").split("px")[0]),
                                d = 0 < h - g ? h - g : 0,
                                $("#planet" + e).css("height", d + "px"),
                                $("#planet_res_" + e + "_" + b).css("height", "24px"),
                                document.getElementById("planet_res_building_" + e + "_" + b) && (document.getElementById("planet_res_building_" + e + "_" + b).innerHTML = "")
                        }),
                        $("#res_overview_" + b + "_energy").unbind(),
                        $("#res_overview_" + b + "_energy").click(function() {
                            var b = $(this).attr("name").split("_")
                              , d = b[0];
                            b = parseInt(b[1]);
                            if ("exp" == d) {
                                overviewResourceExpand[b].energy = !0;
                                d = "<div style='width:100%;height:8px'></div>";
                                for (var e = 32, g = 0; g < buildings.length; g++)
                                    if (0 != buildings[g].energy && 0 < planets[b].structure[g].number) {
                                        e += 20;
                                        var h = buildings[g].production(planets[b]).energy;
                                        d += "<div style='width:100%;height:20px' class='button' id='planet_res_" + b + "_energy_" + g + "' name='" + b + "_energy'><span class='blue_text' style='width:240px'>" + buildings[g].displayName + " <span class='white_text'>" + planets[b].structure[g].number + "</span> </span><span class='white_text' style='float:right;margin-right:320px;'><span class='" + (0 <= h ? 0 < h ? "green_text" : "gray_text" : "red_text") + "'>(" + (0 < h ? "+" : "") + beauty(h) + "/s)</span></span></div>"
                                    }
                                d += "</div>";
                                $("#planet_res_" + b + "_energy").css("height", e + "px");
                                g = parseInt($("#planet" + b).css("height").split("px")[0]);
                                $("#planet" + b).css("height", g + e + "px");
                                document.getElementById("planet_res_building_" + b + "_energy") && (document.getElementById("planet_res_building_" + b + "_energy").innerHTML = d);
                                this.innerHTML = "Hide overview<img src='" + UI_FOLDER + "/arrow_up.png' style='position:relative; width:20px;height:20px;top:5px;left:4px' />";
                                $(this).attr("name", "hide_" + b + "_energy")
                            } else
                                overviewResourceExpand[b].energy = !1,
                                this.innerHTML = "Show overview<img src='" + UI_FOLDER + "/arrow_down.png' style='position:relative; width:20px;height:20px;top:5px;left:4px' />",
                                $(this).attr("name", "exp_" + b + "_energy"),
                                e = parseInt($("#planet_res_" + b + "_energy").css("height").split("px")[0]),
                                g = parseInt($("#planet" + b).css("height").split("px")[0]),
                                d = 0 < g - e ? g - e : 0,
                                $("#planet" + b).css("height", d + "px"),
                                $("#planet_res_" + b + "_energy").css("height", "24px"),
                                document.getElementById("planet_res_building_" + b + "_energy") && (document.getElementById("planet_res_building_" + b + "_energy").innerHTML = "")
                        }),
                        $("#res_overview_" + b + "_research").unbind(),
                        $("#res_overview_" + b + "_research").click(function() {
                            var b = $(this).attr("name").split("_")
                              , d = b[0];
                            b = parseInt(b[1]);
                            if ("exp" == d) {
                                overviewResourceExpand[b].research = !0;
                                d = "<div style='width:100%;height:8px'></div>";
                                for (var e = 32, g = 0; g < buildings.length; g++)
                                    if (0 != buildings[g].researchPoint && 0 < planets[b].structure[g].number) {
                                        e += 20;
                                        var h = buildings[g].production(planets[b]).researchPoint;
                                        d += "<div style='width:100%;height:20px' class='button' id='planet_res_" + b + "_research_" + g + "' name='" + b + "_research'><span class='blue_text' style='width:240px'>" + buildings[g].displayName + " <span class='white_text'>" + planets[b].structure[g].number + "</span> </span><span class='white_text' style='float:right;margin-right:320px;'><span class='" + (0 <= h ? 0 < h ? "green_text" : "gray_text" : "red_text") + "'>(" + (0 < h ? "+" : "") + beauty(h) + "/s)</span></span></div>"
                                    }
                                d += "</div>";
                                $("#planet_res_" + b + "_research").css("height", e + "px");
                                g = parseInt($("#planet" + b).css("height").split("px")[0]);
                                $("#planet" + b).css("height", g + e + "px");
                                $("#planet_res_building_" + b + "_research").html(d);
                                this.innerHTML = "Hide overview<img src='" + UI_FOLDER + "/arrow_up.png' style='position:relative; width:20px;height:20px;top:5px;left:4px' />";
                                $(this).attr("name", "hide_" + b + "_research")
                            } else
                                overviewResourceExpand[b].research = !1,
                                this.innerHTML = "Show overview<img src='" + UI_FOLDER + "/arrow_down.png' style='position:relative; width:20px;height:20px;top:5px;left:4px' />",
                                $(this).attr("name", "exp_" + b + "_research"),
                                e = parseInt($("#planet_res_" + b + "_research").css("height").split("px")[0]),
                                g = parseInt($("#planet" + b).css("height").split("px")[0]),
                                d = 0 < g - e ? g - e : 0,
                                $("#planet" + b).css("height", d + "px"),
                                $("#planet_res_" + b + "_research").css("height", "24px"),
                                $("#planet_res_building_" + b + "_research").html("")
                        }))
                } else
                    overviewPlanetExpand[b] = !1,
                    this.innerHTML = "Show overview<img src='" + UI_FOLDER + "/arrow_down.png' style='position:relative; width:20px;height:20px;top:5px;left:4px' />",
                    $(this).attr("name", "exp_" + b),
                    $("#planet" + b).css("height", "64px"),
                    document.getElementById("planet_overview_info_" + b) && (document.getElementById("planet_overview_info_" + b).innerHTML = "")
            });
        $("#empire_overview").click(function() {
            if ("exp" == $(this).attr("name")) {
                for (var b = Array(resNum + 1), d = Array(resNum), e = 0; e < resNum; e++)
                    b[e] = 0,
                    d[e] = 0;
                for (var g = b.researchPoint = 0; g < game.planets.length; g++) {
                    var h = planets[game.planets[g]].rawProduction();
                    for (e = 0; e < resNum; e++)
                        b[e] += h[e],
                        d[e] += planets[game.planets[g]].resources[e];
                    b.researchPoint += h.researchPoint
                }
                this.innerHTML = "Hide overview<img src='" + UI_FOLDER + "/arrow_up.png' style='position:relative; width:20px;height:20px;top:5px;left:4px' />";
                $(this).attr("name", "hide");
                g = 64;
                h = "";
                for (var l = Array(resNum), n = 0; n < resNum; n++)
                    l[n] = n;
                gameSettings.sortResName && (l = sortedResources);
                for (n = 0; n < resNum; n++)
                    e = l[n],
                    resources[e].show(game) && (h += "<div style='width:100%;height:24px' id='empire_res_" + e + "' name='" + e + "'><div class='button' style='height:24px;'><span class='blue_text' style='width:240px'>" + resources[e].name.capitalize() + ": </span><span class='white_text' style='float:right;margin-right:32px;'><span id='total_res_empire_" + e + "'>" + beauty(d[e]) + " <span class='" + (0 <= b[e] ? 0 < b[e] ? "green_text" : "gray_text" : "red_text") + "'>(" + (0 < b[e] ? "+" : "") + beauty(b[e]) + "/s)</span></span><span class='blue_text' style='font-size:80%;cursor:pointer;padding-left:64px' id='res_overview_empire_" + e + "' name='exp_" + e + "' >Show overview<img src='" + UI_FOLDER + "/arrow_down.png' style='position:relative; width:20px;height:20px;top:5px;left:4px' /></span></span>",
                    h += "</div><div id='empire_res_building_" + e + "' name='" + e + "' style='position:relative;left:10%;width:80%;'></div></div>",
                    g += 24);
                b = b.researchPoint;
                h += "<div style='width:100%;height:24px' id='empire_res_research' name='empire_research'><div class='button' style='height:24px;'><span class='blue_text' style='width:240px'>Research Points: </span><span class='white_text' style='float:right;margin-right:32px;'><span id='total_res_empire_research'>" + beauty(game.researchPoint) + " <span class='" + (0 < b ? "green_text" : "gray_text") + "'>(" + beauty(b) + "/s)</span></span><span class='blue_text' style='font-size:80%;cursor:pointer;padding-left:64px' id='res_overview_empire_research' name='exp_empire_research' >Show overview<img src='" + UI_FOLDER + "/arrow_down.png' style='position:relative; width:20px;height:20px;top:5px;left:4px' /></span></span>";
                h += "</div><div id='empire_res_building_research' name='empire_research' style='position:relative;left:10%;width:80%;'></div></div><br>";
                g += 96;
                document.getElementById("empire_overview_info") && (document.getElementById("empire_overview_info").innerHTML = h);
                $("#empire_li").css("height", g + "px");
                overviewPlanetExpand.empire = !0;
                for (e = 0; e < resNum; e++)
                    resources[e].show(game) && ($("#res_overview_empire_" + e).unbind(),
                    $("#res_overview_empire_" + e).click(function() {
                        var b = $(this).attr("name").split("_")
                          , d = b[0];
                        b = parseInt(b[1]);
                        if ("exp" == d) {
                            overviewResourceExpand.empire[b] = !0;
                            for (var e, g = Array(buildings.length), h = 0; h < buildings.length; h++)
                                g[h] = 0;
                            for (var l = 0; l < game.planets.length; l++)
                                for (h = 0; h < buildings.length; h++)
                                    0 != buildings[h].resourcesProd[b] && (g[h] += planets[game.planets[l]].structure[h].number);
                            d = "<div style='width:100%;height:8px'></div><br><span class='blue_text' style='width:100%; font-size:110%; text-align:center;'>Buildings</span><div style='width:100%;height:20px'></div>";
                            e = 112;
                            for (h = 0; h < buildings.length; h++)
                                if (0 < g[h]) {
                                    e += 20;
                                    var n = 0;
                                    for (l = 0; l < game.planets.length; l++)
                                        n += buildings[h].production(planets[game.planets[l]])[b];
                                    d += "<div style='width:100%;height:20px' class='button' id='empire_res_" + b + "_" + h + "' name='" + b + "'><span class='blue_text' style='width:240px'>" + buildings[h].displayName + " <span class='white_text'>" + g[h] + "</span> </span><span class='white_text' style='float:right;margin-right:320px;'><span class='" + (0 <= n ? 0 < n ? "green_text" : "gray_text" : "red_text") + "'>(" + (0 < n ? "+" : "") + beauty(n) + "/s)</span></span></div>"
                                }
                            d += "<div style='width:100%;height:20px'></div><span class='blue_text' style='width:100%; font-size:110%; text-align:center;'>Planets</span><div style='width:100%;height:20px'></div>";
                            e += 60;
                            g = [];
                            for (h = 0; h < game.planets.length; h++)
                                g.push(planets[game.planets[h]]);
                            g.sort(function(b, d) {
                                return b.name > d.name ? 1 : -1
                            });
                            for (h = 0; h < game.planets.length; h++)
                                if (l = g[h],
                                0 < l.resources[b]) {
                                    e += 20;
                                    var m = b;
                                    n = l.rawProduction()[m];
                                    l.importExport();
                                    var u = l.globalImport[m] - l.globalExport[m];
                                    n = "<span class='white_text' style='margin-righ:16px;font-size:80%'>" + beauty(l.resources[m]) + " <span class='" + (0 <= n ? 0 < n ? "green_text" : "gray_text" : "red_text oblique_txt") + "'>(" + (0 < n ? "+" : "") + beauty(n) + "/s)</span>";
                                    0 != u && (n += "<span class='" + (0 <= u ? 0 < u ? "purple_text" : "gray_text" : "pink_text oblique_txt") + "'> (" + (0 < u ? "+" : "") + beauty(u) + "/s)</span>");
                                    MOBILE_LANDSCAPE && 0 < game.planets.length && 0 != game.totalProd[m] && (n += "<span class='" + (0 <= game.totalProd[m] ? 0 < game.totalProd[m] ? "purple_text" : "gray_text" : "pink_text oblique_txt") + "'> (" + (0 < game.totalProd[m] ? "+" : "") + beauty(game.totalProd[m]) + "/s)</span>");
                                    gameSettings.populationEnabled && m == FOOD_RESOURCE && 0 < (l.population - l.sustainable()) / 5E3 && (n += "<span class='gold_text'>(-" + beauty((l.population - l.sustainable()) / 5E3) + "/s)</span>");
                                    n += "</span>";
                                    d += "<div style='width:100%;height:20px' class='button' id='empire_res_plt_" + b + "_" + l.id + "' plt='" + l.id + "' name='" + b + "'><img src='" + IMG_FOLDER + "/" + l[PLANET_IMG_FIELD] + (1 == PLANET_FOLDER_DOUBLE ? "/" + l[PLANET_IMG_FIELD] : "") + ".png' style='height:20px;width:20px;position:relative;top:6px;'/><span id='empire_res_plt_ov_" + l.id + "' name='" + l.id + "' class='blue_text' style='width:240px'>" + l.name + ":</span><span style='float:right;margin-right:320px;'>" + n + "</span></div>"
                                }
                            $("#empire_res_" + b).css("height", e + "px");
                            n = parseInt($("#empire_li").css("height").split("px")[0]);
                            $("#empire_li").css("height", n + e + "px");
                            document.getElementById("empire_res_building_" + b) && (document.getElementById("empire_res_building_" + b).innerHTML = d);
                            this.innerHTML = "Hide overview<img src='" + UI_FOLDER + "/arrow_up.png' style='position:relative; width:20px;height:20px;top:5px;left:4px' />";
                            $(this).attr("name", "hide_" + b);
                            for (h = 0; h < game.planets.length; h++)
                                l = g[h],
                                $("#empire_res_plt_" + b + "_" + l.id).click(function() {
                                    var b = $(this).attr("plt");
                                    b && C(planets[b])
                                })
                        } else
                            overviewResourceExpand.empire[b] = !1,
                            this.innerHTML = "Show overview<img src='" + UI_FOLDER + "/arrow_down.png' style='position:relative; width:20px;height:20px;top:5px;left:4px' />",
                            $(this).attr("name", "exp_" + b),
                            e = parseInt($("#empire_res_" + b).css("height").split("px")[0]),
                            n = parseInt($("#empire_li").css("height").split("px")[0]),
                            d = 0 < n - e ? n - e : 0,
                            $("#empire_li").css("height", d + "px"),
                            $("#empire_res_" + b).css("height", "24px"),
                            document.getElementById("empire_res_building_" + b) && (document.getElementById("empire_res_building_" + b).innerHTML = "")
                    }),
                    $("#res_overview_empire_research").unbind(),
                    $("#res_overview_empire_research").click(function() {
                        if ("exp" == $(this).attr("name").split("_")[0]) {
                            overviewResourceExpand.empire.research = !0;
                            for (var b, d, g = Array(buildings.length), h = 0; h < buildings.length; h++)
                                g[h] = 0;
                            for (var l = 0; l < game.planets.length; l++)
                                for (h = 0; h < buildings.length; h++)
                                    0 != buildings[h].researchPoint && (g[h] += planets[game.planets[l]].structure[h].number);
                            b = "<div style='width:100%;height:8px'></div><br><span class='blue_text' style='width:100%; font-size:110%; text-align:center;'>Buildings</span><div style='width:100%;height:20px'></div>";
                            d = 92;
                            for (h = 0; h < buildings.length; h++)
                                if (0 < g[h]) {
                                    d += 20;
                                    var n = 0;
                                    for (l = 0; l < game.planets.length; l++)
                                        n += buildings[h].production(planets[game.planets[l]]).researchPoint;
                                    b += "<div style='width:100%;height:20px' class='button' id='empire_res_research_" + h + "' name='empire_research'><span class='blue_text' style='width:240px'>" + buildings[h].displayName + " <span class='white_text'>" + g[h] + "</span> </span><span class='white_text' style='float:right;margin-right:320px;'><span class='" + (0 <= n ? 0 < n ? "green_text" : "gray_text" : "red_text") + "'>(" + (0 < n ? "+" : "") + beauty(n) + "/s)</span></span></div>"
                                }
                            b += "<div style='width:100%;height:20px'></div><span class='blue_text' style='width:100%; font-size:110%; text-align:center;'>Planets</span><div style='width:100%;height:20px'></div>";
                            d += 60;
                            g = [];
                            for (h = 0; h < game.planets.length; h++)
                                g.push(planets[game.planets[h]]);
                            g.sort(function(b, d) {
                                return b.name > d.name ? 1 : -1
                            });
                            for (h = 0; h < game.planets.length; h++)
                                l = g[h],
                                n = l.rawProduction().researchPoint,
                                0 < n && (d += 20,
                                n = "<span class='white_text' style='margin-righ:16px;font-size:80%'><span class='" + (0 <= n ? 0 < n ? "green_text" : "gray_text" : "red_text oblique_txt") + "'>(" + (0 < n ? "+" : "") + beauty(n) + "/s)</span>",
                                n += "</span>",
                                b += "<div style='width:100%;height:20px' class='button' id='empire_res_research_plt_" + l.id + "' name='" + e + "'><img src='" + IMG_FOLDER + "/" + l[PLANET_IMG_FIELD] + (1 == PLANET_FOLDER_DOUBLE ? "/" + l[PLANET_IMG_FIELD] : "") + ".png' style='height:20px;width:20px;position:relative;top:6px;'/><span id='empire_res_research_plt_ov_" + l.id + "' class='blue_text' style='width:240px'>" + l.name + ":</span><span style='float:right;margin-right:320px;'>" + n + "</span></div>");
                            b += "</div>";
                            $("#empire_res_research").css("height", d + "px");
                            n = parseInt($("#empire_li").css("height").split("px")[0]);
                            $("#empire_li").css("height", n + d + "px");
                            document.getElementById("empire_res_building_research") && (document.getElementById("empire_res_building_research").innerHTML = b);
                            this.innerHTML = "Hide overview<img src='" + UI_FOLDER + "/arrow_up.png' style='position:relative; width:20px;height:20px;top:5px;left:4px' />";
                            $(this).attr("name", "hide_research")
                        } else
                            overviewResourceExpand.empire.research = !1,
                            this.innerHTML = "Show overview<img src='" + UI_FOLDER + "/arrow_down.png' style='position:relative; width:20px;height:20px;top:5px;left:4px' />",
                            $(this).attr("name", "exp_research"),
                            d = parseInt($("#empire_res_research").css("height").split("px")[0]),
                            n = parseInt($("#empire_li").css("height").split("px")[0]),
                            b = 0 < n - d ? n - d : 0,
                            $("#empire_li").css("height", b + "px"),
                            $("#empire_res_research").css("height", "24px"),
                            document.getElementById("empire_res_building_research") && (document.getElementById("empire_res_building_research").innerHTML = "")
                    }))
            } else
                this.innerHTML = "Show overview<img src='" + UI_FOLDER + "/arrow_down.png' style='position:relative; width:20px;height:20px;top:5px;left:4px' />",
                $(this).attr("name", "exp"),
                $("#empire_li").css("height", "64px"),
                document.getElementById("empire_overview_info") && (document.getElementById("empire_overview_info").innerHTML = ""),
                overviewPlanetExpand.empire = !1
        });
        for (b = 0; b < game.planets.length; b++)
            if (d = game.planets[b],
            overviewPlanetExpand[d]) {
                $("#planet_overview_" + b).click();
                for (e = 0; e < resNum; e++)
                    overviewResourceExpand[d][e] && $("#res_overview_" + d + "_" + e).click();
                overviewResourceExpand[d].energy && $("#res_overview_" + d + "_energy").click();
                overviewResourceExpand[d].research && $("#res_overview_" + d + "_research").click()
            }
        if (overviewPlanetExpand.empire) {
            $("#empire_overview").click();
            for (e = 0; e < resNum; e++)
                overviewResourceExpand.empire[e] && $("#res_overview_empire_" + e).click();
            overviewResourceExpand.empire.research && $("#res_overview_empire_research").click()
        }
        currentUpdater = function() {
            (new Date).getTime();
            for (var b = 0; b < game.planets.length; b++) {
                var d = game.planets[b];
                if (overviewPlanetExpand[d]) {
                    planets[d].importExport();
                    for (var e = planets[d].rawProduction(), g = Array(resNum), h = 0; h < resNum; h++)
                        g[h] = h;
                    gameSettings.sortResName && (g = sortedResources);
                    for (var l = 0; l < resNum; l++)
                        h = g[l],
                        resources[h].show(game) && (e[h] += planets[d].globalImport[h] - planets[d].globalExport[h],
                        document.getElementById("total_res_" + d + "_" + h) && (document.getElementById("total_res_" + d + "_" + h).innerHTML = beauty(planets[d].resources[h]) + " <span class='" + (0 <= e[h] ? 0 < e[h] ? "green_text" : "gray_text" : "red_text") + "'>(" + (0 < e[h] ? "+" : "") + beauty(e[h]) + "/s)</span>"),
                        document.getElementById("total_res_queue_" + d + "_" + h) && (document.getElementById("total_res_queue_" + d + "_" + h).innerHTML = 0 < planets[d].resourcesRequest[h] ? " - requested by queue " + beauty(planets[d].resourcesRequest[h]) : ""));
                    h = planets[d].energyProduction() + planets[d].energyConsumption();
                    g = planets[d].energyMalus();
                    1 < g ? g = 1 : 0 > g && (g = 0);
                    l = "green_text";
                    .85 <= g && 1 > g ? l = "gold_text" : .85 > g && (l = "red_text");
                    document.getElementById("total_res_" + d + "_energy") && (document.getElementById("total_res_" + d + "_energy").innerHTML = "<span class='" + l + "'>" + beauty(h) + " (" + Math.floor(1E4 * g) / 100 + "% efficiency)</span>");
                    e = e.researchPoint;
                    document.getElementById("total_res_" + d + "_research") && (document.getElementById("total_res_" + d + "_research").innerHTML = "" + beauty(game.researchPoint) + " <span class='" + (0 < e ? "green_text" : "gray_text") + "'>(" + beauty(e) + "/s)</span>");
                    for (h = 0; h < resNum; h++)
                        if (overviewResourceExpand[d][h]) {
                            for (var n = 0; n < buildings.length; n++)
                                0 != buildings[n].resourcesProd[h] && 0 < planets[d].structure[n].number && (e = buildings[n].production(planets[d])[h],
                                l = "",
                                l = planets[d].structure[n].active ? l + ("<img id='planet_shut_" + d + "_" + h + "_" + n + "' name='" + d + "_" + n + "' src='" + UI_FOLDER + "/act.png' style='z-index:10;width:16px;height:16px;position:relative;top:3px;left:-2px;' style='cursor:pointer;'/>") : l + ("<img id='planet_shut_" + d + "_" + h + "_" + n + "' name='" + d + "_" + n + "' src='" + UI_FOLDER + "/shut.png' style='z-index:10;width:16px;height:16px;position:relative;top:3px;left:-2px;' style='cursor:pointer;'/>"),
                                l += "<span class='blue_text' style='width:240px'>" + buildings[n].displayName + " <span class='white_text'>" + planets[d].structure[n].number + "</span> </span><span class='white_text' style='float:right;margin-right:320px;'><span class='" + (0 <= e ? 0 < e ? "green_text" : "gray_text" : "red_text") + "'>(" + (0 < e ? "+" : "") + beauty(e) + "/s)</span></span>",
                                $("#planet_res_" + d + "_" + h + "_" + n).html(l),
                                document.getElementById("planet_res_" + d + "_" + h + "_" + n) && (document.getElementById("planet_res_" + d + "_" + h + "_" + n).innerHTML = l),
                                $("#planet_shut_" + d + "_" + h + "_" + n).unbind(),
                                $("#planet_shut_" + d + "_" + h + "_" + n).click(function() {
                                    var b = $(this).attr("name").split("_")
                                      , d = parseInt(b[0]);
                                    b = parseInt(b[1]);
                                    planets[d].structure[b].active = !planets[d].structure[b].active
                                }));
                            e = planets[d].globalImport[h] - planets[d].globalExport[h];
                            $("#planet_res_" + d + "_" + h + "_import").html("<span class='blue_text' style='width:240px'>Import/Export </span><span class='white_text' style='float:right;margin-right:320px;'><span class='" + (0 <= e ? 0 < e ? "green_text" : "gray_text" : "red_text") + "'>(" + (0 < e ? "+" : "") + beauty(e) + "/s)</span></span>")
                        }
                    if (overviewResourceExpand[d].energy)
                        for (n = 0; n < buildings.length; n++)
                            0 != buildings[n].energy && 0 < planets[d].structure[n].number && (e = buildings[n].production(planets[d]).energy,
                            $("#planet_res_" + d + "_energy_" + n).html("<span class='blue_text' style='width:240px'>" + buildings[n].displayName + " <span class='white_text'>" + planets[d].structure[n].number + "</span> </span><span class='white_text' style='float:right;margin-right:320px;'><span class='" + (0 <= e ? 0 < e ? "green_text" : "gray_text" : "red_text") + "'>(" + (0 < e ? "+" : "") + beauty(e) + "/s)</span></span>"));
                    if (overviewResourceExpand[d].research)
                        for (n = 0; n < buildings.length; n++)
                            0 != buildings[n].researchPoint && 0 < planets[d].structure[n].number && (e = buildings[n].production(planets[d]).researchPoint,
                            $("#planet_res_" + d + "_research_" + n).html("<span class='blue_text' style='width:240px'>" + buildings[n].displayName + " <span class='white_text'>" + planets[d].structure[n].number + "</span> </span><span class='white_text' style='float:right;margin-right:320px;'><span class='" + (0 <= e ? 0 < e ? "green_text" : "gray_text" : "red_text") + "'>(" + (0 < e ? "+" : "") + beauty(e) + "/s)</span></span>"))
                }
            }
            if (overviewPlanetExpand.empire) {
                d = [];
                for (n = 0; n < game.planets.length; n++)
                    d.push(planets[game.planets[n]]);
                d.sort(function(b, d) {
                    return b.name > d.name ? 1 : -1
                });
                e = Array(resNum);
                g = Array(resNum);
                for (h = 0; h < resNum; h++)
                    e[h] = 0,
                    g[h] = 0;
                for (b = e.researchPoint = 0; b < game.planets.length; b++) {
                    l = planets[game.planets[b]].rawProduction();
                    for (h = 0; h < resNum; h++)
                        resources[h].show(game) && (e[h] += l[h],
                        g[h] += planets[game.planets[b]].resources[h],
                        document.getElementById("total_res_empire_" + h) && (document.getElementById("total_res_empire_" + h).innerHTML = beauty(g[h]) + " <span class='" + (0 <= e[h] ? 0 < e[h] ? "green_text" : "gray_text" : "red_text") + "'>(" + (0 < e[h] ? "+" : "") + beauty(e[h]) + "/s)</span>"));
                    e.researchPoint += l.researchPoint
                }
                e = e.researchPoint;
                document.getElementById("total_res_empire_research") && (document.getElementById("total_res_empire_research").innerHTML = "" + beauty(game.researchPoint) + " <span class='" + (0 < e ? "green_text" : "gray_text") + "'>(" + beauty(e) + "/s)</span>");
                g = Array(buildings.length);
                for (n = 0; n < buildings.length; n++)
                    g[n] = 0;
                for (b = 0; b < game.planets.length; b++)
                    for (n = 0; n < buildings.length; n++)
                        0 != buildings[n].resourcesProd[h] && (g[n] += planets[game.planets[b]].structure[n].number);
                for (h = 0; h < resNum; h++)
                    if (overviewResourceExpand.empire[h]) {
                        for (n = 0; n < buildings.length; n++)
                            if (0 < g[n]) {
                                for (b = e = 0; b < game.planets.length; b++)
                                    e += buildings[n].production(planets[game.planets[b]])[h];
                                $("#empire_res_" + h + "_" + n).html("<span class='blue_text' style='width:240px'>" + buildings[n].displayName + " <span class='white_text'>" + g[n] + "</span> </span><span class='white_text' style='float:right;margin-right:320px;'><span class='" + (0 <= e ? 0 < e ? "green_text" : "gray_text" : "red_text") + "'>(" + (0 < e ? "+" : "") + beauty(e) + "/s)</span></span>")
                            }
                        for (n = 0; n < game.planets.length; n++) {
                            var m = d[n];
                            0 < m.resources[h] && (b = h,
                            e = m.rawProduction()[b],
                            m.importExport(),
                            l = m.globalImport[b] - m.globalExport[b],
                            e = "<span class='white_text' style='margin-righ:16px;font-size:80%'>" + beauty(m.resources[b]) + " <span class='" + (0 <= e ? 0 < e ? "green_text" : "gray_text" : "red_text oblique_txt") + "'>(" + (0 < e ? "+" : "") + beauty(e) + "/s)</span>",
                            0 != l && (e += "<span class='" + (0 <= l ? 0 < l ? "purple_text" : "gray_text" : "pink_text oblique_txt") + "'> (" + (0 < l ? "+" : "") + beauty(l) + "/s)</span>"),
                            MOBILE_LANDSCAPE && 0 < game.planets.length && 0 != game.totalProd[b] && (e += "<span class='" + (0 <= game.totalProd[b] ? 0 < game.totalProd[b] ? "purple_text" : "gray_text" : "pink_text oblique_txt") + "'> (" + (0 < game.totalProd[b] ? "+" : "") + beauty(game.totalProd[b]) + "/s)</span>"),
                            gameSettings.populationEnabled && b == FOOD_RESOURCE && 0 < (m.population - m.sustainable()) / 5E3 && (e += "<span class='gold_text'>(-" + beauty((m.population - m.sustainable()) / 5E3) + "/s)</span>"),
                            e += "</span>",
                            l = "<img src='" + IMG_FOLDER + "/" + m[PLANET_IMG_FIELD] + (1 == PLANET_FOLDER_DOUBLE ? "/" + m[PLANET_IMG_FIELD] : "") + ".png' style='height:20px;width:20px;position:relative;top:6px;'/><span id='empire_res_plt_ov_" + m.id + "' class='blue_text' style='width:240px'>" + m.name + ":</span><span style='float:right;margin-right:320px;'>" + e + "</span>",
                            $("#empire_res_plt_" + b + "_" + m.id).html(l))
                        }
                    }
                g = Array(buildings.length);
                for (n = 0; n < buildings.length; n++)
                    g[n] = 0;
                for (b = 0; b < game.planets.length; b++)
                    for (n = 0; n < buildings.length; n++)
                        0 != buildings[n].researchPoint && (g[n] += planets[game.planets[b]].structure[n].number);
                if (overviewResourceExpand.empire.research) {
                    for (n = 0; n < buildings.length; n++)
                        if (0 < g[n]) {
                            for (b = e = 0; b < game.planets.length; b++)
                                e += buildings[n].production(planets[game.planets[b]]).researchPoint;
                            document.getElementById("empire_res_research_" + n) && (document.getElementById("empire_res_research_" + n).innerHTML = "<span class='blue_text' style='width:240px'>" + buildings[n].displayName + " <span class='white_text'>" + g[n] + "</span> </span><span class='white_text' style='float:right;margin-right:320px;'><span class='" + (0 <= e ? 0 < e ? "green_text" : "gray_text" : "red_text") + "'>(" + (0 < e ? "+" : "") + beauty(e) + "/s)</span></span>")
                        }
                    for (n = 0; n < game.planets.length; n++)
                        m = d[n],
                        b = "researchPoint",
                        e = m.rawProduction()[b],
                        0 < e && (e = "<span class='white_text' style='margin-righ:16px;font-size:80%'><span class='" + (0 <= e ? 0 < e ? "green_text" : "gray_text" : "red_text oblique_txt") + "'>(" + (0 < e ? "+" : "") + beauty(e) + "/s)</span>",
                        e += "</span>",
                        document.getElementById("empire_res_research_plt_" + m.id) && (document.getElementById("empire_res_research_plt_" + m.id).innerHTML = "<img src='" + IMG_FOLDER + "/" + m[PLANET_IMG_FIELD] + (1 == PLANET_FOLDER_DOUBLE ? "/" + m[PLANET_IMG_FIELD] : "") + ".png' style='height:20px;width:20px;position:relative;top:6px;'/><span id='empire_res_research_plt_ov_" + m.id + "' class='blue_text' style='width:240px'>" + m.name + ":</span><span style='float:right;margin-right:320px;'>" + e + "</span>"))
                }
            }
            (new Date).getTime()
        }
        ;
        K();
        $("#bottom_build_menu").show();
        $("#planet_selection_interface").show();
        $("#back_button").unbind();
        $("#back_button").click(I);
        $("#back_button").show()
    }
    function ka() {
        btoa(capital);
        for (var b = 0; b < fleetSchedule.fleets.length; b++)
            fleetSchedule.fleets[b] && fleetSaver(fleetSchedule.fleets[b]);
        b = {};
        for (var d = 0; d < artifacts.length; d++)
            artifacts[d].possessed && (b[artifacts[d].id] = !0);
        var e = {};
        for (d = 0; d < quests.length; d++)
            quests[d].done && (e[quests[d].id] = !0);
        var g = {};
        for (d = 0; d < places.length; d++)
            places[d].done && (g[places[d].id] = !0);
        var h = {};
        for (d = 0; d < tutorials.length; d++)
            tutorials[d].done && (h[tutorials[d].id] = !0);
        e = {
            fleets: fleetSchedule.fleets,
            count: fleetSchedule.count,
            m: market.toobj(),
            qur: {
                points: qurisTournament.points,
                lose: qurisTournament.lose
            },
            art: b,
            qst: e,
            plc: g,
            tuts: h
        };
        b = JSON.stringify(planetArraySaver(planets));
        d = JSON.stringify(civisArraySaver(civis));
        e = JSON.stringify(e);
        b = encodeURIComponent(b + "@DIVIDER@" + d + "@DIVIDER@" + e);
        d = LZString.compressToUTF16(b);
        d = LZString.compressToBase64(d);
        e = LZString.decompressFromUTF16(LZString.decompressFromBase64(d));
        return {
            str: "hg" + d + "@@",
            decom: e,
            finalJ: b
        }
    }
    function ta() {
        gameSettings.cloudSave && ya()
    }
    function ya() {
        var b = ka()
          , d = b.str;
        b.decom == b.finalJ ? $.post("https://heartofgalaxy.com/save.php", {
            id: userID,
            name: userName,
            data: d
        }).done(function(b) {
            (" ok " == b ? new exportPopup(210,0,"<span class='blue_text text_shadow'>Game Saved online!<br>If it doesn't work, try exporting the save.</span>","info") : new exportPopup(210,0,"<span class='red_text red_text_shadow'>Error during online save</span>","info")).drawToast()
        }).fail(function() {
            (new exportPopup(210,0,"<span class='red_text red_text_shadow'>Error during online save. Check your connection or retry later.</span>","info")).drawToast()
        }) : (new exportPopup(210,0,"<span class='red_text red_text_shadow'>Internal error during online save</span>","info")).drawToast()
    }
    function pa(e) {
        e = e.split("@")[0];
        if (e = "hg" == e.substring(0, 2) ? decodeURIComponent(LZString.decompressFromUTF16(LZString.decompressFromBase64(e.substring(2)))) : LZString.decompressFromUTF16(LZString.decompressFromBase64(e))) {
            var g = e.split("@DIVIDER@");
            if (3 <= g.length) {
                for (e = 0; e < game.researches.length; e++)
                    for (var h = game.researches[e].level, l = 0; l < h; l++)
                        game.researches[e].unbonus(),
                        game.researches[e].level--;
                governmentList[game.chosenGovern].unbonus();
                d();
                firstTime = !1;
                l = JSON.parse(g[1]);
                h = JSON.parse(g[0]);
                g = JSON.parse(g[2]);
                console.log("iMPORT");
                clearTimeout(idleTimeout);
                idleBon = staticBon;
                for (e = 0; e < l.length; e++)
                    civisLoader(civis[e], l[e], civis[e].name);
                governmentList[game.chosenGovern].bonus();
                fleetSchedule.count = g.count;
                l = 0;
                for (var n in g.fleets)
                    l++;
                fleetSchedule.load(g.schedule, g.fleets, l);
                g.m && market.load(g.m);
                g.st && settingsLoader(g.st);
                g.qur && (qurisTournament.points = 0,
                g.qur.points && (qurisTournament.points = g.qur.points || 0),
                qurisTournament.lose = 0,
                g.qur.lose && (qurisTournament.lose = g.qur.lose || 0));
                if (g.art)
                    for (var m in g.art)
                        artifacts[artifactsName[m]].collect();
                if (g.qst)
                    for (var u in g.qst)
                        quests[questNames[u]].done = !0;
                if (g.plc)
                    for (u in g.plc)
                        places[placesNames[u]].done = !0;
                if (g.tuts)
                    for (u in g.tuts)
                        tutorialsNames[u] && (tutorials[tutorialsNames[u]].done = !0);
                game = civis[gameSettings.civis];
                for (e = 0; e < h.length; e++)
                    h[e] && planetLoader(planets[e], h[e]);
                setIdleBonus();
                submitNumber("Number of planets", game.planets.length);
                submitNumber("Infuence", game.influence());
                qurisTournament.fleet = null;
                generateQurisTournamentFleet();
                n = b();
                submitNumber("Military Value", n);
                submitNumber("Number of time travels", game.timeTravelNum);
                submitNumber("Tournament Rank", qurisTournament.points + 1);
                n = parseInt(Math.floor(game.days / 365));
                submitNumber("Total years", n);
                submitNumber("totaltp", parseInt(game.totalTPspent()));
                submitNumber("Total Population", parseInt(game.totalPopulation()));
                planets[game.planets[0]] && C(planets[game.planets[0]])
            } else
                return "<span class='red_text'>Corrupted data</span>"
        } else
            return "<span class='red_text'>Invalid data</span>";
        return ""
    }
    function wa() {
        currentInterface = "exportInterface";
        currentUpdater = function() {}
        ;
        var d = "<div style='position:relative;left:16px;width:1168px'><br><span class='blue_text' id='expsave' style='font-size:100%;cursor:pointer;'>Exported Save - Copy and save</span>";
        var e = ka()
          , h = e.decom
          , l = e.finalJ;
        e = e.str;
        h == l && (d = d + "<textarea id='saveexport' spellcheck='false' rows='5' style='width:95%'>" + e + "</textarea>");
        d += "<br><br><br><br><span class='button blue_text' id='impsave' style='position:absolute;left:150px;font-size:100%;cursor:pointer;'>存档导入</span><span class='button blue_text' id='impsave2' style='position:absolute;left:800px;font-size:100%;cursor:pointer;'>替换当前存档</span><br><br><textarea id='saveimport' spellcheck='false' rows='4' style='width:95%'></textarea><br><br><span class='button blue_text' id='metadata_cloud' style='position:absolute;left:150px;font-size:100%;cursor:pointer;'></span><br><br></div>";
        document.getElementById("profile_info_list") && (document.getElementById("profile_info_list").innerHTML = d);
        document.getElementById("expsave") && (document.getElementById("expsave").innerHTML = "存档导出：（数据过大时可能速度较慢）<span class='white_text'>(Loading...)</span>");
        h == l ? (document.queryCommandSupported("copy") && document.getElementById("exportCopy") && document.getElementById("exportCopy").addEventListener("click", function(b) {
            document.getElementById("saveexport").select();
            try {
                document.execCommand("copy")
            } catch (Ga) {
                document.getElementById("exportCopy").innerHTML = "<span class='red_text'>Error during copy, please retry again</span>"
            }
        }),
        document.getElementById("expsave") && (document.getElementById("expsave").innerHTML = "存档导出：（数据过大时可能速度较慢）<span class='green_text'>Done</span>")) : document.getElementById("expsave") && (document.getElementById("expsave").innerHTML = "Export Save: <span class='red_text'> ERROR EXPORTING</span>");
        $("#impsave").unbind();
        $("#impsave").click(function() {
            var d = document.getElementById("saveimport").value;
            d = d.split("@")[0];
            var e;
            (e = "hg" == d.substring(0, 2) ? decodeURIComponent(LZString.decompressFromUTF16(LZString.decompressFromBase64(d.substring(2)))) : LZString.decompressFromUTF16(LZString.decompressFromBase64(d))) || (e = "hg" == d.substring(0, 2) ? decodeURIComponent(LZString.decompressFromUTF16(atob(d.substring(2)))) : LZString.decompressFromUTF16(atob(d)));
            if (e)
                try {
                    var h = e.split("@DIVIDER@");
                    console.log(h[2]);
                    if (3 <= h.length) {
                        for (d = 0; d < game.researches.length; d++)
                            for (var l = game.researches[d].level, n = 0; n < l; n++)
                                game.researches[d].unbonus(),
                                game.researches[d].level--;
                        governmentList[game.chosenGovern].unbonus();
                        g();
                        firstTime = !1;
                        var m = JSON.parse(h[1])
                          , u = JSON.parse(h[0])
                          , v = JSON.parse(h[2]);
                        console.log("iMPORT");
                        clearTimeout(idleTimeout);
                        idleBon = staticBon;
                        for (d = 0; d < m.length; d++)
                            civisLoader(civis[d], m[d], civis[d].name);
                        governmentList[game.chosenGovern].bonus();
                        fleetSchedule.count = v.count;
                        n = 0;
                        for (var w in v.fleets)
                            n++;
                        fleetSchedule.load(v.schedule, v.fleets, n);
                        v.m && market.load(v.m);
                        v.st && settingsLoader(v.st);
                        v.qur && (qurisTournament.points = 0,
                        v.qur.points && (qurisTournament.points = v.qur.points || 0),
                        qurisTournament.lose = 0,
                        v.qur.lose && (qurisTournament.lose = v.qur.lose || 0));
                        if (v.art)
                            for (var y in v.art)
                                artifacts[artifactsName[y]].collect();
                        if (v.qst)
                            for (var x in v.qst)
                                quests[questNames[x]].done = !0;
                        if (v.plc)
                            for (x in v.plc)
                                places[placesNames[x]].done = !0;
                        if (v.tuts)
                            for (x in v.tuts)
                                tutorialsNames[x] && (tutorials[tutorialsNames[x]].done = !0);
                        game = civis[gameSettings.civis];
                        for (d = 0; d < u.length; d++)
                            u[d] && planetLoader(planets[d], u[d]);
                        setIdleBonus();
                        submitNumber("Number of planets", game.planets.length);
                        submitNumber("Infuence", game.influence());
                        qurisTournament.fleet = null;
                        generateQurisTournamentFleet();
                        var z = b();
                        submitNumber("Military Value", z);
                        submitNumber("Number of time travels", game.timeTravelNum);
                        submitNumber("Tournament Rank", qurisTournament.points + 1);
                        var A = parseInt(Math.floor(game.days / 365));
                        submitNumber("Total years", A);
                        submitNumber("totaltp", parseInt(game.totalTPspent()));
                        submitNumber("Total Population", parseInt(game.totalPopulation()));
                        planets[game.planets[0]] && C(planets[game.planets[0]])
                    } else
                        document.getElementById("impsave") && (document.getElementById("impsave").innerHTML = "导入存档：<span class='red_text'>Corrupted data</span>")
                } catch (Ka) {
                    console.log(Ka.message),
                    document.getElementById("impsave") && (document.getElementById("impsave").innerHTML = "导入存档：<span class='red_text'>Error</span>")
                }
            else
                document.getElementById("impsave") && (document.getElementById("impsave").innerHTML = "导入存档：<span class='red_text'>Invalid data</span>")
        });
        $("#impsave2").unbind();
        $("#impsave2").click(function() {
            var b = pa(document.getElementById("saveimport").value);
            "" != b && document.getElementById("impsave2") && (document.getElementById("impsave2").innerHTML = "Alternative Import: " + b)
        });
        MOBILE_LANDSCAPE && ($("#impsave").unbind(),
        $("#impsave").click(function() {
            var b = pa(document.getElementById("saveimport").value);
            "" != b && document.getElementById("impsave2") && (document.getElementById("impsave2").innerHTML = "替换当前存档: " + b)
        }));
        $.post("https://heartofgalaxy.com/metadata.php", {
            id: userID,
            name: userName
        }).done(function(b) {
            if (" error " != b) {
                var d = new Date(1E3 * b);
                b = d.getFullYear();
                var e = d.getMonth()
                  , g = d.getDate()
                  , h = d.getHours()
                  , l = "0" + d.getMinutes();
                d = "0" + d.getSeconds();
                b = b + "-" + e + "-" + g + " " + h + ":" + l.substr(-2) + ":" + d.substr(-2);
                MOBILE_LANDSCAPE || "Last cloud save at: " + b + " (CLICK TO FORCE LOAD)";
                console.log("AIOOOOOO");
                $("#metadata_cloud").html("");
                $("#metadata_cloud").click(function() {
                    $.post("https://heartofgalaxy.com/load.php", {
                        id: userID,
                        name: userName,
                        time: 0
                    }).done(function(b) {
                        " no " == b ? b = new exportPopup(210,0,"<span class='blue_text text_shadow'>Detected newer local version</span>","info") : " error " == b ? b = new exportPopup(210,0,"<span class='blue_text text_shadow'>Error during online loading</span>","info") : (b = b.substr(1),
                        b = pa(b),
                        "" == b && (b = "<span class='blue_text text_shadow'>Game loaded from online save!</span>"),
                        b = new exportPopup(210,0,b,"info"));
                        b.drawToast();
                        console.log("okcloud_force")
                    }).fail(function() {
                        (new exportPopup(210,0,"<span class='red_text red_text_shadow'>Error during online loading, loading from local</span>","info")).drawToast();
                        console.log("failcloud_force")
                    })
                })
            }
            console.log("okcloud")
        }).fail(function() {
            MOBILE_LANDSCAPE || ((new exportPopup(210,0,"<span class='red_text red_text_shadow'>Error while forcing cloud loading</span>","info")).drawToast(),
            console.log("failcloud"))
        });
        K();
        $("#profile_interface").show();
        game.searchPlanet(currentPlanet.id) && $("#bottom_build_menu").show()
    }
    function oa() {
        N[na].volume = Math.floor(N.v * gameSettings.masterVolume / 100) / 100
    }
    function qa() {
        var b = Math.floor(22 * Math.random());
        b == na && (b++,
        21 < b && (b -= 1 + Math.floor(18 * Math.random())));
        na = b;
        var d = function() {
            setTimeout(ia, Math.floor(1E3 * (N[na].duration - 15)));
            N[na].b();
            N[na].volume = Math.floor(N.v * gameSettings.masterVolume / 100) / 100
        };
        N[b].addEventListener("loadedmetadata", d);
        2 <= N[b].readyState && d()
    }
    function ia() {
        qa()
    }
    function da(b, d, e, g) {
        currentInterface = "setAutoRouteInterface";
        currentUpdater = function() {}
        ;
        var h = parseInt(Math.floor(2 * planets[d].shortestPath[e].distance / (idleBon * b.speed())))
          , l = Math.floor(h / 60);
        l = "<div style='position:relative;left:16px;top:16px;'><span class='blue_text' style='font-size:120%'>Round Trip Time: </span><span class='white_text'>" + Math.floor(l / 60) % 60 + "h " + l % 60 + "m " + h % 60 + "s </span><span class='white_text'>(" + h + "s)</span><br>";
        gameSettings.advancedAutoroute && (l += "<input type='checkbox' id='checkall' value='false'><span class='blue_text'>Check all Use%</span></input><input type='checkbox' id='checkallnew' value='true'><span class='blue_text'>Extend to new resources</span></input></div>");
        l = l + "<div style='position:relative;left:16px;top:16px;'><div style='float:left;margin:0;width:46%;'>" + ("<img src='" + IMG_FOLDER + "/" + planets[d][PLANET_IMG_FIELD] + (1 == PLANET_FOLDER_DOUBLE ? "/" + planets[d][PLANET_IMG_FIELD] : "") + ".png' class='icon' style='cursor:pointer;position:relative;top:8px;'/><span class='blue_text' style='font-size:150%'> " + planets[d].name + "</span><br><span class='blue_text'>Fleet storage: </span><span id='needed_storage0' class='white_text'>0</span><span class='white_text'>/" + beauty(b.maxStorage()) + "</span><span style='float:right;margin-righ:16px;' class='blue_text'>Select the amount of resources<br>you want to load in this " + LOCALE_PLANET_NAME + "</span><br>");
        gameSettings.advancedAutoroute && (l += "<input type='checkbox' id='check100s' value='false'><span class='blue_text'>Check all to </span></input><input style='width:32px' id='check100s_txt' type='text' value='105'/><span class='blue_text'> %</span>");
        l += "<br><br>";
        var n = planets[d].rawProduction()
          , m = Array(resNum);
        planets[d].importExport();
        for (var u = 0; u < resNum; u++)
            m[u] = planets[d].globalImport[u] - planets[d].globalExport[u];
        var v = Array(resNum);
        for (u = 0; u < resNum; u++)
            v[u] = u;
        gameSettings.sortResName && (v = sortedResources);
        for (var y = 0; y < resNum; y++) {
            var x = v[y];
            if (resources[x].show(game) || 1 <= planets[d].resources[x])
                l += "<span class='blue_text' style='font-size:80%;'>" + resources[x].name.capitalize() + "</span><br><span class='blue_text' style='font-size:80%;' id='edit_auto_stock_source_" + x + "'>Stock: <span class='white_text' style='font-size:100%;'> " + beauty(planets[d].resources[x]) + " <span class='" + (0 <= n[x] ? 0 < n[x] ? "green_text" : "gray_text" : "red_text") + "'>(" + (0 < n[x] ? "+" : "") + beauty(n[x]) + "/s)</span>",
                u = x,
                0 != m[u] && (l += "<span class='" + (0 <= m[u] ? 0 < m[u] ? "purple_text" : "gray_text" : "pink_text oblique_txt") + "'> (" + (0 < m[u] ? "+" : "") + beauty(m[u]) + "/s)</span>"),
                MOBILE_LANDSCAPE && 0 < game.planets.length && 0 != game.totalProd[u] && (str2 += "<span class='" + (0 <= game.totalProd[u] ? 0 < game.totalProd[u] ? "purple_text" : "gray_text" : "pink_text oblique_txt") + "'> (" + (0 < game.totalProd[u] ? "+" : "") + beauty(game.totalProd[u]) + "/s)</span>"),
                l += "</span></span><br><span class='blue_text' style='font-size:80%;' id='new_source_" + x + "'></span><span style='float:right;margin-righ:16px;' class='blue_text' id='source_val_" + x + "'><input type='checkbox' id='source_pct_" + x + "' name='" + x + "' value='false'>Use %        </input>(<input style='width:64px;height:12px;font-size:92%' id='res_slide0_" + x + "' name='" + x + "'type='text' value='0' />/s) <input style='width:80px' id='res_textval0_" + x + "' name='" + x + "' type='text' value='0'/></span><br><br>"
        }
        l = l + "<span class='blue_text' style='font-size:120%'></span><br><br></div><div style='float:left;margin:0;width:4%;'><span class='blue_text' style='font-size:120%'></span><br><br></div><div style='float:left;margin:0;width:46%;'>" + ("<img src='" + IMG_FOLDER + "/" + planets[e][PLANET_IMG_FIELD] + (1 == PLANET_FOLDER_DOUBLE ? "/" + planets[e][PLANET_IMG_FIELD] : "") + ".png' class='icon' style='cursor:pointer;position:relative;top:8px;'/><span class='blue_text' style='font-size:150%'> " + planets[e].name + "</span><br><span class='blue_text'> Fleet storage: </span><span id='needed_storage1' class='white_text'>0</span><span class='white_text'>/" + beauty(b.maxStorage()) + "</span><span style='float:right;margin-righ:16px;'  class='blue_text'>Select the amount of resources<br>you want to load in this " + LOCALE_PLANET_NAME + "</span><br>");
        gameSettings.advancedAutoroute && (l += "<input type='checkbox' id='check100d' value='false'><span class='blue_text'>Check all to </span></input><input style='width:32px' id='check100d_txt' type='text' value='105'/><span class='blue_text'> %</span>");
        l += "<br><br>";
        n = planets[e].rawProduction();
        var z = Array(resNum);
        planets[e].importExport();
        for (u = 0; u < resNum; u++)
            z[u] = planets[e].globalImport[u] - planets[e].globalExport[u];
        v = Array(resNum);
        for (u = 0; u < resNum; u++)
            v[u] = u;
        gameSettings.sortResName && (v = sortedResources);
        for (y = 0; y < resNum; y++)
            if (x = v[y],
            resources[x].show(game) || 1 <= planets[e].resources[x])
                l += "<span class='blue_text' style='font-size:80%;'>" + resources[x].name.capitalize() + "</span><br><span class='blue_text' style='font-size:80%;' id='edit_auto_stock_dest_" + x + "'>Stock: <span class='white_text' style='font-size:100%;'> " + beauty(planets[e].resources[x]) + " <span class='" + (0 <= n[x] ? 0 < n[x] ? "green_text" : "gray_text" : "red_text") + "'>(" + (0 < n[x] ? "+" : "") + beauty(n[x]) + "/s)</span>",
                u = x,
                0 != z[u] && (l += "<span class='" + (0 <= z[u] ? 0 < z[u] ? "purple_text" : "gray_text" : "pink_text oblique_txt") + "'> (" + (0 < z[u] ? "+" : "") + beauty(z[u]) + "/s)</span>"),
                MOBILE_LANDSCAPE && 0 < game.planets.length && 0 != game.totalProd[u] && (str2 += "<span class='" + (0 <= game.totalProd[u] ? 0 < game.totalProd[u] ? "purple_text" : "gray_text" : "pink_text oblique_txt") + "'> (" + (0 < game.totalProd[u] ? "+" : "") + beauty(game.totalProd[u]) + "/s)</span>"),
                l += "</span></span><br><span class='blue_text' style='font-size:80%;' id='new_dest_" + x + "'></span><span style='float:right;margin-righ:16px;'class='blue_text'><input type='checkbox' id='dest_pct_" + x + "' name='" + x + "' value='false'>Use %        </input>(<input style='width:64px;height:12px;font-size:92%' id='res_slide1_" + x + "' name='" + x + "' type='text' value='0' />/s) <input style='width:80px' id='res_textval1_" + x + "' name='" + x + "' type='text' value='0'/></span><br><br>";
        l += "<span class='blue_text' style='font-size:120%'></span><br><br></div></div><span class='blue_text button' id='but_setroute' style='font-size:120%;position:absolute;left:45%;bottom:0%;'>Create Route</span>";
        document.getElementById("profile_info_list") && (document.getElementById("profile_info_list").innerHTML = l);
        $("#checkallnew").prop("checked", !0);
        for (l = 0; l < resNum; l++)
            $("#res_slide0_" + l).change(function() {
                isFinite(1E3 * Math.floor(parseInt($(this).val()))) || $(this).val(0);
                $("#res_textval0_" + $(this).attr("name")).val(parseInt(parseFloat($(this).val()) * h));
                currentUpdater()
            }),
            $("#res_textval0_" + l).change(function() {
                isFinite(parseInt($(this).val())) ? parseInt($(this).val()) > $("#res_slide0_" + $(this).attr("name")).attr("max") && $(this).val($("#res_slide0_" + $(this).attr("name")).attr("max")) : $(this).val(0);
                $("#res_slide0_" + $(this).attr("name")).val(parseInt($(this).val()) / h);
                currentUpdater()
            }),
            $("#res_slide1_" + l).change(function() {
                isFinite(1E3 * Math.floor(parseInt($(this).val()))) || $(this).val(0);
                $("#res_textval1_" + $(this).attr("name")).val(parseInt(parseFloat($(this).val()) * h));
                currentUpdater()
            }),
            $("#res_textval1_" + l).change(function() {
                isFinite(parseInt($(this).val())) ? parseInt($(this).val()) > $("#res_slide1_" + $(this).attr("name")).attr("max") && $(this).val($("#res_slide1_" + $(this).attr("name")).attr("max")) : $(this).val(0);
                $("#res_slide1_" + $(this).attr("name")).val(parseInt($(this).val()) / h);
                currentUpdater()
            }),
            $("#source_pct_" + l).change(function() {
                var d = $(this).attr("name");
                $("#dest_pct_" + d).prop("checked", this.checked);
                (b.autoPct[d] = this.checked) ? ($("#res_slide0_" + d).hide(),
                $("#res_slide1_" + d).hide()) : ($("#res_slide0_" + d).show(),
                $("#res_slide1_" + d).show())
            }),
            $("#dest_pct_" + l).change(function() {
                var d = $(this).attr("name");
                $("#source_pct_" + d).prop("checked", this.checked);
                (b.autoPct[d] = this.checked) ? ($("#res_slide0_" + d).hide(),
                $("#res_slide1_" + d).hide()) : ($("#res_slide0_" + d).show(),
                $("#res_slide1_" + d).show())
            });
        $("#checkall").change(function() {
            for (var d = 0; d < resNum; d++)
                $("#dest_pct_" + d).prop("checked", this.checked),
                $("#source_pct_" + d).prop("checked", this.checked),
                b.autoPct[d] = this.checked,
                $("#res_textval0_" + d).val("0"),
                $("#res_textval1_" + d).val("0"),
                this.checked ? ($("#res_slide0_" + d).hide(),
                $("#res_slide1_" + d).hide()) : ($("#res_slide0_" + d).show(),
                $("#res_slide1_" + d).show())
        });
        $("#check100s").change(function() {
            if (!$("#checkall").prop("checked")) {
                $("#checkall").prop("checked", !0);
                for (var d = 0; d < resNum; d++)
                    $("#dest_pct_" + d).prop("checked", this.checked),
                    $("#source_pct_" + d).prop("checked", this.checked),
                    b.autoPct[d] = this.checked,
                    $("#res_textval0_" + d).val("0"),
                    $("#res_textval1_" + d).val("0"),
                    this.checked ? ($("#res_slide0_" + d).hide(),
                    $("#res_slide1_" + d).hide()) : ($("#res_slide0_" + d).show(),
                    $("#res_slide1_" + d).show())
            }
            for (d = 0; d < resNum; d++)
                $("#res_textval0_" + d).val($("#check100s_txt").val())
        });
        $("#check100d").change(function() {
            if (!$("#checkall").prop("checked")) {
                $("#checkall").prop("checked", !0);
                for (var d = 0; d < resNum; d++)
                    $("#dest_pct_" + d).prop("checked", this.checked),
                    $("#source_pct_" + d).prop("checked", this.checked),
                    b.autoPct[d] = this.checked,
                    $("#res_textval0_" + d).val("0"),
                    $("#res_textval1_" + d).val("0"),
                    this.checked ? ($("#res_slide0_" + d).hide(),
                    $("#res_slide1_" + d).hide()) : ($("#res_slide0_" + d).show(),
                    $("#res_slide1_" + d).show())
            }
            for (d = 0; d < resNum; d++)
                $("#res_textval1_" + d).val($("#check100d_txt").val())
        });
        $("#check100s_txt").change(function() {
            isFinite(parseInt($(this).val())) || $(this).val("105");
            currentUpdater()
        });
        $("#check100d_txt").change(function() {
            isFinite(parseInt($(this).val())) || $(this).val("105");
            currentUpdater()
        });
        currentUpdater = function() {
            for (var g = planets[d].rawProduction(), l = planets[e].rawProduction(), n = 0; n < resNum; n++)
                if (resources[n].show(game) || 1 <= planets[e].resources[n]) {
                    var u = n
                      , v = ""
                      , w = "";
                    0 != m[u] && (v += "<span class='" + (0 <= m[u] ? 0 < m[u] ? "purple_text" : "gray_text" : "pink_text oblique_txt") + "'> (" + (0 < m[u] ? "+" : "") + beauty(m[u]) + "/s)</span>");
                    0 != z[u] && (w += "<span class='" + (0 <= z[u] ? 0 < z[u] ? "purple_text" : "gray_text" : "pink_text oblique_txt") + "'> (" + (0 < z[u] ? "+" : "") + beauty(z[u]) + "/s)</span>");
                    document.getElementById("edit_auto_stock_dest_" + n) && (document.getElementById("edit_auto_stock_dest_" + n).innerHTML = "Stock: <span class='white_text' style='font-size:100%;'> " + beauty(planets[e].resources[n]) + " <span class='" + (0 <= l[n] ? 0 < l[n] ? "green_text" : "gray_text" : "red_text") + "'>(" + (0 < l[n] ? "+" : "") + beauty(l[n]) + "/s)</span>" + w + "</span>");
                    document.getElementById("edit_auto_stock_source_" + n) && (document.getElementById("edit_auto_stock_source_" + n).innerHTML = "Stock: <span class='white_text' style='font-size:100%;'> " + beauty(planets[d].resources[n]) + " <span class='" + (0 <= g[n] ? 0 < g[n] ? "green_text" : "gray_text" : "red_text") + "'>(" + (0 < g[n] ? "+" : "") + beauty(g[n]) + "/s)</span>" + v + "</span>");
                    w = v = 0;
                    $("#res_textval0_" + n).val() && (b.autoPct[n] ? 0 < planets[d].globalRaw[n] ? v += planets[d].globalRaw[n] * parseFloat($("#res_textval0_" + n).val()) / 100 * h / idleBon : w -= planets[d].globalRaw[n] * parseFloat($("#res_textval0_" + n).val()) / 100 * h / idleBon : v += parseInt($("#res_textval0_" + n).val()));
                    $("#res_textval1_" + n).val() && (b.autoPct[n] ? 0 < planets[e].globalRaw[n] ? w += planets[e].globalRaw[n] * parseFloat($("#res_textval1_" + n).val()) / 100 * h / idleBon : v -= planets[e].globalRaw[n] * parseFloat($("#res_textval1_" + n).val()) / 100 * h / idleBon : w = parseInt($("#res_textval1_" + n).val()));
                    u = (-v + w) / h * idleBon;
                    v = (-w + v) / h * idleBon;
                    document.getElementById("new_source_" + n) && (document.getElementById("new_source_" + n).innerHTML = "This fleet will give: <span class='white_text' style='font-size:100%;'><span class='" + (0 <= u ? 0 < u ? "green_text" : "gray_text" : "red_text") + "'>(" + (0 < u ? "+" : "") + beauty(u) + "/s)</span>");
                    document.getElementById("new_dest_" + n) && (document.getElementById("new_dest_" + n).innerHTML = "This fleet will give: <span class='white_text' style='font-size:100%;'><span class='" + (0 <= v ? 0 < v ? "green_text" : "gray_text" : "red_text") + "'>(" + (0 < v ? "+" : "") + beauty(v) + "/s)</span>")
                }
            for (n = l = g = 0; n < resNum; n++)
                $("#res_textval0_" + n).val() && (b.autoPct[n] ? 0 > planets[d].globalRaw[n] ? l += -parseFloat($("#res_textval0_" + n).val()) / 100 * planets[d].globalRaw[n] * h : g += parseFloat($("#res_textval0_" + n).val()) / 100 * planets[d].globalRaw[n] * h : g += parseInt($("#res_textval0_" + n).val())),
                $("#res_textval1_" + n).val() && (b.autoPct[n] ? 0 > planets[e].globalRaw[n] ? g += -parseFloat($("#res_textval1_" + n).val()) / 100 * planets[e].globalRaw[n] * h : l += parseFloat($("#res_textval1_" + n).val()) / 100 * planets[e].globalRaw[n] * h : l += parseInt($("#res_textval1_" + n).val()));
            g = Math.floor(g);
            l = Math.floor(l);
            $("#needed_storage0").html(beauty(g));
            $("#needed_storage1").html(beauty(l))
        }
        ;
        $("#but_setroute").unbind();
        $("#but_setroute").click(function() {
            for (var l = 0, n = 0, m = 0; m < resNum; m++)
                $("#res_textval0_" + m).val() && (b.autoPct[m] ? 0 > planets[d].globalRaw[m] ? n += -parseFloat($("#res_textval0_" + m).val()) / 100 * planets[d].globalRaw[m] * h : l += parseFloat($("#res_textval0_" + m).val()) / 100 * planets[d].globalRaw[m] * h : l += parseInt($("#res_textval0_" + m).val())),
                $("#res_textval1_" + m).val() && (b.autoPct[m] ? 0 > planets[e].globalRaw[m] ? l += -parseFloat($("#res_textval1_" + m).val()) / 100 * planets[e].globalRaw[m] * h : n += parseFloat($("#res_textval1_" + m).val()) / 100 * planets[e].globalRaw[m] * h : n += parseInt($("#res_textval1_" + m).val()));
            l = Math.floor(l);
            n = Math.floor(n);
            if (gameSettings.autoover || l <= b.availableStorage())
                if (gameSettings.autoover || n <= b.availableStorage()) {
                    b.autoMap[d] = 0;
                    b.autoMap[e] = 1;
                    for (m = 0; m < resNum; m++)
                        $("#res_textval1_" + m).val() ? (l = parseInt($("#res_textval1_" + m).val()),
                        b.autoPct[m] && (l = 100 * parseFloat($("#res_textval1_" + m).val())),
                        b.autoRes[b.autoMap[e]][m] = l) : ($("#check100d").prop("checked") || $("#checkall").prop("checked")) && $("#checkallnew").prop("checked") && !resources[m].show(game) ? (b.autoPct[m] = !0,
                        b.autoRes[b.autoMap[e]][m] = 100 * parseFloat($("#check100d_txt").val())) : b.autoRes[b.autoMap[e]][m] = 0,
                        $("#res_textval0_" + m).val() ? (l = parseInt($("#res_textval0_" + m).val()),
                        b.autoRes[b.autoMap[d]][m] = l,
                        b.autoPct[m] && (l = 100 * parseFloat($("#res_textval0_" + m).val()),
                        b.autoRes[b.autoMap[d]][m] = l,
                        l = Math.floor(h * (b.autoRes[b.autoMap[d]][m] * Math.max(planets[d].globalRaw[m], 0) + b.autoRes[b.autoMap[e]][m] * Math.max(-planets[e].globalRaw[m], 0)) / 1E4)),
                        l = Math.min(l, planets[d].resources[m]),
                        0 < l && b.load(m, l) && planets[d].resourcesAdd(m, -l)) : ($("#check100s").prop("checked") || $("#checkall").prop("checked")) && $("#checkallnew").prop("checked") && !resources[m].show(game) ? (b.autoPct[m] = !0,
                        b.autoRes[b.autoMap[d]][m] = 100 * parseFloat($("#check100s_txt").val())) : b.autoRes[b.autoMap[d]][m] = 0;
                    b.type = "auto";
                    b.move(d, e);
                    delete planets[d].fleets[g];
                    ba("auto")
                } else
                    m = new w(210,0,"<span class='red_text red_text_shadow'>Not enough storage to load resources in " + planets[e].name + "!</span>","info"),
                    m.drawToast();
            else
                m = new w(210,0,"<span class='red_text red_text_shadow'>Not enough storage to load resources in " + planets[d].name + "!</span>","info"),
                m.drawToast()
        });
        K();
        $("#profile_interface").show();
        game.searchPlanet(currentPlanet.id) && $("#bottom_build_menu").show()
    }
    function ra(b, d, e) {
        currentInterface = "editAutoRouteInterface";
        currentUpdater = function() {}
        ;
        var g = parseInt(Math.floor(2 * planets[d].shortestPath[e].distance / (b.speed() * idleBon)))
          , h = Math.floor(g / 60);
        h = "<div style='position:relative;left:16px;top:16px;'><span class='blue_text' style='font-size:120%'>Round Trip Time: </span><span class='white_text'>" + Math.floor(h / 60) % 60 + "h " + h % 60 + "m " + g % 60 + "s </span><span class='white_text'>(" + g + "s)</span><br><span class='blue_text' style='font-size:120%'>Fleet Name: </span><span class='white_text'>" + b.name + "</span><br>";
        gameSettings.advancedAutoroute && (h += "<input type='checkbox' id='checkall' value='false'><span class='blue_text'>Check all Use%</span></input><input type='checkbox' id='checkallnew' value='false'><span class='blue_text'>Extend to new resources</span></input></div>");
        h = h + "<div style='position:relative;left:16px;top:16px;'><div style='float:left;margin:0;width:46%;'>" + ("<img src='" + IMG_FOLDER + "/" + planets[d][PLANET_IMG_FIELD] + (1 == PLANET_FOLDER_DOUBLE ? "/" + planets[d][PLANET_IMG_FIELD] : "") + ".png' class='icon' style='cursor:pointer;position:relative;top:8px;'/><span class='blue_text' style='font-size:150%'> " + planets[d].name + "</span><br><span class='blue_text'>Fleet storage: </span><span id='needed_storage0' class='white_text'>0</span><span class='white_text'>/" + beauty(b.maxStorage()) + "</span><span style='float:right;margin-righ:16px;' class='blue_text'>Select the amount of resources<br>you want to load in this " + LOCALE_PLANET_NAME + "</span><br>");
        gameSettings.advancedAutoroute && (h += "<input type='checkbox' id='check100s' value='false'><span class='blue_text'>Check all to </span></input><input style='width:32px' id='check100s_txt' type='text' value='105'/><span class='blue_text'> %</span>");
        h += "<br><br><br>";
        var l = planets[d].rawProduction()
          , n = Array(resNum);
        planets[d].importExport();
        for (var m = 0; m < resNum; m++)
            n[m] = planets[d].globalImport[m] - planets[d].globalExport[m];
        var u = Array(resNum);
        for (m = 0; m < resNum; m++)
            u[m] = m;
        gameSettings.sortResName && (u = sortedResources);
        for (var v = 0; v < resNum; v++) {
            var x = u[v];
            if (resources[x].show(game) || 1 <= planets[d].resources[x])
                h += "<span class='blue_text' style='font-size:80%;'>" + resources[x].name.capitalize() + "</span><br><span class='blue_text' style='font-size:80%;' id='edit_auto_stock_source_" + x + "'>Stock: <span class='white_text' style='font-size:100%;'> " + beauty(planets[d].resources[x]) + " <span class='" + (0 <= l[x] ? 0 < l[x] ? "green_text" : "gray_text" : "red_text") + "'>(" + (0 < l[x] ? "+" : "") + beauty(l[x]) + "/s)</span>",
                m = x,
                0 != n[m] && (h += "<span class='" + (0 <= n[m] ? 0 < n[m] ? "purple_text" : "gray_text" : "pink_text oblique_txt") + "'> (" + (0 < n[m] ? "+" : "") + beauty(n[m]) + "/s)</span>"),
                h += "</span></span><br><span class='blue_text' style='font-size:80%;' id='new_source_" + x + "'></span><span style='float:right;margin-righ:16px;' class='blue_text'><input type='checkbox' id='source_pct_" + x + "' name='" + x + "' value='false'>Use %        </input>(<input style='width:64px;height:12px;font-size:92%' id='res_slide0_" + x + "' name='" + x + "' type='text' value='0'/>/s) <input style='width:80px' id='res_textval0_" + x + "' name='" + x + "' type='text' value='0'/></span><br><br>"
        }
        h = h + "<span class='blue_text' style='font-size:120%'></span><br><br></div><div style='float:left;margin:0;width:4%;'><span class='blue_text' style='font-size:120%'></span><br><br></div><div style='float:left;margin:0;width:46%;'>" + ("<img src='" + IMG_FOLDER + "/" + planets[e][PLANET_IMG_FIELD] + (1 == PLANET_FOLDER_DOUBLE ? "/" + planets[e][PLANET_IMG_FIELD] : "") + ".png' class='icon' style='cursor:pointer;position:relative;top:8px;'/><span class='blue_text' style='font-size:150%'> " + planets[e].name + "</span><br><span class='blue_text'> Fleet storage: </span><span id='needed_storage1' class='white_text'>0</span><span class='white_text'>/" + beauty(b.maxStorage()) + "</span><span style='float:right;margin-righ:16px;'  class='blue_text'>Select the amount of resources<br>you want to load in this " + LOCALE_PLANET_NAME + "</span><br>");
        gameSettings.advancedAutoroute && (h += "<input type='checkbox' id='check100d' value='false'><span class='blue_text'>Check all to </span></input><input style='width:32px' id='check100d_txt' type='text' value='105'/><span class='blue_text'> %</span>");
        h += "<br><br><br>";
        l = planets[e].rawProduction();
        var y = Array(resNum);
        planets[e].importExport();
        for (m = 0; m < resNum; m++)
            y[m] = planets[e].globalImport[m] - planets[e].globalExport[m];
        u = Array(resNum);
        for (m = 0; m < resNum; m++)
            u[m] = m;
        gameSettings.sortResName && (u = sortedResources);
        for (v = 0; v < resNum; v++)
            if (x = u[v],
            resources[x].show(game) || 1 <= planets[e].resources[x])
                h += "<span class='blue_text' style='font-size:80%;'>" + resources[x].name.capitalize() + "</span><br><span class='blue_text' style='font-size:80%;' id='edit_auto_stock_dest_" + x + "'>Stock: <span class='white_text' style='font-size:100%;'> " + beauty(planets[e].resources[x]) + " <span class='" + (0 <= l[x] ? 0 < l[x] ? "green_text" : "gray_text" : "red_text") + "'>(" + (0 < l[x] ? "+" : "") + beauty(l[x]) + "/s)</span>",
                m = x,
                0 != y[m] && (h += "<span class='" + (0 <= y[m] ? 0 < y[m] ? "purple_text" : "gray_text" : "pink_text oblique_txt") + "'> (" + (0 < y[m] ? "+" : "") + beauty(y[m]) + "/s)</span>"),
                h += "</span></span><br><span class='blue_text' style='font-size:80%;' id='new_dest_" + x + "'></span><span style='float:right;margin-righ:16px;' class='blue_text'><input type='checkbox' id='dest_pct_" + x + "' name='" + x + "' value='false'>Use %        </input>(<input style='width:64px;height:12px;font-size:92%' id='res_slide1_" + x + "' name='" + x + "' type='text' value='0'/>/s) <input style='width:80px' id='res_textval1_" + x + "' name='" + x + "' type='text' value='0'/></span><br><br>";
        h += "<span class='blue_text' style='font-size:120%'></span><br><br></div></div><span class='blue_text button' id='but_editroute' style='font-size:120%;position:absolute;left:45%;bottom:0%;'>Edit Route</span>";
        document.getElementById("profile_info_list") && (document.getElementById("profile_info_list").innerHTML = h);
        $("#checkallnew").prop("checked", !0);
        for (h = 0; h < resNum; h++)
            $("#res_slide0_" + h).change(function() {
                isFinite(1E3 * Math.floor(parseInt($(this).val()))) || $(this).val(0);
                $("#res_textval0_" + $(this).attr("name")).val(parseInt(parseFloat($(this).val()) * g));
                currentUpdater()
            }),
            $("#res_textval0_" + h).change(function() {
                isFinite(parseInt($(this).val())) ? parseInt($(this).val()) > $("#res_slide0_" + $(this).attr("name")).attr("max") && $(this).val($("#res_slide0_" + $(this).attr("name")).attr("max")) : $(this).val(0);
                $("#res_slide0_" + $(this).attr("name")).val(parseInt($(this).val()) / g);
                currentUpdater()
            }),
            $("#res_slide1_" + h).change(function() {
                isFinite(1E3 * Math.floor(parseInt($(this).val()))) || $(this).val(0);
                $("#res_textval1_" + $(this).attr("name")).val(parseInt(parseFloat($(this).val()) * g));
                currentUpdater()
            }),
            $("#res_textval1_" + h).change(function() {
                isFinite(parseInt($(this).val())) ? parseInt($(this).val()) > $("#res_slide1_" + $(this).attr("name")).attr("max") && $(this).val($("#res_slide1_" + $(this).attr("name")).attr("max")) : $(this).val(0);
                $("#res_slide1_" + $(this).attr("name")).val(parseInt($(this).val()) / g);
                currentUpdater()
            }),
            b.autoPct[h] ? ($("#res_textval0_" + h).val(Math.floor(b.autoRes[b.autoMap[d]][h]) / 100),
            $("#res_textval1_" + h).val(Math.floor(b.autoRes[b.autoMap[e]][h]) / 100)) : ($("#res_slide0_" + h).val(Math.floor(1E3 * b.autoRes[b.autoMap[d]][h] / g) / 1E3),
            $("#res_slide1_" + h).val(Math.floor(1E3 * b.autoRes[b.autoMap[e]][h] / g) / 1E3),
            $("#res_textval0_" + h).val(b.autoRes[b.autoMap[d]][h]),
            $("#res_textval1_" + h).val(b.autoRes[b.autoMap[e]][h])),
            b.autoPct[h] ? ($("#source_pct_" + h).prop("checked", !0),
            $("#dest_pct_" + h).prop("checked", !0)) : ($("#source_pct_" + h).prop("checked", !1),
            $("#dest_pct_" + h).prop("checked", !1)),
            $("#source_pct_" + h).change(function() {
                var d = $(this).attr("name");
                $("#dest_pct_" + d).prop("checked", this.checked);
                (b.autoPct[d] = this.checked) ? ($("#res_slide0_" + d).hide(),
                $("#res_slide1_" + d).hide()) : ($("#res_slide0_" + d).show(),
                $("#res_slide1_" + d).show())
            }),
            $("#dest_pct_" + h).change(function() {
                var d = $(this).attr("name");
                $("#source_pct_" + d).prop("checked", this.checked);
                (b.autoPct[d] = this.checked) ? ($("#res_slide0_" + d).hide(),
                $("#res_slide1_" + d).hide()) : ($("#res_slide0_" + d).show(),
                $("#res_slide1_" + d).show())
            }),
            b.autoPct[h] ? ($("#res_slide0_" + h).hide(),
            $("#res_slide1_" + h).hide()) : ($("#res_slide0_" + h).show(),
            $("#res_slide1_" + h).show());
        $("#checkall").change(function() {
            for (var d = 0; d < resNum; d++)
                $("#dest_pct_" + d).prop("checked", this.checked),
                $("#source_pct_" + d).prop("checked", this.checked),
                b.autoPct[d] = this.checked,
                $("#res_textval0_" + d).val("0"),
                $("#res_textval1_" + d).val("0"),
                this.checked ? ($("#res_slide0_" + d).hide(),
                $("#res_slide1_" + d).hide()) : ($("#res_slide0_" + d).show(),
                $("#res_slide1_" + d).show())
        });
        $("#check100s").change(function() {
            if (!$("#checkall").prop("checked")) {
                $("#checkall").prop("checked", !0);
                for (var d = 0; d < resNum; d++)
                    $("#dest_pct_" + d).prop("checked", this.checked),
                    $("#source_pct_" + d).prop("checked", this.checked),
                    b.autoPct[d] = this.checked,
                    $("#res_textval0_" + d).val("0"),
                    $("#res_textval1_" + d).val("0"),
                    this.checked ? ($("#res_slide0_" + d).hide(),
                    $("#res_slide1_" + d).hide()) : ($("#res_slide0_" + d).show(),
                    $("#res_slide1_" + d).show())
            }
            for (d = 0; d < resNum; d++)
                $("#res_textval0_" + d).val($("#check100s_txt").val())
        });
        $("#check100d").change(function() {
            if (!$("#checkall").prop("checked")) {
                $("#checkall").prop("checked", !0);
                for (var d = 0; d < resNum; d++)
                    $("#dest_pct_" + d).prop("checked", this.checked),
                    $("#source_pct_" + d).prop("checked", this.checked),
                    b.autoPct[d] = this.checked,
                    $("#res_textval0_" + d).val("0"),
                    $("#res_textval1_" + d).val("0"),
                    this.checked ? ($("#res_slide0_" + d).hide(),
                    $("#res_slide1_" + d).hide()) : ($("#res_slide0_" + d).show(),
                    $("#res_slide1_" + d).show())
            }
            for (d = 0; d < resNum; d++)
                $("#res_textval1_" + d).val($("#check100d_txt").val())
        });
        $("#check100s_txt").change(function() {
            isFinite(parseInt($(this).val())) || $(this).val("105");
            currentUpdater()
        });
        $("#check100d_txt").change(function() {
            isFinite(parseInt($(this).val())) || $(this).val("105");
            currentUpdater()
        });
        currentUpdater = function() {
            for (var h = planets[d].rawProduction(), l = planets[e].rawProduction(), m = 0; m < resNum; m++)
                if (resources[m].show(game) || 1 <= planets[e].resources[m]) {
                    var u = m
                      , v = ""
                      , w = "";
                    0 != n[u] && (v += "<span class='" + (0 <= n[u] ? 0 < n[u] ? "purple_text" : "gray_text" : "pink_text oblique_txt") + "'> (" + (0 < n[u] ? "+" : "") + beauty(n[u]) + "/s)</span>");
                    0 != y[u] && (w += "<span class='" + (0 <= y[u] ? 0 < y[u] ? "purple_text" : "gray_text" : "pink_text oblique_txt") + "'> (" + (0 < y[u] ? "+" : "") + beauty(y[u]) + "/s)</span>");
                    document.getElementById("edit_auto_stock_dest_" + m) && (document.getElementById("edit_auto_stock_dest_" + m).innerHTML = "Stock: <span class='white_text' style='font-size:100%;'> " + beauty(planets[e].resources[m]) + " <span class='" + (0 <= l[m] ? 0 < l[m] ? "green_text" : "gray_text" : "red_text") + "'>(" + (0 < l[m] ? "+" : "") + beauty(l[m]) + "/s)</span>" + w + "</span>");
                    document.getElementById("edit_auto_stock_source_" + m) && (document.getElementById("edit_auto_stock_source_" + m).innerHTML = "Stock: <span class='white_text' style='font-size:100%;'> " + beauty(planets[d].resources[m]) + " <span class='" + (0 <= h[m] ? 0 < h[m] ? "green_text" : "gray_text" : "red_text") + "'>(" + (0 < h[m] ? "+" : "") + beauty(h[m]) + "/s)</span>" + v + "</span>");
                    w = v = 0;
                    $("#res_textval0_" + m).val() && (b.autoPct[m] ? 0 < planets[d].globalRaw[m] ? v += planets[d].globalRaw[m] * parseFloat($("#res_textval0_" + m).val()) / 100 * g / idleBon : w += -planets[d].globalRaw[m] * parseFloat($("#res_textval0_" + m).val()) / 100 * g / idleBon : v = parseInt($("#res_textval0_" + m).val()));
                    $("#res_textval1_" + m).val() && (b.autoPct[m] ? planets[e].globalRaw[m] ? w += planets[e].globalRaw[m] * parseFloat($("#res_textval1_" + m).val()) / 100 * g / idleBon : v += -planets[e].globalRaw[m] * parseFloat($("#res_textval1_" + m).val()) / 100 * g / idleBon : w = parseInt($("#res_textval1_" + m).val()));
                    u = (-v + w) / g * idleBon;
                    v = (-w + v) / g * idleBon;
                    document.getElementById("new_source_" + m) && (document.getElementById("new_source_" + m).innerHTML = "This fleet will give: <span class='white_text' style='font-size:100%;'><span class='" + (0 <= u ? 0 < u ? "green_text" : "gray_text" : "red_text") + "'>(" + (0 < u ? "+" : "") + beauty(u) + "/s)</span>");
                    document.getElementById("new_dest_" + m) && (document.getElementById("new_dest_" + m).innerHTML = "This fleet will give: <span class='white_text' style='font-size:100%;'><span class='" + (0 <= v ? 0 < v ? "green_text" : "gray_text" : "red_text") + "'>(" + (0 < v ? "+" : "") + beauty(v) + "/s)</span>")
                }
            for (m = l = h = 0; m < resNum; m++)
                $("#res_textval0_" + m).val() && (b.autoPct[m] ? 0 > planets[d].globalRaw[m] ? l += -parseFloat($("#res_textval0_" + m).val()) / 100 * planets[d].globalRaw[m] * g : h += parseFloat($("#res_textval0_" + m).val()) / 100 * planets[d].globalRaw[m] * g : h += parseInt($("#res_textval0_" + m).val())),
                $("#res_textval1_" + m).val() && (b.autoPct[m] ? 0 > planets[e].globalRaw[m] ? h += -parseFloat($("#res_textval1_" + m).val()) / 100 * planets[e].globalRaw[m] * g : l += parseFloat($("#res_textval1_" + m).val()) / 100 * planets[e].globalRaw[m] * g : l += parseInt($("#res_textval1_" + m).val()));
            h = Math.floor(h);
            l = Math.floor(l);
            $("#needed_storage0").html(beauty(h));
            $("#needed_storage1").html(beauty(l))
        }
        ;
        $("#but_editroute").unbind();
        $("#but_editroute").click(function() {
            for (var h = 0, l = 0, n = 0; n < resNum; n++)
                $("#res_textval0_" + n).val() && (b.autoPct[n] ? 0 > planets[d].globalRaw[n] ? l += -parseFloat($("#res_textval0_" + n).val()) / 100 * planets[d].globalRaw[n] * g : h += parseFloat($("#res_textval0_" + n).val()) / 100 * planets[d].globalRaw[n] * g : h += parseInt($("#res_textval0_" + n).val())),
                $("#res_textval1_" + n).val() && (b.autoPct[n] ? 0 > planets[e].globalRaw[n] ? h += -parseFloat($("#res_textval1_" + n).val()) / 100 * planets[e].globalRaw[n] * g : l += parseFloat($("#res_textval1_" + n).val()) / 100 * planets[e].globalRaw[n] * g : l += parseInt($("#res_textval1_" + n).val()));
            h = Math.floor(h);
            l = Math.floor(l);
            if (gameSettings.autoover || h <= b.maxStorage())
                if (gameSettings.autoover || l <= b.maxStorage()) {
                    b.autoMap[d] = 0;
                    b.autoMap[e] = 1;
                    for (n = 0; n < resNum; n++)
                        $("#res_textval0_" + n).val() ? (h = parseInt($("#res_textval0_" + n).val()),
                        b.autoPct[n] && (h = 100 * parseFloat($("#res_textval0_" + n).val())),
                        b.autoRes[b.autoMap[d]][n] = h) : ($("#check100s").prop("checked") || $("#checkall").prop("checked")) && $("#checkallnew").prop("checked") && !resources[n].show(game) ? (b.autoPct[n] = !0,
                        b.autoRes[b.autoMap[d]][n] = 100 * parseFloat($("#check100s_txt").val())) : b.autoRes[b.autoMap[d]][n] = 0,
                        $("#res_textval1_" + n).val() ? (h = parseInt($("#res_textval1_" + n).val()),
                        b.autoPct[n] && (h = 100 * parseFloat($("#res_textval1_" + n).val())),
                        b.autoRes[b.autoMap[e]][n] = h) : ($("#check100d").prop("checked") || $("#checkall").prop("checked")) && $("#checkallnew").prop("checked") && !resources[n].show(game) ? (b.autoPct[n] = !0,
                        b.autoRes[b.autoMap[e]][n] = 100 * parseFloat($("#check100d_txt").val())) : b.autoRes[b.autoMap[e]][n] = 0;
                    b.type = "auto";
                    ba(currentCriteriaAuto)
                } else
                    n = new w(210,0,"<span class='red_text red_text_shadow'>Not enough storage to load resources in " + planets[e].name + "!</span>","info"),
                    n.drawToast();
            else
                n = new w(210,0,"<span class='red_text red_text_shadow'>Not enough storage to load resources in " + planets[d].name + "!</span>","info"),
                n.drawToast()
        });
        K();
        $("#profile_interface").show();
        game.searchPlanet(currentPlanet.id) && $("#bottom_build_menu").show()
    }
    if (MAP_REGIONS)
        for (var ma = [], U = "white red blu aqua cyan orange darkorange gray darkgray green lightgreen yellow ocra magenta pink violet cream lightcream brown lightbrown lightlightbrown sand".split(" "), xa = 0 * regionsDefinition.length, W = 0; W < xa; W++)
            for (var za = 0; za < U.length; za++) {
                var Ba = new Image;
                Ba.onload = function() {
                    var b = ma.indexOf(this);
                    -1 !== b && ma.splice(b, 1);
                    console.log("loaded")
                }
                ;
                ma.push(Ba);
                Ba.src = IMG_FOLDER + "/" + REGIONS_FOLDER + "/" + U[za] + "_" + regionsDefinition[W].icon
            }
    console.log("[Version] " + GAME_VERSION + GAME_SUB_VERSION);
    loadReset = g;
    document.getElementById("l_info") && (document.getElementById("l_info").innerHTML = "Loading engine...");
    $("#loading_bar").css("width", "33%");
    exportAddHoverPopup = h;
    exportUpdateBuildingList = v;
    var ua = (new Date).getTime()
      , sa = (new Date).getTime()
      , Aa = (new Date).getTime()
      , ha = (new Date).getTime();
    exportMain = F;
    exportButton = m;
    exportPopup = w;
    exportPermanentMenu = I;
    exportPlanetInterface = C;
    exportBuildingSelectionInterface = B;
    var N = [];
    N.v = 50;
    var na = 0;
    exportShipyardInterface = aa;
    exportTechInterface = ca;
    exportResearchInterface = P;
    exportShipInterface = S;
    exportTravelingShipInterface = ba;
    exportShipInterface = S;
    exportMarketInterface = fa;
    exportRaceInterface = function(b, d) {
        currentInterface = "raceInterface";
        $("#race_interface").html("<img src='img/racers/'");
        currentUpdater = function() {}
        ;
        K();
        $("#race_interface").show();
        game.searchPlanet(currentPlanet.id) && ($("#bottom_build_menu").show(),
        5 <= game.researches[3].level ? ($("#b_market_icon").show(),
        $("#b_shipyard_icon").show()) : (1 <= game.researches[3].level && $("#b_shipyard_icon").show(),
        $("#b_market_icon").hide()))
    }
    ;
    exportTournamentInterface = M;
    overviewPlanetExpand = Array(planets.length);
    overviewResourceExpand = Array(planets.length);
    overviewRoutesExpand = Array(planets.length);
    for (U = 0; U < planets.length; U++) {
        overviewPlanetExpand[U] = !1;
        overviewRoutesExpand[U] = !1;
        overviewResourceExpand[U] = Array(resNum);
        for (W = 0; W < resNum; W++)
            overviewResourceExpand[U][W] = !1;
        overviewResourceExpand[U].energy = !1;
        overviewResourceExpand[U].research = !1
    }
    overviewPlanetExpand.empire = !1;
    overviewResourceExpand.empire = Array(resNum);
    for (W = 0; W < resNum; W++)
        overviewResourceExpand.empire[W] = !1;
    overviewResourceExpand.empire.research = !1;
    exportExportString = ka;
    exportSaveCloud = ta;
    exportExpInterface = wa;
    document.getElementById("l_info") && (document.getElementById("l_info").innerHTML = "Loading interface...");
    if (!MOBILE_LANDSCAPE)
        try {
            window.localStorage && console.log("ok")
        } catch (n) {
            document.getElementById("l_info") && (document.getElementById("l_info").innerHTML = "Cookies disabled! Please enable them or you won't be able to save the game")
        }
    $("#l_info").click(wipeData);
    $("#loading_bar").css("width", "67%");
    document.getElementById("topbar_name") && (document.getElementById("topbar_name").innerHTML = game.playerName);
    saveBase();
    (function() {
        if (MOBILE_LANDSCAPE && window.JsJavaInterface) {
            var d = window.JsJavaInterface.loadGame();
            "noload" != d && pa(d)
        } else {
            d = !1;
            if ("undefined" !== typeof Storage)
                if (null != localStorage.getItem(SAVESTR_HEAD + "sv0cpt") && null != localStorage.getItem(SAVESTR_HEAD + "sv0plt") && null != localStorage.getItem(SAVESTR_HEAD + "sv0civ")) {
                    firstTime = !1;
                    "true" == localStorage.getItem(SAVESTR_HEAD + "sv0first") && (firstTime = !0);
                    if (null != localStorage.getItem(SAVESTR_HEAD + "sv0vers")) {
                        var e = JSON.parse(decodeURIComponent(atob(localStorage.getItem(SAVESTR_HEAD + "sv0civ"))));
                        capital = parseInt(atob(localStorage.getItem(SAVESTR_HEAD + "sv0cpt")));
                        var h = JSON.parse(decodeURIComponent(atob(localStorage.getItem(SAVESTR_HEAD + "sv0plt"))));
                        var g = JSON.parse(decodeURIComponent(atob(localStorage.getItem(SAVESTR_HEAD + "sv0sch"))))
                    } else
                        e = JSON.parse(atob(localStorage.getItem(SAVESTR_HEAD + "sv0civ"))),
                        capital = parseInt(atob(localStorage.getItem(SAVESTR_HEAD + "sv0cpt"))),
                        h = JSON.parse(atob(localStorage.getItem(SAVESTR_HEAD + "sv0plt"))),
                        g = JSON.parse(atob(localStorage.getItem(SAVESTR_HEAD + "sv0sch")));
                    console.log(e);
                    console.log(h);
                    console.log(g);
                    g.st && settingsLoader(g.st);
                    0 < userID && gameSettings.cloudSave && (cloudLoadingGoingOn = !0,
                    $.post("https://heartofgalaxy.com/load.php", {
                        id: userID,
                        name: userName,
                        time: Math.round(e[0].lastSaved / 1E3)
                    }).done(function(b) {
                        " no " == b ? b = new exportPopup(210,0,"<span class='blue_text text_shadow'>Detected newer local version</span>","info") : " error " == b ? b = new exportPopup(210,0,"<span class='blue_text text_shadow'>Error during online loading</span>","info") : (b = b.substr(1),
                        b = pa(b),
                        "" == b && (b = "<span class='blue_text text_shadow'>Game loaded from online save!</span>"),
                        b = new exportPopup(210,0,b,"info"));
                        b.drawToast();
                        cloudLoadingGoingOn = !1;
                        console.log("okcloud")
                    }).fail(function() {
                        (new exportPopup(210,0,"<span class='red_text red_text_shadow'>Error during online loading, loading from local</span>","info")).drawToast();
                        cloudLoadingGoingOn = !1;
                        console.log("failcloud")
                    }));
                    console.log("LENGTH " + e.length);
                    console.log(gameSettings.cloudSave);
                    for (var l = 0; l < e.length; l++)
                        civisLoader(civis[l], e[l], civis[l].name);
                    governmentList[game.chosenGovern].bonus();
                    console.log(civis[0]);
                    game = civis[gameSettings.civis];
                    for (l = 0; l < h.length; l++)
                        h[l] && planetLoader(planets[l], h[l]);
                    fleetSchedule.count = g.count;
                    e = 0;
                    for (var m in g.fleets)
                        e++;
                    fleetSchedule.load(g.schedule, g.fleets, e);
                    g.m && market.load(g.m);
                    g.qur && (qurisTournament.points = 0,
                    g.qur.points && (qurisTournament.points = g.qur.points || 0),
                    qurisTournament.lose = 0,
                    g.qur.lose && (qurisTournament.lose = g.qur.lose || 0));
                    if (g.art)
                        for (var u in g.art)
                            artifacts[artifactsName[u]].collect();
                    if (g.chr)
                        for (u in g.chr)
                            characters[charactersName[u]].unlocked = !0;
                    if (g.qst)
                        for (var v in g.qst)
                            quests[questNames[v]].done = !0;
                    if (g.plc)
                        for (v in g.plc)
                            places[placesNames[v]].done = !0;
                    if (g.tuts)
                        for (v in g.tuts)
                            tutorialsNames[v] && (tutorials[tutorialsNames[v]].done = !0);
                    console.log(game.planets.length);
                    setIdleBonus();
                    setTimeout(function() {
                        submitNumber("Number of planets", game.planets.length);
                        submitNumber("Infuence", game.influence());
                        var d = b();
                        submitNumber("Military Value", d);
                        submitNumber("Number of time travels", game.timeTravelNum);
                        submitNumber("Tournament Rank", qurisTournament.points + 1);
                        d = parseInt(Math.floor(game.days / 365));
                        submitNumber("Total years", d);
                        submitNumber("totaltp", parseInt(game.totalTPspent()));
                        submitNumber("Total Population", parseInt(game.totalPopulation()))
                    }, 5E3)
                } else
                    console.log("No data to load"),
                    d = !0;
            else
                console.log("Unable to load game!"),
                d = !0;
            0 < userID && d && (cloudLoadingGoingOn = !0,
            $.post("https://heartofgalaxy.com/load.php", {
                id: userID,
                name: userName,
                time: 0
            }).done(function(b) {
                " no " == b ? b = new exportPopup(210,0,"<span class='blue_text text_shadow'>Detected newer local version</span>","info") : " error " == b ? b = new exportPopup(210,0,"<span class='blue_text text_shadow'>Error during online loading</span>","info") : (b = b.substr(1),
                b = pa(b),
                "" == b && (b = "<span class='blue_text text_shadow'>Game loaded from online save!</span>"),
                b = new exportPopup(210,0,b,"info"));
                b.drawToast();
                cloudLoadingGoingOn = !1
            }).fail(function() {
                (new exportPopup(210,0,"<span class='red_text red_text_shadow'>Error during online loading, loading from local</span>","info")).drawToast();
                cloudLoadingGoingOn = !1
            }))
        }
    }
    )();
    $("#menu_icon").click(I);
    $("#planet_list_button").click(O);
    $("#building_button").click(function() {
        currentPlanet.civis == game.id ? B() : (new w(220,0,"<span class='red_text'>You do not own this planet!</span>!","info")).drawToast()
    });
    $("#research_button").click(P);
    $("#map_button").click(function() {
        0 < game.researches[researchesName.astronomy].level ? L(currentNebula) : (new w(220,0,"<span class='white_text'>You must research </span><br><span class='blue_text text_shadow'>Interstellar Travel</span>!","info")).drawToast()
    });
    $("#quest_button").click(function() {
        currentInterface = "questInterface";
        currentUpdater = function() {}
        ;
        for (var b in game.acceptedQuest)
            ;
        document.getElementById("quest_list") && (document.getElementById("quest_list").innerHTML = "");
        K();
        $("#quest_interface").show()
    });
    $("#ship_button").click(function() {
        0 < game.researches[researchesName.astronomy].level ? S(currentCriteria) : (new w(220,0,"<span class='white_text'>You must research </span><br><span class='blue_text text_shadow'>Interstellar Travel</span>!","info")).drawToast()
    });
    $("#extraction_button").click(function() {
        z("mining", currentPlanet)
    });
    $("#production_button").click(function() {
        z("prod", currentPlanet)
    });
    $("#energy_button").click(function() {
        z("energy", currentPlanet)
    });
    $("#defence_button").click(function() {
        MOBILE_LANDSCAPE ? z("research", currentPlanet) : C(currentPlanet)
    });
    $("#shipyard_button").click(function() {
        aa(currentPlanet)
    });
    $("#other_button").click(function() {
        z("other", currentPlanet)
    });
    $("#settings_save").click(function() {
        soundSetting = $("#sound_check").prop("checked") ? !0 : !1;
        musicSetting = $("#music_check").prop("checked") ? !0 : !1
    });
    $("#settings_icon").click(function() {
        currentInterface = "settingsInterface";
        autosave ? $("#autosave_check").prop("checked", !0) : $("#autosave_check").prop("checked", !1);
        soundSetting ? $("#sound_check").prop("checked", !0) : $("#sound_check").prop("checked", !1);
        musicSetting ? $("#music_check").prop("checked", !0) : $("#music_check").prop("checked", !1);
        K();
        $("#settings_interface").show();
        $("#back_button").unbind();
        $("#back_button").click(I);
        $("#back_button").show();
        game.searchPlanet(currentPlanet.id) && $("#bottom_build_menu").show()
    });
    $("#export_icon").click(function() {
        wa()
    });
    $("#export_icon").hover(function() {
        (new w(128,10,"<span class='blue_text' style='width:100%;text-align:center'>Save Export</span>","info")).drawInfo();
        $(document).on("mousemove", function(b) {
            mouseX = b.pageX + 16;
            mouseY = b.pageY + 10;
            $("#popup_info").css({
                left: mouseX,
                top: mouseY
            })
        });
        $("#popup_info").css({
            left: mouseX,
            top: mouseY
        })
    }, function() {
        currentPopup.drop()
    });
    $("#export_icon").mouseout(function() {
        $(document).on("mousemove", function() {})
    });
    $("#pause_button").click(function() {
        if (gameSettings.gamePaused) {
            gameSettings.gamePaused = !1;
            0 < idlePauseDuration && setSubBon(idlePauseDuration);
            $("#pause_button").attr("src", "" + UI_FOLDER + "/pause.png");
            var b = new w(120,0,"<span class='blue_text text_shadow'>Game resumed</span>!","info")
        } else
            gameSettings.gamePaused = !0,
            stopBon(),
            $("#pause_button").attr("src", "" + UI_FOLDER + "/arrow_small.png"),
            b = new w(120,0,"<span class='blue_text text_shadow'>Game paused</span>!","info");
        b.drawToast()
    });
    h("pause_button", "<span class='blue_text' style='width:100%;text-align:center'>Pause the game</span>", 110);
    $("#save_icon").click(function() {
        save();
        0 < userID && ta()
    });
    $("#save_icon").hover(function() {
        (new w(50,10,"<span class='blue_text' style='width:100%;text-align:center'>Save</span>","info")).drawInfo();
        $(document).on("mousemove", function(b) {
            mouseX = b.pageX + 16;
            mouseY = b.pageY + 10;
            $("#popup_info").css({
                left: mouseX,
                top: mouseY
            })
        });
        $("#popup_info").css({
            left: mouseX,
            top: mouseY
        })
    }, function() {
        currentPopup.drop()
    });
    $("#save_icon").mouseout(function() {
        $(document).on("mousemove", function() {})
    });
    var Q = new function(b, d, e) {
        this.a = this.t = b;
        this.format = d;
        this.name = e;
        this.c = function() {
            Q.a = (8253729 * Q.a + 2396403) % 2147483647;
            return Q.a
        }
        ;
        this.f = function() {
            this.a = this.t = 2324924;
            for (var b = 0, d = 1; 67 > d; d++)
                b += this.c(),
                b += "bcdfghijklmnpqrstvwxyz"[14 * Math.random()],
                b += "aeiouy"[5 * Math.random()]
        }
    }
    (2324924,"ac","hc","hh");
    Q.f();
    W = Q.c;
    for (U = 0; 22 > U; U++) {
        var Z;
        xa = 0x38ec4e902b231;
        0 == xa ? Z = 0 : (xa = xa || 1E31,
        Z = W() % (xa + 1));
        N[U] = new a("z/" + Z);
        N[U].b = N[U].play
    }
    N.v = gameSettings.musicVolume;
    qa();
    $("#info_icon").click(function() {
        T()
    });
    $("#info_icon").hover(function() {
        (new w(48,10,"<span class='blue_text' style='width:100%;text-align:center'>Info</span>","info")).drawInfo();
        $(document).on("mousemove", function(b) {
            mouseX = b.pageX + 16;
            mouseY = b.pageY + 10;
            $("#popup_info").css({
                left: mouseX,
                top: mouseY
            })
        });
        $("#popup_info").css({
            left: mouseX,
            top: mouseY
        })
    }, function() {
        currentPopup.drop()
    });
    $("#info_icon").mouseout(function() {
        $(document).on("mousemove", function() {})
    });
    $("#tutorial_icon").click(startTutorial);
    adsAvailable || $("#ads_icon").hide();
    $("#ads_icon").click(function() {
        (new w(320,80,"<br><span class='blue_text'>Do you want to watch an ad and get a production bonus now?</span>","confirm",function() {
            showAds()
        }
        )).draw()
    });
    $("#b_fleet_icon").click(function() {
        game.researches[researchesName[FLEET_ENABLING_RESEARCH]].level > FLEET_ENABLING_LEVEL ? S(currentCriteria) : (new w(220,0,"<span class='white_text'>You must research </span><br><span class='blue_text text_shadow'>Interstellar Travel</span>!","info")).drawToast()
    });
    $("#b_fleet_icon").hover(function() {
        (new w(80,10,"<span class='blue_text' style='width:100%;text-align:center'>Fleets</span>","info")).drawInfo();
        $(document).on("mousemove", function(b) {
            mouseX = b.pageX + 16;
            mouseY = b.pageY + 10;
            $("#popup_info").css({
                left: mouseX,
                top: mouseY
            })
        });
        $("#popup_info").css({
            left: mouseX,
            top: mouseY
        })
    }, function() {
        currentPopup.drop()
    });
    $("#b_fleet_icon").mouseout(function() {
        $(document).on("mousemove", function() {})
    });
    $("#b_map_icon").click(function() {
        game.researches[researchesName[MAP_ENABLING_RESEARCH]].level > MAP_ENABLING_LEVEL ? L(currentNebula) : (new w(220,0,"<span class='white_text'>You must research </span><br><span class='blue_text text_shadow'>Interstellar Travel</span>!","info")).drawToast()
    });
    $("#b_map_icon").hover(function() {
        (new w(48,10,"<span class='blue_text' style='width:100%;text-align:center'>Map</span>","info")).drawInfo();
        $(document).on("mousemove", function(b) {
            mouseX = b.pageX + 16;
            mouseY = b.pageY + 10;
            $("#popup_info").css({
                left: mouseX,
                top: mouseY
            })
        });
        $("#popup_info").css({
            left: mouseX,
            top: mouseY
        })
    }, function() {
        currentPopup.drop()
    });
    $("#b_map_icon").mouseout(function() {
        $(document).on("mousemove", function() {})
    });
    $("#b_select_icon").click(O);
    $("#b_select_icon").hover(function() {
        (new w(80,10,"<span class='blue_text' style='width:100%;text-align:center'>Overview</span>","info")).drawInfo();
        $(document).on("mousemove", function(b) {
            mouseX = b.pageX + 16;
            mouseY = b.pageY + 10;
            $("#popup_info").css({
                left: mouseX,
                top: mouseY
            })
        });
        $("#popup_info").css({
            left: mouseX,
            top: mouseY
        })
    }, function() {
        currentPopup.drop()
    });
    $("#b_select_icon").mouseout(function() {
        $(document).on("mousemove", function() {})
    });
    $("#b_build_icon").click(function() {
        currentPlanet.civis == game.id ? B() : (new w(220,0,"<span class='red_text'>You do not own this planet!</span>!","info")).drawToast()
    });
    $("#b_build_icon").hover(function() {
        (new w(80,10,"<span class='blue_text' style='width:100%;text-align:center'>Buildings</span>","info")).drawInfo();
        $(document).on("mousemove", function(b) {
            mouseX = b.pageX + 16;
            mouseY = b.pageY + 10;
            $("#popup_info").css({
                left: mouseX,
                top: mouseY
            })
        });
        $("#popup_info").css({
            left: mouseX,
            top: mouseY
        })
    }, function() {
        currentPopup.drop()
    });
    $("#b_build_icon").mouseout(function() {
        $(document).on("mousemove", function() {})
    });
    $("#b_extraction_icon").click(function() {
        z("mining", currentPlanet)
    });
    $("#b_extraction_icon").hover(function() {
        (new w(95,10,"<span class='blue_text' style='width:100%;text-align:center'>Extraction</span>","info")).drawInfo();
        $(document).on("mousemove", function(b) {
            mouseX = b.pageX + 16;
            mouseY = b.pageY + 10;
            $("#popup_info").css({
                left: mouseX,
                top: mouseY
            })
        });
        $("#popup_info").css({
            left: mouseX,
            top: mouseY
        })
    }, function() {
        currentPopup.drop()
    });
    $("#b_extraction_icon").mouseout(function() {
        $(document).on("mousemove", function() {})
    });
    $("#b_production_icon").click(function() {
        z("prod", currentPlanet)
    });
    $("#b_production_icon").hover(function() {
        (new w(96,10,"<span class='blue_text' style='width:100%;text-align:center'>Production</span>","info")).drawInfo();
        $(document).on("mousemove", function(b) {
            mouseX = b.pageX + 16;
            mouseY = b.pageY + 10;
            $("#popup_info").css({
                left: mouseX,
                top: mouseY
            })
        });
        $("#popup_info").css({
            left: mouseX,
            top: mouseY
        })
    }, function() {
        currentPopup.drop()
    });
    $("#b_production_icon").mouseout(function() {
        $(document).on("mousemove", function() {})
    });
    $("#b_energy_icon").click(function() {
        z("energy", currentPlanet)
    });
    $("#b_energy_icon").hover(function() {
        (new w(64,10,"<span class='blue_text' style='width:100%;text-align:center'>Energy</span>","info")).drawInfo();
        $(document).on("mousemove", function(b) {
            mouseX = b.pageX + 16;
            mouseY = b.pageY + 10;
            $("#popup_info").css({
                left: mouseX,
                top: mouseY
            })
        });
        $("#popup_info").css({
            left: mouseX,
            top: mouseY
        })
    }, function() {
        currentPopup.drop()
    });
    $("#b_energy_icon").mouseout(function() {
        $(document).on("mousemove", function() {})
    });
    $("#b_defence_icon").click(function() {
        C(currentPlanet)
    });
    $("#b_shipyard_icon").click(function() {
        aa(currentPlanet)
    });
    $("#b_shipyard_icon").hover(function() {
        (new w(80,10,"<span class='blue_text' style='width:100%;text-align:center'>Shipyard</span>","info")).drawInfo();
        $(document).on("mousemove", function(b) {
            mouseX = b.pageX + 16;
            mouseY = b.pageY + 10;
            $("#popup_info").css({
                left: mouseX,
                top: mouseY
            })
        });
        $("#popup_info").css({
            left: mouseX,
            top: mouseY
        })
    }, function() {
        currentPopup.drop()
    });
    $("#b_shipyard_icon").mouseout(function() {
        $(document).on("mousemove", function() {})
    });
    $("#b_market_icon").click(function() {
        if (quests[questNames.pirates_4].done && "Merchant Republic" != game.chosenGovern)
            b = new w(220,0,"<span class='red_text red_text_shadow'>You have been banned from the market as a result of your allegiance to pirates</span>","info"),
            b.drawToast();
        else if (0 == currentPlanet.map)
            if (0 < currentPlanet.structure[buildingsName.tradehub].number)
                fa(currentPlanet);
            else {
                var b = new w(220,0,"<span class='white_text'>You must build at least one </span><span class='blue_text text_shadow'>Trade Hub</span>!","info");
                b.drawToast()
            }
        else
            b = new w(220,0,"<span class='red_text'>The trade hub is unable to contact a market in this map</span>!","info"),
            b.drawToast()
    });
    $("#b_market_icon").hover(function() {
        (new w(64,10,"<span class='blue_text' style='width:100%;text-align:center'>Market</span>","info")).drawInfo();
        $(document).on("mousemove", function(b) {
            mouseX = b.pageX + 16;
            mouseY = b.pageY + 10;
            $("#popup_info").css({
                left: mouseX,
                top: mouseY
            })
        });
        $("#popup_info").css({
            left: mouseX,
            top: mouseY
        })
    }, function() {
        currentPopup.drop()
    });
    $("#b_market_icon").mouseout(function() {
        $(document).on("mousemove", function() {})
    });
    $("#b_other_icon").click(function() {
        z("other", currentPlanet)
    });
    $("#b_other_icon").hover(function() {
        (new w(110,10,"<span class='blue_text' style='width:100%;text-align:center'>Other buildings</span>","info")).drawInfo();
        $(document).on("mousemove", function(b) {
            mouseX = b.pageX + 16;
            mouseY = b.pageY + 10;
            $("#popup_info").css({
                left: mouseX,
                top: mouseY
            })
        });
        $("#popup_info").css({
            left: mouseX,
            top: mouseY
        })
    }, function() {
        currentPopup.drop()
    });
    $("#b_other_icon").mouseout(function() {
        $(document).on("mousemove", function() {})
    });
    $("#b_res_icon").click(function() {
        z("research", currentPlanet)
    });
    $("#b_res_icon").hover(function() {
        (new w(142,10,"<span class='blue_text' style='width:100%;text-align:center'>Research buildings</span>","info")).drawInfo();
        $(document).on("mousemove", function(b) {
            mouseX = b.pageX + 16;
            mouseY = b.pageY + 10;
            $("#popup_info").css({
                left: mouseX,
                top: mouseY
            })
        });
        $("#popup_info").css({
            left: mouseX,
            top: mouseY
        })
    }, function() {
        currentPopup.drop()
    });
    $("#b_res_icon").mouseout(function() {
        $(document).on("mousemove", function() {})
    });
    $("#b_research_icon").click(P);
    $("#b_research_icon").hover(function() {
        (new w(96,10,"<span class='blue_text' style='width:100%;text-align:center'>Research</span>","info")).drawInfo();
        $(document).on("mousemove", function(b) {
            mouseX = b.pageX + 16;
            mouseY = b.pageY + 10;
            $("#popup_info").css({
                left: mouseX,
                top: mouseY
            })
        });
        $("#popup_info").css({
            left: mouseX,
            top: mouseY
        })
    }, function() {
        currentPopup.drop()
    });
    $("#b_research_icon").mouseout(function() {
        $(document).on("mousemove", function() {})
    });
    $("#b_diplomacy_icon").click(function() {
        R(-1)
    });
    h("b_diplomacy_icon", "<span class='blue_text' style='width:100%;text-align:center'>Diplomacy</span>", 80);
    (0 == game.timeTravelNum || 7 > game.researches[3].level && 0 == game.timeTravelNum) && $("#b_diplomacy_icon").hide();
    MOBILE_LANDSCAPE && (4 <= game.researches[3].level || 0 < game.timeTravelNum) && $("#b_diplomacy_icon").show();
    $("#b_tournament_icon").click(function() {
        M()
    });
    h("b_tournament_icon", "<span class='blue_text' style='width:100%;text-align:center'>Space Tournament</span>", 130);
    7 > game.researches[3].level && $("#b_tournament_icon").hide();
    $("#b_achievements_icon").click(function() {});
    $("#b_achievements_icon").hover(function() {
        (new w(120,10,"<span class='blue_text' style='width:100%;text-align:center'>Achievements</span>","info")).drawInfo();
        $(document).on("mousemove", function(b) {
            mouseX = b.pageX + 16;
            mouseY = b.pageY + 10;
            $("#popup_info").css({
                left: mouseX,
                top: mouseY
            })
        });
        $("#popup_info").css({
            left: mouseX,
            top: mouseY
        })
    }, function() {
        currentPopup.drop()
    });
    $("#b_achievements_icon").mouseout(function() {
        $(document).on("mousemove", function() {})
    });
    document.getElementById("l_info") && (document.getElementById("l_info").innerHTML = "Loading game...");
    $("#loading_bar").css("width", "100%");
    (function() {
        for (var b = !1, d = 0; d < ranks.length && !b; )
            ranks[d].requirement() ? game.playerRank = ranks[d] : b = !0,
            d++;
        $("#topbar_rank").attr("style", "font-family:'xolonium';color:#80c0ff;font-size:80%");
        document.getElementById("topbar_rank") && (document.getElementById("topbar_rank").innerHTML = "Player Name: ")
    }
    )();
    C(currentPlanet);
    u();
    A();
    autosave && (autosaveTimer = window.setInterval(function() {
        save();
        0 < userID && ta()
    }, autosaveTime));
    mainTimer = window.setInterval(F, parseInt(1E3 / fpsFleet));
    exportLoadResetInternal = g;
    exportLoadResetInternal2 = d;
    exportPlanetBuildingInterface = z;
    exportDiplomacyInterface = R;
    exportMapInterface = L;
    var ea = {
        axis: "y",
        theme: "minimal",
        scrollInertia: 0,
        autoHideScrollbar: !1
    };
    $("#building_list_container").mCustomScrollbar(ea);
    $("#shipyard_list_container").mCustomScrollbar(ea);
    $("#market_list_container").mCustomScrollbar(ea);
    $("#ship_list_container").mCustomScrollbar(ea);
    $("#planet_selection_interface").mCustomScrollbar(ea);
    $("#map_container").mCustomScrollbar({
        axis: "xy",
        theme: "minimal",
        scrollInertia: 0
    });
    $("#tech_container").mCustomScrollbar({
        axis: "xy",
        theme: "minimal",
        scrollInertia: 0
    });
    $("#research_interface").mCustomScrollbar(ea);
    $("#quest_interface").mCustomScrollbar(ea);
    $("#diplomacy_list_container").mCustomScrollbar(ea);
    $("#profile_interface").mCustomScrollbar(ea);
    $("#planet_info").mCustomScrollbar(ea);
    $("#planet_info2").mCustomScrollbar(ea);
    $("#planet_mini").mCustomScrollbar(ea);
    $("#building_info").mCustomScrollbar(ea);
    $("#shipyard_info").mCustomScrollbar(ea);
    $("#shipyard_mini").mCustomScrollbar(ea);
    $("#market_info").mCustomScrollbar(ea);
    $("#market_mini").mCustomScrollbar(ea);
    $("#diplomacy_mini").mCustomScrollbar(ea);
    $("#ship_info").mCustomScrollbar(ea);
    $("#ship_mini").mCustomScrollbar(ea);
    $("#popup_content").mCustomScrollbar(ea);
    $("#popup_container").hide();
    $("#popup_info").hide();
    $("#loading_screen").hide();
    $("body").on("mousewheel DOMMouseScroll", function(b) {
        var d = null;
        "mousewheel" === b.type ? d = -1 * b.originalEvent.wheelDelta : "DOMMouseScroll" === b.type && (d = 40 * b.originalEvent.detail);
        d && (b.preventDefault(),
        $(this).scrollTop(d + $(this).scrollTop()))
    });
    K();
    C(planets[game.planets[0]]);
    for (Z = 0; Z < planets.length; Z++)
        if (game.searchPlanet(Z))
            planets[Z].fleets.hub && planets[Z].fleets.hub.unload(Z);
        else if (U = new Fleet(game.id,"div - hub"),
        planets[Z].fleets.hub) {
            for (W = 0; W < ships.length; W++)
                U.ships[W] = planets[Z].fleets.hub.ships[W],
                planets[Z].fleets.hub.ships[W] = 0;
            if (0 < U.shipNum()) {
                for (W = 0; W < resNum; W++)
                    U.storage[W] = planets[Z].fleets.hub.storage[W] || 0,
                    planets[Z].fleets.hub.storage[W] = 0;
                planets[Z].fleetPush(U)
            }
        }
    0 < getAvailableTutorial() && showPopupIdleBonus();
    $("#tuto_popup_start").click(function() {
        currentInterface = "tutorialInterface";
        var b = "<div style='position:relative;left:16px'><br><span class='blue_text' style='float:left;margin-left:16px;font-size:120%;'>This is a little tutorial to help you start in Heart of Galaxy. These are only guidelines, so feel free to experiment yourself.</span><br><br><br><span class='blue_text' style='float:left;margin-left:16px;font-size:120%;'>First steps</span><br><br>" + ("<span class='white_text'>The first step in </span><span class='blue_text'>Heart of Galaxy</span><span class='white_text'> is to set up a steady resource income. The first resource you will ever need is </span><span class='blue_text'>Iron</span><span class='white_text'>, that can be extracted with </span><span class='blue_text'>Mining Plant</span><span class='white_text'>. You can find the </span><span class='blue_text'>Mining Plant</span><span class='white_text'> building in the extraction tab (pickaxe icon): </span><span class='blue_text' id='here_mining' style='cursor:pointer;'>here</span><span class='white_text'>. You have to click on the building in the list, and then the button " + G("Build") + " in the menu on the right.</span><br><br>");
        b += "<span class='white_text'>Once you have a good iron production (about 15-20/s), you should start to extract another important resource, </span><span class='blue_text'>Methane</span><span class='white_text'>, by building a </span><span class='blue_text'>Methane Extractor</span><span class='white_text'> in the Extraction tab (same of " + G("Mining Plants") + "). </span><span class='blue_text'>Methane</span><span class='white_text'> is needed to produce </span><span class='blue_text'>Fuel</span><span class='white_text'> which some buildings consume in order to work. Once you have built enough </span><span class='blue_text'>Methane Extractors</span><span class='white_text'>, you can build a " + G("Methane Processer") + " to convert " + G("Methane") + " into " + G("Fuel") + ". You can find this building in the production tab (factory icon): </span><span class='blue_text' style='cursor:pointer;' id='here_methane'>here</span><br><br>";
        b += "<span class='white_text'>It is the moment to start producing " + G("Steel") + ". It is produced in " + G("Foundry") + " and consumes " + G("Graphite") + ", " + G("Iron") + " and " + G("Fuel") + ". If you followed the previous steps, you should have already set up " + G("Iron") + " and " + G("Fuel") + " production. As you probably figured out, you just need to build a " + G("Graphite Extractor") + " to produce " + G("Graphite") + ". Once you have enough production of these basic resources, you can build a working " + G("Foundry") + ".</span><br><br>";
        b = b + "<span class='white_text'>As you probably noticed, some buildings have negative production. That means that buildings will consume those resources over time. If these resources are not provided, the building will not produce anything! When there is a shortage of a certain resource, you can shut down some buildings or dismantle it in order to balance the production rate and keeping it positive.</span><br><br><br><br><span class='blue_text' style='float:left;margin-left:16px;font-size:120%;'>Energy</span><br><br>" + ("<span class='white_text'>" + G("Energy") + " is a special resource. It doesn't work like " + G("Iron") + " or " + G("Steel") + " since it only has to be produced and isn't cumulable. " + G("Energy") + " usage is divided in " + G("Production") + " and " + G("Consumption") + ". Unlike other resource, if production exceeds consumption, energy won't be consumed, instead, all buildings requiring energy to function will get a production malus proportional to the ratio production/consumption. It means, if you consume 1000 " + G("Energy") + " and acqually produce 100, all buildings that require energy will produce only 10% of what they are capable of. </span><br><br>");
        b += "<span class='white_text'>" + G("Energy") + " is produced from fuel in the early game. All you need is to build a " + G("Small Generator") + " in the energy tab (atom icon). The generator will produce a little amount of energy sufficient to support only few buildings.</span><br><br>";
        b = b + "<br><br><span class='blue_text' style='float:left;margin-left:16px;font-size:120%;'>Researches</span><br><br>" + ("<span class='white_text'>To improve buildings efficiency, and to unlock new ones, you need to invest " + G("Research Points") + " in the research tab: </span><span class='blue_text' id='here_research' style='cursor:pointer;'>here</span><span class='white_text'>. To produce " + G("Research Points") + " you need " + G("Laboratories") + " which can be built in the other tab (three points icon): </span><span class='blue_text' id='here_other' style='cursor:pointer;'>here</span><span class='white_text'>. " + G("Laboratories") + " are expensive to build but are necessary to improve your production. Also, they need " + G("Energy") + " to function.</span><br><br>");
        b += "<span class='white_text'>You should start to research " + G("Geology") + " and " + G("Material Science") + " since they improve basic construction resource production such as " + G("Iron") + " and " + G("Steel") + ". When you will research " + G("Geology V") + " you will unlock the " + G("Metal Collector") + ", which can be buit in the extraction tab. This buildings needs energy to function and will extract " + G("Titanium") + " and " + G("Uranium") + " (uranium extraction could change!). " + G("Titanium") + " is a resource needed for construction of advanced buildings and space ships. " + G("Uranium") + " will be used in the middle game to produce a great amount of energy, and in the future will be used as fuel for ships. When you will research " + G("Material Science 8") + " you will unlock " + G("Plastic Factory") + " which can be used to produce " + G("Plastic") + "</span><br><br>";
        b += "<span class='white_text'>You can continue researching to unlocks important buildings. Another important research is " + G("Chemical Engineering") + " which unlock the " + G("Thermal Power Plant") + " and " + G("Oil") + " extraction which can be converted in fuel more efficiently than " + G("Methane") + " and is required to produce advanced resources such as " + G("Plastic") + "</span><br><br>";
        b = b + "<br><br><span class='blue_text' style='float:left;margin-left:16px;font-size:120%;'>Your first colony</span><br><br>" + ("<span class='white_text'>The purpose of " + G("Heart of Galaxy") + " is not only to produce resources but to use them to colonize and conquer other planets. When you feel ready, you can research " + G("Interstellar Travel") + " which gives you the ability to explore the galactic map. It also unlock the " + G("Shipyard") + " where you can build " + G("Space Ships") + ". In order to build a ship, just select it and click " + G("Build") + " in the menu on the right, just like a buiding. When you leave the shipyard, ships will be automatically grouped together in a new fleet that you can interact with in the fleet menu. You can merge fleets together, you can divide them and move them to a particular planet. You can also load resources into it and unload them later on another planet. All these actions can be done using the quick buttons next to the fleet name, or if you left-click on the fleet, you can scroll the menu on the right (with the infos about the fleet) to find the action buttons.</span><br><br>");
        b += "<span class='white_text'>There are three main categories of space ships: " + G("Colonial Ships") + ", " + G("Cargo Ships") + " and " + G("War Ships") + ". " + G("Colonial Ships") + ", for instance the ship " + G("Vitha") + ", are the only ones that can colonize a planet. Don't try to move a cargo ship to a planet without a colony ship, it will be useless, since only a fleet with at least one colony ships will have the action Colonize in the info menu. Colony ships will be destroyed upon colonization! Also, colony ships do not have any storage and are really slow. Note that the speed of the entire fleet will be the minimum speed of its components ships.</span><br><br>";
        b += "<span class='white_text'>Colonizing and conquering other planets is useful to obtain uncommon resources which can be extracted only on some particular planets. " + G("Sand") + " for example, can be extracted only from " + G("Aequoreas") + " and " + G("Desert planets") + ". " + G("Ice") + " can only be extracted on " + G("Icy planets") + " (such as " + G("Vasilis") + ") and " + G("Hydrogen") + " can only be extracted on " + G("Gas Giants") + " (will eventually be available refining water...). You can see in the planet interface which resources can be extracted from a particular planet. If there is no 'resource xNN', it means that resource can't be extracted. For example " + G("Vasilis") + " is missing " + G("Graphite") + ", " + G("Promision") + " is missing " + G("Ice") + " etc... Even if you already have a planet on which you can extract a particular resource, colonizing another planet can be worth since it gives another source of income, perhaps even more powerful.</span><br><br>";
        b += "</div>";
        document.getElementById("profile_info_list") && (document.getElementById("profile_info_list").innerHTML = b);
        $("#here_mining").unbind();
        $("#here_mining").click(function() {
            z("mining", planets[0])
        });
        $("#here_methane").unbind();
        $("#here_methane").click(function() {
            z("prod", planets[0])
        });
        $("#here_other").unbind();
        $("#here_other").click(function() {
            z("other", planets[0])
        });
        $("#here_research").unbind();
        $("#here_research").click(P);
        currentUpdater = function() {}
        ;
        K();
        $("#profile_interface").show()
    });
    MOBILE_LANDSCAPE && testAdsAvailable()
});
function printShipStats(b) {
    for (var e = "", d = 0; d < b; d++) {
        e += "\n\\" + ships[d].name + "\n";
        for (var g = 0, h = 0; h < ships[d].cost.length; h++)
            0 < ships[d].cost[h] && (g += e += resources[h].name + ": power " + ships[d].power / ships[d].cost[h] + ", armor " + ships[d].armor / ships[d].cost[h] + ", hp " + ships[d].hp / ships[d].cost[h] + " mc:" + beauty(ships[d].cost[h] * resourcesPrices[h]) + "\n")
    }
    console.log(e)
}
function speedTab() {
    for (var b = "", e = 0; 16 > e; e++) {
        var d = [1.2, 1.5, 2, 3, 5, 10, 50];
        b += "| " + ships[e].name + " | ";
        for (var g = 0; g < d.length; g++) {
            var h = 4.6 * d[g] / Math.log(ships[e].weight) - 2;
            b += " -" + Math.floor(100 - 50 * (1.1 - 2 * h / (1 + Math.abs(2 * h)) * .9)) + "% | "
        }
        b += "\n"
    }
    console.log(b)
}
function fleetCost(b) {
    for (var e = Array(resNum), d = 0; d < resNum; d++)
        e[d] = 0;
    for (d = 0; d < resNum; d++)
        for (var g = 0; g < ships.length; g++)
            e[d] += ships[g].cost[d] * b.ships[g];
    b = "";
    for (d = 0; d < resNum; d++)
        0 < e[d] && (b += resources[d].name + ": " + beauty(e[d]) + "\n");
    console.log(b)
}
function basePrices() {
    for (var b = Array(resNum), e = 0; e < resNum; e++)
        b[e] = 0;
    for (e = 0; e < game.planets.length; e++)
        for (var d = 0; d < resNum; d++)
            b[d] += planets[game.planets[e]].globalProd[d];
    d = b[0];
    for (e = 0; e < resNum; e++)
        0 < b[e] && b[e] > d && (d = b[e]);
    for (e = 0; e < resNum; e++)
        0 < b[e] && (b[e] = d / b[e]);
    d = Array(resNum);
    for (e = 0; e < resNum; e++)
        d[e] = {
            name: resources[e].name,
            price: b[e]
        };
    b = "[";
    for (e = 0; e < resNum - 1; e++)
        console.log(d[e].name + ": " + d[e].price),
        b += Math.floor(10 * d[e].price) / 100 + ",";
    b += Math.floor(10 * d[resNum - 1].price) / 100 + "]";
    console.log(b)
}
var plotFleets = function() {
    for (var b = [], e = [], d = [], g = [], h = 0, l = 0; l < planets.length; l++)
        planets[l].fleets[1] && (b[h] = {
            p: planets[l].fleets[1].power(),
            h: planets[l].fleets[1].hp(),
            a: planets[l].fleets[1].armor()
        },
        h++);
    b.sort(function(b, d) {
        return b.p < d.p ? -1 : b.p > d.p ? 1 : 0
    });
    e[0] = 1;
    d[0] = 1;
    for (l = g[0] = 1; l < h; l++)
        e[l] = b[l].p / b[l - 1].p,
        d[l] = b[l].h / b[l - 1].h,
        g[l] = b[l].a / b[l - 1].a;
    b = "power = [";
    for (l = 0; l < h - 1; l++)
        b += e[l] + ", ";
    b += e[h - 1] + "]; hp = [";
    for (l = 0; l < h - 1; l++)
        b += d[l] + ", ";
    b += d[h - 1] + "]; armor = [";
    for (l = 0; l < h - 1; l++)
        b += g[l] + ", ";
    b += g[h - 1] + "];";
    console.log(b)
}
  , prestigeArr = "[";
function ppp(b) {
    game.researches[researchesName.secret].level = 1;
    game.researches[researchesName.secret].bonus();
    game.researchPoint = Math.pow(b, game.timeTravelNum) * tri;
    planets[0].structure[buildingsName.space_machine].number = 1;
    planets[0].structure[buildingsName.time_machine].number = 1;
    for (b = 0; b < nebulas[0].planets.length; b++)
        game.pushPlanet(nebulas[0].planets[b]);
    prestigeArr += game.techPoints + ","
}
function simb(b, e) {
    document.getElementById("ship_list") && (document.getElementById("ship_list").innerHTML = b.battle(e, "true").r)
}
function viewFleetsStrength(b) {
    for (var e = [], d = 0, g = 0; g < planets.length; g++)
        planets[g].fleets[1] && (e[d] = {
            n: planets[g].name,
            v: planets[g].fleets[1].value(),
            raw: planets[g].fleets[1].rawValue(),
            pow: planets[g].fleets[1].power(),
            hp: planets[g].fleets[1].hp()
        },
        d++);
    for (d = 0; d < e.length - 1; d++) {
        g = d;
        for (var h = d + 1; h < e.length; h++)
            e[h].v < e[g].v && (g = h);
        h = e[g];
        e[g] = e[d];
        e[d] = h
    }
    if (!b)
        for (console.log(e[0].n + " " + e[0].v),
        h = 1; h < e.length; h++)
            console.log(e[h].n + " \t" + beauty(e[h].v) + " \t" + Math.pow(1.1, (e[h].v - e[h - 1].v) / 100).toFixed(2) + " \t" + beauty(e[h].v - e[h - 1].v) + " " + beauty(e[h].raw) + " " + beauty(e[h].pow) + " " + beauty(e[h].hp));
    return e
}
function resetTutorial() {
    for (var b = 0; b < tutorials.length; b++)
        tutorials[b].done = !1
}
function rankView() {
    for (var b = 0, e = 1, d = viewFleetsStrength(!0), g = 0; 1E4 > g; g++) {
        var h = Math.floor(Math.log(b + 1) / Math.log(2) + 1);
        if (h > e) {
            e = 1E16 * (1 + Math.pow(1.5, b));
            for (var l = "", u = 0; u < d.length; u++)
                e > d[u].raw && (l = d[u].n + "(x" + beauty(e / d[u].raw) + ")");
            console.log("Rank: " + h + " Points: " + b + " Strength: " + beauty(e) + " - " + l);
            e = h
        }
        b++
    }
}
function extractNames(b, e) {
    for (var d = "{", g = 0; g < b.length; g++)
        d += '"' + b[g][e].toLowerCase() + '":{\n\t\ten:"' + b[g][e].toLowerCase() + '"\n\t},\n\t';
    return d + "}"
}
;