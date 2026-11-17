import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

// Items marked `coming-soon` render a "Soon" pill after their label (src/css/custom.css).
const comingSoon = "coming-soon";

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: "category",
      label: "Introduction",
      link: {
        type: "generated-index",
        title: "Introduction",
        description:
          "What Drumee is, the problem it solves, who it is for, and where it is going.",
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
        {
          type: "category",
          label: "Drumee Onboarding Guide",
          link: {
            type: "generated-index",
            title: "Drumee Onboarding Guide",
            description:
              "A visual guide to Drumee's core components and getting started.",
            slug: "/introduction/tutorial",
          },
          items: [
            "product-tutorial/01-component-definition",
            "product-tutorial/02-getting-started-introduction",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Technology",
      link: {
        type: "generated-index",
        title: "Technology",
        description:
          "How the Drumee platform is built: access control, file storage, the request pipeline, and how data is stored and protected.",
        slug: "/technology",
      },
      items: [
        "technology/01-overview",
        "technology/02-rbac-system",
        "technology/03-file-storage",
        "technology/04-request-pipeline",
        "technology/05-data-storage-encryption",
        "technology/06-directory-schema",
        {
          type: "doc",
          id: "technology/sdk-reference",
          label: "SDK Reference",
          className: comingSoon,
        },
      ],
    },
    {
      type: "doc",
      id: "getting-started/getting-started",
      label: "Getting Started",
      className: comingSoon,
    },
    {
      type: "doc",
      id: "product-guides/product-guides",
      label: "Product Guide",
      className: comingSoon,
    },
    {
      type: "doc",
      id: "self-hosting/self-hosting",
      label: "Self-Hosting",
      className: comingSoon,
    },
    {
      type: "doc",
      id: "package-building/package-building",
      label: "Package Guidelines",
      className: comingSoon,
    },
    {
      type: "category",
      label: "Resources",
      items: ["resources/01-glossary", "resources/02-faq"],
    },
  ],
};

export default sidebars;
