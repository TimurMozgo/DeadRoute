# Dead Route

A portrait-mode zombie survival game by **TINELLAB**. In-game text is currently in Russian.

Explore five districts, rescue survivors, prepare a fortified checkpoint, survive the final siege and escape by truck.

## Play locally

Serve `docs/` with any static HTTP server, for example:

```sh
python -m http.server 4173 --directory docs
```

Open http://localhost:4173/ and press the start button to enable audio.

## Controls

- Mobile: movement joystick, reload, interaction and grenade buttons.
- Desktop: WASD / arrow keys; R reload; E interact; G grenade; Q switch weapon.
- Shooting is automatic when a valid target is in range.

## GitHub Pages

In Settings → Pages, select **Deploy from a branch**, branch **main**, folder **/docs**.
All asset paths are relative, so the game supports a project URL ending in `/dead-route/`.

Scene previews: `?level=5`, `?scene=shelter`, `?scene=panic`.

## Credits

Game development: **TINELLAB**.
Character and environment sprites: CraftPix Urban Zombie Survival Pixel Art Minigame Kit.
Audio: user-supplied recordings, including files credited in their source names to Dragon Studio, SoundReality, Freesound Community, l3hrja and other creators. These assets retain their respective rights; this repository does not grant a separate license to reuse third-party assets.

Version: 0.16.4. Mobile performance and the final published build still need device testing.
