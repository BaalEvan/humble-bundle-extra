import { sanitize, xtmlHttp } from "./utils"

const CACHE_STEAM_APPS_KEY = "&&hh_extras&&"
const CACHE_OWNED_APPS_KEY = "&&hh_extras_owned&&"

const fetchSteamApps = async () => {
  const r = await xtmlHttp({
    url: "https://api.steampowered.com/ISteamApps/GetAppList/v0002/?format=json",
    method: "GET",
  })
  const { applist } = JSON.parse(r.responseText)
  const apps = {}
  applist?.apps?.forEach(({ name, appid }) => {
    apps[sanitize(name)] = appid
  })
  return apps
}

/**
 * Fetch steam apps from store or cache
 * @param {boolean} force
 * @returns {Promise<Object>}
 */
export const cacheSteamApps = async (force) => {
  let data = {}
  if (force) {
    data = await fetchSteamApps()
    localStorage.setItem(CACHE_STEAM_APPS_KEY, JSON.stringify(data))
  } else {
    if ((data = localStorage.getItem(CACHE_STEAM_APPS_KEY))) {
      data = JSON.parse(data)
    } else {
      data = await fetchSteamApps()
      localStorage.setItem(CACHE_STEAM_APPS_KEY, JSON.stringify(data))
    }
  }

  return data
}

const fetchOwnedApps = async () => {
  const r = await xtmlHttp({
    url: "https://store.steampowered.com/dynamicstore/userdata/",
    method: "GET",
  })

  const { rgOwnedApps } = JSON.parse(r.responseText)
  return rgOwnedApps
}

/**
 * Fetch owned apps from store or cache
 * @param {boolean} force
 * @returns {Promise<Array>}
 */
export const cacheOwnedApps = async (force) => {
  let data = []
  if (force) {
    data = await fetchOwnedApps()
    localStorage.setItem(CACHE_OWNED_APPS_KEY, JSON.stringify(data))
  } else {
    if ((data = localStorage.getItem(CACHE_OWNED_APPS_KEY))) {
      data = JSON.parse(data)
    } else {
      data = await fetchOwnedApps()
      localStorage.setItem(CACHE_OWNED_APPS_KEY, JSON.stringify(data))
    }
  }

  return data
}
