import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Drumee is a sovereign data infrastructure',
    Svg: require("@site/static/img/logo.svg").default,
    description: (
      <>
        <p>It is not a cloud storage tool. It is not a SaaS collaboration app. It is an OS-like system that transforms a file system into a collaborative, extensible workspace - one that you fully own and control.</p>
        <p><b>One sentence:</b> Drumee is a self-hosted, OS-like platform that turns a file system into a collaborative workspace - with full data sovereignty built in at the infrastructure level.</p>
      </>
    ),
  },
  // {
  //   title: 'Ready to use Docker Image, deployable in minutes',
  //   Svg: require('@site/static/img/docker.svg').default,
  //   description: (
  //     <>
  //       A few lines of settings and you Drumee OS is ready to use. Also available on 
  //       bare metal with Debian.
  //     </>
  //   ),
  // },
  // {
  //   title: 'Add tailored plugins to meet your own requirements',
  //   Svg: require('@site/static/img/plugin.svg').default,
  //   description: (
  //     <>
  //       No need to develop boilerplates like Identities managements or
  //       be extended while reusing the same header and footer.
  //     </>
  //   ),
  // },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
