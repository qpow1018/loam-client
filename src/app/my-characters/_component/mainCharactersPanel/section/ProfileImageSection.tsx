import styles from './profileImageSection.module.scss';

export default function ProfileImageSection(props: { imageUrl: string | null }) {
  return (
    <section className={styles['profile-image-section']}>
      {props.imageUrl && <img src={props.imageUrl} alt="" />}
    </section>
  );
}
