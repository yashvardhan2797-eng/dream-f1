import fastf1

fastf1.Cache.enable_cache("cache")

print("Loading session...")

session = fastf1.get_session(2026, "Belgium", "R")

session.load()

print("Event:", session.event["EventName"])

print("Circuit:", session.event["Location"])

print("Drivers:")

print(session.drivers)