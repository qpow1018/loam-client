import styles from "./loadoClient.module.scss";

export default function LoadoClient() {
  return (
    <div className={styles["container"]}>
      <h1 className={styles["title"]}>LoadoClient 테스트</h1>
      <p className={styles["message"]}>
        _variables.scss 의 변수가 자동 import 되는지 확인합니다.
      </p>
    </div>
  );
}
