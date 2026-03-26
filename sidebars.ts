import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docs: [
    "intro",
    {
      type: "category",
      label: "Getting Started",
      link: {
        type: "generated-index",
        title: "Getting Started with Drumee",
        description:
          "Learn how to install, configure, and deploy Drumee in minutes.",
        slug: "/getting-started",
      },
      items: [
        "getting-started/starter-kit",
        "getting-started/own-cloud",
        "getting-started/playground",
        "getting-started/plugins",
      ],
    },
    {
      type: "category",
      label: "Core Concepts",
      link: {
        type: "generated-index",
        title: "Drumee Core Concepts",
        description:
          "Understand the fundamental concepts behind Drumee Meta OS.",
        slug: "/concepts",
      },
      items: [
        "concepts/overview",
        "concepts/acl-system",
        "concepts/mfs",
        "concepts/letc-engine",
        "concepts/widgets",
      ],
    },
    {
      type: "category",
      label: "Guides",
      link: {
        type: "generated-index",
        title: "Step-by-Step Guides",
        description: "Practical guides for building with Drumee.",
        slug: "/guides",
      },
      items: [
        "guides/creating-widget",
        "guides/creating-service",
        "guides/permission-management",
        "guides/real-example-erp",
      ],
    },
    {
      type: "category",
      label: "SDK Reference",
      link: {
        type: "generated-index",
        title: "SDK Reference",
        description: "Complete API documentation for Drumee components.",
        slug: "/api-reference",
      },
      items: [
        {
          type: "category",
          label: "Backend SDK",
          link: {
            type: "doc",
            id: "api-reference/backend-sdk/index",
          },
          items: [
            {
              type: "category",
              label: "Core",
              items: [
                "api-reference/backend-sdk/mfs",
                "api-reference/backend-sdk/media",
                "api-reference/backend-sdk/desk",
                "api-reference/backend-sdk/hub",
                "api-reference/backend-sdk/mfs_api",
                "api-reference/backend-sdk/mfs_import",
                "api-reference/backend-sdk/video",
                "api-reference/backend-sdk/transfer",
                "api-reference/backend-sdk/trash",
                "api-reference/backend-sdk/sharebox",
                "api-reference/backend-sdk/util",
              ],
            },
            {
              type: "category",
              label: "User & Identity",
              items: [
                "api-reference/backend-sdk/drumate",
                "api-reference/backend-sdk/authn",
                "api-reference/backend-sdk/yp",
                "api-reference/backend-sdk/otp",
                "api-reference/backend-sdk/seo",
              ],
            },
            {
              type: "category",
              label: "Contacts & Tags",
              items: [
                "api-reference/backend-sdk/contact",
                "api-reference/backend-sdk/tagcontact",
                "api-reference/backend-sdk/tag",
                "api-reference/backend-sdk/blacklist",
                "api-reference/backend-sdk/block",
              ],
            },
            {
              type: "category",
              label: "Collaboration",
              items: [
                "api-reference/backend-sdk/chat",
                "api-reference/backend-sdk/channel",
                "api-reference/backend-sdk/conference",
                "api-reference/backend-sdk/room",
                "api-reference/backend-sdk/signaling",
                "api-reference/backend-sdk/activity",
              ],
            },
            {
              type: "category",
              label: "Import & Export",
              items: [
                "api-reference/backend-sdk/dropbox",
                "api-reference/backend-sdk/google_drive",
                "api-reference/backend-sdk/exchange",
                "api-reference/backend-sdk/dmz",
              ],
            },
            {
              type: "category",
              label: "Administration",
              items: [
                "api-reference/backend-sdk/admin",
                "api-reference/backend-sdk/adminpanel",
                "api-reference/backend-sdk/permission",
                "api-reference/backend-sdk/subscription",
                "api-reference/backend-sdk/bootstrap",
              ],
            },
            {
              type: "category",
              label: "Platform & System",
              items: [
                "api-reference/backend-sdk/butler",
                "api-reference/backend-sdk/notification",
                "api-reference/backend-sdk/reminder",
                "api-reference/backend-sdk/support",
                "api-reference/backend-sdk/log",
                "api-reference/backend-sdk/changelog",
                "api-reference/backend-sdk/callback",
                "api-reference/backend-sdk/form",
                "api-reference/backend-sdk/input",
                "api-reference/backend-sdk/locale",
                "api-reference/backend-sdk/font",
                "api-reference/backend-sdk/table",
              ],
            },
            {
              type: "category",
              label: "Developer Tools",
              items: [
                "api-reference/backend-sdk/devel",
                "api-reference/backend-sdk/wicket",
                "api-reference/backend-sdk/menu",
                "api-reference/backend-sdk/ops",
                "api-reference/backend-sdk/ws",
              ],
            },
          ],
        },
        {
          type: "category",
          label: "Frontend SDK",
          link: {
            type: "doc",
            id: "api-reference/frontend-sdk/index",
          },
          items: [
            {
              type: "category",
              label: "Core",
              items: [
                "api-reference/frontend-sdk/core/append",
                "api-reference/frontend-sdk/core/prepend",
                "api-reference/frontend-sdk/core/feed",
                "api-reference/frontend-sdk/core/postService",
                "api-reference/frontend-sdk/core/fetchService",
                "api-reference/frontend-sdk/core/onDomRefresh",
              ],
            },
            {
              type: "category",
              label: "mfs",
              items: [
                "api-reference/frontend-sdk/mfs/initialization",
                "api-reference/frontend-sdk/mfs/sendMedia",
                "api-reference/frontend-sdk/mfs/fetchFile",
                "api-reference/frontend-sdk/mfs/metadata",
                "api-reference/frontend-sdk/mfs/linkGeneration",
                "api-reference/frontend-sdk/mfs/node",
                "api-reference/frontend-sdk/mfs/mediaState",
                "api-reference/frontend-sdk/mfs/permission",
              ],
            },
            {
              type: "category",
              label: "Builtins",
              items: [
                "api-reference/frontend-sdk/builtins/editor",
                "api-reference/frontend-sdk/builtins/media",
                "api-reference/frontend-sdk/builtins/player",
                "api-reference/frontend-sdk/builtins/webrtc",
                "api-reference/frontend-sdk/builtins/window",
              ],
            },
            {
              type: "category",
              label: "Skeleton Structure",
              items: [
                "api-reference/frontend-sdk/skeleton-structure/serviceAndonUIEvent",
                "api-reference/frontend-sdk/skeleton-structure/uihandlerServiceonUIEvent",
                "api-reference/frontend-sdk/skeleton-structure/partHandlersyspnOnpartready",
              ],
            },
            {
              type: "category",
              label: "Socket",
              items: [
                "api-reference/frontend-sdk/socket/request",
                "api-reference/frontend-sdk/socket/utils",
                "api-reference/frontend-sdk/socket/upload",
              ],
            },
            {
              type: "category",
              label: "Skeletons",
              items: [
                "api-reference/frontend-sdk/skeletons/avatar",
                "api-reference/frontend-sdk/skeletons/box",
                "api-reference/frontend-sdk/skeletons/button",
                "api-reference/frontend-sdk/skeletons/element",
                "api-reference/frontend-sdk/skeletons/fileSelector",
                "api-reference/frontend-sdk/skeletons/entry",
                "api-reference/frontend-sdk/skeletons/entryBox",
                "api-reference/frontend-sdk/skeletons/image",
                "api-reference/frontend-sdk/skeletons/list",
                "api-reference/frontend-sdk/skeletons/messenger",
                "api-reference/frontend-sdk/skeletons/note",
                "api-reference/frontend-sdk/skeletons/profile",
                "api-reference/frontend-sdk/skeletons/progress",
                "api-reference/frontend-sdk/skeletons/richText",
                "api-reference/frontend-sdk/skeletons/textarea",
                "api-reference/frontend-sdk/skeletons/userProfile",
                "api-reference/frontend-sdk/skeletons/wrapper",
              ],
            },
          ],
        },
        "api-reference/stored-procedures",
        "api-reference/acl-spec",
      ],
    },
    {
      type: "category",
      label: "Resources",
      items: [
        "resources/glossary",
        "resources/faq",
        "resources/troubleshooting",
      ],
    },
  ],
};

export default sidebars;
