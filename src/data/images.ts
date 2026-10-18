/**
 * Photography for the demo homepage.
 *
 * Unsplash hotlinks — every URL below was verified to return HTTP 200 with no
 * API key and no referer. They are stand-ins for real supplier photography;
 * replace this module with uploaded assets before launch.
 */

const u = (id: string, w: number, h?: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}${
    h ? `&h=${h}` : ""
  }&q=80`;

export const IMG = {
  heroCrane: u("photo-1575230167650-dce335edc7f4", 1600),
  heroWorker: u("photo-1614213951697-a45781262acf", 900),
  blueprint: u("photo-1731702981680-a38f38529d76", 900),
  warehouse: u("photo-1637241612956-b7309005288b", 900),

  cement: u("photo-1713668344666-b491113cf329", 900),
  rebar: u("photo-1763771420746-c75fefab51b5", 900),
  plywood: u("photo-1681752972950-6229ca099fbc", 900),
  hollowBlocks: u("photo-1777269390561-3528b8c2cfd4", 900),
  roofing: u("photo-1639129797888-13598d02775e", 900),
  tiles: u("photo-1774971295872-cededec9320b", 900),
  paint: u("photo-1560400692-3d860fd45eeb", 900),
  pvcPipe: u("photo-1737505599025-836fce14b071", 900),
  powerDrill: u("photo-1572981779307-38b8cabb2407", 900),
  scaffolding: u("photo-1636362556682-11231883c01c", 900),
  sandGravel: u("photo-1779775981174-475ffb8ecf83", 900),
  wiring: u("photo-1517373116369-9bdb8cdc9f62", 900),
  windows: u("photo-1564327481459-8bcd5561cf86", 900),
  excavator: u("photo-1580901369227-308f6f40bdeb", 900),
  welding: u("photo-1504328345606-18bbc8c9d7d1", 900),
  doorHardware: u("photo-1627252009027-16321aa0777e", 900),
  lumber: u("photo-1568023905551-0f6247c134f3", 900),
  hardHat: u("photo-1567954970774-58d6aa6c50dc", 900),
  safetyHarness: u("photo-1587582423116-ec07293f0395", 900),
  earmuffs: u("photo-1618090584176-7132b9911657", 900),

  avatars: [
    u("photo-1672748341520-6a839e6c05bb", 200, 200),
    u("photo-1646227655685-a530813759b3", 200, 200),
    u("photo-1679679811837-c28b2586f533", 200, 200),
    u("photo-1543357644-160b53c087e8", 200, 200),
    u("photo-1742844019488-12a9356a7ace", 200, 200),
    u("photo-1688841747582-41097036109d", 200, 200),
  ],
} as const;
