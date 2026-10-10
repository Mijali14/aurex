import { ImageResponse } from "next/og.js";
import { createElement as h } from "react";
import { readFile, writeFile } from "node:fs/promises";

const font = await readFile(new URL("../node_modules/geist/dist/fonts/geist-sans/Geist-Regular.ttf", import.meta.url));
const image = new ImageResponse(h("div", { style: { width: "100%", height: "100%", background: "#0b0d10", color: "#f3f5f7", display: "flex", flexDirection: "column", padding: "76px 84px", fontFamily: "Geist" } },
  h("div", { style: { display: "flex", alignItems: "baseline", fontSize: 42, letterSpacing: "5px" } }, "AUREX", h("span", { style: { width: 7, height: 7, marginLeft: 8, background: "#60a5fa" } })),
  h("div", { style: { display: "flex", flexDirection: "column", fontSize: 70, lineHeight: 1.1, letterSpacing: "-3px", marginTop: 88 } }, h("span", null, "AI Sales Agent"), h("span", { style: { color: "#b9c3d1" } }, "for your website.")),
  h("div", { style: { display: "flex", color: "#a3adbc", fontSize: 24, marginTop: "auto", borderTop: "1px solid #29313d", paddingTop: 28 } }, "Conversation → Evidence → Opportunity")
), { width: 1200, height: 630, fonts: [{ name: "Geist", data: font, weight: 400, style: "normal" }] });
await writeFile(new URL("../public/og.png", import.meta.url), Buffer.from(await image.arrayBuffer()));
