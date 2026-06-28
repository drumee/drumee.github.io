import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: "category",
      label: "Introduction",
      link: {
        type: "generated-index",
        title: "Introduction",
        description:
          "Learn how to install, configure, and deploy Drumee in minutes.",
        slug: "/introduction",
      },
      items: [
        "introduction/01-what-is-drumee",
        "introduction/02-the-problem",
        "introduction/03-the-answer",
        "introduction/04-positioning",
        "introduction/05-for-whom",
        "introduction/06-our-history",
        "introduction/07-why-drumee",
        "introduction/08-the-stack",
        "introduction/09-roadmap",
      ],
    },
    {
      type: "category",
      label: "Technology",
      link: {
        type: "generated-index",
        title: "Technology Overview",
        description:
          "Learn about the technology behind Drumee.",
        slug: "/technology",
      },
      items: [
        "technology/01-overview",
        "technology/02-acl-system",
        "technology/03-mfs-architecture",
        "technology/04-letc-engine",
        "technology/05-widget-concept",
        "technology/06-request-pipeline",
        "technology/07-database-sharding",
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
                    "api-reference/backend-sdk/secure_share",
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
                    "api-reference/backend-sdk/label",
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
                    "api-reference/backend-sdk/task",
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
              ],
            },
            "api-reference/stored-procedures",
            "api-reference/acl-spec",
          ],
        },
      ],
    },
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
        "getting-started/01-starter-kit",
        "getting-started/02-own-cloud",
        "getting-started/03-playground",
        "getting-started/04-plugins",
      ],
    },
    // {
    //   type: "category",
    //   label: "Core Concepts",
    //   link: {
    //     type: "generated-index",
    //     title: "Drumee Core Concepts",
    //     description:
    //       "Understand the fundamental concepts behind Drumee Meta OS.",
    //     slug: "/concepts",
    //   },
    //   items: [
    //     "concepts/overview",
    //     "concepts/acl-system",
    //     "concepts/mfs",
    //     "concepts/letc-engine",
    //     "concepts/fig-styling",
    //   ],
    // },
    {
      type: "category",
      label: "Product Guide",
      link: {
        type: "generated-index",
        title: "Step-by-Step Guides",
        description: "Practical guides for building with Drumee.",
        slug: "/product-guides",
      },
      items: [
        "product-guides/01-creating-widget",
        "product-guides/02-creating-service",
        "product-guides/03-permission-management",
        "product-guides/04-acl-permissions",
        "product-guides/05-error-handling",
      ],
    },
    {
      type: "category",
      label: "Self-Hosting",
      link: {
        type: "generated-index",
        title: "Self-Hosting Drumee",
        description:
          "Run your own Drumee server — install with the Docker Compose stack or native Debian/Ubuntu packages, then operate it (TLS, email, backups, upgrades).",
        slug: "/self-hosting",
      },
      items: [
        "self-hosting/01-overview",
        "self-hosting/02-docker-compose",
        "self-hosting/03-debian-native",
        "self-hosting/04-operations",
        "self-hosting/05-plugins",
      ],
    },
    {
      type: "category",
      label: "Package Building",
      link: {
        type: "generated-index",
        title: "Building Drumee Packages",
        description:
          "How to build, version, and deploy the Drumee Debian packages from the drumee/debian repository.",
        slug: "/package-building",
      },
      items: [
        "package-building/01-overview",
        "package-building/02-build-pipeline",
        {
          type: "category",
          label: "Packages",
          items: [
            "package-building/03-package-infra",
            "package-building/04-package-schemas",
            "package-building/05-package-server",
            "package-building/06-package-ui",
            "package-building/07-package-static",
            "package-building/08-package-schemas-patch",
            "package-building/09-package-builder",
          ],
        },
        "package-building/10-utilities",
        "package-building/11-version-management",
        "package-building/12-deployment",
      ],
    },
    {
      type: "category",
      label: "Resources",
      items: [
        "resources/01-glossary",
        "resources/02-faq",
        "resources/03-troubleshooting",
      ],
    },
  ],
};

export default sidebars;
