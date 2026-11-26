import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  imageSrc: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Drumee is the world's first unified workspace",
    imageSrc: require('@site/static/img/logo.png').default,
    description: (
      <>
        <p>It connects seamless collaboration, sovereignty, and security in one platform. We don't just store your data - we activate it. Files, chat, and tasks become one living system, under your control, extensible to your needs.</p>
        <p><b>Your data. Your workflow. One system.</b></p>
      </>
    ),
  },
];

function Feature({title, imageSrc, description}: FeatureItem) {
  return (
    <div className={clsx('col')}>
      <div className="text--center">
        <img className={styles.featureImage} src={imageSrc} alt="Drumee logo" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <div>{description}</div>
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
