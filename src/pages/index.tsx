import type { ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Heading from "@theme/Heading";

import styles from "./index.module.css";
import {
  Building2,
  RefreshCw,
  Bug,
  Clock,
  Rocket,
  Plug,
  Shield,
  Zap,
  X,
  Check,
  Lightbulb,
  CheckCircle2,
  XCircle,
} from "lucide-react";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="intro"
          >
            Drumee Documentation
          </Link>
        </div>
      </div>
    </header>
  );
}

function ProblemSolution() {
  return (
    <section className={styles.problemSolution}>
      <div className="container">
        <div className={styles.comparisonGrid}>
          <div className={styles.traditionalApproach}>
            <Heading as="h3" className={styles.comparisonTitle}>
              <XCircle
                className={styles.titleIcon}
                size={28}
                strokeWidth={1.75}
              />
              Traditional Setup
            </Heading>
            <div className={styles.comparisonContent}>
              <div className={styles.comparisonItem}>
                <Building2
                  className={clsx(styles.comparisonIcon, styles.iconBuild)}
                  size={20}
                  strokeWidth={1.75}
                />
                <span>Build everything from scratch</span>
              </div>
              <div className={styles.comparisonItem}>
                <RefreshCw
                  className={clsx(styles.comparisonIcon, styles.iconReinvent)}
                  size={20}
                  strokeWidth={1.75}
                />
                <span>Re-invent user management, authentication</span>
              </div>
              <div className={styles.comparisonItem}>
                <Bug
                  className={clsx(styles.comparisonIcon, styles.iconSecurity)}
                  size={20}
                  strokeWidth={1.75}
                />
                <span>Fix security vulnerabilities yourself</span>
              </div>
              <div className={styles.comparisonItem}>
                <Clock
                  className={clsx(styles.comparisonIcon, styles.iconTime)}
                  size={20}
                  strokeWidth={1.75}
                />
                <span>Months of development before first feature</span>
              </div>
            </div>
          </div>

          <div className={styles.drumeeApproach}>
            <Heading as="h3" className={styles.comparisonTitle}>
              <CheckCircle2
                className={styles.titleIcon}
                size={28}
                strokeWidth={1.75}
              />
              Drumee Approach
            </Heading>
            <div className={styles.comparisonContent}>
              <div className={styles.comparisonItem}>
                <Rocket
                  className={clsx(styles.comparisonIcon, styles.iconRocket)}
                  size={20}
                  strokeWidth={1.75}
                />
                <span>Start with ready-made OS foundation</span>
              </div>
              <div className={styles.comparisonItem}>
                <Plug
                  className={clsx(styles.comparisonIcon, styles.iconPlugin)}
                  size={20}
                  strokeWidth={1.75}
                />
                <span>Build only plugins for your unique needs</span>
              </div>
              <div className={styles.comparisonItem}>
                <Shield
                  className={clsx(styles.comparisonIcon, styles.iconShield)}
                  size={20}
                  strokeWidth={1.75}
                />
                <span>Built-in security & identity management</span>
              </div>
              <div className={styles.comparisonItem}>
                <Zap
                  className={clsx(styles.comparisonIcon, styles.iconZap)}
                  size={20}
                  strokeWidth={1.75}
                />
                <span>Days to deploy, not months</span>
              </div>
            </div>
          </div>
        </div>

        {/* 30-second use case summary */}
        <div className={styles.useCaseCard}>
          <div className={styles.useCaseHeader}>
            <Lightbulb
              className={styles.useCaseIcon}
              size={32}
              strokeWidth={1.5}
            />
            <Heading as="h3" className={styles.useCaseTitle}>
              Real-World Use Case
            </Heading>
          </div>
          <p className={styles.useCaseText}>
            <strong>A company needs a custom HR portal:</strong> Instead of
            building authentication, file storage, user roles, and UI framework
            from scratch, they deploy Drumee OS in minutes and develop only the
            HR-specific plugins — saving 80% of development time.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <ProblemSolution />
      </main>
    </Layout>
  );
}
