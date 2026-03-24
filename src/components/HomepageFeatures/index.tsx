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
    title: 'Fully standlone, sovereign and scalable infrastructure',
    Svg: require("@site/static/img/logo.svg").default,
    description: (
      <>
        Drumee OS is a meta operating system designed to run web applications like
        MacOs to rune programs.
      </>
    ),
  },
  {
    title: 'Ready to use Docker Image, deployable in minutes',
    Svg: require('@site/static/img/docker.svg').default,
    description: (
      <>
        A few lines of settings and you Drumee OS is ready to use. Also available on 
        bare metal with Debian.
      </>
    ),
  },
  {
    title: 'Add tailored plugins to meet your own requirements',
    Svg: require('@site/static/img/plugin.svg').default,
    description: (
      <>
        No need to develop boilerplates like Identities managements or
        be extended while reusing the same header and footer.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
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
