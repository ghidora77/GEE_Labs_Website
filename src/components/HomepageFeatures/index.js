import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Comprehensive Workflow Coverage',
    Svg: require('@site/static/img/icon_tractor.svg').default,
    description: (
      <>
        Tutorials provide an end-to-end guide through the entire remote sensing workflow, ensuring you grasp each step from data acquisition to analysis.
      </>
    ),
  },
  {
    title: 'In-Depth Tutorials',
    Svg: require('@site/static/img/icon_earth.svg').default,
    description: (
      <>
        Dive deep into the functionalities of Google Earth Engine with tutorials that offer detailed explanations and insights, making complex concepts accessible.
      </>
    ),
  },
  {
    title: 'Hands-On Learning',
    Svg: require('@site/static/img/icon_satellite.svg').default,
    description: (
      <>
        Engage with practical examples and hands-on exercises designed to reinforce learning and apply theoretical knowledge to real-world scenarios.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
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

export default function HomepageFeatures() {
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
