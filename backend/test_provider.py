import asyncio

from app.race.providers.fastf1 import FastF1Provider


async def main():

    provider = FastF1Provider()

    session = await provider.get_session(
        2026,
        "Belgium",
        "R"
    )

    print(session.event["EventName"])
    print(session.drivers)


asyncio.run(main())