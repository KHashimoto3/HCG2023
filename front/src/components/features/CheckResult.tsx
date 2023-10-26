import { CheckMissResult } from "../../types/checkMissResult";
import { ErrorResolve } from "../../types/errorResolve";

type Props = {
  errorResolveList: ErrorResolve[];
  foundMissList: CheckMissResult[];
};

export const CheckResult = (props: Props) => {
  const { errorResolveList } = props;
  const { foundMissList } = props;
  if (errorResolveList.length === 0 && foundMissList.length === 0) {
    return <p>おめでとうございます。問題は見つかりませんでした。</p>;
  } else {
    return (
      <>
        {errorResolveList.map((errorResolve, index) => (
          <>
            <div key={index}>
              <p>必ず修正！</p>
              <p>
                {errorResolve.row}行目 {errorResolve.column}文字目
              </p>
              <p>{errorResolve.description}</p>
              <p>{errorResolve.error}</p>
              <p>{errorResolve.method}</p>
              <hr />
            </div>
          </>
        ))}
        {foundMissList.map((foundMiss, index) => (
          <>
            <div key={index}>
              <p>確認</p>
              <p>
                {foundMiss.row}行目 {foundMiss.column}文字目
              </p>
              <p>{foundMiss.description}</p>
              <hr />
            </div>
          </>
        ))}
      </>
    );
  }
};
