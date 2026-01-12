// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";
import { server } from "typescript";

// https://astro.build/config
export default defineConfig({
  base: "/zingiq/doc/",
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    assets: "assets",
  },
  integrations: [
    starlight({
      title: "ZingIQ",
      favicon: "./public/favicon.ico",
      customCss: ["./src/styles/global.css"],
      logo: {
        src: "./public/zing-logo.png",
        alt: "ZingIQ",
      },
      head: [
        {
          tag: "meta",
          attrs: {
            property: "og:title",
            content: "ZingIQ Documentation",
          },
        },
        {
          tag: "meta",
          attrs: {
            property: "og:description",
            content: "Business intelligence platform for small businesses.",
          },
        },
        {
          tag: "meta",
          attrs: {
            property: "og:type",
            content: "website",
          },
        },
        {
          tag: "meta",
          attrs: {
            property: "og:url",
            content: "https://www.zing.work/zingiq/doc",
          },
        },
      ],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://www.zing.work",
        },
      ],
      sidebar: [
        {
          label: "Getting Started",
          link: "/",
        },
        {
          label: "Users Documentation",
          items: [
            "users/user-management",
            "users/import-contacts",
            "users/merging-contacts",
            "users/inbound-email",
            "users/mcp-server",
          ],
        },
        {
          label: "Developers Documentation",
          autogenerate: { directory: "developers" },
        },
      ],
    }),
  ],
});
